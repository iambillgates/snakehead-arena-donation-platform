import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    welcome: 'Welcome to Snakehead Arena PvP',
    donationList: 'Donation List',
    points: '50,000 IDR - 1,000,000 points',
    access: '200,000 IDR - 1 month access',
    donate: 'Donate',
    donationForm: {
      selectAmount: 'Select Donation Amount',
      payNow: 'Pay Now'
    },
    login: 'Login',
    dashboard: 'User Dashboard',
    leaderboard: 'Leaderboard',
    monthly: 'Monthly',
    allTime: 'All Time',
    errors: {
      loginError: 'Login failed. Please try again.'
    }
  },
  id: {
    welcome: 'Selamat datang di Snakehead Arena PvP',
    donationList: 'Daftar Donasi',
    points: '50.000 IDR - 1.000.000 poin',
    access: '200.000 IDR - akses 1 bulan',
    donate: 'Donasi',
    donationForm: {
      selectAmount: 'Pilih Jumlah Donasi',
      payNow: 'Bayar Sekarang'
    },
    login: 'Masuk',
    dashboard: 'Dasbor Pengguna',
    leaderboard: 'Papan Peringkat',
    monthly: 'Bulanan',
    allTime: 'Sepanjang Waktu',
    errors: {
      loginError: 'Gagal masuk. Silakan coba lagi.'
    }
  }
}

const i18n = createI18n({
  locale: 'id',
  fallbackLocale: 'en',
  messages,
})

export default i18n
