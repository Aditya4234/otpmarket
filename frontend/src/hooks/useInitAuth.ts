'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { setUser, setLoading } from '@/redux/slices/authSlice'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export function useInitAuth() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      dispatch(setLoading(false))
      return
    }

    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.data) {
          dispatch(setUser(data.data.user || data.data))
        } else {
          dispatch(setLoading(false))
        }
      })
      .catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        dispatch(setLoading(false))
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
