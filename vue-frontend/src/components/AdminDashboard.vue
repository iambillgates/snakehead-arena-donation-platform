<template>
  <div class="min-h-screen bg-backgroundBlack text-white p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold neon-text">Admin Dashboard</h1>
        <button @click="logout" class="bg-neonPurple hover:bg-neonPink px-4 py-2 rounded neon-button">
          Logout
        </button>
      </header>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-black/50 p-6 rounded-lg border border-neonPurple">
          <h3 class="text-lg mb-2">Total Donations</h3>
          <p class="text-2xl font-bold text-neonPurple">15,500,000 IDR</p>
        </div>
        <div class="bg-black/50 p-6 rounded-lg border border-neonPurple">
          <h3 class="text-lg mb-2">Pending Rewards</h3>
          <p class="text-2xl font-bold text-neonPurple">5</p>
        </div>
        <div class="bg-black/50 p-6 rounded-lg border border-neonPurple">
          <h3 class="text-lg mb-2">Active Users</h3>
          <p class="text-2xl font-bold text-neonPurple">125</p>
        </div>
      </div>

      <!-- Pending Rewards Table -->
      <div class="bg-black/50 p-6 rounded-lg border border-neonPurple mb-8">
        <h2 class="text-xl font-bold mb-4">Pending Rewards</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-neonPurple">
                <th class="text-left py-3">User</th>
                <th class="text-left py-3">Date</th>
                <th class="text-left py-3">Amount</th>
                <th class="text-left py-3">Type</th>
                <th class="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reward in pendingRewards" :key="reward.id" class="border-b border-neonPurple/30">
                <td class="py-3">{{ reward.user }}</td>
                <td class="py-3">{{ reward.date }}</td>
                <td class="py-3">{{ reward.amount }} IDR</td>
                <td class="py-3">{{ reward.type }}</td>
                <td class="py-3">
                  <button 
                    @click="markRewardDelivered(reward.id)"
                    class="bg-neonPurple hover:bg-neonPink px-3 py-1 rounded text-sm neon-button"
                  >
                    Mark Delivered
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- All Payments History -->
      <div class="bg-black/50 p-6 rounded-lg border border-neonPurple mb-8">
        <h2 class="text-xl font-bold mb-4">All Payments History</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-neonPurple">
                <th class="text-left py-3">User</th>
                <th class="text-left py-3">Date</th>
                <th class="text-left py-3">Amount</th>
                <th class="text-left py-3">Type</th>
                <th class="text-left py-3">Status</th>
                <th class="text-left py-3">Reward Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in allPayments" :key="payment.id" class="border-b border-neonPurple/30">
                <td class="py-3">{{ payment.user }}</td>
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
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Simulated pending rewards data
    const pendingRewards = ref([
      {
        id: 1,
        user: 'user@example.com',
        date: '2024-01-15',
        amount: 50000,
        type: 'Points'
      },
      {
        id: 2,
        user: 'player@example.com',
        date: '2024-01-14',
        amount: 200000,
        type: 'Subscription'
      }
    ])

    // Simulated all payments data
    const allPayments = ref([
      {
        id: 1,
        user: 'user@example.com',
        date: '2024-01-15',
        amount: 50000,
        type: 'Points',
        status: 'Completed',
        rewardStatus: 'Pending'
      },
      {
        id: 2,
        user: 'player@example.com',
        date: '2024-01-14',
        amount: 200000,
        type: 'Subscription',
        status: 'Completed',
        rewardStatus: 'Delivered'
      }
    ])

    const markRewardDelivered = (id) => {
      // Update the reward status in both tables
      const reward = pendingRewards.value.find(r => r.id === id)
      if (reward) {
        const payment = allPayments.value.find(p => 
          p.user === reward.user && 
          p.date === reward.date && 
          p.amount === reward.amount
        )
        if (payment) {
          payment.rewardStatus = 'Delivered'
        }
        pendingRewards.value = pendingRewards.value.filter(r => r.id !== id)
      }
    }

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
      pendingRewards,
      allPayments,
      markRewardDelivered,
      logout,
      getStatusClass,
      getRewardStatusClass
    }
  }
}
</script>
