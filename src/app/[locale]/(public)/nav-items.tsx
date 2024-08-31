'use client'

import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import {Link, useRouter} from '@/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/components/app-provider'


const menuItems: { title: string, href: string, role?: RoleType[], hideWhenLogin?: boolean }[] = [
  {
    title: "Trang chủ",
    href: "/"
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders'
  },
  {
    title: 'Combo',
    href: '/combo'
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLogin: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {

  const role= useAppStore(state =>state.role)
  const setRole= useAppStore(state =>state.setRole)
  const disconnectSocket= useAppStore(state =>state.disconnectSocket)
  const logoutMutation = useLogoutMutation()
  const router = useRouter()
  const logout = async ()=>{
    if(logoutMutation.isPending) return
    try{
      await logoutMutation.mutateAsync()
      setRole(undefined)
      disconnectSocket()
      router.push('/')
    }catch(error:any){
      handleErrorApi({
          error
      })
    }
  }

  return (<>
    {
      menuItems.map((item) => {
        const isAuth = item.role && role && item.role.includes(role)
        const canShow = (item.role === undefined  && !item.hideWhenLogin ) || (!role && item.hideWhenLogin)
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }

        return null
      }
      )}
      {role &&
      <AlertDialog>
      <AlertDialogTrigger asChild>
      <div className={cn(className,'cursor-pointer')} >
              đăng xuất
            </div>
      
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có muốn đăng xuát không ?</AlertDialogTitle>
                <AlertDialogDescription>
                Việc đăng xuất có thể làm mất đi hóa đơn của bạn
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Thoát</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      }

  </>)
}
