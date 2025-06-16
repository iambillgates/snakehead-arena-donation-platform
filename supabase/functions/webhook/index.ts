import { serve } from 'https://deno.fresh.dev/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface MidtransNotification {
  transaction_status: string
  order_id: string
  gross_amount: string
  payment_type: string
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const notification: MidtransNotification = await req.json()
    const orderId = notification.order_id
    const transactionStatus = notification.transaction_status

    // Verify the payment in your database
    const { data: payment, error: paymentError } = await supabase
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
    const { error: updateError } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', orderId)

    if (updateError) {
      throw updateError
    }

    // If payment is completed, process rewards
    if (status === 'completed') {
      if (payment.type === 'points') {
        // Update user points
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('total_points')
          .eq('id', payment.user_id)
          .single()

        if (userError) {
          throw userError
        }

        const newPoints = user.total_points + payment.points_amount
        await supabase
          .from('users')
          .update({ total_points: newPoints })
          .eq('id', payment.user_id)

      } else if (payment.type === 'subscription') {
        // Create subscription record
        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + payment.subscription_months)

        await supabase
          .from('subscriptions')
          .insert([{
            user_id: payment.user_id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
          }])
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
