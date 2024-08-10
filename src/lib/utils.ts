import { toast } from "@/components/ui/use-toast"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { UseFormSetError } from "react-hook-form"
import  jwt  from 'jsonwebtoken';
import authApiRequest from "@/apiRequests/auth"
import { OrderStatus, TableStatus } from "@/constants/type"
import envConfig from "@/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const DishStatus = {
  Available: 'Available',
  Unavailable: 'Unavailable',
  Hidden: 'Hidden'
} as const

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}
export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000
    })
  }
}
const isBrower = typeof window !== 'undefined'


export const getAccessTokenFromLocalStorage = () => { return isBrower ? localStorage.getItem("accessToken") : null }

export const getRefreshTokenFromLocalStorage = () => { return isBrower ? localStorage.getItem('refreshToken') : null }
export const setAccessTokenToLocalStorage = (value:string) => { return isBrower && localStorage.setItem("accessToken",value)  }

export const setRefreshTokenToLocalStorage = (value:string) => { return isBrower && localStorage.setItem('refreshToken',value)  }
export const removeTokensFromLocalStorage = () =>{
  isBrower && localStorage.removeItem('accessToken')
  isBrower && localStorage.removeItem('refreshToken')
}
export const checkAndRefreshToken = async(param?:{onError?:()=>void,onSuccess?:()=>void})=>{
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if(!accessToken ||!refreshToken) return
  const decodedAccessToken = jwt.decode(accessToken) as { exp: number,iat:number }
  const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number,iat:number }
  const now = (new Date().getTime()/1000)-1
  if(decodedRefreshToken.exp<=now) {
    removeTokensFromLocalStorage()
    return  param?.onError && param.onError()
    
  }
  if(decodedAccessToken.exp - now < (decodedAccessToken.exp-decodedAccessToken.iat)/3)
  {
      try {
          const res = await authApiRequest.refreshToken()
          setAccessTokenToLocalStorage(res.payload.data.accessToken)
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken
          )
          param?.onSuccess && param.onSuccess()
      } catch (
          error
      ) {
        param?.onError && param.onError()

      }
  }
          }
          export const formatCurrency = (number: number) => {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(number)
          }
          
          export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
            switch (status) {
              case DishStatus.Available:
                return 'Có sẵn'
              case DishStatus.Unavailable:
                return 'Không có sẵn'
              default:
                return 'Ẩn'
            }
          }
          
export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}
