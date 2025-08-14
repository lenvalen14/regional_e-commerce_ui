'use client';

import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { ContactMap } from "@/components/contact/ContactMap";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SiteHeader />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Header Section với animation */}
          <div className="text-center mb-16 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-beaululo text-[#2F3E34] mb-4">
              Liên hệ với chúng tôi
            </h1>
            <div className="w-24 h-1 bg-[#8FBC8F] mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi để được tư vấn tốt nhất.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Side - Map */}
            <div className="animate-slideInFromLeft">
              <ContactMap />
            </div>

            {/* Right Side - Contact Info & Form */}
            <div className="space-y-8 animate-slideInFromRight">
              <ContactInfo />
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}