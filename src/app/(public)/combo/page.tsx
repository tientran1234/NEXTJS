import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div>
        <Link href={`/dishes/${1}`}>
        combo</Link>
    </div>
  )
}

export default Page