"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, Filter } from "lucide-react";
import { COLOR_FILTERS, PRICE_FILTERS, SIZE_FILTERS, SORT_OPTIONS, SUB_CATEGORIES } from "@/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QueryResult } from "@upstash/vector";
import Product from "@/components/Products/Product";
import type { Product as TProduct } from '@/db'
import ProductSkeleton from "@/components/Products/ProductSkeleton";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ProductState } from "@/lib/validators/product-validator";

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number]

export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    color: ["white", "beige", "blue", "purple", "green"],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ["S", "M", "L"],
    sort: 'none',
  })

  console.log(filter)

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

  const applyArrayFilter = ({
    category, value }: {
      category: keyof Omit<typeof filter, "price" | "sort">
      value: string
    }
  ) => {
    const isFilterApplied = filter[category].includes(value as never)

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value)
      }))
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value]
      }))
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">
          High-quality actrees selection
        </h1>

        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="group transition duration-200 ease-in-out inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 gap-1">
              Price
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
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {SUB_CATEGORIES.map((category) => (
                <li key={category.name}>
                  <button className="disabled:cursor-not-allowed disabled:opacity-60" disabled={!category.selected}>
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            <Accordion type="multiple">

              {/* COLOR FILTER */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500 hover:no-underline">
                  <span className="font-medium text-gray-900">Color</span>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <ul className="flex flex-col gap-2">
                    {COLOR_FILTERS.options.map((itemOptions, optionIdx) => (
                      <li key={itemOptions.value}
                        className="flex gap-3 items-center select-none">
                        <input
                          type="checkbox"
                          id={`color-${optionIdx}`}
                          onChange={() => {
                            applyArrayFilter({
                              category: "color",
                              value: itemOptions.value
                            })
                          }}
                          checked={filter.color.includes(itemOptions.value)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700" />

                        <label htmlFor={`color-${optionIdx}`}
                          className="text-sm text-gray-600">
                          {itemOptions.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* SIZE FILTER */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500 hover:no-underline">
                  <span className="font-medium text-gray-900">Size</span>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <ul className="flex flex-col gap-2">
                    {SIZE_FILTERS.options.map((itemOptions, optionIdx) => (
                      <li key={itemOptions.value}
                        className="flex gap-3 items-center select-none">
                        <input
                          type="checkbox"
                          id={`size-${optionIdx}`}
                          onChange={() => {
                            applyArrayFilter({
                              category: "size",
                              value: itemOptions.value
                            })
                          }}
                          checked={filter.size.includes(itemOptions.value)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700" />

                        <label htmlFor={`size-${optionIdx}`}
                          className="text-sm text-gray-600">
                          {itemOptions.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* PRICE FILTER */}
              <AccordionItem value="price">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500 hover:no-underline">
                  <span className="font-medium text-gray-900">Price</span>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <ul className="flex flex-col gap-2">
                    {PRICE_FILTERS.options.map((itemOptions, optionIdx) => (
                      <li key={itemOptions.label}
                        className="flex gap-3 items-center select-none">
                        <input
                          type="radio"
                          id={`price-${optionIdx}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...itemOptions.value]
                              }
                            }))
                          }}
                          checked={
                            !filter.price.isCustom && filter.price.range[0] === itemOptions.value[0] && filter.price.range[1] === itemOptions.value[1]
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700" />

                        <label htmlFor={`price-${optionIdx}`}
                          className="text-sm text-gray-600">
                          {itemOptions.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* product grid */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products ? products.map((product) => (
              <Product product={product.metadata!} key={product.id} />
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
