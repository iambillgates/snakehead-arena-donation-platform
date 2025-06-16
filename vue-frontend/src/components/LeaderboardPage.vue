<template>
  <div class="min-h-screen bg-backgroundBlack text-white p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold neon-text mb-2">Leaderboard</h1>
        <p class="text-gray-400">Top donors this month</p>
      </header>

      <!-- Leaderboard Table -->
      <div class="bg-black/50 p-6 rounded-lg border border-neonPurple">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-neonPurple">
                <th class="text-left py-3">Rank</th>
                <th class="text-left py-3">Player</th>
                <th class="text-left py-3">Total Points</th>
                <th class="text-left py-3">Total Donations</th>
                <th class="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(player, index) in leaderboard" 
                :key="player.id"
                :class="[
                  'border-b border-neonPurple/30',
                  index < 3 ? 'bg-black/30' : ''
                ]"
              >
                <td class="py-4">
                  <span 
                    :class="[
                      'inline-flex items-center justify-center w-8 h-8 rounded-full font-bold',
                      getRankClass(index + 1)
                    ]"
                  >
                    {{ index + 1 }}
                  </span>
                </td>
                <td class="py-4">
                  <div class="flex items-center">
                    <span class="font-medium">{{ player.name }}</span>
                    <span v-if="index < 3" class="ml-2">👑</span>
                  </div>
                </td>
                <td class="py-4">{{ formatNumber(player.points) }}</td>
                <td class="py-4">{{ formatCurrency(player.donations) }} IDR</td>
                <td class="py-4">
                  <span 
                    :class="[
                      'px-2 py-1 rounded text-sm',
                      getStatusClass(player.status)
                    ]"
                  >
                    {{ player.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Time Period Selector -->
      <div class="mt-6 flex justify-center space-x-4">
        <button 
          v-for="period in timePeriods" 
          :key="period"
          @click="selectedPeriod = period"
          :class="[
            'px-4 py-2 rounded',
            selectedPeriod === period 
              ? 'bg-neonPurple text-white' 
              : 'bg-black/50 text-gray-400 hover:bg-neonPurple/20'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LeaderboardPage',
  setup() {
    const selectedPeriod = ref('This Month')
    const timePeriods = ['All Time', 'This Month', 'This Week']

    const leaderboard = ref([
      {
        id: 1,
        name: 'DragonSlayer',
        points: 5000000,
        donations: 2500000,
        status: 'VIP'
      },
      {
        id: 2,
        name: 'NightHawk',
        points: 3000000,
        donations: 1500000,
        status: 'Premium'
      },
      {
        id: 3,
        name: 'PhantomKnight',
        points: 2000000,
        donations: 1000000,
        status: 'Premium'
      },
      {
        id: 4,
        name: 'ShadowBlade',
        points: 1500000,
        donations: 750000,
        status: 'Regular'
      },
      {
        id: 5,
        name: 'StormBringer',
        points: 1000000,
        donations: 500000,
        status: 'Regular'
      }
    ])

    const getRankClass = (rank) => {
      if (rank === 1) return 'bg-yellow-500 text-black'
      if (rank === 2) return 'bg-gray-300 text-black'
      if (rank === 3) return 'bg-amber-600 text-black'
      return 'bg-gray-700 text-white'
    }

    const getStatusClass = (status) => {
      return {
        'bg-neonPurple/50': status === 'VIP',
        'bg-blue-500/50': status === 'Premium',
        'bg-gray-500/50': status === 'Regular'
      }
    }

    const formatNumber = (num) => {
      return num.toLocaleString()
    }

    const formatCurrency = (num) => {
      return num.toLocaleString()
    }

    return {
      selectedPeriod,
      timePeriods,
      leaderboard,
      getRankClass,
      getStatusClass,
      formatNumber,
      formatCurrency
    }
  }
}
</script>
