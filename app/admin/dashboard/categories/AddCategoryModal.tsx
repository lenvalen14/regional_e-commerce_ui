"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import { Category, useCreateCategoryMutation } from "@/features/category/categoryApi"

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (category: Category) => void
}

export default function AddCategoryModal({ isOpen, onClose, onAdd }: AddCategoryModalProps) {
  const [formData, setFormData] = useState({ categoryName: "", description: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createCategory] = useCreateCategoryMutation()


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryName.trim()) {
      alert("Vui lòng nhập tên danh mục")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createCategory({
        categoryName: formData.categoryName.trim(),
        description: formData.description.trim(),
      }).unwrap()

      // Gọi callback và truyền category mới
      if (onAdd) onAdd(result.data)

      setFormData({ categoryName: "", description: "" })
      onClose()
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error)
      alert("Có lỗi xảy ra khi thêm danh mục")
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleClose = () => {
    setFormData({ categoryName: "", description: "" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm Danh Mục Mới</DialogTitle>
          <DialogDescription>
            Tạo danh mục mới cho sản phẩm đặc sản
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên danh mục *</Label>
            <Input
              id="name"
              placeholder="Nhập tên danh mục..."
              value={formData.categoryName}
              onChange={(e) => handleInputChange("categoryName", e.target.value)}
              required
            />
          </div>

          {/* Category Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả cho danh mục..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Category Status */}
          {/* <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
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
          </div> */}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Đang thêm..." : "Thêm danh mục"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
