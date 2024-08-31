'use client'
import { useGuestOrderListQuery } from '@/queries/useGuest'
import React, { useEffect, useMemo } from 'react'

import Image from 'next/image'
import {  formatCurrency,  getVietnameseOrderStatus } from '../../../../lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PayGuestOrdersResType, UpdateOrderResType } from '@/schemaValidations/order.schema';
import { toast } from '@/components/ui/use-toast';
import { OrderStatus } from '@/constants/type';
import { useAppStore } from '@/components/app-provider';

const OrdersCart = () => {
  const {data,refetch} = useGuestOrderListQuery()
  const socket= useAppStore(state =>state.socket)
  const orders =useMemo(()=>data?.payload.data ??[],[data])
  const {waitingForPaying,paid} =useMemo(()=>{
    return orders.reduce((result,order)=>{
      if(order.status ===OrderStatus.Delivered || order.status === OrderStatus.Processing || order.status ===OrderStatus.Pending){
        return {
          ...result,
          waitingForPaying:{
            price:result.waitingForPaying.price + order.dishSnapshot.price * order.quantity,
            quantity:result.waitingForPaying.quantity +order.quantity
          }
        }
      }
     if(order.status ===OrderStatus.Paid){
      return {
        ...result,
        paid:{
            price:result.paid.price + order.dishSnapshot.price * order.quantity,
            quantity:result.paid.quantity +order.quantity
        }
      }
     }
     return result
    },{
      waitingForPaying:{
        price:0,
        quantity:0
      },
      paid:{
        price:0,
        quantity:0
      }
    })
},[orders])
useEffect(() => {
  if (socket?.connected) {
    onConnect();
  }

  function onConnect() {
    console.log(socket?.id);
    
  }
  function onUpdateOrder(data:UpdateOrderResType['data']){
    const {dishSnapshot:{name}}=data
    toast({
      description:`Món ${name} (SL:${data.quantity}) vừa được cập nhật sang trạng thái ${getVietnameseOrderStatus(data.status)} `
    })
    refetch()
  }
  function onPayment(data:PayGuestOrdersResType['data']){
    const {guest} = data[0]
    toast({
      description:`${guest?.name} tại bàn ${guest?.tableNumber} vừa thanh toán ${data.length} đơn `
    })
    refetch()
  }
  function onDisconnect() {
    console.log("disconect");
    
  }
socket?.on('update-order',onUpdateOrder
)
  socket?.on("connect", onConnect);
  socket?.on("disconnect", onDisconnect);
  socket?.on("payment", onPayment);
  

  return () => {
    socket?.off("connect", onConnect);
    socket?.off("disconnect", onDisconnect);
    socket?.off('update-order',onUpdateOrder
    )
    socket?.off("payment", onPayment);
  
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
          <span>Đơn đã thanh toán · {paid.quantity}</span>
          <span>{formatCurrency(paid.price) }</span>
        </Button>
        <Button className='w-full justify-between mt-4'>
          <span>Đơn chưa thanh toán · {waitingForPaying.quantity}</span>
          <span>{formatCurrency(waitingForPaying.price) }</span>
        </Button>
      </div>
   </>
  )
}

export default OrdersCart