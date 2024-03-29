import { Product } from '@/db'
import Image from 'next/image'

const Product = ({product}: {product: Product}) => {
  return (
    <div className='group relative flex flex-col gap-4 bg-gray-50 shadow-md rounded-lg'>
        <div className='w-full overflow-hidden bg-gray-200 group-hover:opacity-75 lg:h-80 rounded-t-lg'>
            <img src={product.imageId} alt='' className='h-full w-full object-cover object-center'/>
        </div>

        <div className='flex justify-between px-4 pb-4'>
            <div className='flex flex-col gap-1'>
                <h3 className='text-sm text-gray-700'>
                    {product.name}
                </h3>
                <p className='text-sm text-gray-500'>
                    Size: {product.size.toUpperCase()}, {product.color}
                </p>
            </div>

            <p className='text-sm font-medium text-gray-900'>
                ${product.price}
            </p>
        </div>
    </div>
  )
}

export default Product