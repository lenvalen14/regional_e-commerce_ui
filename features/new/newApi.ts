import { apiSlice } from "../../lib/api/apiSlice"

// ======================
// Interfaces
// ======================
export interface CategoryResponse {
    categoryId: string
    categoryName: string
}

export interface ImageOfNewResponse {
    imageId: string
    imageUrl: string
    typeContent: string
}

export type NewType =
    | "AM_THUC"
    | "VAN_HOA"
    | "DU_LICH"
    | "SUC_KHOE"
    | "CONG_THUC"
    | "LICH_SU"

export interface NewResponse {
    newId: string
    title: string
    content: string
    createAt: string
    updateAt: string
    type: NewType
    category: CategoryResponse
    images: ImageOfNewResponse[]
}

export interface ApiResponse<T> {
    code: number
    message: string
    data: T
    meta?: any
}

export interface PagedResponse<T> {
    code: number
    message: string
    data: T[]
    meta: {
        page: number
        size: number
        totalElements: number
        totalPages: number
        last: boolean
    }
}

// ======================
// API Slice
// ======================
export const newApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // CREATE
        createNews: builder.mutation<ApiResponse<NewResponse>, FormData>({
            query: (formData) => ({
                url: "/news",
                method: "POST",
                body: formData,
            }),
        }),

        // GET ALL
        getAllNews: builder.query<PagedResponse<NewResponse>, { page?: number; size?: number }>({
            query: ({ page = 0, size = 10 }) => `/news?page=${page}&size=${size}`,
        }),

        // GET BY ID
        getNewsById: builder.query<ApiResponse<NewResponse>, string>({
            query: (id) => `/news/${id}`,
        }),

        // UPDATE
        updateNews: builder.mutation<ApiResponse<NewResponse>, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/news/${id}`,
                method: "PUT",
                body: data,
            }),
        }),

        // DELETE
        deleteNews: builder.mutation<ApiResponse<boolean>, string>({
            query: (id) => ({
                url: `/news/${id}`,
                method: "DELETE",
            }),
        }),

        // GET BY CATEGORY
        getNewsByCategory: builder.query<PagedResponse<NewResponse>, { categoryId: string; page?: number; size?: number }>({
            query: ({ categoryId, page = 0, size = 10 }) =>
                `/news/by-category?categoryId=${categoryId}&page=${page}&size=${size}`,
        }),
    }),
})

// ======================
// Hooks Export
// ======================
export const {
    useCreateNewsMutation,
    useGetAllNewsQuery,
    useGetNewsByIdQuery,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
    useGetNewsByCategoryQuery,
} = newApi
