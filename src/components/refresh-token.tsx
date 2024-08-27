import { socket } from '@/lib/socket'
import { checkAndRefreshToken, getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import  { useEffect } from 'react'
import { useAppStore } from './app-provider'
const UNAUTHENTICATED_PATH=['/login','/logout','/refresh-token']
const RefreshToken = () => {
    const pathname =  usePathname()
    const router = useRouter()
       const socket= useAppStore(state =>state.socket)
   const disconnectSocket= useAppStore(state =>state.disconnectSocket)
    useEffect(()=>{
        if(UNAUTHENTICATED_PATH.includes(pathname)) return
        let interval:any = null
       
                   const onRefreshToken=(force?:boolean)=> checkAndRefreshToken({
                        onError:()=>{
                            clearInterval(interval)
                           disconnectSocket()
                            router.push('/login')
                        },
                        force
                    })

                    onRefreshToken()
                    interval = setInterval(onRefreshToken,1000) 
                    if (socket?.connected) {
                        onConnect();
                      }
                    
                      function onConnect() {
                        console.log(socket?.id);
                        
                      }
                      function onDisconnect() {
                        console.log("disconect");
                        
                      }
                      function onRefreshTokenSocket() {
                        onRefreshToken(true)
                        
                      }
                      socket?.on("connect", onConnect);
                      socket?.on("disconnect", onDisconnect);
                      socket?.on("refresh-token", onRefreshTokenSocket);
                
                    return ()=>{
                        clearInterval(interval)
                        socket?.off("connect", onConnect)
                        socket?.off("disconnect", onDisconnect)
                        socket?.off("refresh-token", onRefreshTokenSocket);
                    } 
    },[pathname,router,socket,disconnectSocket])
  return null
   
}

export default RefreshToken