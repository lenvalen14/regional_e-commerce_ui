"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCredentials, selectCurrentToken, selectCurrentUser } from "@/features/auth/authSlice"
import { useGetProfileQuery } from "@/features/auth/authApi"
import { useCartSync } from "@/hooks/use-cart-sync"
import { useCartBackup } from "@/hooks/use-cart-backup"

export default function AuthInitializer() {
  const [isMounted, setIsMounted] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(selectCurrentToken)
  const user = useSelector(selectCurrentUser)
  
  // Use cart sync and backup hooks
  useCartSync()
  useCartBackup()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data: profileResponse, isSuccess } = useGetProfileQuery(undefined, {
    skip: !isMounted || !token || !!user,
  })

  useEffect(() => {
    if (isMounted && isSuccess && profileResponse?.data && token) {
      dispatch(setCredentials({ user: profileResponse.data, token }))
    }
  }, [isMounted, isSuccess, profileResponse, dispatch, token])

  return null
}
