'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { SiteHeader } from '@/components/layout/Header';
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import AddressList, { AddressResponse } from "@/components/profile/AddressList";
import AddAddressModal from "@/components/profile/AddAddressModal";
import EditAddressModal from "@/components/profile/EditAddressModal";
import DeleteAddressModal from "@/components/profile/DeleteAddressModal";
import NotificationList from "@/components/profile/NotificationList";
import ChangePassword from "@/components/profile/ChangePassword";

import { selectCurrentToken } from '@/features/auth/authSlice';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation
} from '@/features/auth/authApi';

import {
  useGetUserAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '@/features/address/addressApi'

import { useGetUserNotificationsQuery } from '@/features/notification';

type ViewKey = 'profile' | 'addresses' | 'notifications' | 'password';

interface ProfileFormData {
  userName: string;
  email: string;
  phone: string;
}

// --- Utils ---
const getInitials = (name: string) => {
  if (!name) return "?";
  const words = name.trim().split(' ').filter(Boolean);
  if (!words.length) return "?";
  return `${words[0][0]}${words.length > 1 ? words[words.length-1][0] : ''}`.toUpperCase();
};

const generateColorClass = (name: string) => {
  if (!name) return 'bg-gray-500';
  const colors = ['bg-red-500','bg-pink-500','bg-purple-500','bg-indigo-500','bg-blue-500','bg-cyan-500','bg-teal-500','bg-green-500','bg-orange-500','bg-amber-500','bg-slate-500','bg-sky-500'];
  let hash = 0;
  for (let i=0;i<name.length;i++) hash = name.charCodeAt(i) + ((hash<<5)-hash);
  return colors[Math.abs(hash % colors.length)];
}

// --- Component ---
export default function ProfilePage() {
  const router = useRouter();
  const token = useSelector(selectCurrentToken);
  const [isMounted, setIsMounted] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({userName:'',email:'',phone:''});

  // Profile API
  const { data: userResponse, isLoading, isError } = useGetProfileQuery(undefined, { skip: !token });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();

  const userId = userResponse?.data?.userId;

  // Address API
  const { data: addressList = [], isLoading: isAddrLoading } = useGetUserAddressesQuery(userId!, { skip: !userId });
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  // Notifications
  const { data: notificationList, isLoading: isNotiLoading } = useGetUserNotificationsQuery({});
  const notifications = Array.isArray(notificationList) ? notificationList : [];

  // Dialogs
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [showEditAddr, setShowEditAddr] = useState(false);
  const [editingAddr, setEditingAddr] = useState<AddressResponse|null>(null);
  const [showDeleteAddr, setShowDeleteAddr] = useState(false);
  const [deletingAddr, setDeletingAddr] = useState<AddressResponse|null>(null);

  // Hydration
  useEffect(()=>{ setIsMounted(true); }, []);
  useEffect(()=>{
    if(userResponse?.data){
      setFormData({
        userName:userResponse.data.userName||"",
        email:userResponse.data.email||"",
        phone:userResponse.data.phone||""
      });
    }
  },[userResponse]);

  useEffect(()=>{
    if(isError && token) router.push('/auth');
  },[isError,router,token]);

  const userInitials = useMemo(()=>getInitials(formData.userName),[formData.userName]);
  const avatarColorClass = useMemo(()=>generateColorClass(formData.userName),[formData.userName]);

  // Handlers
  const handleSaveProfile = async()=>{
    if(!userId) return toast.error("Thiếu ID người dùng");
    try{
      await updateProfile({id:userId,data:formData}).unwrap();
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    }catch(e){ console.error(e); toast.error("Cập nhật thất bại"); }
  }

  const handleCancelProfile = ()=>{
    setIsEditing(false);
    if(userResponse?.data){
      setFormData({
        userName:userResponse.data.userName||"",
        email:userResponse.data.email||"",
        phone:userResponse.data.phone||""
      });
    }
  }

  const handleAddAddress = async(payload:Omit<AddressResponse,'addressId'>)=>{
    if(!userId) return;
    try{
      await createAddress({...payload,userId}).unwrap();
      setShowAddAddr(false);
      toast.success("Thêm địa chỉ thành công!");
    }catch(e){ console.error(e); toast.error("Không thể thêm địa chỉ"); }
  }

  const handleEditAddress = async(addr:AddressResponse)=>{
    try{
      await updateAddress({addressId:addr.addressId,data:addr}).unwrap();
      setShowEditAddr(false); setEditingAddr(null);
      toast.success("Cập nhật địa chỉ thành công!");
    }catch(e){ console.error(e); toast.error("Không thể cập nhật địa chỉ"); }
  }

  const handleDeleteAddress = async(addr:AddressResponse)=>{
    if(!addr) return;
    try{
      await deleteAddress(addr.addressId).unwrap();
      setShowDeleteAddr(false); setDeletingAddr(null);
      toast.success("Xóa địa chỉ thành công!");
    }catch(e:any){ console.error(e); toast.error(e?.data?.message || "Không thể xóa địa chỉ"); }
  }

  const handleSetDefault = async(addr:AddressResponse)=>{
    try{ await setDefaultAddress(addr.addressId).unwrap(); }catch(e){ console.error(e); toast.error("Không thể đặt mặc định"); }
  }

  if(!isMounted) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>
  if(!token) return <div className="min-h-screen flex items-center justify-center">Đang chuẩn bị dữ liệu...</div>
  if(isLoading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>
  if(isError) return <div className="min-h-screen flex items-center justify-center">Không thể tải dữ liệu. Chuyển hướng...</div>

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

            {activeView==='profile' ? (
              <>
                <div className="lg:col-span-2">
                  <ProfileForm
                    profile={formData}
                    isEditing={isEditing}
                    setProfile={setFormData}
                    setIsEditing={setIsEditing}
                    handleSave={handleSaveProfile}
                    handleCancel={handleCancelProfile}
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
            ) : activeView==='addresses' ? (
              <div className="lg:col-span-3">
                <AddressList
                  addresses={addressList}
                  loading={isAddrLoading}
                  onAdd={()=>setShowAddAddr(true)}
                  onEdit={(addr)=>{ setEditingAddr(addr); setShowEditAddr(true); }}
                  onDelete={(addr)=>{ setDeletingAddr(addr); setShowDeleteAddr(true); }}
                  onSetDefault={handleSetDefault}
                />
                <AddAddressModal isOpen={showAddAddr} onClose={()=>setShowAddAddr(false)} onSubmit={handleAddAddress} loading={false} />
                <EditAddressModal isOpen={showEditAddr} address={editingAddr} onClose={()=>{setShowEditAddr(false);setEditingAddr(null)}} onSubmit={handleEditAddress} loading={false} />
                <DeleteAddressModal isOpen={showDeleteAddr} address={deletingAddr} onClose={()=>{setShowDeleteAddr(false);setDeletingAddr(null)}} onConfirm={handleDeleteAddress} loading={false} />
              </div>
            ) : activeView==='notifications' ? (
              <div className="lg:col-span-3">
                <NotificationList notifications={notifications} loading={isNotiLoading} 
                  onMarkAsRead={()=>{}}
                  onMarkAllAsRead={()=>{}}
                  onDelete={()=>{}}
                  onDeleteAllNotifications={()=>{}}
                />
              </div>
            ) : (
              <div className="lg:col-span-3">
                <ChangePassword
                  loading={isChanging}
                  onSubmit={async(current,newPass,confirm)=>{
                    if(newPass!==confirm){ toast.error("Mật khẩu mới không khớp"); return; }
                    try{
                      await changePassword({password:current, newPassword:newPass, confirmPassword:confirm}).unwrap();
                      toast.success("Đổi mật khẩu thành công!");
                    }catch(e:any){
                      toast.error(e?.data?.message || "Đổi mật khẩu thất bại");
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
