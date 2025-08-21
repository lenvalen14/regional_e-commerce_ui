import { apiSlice } from '../../lib/api/apiSlice'

export interface Region {
    regionId: string,
    regionName: string
}

export interface RegionFormData {
    regionId?: string,
    regionName?: string
}

export interface CreateRegionData {
    regionName: string
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

export interface RegionResponse {
    users: Region[]
    meta: {
        page: number
        size: number
        totalElements: number
        totalPages: number
        last: boolean
    }
}

export const regionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all regions with pagination
        getRegions: builder.query<ApiResponse<Region[]>, { page: number; size: number }>({
            query: ({ page, size }) => `/region?page=${page}&size=${size}`,
            providesTags: ['Region'],
        }),
    }),
})

export const {
    useGetRegionsQuery,
} = regionApi
