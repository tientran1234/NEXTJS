
import { useEffect } from "react"
import type { Socket } from "socket.io-client"
import { useLogoutMutation } from '@/queries/useAuth';
import { handleErrorApi } from "@/lib/utils";
import { useAppStore } from "./app-provider";
import { usePathname, useRouter } from "@/navigation";
const UNAUTHENTICATED_PATH = ['/login','/logout','/refresh-token']
export default function ListenLogoutSocket(){
    const pathname = usePathname()
    const router = useRouter()
    const {isPending,mutateAsync} = useLogoutMutation()
    const setRole= useAppStore(state =>state.setRole)
    const socket= useAppStore(state =>state.socket)
    const disconnectSocket= useAppStore(state =>state.disconnectSocket)
useEffect(()=>{
    if(UNAUTHENTICATED_PATH.includes(pathname)) return
    async function  onLogout(){
      if(isPending) return
      try{
        await mutateAsync()
        setRole()
        router.push("/")
      }catch(error:any){
        handleErrorApi({
       error
        })
      }
      
    }
    socket?.on('logout',onLogout)
    return ()=>{
        socket?.off('logout',onLogout)
    }
},[socket,pathname,isPending,disconnectSocket,router,setRole])
    return null
}