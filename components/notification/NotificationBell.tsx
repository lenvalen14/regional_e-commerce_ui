"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Bell, BellRing, Package, User, ShoppingBag, Star, Settings, Clock, Trash2, CheckCircle2 } from "lucide-react"
import { NotificationResponse } from "@/features/notification/notificationApi"
import { 
  useGetUserNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetUnreadCountQuery
} from "@/features/notification"
import { useWebSocketNotifications } from "@/features/notification"
import { selectCurrentToken } from "@/features/auth/authSlice"
import { useGetProfileQuery } from "@/features/auth/authApi"
import { toast } from "sonner"

export default function NotificationBell() {
  const [isMounted, setIsMounted] = useState(false)
  const token = useSelector(selectCurrentToken)
  const [isOpen, setIsOpen] = useState(false)
  
  // Get user profile to get userId
  const { data: userResponse } = useGetProfileQuery(undefined, { skip: !token })
  const userId = userResponse?.data?.userId
  
  // API hooks
  const { data: notificationsData, isLoading } = useGetUserNotificationsQuery({}, { skip: !token || !userId })
  const notifications = Array.isArray(notificationsData) ? notificationsData : []
  const { data: unreadCountData } = useGetUnreadCountQuery(undefined, { skip: !token || !userId })
  const [markAsRead] = useMarkAsReadMutation()
  const [markAllAsRead] = useMarkAllAsReadMutation()
  const [deleteNotification] = useDeleteNotificationMutation()
  
  // WebSocket for real-time notifications
  const { isConnected: wsConnected } = useWebSocketNotifications({
    userId: userId!,
    onNewNotification: (newNotification) => {
      toast.success(`Thông báo mới: ${newNotification.title}`)
    },
    onConnectionChange: (connected) => {
      console.log(`WebSocket ${connected ? 'connected' : 'disconnected'} for NotificationBell`)
    }
  })
  
  const unreadCount = unreadCountData?.count || 0

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="relative h-9 w-9">
        <Bell className="h-5 w-5 text-gray-500" />
      </Button>
    )
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId).unwrap()
      toast.success('Đã đánh dấu đã đọc')
    } catch (error) {
      console.error('Failed to mark as read:', error)
      toast.error('Không thể đánh dấu đã đọc')
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId).unwrap()
      toast.success('Đã xóa thông báo')
    } catch (error) {
      console.error('Failed to delete notification:', error)
      toast.error('Không thể xóa thông báo')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap()
      toast.success('Đã đánh dấu tất cả đã đọc')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('Không thể đánh dấu tất cả đã đọc')
    }
  }

  const formatTimestampVN = (timestamp: string) => {
    const createdDate = new Date(timestamp);

    const vnDate = new Date(createdDate.getTime() + 7 * 60 * 60 * 1000);

    const now = new Date();

    const diffInMinutes = Math.floor((now.getTime() - vnDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const getNotificationIcon = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('đơn hàng') || lowerTitle.includes('order')) return Package
    if (lowerTitle.includes('sản phẩm') || lowerTitle.includes('product')) return ShoppingBag
    if (lowerTitle.includes('đánh giá') || lowerTitle.includes('review')) return Star
    if (lowerTitle.includes('người dùng') || lowerTitle.includes('user')) return User
    if (lowerTitle.includes('hệ thống') || lowerTitle.includes('system')) return Settings
    return Bell
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-gray-700 animate-pulse" />
          ) : (
            <Bell className="h-5 w-5 text-gray-500" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto shadow-xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
          <h3 className="font-beaululo text-lg tracking-wide text-gray-800">Thông báo</h3>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="link"
              onClick={handleMarkAllAsRead}
              className="text-sm font-nitti text-[#8FBC8F] hover:text-[#7CA87C] p-0 h-auto"
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8FBC8F] mx-auto mb-3"></div>
            <p className="text-sm font-nitti">Đang tải thông báo...</p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-nitti">Không có thông báo nào</p>
          </div>
        ) : (
          !isLoading && notifications.map((notification: NotificationResponse) => {
            const IconComponent = getNotificationIcon(notification.title)
            return (
              <DropdownMenuItem
                key={notification.notificationId}
                className={`flex items-start gap-4 p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200 ${
                  !notification.isRead ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.notificationId)}
              >
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    notification.isRead ? "bg-gray-100 text-gray-400" : "bg-[#E0F0E0] text-[#4C5C4C]"
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-semibold truncate pr-2 ${!notification.isRead ? "text-gray-900" : "text-gray-600"}`}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className={`text-xs ${!notification.isRead ? "text-gray-700" : "text-gray-500"} line-clamp-2`}>
                    {notification.content}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{formatTimestampVN(notification.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.notificationId);
                      }}
                      className="h-6 w-6 p-0 text-green-500 hover:bg-green-100"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.notificationId);
                    }}
                    className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </DropdownMenuItem>
            )
          })
        )}
        
        {!isLoading && notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-sm font-nitti text-[#8FBC8F] hover:text-[#7CA87C] transition-colors"
                onClick={() => window.location.href = "/profile"}
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