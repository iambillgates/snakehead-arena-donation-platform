const express = require('express')
const bodyParser = require('body-parser')
const { createClient } = require('@supabase/supabase-js')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(bodyParser.json())

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /donations - list all donations
app.get('/donations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching donations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /donate - create a donation and get Midtrans snap token
app.post('/donate', async (req, res) => {
  try {
    const { user_id, amount } = req.body

    if (![50000, 200000].includes(amount)) {
      return res.status(400).json({ error: 'Invalid donation amount' })
    }

    // Determine donation type and reward
    let type = ''
    let reward = ''
    if (amount === 50000) {
      type = 'SNAKEHEADS_POINTS'
      reward = '1,000,000 points'
    } else if (amount === 200000) {
      type = 'SNAKEHEADS_PEDS'
      reward = '1 month access'
    }

    // Create donation record with status 'pending'
    const donationId = uuidv4()
    const { error: insertError } = await supabase.from('donations').insert({
      id: donationId,
      user_id,
      amount,
      type,
      reward,
      status: 'pending',
      date: new Date()
    })

    if (insertError) throw insertError

    // Call Midtrans API to create transaction and get snap token
    // This part requires server-side Midtrans integration with server key
    // For now, return dummy snapToken for frontend to use
    const snapToken = 'dummy_snap_token'

    res.json({ snapToken, donationId })
  } catch (error) {
    console.error('Error creating donation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /leaderboard - get top donors with filter
app.get('/leaderboard', async (req, res) => {
  try {
    const filter = req.query.filter || 'monthly'
    let startDate = null

    if (filter === 'monthly') {
      const now = new Date()
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    let query = supabase
      .from('donations')
      .select('user_id, amount, users(name, discord_id, google_id)')
      .eq('status', 'paid')

    if (startDate) {
      query = query.gte('date', startDate.toISOString())
    }

    const { data, error } = await query

    if (error) throw error

    // Aggregate total donations per user
    const totals = {}
    data.forEach(donation => {
      const userId = donation.user_id
      if (!totals[userId]) {
        totals[userId] = {
          id: userId,
          name: donation.users?.name || donation.users?.discord_id || donation.users?.google_id || 'Anonymous',
          total_donations: 0
        }
      }
      totals[userId].total_donations += donation.amount
    })

    // Convert to array and sort descending
    const leaderboard = Object.values(totals).sort((a, b) => b.total_donations - a.total_donations).slice(0, 20)

    res.json(leaderboard)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`API server listening on port ${port}`)
})
