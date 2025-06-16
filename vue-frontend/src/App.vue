<template>
  <div class="min-h-screen bg-backgroundBlack text-white">
    <!-- Navigation -->
    <nav v-if="authStore.isAuthenticated" class="bg-black/50 border-b border-neonPurple">
      <div class="max-w-6xl mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-8">
            <router-link to="/" class="text-xl font-bold neon-text">
              Snakehead Arena
            </router-link>
            <div class="flex space-x-4">
              <router-link 
                v-if="!authStore.isAdmin" 
                to="/dashboard" 
                class="hover:text-neonPurple transition-colors"
              >
                Dashboard
              </router-link>
              <router-link 
                v-if="authStore.isAdmin" 
                to="/admin" 
                class="hover:text-neonPurple transition-colors"
              >
                Admin
              </router-link>
              <router-link 
                to="/leaderboard" 
                class="hover:text-neonPurple transition-colors"
              >
                Leaderboard
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span v-if="authStore.user" class="text-gray-400">
              {{ authStore.user.email }}
            </span>
            <button 
              @click="handleLogout" 
              class="bg-neonPurple hover:bg-neonPink px-4 py-2 rounded neon-button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
