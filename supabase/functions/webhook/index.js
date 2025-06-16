import { serve } from 'https://deno.land/std@0.177.0/http/server.js'
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: { ...corsHeaders }
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const notification = await req.json()
    const orderId = notification.order_id
    const transactionStatus = notification.transaction_status

    // Verify the payment in your database
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('id', orderId)
      .single()

    if (paymentError || !payment) {
      throw new Error('Payment not found')
    }

    // Update payment status based on Midtrans notification
    let status = 'pending'
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      status = 'completed'
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      status = 'failed'
    }

    // Update payment status
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({ status })
      .eq('id', orderId)

    if (updateError) {
      throw updateError
    }

    // If payment is completed, process rewards
    if (status === 'completed') {
      if (payment.type === 'points' && payment.points_amount) {
        // Update user points
        const { data: user, error: userError } = await supabaseClient
          .from('users')
          .select('total_points')
          .eq('id', payment.user_id)
          .single()

        if (userError) {
          throw userError
        }

        const newPoints = user.total_points + payment.points_amount

        await supabaseClient
          .from('users')
          .update({ total_points: newPoints })
          .eq('id', payment.user_id)

      } else if (payment.type === 'subscription' && payment.subscription_months) {
        // Create subscription record
        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + payment.subscription_months)

        await supabaseClient
          .from('subscriptions')
          .insert([{
            user_id: payment.user_id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
          }])
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
