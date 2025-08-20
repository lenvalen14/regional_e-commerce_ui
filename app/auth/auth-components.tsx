import Link from "next/link";
import React from "react";

/** Input Field Component */
export function InputField({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
        {label}
      </label>
      <input
        {...props}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm 
        focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] 
        transition-colors bg-white/80"
      />
    </div>
  );
}

/** Submit Button Component */
export function SubmitButton({
  loading,
  text,
  loadingText,
}: {
  loading: boolean;
  text: string;
  loadingText: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#8FBC8F] hover:bg-[#7CA87C] disabled:bg-gray-400 disabled:cursor-not-allowed 
      text-white py-2 rounded-md font-nitti font-bold tracking-widest transition-colors shadow-md"
    >
      {loading ? loadingText : text}
    </button>
  );
}

/** Google Icon Component */
export function GoogleIcon() {
  return (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export type DecodedToken = {
  userId: string;
  sub: string;
  role: "ADMIN" | "CUSTOMER";
  userName: string;
  iat: number;
  exp: number;
};

export type FormData = {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  phone: string;
};