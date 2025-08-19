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

export default function ProfilePage() {
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

  const userInitials = useMemo(() => getInitials(formData.userName), [formData.userName]);
  const avatarColorClass = useMemo(() => generateColorClass(formData.userName), [formData.userName]);

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
              <ProfileSidebar />
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
