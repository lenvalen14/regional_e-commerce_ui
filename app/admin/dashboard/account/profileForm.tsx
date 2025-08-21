"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/features/auth/authApi"
import { selectCurrentToken } from "@/features/auth/authSlice"
import { useSelector } from "react-redux"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email(),
  phone: z.string().min(9, {
    message: "Số điện thoại phải có ít nhất 9 chữ số.",
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const [mounted, setMounted] = useState(false)
  const token = useSelector(selectCurrentToken)
  const {
    data: userResponse,
    isLoading,
    isError,
  } = useGetProfileQuery(undefined, { skip: !token })
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (userResponse?.data) {
      form.reset({
        name: userResponse.data.userName,
        email: userResponse.data.email,
        phone: userResponse.data.phone ?? "",
      })
    }
  }, [userResponse, form])

  async function onSubmit(data: ProfileFormValues) {
    if (!userResponse?.data?.userId) return
    try {
      await updateProfile({
        id: userResponse.data.userId,
        data: {
          userName: data.name,
          email: data.email,
          phone: data.phone,
        },
      }).unwrap()
      toast({
        title: "Thành công!",
        description: "Thông tin cá nhân của bạn đã được cập nhật.",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra!",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại.",
      })
    }
  }

  // 🚀 mounted check phải ở đây, sau khi gọi hết hook
  if (!mounted) {
    return (
      <Card className="flex items-center justify-center h-40 rounded-2xl shadow-md">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-40 rounded-2xl shadow-md">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="flex items-center justify-center h-40 rounded-2xl shadow-md">
        <p className="text-red-500 font-medium">
          Không thể tải thông tin người dùng.
        </p>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl shadow-lg border border-gray-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Thông tin cá nhân</CardTitle>
            <CardDescription className="text-gray-500">
              Cập nhật họ tên, email và số điện thoại của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Họ tên */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Họ và Tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập họ và tên..."
                      className="rounded-xl focus:ring-2 focus:ring-primary/50 transition"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Đây là tên sẽ hiển thị công khai.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      readOnly
                      className="rounded-xl bg-gray-50 cursor-not-allowed text-gray-500"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Email không thể thay đổi.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số điện thoại..."
                      className="rounded-xl focus:ring-2 focus:ring-primary/50 transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end mt-5">
            <Button
              type="submit"
              disabled={isUpdating}
              className="rounded-xl px-6 shadow-sm"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
