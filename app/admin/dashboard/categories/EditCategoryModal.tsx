"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"

interface Category {
  id: number
  name: string
  description: string
  productCount: number
  status: string
  image: string
}

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (category: Category) => void
  category: Category | null
}

export default function EditCategoryModal({ isOpen, onClose, onEdit, category }: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load category data when modal opens
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status,
      })
    }
  }, [category])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return

    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name.trim()) {
        alert("Vui lòng nhập tên danh mục")
        return
      }

      // Create updated category object
      const updatedCategory: Category = {
        ...category,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        image: category.image, // Keep existing image
      }

      // Call parent function to update category
      onEdit(updatedCategory)

      // Close modal
      onClose()
    } catch (error) {
      console.error("Error updating category:", error)
      alert("Có lỗi xảy ra khi cập nhật danh mục")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      status: "Active",
    })
    onClose()
  }

  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Danh Mục</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin danh mục "{category.name}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Tên danh mục *</Label>
            <Input
              id="edit-name"
              placeholder="Nhập tên danh mục..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          {/* Category Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Mô tả</Label>
            <Textarea
              id="edit-description"
              placeholder="Nhập mô tả cho danh mục..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Category Status */}
          <div className="space-y-2">
            <Label htmlFor="edit-status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Hoạt động</SelectItem>
                <SelectItem value="Inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Count Info */}
          <div className="space-y-2">
            <Label>Số sản phẩm hiện tại</Label>
            <div className="p-2 bg-gray-50 rounded border">
              <span className="text-sm text-gray-600">{category.productCount} sản phẩm</span>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
