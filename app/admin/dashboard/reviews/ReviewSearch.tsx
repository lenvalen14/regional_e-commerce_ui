import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

interface SearchFilters {
  searchTerm: string
  rating: string
  category: string
}

interface ReviewSearchProps {
  searchFilters: SearchFilters
  onSearchChange: (field: keyof SearchFilters, value: string) => void
  onReset: () => void
}

const categories = ["Bánh kẹo", "Gia vị", "Thực phẩm khô", "Đồ uống", "Thực phẩm tươi sống", "Đặc sản vùng miền"]

export default function ReviewSearch({ searchFilters, onSearchChange, onReset }: ReviewSearchProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Search className="h-5 w-5 mr-2" />
        Tìm kiếm đánh giá
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder="Tìm theo tên khách hàng, sản phẩm..."
            value={searchFilters.searchTerm}
            onChange={(e) => onSearchChange("searchTerm", e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Select value={searchFilters.rating} onValueChange={(value) => onSearchChange("rating", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả đánh giá</SelectItem>
              <SelectItem value="5">⭐⭐⭐⭐⭐ (5 sao)</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ (4 sao)</SelectItem>
              <SelectItem value="3">⭐⭐⭐ (3 sao)</SelectItem>
              <SelectItem value="2">⭐⭐ (2 sao)</SelectItem>
              <SelectItem value="1">⭐ (1 sao)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={searchFilters.category} onValueChange={(value) => onSearchChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Button variant="outline" onClick={onReset} className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        </div>
      </div>
    </div>
  )
}
