import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: string
  joinDate: string
  orders: number
}

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: (userId: number) => void
  user: User | null
}

export default function DeleteUserModal({ isOpen, onClose, onDelete, user }: DeleteUserModalProps) {
  const handleDelete = () => {
    if (user) {
      onDelete(user.id)
      onClose()
    }
  }

  if (!user) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa Tài Khoản Người Dùng</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.</p>
              
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <h4 className="font-medium text-gray-900">Thông tin người dùng:</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Tên:</span> {user.name}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Số điện thoại:</span> {user.phone}</p>
                  <p><span className="font-medium">Địa chỉ:</span> {user.address}</p>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Trạng thái:</span>
                    <Badge
                      variant={user.status === "Active" ? "default" : "secondary"}
                      className={
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {user.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </div>
                  <p><span className="font-medium">Số đơn hàng:</span> {user.orders}</p>
                  <p><span className="font-medium">Ngày tham gia:</span> {user.joinDate}</p>
                </div>
              </div>

              {user.orders > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ <strong>Cảnh báo:</strong> Người dùng này đã có {user.orders} đơn hàng. 
                    Việc xóa tài khoản có thể ảnh hưởng đến dữ liệu đơn hàng.
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa tài khoản
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
