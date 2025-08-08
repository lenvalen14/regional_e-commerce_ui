'use client';

import { MapPin } from 'lucide-react';

export function ContactMap() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full group hover:shadow-xl transition-all duration-500 flex flex-col">
      {/* Map Header */}
      <div className="bg-[#8FBC8F] p-4 text-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 animate-bounce" />
          <h3 className="font-semibold">Vị trí của chúng tôi</h3>
        </div>
      </div>

      {/* Map Container - flex-1 để chiếm hết không gian còn lại */}
      <div className="relative flex-1">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d979.7711311394726!2d106.716604210073!3d10.804838166974845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528a3f0b1f849%3A0x234506e937a8dbef!2zMiBWw7UgT2FuaCwgUGjGsOG7nW5nIDI1LCBCw6xuaCBUaOG6oW5oLCBI4buTIENow60gTWluaCA3MDAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1754650515947!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="transition-all duration-500 group-hover:brightness-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

