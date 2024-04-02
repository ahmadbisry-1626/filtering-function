import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ProductSkeleton = () => {
    return (
        <div className='relative'>
            <Skeleton className='w-full overflow-hidden rounded-lg bg-gray-200 lg:h-80'>
                <Skeleton className='h-full w-full bg-gray-200'/>
            </Skeleton>

            <div className='mt-4 flex flex-col gap-2'>
                <Skeleton className='bg-gray-200 h-4 w-full'/>
                <Skeleton className='bg-gray-200 h-4 w-full'/>
            </div>
        </div>
    )
}

export default ProductSkeleton