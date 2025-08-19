import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, UserFormData } from './userApi'

interface UserState {
  // UI State
  showAddModal: boolean
  showEditModal: boolean
  showDeleteModal: boolean
  selectedUser: User | null
  searchTerm: string
  statusFilter: string
  formData: UserFormData
  
  // Pagination
  currentPage: number
  pageSize: number
}

const initialState: UserState = {
  // UI State
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  selectedUser: null,
  searchTerm: '',
  statusFilter: 'all',
  formData: {},
  
  // Pagination
  currentPage: 0,
  pageSize: 10,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Modal actions
    setShowAddModal: (state, action: PayloadAction<boolean>) => {
      state.showAddModal = action.payload
      if (action.payload) {
        state.formData = {}
      }
    },
    setShowEditModal: (state, action: PayloadAction<boolean>) => {
      state.showEditModal = action.payload
      if (!action.payload) {
        state.selectedUser = null
        state.formData = {}
      }
    },
    setShowDeleteModal: (state, action: PayloadAction<boolean>) => {
      state.showDeleteModal = action.payload
      if (!action.payload) {
        state.selectedUser = null
      }
    },
    
    // User selection
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    
    // Search and filter
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload
    },
    
    // Form data
    setFormData: (state, action: PayloadAction<UserFormData>) => {
      state.formData = action.payload
    },
    updateFormData: (state, action: PayloadAction<Partial<UserFormData>>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    
    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 0 // Reset to first page when changing page size
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.searchTerm = ''
      state.statusFilter = 'all'
    },
    
    // Reset state
    resetUserState: (state) => {
      return initialState
    },
  },
})

export const {
  setShowAddModal,
  setShowEditModal,
  setShowDeleteModal,
  setSelectedUser,
  setSearchTerm,
  setStatusFilter,
  setFormData,
  updateFormData,
  setCurrentPage,
  setPageSize,
  clearFilters,
  resetUserState,
} = userSlice.actions

export default userSlice.reducer
