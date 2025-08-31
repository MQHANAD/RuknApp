import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Network from 'expo-network';

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type?: Network.NetworkStateType;
}

interface NetworkContextType {
  networkState: NetworkState;
  isLoading: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: false,
    isInternetReachable: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setNetworkState({
          isConnected: networkState.isConnected ?? false,
          isInternetReachable: networkState.isInternetReachable ?? false,
          type: networkState.type,
        });
      } catch (error) {
        console.error('Error checking network status:', error);
        setNetworkState({
          isConnected: false,
          isInternetReachable: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkNetworkStatus();

    const subscription = Network.addNetworkStateListener((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const value: NetworkContextType = {
    networkState,
    isLoading,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};