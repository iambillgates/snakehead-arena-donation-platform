import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkkwwanigfpltjjcbpfm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impra3d3YW5pZ2ZwbHRqamNicGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NzMwMzMsImV4cCI6MjA2NTU0OTAzM30.Y_WThu8s5KK8NBndFDiezO1cJX7-ZCqIVn0L7hug-VE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createDemoUsers() {
  const users = [
    { email: 'admin@example.com', password: 'admin123' },
    { email: 'user@example.com', password: 'user123' }
  ]

  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true
    })

    if (error) {
      console.error('Error creating user:', user.email, error)
    } else {
      console.log('Created user:', user.email)
    }
  }
}

createDemoUsers()
  .then(() => console.log('Demo users creation complete'))
  .catch(console.error)
