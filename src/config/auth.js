/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { FA, firebase } from './firebase'

import { Button, CircularProgress, Typography } from '@material-ui/core'

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  languageCode: 'pt-br',
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
}

function SignInScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const request = window.indexedDB.open('firebaseLocalStorageDb', 1)

    request.onsuccess = e => {
      const db = request.result
      const req = db
        .transaction('firebaseLocalStorage')
        .objectStore('firebaseLocalStorage')
        .getAll()
      req.onsuccess = () => {
        if (req.result.length > 0) setIsSignedIn(true)
        else setIsSignedIn(false)
        setLoading(false)
      }
      req.onerror = () => {
        setLoading(false)
        setIsSignedIn(false)
      }
    }
    request.onerror = () => {
      setLoading(false)
      setIsSignedIn(false)
    }

    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user)
    });
    return () => unregisterAuthObserver()
  }, [])

  if (loading) return <CircularProgress />
  if (!isSignedIn) {
    return (
      <div>
        <Typography variant="h6" style={{ padding: '16px' }}>
          Faça login:
        </Typography>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={FA} />
      </div>
    )
  }

  return (
    <div>
      <Typography variant="h6" style={{ padding: '16px' }}>
        Logado
        <Button
          style={{ marginLeft: '15px', cursor: 'pointer' }}
          variant="outlined"
          onClick={() => FA.signOut()}
        >
          Sair
        </Button>
      </Typography>
    </div>
  )
}

export default SignInScreen
