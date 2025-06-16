# Snakehead Arena PvP - Deployment Guide

This guide explains how to deploy and configure the Snakehead Arena PvP donation platform.

## Prerequisites

1. Supabase Account
2. Midtrans Account
3. Node.js 16+ and npm
4. Domain name (optional)

## Environment Variables

Create a `.env` file in the `vue-frontend` directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
VITE_MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js
```

## Database Setup

1. Create a new Supabase project
2. Run the SQL schema:
   - Copy the contents of `supabase/schema.sql`
   - Execute in Supabase SQL editor

## Supabase Edge Functions

1. Deploy the webhook function:
```bash
supabase functions deploy webhook
```

2. Set environment variables for the function:
```bash
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Midtrans Configuration

1. Set up a Midtrans account
2. Configure webhook URL in Midtrans dashboard:
   - Point to your Supabase webhook function URL
   - Format: `https://[project-ref].functions.supabase.co/webhook`

3. Configure payment methods:
   - Enable desired payment methods in Midtrans dashboard
   - Update notification URL
   - Set allowed IPs if needed

## Frontend Deployment

1. Install dependencies:
```bash
cd vue-frontend
npm install
```

2. Build for production:
```bash
npm run build
```

3. Deploy the `dist` directory to your hosting service

## Initial Setup

1. Create admin user:
```sql
-- In Supabase SQL editor
INSERT INTO public.users (id, email, name, role)
VALUES (
  'auth_user_id',
  'admin@example.com',
  'Admin User',
  'admin'
);
```

2. Configure authentication in Supabase:
   - Enable Email auth provider
   - Configure email templates
   - Set up password policies

## Security Considerations

1. RLS Policies are configured in schema.sql
2. Ensure Supabase service role key is kept secure
3. Use HTTPS for all endpoints
4. Configure CORS appropriately
5. Monitor logs for suspicious activity

## Testing

1. Test user registration/login
2. Test payment flow with Midtrans sandbox
3. Verify webhook handling
4. Check admin functions
5. Verify point/subscription delivery

## Monitoring

1. Set up Supabase database monitoring
2. Configure error logging
3. Monitor webhook responses
4. Track payment status changes

## Troubleshooting

Common issues and solutions:

1. Payment webhook not received:
   - Check Midtrans configuration
   - Verify webhook URL
   - Check function logs

2. Points not credited:
   - Check webhook function logs
   - Verify database transactions
   - Check user balance updates

3. Authentication issues:
   - Verify environment variables
   - Check Supabase configuration
   - Review auth logs

## Maintenance

Regular maintenance tasks:

1. Update dependencies
2. Monitor database performance
3. Clean up old logs
4. Backup database regularly
5. Review security settings

## Support

For technical support:
1. Check Supabase documentation
2. Review Midtrans integration guides
3. Contact support team

## Scaling

To handle increased load:

1. Optimize database queries
2. Add caching where appropriate
3. Monitor resource usage
4. Scale Supabase plan as needed

Remember to regularly update this guide as the system evolves.
