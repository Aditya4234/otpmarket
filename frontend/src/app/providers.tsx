'use client'

import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { useInitAuth } from '@/hooks/useInitAuth'

function AuthInit({ children }: { children: React.ReactNode }) {
  useInitAuth()
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInit>{children}</AuthInit>
    </Provider>
  )
}
