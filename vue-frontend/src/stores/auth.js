import { defineStore } from 'pinia'
import { supabase, getCurrentUser } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: false
  }),

  actions: {
    async initialize() {
      try {
        this.loading = true
        const user = await getCurrentUser()
        if (user) {
          this.user = user
          this.isAuthenticated = true
          this.isAdmin = user.role === 'admin'
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      try {
        this.loading = true
        const { error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        })

        if (error) throw error

        const user = await getCurrentUser()
        if (user) {
          this.user = user
          this.isAuthenticated = true
          this.isAdmin = user.role === 'admin'
          return user
        }
        return null
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      try {
        this.loading = true
        const { error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name
            }
          }
        })

        if (error) throw error

        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: (await supabase.auth.getUser()).data.user.id,
            email: userData.email,
            name: userData.name,
            role: 'user'
          }])

        if (profileError) throw profileError

        return true
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        this.user = null
        this.isAuthenticated = false
        this.isAdmin = false
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    },

    async updateProfile(profileData) {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('users')
          .update(profileData)
          .eq('id', this.user.id)
          .select()
          .single()

        if (error) throw error

        this.user = data
        return data
      } catch (error) {
        console.error('Profile update error:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
