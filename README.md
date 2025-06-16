# Snakehead Arena PvP Donation Platform

## Project Overview
This is a full-stack donation platform for the Snakehead Arena PvP GTA server, inspired by Trakteer. It allows users to donate fixed amounts and receive rewards, with authentication via Discord and Google, payment integration with Midtrans, and a leaderboard showcasing top donors.

## Technology Stack
- Frontend: Vue.js 3, Tailwind CSS, vue-i18n for multi-language support
- Backend: Supabase for authentication, database, and API
- Payment Gateway: Midtrans Snap integration with webhook for payment notifications

## Features
- User login with Discord and Google
- Donation form with fixed options (50,000 IDR for 1,000,000 points, 200,000 IDR for 1 month access)
- Dashboard showing donation history, transaction status, and rewards
- Leaderboard with monthly and all-time filters
- Multi-language support (Indonesian and English)
- Responsive dark neon GTA-inspired theme

## Setup Instructions

### Frontend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview production build:
   ```bash
   npm run serve
   ```

### Backend (Supabase)
1. Create a Supabase project.
2. Configure authentication providers: Discord and Google.
3. Create database tables: users, donations, transactions (see schema.sql).
4. Deploy API endpoints using Supabase Edge Functions or REST.
5. Configure Midtrans webhook URL in Supabase functions.

### Midtrans Integration
1. Register for Midtrans account.
2. Obtain Client Key and Server Key.
3. Configure Snap integration on frontend with Client Key.
4. Setup webhook on backend with Server Key to receive payment notifications.
5. Only allow fixed donation amounts: 50,000 IDR and 200,000 IDR.

## Deployment
- Frontend: Deploy to Vercel.
- Backend: Use Supabase platform for database and API.

## Dependencies
- Vue.js 3
- Tailwind CSS
- vue-i18n
- axios
- Supabase JS client
- Midtrans Snap JS SDK

## Additional Notes
- Ensure error handling for payment failures and login errors.
- Optimize leaderboard queries for performance.
- Use modern, clean UI with neon GTA theme colors.
