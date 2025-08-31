# 📍 RuknApp - Project Structure Guide

## Overview

This document explains the organization of the RuknApp project files and folders. The structure reflects the current state of the project with recommendations for future organization to align with React Native best practices.

## Current Project Structure

```
RuknApp/
├── .env                # Environment variables (Supabase configuration)
├── .gitignore          # Git ignore rules
├── app/                # Expo Router app directory (all screens and routing)
│   ├── (auth)/         # Authentication routes
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── Verification.tsx
│   ├── (tabs)/         # Tab navigator routes
│   │   ├── _layout.tsx
│   │   ├── chat.tsx
│   │   ├── favorite.tsx
│   │   ├── home.tsx
│   │   ├── map.tsx
│   │   └── profile.tsx
│   ├── +html.tsx       # HTML wrapper for web
│   ├── +not-found.tsx  # 404 page
│   ├── _layout.tsx     # Root layout component
│   ├── chatScreen.tsx  # Chat screen
│   ├── index.tsx       # Home/landing page
│   └── placeDetails.tsx # Place details screen
├── assets/             # Static assets
│   ├── fonts/          # Custom fonts
│   ├── icons/          # App icons
│   └── images/         # Images and logos
├── backend/            # Backend server code
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API route definitions
│   ├── utils/          # Backend utilities
│   ├── server.js       # Server entry point
│   └── ...             # Configuration files
├── components/         # Reusable UI components
│   ├── BusinessTypeModal.tsx
│   ├── EditScreenInfo.tsx
│   ├── ErrorBoundary.tsx # Error boundary component
│   ├── ExternalLink.tsx
│   ├── FilterHeader.tsx
│   ├── FilterModal.tsx
│   ├── FixedHeaderOverlay.tsx
│   ├── ideaHeader.tsx
│   ├── ImageSlider.tsx
│   ├── MarketCard.tsx
│   ├── OfflineStatusIndicator.tsx # Offline status UI
│   ├── ReanimatedConfig.tsx
│   ├── SearchBar.tsx
│   ├── StyledText.tsx
│   ├── TestErrorComponent.tsx
│   ├── Themed.tsx
│   ├── types.tsx
│   ├── useClientOnlyValue.ts
│   ├── useClientOnlyValue.web.ts
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── __tests__/      # Component tests
├── constants/          # Application constants
│   ├── Colors.ts       # Color definitions
│   ├── icons.js        # Icon definitions
│   └── index.js        # Exports
├── lib/                # Libraries and utilities
│   └── supabaseClient.ts # Supabase client configuration
├── src/                # Source code directory (preserved for unique functionality)
│   ├── context/        # React context providers
│   │   ├── AuthContext.tsx
│   │   ├── FavoritesContext.tsx
│   │   ├── FilterContext.tsx
│   │   ├── NetworkContext.tsx # Network status context
│   │   └── OfflineQueueContext.tsx # Offline operations queue
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
│       ├── offlineCache.ts # Offline data caching
│       ├── polyfills.ts
│       ├── supabase.ts # Legacy Supabase utilities
│       └── zoneRecommendations.ts
├── types/              # TypeScript type definitions
│   ├── app.ts          # App-specific types
│   └── react-navigation.d.ts
├── app.json            # Expo app configuration
├── babel.config.js     # Babel configuration
├── package.json        # NPM package configuration
├── package-lock.json   # NPM lock file
└── tsconfig.json       # TypeScript configuration
```

## Current Structure Status

The project has been successfully consolidated with the following changes:

1. **Screen Consolidation**: All screens have been moved to the `/app` directory using Expo Router. The `/src/screens/` directory has been removed to eliminate duplication.

2. **Navigation Removal**: The `/src/navigation/` directory has been removed as navigation is now handled by Expo Router in the `/app` directory.

3. **Component Organization**: Components remain in the root `/components` directory for better accessibility and Expo Router compatibility.

4. **Context Preservation**: The `/src/context/` directory has been preserved and enhanced with new contexts for network status and offline operations.

5. **Utility Preservation**: The `/src/utils/` directory has been preserved for specialized utility functions.

## Enhanced Features

The consolidated structure now includes:

- **Supabase Integration**: Updated Supabase client configuration in `/lib/supabaseClient.ts`
- **TypeScript Safety**: Comprehensive type definitions in `/types/` directory
- **Error Boundaries**: [`ErrorBoundary`](RuknApp/components/ErrorBoundary.tsx:1) component for graceful error handling
- **Offline Support**: Network detection and offline operation queuing through [`NetworkContext`](RuknApp/src/context/NetworkContext.tsx:1) and [`OfflineQueueContext`](RuknApp/src/context/OfflineQueueContext.tsx:1)
- **Environment Variables**: Centralized configuration via `.env` file for Supabase and other services

## Guidelines for Development

### Adding New Features

1. **New Screens**: Add in the appropriate subdirectory under `/app/` (e.g., `/app/(tabs)/` for tab screens)
2. **New Components**: Add to `/components/` directory
3. **New Contexts**: Add to `/src/context/` directory
4. **New Utilities**: Add to `/src/utils/` directory

### Backend Development

1. Add new API endpoints in `backend/routes/`
2. Implement business logic in `backend/controllers/`
3. Define data models in `backend/models/`

## Best Practices

- Keep components small and focused on a single responsibility
- Use TypeScript for type safety and better developer experience
- Leverage React Context for state management across components
- Implement error boundaries to handle runtime errors gracefully
- Consider offline capabilities when designing new features
- Document complex functions and components
- Follow the established folder structure

---

This structure is designed to make navigation and understanding of the codebase straightforward. If you have questions or suggestions for improvements, please discuss with the team.
