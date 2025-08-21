import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Region, RegionFormData } from './regionApi'

interface RegionState {
    selectedRegion: Region | null

    // Pagination
    currentPage: number
    pageSize: number
}

const initialState: RegionState = {
    selectedRegion: null,

    // Pagination
    currentPage: 0,
    pageSize: 5,
}

const regionSlice = createSlice({
    name: 'region',
    initialState,
    reducers: {

        // Region selection
        setSelectedRegion: (state, action: PayloadAction<Region | null>) => {
            state.selectedRegion = action.payload
        },
        // Pagination
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload
            state.currentPage = 0 // Reset to first page when changing page size
        },
        // Reset state
        resetRegionState: (state) => {
            return initialState
        },
    },
})

export const {
    setSelectedRegion,
    setCurrentPage,
    setPageSize,
    resetRegionState,
} = regionSlice.actions

export default regionSlice.reducer
