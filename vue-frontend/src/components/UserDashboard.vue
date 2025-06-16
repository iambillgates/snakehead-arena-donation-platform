<template>
  <div class="min-h-screen bg-backgroundBlack text-white p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold neon-text">User Dashboard</h1>
        <button @click="logout" class="bg-neonPurple hover:bg-neonPink px-4 py-2 rounded neon-button">
          Logout
        </button>
      </header>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-black/50 p-6 rounded-lg border border-neonPurple">
          <h3 class="text-lg mb-2">Total Points</h3>
          <p class="text-2xl font-bold text-neonPurple">1,500,000</p>
        </div>
        <div class="bg-black/50 p-6 rounded-lg border border-neonPurple">
          <h3 class="text-lg mb-2">Active Subscriptions</h3>
          <p class="text-2xl font-bold text-neonPurple">2 months</p>
        </div>
        <div class="bg-black/50 p-6 rounded-lg border border-neonPurple">
          <h3 class="text-lg mb-2">Rank</h3>
          <p class="text-2xl font-bold text-neonPurple">#5</p>
        </div>
      </div>

      <!-- Payment History -->
      <div class="bg-black/50 p-6 rounded-lg border border-neonPurple mb-8">
        <h2 class="text-xl font-bold mb-4">Payment History</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-neonPurple">
                <th class="text-left py-3">Date</th>
                <th class="text-left py-3">Amount</th>
                <th class="text-left py-3">Type</th>
                <th class="text-left py-3">Status</th>
                <th class="text-left py-3">Reward Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in payments" :key="payment.id" class="border-b border-neonPurple/30">
                <td class="py-3">{{ payment.date }}</td>
                <td class="py-3">{{ payment.amount }} IDR</td>
                <td class="py-3">{{ payment.type }}</td>
                <td class="py-3">
                  <span :class="getStatusClass(payment.status)">
                    {{ payment.status }}
                  </span>
                </td>
                <td class="py-3">
                  <span :class="getRewardStatusClass(payment.rewardStatus)">
                    {{ payment.rewardStatus }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="bg-black/50 p-6 rounded-lg border border-neonPurple">
        <h2 class="text-xl font-bold mb-4">Account Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-2">Email</label>
            <input 
              type="email" 
              v-model="userEmail" 
              class="w-full bg-black border border-neonPurple rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm mb-2">New Password</label>
            <input 
              type="password" 
              v-model="newPassword" 
              class="w-full bg-black border border-neonPurple rounded p-2"
            />
          </div>
          <button class="bg-neonPurple hover:bg-neonPink px-4 py-2 rounded neon-button">
            Update Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'UserDashboard',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userEmail = ref(authStore.user?.email || '')
    const newPassword = ref('')

    // Simulated payment data
    const payments = ref([
      {
        id: 1,
        date: '2024-01-15',
        amount: 50000,
        type: 'Points',
        status: 'Completed',
        rewardStatus: 'Delivered'
      },
      {
        id: 2,
        date: '2024-01-10',
        amount: 200000,
        type: 'Subscription',
        status: 'Completed',
        rewardStatus: 'Pending'
      }
    ])

    const logout = () => {
      authStore.logout()
      router.push('/login')
    }

    const getStatusClass = (status) => {
      return {
        'text-green-400': status === 'Completed',
        'text-yellow-400': status === 'Pending',
        'text-red-400': status === 'Failed'
      }
    }

    const getRewardStatusClass = (status) => {
      return {
        'text-green-400': status === 'Delivered',
        'text-yellow-400': status === 'Pending',
        'text-red-400': status === 'Failed'
      }
    }

    return {
      userEmail,
      newPassword,
      payments,
      logout,
      getStatusClass,
      getRewardStatusClass
    }
  }
}
</script>
