import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from './NetworkContext';

export interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retries: number;
  maxRetries?: number;
}

interface OfflineQueueContextType {
  queue: QueuedAction[];
  addToQueue: (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  isProcessing: boolean;
}

const OfflineQueueContext = createContext<OfflineQueueContextType | undefined>(undefined);

export const useOfflineQueue = () => {
  const context = useContext(OfflineQueueContext);
  if (!context) {
    throw new Error('useOfflineQueue must be used within an OfflineQueueProvider');
  }
  return context;
};

// Action handlers - these will be implemented in the respective contexts
export type ActionHandler = (action: QueuedAction) => Promise<boolean>;

interface OfflineQueueProviderProps {
  children: ReactNode;
  actionHandlers: Record<string, ActionHandler>;
}

const STORAGE_KEY = 'ruknapp_offline_queue';

export const OfflineQueueProvider: React.FC<OfflineQueueProviderProps> = ({ 
  children, 
  actionHandlers 
}) => {
  const [queue, setQueue] = useState<QueuedAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { networkState } = useNetwork();

  // Load queue from storage on mount
  useEffect(() => {
    const loadQueue = async () => {
      try {
        const storedQueue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedQueue) {
          setQueue(JSON.parse(storedQueue));
        }
      } catch (error) {
        console.error('Error loading offline queue:', error);
      }
    };

    loadQueue();
  }, []);

  // Save queue to storage whenever it changes
  useEffect(() => {
    const saveQueue = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
      } catch (error) {
        console.error('Error saving offline queue:', error);
      }
    };

    saveQueue();
  }, [queue]);

  // Process queue when network becomes available
  useEffect(() => {
    if (networkState.isInternetReachable && queue.length > 0 && !isProcessing) {
      processQueue();
    }
  }, [networkState.isInternetReachable, queue.length, isProcessing]);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);
    const currentQueue = [...queue];
    const successfulActions: string[] = [];
    const failedActions: QueuedAction[] = [];

    for (const action of currentQueue) {
      const handler = actionHandlers[action.type];
      if (!handler) {
        console.warn(`No handler found for action type: ${action.type}`);
        failedActions.push(action);
        continue;
      }

      try {
        const success = await handler(action);
        if (success) {
          successfulActions.push(action.id);
        } else {
          // Check if we should retry
          const shouldRetry = action.retries < (action.maxRetries || 3);
          if (shouldRetry) {
            failedActions.push({
              ...action,
              retries: action.retries + 1
            });
          } else {
            console.warn(`Action ${action.id} failed after ${action.retries} retries`);
          }
        }
      } catch (error) {
        console.error(`Error processing action ${action.id}:`, error);
        const shouldRetry = action.retries < (action.maxRetries || 3);
        if (shouldRetry) {
          failedActions.push({
            ...action,
            retries: action.retries + 1
          });
        }
      }
    }

    // Update queue by removing successful actions and updating failed ones
    setQueue(prevQueue => {
      const newQueue = prevQueue.filter(action => !successfulActions.includes(action.id));
      
      // Replace failed actions with their updated versions
      failedActions.forEach(failedAction => {
        const index = newQueue.findIndex(a => a.id === failedAction.id);
        if (index !== -1) {
          newQueue[index] = failedAction;
        } else {
          newQueue.push(failedAction);
        }
      });

      return newQueue;
    });

    setIsProcessing(false);
  }, [queue, isProcessing, actionHandlers]);

  const addToQueue = useCallback((action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) => {
    const newAction: QueuedAction = {
      ...action,
      id: `${action.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0
    };

    setQueue(prev => [...prev, newAction]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(action => action.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const value: OfflineQueueContextType = {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    isProcessing
  };

  return (
    <OfflineQueueContext.Provider value={value}>
      {children}
    </OfflineQueueContext.Provider>
  );
};