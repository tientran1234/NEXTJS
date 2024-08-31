'use client'
import { useAppStore } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter } from '@/navigation'
import { useLogoutMutation } from '@/queries/useAuth'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef } from 'react'
function Logout(){
  const {mutateAsync} = useLogoutMutation()
    const router = useRouter()
    const searchParams = useSearchParams()
    const setRole= useAppStore(state =>state.setRole)
    const disconnectSocket= useAppStore(state =>state.disconnectSocket)
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const accessTokenFromUrl = searchParams.get('accessToken')
    const ref = useRef<any>(null)
    useEffect(()=>{
      if(!ref.current &&( refreshTokenFromUrl&& refreshTokenFromUrl === getRefreshTokenFromLocalStorage() || accessTokenFromUrl && accessTokenFromUrl
     === getAccessTokenFromLocalStorage())) {
      ref.current = mutateAsync
      mutateAsync().then((res)=>{
        setTimeout(()=>{
          ref.current = null
        },1000)
        setRole(undefined)
       disconnectSocket()
        router.push('/login')
      })
     }else{
      router.push('/')
     }
   
    },[mutateAsync,router,refreshTokenFromUrl,accessTokenFromUrl,setRole,disconnectSocket])
  return (
    <div>logout page...</div>
  )
}

export default Logout