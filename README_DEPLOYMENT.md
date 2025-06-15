# Deployment Instructions for Snakehead Arena PvP Donation Platform

## Frontend Deployment (Vue.js)

1. Build the frontend project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Vercel:
   - Create a new project on Vercel.
   - Connect your GitHub repository or upload the project.
   - Set environment variables:
     - `VITE_MIDTRANS_CLIENT_KEY` (Midtrans Client Key)
   - Deploy the project.

3. After deployment, verify the site is accessible and the language switcher works.

## Backend Deployment (Supabase)

1. Create a Supabase project at https://app.supabase.com/.

2. Configure Authentication:
   - Enable Discord and Google providers.
   - Set redirect URLs to your frontend domain.

3. Database Setup:
   - Run the SQL schema in `supabase/schema.sql` in the Supabase SQL editor.

4. API Server:
   - Deploy the Node.js API server (`supabase/functions/api.js`) to a hosting platform (e.g., Vercel, Heroku).
   - Set environment variables:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `PORT` (optional, default 3001)

5. Webhook Server:
   - Deploy the webhook server (`supabase/functions/webhook/index.js`) similarly.
   - Set environment variables as above.
   - Configure Midtrans to send payment notifications to the webhook URL.

6. Update Frontend:
   - Set API base URLs in frontend environment variables to point to your deployed API server.

## Environment Variables Summary

- `VITE_MIDTRANS_CLIENT_KEY` - Midtrans Client Key for frontend Snap integration.
- `SUPABASE_URL` - Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for backend API.
- `PORT` - Port for backend servers (optional).

## Additional Notes

- Ensure CORS settings allow frontend to communicate with backend.
- Secure your service role key; do not expose it in frontend code.
- Test payment flows in Midtrans sandbox before going live.
- Monitor logs for webhook and API servers for errors.
