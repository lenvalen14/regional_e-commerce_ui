"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { CategoryResponse, NewType } from "@/features/new/newApi"

interface Props {
    category: string
    type: "" | NewType
    keyword: string
    categories: CategoryResponse[]
    onCategoryChange: (v: string) => void
    onTypeChange: (v: "" | NewType) => void
    onKeywordChange: (v: string) => void
    onSearch: () => void
    onReset: () => void
}

const types: { value: NewType; label: string }[] = [
    { value: "AM_THUC", label: "Ẩm thực" },
    { value: "VAN_HOA", label: "Văn hóa" },
    { value: "DU_LICH", label: "Du lịch" },
    { value: "SUC_KHOE", label: "Sức khỏe" },
    { value: "CONG_THUC", label: "Công thức" },
    { value: "LICH_SU", label: "Lịch sử" },
]

export default function NewsFilter({
    category,
    type,
    keyword,
    categories,
    onCategoryChange,
    onTypeChange,
    onKeywordChange,
    onReset,
}: Props) {
    return (
        <div className="flex flex-wrap gap-2 items-end">
            {/* Category */}
            <Select
                value={category === "" ? "all" : category}
                onValueChange={(v) => onCategoryChange(v === "all" ? "" : v)}
            >
                <SelectTrigger className="min-w-[160px]">
                    <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((c) => (
                        <SelectItem key={c.categoryId} value={c.categoryId}>
                            {c.categoryName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Type */}
            <Select
                value={type === "" ? "all" : type}
                onValueChange={(v) => onTypeChange(v === "all" ? "" : (v as NewType))}
            >
                <SelectTrigger className="min-w-[140px]">
                    <SelectValue placeholder="Loại tin" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    {types.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                            {t.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Keyword */}
            <Input
                placeholder="Nhập từ khóa..."
                value={keyword}
                onChange={(e) => onKeywordChange(e.target.value)}
                className="w-[200px]"
            />

            {/* Reset - sát bên phải */}
            <Button variant="outline" onClick={onReset} className="ml-auto">
                <Filter className="h-4 w-4 mr-2" />
                Đặt lại
            </Button>
        </div>

    )
}
