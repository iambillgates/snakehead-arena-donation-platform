<template>
  <div class="min-h-screen bg-backgroundBlack text-white font-futuristic">
    <header class="p-4 border-b border-neonPurple flex justify-between items-center">
      <h1 class="text-3xl neon-text">{{ $t('welcome') }}</h1>
      <select v-model="currentLocale" @change="changeLocale" class="bg-backgroundBlack text-white border border-neonPurple rounded px-2 py-1">
        <option value="id">ID</option>
        <option value="en">EN</option>
      </select>
    </header>
    <main class="p-6">
      <Home />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Home from './components/Home.vue'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

function changeLocale() {
  locale.value = currentLocale.value
}
</script>

<style scoped>
.neon-text {
  text-shadow:
    0 0 5px #9b59b6,
    0 0 10px #9b59b6,
    0 0 20px #9b59b6,
    0 0 40px #9b59b6;
}
</style>
