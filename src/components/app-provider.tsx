'use client'
import{
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import RefreshToken from './refresh-token'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { boolean } from 'zod'
import { RoleType } from '@/types/jwt.types'
import { decode } from 'jsonwebtoken'
const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            refetchOnWindowFocus:false,
            // refetchOnMount:false
        }
    }
})
const AppContext = createContext({
    isAuth:false,
    role: undefined as RoleType | undefined,
    setRole: (role?: RoleType | undefined) => {}
})
export const useAppContext=()=>{
    return useContext(AppContext)
}
export default  function AppProvider({children}:{
    children:React.ReactNode
}){
    const [role,setRoleState] = useState<RoleType | undefined>()
    useEffect(()=>{
        const accessToken = getAccessTokenFromLocalStorage()
        if(accessToken){
            const {role} = decodeToken(accessToken)
            setRoleState(role)
        }
    },[])
    const setRole = useCallback((role?:RoleType | undefined)=>{
            setRoleState(role)
            if(!role) removeTokensFromLocalStorage()

    },[])
    const isAuth = Boolean(role)
    return (
        <AppContext.Provider value= {{isAuth,role,setRole}}>
        <QueryClientProvider client={queryClient}>
       {children}
       <RefreshToken/>
       <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      </AppContext.Provider>
    )
}