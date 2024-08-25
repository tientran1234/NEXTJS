import { usePathname ,useRouter} from "next/navigation"
import { useEffect } from "react"
import type { Socket } from "socket.io-client"
import { useLogoutMutation } from '@/queries/useAuth';
import { handleErrorApi } from "@/lib/utils";
import { useAppContext } from "./app-provider";
const UNAUTHENTICATED_PATH = ['/login','/logout','/refresh-token']
export default function ListenLogoutSocket(){
    const pathname = usePathname()
    const router = useRouter()
    const {isPending,mutateAsync} = useLogoutMutation()
    const {setRole,socket,disconnectSocket} =useAppContext()
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