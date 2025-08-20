import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

interface SearchFilters {
  searchTerm: string
  rating: string
  category: string
}

interface CategoryResponse {
  categoryId: string
  categoryName: string
}

interface ReviewSearchProps {
  searchFilters: SearchFilters
  onSearchChange: (field: keyof SearchFilters, value: string) => void
  onReset: () => void
  categories: CategoryResponse[]
}

export default function ReviewSearch({
  searchFilters,
  onSearchChange,
  onReset,
  categories,
}: ReviewSearchProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center gap-3">
        {/* Category */}
        <Select
          value={searchFilters.category}
          onValueChange={(value) => onSearchChange("category", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rating */}
        <Select
          value={searchFilters.rating}
          onValueChange={(value) => onSearchChange("rating", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả loại" />
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

        {/* Keyword search */}
        <div className="flex-1">
          <Input
            placeholder="Nhập từ khóa..."
            value={searchFilters.searchTerm}
            onChange={(e) => onSearchChange("searchTerm", e.target.value)}
            className="w-[200px]"
          />
        </div>

        {/* Reset button */}
        <div className="ml-auto">
          <Button variant="outline" onClick={onReset}>
            <Filter className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        </div>
      </div>
    </div>
  )
}
