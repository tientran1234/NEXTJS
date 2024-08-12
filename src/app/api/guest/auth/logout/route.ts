
import guestApiRequest from "@/apiRequests/guest";
import { cookies } from "next/headers";
export async function POST(request: Request) {
    
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const refreshToken = cookieStore.get('refreshToken')?.value
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    if(!accessToken|| !refreshToken){
        return Response.json({
            message:'CAN NOT RECIEVE ACCESSTOKEN AND REFRSHTOKEN',
            
        },{
            status:200
        })
    }
    try {
        const result = await guestApiRequest.sLogout({
            accessToken,
            refreshToken
        })
       
        return Response.json(result.payload)
    } catch (error) {
            return Response.json({
                message: "ERROR WHEN CALL API SERVER BACKEND"
            }, {
                status: 200
            })
        }
    }