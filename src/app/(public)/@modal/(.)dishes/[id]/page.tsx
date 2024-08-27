
import { dishApiRequest } from "@/apiRequests/dish";
import {  wrapServerApi } from "@/lib/utils";
import { Modal } from "./modal";
import DishDetail from "../../../dishes/[id]/dish-detail";
const Combo =async ({params:{id}}:{
    params:{
        id:string
    }
}) => {
    const data = await wrapServerApi(()=> dishApiRequest.getDish(Number(id)))
  const dish=data?.payload?.data
 return (
  <div>
    <Modal children={<DishDetail dish={dish}/>}/>
  </div>
  
 )
}

export default Combo