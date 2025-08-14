'use client';

import { useState } from "react";

import { SiteHeader } from "@/components/layout/Header";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setProfile({ ...profile, avatar: result });
        }
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
              <ProfileSidebar />
            </div>

            {/* Main Content - Form */}
            <div className="lg:col-span-2">
              <ProfileForm
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
              />
            </div>

            {/* Right Side - Avatar */}
            <div className="lg:col-span-1">
              <ProfileAvatar
                avatar={profile.avatar}
                name={profile.name}
                email={profile.email}
                isEditing={isEditing}
                handleImageUpload={handleImageUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}