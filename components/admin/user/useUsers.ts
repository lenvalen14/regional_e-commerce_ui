'use client';

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../lib/store"
import { 
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  User,
  UserFormData
} from "../../../features/user"
import {
  setShowAddModal,
  setShowEditModal,
  setShowDeleteModal,
  setSelectedUser,
  setSearchTerm,
  setStatusFilter,
  setFormData,
  setCurrentPage,
  setPageSize,
  clearFilters,
} from "../../../features/user/userSlice"
import { ExtendedUserFormData } from "./types"

export function useUsers() {
  const dispatch = useDispatch()
  
  // Get state from Redux store
  const {
    showAddModal,
    showEditModal,
    showDeleteModal,
    selectedUser,
    searchTerm,
    statusFilter,
    formData,
    currentPage,
    pageSize,
  } = useSelector((state: RootState) => state.user)

  // RTK Query hooks
  const { 
    data: usersResponse, 
    isLoading: loading, 
    error: apiError,
    refetch: fetchUsers 
  } = useGetUsersQuery({ page: currentPage, size: pageSize })

  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation()
  const [updateUser, { isLoading: updatingUser }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: deletingUser }] = useDeleteUserMutation()

  // Extract data from API response
  const users = usersResponse?.data || []
  const totalElements = usersResponse?.meta?.totalElements || 0
  const totalPages = usersResponse?.meta?.totalPages || 0
  const error = apiError ? (apiError as any)?.data?.message || 'An error occurred' : null

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesStatus
  })

  // Search and filter handlers
  const handleSearchChange = useCallback((term: string) => {
    dispatch(setSearchTerm(term))
  }, [dispatch])

  const handleStatusFilter = useCallback((status: string) => {
    dispatch(setStatusFilter(status))
  }, [dispatch])

  // Modal handlers
  const handleOpenAddModal = useCallback(() => {
    dispatch(setShowAddModal(true))
  }, [dispatch])

  const handleCloseAddModal = useCallback(() => {
    dispatch(setShowAddModal(false))
  }, [dispatch])

  const handleCloseEditModal = useCallback(() => {
    dispatch(setShowEditModal(false))
  }, [dispatch])

  const handleCloseDeleteModal = useCallback(() => {
    dispatch(setShowDeleteModal(false))
  }, [dispatch])

  // Form data handlers
  const handleFormDataChange = useCallback((data: UserFormData | ExtendedUserFormData) => {
    dispatch(setFormData(data))
  }, [dispatch])

  // CRUD operations
  const handleAddUser = useCallback(async () => {
    const extendedFormData = formData as ExtendedUserFormData
    if (extendedFormData.userName && extendedFormData.email && extendedFormData.phone && extendedFormData.password) {
      try {
        const userData = {
          userName: extendedFormData.userName,
          email: extendedFormData.email,
          phone: extendedFormData.phone,
          password: extendedFormData.password,
          isActive: extendedFormData.isActive ?? true,
        }
        
        await createUser(userData).unwrap()
        dispatch(setShowAddModal(false))
      } catch (err) {
        console.error('Error creating user:', err)
      }
    }
  }, [formData, createUser, dispatch])

  const handleEditUser = useCallback((user: User) => {
    dispatch(setSelectedUser(user))
    dispatch(setFormData({
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
    }))
    dispatch(setShowEditModal(true))
  }, [dispatch])

  const handleUpdateUser = useCallback(async () => {
    if (selectedUser && formData.userName && formData.email && formData.phone) {
      try {
        const userData = {
          userName: formData.userName,
          email: formData.email,
          phone: formData.phone,
          isActive: formData.isActive ?? true,
        }
        
        await updateUser({ userId: selectedUser.userId, userData }).unwrap()
        dispatch(setShowEditModal(false))
      } catch (err) {
        console.error('Error updating user:', err)
      }
    }
  }, [selectedUser, formData, updateUser, dispatch])

  const handleDeleteUser = useCallback((user: User) => {
    dispatch(setSelectedUser(user))
    dispatch(setShowDeleteModal(true))
  }, [dispatch])

  const handleConfirmDelete = useCallback(async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.userId).unwrap()
        dispatch(setShowDeleteModal(false))
      } catch (err) {
        console.error('Error deleting user:', err)
      }
    }
  }, [selectedUser, deleteUser, dispatch])

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page))
  }, [dispatch])

  const handlePageSizeChange = useCallback((size: number) => {
    dispatch(setPageSize(size))
  }, [dispatch])

  // Clear filters
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  return {
    // State
    users,
    filteredUsers,
    showAddModal,
    showEditModal,
    showDeleteModal,
    selectedUser,
    searchTerm,
    statusFilter,
    formData,
    loading: loading || creatingUser || updatingUser || deletingUser,
    error,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    
    // Actions
    setShowAddModal: handleCloseAddModal,
    setShowEditModal: handleCloseEditModal,
    setShowDeleteModal: handleCloseDeleteModal,
    setFormData: handleFormDataChange,
    handleSearchChange,
    handleStatusFilter,
    handleOpenAddModal,
    handleAddUser,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
    handleConfirmDelete,
    handleClearFilters,
    handlePageChange,
    handlePageSizeChange,
    fetchUsers,
  }
}
