'use client';

import { 
  useUsers,
  UserStats,
  UserSearch,
  UserList,
  EmptyState,
  AddUserModal,
  EditUserModal,
  DeleteUserModal,
  LoadingState,
  ErrorState
} from "@/components/admin/user"

export default function UsersPage() {
  const {
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
    loading,
    error,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    
    // Actions
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,
    setFormData,
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
  } = useUsers()

  // Show loading state
  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <LoadingState />
        </div>
      </div>
    )
  }

  // Show error state
  if (error && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <ErrorState 
            error={error} 
            onRetry={() => fetchUsers()} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Stats */}
        <UserStats 
          totalUsers={totalElements}
          onAddUser={handleOpenAddModal}
        />

          {/* Search and Filter */}
        <UserSearch 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusFilter={handleStatusFilter}
        />

        {/* Error message for non-critical errors */}
        {error && users.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Users List or Empty State */}
        {filteredUsers.length > 0 ? (
          <UserList 
            users={filteredUsers}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onUnblockUser={handleUnblockUser}
          />
        ) : (
          <EmptyState 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white px-6 py-3 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Hiển thị</span>
                  <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                  </select>
              <span className="text-sm text-gray-700">mục mỗi trang</span>
              </div>
              
            <div className="flex items-center space-x-2">
                <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                Trước
                </button>
              
              <span className="text-sm text-gray-700">
                Trang {currentPage + 1} / {totalPages}
              </span>
              
                <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                Sau
                </button>
            </div>
          </div>
        )}

        {/* Modals */}
        <AddUserModal 
          isOpen={showAddModal}
          formData={formData}
          onClose={setShowAddModal}
          onFormDataChange={setFormData}
          onSubmit={handleAddUser}
        />

        <EditUserModal 
          isOpen={showEditModal}
          user={selectedUser}
          formData={formData}
          onClose={setShowEditModal}
          onFormDataChange={setFormData}
          onSubmit={handleUpdateUser}
        />

        <DeleteUserModal 
          isOpen={showDeleteModal}
          user={selectedUser}
          onClose={setShowDeleteModal}
          onConfirm={handleConfirmDelete}
        />

      </div>
    </div>
  )
}