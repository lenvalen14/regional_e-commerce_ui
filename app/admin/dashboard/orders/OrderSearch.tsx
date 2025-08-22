import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw, Package, Truck, CheckCircle, XCircle } from "lucide-react"

interface SearchFilters {
  searchTerm: string
  status: string
  dateRange: string
}

interface OrderSearchProps {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
  totalResults: number
}

const statuses = [
  { value: "all", label: "Tất cả trạng thái", icon: null },
  { value: "PENDING", label: "Chờ xác nhận", icon: Package },
  { value: "CONFIRM", label: "Đã xác nhận", icon: Package },
  { value: "SHIPPED", label: "Đang giao", icon: Truck },
  { value: "COMPLETED", label: "Đã giao", icon: CheckCircle },
  { value: "CANCELLED", label: "Đã hủy", icon: XCircle }
]

const dateRanges = [
  { value: "all", label: "Tất cả thời gian" },
  { value: "today", label: "Hôm nay" },
  { value: "yesterday", label: "Hôm qua" },
  { value: "week", label: "7 ngày qua" },
  { value: "month", label: "30 ngày qua" },
  { value: "quarter", label: "3 tháng qua" }
]

export default function OrderSearch({ onSearch, onReset, totalResults }: OrderSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch({ 
      searchTerm: value, 
      status: status === "all" ? "" : status,
      dateRange: dateRange === "all" ? "" : dateRange
    })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onSearch({ 
      searchTerm, 
      status: value === "all" ? "" : value,
      dateRange: dateRange === "all" ? "" : dateRange
    })
  }

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    onSearch({ 
      searchTerm, 
      status: status === "all" ? "" : status,
      dateRange: value === "all" ? "" : value
    })
  }

  const handleReset = () => {
    setSearchTerm("")
    setStatus("all")
    setDateRange("all")
    onReset()
  }

  const hasActiveFilters = searchTerm || status !== "all" || dateRange !== "all"

  const getStatusIcon = (statusValue: string) => {
    const statusConfig = statuses.find(s => s.value === statusValue)
    if (statusConfig?.icon) {
      const Icon = statusConfig.icon
      return <Icon className="h-3 w-3 mr-1" />
    }
    return null
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
                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc email..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((statusOption) => (
                    <SelectItem key={statusOption.value} value={statusOption.value}>
                      <div className="flex items-center">
                        {statusOption.icon && <statusOption.icon className="h-3 w-3 mr-2" />}
                        {statusOption.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Thời gian</label>
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoảng thời gian" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Tìm thấy {totalResults} đơn hàng</span>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <span>Bộ lọc đang áp dụng:</span>
              {searchTerm && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">"{searchTerm}"</span>}
              {status !== "all" && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center">
                  {getStatusIcon(status)}
                  {statuses.find(s => s.value === status)?.label}
                </span>
              )}
              {dateRange !== "all" && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  {dateRanges.find(d => d.value === dateRange)?.label}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
