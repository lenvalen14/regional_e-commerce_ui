"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryResponse, useCreateNewsMutation } from "@/features/new/newApi"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự"),
    content: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
    type: z.string().min(1, "Vui lòng chọn loại bài viết"),
    categoryId: z.string().optional(),
})

export type NewsFormValues = z.infer<typeof formSchema>

interface Props {
    categories: CategoryResponse[]
    onSuccess?: () => void
}

export default function NewsForm({ categories = [], onSuccess }: Props) {
    const [images, setImages] = useState<{ file: File; typeContent: string }[]>([])
    const [createNews, { isLoading }] = useCreateNewsMutation()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<NewsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            type: "",
            categoryId: "",
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const mapped = Array.from(files).map((file) => ({
            file,
            typeContent: "",
        }))
        setImages(prev => [...prev, ...mapped])
    }

    const handleTypeContentChange = (index: number, value: string) => {
        const updated = [...images]
        updated[index].typeContent = value
        setImages(updated)
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const submitForm = async (values: NewsFormValues) => {
        try {
            const formData = new FormData()
            formData.append("title", values.title)
            formData.append("content", values.content)
            formData.append("type", values.type)

            if (values.categoryId) {
                formData.append("categoryId", values.categoryId)
            }

            images.forEach((img) => {
                formData.append("files", img.file)
                formData.append("typeContents", img.typeContent)
            })

            await createNews(formData).unwrap()

            // ✅ Show alert thay vì chỉ toast
            alert(`Bài viết "${values.title}" đã được tạo.`)

            // reset form
            reset()
            setImages([])

            // đóng form + refetch NewsList
            onSuccess?.()
        } catch (err: any) {
            alert(err?.data?.message || "Không thể tạo bài viết")
        }
    }

    return (
        <div className="space-y-6">
            {/* Tiêu đề */}
            <div>
                <Label className="text-sm font-medium text-gray-700">
                    Tiêu đề <span className="text-red-500">*</span>
                </Label>
                <Input
                    {...register("title")}
                    placeholder="Nhập tiêu đề bài viết"
                    className="mt-1"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
            </div>

            {/* Nội dung */}
            <div>
                <Label className="text-sm font-medium text-gray-700">
                    Nội dung <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    {...register("content")}
                    rows={6}
                    placeholder="Nhập nội dung bài viết"
                    className="mt-1"
                />
                {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Loại bài viết */}
                <div>
                    <Label className="text-sm font-medium text-gray-700">
                        Loại <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(val) => setValue("type", val)}>
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AM_THUC">Ẩm thực</SelectItem>
                            <SelectItem value="VAN_HOA">Văn hoá</SelectItem>
                            <SelectItem value="DU_LICH">Du lịch</SelectItem>
                            <SelectItem value="SUC_KHOE">Sức khoẻ</SelectItem>
                            <SelectItem value="CONG_THUC">Công thức</SelectItem>
                            <SelectItem value="LICH_SU">Lịch sử</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.type && (
                        <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                    )}
                </div>

                {/* Danh mục */}
                <div>
                    <Label className="text-sm font-medium text-gray-700">Danh mục</Label>
                    <Select onValueChange={(val) => setValue("categoryId", val)}>
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((c) => (
                                <SelectItem key={c.categoryId} value={c.categoryId}>
                                    {c.categoryName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Upload ảnh */}
            <div>
                <Label className="text-sm font-medium text-gray-700">Hình ảnh</Label>
                <div className="mt-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="text-sm text-gray-500">Chọn ảnh để tải lên</p>
                        </div>
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Preview ảnh */}
                {images.length > 0 && (
                    <div className="mt-4 space-y-3">
                        {images.map((img, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
                                <img
                                    src={URL.createObjectURL(img.file)}
                                    alt="preview"
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <Input
                                        placeholder="Nhập mô tả cho ảnh..."
                                        value={img.typeContent}
                                        onChange={(e) => handleTypeContentChange(i, e.target.value)}
                                        className="text-sm"
                                    />
                                </div>
                                <button
                                    onClick={() => removeImage(i)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    onClick={handleSubmit(submitForm)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    {isLoading ? "Đang tạo..." : "Thêm bài viết"}
                </Button>
                <Button
                    onClick={() => {
                        reset()
                        setImages([])
                    }}
                    variant="outline"
                >
                    Hủy
                </Button>
            </div>
        </div>

    )
}