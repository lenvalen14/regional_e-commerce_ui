import React from 'react';

interface ProfileAvatarProps {
  initials: string;
  bgColorClass: string;
  name: string;
  email: string;
}

export function ProfileAvatar({ initials, bgColorClass, name, email }: ProfileAvatarProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <h3 className="font-nitti font-bold text-[#2F3E34] text-lg tracking-wide text-center">
          ẢNH ĐẠI DIỆN
        </h3>
      </div>
      <div className="p-8 flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] rounded-full blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
          
          <div className={`relative h-32 w-32 rounded-full flex items-center justify-center border-4 border-white shadow-xl ${bgColorClass}`}>
            <span className="text-5xl font-bold text-white select-none font-nitti">
              {initials}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h4 className="font-nitti font-bold text-[#2F3E34] text-lg truncate">
            {name}
          </h4>
          <p className="font-nitti text-sm text-gray-600 mt-1 truncate">
            {email}
          </p>
        </div>
      </div>
    </div>
  );
}
