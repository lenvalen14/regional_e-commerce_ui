import React from "react";

interface ProfileFormProps {
  profile: {
    name: string;
    email: string;
    phone: string;
  };
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setIsEditing: (v: boolean) => void;
  handleSave: () => void;
}

export function ProfileForm({ profile, isEditing, setProfile, setIsEditing, handleSave }: ProfileFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <h3 className="font-nitti font-bold text-[#2F3E34] text-xl tracking-wide">
          THÔNG TIN TÀI KHOẢN
        </h3>
      </div>
      <div className="p-8">
        <div className="space-y-8">
          <div className="relative">
            <label className="block font-nitti text-sm font-medium text-gray-700 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-nitti text-sm focus:outline-none focus:border-[#8FBC8F] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
          <div className="relative">
            <label className="block font-nitti text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-nitti text-sm focus:outline-none focus:border-[#8FBC8F] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className="relative">
            <label className="block font-nitti text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-nitti text-sm focus:outline-none focus:border-[#8FBC8F] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200">
          {!isEditing ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] text-white rounded-lg font-nitti font-medium hover:shadow-lg transition-all transform hover:scale-105"
              >
                {/* @ts-ignore */}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                Chỉnh sửa thông tin
              </button>
              <p className="font-nitti text-sm text-gray-500 flex items-center">
                Nhấn "Chỉnh sửa" để cập nhật thông tin cá nhân
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] text-white rounded-lg font-nitti font-medium hover:shadow-lg transition-all transform hover:scale-105"
              >
                {/* @ts-ignore */}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Lưu thay đổi
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-nitti font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Hủy bỏ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
