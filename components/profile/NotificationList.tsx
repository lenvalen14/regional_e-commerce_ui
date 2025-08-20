'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  Package,
  ShoppingBag,
  Star,
  Settings,
  Gift,
  Clock,
  Trash2,
  CheckCircle2,
  X,
  RefreshCcw,
} from 'lucide-react';
import { NotificationResponse } from '@/features/notification/notificationApi';
import { toast } from 'sonner';
import {
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllUserNotificationsMutation,
} from '@/features/notification';

interface NotificationListProps {
  notifications: NotificationResponse[];
  loading: boolean;
  wsConnected?: boolean;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (notificationId: string) => void;
  onDeleteAllNotifications: () => void;
}

// Gộp icon và màu sắc vào một map duy nhất để dễ quản lý và an toàn kiểu dữ liệu
const typeMap = {
  order: {
    icon: Package,
    color: 'bg-green-100 text-green-700',
  },
  product: {
    icon: ShoppingBag,
    color: 'bg-yellow-100 text-yellow-700',
  },
  review: {
    icon: Star,
    color: 'bg-indigo-100 text-indigo-700',
  },
  system: {
    icon: Settings,
    color: 'bg-gray-100 text-gray-700',
  },
  user: {
    icon: Gift,
    color: 'bg-orange-100 text-orange-700',
  },
} as const;

type NotificationType = keyof typeof typeMap;


const defaultNotificationData = {
  icon: Bell,
  color: 'bg-gray-100 text-gray-700',
};

export default function NotificationList({
  notifications,
  loading,
  wsConnected,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAllNotifications,
}: NotificationListProps) {
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);

  // RTK Query hooks for API calls
  const [markAsRead, { isLoading: markingAsRead }] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: markingAllAsRead }] = useMarkAllAsReadMutation();
  const [deleteNotification, { isLoading: deletingNotification }] = useDeleteNotificationMutation();
  const [deleteAllUserNotifications, { isLoading: deletingAllUserNotifications }] = useDeleteAllUserNotificationsMutation();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId).unwrap();
      onMarkAsRead(notificationId);
      toast.success('Đã đánh dấu là đã đọc');
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId).unwrap();
      onDelete(notificationId);
      toast.success('Đã xóa thông báo');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Không thể xóa thông báo');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      onMarkAllAsRead();
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Không thể đánh dấu tất cả đã đọc');
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllUserNotifications().unwrap();
      onDeleteAllNotifications();
      setShowConfirmDeleteAll(false);
      toast.success('Đã xóa tất cả thông báo');
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      toast.error('Không thể xóa tất cả thông báo');
    }
  };

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

  // Combined loading state
  const isAnyLoading = loading || markingAsRead || markingAllAsRead || deletingNotification || deletingAllUserNotifications;

  if (isAnyLoading) {
    return (
      <div className="space-y-4 px-4 sm:px-0">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="text-center py-12 shadow-sm">
        <CardContent>
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-beaululo text-[#2F3E34] mb-2">Không có thông báo</h3>
          <p className="text-gray-500 font-nitti">Bạn sẽ nhận được thông báo khi có hoạt động mới.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-beaululo tracking-wider text-[#2F3E34]">Thông báo</h2>
            <Badge 
              variant="secondary" 
              className="bg-[#8FBC8F]/10 text-[#8FBC8F] text-sm font-nitti py-1 px-2 rounded-full"
            >
              {unreadCount} mới
            </Badge>
          </div>
          {wsConnected !== undefined && (
            <Badge 
              variant="outline" 
              className={`font-nitti ${
                wsConnected 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {wsConnected ? 'Đã kết nối' : 'Mất kết nối'}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markingAllAsRead}
              className="text-[#8FBC8F] border-[#8FBC8F] hover:bg-[#8FBC8F]/10"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {markingAllAsRead ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
            </Button>
          )}
          
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmDeleteAll(true)}
              disabled={deletingAllUserNotifications}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deletingAllUserNotifications ? 'Đang xử lý...' : 'Xóa tất cả'}
            </Button>
          )}
        </div>
      </div>

      <Separator />

     {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const notificationData = (typeMap[notification.type as NotificationType]) || defaultNotificationData;
          const IconComponent = notificationData.icon;
          const iconColors = notificationData.color;

          return (
            <Card
              key={notification.notificationId}
              className={`group transition-all duration-200 hover:shadow-md rounded-2xl border ${
                !notification.isRead 
                  ? 'border-l-4 border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-white'
              } cursor-pointer`}
              onClick={() => !notification.isRead && handleMarkAsRead(notification.notificationId)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 p-2 rounded-full bg-opacity-10 ${iconColors}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Nội dung */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold text-base sm:text-lg ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm leading-snug mt-1 ${
                          !notification.isRead ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {notification.content}
                        </p>
                      </div>

                      {/* Action buttons - chỉ hiện khi hover */}
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.notificationId);
                            }}
                            disabled={markingAsRead}
                            className="text-green-600 hover:bg-green-100 h-8 w-8"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.notificationId);
                          }}
                          disabled={deletingNotification}
                          className="text-red-500 hover:bg-red-100 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimestampVN(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* Confirm Delete All Modal */}
      {showConfirmDeleteAll && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm rounded-xl shadow-2xl animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-beaululo text-[#2F3E34]">Xác nhận xóa</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowConfirmDeleteAll(false)} className="h-8 w-8">
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm font-nitti">
                Bạn có chắc chắn muốn xóa tất cả thông báo? Hành động này không thể hoàn tác.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDeleteAll(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAllNotifications}
                  disabled={deletingAllUserNotifications}
                  className="flex-1"
                >
                  {deletingAllUserNotifications ? (
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </div>
                  ) : (
                    'Xóa'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}