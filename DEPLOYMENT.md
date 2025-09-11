# Vercel Deployment Guide

## Environment Variables

Configure the following environment variables in your Vercel dashboard (Project Settings > Environment Variables):

### Required Variables
- `EXPO_PUBLIC_SUPABASE_URL`: Your production Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your production Supabase anonymous key

### Optional Variables (with defaults)
- `EXPO_PUBLIC_PLACEHOLDER_IMAGE_URL`: Default placeholder image URL
- `EXPO_PUBLIC_GOOGLE_MAPS_CUSTOM_URL`: Custom Google Maps URL
- `EXPO_PUBLIC_RANDOM_AVATAR_BASE_URL`: Base URL for random avatars
- `EXPO_PUBLIC_HELP_DOCS_URL`: Help documentation URL

## Deployment Steps
1. Push your code to a Git repository connected to Vercel
2. Vercel will automatically detect the Expo framework and use the vercel.json configuration
3. Set the environment variables in Vercel dashboard
4. Deploy