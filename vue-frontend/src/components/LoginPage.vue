<template>
  <div class="min-h-screen flex items-center justify-center bg-backgroundBlack">
    <div class="bg-black/50 p-8 rounded-lg border border-neonPurple max-w-md w-full">
      <h2 class="text-3xl font-bold mb-6 text-center neon-text">Login</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-white text-sm mb-2">Email</label>
          <input 
            type="email" 
            v-model="email" 
            required
            class="w-full bg-black border border-neonPurple rounded p-2 text-white focus:outline-none focus:border-neonPink"
          />
        </div>
        
        <div>
          <label class="block text-white text-sm mb-2">Password</label>
          <input 
            type="password" 
            v-model="password" 
            required
            class="w-full bg-black border border-neonPurple rounded p-2 text-white focus:outline-none focus:border-neonPink"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full bg-neonPurple hover:bg-neonPink text-white font-bold py-2 px-4 rounded neon-button disabled:opacity-50"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>

        <div class="text-center text-sm text-gray-400">
          <p>Demo Accounts:</p>
          <p>Admin - admin@example.com / admin123</p>
          <p>User - user@example.com / user123</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)

    const handleLogin = async () => {
      try {
        isLoading.value = true
        error.value = ''
        
        const user = await authStore.login({
          email: email.value,
          password: password.value
        })

        if (user) {
          router.push(user.role === 'admin' ? '/admin' : '/dashboard')
        } else {
          error.value = 'Invalid email or password'
        }
      } catch (err) {
        error.value = 'An error occurred during login'
        console.error('Login error:', err)
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      password,
      error,
      isLoading,
      handleLogin
    }
  }
}
</script>
