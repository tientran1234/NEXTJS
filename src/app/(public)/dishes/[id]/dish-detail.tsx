
import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
const DishDetail =async ({dish}:{
    dish:DishResType['data'] |undefined
}) => { 
  if(!dish) return <div>
      <h1 className="text-2xl lg:text-3xl font-semibold">Món Ăn Không Tồn Tại</h1>
  </div>
    
    
  return (
    <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
        <div className='font-semibold'>
                  
                Giá: {formatCurrency(dish.price)}
                </div>
                <Image
                  alt={dish.name}
                  width={700}
                  height={150}
                  quality={100}  
                    src={dish.image}
                    className='object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md'
                  />
                  <p>{dish.description}</p>
    </div>
  ) 
}

export default DishDetail