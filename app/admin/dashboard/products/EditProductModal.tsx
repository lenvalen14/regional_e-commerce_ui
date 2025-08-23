import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload } from "lucide-react"
import { Product, useUpdateProductMutation } from "@/features/product/productApi"

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (product: Product) => void
  product: Product | null
  categories: { categoryId: string, categoryName: string }[]
  regions: { regionId: string, regionName: string }[]
  loading: boolean
}

export default function EditProductModal({ 
  isOpen, 
  onClose, 
  onEdit, 
  product, 
  categories, 
  regions, 
  loading 
}: EditProductModalProps) {
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const [formData, setFormData] = useState({
    productName: "",
    categoryId: "",
    price: "",
    stockQuantity: "",
    description: "",
    regionId: ""
  })

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        categoryId: product.category.categoryId,
        price: product.price.toString(),
        stockQuantity: product.stockQuantity.toString(),
        description: product.description,
        regionId: product.region.regionId
      })
      setSelectedImages([])
    }
  }, [product])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.productName.trim()) newErrors.productName = "Tên sản phẩm là bắt buộc"
    if (!formData.categoryId) newErrors.categoryId = "Danh mục là bắt buộc"
    if (!formData.price.trim()) newErrors.price = "Giá là bắt buộc"
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = "Giá phải là số dương"

    if (!formData.stockQuantity.trim()) newErrors.stockQuantity = "Số lượng kho là bắt buộc"
    else if (isNaN(Number(formData.stockQuantity)) || Number(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = "Số lượng kho phải là số không âm"
    }

    if (!formData.description.trim()) newErrors.description = "Mô tả sản phẩm là bắt buộc"
    if (!formData.regionId) newErrors.regionId = "Vùng miền là bắt buộc"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageChange = async (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) continue
      
      // Validate file size (max 5MB)
      if (file.size > 100 * 1024 * 1024) continue
      
      validFiles.push(file)
    }

    setSelectedImages(prev => [...prev, ...validFiles])
    
    // Clear file input
    const fileInput = document.getElementById('edit-images') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    await handleImageChange(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !product) return

    try {
      const productData = {
        productName: formData.productName,
        categoryId: formData.categoryId,
        regionId: formData.regionId,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        description: formData.description,
      }

      const result = await updateProduct({
        productId: product.productId,
        productData,
        images: selectedImages.length > 0 ? selectedImages : undefined
      }).unwrap()

      if (result.data) {
        onEdit(result.data)
        setErrors({})
        handleClose()
      }
    } catch (error: any) {
      console.error("Cập nhật sản phẩm thất bại:", error)
      
      // Handle validation errors from API
      if (error?.data?.errors) {
        setErrors(error.data.errors)
      } else {
        setErrors({ general: "Có lỗi xảy ra khi cập nhật sản phẩm" })
      }
    }
  }

  const handleClose = () => {
    setErrors({})
    setSelectedImages([])
    onClose()
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="py-12 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-productName">Tên sản phẩm *</Label>
              <Input
                id="edit-productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.productName && <p className="text-sm text-red-600">{errors.productName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Danh mục *</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Giá (VNĐ) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                />
                {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-stockQuantity">Số lượng kho *</Label>
                <Input
                  id="edit-stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="0"
                />
                {errors.stockQuantity && <p className="text-sm text-red-600">{errors.stockQuantity}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-region">Vùng miền *</Label>
              <Select 
                value={formData.regionId} 
                onValueChange={(value) => setFormData({ ...formData, regionId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vùng miền" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.regionId} value={region.regionId}>
                      {region.regionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.regionId && <p className="text-sm text-red-600">{errors.regionId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả sản phẩm *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả chi tiết về sản phẩm"
                rows={3}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Current Images Display */}
            {product.imageProductResponseList && product.imageProductResponseList.length > 0 && (
              <div className="space-y-2">
                <Label>Ảnh hiện tại</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {product.imageProductResponseList.map((image, index) => (
                    <div key={`current-${image.imageId}`} className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={image.imageUrl}
                          alt={`Ảnh sản phẩm ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkzhu5dpIMOhbmg8L3RleHQ+PC9zdmc+'
                          }}
                        />
                      </div>
                      <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Hiện tại
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Lưu ý: Khi thêm ảnh mới, các ảnh cũ sẽ được thay thế
                </p>
              </div>
            )}

            {/* New Images Upload */}
            <div className="space-y-3">
              <Label>Thêm ảnh mới (tùy chọn)</Label>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <div className="mb-2">
                    <Label htmlFor="edit-images" className="cursor-pointer">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Nhấn để chọn ảnh
                      </span>
                      <span className="text-sm text-gray-500"> hoặc kéo thả vào đây</span>
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF tối đa 5MB mỗi ảnh
                  </p>
                </div>
                <Input
                  id="edit-images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files)}
                />
              </div>

              {/* Selected New Images */}
              {selectedImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-600">
                    Ảnh mới được chọn ({selectedImages.length})
                  </p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedImages.map((file, index) => (
                      <div key={`new-${index}`} className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-blue-600">NEW</span>
                          </div>
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            ({Math.round(file.size / 1024)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isUpdating}>
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}