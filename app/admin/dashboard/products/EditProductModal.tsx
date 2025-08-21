import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateProductData, Product, useUpdateProductMutation } from "@/features/product/productApi"
import { useGetCategoriesQuery } from "@/features/category/categoryApi"
import { useGetRegionsQuery } from "@/features/region/regionApi"

// interface Product {
//   id: number
//   name: string
//   category: string
//   price: number
//   stock: number
//   status: string
//   description: string
//   region: string
// }

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (product: Product) => void
  product: Product | null
}

// const categories = [
//   "Bánh kẹo",
//   "Gia vị",
//   "Thực phẩm khô",
//   "Đồ uống",
//   "Thực phẩm tươi sống",
//   "Đặc sản vùng miền"
// ]

// const regions = [
//   "Hà Nội",
//   "TP.HCM",
//   "Đà Nẵng",
//   "Huế",
//   "Hội An",
//   "Nha Trang",
//   "Đà Lạt",
//   "Cần Thơ",
//   "An Giang",
//   "Sóc Trăng",
//   "Tây Ninh",
//   "Phan Thiết"
// ]

export default function EditProductModal({ isOpen, onClose, onEdit, product }: EditProductModalProps) {

  const { data: categoryData, isLoading: catLoading, isError: catError } = useGetCategoriesQuery({ page: 0, size: 20 });
  const categories = [
    ...(categoryData?.data.map(c => ({
      id: c.categoryId,
      name: c.categoryName
    })) || [])
  ];

  const { data: regionData, isLoading: reLoading, isError: reError } = useGetRegionsQuery({ page: 0, size: 20 });
  const regions = [
    ...(regionData?.data.map(r => ({
      id: r.regionId,
      name: r.regionName
    })) || [])
  ];

  const [updateProduct, { isLoading, isError }] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
    regionId: ""
  })

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.productName,
        categoryId: product.category.categoryId,
        price: product.price.toString(),
        stock: product.stockQuantity.toString(),
        description: product.description,
        regionId: product.region.regionId
      });
      setImages([]); // reset ảnh khi mở modal
    }
  }, [product]);

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !product) return;

    try {
      const result = await updateProduct({
        productId: product.productId,
        productData: {
          productName: formData.name,
          categoryId: formData.categoryId,
          regionId: formData.regionId,
          price: Number(formData.price),
          stockQuantity: Number(formData.stock),
          description: formData.description,
        },
        images: images.length > 0 ? images : undefined
      }).unwrap();

      onEdit(result.data); // cập nhật local state
      setErrors({});
      onClose();
    } catch (err) {
      console.error("Cập nhật sản phẩm thất bại:", err);
    }
  };

  const handleClose = () => {
    setErrors({});
    setImages([]);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Tên sản phẩm *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Danh mục *</Label>
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
              <Label htmlFor="edit-price">Giá (VNĐ) *</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
              />
              {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stock">Số lượng kho *</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
              {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-region">Vùng miền *</Label>
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

          {/* <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">ID:</span> {product.id}</p>
              <p><span className="font-medium">Trạng thái hiện tại:</span> {product.status === "In Stock" ? "Còn hàng" : product.status === "Low Stock" ? "Sắp hết" : "Hết hàng"}</p>
            </div>
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="edit-images">Ảnh sản phẩm</Label>
            <Input
              type="file"
              id="edit-images"
              multiple
              onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
