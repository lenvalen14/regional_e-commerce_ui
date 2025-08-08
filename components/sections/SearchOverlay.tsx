'use client';

import { useState, useEffect } from "react";
import { Search, X, TrendingUp } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false); // Thêm state focus

  // Mock trending searches
  const trendingSearches = [
    "Bánh tráng nướng",
    "Mắm ruốc",
    "Chà bông",
    "Bánh đậu xanh",
    "Tôm khô Cà Mau"
  ];

  // Mock recent searches
  const recentSearches = [
    "Đặc sản miền Bắc",
    "Bánh kẹo truyền thống"
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery("");
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search logic
    console.log("Searching for:", query);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-300 ease-in-out ${
      isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}>
      {/* Background Overlay */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          isOpen ? 'bg-black/20' : 'bg-black/0'
        }`} 
        onClick={onClose}
      ></div>
      
      {/* Search Panel - Nửa bên phải */}
      <div className={`absolute top-0 right-0 h-full w-1/2 bg-white shadow-2xl transition-all duration-500 ease-in-out ${
        isOpen ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
      }`}>
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-beaululo text-[#2F3E34] transition-all duration-700 ease-out ${
                isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}
              style={{ transitionDelay: isOpen ? '200ms' : '0ms' }}>
                Tìm kiếm
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 group"
              >
                <X className="h-6 w-6 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-6 py-8">
          <div className={`relative transition-all duration-700 ease-out ${
            isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
          style={{ transitionDelay: isOpen ? '300ms' : '0ms' }}>
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10 transition-all duration-300 ease-out ${
              isFocused || searchQuery ? 'translate-x-[-8px] scale-90 text-[#8FBC8F]' : ''
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-12 pr-4 py-4 text-lg font-nitti border-b-2 border-gray-300 focus:border-[#8FBC8F] outline-none bg-transparent transition-all duration-300 ease-out focus:scale-105"
              autoFocus
            />
          </div>
        </div>

        {/* Search Content */}
        <div className="px-6 overflow-y-auto h-[calc(100vh-200px)]">
          <div className={`transition-all duration-700 ease-out ${
            isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
          style={{ transitionDelay: isOpen ? '400ms' : '0ms' }}>
            {searchQuery ? (
              /* Search Results */
              <div>
                <h3 className="font-nitti font-medium text-[#2F3E34] mb-4">
                  Kết quả tìm kiếm cho "{searchQuery}"
                </h3>
                <div className="text-gray-600 font-nitti">
                  Đang tìm kiếm...
                </div>
              </div>
            ) : (
              /* Default State */
              <div className="space-y-8">
                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-[#8FBC8F]" />
                    <h3 className="font-nitti font-medium text-[#2F3E34]">
                      Tìm kiếm phổ biến
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 bg-gray-100 hover:bg-[#8FBC8F] hover:text-white rounded-full font-nitti text-sm transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md"
                        style={{ 
                          animationDelay: isOpen ? `${500 + index * 100}ms` : '0ms',
                          animation: isOpen ? 'fadeInUp 0.5s ease-out both' : 'none'
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="font-nitti font-medium text-[#2F3E34] mb-4">
                      Tìm kiếm gần đây
                    </h3>
                    <div className="space-y-2">
                      {recentSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(term)}
                          className="block w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-nitti text-gray-700 transition-all duration-300 ease-out transform hover:translate-x-2 hover:shadow-sm"
                          style={{ 
                            animationDelay: isOpen ? `${700 + index * 100}ms` : '0ms',
                            animation: isOpen ? 'slideInLeft 0.5s ease-out both' : 'none'
                          }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}