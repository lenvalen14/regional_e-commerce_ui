import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw } from "lucide-react"
import { useGetRegionsQuery } from "@/features/region/regionApi"
import { useGetCategoriesQuery } from "@/features/category/categoryApi"

interface SearchFilters {
  searchTerm: string
  category: string
  status: string
  region: string
}

interface ProductSearchProps {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
  totalResults: number
}


const statuses = [
  "Tất cả trạng thái",
  "In Stock",
  "Low Stock",
  "Out of Stock"
]


export default function ProductSearch({ onSearch, onReset, totalResults }: ProductSearchProps) {

  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("Tất cả trạng thái")
  const [region, setRegion] = useState("all")

  const { data, isLoading, isError } = useGetRegionsQuery({ page: 0, size: 20 });
  const regions = [
    { id: "all", name: "Tất cả vùng miền" },
    ...(data?.data.map(r => ({
      id: r.regionId,
      name: r.regionName
    })) || [])
  ];

  const { data: categoryData, isLoading: catLoading, isError: catError } = useGetCategoriesQuery({ page: 0, size: 20 });
  const categories = [
    { id: "all", name: "Tất cả danh mục" },
    ...(categoryData?.data.map(c => ({
      id: c.categoryId,
      name: c.categoryName
    })) || [])
  ];


  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch({
      searchTerm: value,
      category: category === "Tất cả danh mục" ? "" : category,
      status: status === "Tất cả trạng thái" ? "" : status,
      region: region === "Tất cả vùng miền" ? "" : region
    })
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    onSearch({
      searchTerm,
      category: value === "all" ? "" : value,
      status: status === "Tất cả trạng thái" ? "" : status,
      region: region === "all" ? "" : region
    })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onSearch({
      searchTerm,
      category: category === "Tất cả danh mục" ? "" : category,
      status: value === "Tất cả trạng thái" ? "" : value,
      region: region === "Tất cả vùng miền" ? "" : region
    })
  }

  const handleRegionChange = (value: string) => {
    setRegion(value)
    onSearch({
      searchTerm,
      category: category === "all" ? "" : category,
      status: status === "Tất cả trạng thái" ? "" : status,
      region: value === "all" ? "" : value
    })
  }

  const handleReset = () => {
    setSearchTerm("")
    setCategory("all")
    setStatus("Tất cả trạng thái")
    setRegion("all")
    onReset()
  }

  const hasActiveFilters = searchTerm || category !== "Tất cả danh mục" || status !== "Tất cả trạng thái" || region !== "Tất cả vùng miền"

  const getStatusLabel = (status: string) => {
    const statusMap = {
      "In Stock": "Còn hàng",
      "Low Stock": "Sắp hết",
      "Out of Stock": "Hết hàng"
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sản phẩm theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Đặt lại</span>
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Danh mục</label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((stat) => (
                    <SelectItem key={stat} value={stat}>
                      {stat === "Tất cả trạng thái" ? stat : getStatusLabel(stat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vùng miền</label>
              <Select value={region} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((reg) => (
                    <SelectItem key={reg.id} value={reg.id}>
                      {reg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Tìm thấy {totalResults} sản phẩm</span>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <span>Bộ lọc đang áp dụng:</span>
              {searchTerm && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">"{searchTerm}"</span>}
              {category !== "Tất cả danh mục" && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{category}</span>}
              {status !== "Tất cả trạng thái" && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{getStatusLabel(status)}</span>}
              {region !== "Tất cả vùng miền" && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{region}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
