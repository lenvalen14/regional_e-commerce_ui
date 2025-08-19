import { apiSlice } from '../../lib/api/apiSlice'

// ======================
// Interfaces
// ======================
export interface ReviewCreateRequest {
    rating: number
    comment: string
    productId: string
}

export interface ReviewStats {
    totalReviews: number
    averageRating: number
    fiveStarCount: number
    fourStarCount: number
    oneStarCount: number
    threeStarCount: number
    twoStarCount: number
    uniqueCustomers: number
}

export interface ReviewUpdateRequest {
    rating?: number
    comment?: string
}

export interface ReviewResponse {
    reviewId: string
    rating: number
    comment: string
    createAt: string
    updateAt: string
    user: {
        userId: string
        userName: string
        email: string
        avatar?: string
    }
    product: {
        productId: string
        productName: string
    }
}

export interface PagedResponse<T> {
    code: number
    message: string
    data: {
        content: T[]
        meta: {
            pageNumber: number
            pageSize: number
            totalElements: number
            totalPages: number
        }
    }
}

export interface ApiResponse<T> {
    code: number
    message: string
    data: T
}

export const reviewApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createReview: builder.mutation<ApiResponse<ReviewResponse>, ReviewCreateRequest>({
            query: (review) => ({
                url: '/reviews',
                method: 'POST',
                body: review,
            }),
        }),
        getGlobalReviewStats: builder.query<ReviewStats, void>({
            query: () => `/reviews/stats`,
            transformResponse: (response: {
                code: number
                message: string
                data: ReviewStats
                meta: any
            }) => {
                return response.data
            },
        }),

        getReviewById: builder.query<ApiResponse<ReviewResponse>, string>({
            query: (id) => `/reviews/${id}`,
        }),

        getAllReviews: builder.query<PagedResponse<ReviewResponse>, { page?: number; size?: number }>({
            query: ({ page = 0, size = 10 }) => `/reviews?page=${page}&size=${size}`,
        }),

        updateReview: builder.mutation<ApiResponse<ReviewResponse>, { id: string; data: ReviewUpdateRequest }>({
            query: ({ id, data }) => ({
                url: `/reviews/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),

        deleteReview: builder.mutation<void, string>({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: 'DELETE',
            }),
        }),

        getReviewsByProduct: builder.query<
            { reviews: ReviewResponse[]; meta: any },
            { productId: string; page?: number; size?: number }
        >({
            query: ({ productId, page = 0, size = 10 }) =>
                `/reviews/by-product?productId=${productId}&page=${page}&size=${size}`,
            transformResponse: (response: {
                code: number
                message: string
                data: ReviewResponse[]
                meta: any
            }) => {
                return {
                    reviews: response.data,
                    meta: response.meta
                }
            },
        }),


        getReviewsByUser: builder.query<PagedResponse<ReviewResponse>, { userId: string; page?: number; size?: number }>({
            query: ({ userId, page = 0, size = 10 }) =>
                `/reviews/by-user?userId=${userId}&page=${page}&size=${size}`,
        }),

        getReviewByProductAndUser: builder.query<ApiResponse<ReviewResponse>, { productId: string; userId: string }>({
            query: ({ productId, userId }) =>
                `/reviews/by-product-and-user?productId=${productId}&userId=${userId}`,
        }),

        getAverageRatingByProduct: builder.query<ApiResponse<number>, string>({
            query: (productId) => `/reviews/average-rating?productId=${productId}`,
        }),

        getReviewCountByProduct: builder.query<ApiResponse<number>, string>({
            query: (productId) => `/reviews/count?productId=${productId}`,
        }),

        getReviewsByRatingAndCategory: builder.query<
            { reviews: ReviewResponse[]; meta: any },
            { rating?: number; categoryId?: string; page?: number; size?: number }
        >({
            query: ({ rating, categoryId, page = 0, size = 10 }) => {
                const params = new URLSearchParams();
                if (rating !== undefined) params.append("rating", rating.toString());
                if (categoryId) params.append("categoryId", categoryId);
                params.append("page", page.toString());
                params.append("size", size.toString());

                return `/reviews/filter?${params.toString()}`;
            },
            transformResponse: (response: {
                code: number;
                message: string;
                data: ReviewResponse[];
                meta: any;
            }) => ({
                reviews: response.data,
                meta: response.meta,
            }),
        }),
    }),
})

export const {
    useCreateReviewMutation,
    useGetReviewByIdQuery,
    useGetAllReviewsQuery,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useGetReviewsByProductQuery,
    useGetReviewsByUserQuery,
    useGetReviewByProductAndUserQuery,
    useGetAverageRatingByProductQuery,
    useGetReviewCountByProductQuery,
    useGetReviewsByRatingAndCategoryQuery,
    useGetGlobalReviewStatsQuery,
} = reviewApi
