'use client'

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../lib/store"
import { 
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUnblockUserMutation,
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

// 🔑 import toast (cùng nơi với Toaster bạn render ở layout)
import { toast } from "sonner"

export function useUsers() {
  const dispatch = useDispatch()
  
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

  const { 
    data: usersResponse, 
    isLoading: loading, 
    error: apiError,
    refetch: fetchUsers 
  } = useGetUsersQuery({ page: currentPage, size: pageSize })

  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation()
  const [updateUser, { isLoading: updatingUser }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: deletingUser }] = useDeleteUserMutation()
  const [unblockUser, { isLoading: unblockingUser }] = useUnblockUserMutation()

  const users = usersResponse?.data || []
  const totalElements = usersResponse?.meta?.totalElements || 0
  const totalPages = usersResponse?.meta?.totalPages || 0
  const error = apiError ? (apiError as any)?.data?.message || 'An error occurred' : null

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

  const handleSearchChange = useCallback((term: string) => {
    dispatch(setSearchTerm(term))
  }, [dispatch])

  const handleStatusFilter = useCallback((status: string) => {
    dispatch(setStatusFilter(status))
  }, [dispatch])

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

  const handleFormDataChange = useCallback((data: UserFormData | ExtendedUserFormData) => {
    dispatch(setFormData(data))
  }, [dispatch])

  // ✅ CRUD operations with toast
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
        toast.success("Người dùng đã được tạo thành công 🎉")
      } catch (err) {
        console.error('Error creating user:', err)
        toast.error("Không thể tạo người dùng")
      }
    }
  }, [formData, createUser, dispatch])

  const handleEditUser = useCallback((user: User) => {
    dispatch(setSelectedUser(user))
    dispatch(setFormData({
      userName: user.userName,
      email: user.email,
      phone: user.phone,
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
        }
        
        await updateUser({ userId: selectedUser.userId, userData }).unwrap()
        dispatch(setShowEditModal(false))
        toast.success("Cập nhật người dùng thành công ✅")
      } catch (err) {
        console.error('Error updating user:', err)
        toast.error("Không thể cập nhật người dùng")
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
        toast.success("Xóa người dùng thành công 🗑️")
      } catch (err) {
        console.error('Error blocking user:', err)
        toast.error("Không thể xóa người dùng")
      }
    }
  }, [selectedUser, deleteUser, dispatch])

  const handleUnblockUser = useCallback(async (user: User) => {
    try {
      await unblockUser(user.userId).unwrap()
      toast.success(`Đã mở khóa ${user.userName}`)
    } catch (err) {
      console.error('Error unblocking user:', err)
      toast.error("Không thể mở khóa người dùng")
    }
  }, [unblockUser])

  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page))
  }, [dispatch])

  const handlePageSizeChange = useCallback((size: number) => {
    dispatch(setPageSize(size))
  }, [dispatch])

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters())
    toast("Đã reset bộ lọc")
  }, [dispatch])

  return {
    users,
    filteredUsers,
    showAddModal,
    showEditModal,
    showDeleteModal,
    selectedUser,
    searchTerm,
    statusFilter,
    formData,
    loading: loading || creatingUser || updatingUser || deletingUser || unblockingUser,
    error,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    
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
    handleUnblockUser,
    handleClearFilters,
    handlePageChange,
    handlePageSizeChange,
    fetchUsers,
  }
}
