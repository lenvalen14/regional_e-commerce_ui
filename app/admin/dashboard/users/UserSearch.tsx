import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, RotateCcw } from "lucide-react"

interface SearchFilters {
  searchTerm: string
}

interface UserSearchProps {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
  totalResults: number
}

export default function UserSearch({ onSearch, onReset, totalResults }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch({ searchTerm: value })
  }

  const handleReset = () => {
    setSearchTerm("")
    onReset()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {searchTerm && (
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
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Tìm thấy {totalResults} người dùng</span>
          {searchTerm && (
            <span>Kết quả tìm kiếm cho: <strong>"{searchTerm}"</strong></span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
