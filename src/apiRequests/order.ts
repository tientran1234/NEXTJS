import http from "@/lib/http";
import { GetOrdersResType, UpdateOrderResType } from "@/schemaValidations/order.schema";

export const orderApiRequest ={
getOrderList:()=>http.get<GetOrdersResType>('/orders'),
updateOrder:(orderId:number,body:{status:string})=>http.put<UpdateOrderResType>(`/orders/${orderId}`,body)
}