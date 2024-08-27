"use client"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function Modal({children}:{
    children:React.ReactNode}) {
    const router = useRouter()
    const [open,setOpen] = useState(true)
      return (
    <Dialog open onOpenChange={open=>{
      setOpen(open)
        if(!open) router.back()
    }}>
     <DialogContent className="max-h-full overflow-auto">
    {children}
     </DialogContent>
    </Dialog>
  )
}
