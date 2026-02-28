'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', ''))

    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(() => {
          setReady(true)
        })
    } else {
      setError('Invalid or expired reset link.')
    }
  }, [])

  const handleUpdate = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated successfully. You can now return to the app.')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '0 auto' }}>
      <h1>Set new password</h1>

      {!ready && !error && <p>Verifying reset link...</p>}

      {ready && (
        <>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 12, marginTop: 20 }}
          />

          <button
            onClick={handleUpdate}
            disabled={loading}
            style={{
              width: '100%',
              padding: 12,
              marginTop: 20,
              background: '#C8A85D',
              border: 'none',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </>
      )}

      {message && <p style={{ color: 'green', marginTop: 20 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 20 }}>{error}</p>}
    </div>
  )
}l