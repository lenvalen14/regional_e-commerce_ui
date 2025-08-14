'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function ContactInfo() {
  const contactItems = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "2 Võ Oanh, TP.HCM",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Phone,
      title: "Điện thoại",
      content: "30 31 000 30",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@dacsanvietno1.com",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 đến Thứ 6: 8:00 - 17:00",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-500">
      <h3 className="text-2xl font-beaululo text-[#2F3E34] mb-6">
        Thông tin liên hệ
      </h3>
      
      <div className="space-y-4">
        {contactItems.map((item, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
          >
            <div className={`p-3 rounded-full ${item.color} group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-[#2F3E34] mb-1">{item.title}</h4>
              <p className="text-gray-600">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}