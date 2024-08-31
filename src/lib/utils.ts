import { toast } from "@/components/ui/use-toast"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { UseFormSetError } from "react-hook-form"
import jwt from 'jsonwebtoken';
import authApiRequest from "@/apiRequests/auth"
import { OrderStatus, Role, TableStatus } from "@/constants/type"
import envConfig from "@/config"
import { TokenPayload } from "@/types/jwt.types"
import guestApiRequest from "@/apiRequests/guest"
import { format } from "date-fns"
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'
import slugify from "slugify"

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
export const setAccessTokenToLocalStorage = (value: string) => { return isBrower && localStorage.setItem("accessToken", value) }

export const setRefreshTokenToLocalStorage = (value: string) => { return isBrower && localStorage.setItem('refreshToken', value) }
export const removeTokensFromLocalStorage = () => {
  isBrower && localStorage.removeItem('accessToken')
  isBrower && localStorage.removeItem('refreshToken')
}
export const checkAndRefreshToken = async (params?: { onError?: () => void, onSuccess?: () => void, force?: boolean }) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)
  const now = (new Date().getTime() / 1000) - 1
  if (decodedRefreshToken.exp <= now) {

    removeTokensFromLocalStorage()

    return params?.onError && params.onError()

  }

  if (params?.force || (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3)) {
    try {
      const role = decodedRefreshToken.role
      const res = Role.Guest === role ? (await guestApiRequest.refreshToken()) : (await authApiRequest.refreshToken())

      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken
      )

      params?.onSuccess && params.onSuccess()
    } catch (
    error
    ) {
      console.log(error);

      params?.onError && params.onError()

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
export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}
export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}
export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}
export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}

export const wrapServerApi = async <T>(fn: () => Promise<T>) => {
  let result = null
  try {
    result = await fn()
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
  }
  return result

}
export const generateSlugUrl = ({
  name,
  id
}: {
  name: string,
  id: number
}) => {
  return `${slugify(name)}-i.${id}`
}
export const getIdFromSlugUrl = (slug: string) => {
  return Number(slug.split('-i.')[1])
}