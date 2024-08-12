'use client'
import { useGuestOrderListQuery } from '@/queries/useGuest'
import React, { useEffect, useMemo } from 'react'

import Image from 'next/image'
import {  formatCurrency,  getVietnameseOrderStatus } from './../../../lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { socket } from './../../../lib/socket';
import { UpdateOrderResType } from '@/schemaValidations/order.schema';
import { toast } from '@/components/ui/use-toast';
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
import { Button } from "@/components/ui/button"

const OrdersCart = () => {
  const {data,refetch} = useGuestOrderListQuery()
  const orders =data?.payload.data ??[]
  const totalPrice =useMemo(()=>{
    return orders.reduce((result,order)=>{

        return result + order.quantity * order.dishSnapshot.price
    },0)
},[orders,orders])
useEffect(() => {
  if (socket.connected) {
    onConnect();
  }

  function onConnect() {
    console.log(socket.id);
    
  }
  function onUpdateOrder(data:UpdateOrderResType['data']){
    const {dishSnapshot:{name}}=data
    toast({
      description:`Món ${name} (SL:${data.quantity}) vừa được cập nhật sang trạng thái ${getVietnameseOrderStatus(data.status)} `
    })
    refetch()
  }
  function onDisconnect() {
    console.log("disconect");
    
  }
socket.on('update-order',onUpdateOrder
)
  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
  };
}, [data]);
  return (
   <>
   {
    orders.map((order)=>(
      <div key={order.id} className='flex gap-4'>
      <div className='flex-shrink-0 relative'>
        <Image
          src={order.dishSnapshot.image}
          alt={order.dishSnapshot.name}
          height={100}
          width={100}
          quality={100}
          className='object-cover w-[80px] h-[80px] rounded-md'
        />
      </div>
      <div className='space-y-1'>
        <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
        <div className='text-xs font-semibold'>{formatCurrency(order.dishSnapshot.price)   }  x <Badge className="px-1 ml-2">{order.quantity}</Badge></div>
      </div>
      <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
      <p className='text-xs font-semibold'>{getVietnameseOrderStatus(order.status) }</p>
      </div>
    </div>
    ))
   }
   <div className='sticky bottom-0'>
        <Button className='w-full justify-between'>
          <span>Giá tiền · {orders.length}</span>
          <span>{formatCurrency(totalPrice) }</span>
        </Button>
      </div>
   </>
  )
}

export default OrdersCart