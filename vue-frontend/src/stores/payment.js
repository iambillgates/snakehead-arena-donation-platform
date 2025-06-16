import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import {
  createPayment,
  getPaymentHistory,
  getAllPayments,
  getPendingRewards,
  updateRewardStatus,
  updateUserPoints
} from '../lib/supabase'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    userPayments: [],
    allPayments: [],
    pendingRewards: [],
    loading: false,
    error: null
  }),

  actions: {
    async loadUserPayments(userId) {
      try {
        this.loading = true
        this.userPayments = await getPaymentHistory(userId)
      } catch (error) {
        console.error('Error loading user payments:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async loadAllPayments() {
      try {
        this.loading = true
        this.allPayments = await getAllPayments()
      } catch (error) {
        console.error('Error loading all payments:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async loadPendingRewards() {
      try {
        this.loading = true
        this.pendingRewards = await getPendingRewards()
      } catch (error) {
        console.error('Error loading pending rewards:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async processPayment(paymentData) {
      try {
        this.loading = true
        
        // Create payment record
        const payment = await createPayment({
          user_id: paymentData.userId,
          amount: paymentData.amount,
          type: paymentData.type,
          status: 'pending',
          reward_status: 'pending',
          points_amount: paymentData.type === 'points' ? paymentData.pointsAmount : null,
          subscription_months: paymentData.type === 'subscription' ? paymentData.months : null
        })

        // After successful payment (you would integrate with real payment gateway here)
        const updatedPayment = await supabase
          .from('payments')
          .update({ status: 'completed' })
          .eq('id', payment.id)
          .select()
          .single()

        // If points purchase, update user's total points
        if (paymentData.type === 'points') {
          await updateUserPoints(
            paymentData.userId,
            paymentData.currentPoints + paymentData.pointsAmount
          )
        }

        // If subscription purchase, create subscription record
        if (paymentData.type === 'subscription') {
          const startDate = new Date()
          const endDate = new Date()
          endDate.setMonth(endDate.getMonth() + paymentData.months)

          await supabase
            .from('subscriptions')
            .insert([{
              user_id: paymentData.userId,
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString()
            }])
        }

        return updatedPayment.data
      } catch (error) {
        console.error('Error processing payment:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async markRewardDelivered(paymentId) {
      try {
        this.loading = true
        await updateRewardStatus(paymentId, 'delivered')
        
        // Update local state
        this.pendingRewards = this.pendingRewards.filter(r => r.id !== paymentId)
        const paymentIndex = this.allPayments.findIndex(p => p.id === paymentId)
        if (paymentIndex !== -1) {
          this.allPayments[paymentIndex].reward_status = 'delivered'
        }
      } catch (error) {
        console.error('Error marking reward as delivered:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
