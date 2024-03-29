"use client"

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, Filter } from "lucide-react";
import { SORT_OPTIONS } from "@/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QueryResult } from "@upstash/vector";
import Product from "@/components/Products/Product";
import type { Product as TProduct } from '@/db'
import ProductSkeleton from "@/components/Products/ProductSkeleton";


export default function Home() {
  const [filter, setFilter] = useState({
    sort: 'none',
  })

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<TProduct>[]>(
        'http://localhost:3000/api/products', {
        filter: {
          sort: filter.sort,
        }
      }
      )

      return data
    }
  })

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">
          High-quality actrees selection
        </h1>

        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="group transition duration-200 ease-in-out inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 gap-1">
              Sort
              <ChevronDownIcon className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 transition duration-200 ease-in-out" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex gap-2 flex-col">
              {SORT_OPTIONS.map((sort) => (
                <DropdownMenuItem className={cn('text-sm w-full text-left rounded-sm', {
                  'text-gray-900 font-medium bg-gray-100': sort.value === filter.sort,
                  'text-gray-500': sort.value !== filter.sort
                })} key={sort.name}>
                  <button
                    key={sort.name}
                    onClick={() => {
                      setFilter((prev) => ({
                        ...prev,
                        sort: sort.value
                      }))
                    }} className="w-full text-left px-4 py-2">
                    {sort.name}
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>


          {/* NAVBAR ON SMALL DEVICES */}
          <button className="text-gray-400 hover:text-gray-500 lg:hidden flex">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-8 gap-y-10 lg:grid-cols-4">
          {/* filter */}
          <div></div>

          {/* product grid */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products ? products.map((product) => (
              <Product product={product.metadata!} />
            )) :
              new Array(12).fill(null).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
