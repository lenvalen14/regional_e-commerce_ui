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
    deleted: boolean
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
    categoryId: string
    regionId: string
    price: number
    description: string
    stockQuantity: number
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

export interface ProductWithStatus extends Product {
    status: "In Stock" | "Low Stock" | "Out of Stock"
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

        getProductsByCategory: builder.query<ApiResponse<Product[]>, { categoryId: string }>({
            query: ({ categoryId }) => `/products/category/${categoryId}`,
            providesTags: ['Product'],
        }),

        // Create new product
        createProduct: builder.mutation<ApiResponse<Product>, FormData>({
            query: (formData) => ({
                url: "/products",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Product"],
        }),

        // Update product
        updateProduct: builder.mutation<
            ApiResponse<Product>,
            { productId: string; productData: Partial<CreateProductData>; images?: File[] }
        >({
            query: ({ productId, images, ...rest }) => {
                const formData = new FormData();

                // Thêm các trường bình thường
                Object.entries(rest.productData || {}).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                });

                // Thêm ảnh (nếu có)
                if (images) {
                    images.forEach((file) => {
                        formData.append("files", file); // Lưu ý: backend dùng @RequestPart List<MultipartFile> files
                    });
                }

                return {
                    url: `/products/${productId}`,
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: ["Product"],
        }),

        softDeleteProduct: builder.mutation<ApiResponse<void>, string>({
            query: (productId) => ({
                url: `/products/soft-delete/${productId}`,
                method: 'PUT',
            }),
            invalidatesTags: ['Product'],
        }),

        restoreProduct: builder.mutation<ApiResponse<void>, string>({
            query: (productId) => ({
                url: `/products/restore/${productId}`,
                method: 'PUT',
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
    useGetProductsByCategoryQuery,
    useSoftDeleteProductMutation,
    useRestoreProductMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi
