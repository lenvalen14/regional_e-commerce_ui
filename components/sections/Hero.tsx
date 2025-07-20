'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full h-[100vh] bg-[#F0F5F0] overflow-hidden font-sans text-[#2F3E34]">
      {/* Background Decorative Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg-temple.jpg"
          alt="Mái đình Việt Nam"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0F5F0] via-[#F0F5F0]/70 to-transparent" />
      </div>

      {/* Decorative Trống đồng SVG */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-10">
        <div className="relative w-full h-full">
          <Image
            src="/images/drum-pattern.jpg"
            alt="Họa tiết trống đồng"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <motion.h1
          className="font-beaululo text-5xl md:text-7xl tracking-wide leading-tight text-[#2F3E34] drop-shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Hương Vị Quê Nhà
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl text-lg md:text-xl text-[#4C5C4C] italic font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Gửi trọn tinh hoa đặc sản ba miền Việt Nam đến từng mái ấm
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Button className="mt-6 bg-[#8FBC8F] hover:bg-[#7CA87C] text-white rounded-full px-7 py-3 text-lg shadow-md transition-transform duration-300 hover:scale-105">
            Khám phá ngay <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
