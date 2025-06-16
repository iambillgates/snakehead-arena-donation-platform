import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkkwwanigfpltjjcbpfm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impra3d3YW5pZ2ZwbHRqamNicGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NzMwMzMsImV4cCI6MjA2NTU0OTAzM30.Y_WThu8s5KK8NBndFDiezO1cJX7-ZCqIVn0L7hug-VE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role')
    .in('email', ['admin@example.com', 'user@example.com'])

  if (error) {
    console.error('Error fetching users:', error)
  } else {
    console.log('Demo users:', data)
  }
}

checkUsers()
  .then(() => console.log('Check complete'))
  .catch(console.error)
