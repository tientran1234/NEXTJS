import http from "@/lib/http";
import { CreateOrdersBodyType, CreateOrdersResType, GetOrderDetailResType, GetOrdersQueryParamsType, GetOrdersResType, PayGuestOrdersBodyType, PayGuestOrdersResType, UpdateOrderResType } from "@/schemaValidations/order.schema";
import queryString from 'query-string'

export const orderApiRequest ={
    createOrders:(body:CreateOrdersBodyType)=> http.post<CreateOrdersResType>('/orders',body),
getOrderList:(queryParams:GetOrdersQueryParamsType)=>http.get<GetOrdersResType>('/orders?'+queryString.stringify({fromDate:queryParams.fromDate?.toISOString(),toDate:queryParams.toDate?.toISOString()})),
updateOrder:(orderId:number,body:{status:string})=>http.put<UpdateOrderResType>(`/orders/${orderId}`,body),
getOrderDetail:(orderId:number)=>http.get<GetOrderDetailResType>(`/orders/${orderId}`),
pay:(body:PayGuestOrdersBodyType)=>http.post<PayGuestOrdersResType>(`/orders/pay`,body)
}