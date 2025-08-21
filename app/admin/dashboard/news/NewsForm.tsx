"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { CategoryResponse, useCreateNewsMutation } from "@/features/new/newApi"
import { toast } from "@/components/ui/use-toast"

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

export default function NewsForm({ categories, onSuccess }: Props) {
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

    // chọn file ảnh
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const mapped = Array.from(files).map((file) => ({
            file,
            typeContent: "", // default rỗng, user sẽ nhập thêm
        }))
        setImages(mapped)
    }

    // thay đổi typeContent cho từng ảnh
    const handleTypeContentChange = (index: number, value: string) => {
        const updated = [...images]
        updated[index].typeContent = value
        setImages(updated)
    }

    // submit form
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
        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
            {/* Tiêu đề */}
            <div>
                <Label>Tiêu đề</Label>
                <Input {...register("title")} placeholder="Nhập tiêu đề..." />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Nội dung */}
            <div>
                <Label>Nội dung</Label>
                <Textarea {...register("content")} rows={6} placeholder="Nhập nội dung..." />
                {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
            </div>

            {/* Loại bài viết */}
            <div>
                <Label>Loại</Label>
                <Select onValueChange={(val) => setValue("type", val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn loại bài viết" />
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
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

            {/* Danh mục */}
            <div>
                <Label>Danh mục</Label>
                <Select onValueChange={(val) => setValue("categoryId", val)}>
                    <SelectTrigger>
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

            {/* Upload ảnh */}
            <div>
                <Label>Ảnh + TypeContent</Label>
                <Input type="file" accept="image/*" multiple onChange={handleImageChange} />

                <div className="mt-3 flex flex-col gap-4">
                    {images.map((img, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <img
                                src={URL.createObjectURL(img.file)}
                                alt="preview"
                                className="h-24 w-24 object-cover rounded-md border"
                            />
                            <Input
                                placeholder="Nhập typeContent..."
                                value={img.typeContent}
                                onChange={(e) => handleTypeContentChange(i, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4 mr-2" /> {isLoading ? "Đang tạo..." : "Thêm bài viết"}
            </Button>
        </form>
    )
}
