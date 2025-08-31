# RuknApp Source Directory - Preserved Functionality

This directory contains preserved source code for unique functionality that wasn't consolidated into the main app structure. After refactoring, this directory now focuses on context providers, custom hooks, and specialized utilities.

## Current Directory Structure

- `context/`: React context providers for state management
  - [`AuthContext.tsx`](RuknApp/src/context/AuthContext.tsx:1): Authentication state management
  - [`FavoritesContext.tsx`](RuknApp/src/context/FavoritesContext.tsx:1): User favorites management
  - [`FilterContext.tsx`](RuknApp/src/context/FilterContext.tsx:1): Filter and search state
  - [`NetworkContext.tsx`](RuknApp/src/context/NetworkContext.tsx:1): Network connectivity status
  - [`OfflineQueueContext.tsx`](RuknApp/src/context/OfflineQueueContext.tsx:1): Offline operations queuing

- `hooks/`: Custom React hooks for reusable logic
- `utils/`: Specialized utility functions
  - [`offlineCache.ts`](RuknApp/src/utils/offlineCache.ts:1): Offline data caching utilities
  - [`zoneRecommendations.ts`](RuknApp/src/utils/zoneRecommendations.ts:1): Business location recommendation logic
  - Legacy Supabase utilities

## Note on Project Consolidation

As part of the architecture refactoring:
- All screens and routing have been moved to the [`app/`](RuknApp/app/:1) directory using Expo Router
- UI components remain in the root [`components/`](RuknApp/components/:1) directory for better accessibility
- The `navigation/` and `screens/` directories have been removed to eliminate duplication

Refer to the main [`PROJECT_STRUCTURE.md`](RuknApp/PROJECT_STRUCTURE.md:1) file for comprehensive details about the current project organization.
