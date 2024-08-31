import { Suspense } from "react";

import { Metadata } from "next";
import RefreshToken from "./refresh-token";
export const metadata:Metadata={
  title:'Refresh token Redirect',
  description:'Refresh token Redirect',
  robots:{
    index:false
  }
}
export default function LogoutPage(){
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken/>
    </Suspense>
  )
}