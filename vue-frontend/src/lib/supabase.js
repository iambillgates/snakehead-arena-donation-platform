import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export const getPaymentHistory = async (userId) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getAllPayments = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      users (
        name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getPendingRewards = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      users (
        name,
        email
      )
    `)
    .eq('reward_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateRewardStatus = async (paymentId, status) => {
  const { data, error } = await supabase
    .from('payments')
    .update({ reward_status: status })
    .eq('id', paymentId)
    .select()

  if (error) throw error
  return data[0]
}

export const getLeaderboard = async (timePeriod = 'month') => {
  const { data, error } = await supabase
    .rpc('get_leaderboard', { time_period: timePeriod })

  if (error) throw error
  return data
}

export const createPayment = async (paymentData) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()

  if (error) throw error
  return data[0]
}

export const updateUserPoints = async (userId, points) => {
  const { data, error } = await supabase
    .from('users')
    .update({ total_points: points })
    .eq('id', userId)
    .select()

  if (error) throw error
  return data[0]
}

export const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('users')
    .update(profileData)
    .eq('id', userId)
    .select()

  if (error) throw error
  return data[0]
}
