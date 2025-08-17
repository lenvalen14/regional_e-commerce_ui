"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Bell, BellRing, Package, User, ShoppingBag, Star, Settings, Clock, Trash2 } from "lucide-react"

interface Notification {
  id: string
  type: "order" | "user" | "product" | "review" | "system"
  title: string
  message: string
  timestamp: string
  isRead: boolean
}

const sampleNotifications: Notification[] = [
  {
    id: "NOTI001",
    type: "order",
    title: "Đơn hàng mới",
    message: "Khách hàng Nguyễn Văn An vừa đặt đơn hàng #DH001 trị giá 175.000đ",
    timestamp: "2 phút trước",
    isRead: false
  },
  {
    id: "NOTI002",
    type: "review",
    title: "Đánh giá mới",
    message: "Sản phẩm 'Bánh tráng nướng Tây Ninh' nhận được đánh giá 5 sao từ khách hàng",
    timestamp: "5 phút trước",
    isRead: false
  },
  {
    id: "NOTI003",
    type: "product",
    title: "Sản phẩm hết hàng",
    message: "Sản phẩm 'Mắm ruốc Huế' đã hết hàng trong kho, cần nhập thêm",
    timestamp: "10 phút trước",
    isRead: false
  },
  {
    id: "NOTI004",
    type: "user",
    title: "Người dùng mới",
    message: "Tài khoản mới 'tranbinh@email.com' vừa đăng ký thành công",
    timestamp: "15 phút trước",
    isRead: true
  },
  {
    id: "NOTI005",
    type: "order",
    title: "Đơn hàng đã giao",
    message: "Đơn hàng #DH003 đã được giao thành công đến khách hàng",
    timestamp: "30 phút trước",
    isRead: true
  },
  {
    id: "NOTI006",
    type: "system",
    title: "Cập nhật hệ thống",
    message: "Hệ thống đã được cập nhật phiên bản mới với nhiều tính năng cải tiến",
    timestamp: "1 giờ trước",
    isRead: true
  }
]

const typeIcons = {
  order: Package,
  user: User,
  product: ShoppingBag,
  review: Star,
  system: Settings
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  
  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification =>
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Thông báo</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-blue-600 hover:text-blue-700 h-auto p-1 text-xs"
              >
                Đọc tất cả
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Không có thông báo</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const IconComponent = typeIcons[notification.type]
            return (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 focus:bg-gray-50 cursor-pointer ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium truncate ${
                        !notification.isRead ? "text-gray-900" : "text-gray-700"
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {notification.timestamp}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteNotification(notification.id)
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            )
          })
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-blue-600 hover:text-blue-700"
                onClick={() => window.location.href = "/admin/dashboard/noti"}
              >
                Xem tất cả thông báo
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
