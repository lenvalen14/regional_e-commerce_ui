import { apiSlice } from '../../lib/api/apiSlice'
import { Category } from '../category/categoryApi'
import { Region } from '../region'

export interface ImageProductResponse {
    imageId: string
    imageUrl: string
}

export interface Product {
    productId: string
    productName: string
    price: number
    description: string
    stockQuantity: number
    rating: number
    category: Category
    region: Region
    imageProductResponseList: ImageProductResponse[]
}

export interface ProductFormData {
    productName?: string
    price?: number
    description?: string
    stockQuantity?: number
    rating?: number
}

export interface CreateProductData {
    productName: string
    price: number
    description: string
    stockQuantity: number
    rating: number
    imageProductResponseList?: ImageProductResponse[]
}

export interface ApiResponse<T> {
    message: string
    code: number
    data: T
    meta?: {
        page: number
        size: number
        totalElements: number
        totalPages: number
        last: boolean
    }
}

export interface ProductsResponse {
    products: Product[]
    meta: {
        page: number
        size: number
        totalElements: number
        totalPages: number
        last: boolean
    }
}

export const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all with pagination
        getProducts: builder.query<ApiResponse<Product[]>, { page: number; size: number }>({
            query: ({ page, size }) => `/products?page=${page}&size=${size}`,
            providesTags: ['Product'],
        }),
        getProduct: builder.query<ApiResponse<Product>, string>({
            query: (productId) => `/products/${productId}`,
            providesTags: ['Product'],
        }),
        // Create new product
        createProduct: builder.mutation<ApiResponse<Product>, CreateProductData>({
            query: (productData) => ({
                url: '/products',
                method: 'POST',
                body: productData,
            }),
            invalidatesTags: ['Product'],
        }),

        // Update product
        updateProduct: builder.mutation<ApiResponse<Product>, { productId: string; productData: Partial<Product> }>({
            query: ({ productId, productData }) => ({
                url: `/products/${productId}`,
                method: 'PUT',
                body: productData,
            }),
            invalidatesTags: ['Product'],
        }),

        deleteProduct: builder.mutation<ApiResponse<void>, string>({
            query: (productId) => ({
                url: `/products/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi
