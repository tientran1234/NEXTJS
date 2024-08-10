import { checkAndRefreshToken, getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import  { useEffect } from 'react'
const UNAUTHENTICATED_PATH=['/login','/logout','/refresh-token']
const RefreshToken = () => {
    const pathname =  usePathname()
    const router = useRouter()
   
    useEffect(()=>{
        if(UNAUTHENTICATED_PATH.includes(pathname)) return
        let interval:any = null
       
                    checkAndRefreshToken({
                        onError:()=>{
                            clearInterval(interval)
                            router.push('/login')
                        }
                    })
                    interval = setInterval(()=>checkAndRefreshToken({
                        onError:()=>{
                            clearInterval(interval)
                            router.push('/login')
                        }
                    }),1000) 
                    return ()=> clearInterval(interval)
    },[pathname,router])
  return null
   
}

export default RefreshToken