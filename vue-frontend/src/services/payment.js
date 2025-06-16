// Midtrans configuration
const MIDTRANS_CLIENT_KEY = 'YOUR_MIDTRANS_CLIENT_KEY'
const MIDTRANS_SNAP_URL = 'https://app.sandbox.midtrans.com/snap/snap.js'

// Load Midtrans Snap
const loadMidtransScript = () => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('midtrans-script')) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = MIDTRANS_SNAP_URL
    script.id = 'midtrans-script'
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export const initPayment = async (amount) => {
  try {
    await loadMidtransScript()

    // In a real app, you would make an API call to your backend to create a transaction
    // and get the snap token. For demo purposes, we'll simulate the response.
    const snapToken = 'dummy-snap-token'

    window.snap.pay(snapToken, {
      onSuccess: function(result) {
        console.log('Payment success:', result)
        alert('Payment successful!')
      },
      onPending: function(result) {
        console.log('Payment pending:', result)
        alert('Payment pending. Please complete the payment.')
      },
      onError: function(result) {
        console.log('Payment error:', result)
        alert('Payment failed. Please try again.')
      },
      onClose: function() {
        console.log('Customer closed the popup without finishing the payment')
      }
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    alert('Failed to initialize payment. Please try again.')
  }
}
