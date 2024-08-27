'use client'
import { useEffect, useRef } from 'react';
import { useAppStore } from './../../../../../components/app-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { decodeToken, genarateSocketInstance } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useSetTokenToCookieMutation } from '@/queries/useAuth';
export default function OAuthPage(){
    const setRole= useAppStore(state =>state.setRole)
    const setSocket= useAppStore(state =>state.setSocket)
    const {mutateAsync}= useSetTokenToCookieMutation()
    const searchParams = useSearchParams()
    const count = useRef(0)
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const message = searchParams.get('message')
    const router = useRouter()
    useEffect(()=>{
        if(accessToken && refreshToken){
            if(count.current ===0){
                const {role}= decodeToken(accessToken)
                
                mutateAsync({accessToken,refreshToken}).then(()=>{
                    setRole(role)
                setSocket(genarateSocketInstance(accessToken))
                    router.push("/manage/dashboard")
                }).catch(e=>{
                    toast({
                        description:e.message || 'có lỗi xảy ra'
                 })
                })
            }
            }else{
                
                
                if(count.current===0){
                  setTimeout(()=> {
                        toast({
                        description:message || 'có lỗi xảy ra'
                      
                 })
                })
                }
               count.current++
            }
         
            
         

    },[accessToken,refreshToken,setRole,setSocket,router,message,mutateAsync])
    return null
}