import React, { Suspense } from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
  )
}

export default Layout