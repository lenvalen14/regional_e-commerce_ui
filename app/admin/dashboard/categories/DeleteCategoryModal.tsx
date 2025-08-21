"use client"

import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { Category, useDeleteCategoryMutation } from "@/features/category/categoryApi"

// interface Category {
//   id: number
//   name: string
//   description: string
//   productCount: number
//   status: string
//   image: string
// }

interface DeleteCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: (categoryId: string) => void
  category: Category | null
}

export default function DeleteCategoryModal({ isOpen, onClose, onDelete, category }: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteCategory] = useDeleteCategoryMutation()

  const handleDelete = async () => {
    if (!category) return

    setIsDeleting(true)

    try {
      // Call API to delete
      await deleteCategory(category.categoryId).unwrap()

      // Call parent to update state
      onDelete(category.categoryId)

      // Close modal
      onClose()
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Có lỗi xảy ra khi xóa danh mục")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!category) return null

  const hasProducts = category.productCount > 0

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Bạn có chắc chắn muốn xóa danh mục <strong>"{category.categoryName}"</strong> không?
              </p>

              {/* Category Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{category.categoryName}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  {/* <Badge
                    variant={category.status === "Active" ? "default" : "secondary"}
                    className={
                      category.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }
                  >
                    {category.status === "Active" ? "Hoạt động" : "Tạm dừng"}
                  </Badge> */}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Số sản phẩm:</span>
                  <span className="font-medium">{category.productCount} sản phẩm</span>
                </div>
              </div>

              {/* Warning for categories with products */}
              {hasProducts && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800 mb-1">Cảnh báo!</p>
                      <p className="text-red-700">
                        Danh mục này đang có <strong>{category.productCount} sản phẩm</strong>.
                        Khi xóa danh mục, tất cả sản phẩm trong danh mục này sẽ cần được chuyển sang danh mục khác hoặc sẽ bị ẩn.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600">
                <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Đang xóa..." : "Xóa danh mục"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
