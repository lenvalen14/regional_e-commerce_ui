import { apiSlice } from '../../lib/api/apiSlice'

export interface Category {
    categoryId: string,
    categoryName: string
    description: string
    productCount: number
}

export interface CategoryFormData {
    categoryId?: string,
    categoryName?: string
    description?: string
    productCount?: number
}

export interface CreateCategoryData {
    categoryName: string
    description: string
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

export interface CategoryResponse {
    users: Category[]
    meta: {
        page: number
        size: number
        totalElements: number
        totalPages: number
        last: boolean
    }
}

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all with pagination
        getCategories: builder.query<ApiResponse<Category[]>, { page: number; size: number }>({
            query: ({ page, size }) => `/category?page=${page}&size=${size}`,
            providesTags: ['Category'],
        }),

        // Create new category
        createCategory: builder.mutation<ApiResponse<Category>, CreateCategoryData>({
            query: (categoryData) => ({
                url: '/category',
                method: 'POST',
                body: categoryData,
            }),
            invalidatesTags: ['Category'],
        }),

        // Update category
        updateCategory: builder.mutation<ApiResponse<Category>, { categoryId: string; categoryData: Partial<Category> }>({
            query: ({ categoryId, categoryData }) => ({
                url: `/category/${categoryId}`,
                method: 'PUT',
                body: categoryData,
            }),
            invalidatesTags: ['Category'],
        }),

        deleteCategory: builder.mutation<ApiResponse<void>, string>({
            query: (categoryId) => ({
                url: `/category/${categoryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
})

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi
