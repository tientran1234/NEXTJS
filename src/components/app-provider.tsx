'use client'
import{
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import RefreshToken from './refresh-token'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { Socket } from 'socket.io-client'
import ListenLogoutSocket from './listen-logout-socket'
import {create} from "zustand"
import { socket } from '@/lib/socket'
import { genarateSocketInstance } from '@/lib/client-utils'
const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            refetchOnWindowFocus:false,
            // refetchOnMount:false
        }
    }
})
// const AppContext = createContext({
//     isAuth:false,
//     role: undefined as RoleType | undefined,
//     setRole: (role?: RoleType | undefined) => {},
//     socket:undefined as Socket | undefined,
//     setSocket:(socket?: Socket | undefined) => {},
//     disconnectSocket:()=>{}
// })
type AppStoreType={
    isAuth:Boolean,
    role: RoleType | undefined,
    setRole: (role?: RoleType | undefined) => void,
    socket:Socket | undefined,
    setSocket:(socket?: Socket | undefined) => void,
    disconnectSocket:()=>void
}
 export const useAppStore=create<AppStoreType>((set)=>({
    isAuth:false,
        role: undefined as RoleType | undefined,
        setRole: (role?: RoleType | undefined) => {
            
            set({role,isAuth:Boolean(role)})
    
            if(!role){
                removeTokensFromLocalStorage()
            }
          },
        socket:undefined as Socket | undefined,
        setSocket:(socket?: Socket | undefined) => set({socket}),
        disconnectSocket:()=>set((state:any)=>{
            state.socket?.disconnect()
            return {socket:undefined}
        }),

}))
// export const useAppStore=()=>{
//     return useContext(AppContext)
// }
export default  function AppProvider({children}:{
    children:React.ReactNode
}){
    const setRole= useAppStore(state =>state.setRole)
    const setSocket= useAppStore(state=>state.setSocket)

    // const [socket,setSocket] = useState<Socket| undefined>()
    // const [role,setRoleState] = useState<RoleType | undefined>()
    const count = useRef(0)
 
    useEffect(()=>{
        if(count.current===0){
            const accessToken = getAccessTokenFromLocalStorage()
            if(accessToken){
                const {role} = decodeToken(accessToken)
                setRole(role)
                setSocket(
                    genarateSocketInstance(accessToken)
                )
            }
            count.current++
        }
        
       
    },[setRole,setSocket])
    useEffect(()=>{

    },[])
    // const disconnectSocket=useCallback(()=>{
    //     socket?.disconnect()
    //     setSocket(undefined)
    // },[socket,setSocket])
    // const setRole = useCallback((role?:RoleType | undefined)=>{
    //         setRoleState(role)
    //         if(!role) removeTokensFromLocalStorage()

    // },[])
    // const isAuth = Boolean(role)
    return (
        // <AppContext.Provider value= {{isAuth,role,setRole,socket,setSocket,disconnectSocket}}>
        <QueryClientProvider client={queryClient}>
       {children}
       <RefreshToken/>
       <ListenLogoutSocket/>
       <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    //   </AppContext.Provider>
    )
}