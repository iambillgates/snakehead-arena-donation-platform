import { defineStore } from 'pinia'
import { getLeaderboard } from '../lib/supabase'

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    rankings: [],
    timePeriod: 'month', // 'all', 'month', 'week'
    loading: false,
    error: null
  }),

  getters: {
    topPlayers: (state) => state.rankings.slice(0, 10),
    
    playerRankings: (state) => (userId) => {
      const playerIndex = state.rankings.findIndex(player => player.user_id === userId)
      return playerIndex !== -1 ? playerIndex + 1 : null
    },

    getPlayerStatus: (state) => (points) => {
      if (points >= 5000000) return 'VIP'
      if (points >= 1000000) return 'Premium'
      return 'Regular'
    }
  },

  actions: {
    async loadLeaderboard(period = null) {
      try {
        this.loading = true
        if (period) {
          this.timePeriod = period
        }
        
        this.rankings = await getLeaderboard(this.timePeriod)
      } catch (error) {
        console.error('Error loading leaderboard:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async refreshLeaderboard() {
      await this.loadLeaderboard()
    },

    setTimePeriod(period) {
      this.timePeriod = period
      this.loadLeaderboard()
    },

    clearError() {
      this.error = null
    }
  }
})
