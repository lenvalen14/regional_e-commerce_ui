"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
    useGetNewsByFilterQuery,
    useDeleteNewsMutation,
    NewResponse,
    NewType,
    useGetCategoriesQuery
} from "@/features/new/newApi"

import NewsFilter from "./NewsFilter"
import NewsItems from "./NewsItems"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import NewsForm, { NewsFormValues } from "./NewsForm"

export default function NewsListPage() {
    const { toast } = useToast()

    // State filter
    const [category, setCategory] = useState<string>("")
    const [type, setType] = useState<NewType | "">("")
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(0)
    const [keyword, setKeyword] = useState<string>("")

    // Call API theo filter
    const { data, error, isLoading, refetch } = useGetNewsByFilterQuery({
        page,
        size: 6,
        categoryId: category || undefined,
        type: type === "" ? undefined : type
    })

    // Call API category list
    const { data: categoryRes, isLoading: catLoading } = useGetCategoriesQuery({ page: 0, size: 50 })
    const categories = categoryRes?.data || []


    const [deleteNews] = useDeleteNewsMutation()
    const [localNews, setLocalNews] = useState<NewResponse[]>([])

    // Sync API → localNews
    useEffect(() => {
        if (error) {
            setLocalNews([]) // reset khi API lỗi
        } else if (data?.data) {
            setLocalNews(
                data.data.map((n: NewResponse) => ({
                    ...n,
                    images: n.images || [],
                }))
            )
        } else {
            setLocalNews([]) // reset khi không có data
        }
    }, [data, error])

    // Delete handler
    const handleDeleteNews = async (id: string) => {
        try {
            await deleteNews(id).unwrap()
            setLocalNews((prev) => prev.filter((n) => n.newId !== id))
            toast({
                title: "Xóa thành công",
                description: "Bài viết đã được xóa.",
            })
        } catch (err) {
            console.error("Lỗi khi xóa news:", err)
            toast({
                title: "Lỗi",
                description: "Không thể xóa bài viết.",
                variant: "destructive",
            })
        }
    }

    const filteredNews = localNews.filter(
        (n) =>
            n.title.toLowerCase().includes(keyword.toLowerCase()) ||
            n.content.toLowerCase().includes(keyword.toLowerCase())
    )

    return (
        <>
            <Card className="mb-4">
                <CardContent>
                    <NewsFilter
                        category={category}
                        type={type}
                        keyword={keyword}
                        categories={categories}
                        onCategoryChange={setCategory}
                        onTypeChange={setType}
                        onKeywordChange={setKeyword}
                        onSearch={() => refetch()}
                        onReset={() => {
                            setCategory("")
                            setType("")
                            setKeyword("")
                            refetch()
                        }}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Danh sách News ({localNews.length})</CardTitle>

                    {/* Nút Tạo mới */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => setOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Tạo mới
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl w-[50vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Thêm bài viết mới</DialogTitle>
                                <DialogDescription>Nhập thông tin chi tiết cho bài viết</DialogDescription>
                            </DialogHeader>

                            <NewsForm
                                categories={categories}
                                onSuccess={() => {
                                    alert("Bài viết đã được tạo thành công!") // ✅ alert
                                    setOpen(false) // ✅ đóng form
                                    refetch() // ✅ reload list
                                }}
                            />
                        </DialogContent>
                    </Dialog>

                </CardHeader>

                <CardContent>
                    {isLoading && <p className="p-4">Đang tải dữ liệu...</p>}

                    {!isLoading && filteredNews.length === 0 && (
                        <p className="p-4 text-gray-500 italic">Không tìm thấy bài viết nào</p>
                    )}

                    {filteredNews.length > 0 && (
                        <NewsItems news={filteredNews} onDelete={handleDeleteNews} meta={data?.meta} onPageChange={(p) => setPage(p)} />
                    )}
                </CardContent>
            </Card>
        </>
    )
}
