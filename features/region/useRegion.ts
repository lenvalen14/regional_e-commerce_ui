'use client';

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../lib/store"
import {
    Region,
    useGetRegionsQuery,
} from "../../features/region"
import {
    setSelectedRegion,
    setCurrentPage,
    setPageSize,
    resetRegionState,
} from "../../features/region/regionSlice"

export function useRegions() {
    const dispatch = useDispatch()

    // Get state from Redux store
    const {
        selectedRegion,
        currentPage,
        pageSize,
    } = useSelector((state: RootState) => state.region)

    // RTK Query hooks
    const {
        data: regionsResponse,
        isLoading: loading,
        error: apiError,
        refetch: fetchRegions
    } = useGetRegionsQuery({ page: currentPage, size: pageSize })

    // Extract data from API response
    const regions = regionsResponse?.data || []
    const totalElements = regionsResponse?.meta?.totalElements || 0
    const totalPages = regionsResponse?.meta?.totalPages || 0
    const error = apiError ? (apiError as any)?.data?.message || 'An error occurred' : null

    const selectRegion = useCallback((region: Region | null) => {
        dispatch(setSelectedRegion(region))
    }, [dispatch])

    const changePage = useCallback((page: number) => {
        dispatch(setCurrentPage(page))
    }, [dispatch])

    const changePageSize = useCallback((size: number) => {
        dispatch(setPageSize(size))
    }, [dispatch])

    const resetRegion = useCallback(() => {
        dispatch(resetRegionState())
    }, [dispatch])

    return {
        // State
        regions,
        selectedRegion,
        loading,
        error,
        currentPage,
        pageSize,
        totalElements,
        totalPages,

        // Actions
        fetchRegions,
        selectRegion,
        changePage,
        changePageSize,
        resetRegion,
    }
}
