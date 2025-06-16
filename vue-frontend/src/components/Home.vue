<template>
  <div class="text-center">
    <h2 class="text-3xl font-bold mb-6 neon-text">Welcome to Snakehead Arena PvP</h2>
    <p class="mb-8 text-lg opacity-90">This is the home page of the Snakehead Arena PvP donation platform.</p>
    <div class="space-y-4">
      <button 
        v-if="authStore.isAuthenticated"
        @click="showDonationForm" 
        class="bg-neonPurple hover:bg-neonPink text-white font-bold py-3 px-8 rounded-lg text-lg neon-button"
      >
        Donate Now
      </button>
      <router-link 
        v-else
        to="/login" 
        class="inline-block bg-neonPurple hover:bg-neonPink text-white font-bold py-3 px-8 rounded-lg text-lg neon-button"
      >
        Login to Donate
      </router-link>
    </div>

    <!-- Donation Form Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-backgroundBlack p-8 rounded-lg border border-neonPurple max-w-md w-full">
        <h3 class="text-2xl font-bold mb-4 neon-text">Make a Donation</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-2">Amount (IDR)</label>
            <select v-model="amount" class="w-full bg-black border border-neonPurple rounded p-2">
              <option value="50000">50,000 IDR - 1,000,000 points</option>
              <option value="200000">200,000 IDR - 1 month access</option>
            </select>
          </div>
          <button 
            @click="processDonation"
            class="w-full bg-neonPurple hover:bg-neonPink text-white font-bold py-2 px-4 rounded neon-button"
          >
            Pay Now
          </button>
          <button 
            @click="closeModal"
            class="w-full bg-transparent border border-neonPurple text-white font-bold py-2 px-4 rounded mt-2 hover:bg-neonPurple/20"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePaymentStore } from '../stores/payment'
import { useAuthStore } from '../stores/auth'

const paymentStore = usePaymentStore()
const authStore = useAuthStore()

const isModalOpen = ref(false)
const amount = ref('50000')

const showDonationForm = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const processDonation = async () => {
  try {
    const userId = authStore.user?.id
    if (!userId) {
      alert('Please login to make a donation')
      return
    }

    await paymentStore.processPayment({
      userId,
      amount: parseInt(amount.value),
      type: 'points',
      pointsAmount: amount.value === '50000' ? 1000000 : 0,
      currentPoints: 0
    })

    alert('Payment successful!')
    closeModal()
  } catch (error) {
    console.error('Payment processing error:', error)
    alert('Failed to process payment. Please try again.')
  }
}
</script>
