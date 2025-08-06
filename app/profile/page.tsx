'use client';

import { useState } from "react";
import { SiteHeader } from "@/components/sections/Header";
import { Camera, Save, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Phan Phạm Ngọc Thạch",
    email: "pngthach@gmail.com",
    phone: "0123456789",
    avatar: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/528903336_615813391570470_6438716491300480355_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFz--sDF4bm2KQkSuUf52Mz7h0KOAEMeUvuHQo4AQx5S__8YGrcurouDdlcNBr7pMMqfks4XcRcX9E1C2etnUYV&_nc_ohc=NDapKGjUWOYQ7kNvwH3CF_X&_nc_oc=AdmNAxjJlu__nLpCbGaihrl-G1jWWMozBiS-h7jk_j-STVP_bo9a1PUN1HIE6pGUWxA&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=O8aF1dmaMRx0Za8gOZovjw&oh=00_AfU2otB3VEm_HFLbo8Vz2rQfDi4qNn3cHPTr_924XGXghA&oe=689927F0"
  });

  const handleSave = () => {
    // TODO: Save to backend
    setIsEditing(false);
    console.log("Saved profile:", profile);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header với đường gạch dưới */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-beaululo text-[#2F3E34] mb-4">Tài khoản của bạn</h1>
            <div className="w-24 h-1 bg-[#8FBC8F] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Menu */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] p-6">
                  <h3 className="font-nitti font-bold text-white text-lg tracking-wide">
                    TÀI KHOẢN
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <li>
                      <button className="flex items-center w-full text-left p-3 rounded-lg bg-[#8FBC8F]/10 text-[#8FBC8F] font-nitti font-medium transition-all hover:bg-[#8FBC8F]/20">
                        <div className="w-2 h-2 bg-[#8FBC8F] rounded-full mr-3"></div>
                        Thông tin tài khoản
                      </button>
                    </li>
                    <li>
                      <button className="flex items-center w-full text-left p-3 rounded-lg text-gray-600 font-nitti hover:bg-gray-50 hover:text-[#8FBC8F] transition-all">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                        Danh sách địa chỉ
                      </button>
                    </li>
                    <li>
                      <button className="flex items-center w-full text-left p-3 rounded-lg text-gray-600 font-nitti hover:bg-gray-50 hover:text-red-500 transition-all">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content - Form */}
            <div className="lg:col-span-2">
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
                          <Edit2 className="h-4 w-4" />
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
                          <Save className="h-4 w-4" />
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
            </div>

            {/* Right Side - Avatar */}
            <div className="lg:col-span-1">
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
                      src={profile.avatar}
                      alt={profile.name}
                      className="relative h-32 w-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] hover:from-[#7CA87C] hover:to-[#6BA76B] text-white p-3 rounded-full cursor-pointer transition-all transform hover:scale-110 shadow-lg">
                        <Camera className="h-5 w-5" />
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
                      {profile.name}
                    </h4>
                    <p className="font-nitti text-sm text-gray-600 mt-1">
                      {profile.email}
                    </p>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-[#8FBC8F]/10 to-[#7CA87C]/10 rounded-lg border border-[#8FBC8F]/20">
                      <p className="font-nitti text-xs text-center text-gray-600 leading-relaxed">
                        <Camera className="h-4 w-4 inline mr-1" />
                        Nhấn vào biểu tượng camera để thay đổi ảnh đại diện
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}