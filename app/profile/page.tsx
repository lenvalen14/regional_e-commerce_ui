'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/features/auth/authApi';
import { selectCurrentToken } from '@/features/auth/authSlice';
import { SiteHeader } from '@/components/layout/Header';
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import AddressList, { AddressResponse } from "@/components/profile/AddressList";
import AddAddressModal from "@/components/profile/AddAddressModal";
import EditAddressModal from "@/components/profile/EditAddressModal";
import DeleteAddressModal from "@/components/profile/DeleteAddressModal";
import NotificationList from "@/components/profile/NotificationList";
import {
  useGetUserAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '@/features/address/addressApi'
import {
  useGetUserNotificationsQuery,
} from '@/features/notification';
import { toast } from 'sonner';

const getInitials = (name: string): string => {
  if (!name) return "?";
  const words = name.trim().split(' ').filter(Boolean);
  if (words.length === 0) return "?";
  const firstInitial = words[0][0];
  const lastInitial = words.length > 1 ? words[words.length - 1][0] : '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

const generateColorClass = (name: string): string => {
    if (!name) return 'bg-gray-500';
    const colors = [
        'bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500',
        'bg-blue-500', 'bg-cyan-500', 'bg-teal-500', 'bg-green-500',
        'bg-orange-500', 'bg-amber-500', 'bg-slate-500', 'bg-sky-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};

// --- Component ---

interface ProfileFormData {
  userName: string;
  email: string;
  phone: string;
}

type ViewKey = 'profile' | 'addresses' | 'notifications'

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const token = useSelector(selectCurrentToken);
  const { data: userResponse, isLoading, isError } = useGetProfileQuery(undefined, { skip: !token });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    userName: "",
    email: "",
    phone: "",
  });
  const [activeView, setActiveView] = useState<ViewKey>('profile')

  const userId = userResponse?.data?.userId

  // Address API hooks
  const { data: addressList = [], isLoading: isAddrLoading } = useGetUserAddressesQuery(userId!, { skip: !userId })
  const [createAddress, { isLoading: creatingAddr }] = useCreateAddressMutation()
  const [updateAddress, { isLoading: updatingAddr }] = useUpdateAddressMutation()
  const [deleteAddress, { isLoading: deletingAddrLoading }] = useDeleteAddressMutation()
  const [setDefaultAddress, { isLoading: settingDefault }] = useSetDefaultAddressMutation()

  // Notification API hooks
  const { data: notificationList, isLoading: isNotiLoading } = useGetUserNotificationsQuery({})

  // Use only real data from API
  const notifications = Array.isArray(notificationList) ? notificationList : [];

  // WebSocket connection is managed by NotificationBell only

  // Dialog state
  const [showAddAddr, setShowAddAddr] = useState(false)
  const [showEditAddr, setShowEditAddr] = useState(false)
  const [editingAddr, setEditingAddr] = useState<AddressResponse | null>(null)
  const [showDeleteAddr, setShowDeleteAddr] = useState(false)
  const [deletingAddr, setDeletingAddr] = useState<AddressResponse | null>(null)

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (userResponse && userResponse.data) {
      setFormData({
        userName: userResponse.data.userName || "",
        email: userResponse.data.email || "",
        phone: userResponse.data.phone || "",
      });
    }
  }, [userResponse]);

  useEffect(() => {
    if (isError && token) {
      router.push('/auth');
    }
  }, [isError, router, token]);

  const handleSave = async () => {
    const userId = userResponse?.data?.userId;
    if (!userId) {
        alert("Không thể cập nhật, thiếu ID người dùng.");
        return;
    }
    try {
      await updateProfile({ id: userId, data: formData }).unwrap();
      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Cập nhật thất bại.");
    }
  };
  
  const handleCancel = () => {
      setIsEditing(false);
      if (userResponse && userResponse.data) {
          setFormData({
              userName: userResponse.data.userName || "",
              email: userResponse.data.email || "",
              phone: userResponse.data.phone || "",
          });
      }
  };

  const handleAddAddress = async (payload: Omit<AddressResponse, 'addressId'>) => {
    if (!userId) return
    try {
      await createAddress({
        userId,
        addressLine: payload.addressLine,
        province: payload.province,
        phone: payload.phone,
        isDefault: payload.isDefault,
      }).unwrap()
      setShowAddAddr(false)
    } catch (e) {
      console.error(e)
      alert('Không thể thêm địa chỉ')
    }
  }

  const startEditAddress = (addr: AddressResponse) => {
    setEditingAddr(addr)
    setShowEditAddr(true)
  }

  const handleEditAddress = async (updated: AddressResponse) => {
    try {
      await updateAddress({
        addressId: updated.addressId,
        data: {
          addressLine: updated.addressLine,
          province: updated.province,
          phone: updated.phone,
          isDefault: updated.isDefault,
        },
      }).unwrap()
      setShowEditAddr(false)
      setEditingAddr(null)
    } catch (e) {
      console.error(e)
      alert('Không thể cập nhật địa chỉ')
    }
  }

  const startDeleteAddress = (addr: AddressResponse) => {
    setDeletingAddr(addr)
    setShowDeleteAddr(true)
  }

  const handleDeleteAddress = async (addr: AddressResponse) => {
    if (!addr) return; 

    try {
        await deleteAddress(addr.addressId).unwrap();
        toast.success("Xóa địa chỉ thành công!");
        setShowDeleteAddr(false);
        setDeletingAddr(null);
    } catch (error: any) {
        console.error("Lỗi khi xóa địa chỉ:", error);
        const errorMessage = error?.data?.message || 'Không thể xóa địa chỉ. Vui lòng thử lại.';
        toast.error(errorMessage);
    }
  };

  const handleSetDefault = async (addr: AddressResponse) => {
    try {
      await setDefaultAddress(addr.addressId).unwrap()
    } catch (e) {
      console.error(e)
      alert('Không thể đặt mặc định')
    }
  }

  // Notification handlers - now handled by NotificationList component
  const handleMarkAsRead = (notificationId: string) => {
    // This will be handled by the NotificationList component
    console.log('Mark as read:', notificationId);
  }

  const handleMarkAllAsRead = () => {
    // This will be handled by the NotificationList component
    console.log('Mark all as read');
  }

  const handleDeleteNotification = (notificationId: string) => {
    // This will be handled by the NotificationList component
    console.log('Delete notification:', notificationId);
  }

  const handleDeleteAllUserNotifications = () => {
    // This will be handled by the NotificationList component
    console.log('Delete all notifications');
  }

  const userInitials = useMemo(() => getInitials(formData.userName), [formData.userName]);
  const avatarColorClass = useMemo(() => generateColorClass(formData.userName), [formData.userName]);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải trang cá nhân...</div>
  }

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center">Đang chuẩn bị dữ liệu...</div>
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải trang cá nhân...</div>
  }

  if (isError) {
    return <div className="min-h-screen flex items-center justify-center">Không thể tải dữ liệu. Đang chuyển hướng...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-beaululo text-[#2F3E34] mb-4">Tài khoản của bạn</h1>
            <div className="w-24 h-1 bg-[#8FBC8F] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProfileSidebar active={activeView} onSelect={setActiveView} />
            </div>

            {activeView === 'profile' ? (
              <>
                <div className="lg:col-span-2">
                  <ProfileForm
                    profile={formData}
                    isEditing={isEditing}
                    setProfile={setFormData}
                    setIsEditing={setIsEditing}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    isSaving={isUpdating}
                  />
                </div>
                <div className="lg:col-span-1">
                  <ProfileAvatar
                    initials={userInitials}
                    bgColorClass={avatarColorClass}
                    name={formData.userName}
                    email={formData.email}
                  />
                </div>
              </>
            ) : activeView === 'addresses' ? (
              <div className="lg:col-span-3">
                <AddressList
                  addresses={addressList}
                  loading={isAddrLoading || creatingAddr || updatingAddr || deletingAddrLoading || settingDefault}
                  onAdd={() => setShowAddAddr(true)}
                  onEdit={startEditAddress}
                  onDelete={startDeleteAddress}
                  onSetDefault={handleSetDefault}
                />
                <AddAddressModal
                  isOpen={showAddAddr}
                  onClose={() => setShowAddAddr(false)}
                  onSubmit={handleAddAddress}
                  loading={creatingAddr}
                />
                <EditAddressModal
                  isOpen={showEditAddr}
                  address={editingAddr}
                  onClose={() => { setShowEditAddr(false); setEditingAddr(null) }}
                  onSubmit={handleEditAddress}
                  loading={updatingAddr}
                />
                <DeleteAddressModal
                  isOpen={showDeleteAddr}
                  address={deletingAddr}
                  onClose={() => { setShowDeleteAddr(false); setDeletingAddr(null) }}
                  onConfirm={handleDeleteAddress}
                  loading={deletingAddrLoading}
                />
              </div>
            ) : (
              <div className="lg:col-span-3">
                <NotificationList
                   notifications={notifications}
                   loading={isNotiLoading}
                   
                   onMarkAsRead={handleMarkAsRead}
                   onMarkAllAsRead={handleMarkAllAsRead}
                   onDelete={handleDeleteNotification}
                   onDeleteAllNotifications={handleDeleteAllUserNotifications}
                 />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
