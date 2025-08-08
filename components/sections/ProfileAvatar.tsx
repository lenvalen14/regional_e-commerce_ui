import React from "react";

interface ProfileAvatarProps {
  avatar: string;
  name: string;
  email: string;
  isEditing: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatar({ avatar, name, email, isEditing, handleImageUpload }: ProfileAvatarProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <h3 className="font-nitti font-bold text-[#2F3E34] text-lg tracking-wide text-center">
          ẢNH ĐẠI DIỆN
        </h3>
      </div>
      <div className="p-8 flex flex-col items-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] rounded-full blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <img
            src={avatar}
            alt={name}
            className="relative h-32 w-32 rounded-full object-cover border-4 border-white shadow-xl"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] hover:from-[#7CA87C] hover:to-[#6BA76B] text-white p-3 rounded-full cursor-pointer transition-all transform hover:scale-110 shadow-lg">
              {/* Camera icon */}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div className="mt-6 text-center">
          <h4 className="font-nitti font-bold text-[#2F3E34] text-lg">
            {name}
          </h4>
          <p className="font-nitti text-sm text-gray-600 mt-1">
            {email}
          </p>
        </div>
        {isEditing && (
          <div className="mt-4 p-4 bg-gradient-to-r from-[#8FBC8F]/10 to-[#7CA87C]/10 rounded-lg border border-[#8FBC8F]/20">
            <p className="font-nitti text-xs text-center text-gray-600 leading-relaxed">
              {/* Camera icon */}
              <svg className="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              Nhấn vào biểu tượng camera để thay đổi ảnh đại diện
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
