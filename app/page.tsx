"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, Filter, Palette, Pipette } from "lucide-react";
import { COLOR_FILTERS, PRICE_FILTERS, SIZE_FILTERS, SORT_OPTIONS, SUB_CATEGORIES } from "@/constants";
import { useCallback, useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import debounce from "lodash.debounce"
import EmptyState from "@/components/Products/EmptyState";

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number]

export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    color: ["white", "beige", "blue", "purple", "green"],
    price: {
      isCustom: false,
      range: DEFAULT_CUSTOM_PRICE
    },
    size: ["S", "M", "L"],
    sort: 'none',
  })

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<TProduct>[]>(
        'http://localhost:3000/api/products', {
        filter: {
          sort: filter.sort,
          color: filter.color,
          size: filter.size,
          price: filter.price.range
        }
      }
      )

      return data
    }
  })

  const onSubmit = () => refetch()

  const debounceSubmit = debounce(onSubmit, 400)
  const _debounceSubmit = useCallback(debounceSubmit, [])

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

    _debounceSubmit()
  }

  const minPrice = Math.min(filter.price.range[0], filter.price.range[1])
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1])

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-[200px]">
      <section className="flex items-baseline justify-between flex-col lg:flex-row w-full border-b border-gray-200 pb-6 pt-24 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">
          High-quality actrees selection
        </h1>

        {/* SORTING ON LARGE DEVICES */}
        <DropdownMenu>
          <DropdownMenuTrigger className="group transition duration-200 ease-in-out inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 gap-1 max-lg:hidden">
            <div className="hidden lg:flex">
              {filter.sort === "none"
                ? <span>Price</span>
                : filter.sort === "price-asc"
                  ? <span>Price: Low to High</span>
                  : <span>Price: High to Low</span>}
            </div>

            <span className="flex lg:hidden">Sort</span>
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
                    _debounceSubmit()
                  }}
                  className="w-full text-left px-4 py-2">
                  {sort.name}
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* SORTING ON SMALL DEVICES ITS HIDDEN */}
        <div className="flex items-center w-full justify-between gap-2 md:gap-4 lg:hidden">
          <div className="flex gap-4">
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
                        _debounceSubmit()
                      }}
                      className="w-full text-left px-4 py-2">
                      {sort.name}
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/*PRICE FILTER ON SMALL DEVICES */}
            <div className="flex lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm flex gap-1">
                  Price
                  <ChevronDownIcon className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 transition duration-200 ease-in-out" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <ul className="flex flex-col gap-4 p-4">
                    {PRICE_FILTERS.options.map((price, i) => (
                      <li className="flex items-center gap-2" key={price.label}>
                        <input
                          type="radio"
                          id={`price-${i}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...price.value]
                              }
                            }))
                            _debounceSubmit()
                          }}
                          checked={
                            !filter.price.isCustom && filter.price.range[0] === price.value[0] && filter.price.range[1] === price.value[1]
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700" />

                        <label htmlFor={`price-${i}`}
                          className="text-sm text-gray-600">
                          {price.label}
                        </label>
                      </li>
                    ))}

                    <li className="flex gap-3 justify-center flex-col select-none">
                      <div className="flex gap-2 items-center">
                        <input
                          type="radio"
                          id={`price-${PRICE_FILTERS.options.length}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 100]
                              }
                            }))
                          }}
                          checked={filter.price.isCustom}
                          className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700" />

                        <label htmlFor={`price-${PRICE_FILTERS.options.length}`}
                          className="text-sm text-gray-600">
                          Custom Price
                        </label>
                      </div>

                      {filter.price.isCustom === true &&
                        <>
                          <div className="flex justify-between gap-3 max-lg:text-sm">
                            <p className="font-medium">Range</p>

                            $
                            {filter.price.isCustom
                              ? minPrice.toFixed(0)
                              : filter.price.range[0].toFixed(0)
                            } - {' '} $

                            {filter.price.isCustom
                              ? maxPrice.toFixed(0)
                              : filter.price.range[1].toFixed(0)
                            }
                          </div>

                          <Slider
                            defaultValue={DEFAULT_CUSTOM_PRICE}
                            min={DEFAULT_CUSTOM_PRICE[0]}
                            max={DEFAULT_CUSTOM_PRICE[1]}
                            step={5}
                            onValueChange={(range) => {
                              const [newMin, newMax] = range

                              setFilter((prev) => ({
                                ...prev,
                                price: {
                                  isCustom: true,
                                  range: [newMin, newMax]
                                }
                              }))

                              _debounceSubmit()
                            }}
                            value={filter.price.isCustom
                              ? filter.price.range
                              : DEFAULT_CUSTOM_PRICE
                            } />
                        </>
                      }
                    </li>
                  </ul>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex gap-4">
            {/*COLOR FILTER ON SMALL DEVICES */}
            <div className="flex lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm flex gap-1">
                  Color
                  <ChevronDownIcon className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 transition duration-200 ease-in-out" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <ul className="flex flex-col gap-4 p-2">
                    {COLOR_FILTERS.options.map((color, i) => (
                      <li className="flex items-center gap-2" key={color.value}>
                        <input
                          type="checkbox"
                          id={`color-${i}`}
                          onChange={() => {
                            applyArrayFilter({
                              category: "color",
                              value: color.value
                            })
                          }}
                          checked={filter.color.includes(color.value)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700" />

                        <label htmlFor={`color-${i}`}
                          className="text-sm text-gray-600">
                          {color.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/*SIZE FILTER ON SMALL DEVICES */}
            <div className="flex lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm flex gap-1">
                  Size
                  <ChevronDownIcon className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 transition duration-200 ease-in-out" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <ul className="flex flex-col gap-4 p-2">
                    {SIZE_FILTERS.options.map((size, i) => (
                      <li className="flex items-center gap-2" key={size.value}>
                        <input
                          type="checkbox"
                          id={`size-${i}`}
                          onChange={() => {
                            applyArrayFilter({
                              category: "size",
                              value: size.value
                            })
                          }}
                          checked={filter.size.includes(size.value)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700" />

                        <label htmlFor={`size-${i}`}
                          className="text-sm text-gray-600">
                          {size.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

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

                            _debounceSubmit()
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

                    <li className="flex gap-3 justify-center flex-col select-none">
                      <div className="flex gap-3 items-center">
                        <input
                          type="radio"
                          id={`price-${PRICE_FILTERS.options.length}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 100]
                              }
                            }))
                          }}
                          checked={filter.price.isCustom}
                          className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700" />

                        <label htmlFor={`price-${PRICE_FILTERS.options.length}`}
                          className="text-sm text-gray-600">
                          Custom Price
                        </label>
                      </div>

                      {filter.price.isCustom === true &&
                        <>
                          <div className="flex justify-between gap-3">
                            <p className="font-medium">Price</p>

                            $
                            {filter.price.isCustom
                              ? minPrice.toFixed(0)
                              : filter.price.range[0].toFixed(0)
                            } - {' '} $

                            {filter.price.isCustom
                              ? maxPrice.toFixed(0)
                              : filter.price.range[1].toFixed(0)
                            }
                          </div>

                          <Slider
                            defaultValue={DEFAULT_CUSTOM_PRICE}
                            min={DEFAULT_CUSTOM_PRICE[0]}
                            max={DEFAULT_CUSTOM_PRICE[1]}
                            step={5}
                            onValueChange={(range) => {
                              const [newMin, newMax] = range

                              setFilter((prev) => ({
                                ...prev,
                                price: {
                                  isCustom: true,
                                  range: [newMin, newMax]
                                }
                              }))

                              _debounceSubmit()
                            }}
                            value={filter.price.isCustom
                              ? filter.price.range
                              : DEFAULT_CUSTOM_PRICE
                            } />
                        </>
                      }
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* product grid */}

          <ul className={`lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ${products && products.length <= 3 ? 'max-h-[400px]' : ''}`}>
            {products && products.length === 0 ? <EmptyState />
              : products ? products.map((product) => (
                <Product product={product.metadata!} key={product.id} />
              ))
                : new Array(12).fill(null).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
