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
    <div className="min-h-screen bg-white p-6">
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

        {/* Pagination - Sleek & Modern */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
            {/* Page Size Dropdown */}
            <div className="flex items-center space-x-3 text-gray-700">
              <span className="text-sm font-medium">Hiển thị</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="form-select border-none bg-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-200"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm font-medium">mục</span>
            </div>

            {/* Page Navigation */}
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Info */}
              <span className="text-sm font-semibold text-gray-800 px-4">
                Trang {currentPage + 1} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
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