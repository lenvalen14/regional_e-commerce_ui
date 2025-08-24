"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Import components
import CategoryStats from "./CategoryStats"
import CategorySearch from "./CategorySearch"
import CategoryList from "./CategoryList"
import AddCategoryModal from "./AddCategoryModal"
import EditCategoryModal from "./EditCategoryModal"
import DeleteCategoryModal from "./DeleteCategoryModal"
import { Category, useDeleteCategoryMutation, useGetCategoriesQuery } from "@/features/category/categoryApi"


interface SearchFilters {
  searchTerm: string
}


export default function CategoriesPage() {

  const { data, isLoading, isError } = useGetCategoriesQuery({ page: 0, size: 20 })

  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const categoriesData = data?.data || []
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  useEffect(() => {
    if (data?.data) {
      setCategories(data.data)
      setFilteredCategories(data.data)
    }
  }, [data])

  // Filter and search categories
  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...categories]

    // Search by name or description
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(category =>
        category.categoryName.toLowerCase().includes(searchLower)
        // || category.description.toLowerCase().includes(searchLower)
      )
    }

    setFilteredCategories(filtered)
  }

  // Reset search filters
  const handleResetSearch = () => {
    setFilteredCategories(categories)
  }

  // Add new category
  const handleAddCategory = (newCategory: Category) => {
    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    setFilteredCategories(updatedCategories)
  }

  // Edit category
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  const handleUpdateCategory = (updatedCategory: Category) => {
    const updatedCategories = categories.map(cat =>
      cat.categoryId === updatedCategory.categoryId ? updatedCategory : cat
    )
    setCategories(updatedCategories)
    setFilteredCategories(updatedCategories.filter(cat =>
      filteredCategories.some(filtered => filtered.categoryId === cat.categoryId)
    ))
  }

  // Delete category
  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.categoryId.toString() !== categoryId.toString())
    setCategories(updatedCategories)
    setFilteredCategories(updatedCategories.filter(cat =>
      filteredCategories.some(filtered => filtered.categoryId === cat.categoryId)
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Danh Mục</h2>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục mới
        </Button>
      </div>

      {/* Statistics */}
      <CategoryStats />

      {/* Search and Filters */}
      <CategorySearch
        onSearch={handleSearch}
        onReset={handleResetSearch}
        totalResults={filteredCategories.length}
      />

      {/* Categories List */}
      <CategoryList
        categories={filteredCategories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Modals */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCategory}
      />

      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleUpdateCategory}
        category={selectedCategory}
      />

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleConfirmDelete}
        category={selectedCategory}
      />
    </div>
  )
}
