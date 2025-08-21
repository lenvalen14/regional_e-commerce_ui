"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, Calendar } from "lucide-react"
import { NewResponse } from "@/features/new/newApi"

interface Props {
    news: NewResponse[]
    onDelete: (id: string) => void
}

// Chuyển timestamp sang ngày hiển thị (ổn định với TZ + giây/ms)
export const formatDate = (timestamp: number | string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
};

export default function NewsItems({ news, onDelete }: Props) {
    if (news.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Không có bài viết nào</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {news.map((n) => (
                <div
                    key={n.newId}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex flex-col space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-900">{n.title}</h4>
                                <p className="text-sm text-gray-500">
                                    {n.category?.categoryName || "Không có category"} • {n.type}
                                </p>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(n.createAt)}
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="line-clamp-2 text-sm text-gray-700">
                            {n.content}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-xs text-gray-500">ID: {n.newId}</div>
                            <div className="flex items-center space-x-2">
                                {/* View */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            <Eye className="h-4 w-4 mr-1" /> Xem
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent
                                        className="sm:max-w-7xl w-[90vw] max-h-[90vh] overflow-y-auto"
                                    >
                                        <DialogHeader>
                                            <DialogTitle>{n.title}</DialogTitle>
                                            <DialogDescription>
                                                {n.category?.categoryName || "Không có category"} • {n.type}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="mt-4 flex gap-6">
                                            {/* Cột ảnh bên trái */}
                                            <div className="w-1/2">
                                                {n.images?.length ? (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {n.images.map((img) => (
                                                            <div key={img.imageId}>
                                                                <img
                                                                    src={img.imageUrl}
                                                                    alt={img.typeContent}
                                                                    className="rounded-md border max-h-[500px] object-contain w-full"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-400">Không có ảnh</p>
                                                )}
                                            </div>

                                            {/* Cột nội dung text bên phải */}
                                            <div className="w-1/2">
                                                <p className="text-gray-800 whitespace-pre-line">{n.content}</p>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Delete */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" /> Xóa
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Bạn có chắc chắn muốn xóa bài viết này không?
                                                <br />
                                                <strong>{n.title}</strong>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onDelete(n.newId)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Xóa
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
