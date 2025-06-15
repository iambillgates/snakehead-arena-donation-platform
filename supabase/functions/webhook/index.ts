import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req: Request) => {
  try {
    const body = await req.json()

    // Validate Midtrans notification signature here if needed

    const transactionStatus = body.transaction_status
    const orderId = body.order_id
    const transactionId = body.transaction_id
    const paymentType = body.payment_type
    const transactionTime = body.transaction_time

    // Update donation and transaction status in Supabase
    // Assuming order_id maps to donation id
    const { data: donation } = await supabase
      .from('donations')
      .select('id, status')
      .eq('id', orderId)
      .single()

    if (!donation) {
      return new Response('Donation not found', { status: 404 })
    }

    let newStatus = donation.status
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      newStatus = 'paid'
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      newStatus = 'failed'
    }

    await supabase.from('donations').update({ status: newStatus }).eq('id', orderId)

    // Insert or update transaction record
    await supabase.from('transactions').upsert({
      donation_id: orderId,
      midtrans_transaction_id: transactionId,
      payment_method: paymentType,
      payment_details: body,
      transaction_time: new Date(transactionTime)
    })

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', { status: 500 })
  }
})
