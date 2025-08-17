"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Bell, BellRing, Package, User, ShoppingBag, Star, Settings, Clock, Trash2 } from "lucide-react"

// Define interfaces
interface Notification {
  id: string
  type: "order" | "user" | "product" | "review" | "system"
  title: string
  message: string
  timestamp: string
  isRead: boolean
}

// Sample notifications data
const initialNotificationsData: Notification[] = [
  {
    id: "NOTI001",
    type: "order",
    title: "Đơn hàng mới",
    message: "Khách hàng Nguyễn Văn An vừa đặt đơn hàng #DH001",
    timestamp: "5 phút trước",
    isRead: false
  },
  {
    id: "NOTI002",
    type: "review",
    title: "Đánh giá mới",
    message: "Sản phẩm 'Bánh tráng nướng Tây Ninh' nhận đánh giá 5 sao",
    timestamp: "10 phút trước",
    isRead: false
  },
  {
    id: "NOTI003",
    type: "user",
    title: "Người dùng mới",
    message: "Tài khoản mới 'tranbinh@email.com' vừa đăng ký",
    timestamp: "15 phút trước",
    isRead: true
  },
  {
    id: "NOTI004",
    type: "product",
    title: "Sản phẩm hết hàng",
    message: "Sản phẩm 'Mắm ruốc Huế' đã hết hàng",
    timestamp: "30 phút trước",
    isRead: false
  },
  {
    id: "NOTI005",
    type: "order",
    title: "Đơn hàng đã giao",
    message: "Đơn hàng #DH003 đã được giao thành công",
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotificationsData)
  
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Thông Báo</h2>
        
        {/* Notification Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              {unreadCount > 0 ? (
                <BellRing className="h-5 w-5" />
              ) : (
                <Bell className="h-5 w-5" />
              )}
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="ml-2">Thông báo ({unreadCount})</span>
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
                  >
                    Xem tất cả thông báo
                  </Button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content - Simple List */}
      <Card>
        <CardHeader>
          <CardTitle>Tất cả thông báo ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = typeIcons[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 transition-colors hover:bg-gray-50 ${
                      !notification.isRead ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-medium ${
                            !notification.isRead ? "text-gray-900" : "text-gray-700"
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {notification.type === "order" && "Đơn hàng"}
                              {notification.type === "user" && "Người dùng"}
                              {notification.type === "product" && "Sản phẩm"}
                              {notification.type === "review" && "Đánh giá"}
                              {notification.type === "system" && "Hệ thống"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.timestamp}
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700 border-blue-200"
                              >
                                Đánh dấu đã đọc
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700 border-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
