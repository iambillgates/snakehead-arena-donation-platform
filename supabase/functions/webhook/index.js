const express = require('express')
const bodyParser = require('body-parser')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(bodyParser.json())

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

app.post('/webhook', async (req, res) => {
  try {
    const body = req.body

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
      return res.status(404).send('Donation not found')
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

    res.status(200).send('OK')
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).send('Error')
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`)
})
