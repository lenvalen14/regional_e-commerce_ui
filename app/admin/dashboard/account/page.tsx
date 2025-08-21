import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "./profileForm";
import ResetPasswordForm from "./resetPasswordForm";

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Cài đặt tài khoản
        </h2>
        <p className="mt-1 text-gray-500">
          Quản lý thông tin cá nhân và các tùy chọn bảo mật của bạn.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        {/* Thanh điều hướng Tabs */}
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
          <TabsTrigger value="password">Mật khẩu</TabsTrigger>
        </TabsList>

        {/* Nội dung của từng Tab */}
        <TabsContent value="profile">
          {/* Component Profile được đặt ở đây */}
          <ProfileForm />
        </TabsContent>
        <TabsContent value="password">
          {/* Component Đổi mật khẩu được đặt ở đây */}
          <ResetPasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}