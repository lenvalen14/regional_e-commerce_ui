"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchFilters {
  searchTerm: string
}

interface CategorySearchProps {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
  totalResults: number
}

export default function CategorySearch({ onSearch, onReset, totalResults }: CategorySearchProps) {
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
      <CardContent className="p-6 space-y-4">
        {/* Basic Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
          <span>Tìm thấy {totalResults} danh mục</span>
        </div>
      </CardContent>
    </Card>
  )
}
