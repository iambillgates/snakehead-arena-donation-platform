import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkkwwanigfpltjjcbpfm.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impra3d3YW5pZ2ZwbHRqamNicGZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTk3MzAzMywiZXhwIjoyMDY1NTQ5MDMzfQ.Qpr0oBb7r3MW9zcYOtIcTYd9DlSkpjBYwE0_PYWs_PI'

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function createDemoUsers() {
  const users = [
    { email: 'admin@example.com', password: 'admin123' },
    { email: 'user@example.com', password: 'user123' }
  ]

  for (const user of users) {
    try {
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
    } catch (err) {
      console.error('Error:', err)
    }
  }
}

createDemoUsers()
  .then(() => console.log('Demo users creation complete'))
  .catch(console.error)
