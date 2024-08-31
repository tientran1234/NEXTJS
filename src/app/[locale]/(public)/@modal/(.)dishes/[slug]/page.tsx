
import { dishApiRequest } from "@/apiRequests/dish";
import {  getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import { Modal } from "./modal";
import DishDetail from "../../../dishes/[slug]/dish-detail";
const Combo =async ({params:{slug}}:{
    params:{
        slug:string
    }
}) => {
  const id = getIdFromSlugUrl(slug)
    const data = await wrapServerApi(()=> dishApiRequest.getDish(Number(id)))
  const dish=data?.payload?.data
 return (
  <div>
    <Modal ><DishDetail dish={dish}/></Modal>
  </div>
  
 )
}

export default Combo