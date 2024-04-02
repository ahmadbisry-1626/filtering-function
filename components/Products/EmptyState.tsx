import { XCircle } from 'lucide-react'
import React from 'react'

const EmptyState = () => {
  return (
    <div className='relative col-span-full h-80 bg-gray-50 w-full p-12 flex-col flex items-center justify-center gap-2'>
      <XCircle className='h-12 w-12 text-red-500'/>
      <h3 className='font-semibold text-[36px]'>No products found</h3>
      <p className='text-zinc-500 text-[16px]'>We found no search results for these filters</p>
    </div>
  )
}

export default EmptyState