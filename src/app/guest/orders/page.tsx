import React from 'react'
import OrdersCart from './orders-cart'


const OrdersPage= () => {
  return (
    <div>
         <div className='max-w-[400px] mx-auto space-y-4'>
    <h1 className='text-center text-xl font-bold'>🍕 Đơn Hàng</h1>
   <OrdersCart/>
    
  </div>
    </div>
  )
}

export default OrdersPage