# 📍 Smart Location Finder – Senior Project

This mobile app helps aspiring entrepreneurs find the best rental locations to open their shops. By analyzing data such as nearby services, demographics, competition, and more, the app recommends smart locations that increase the chances of business success.

Built with **React Native** for iOS/Android, **Node.js** backend, and enhanced using the **Google Places API** and **Machine Learning** models.

---

## 🧠 Project Overview

Many small business owners struggle to find a good location for their shops. This app solves that problem by using real-world data to suggest optimal places based on the type of business.

**Example:**  
If a user wants to open a **flower shop**, the app will:
- Suggest areas close to **hospitals**
- Check areas with **many married couples**
- Analyze **competition** from other flower shops
- Estimate **success potential** using ML

---

## 🌟 Key Features

- ✅ Input desired business type (e.g. flower shop, coffee shop, bookstore)
- 📍 Location suggestions based on:
  - Nearby services (hospitals, schools, offices)
  - Demographics (age, marital status, income)
  - Competition level
  - Foot traffic and visibility
  - Rental price vs. potential revenue
- 🧠 ML model to predict success rate
- 🗺️ Interactive map view of suggestions
- 🔒 Secure user accounts (optional)

---

## ⚙️ Tech Stack

### 💻 Frontend (Mobile)
- **React Native** (cross-platform) with **TypeScript** for type safety
- **Expo** for development & testing
- **Expo Router** for file-based navigation
- **React Native Maps** for map features
- **Supabase** for authentication and real-time data

### 🌐 Backend
- **Node.js + Express** for APIs
- **Supabase** as the primary database (PostgreSQL)
- **dotenv** for environment variables

### 🔍 APIs & Services
- **Google Places API**
- **Google Maps API**
- **Open Data APIs** (for demographics)
- **Python ML model** served via API or Cloud Function
- **Supabase Auth** for user authentication
- **Supabase Realtime** for real-time updates

---

## 🔐 Environment Variables

Create a `.env` file in your root directory with the following Supabase configuration:

    EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    PORT=3000
    GOOGLE_API_KEY=your_google_places_api_key

**Supabase Setup:**
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anonymous key from Settings > API
3. Add these values to your `.env` file

**Important:** Do **not** upload your real `.env` file to GitHub. The `.gitignore` file already excludes `.env`.

---

## 🚀 Getting Started

### 1. Clone the repository

    git clone https://github.com/MQHANAD/RuknApp.git
    cd RuknApp
    npm install --legacy-peer-deps

### 2. Install dependencies

**Frontend:**
    
    npm install
    # or
    yarn install

### 3. Set up environment variables

Copy the example environment variables:

    cp .env.example .env  # If an example file exists
    # Or create a new .env file with the required variables

### 4. Run the app

**Frontend:**

    npx expo start

**Backend (if needed):**

    cd backend
    npm start

---

## 🛡️ Enhanced Features

### Error Boundaries
The app includes a robust [`ErrorBoundary`](RuknApp/components/ErrorBoundary.tsx:1) component that catches JavaScript errors anywhere in the component tree and displays a fallback UI instead of crashing the app. This provides a better user experience and helps with debugging.

### Offline Support
The application features comprehensive offline capabilities:
- **Network Detection**: [`NetworkContext`](RuknApp/src/context/NetworkContext.tsx:1) monitors internet connectivity status
- **Offline Queue**: [`OfflineQueueContext`](RuknApp/src/context/OfflineQueueContext.tsx:1) queues operations when offline and syncs when back online
- **Data Caching**: [`offlineCache.ts`](RuknApp/src/utils/offlineCache.ts:1) utilities for caching data locally
- **UI Indicators**: [`OfflineStatusIndicator`](RuknApp/components/OfflineStatusIndicator.tsx:1) component shows connection status

### TypeScript Integration
The project uses TypeScript throughout for improved developer experience:
- **Type Safety**: Comprehensive type definitions in [`/types/`](RuknApp/types/:1) directory
- **Interface Definitions**: [`app.ts`](RuknApp/types/app.ts:1) contains app-specific type interfaces
- **Better Autocomplete**: Enhanced IDE support and code completion

### Supabase Integration
- **Authentication**: Secure user auth with Supabase Auth
- **Real-time Data**: Live updates using Supabase Realtime
- **Client Configuration**: [`supabaseClient.ts`](RuknApp/lib/supabaseClient.ts:1) provides configured Supabase client instance

## 👥 Team Members

- [Muhannad Alduraywish] – Mobile Developer
- [OMAR ALSHAHRANI] – Project Manager
- [HAMZA BAAQIL] – Mobile Developer
- [FERAS ALBADER] – ML/data Engineer
- [MOHAMMED ASIRI] – ML/data Engineer

---

## 📌 Project Status

📱 Currently under active development as a senior graduation project.

---

## 📄 License

This project is licensed under the MIT License.
