import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateProductData, Product, useCreateProductMutation } from "@/features/product/productApi"
import { Category, useGetCategoriesQuery } from "@/features/category/categoryApi"
import { useGetRegionsQuery } from "@/features/region"
import { Upload, X } from "lucide-react"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (product: CreateProductData) => void
}


export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {

  const { data: categoryData } = useGetCategoriesQuery({ page: 0, size: 20 });
  const categories = categoryData?.data.map(c => ({ id: c.categoryId, name: c.categoryName })) || [];

  const { data: regionData } = useGetRegionsQuery({ page: 0, size: 20 });
  const regions = regionData?.data.map(r => ({ id: r.regionId, name: r.regionName })) || [];


  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
    regionId: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [images, setImages] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const [createProduct, { isLoading }] = useCreateProductMutation();


  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Danh mục là bắt buộc"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Giá là bắt buộc"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Giá phải là số dương"
    }

    if (!formData.stock.trim()) {
      newErrors.stock = "Số lượng kho là bắt buộc"
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Số lượng kho phải là số không âm"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả sản phẩm là bắt buộc"
    }

    if (!formData.regionId) {
      newErrors.regionId = "Vùng miền là bắt buộc"
    }

    if (images.length === 0) {
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Chuẩn bị dữ liệu đúng type
    const productDataToSend: CreateProductData & { images?: File[] } = {
      productName: formData.name,
      categoryId: formData.categoryId,
      regionId: formData.regionId,
      price: Number(formData.price),
      stockQuantity: Number(formData.stock),
      description: formData.description,
      images: images, // luôn gửi images array
    };

    console.log("Dữ liệu gửi đi:", productDataToSend);
    console.log("Số lượng ảnh:", images.length);

    try {
      const result = await createProduct(productDataToSend).unwrap();
      console.log("Kết quả:", result);
      // reset form
      setFormData({ name: "", categoryId: "", price: "", stock: "", description: "", regionId: "" });
      setImages([]);
      setErrors({});
      onClose();
    } catch (err: any) {
      console.error("Thêm sản phẩm thất bại:", err);
      // Hiển thị lỗi chi tiết hơn
      if (err?.data?.message) {
        console.error("Chi tiết lỗi:", err.data.message);
      }
      if (err?.status) {
        console.error("HTTP Status:", err.status);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
    }
  };

  const handleImageChange = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).filter(file => file.type.startsWith("image/"));
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setFormData({ name: "", categoryId: "", price: "", stock: "", description: "", regionId: "" });
    setImages([]);
    setErrors({});
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Danh mục *</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
              />
              {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Số lượng kho *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
              {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Vùng miền *</Label>
            <Select value={formData.regionId} onValueChange={(value) => setFormData({ ...formData, regionId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vùng miền" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.regionId && <p className="text-sm text-red-600">{errors.regionId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả sản phẩm *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả chi tiết về sản phẩm"
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="space-y-3">
            <Label>Hình ảnh sản phẩm *</Label>
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${isDragOver
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
                  <Label htmlFor="images" className="cursor-pointer">
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
                id="images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files)}
              />
            </div>
            {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
            {/* File List Display */}
            {images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-600">
                  Đã chọn {images.length} hình ảnh
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {images.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-blue-600">IMG</span>
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
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Đang thêm sản phẩm..." : "Thêm sản phẩm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
