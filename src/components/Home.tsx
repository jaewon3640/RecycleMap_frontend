import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Region, Category } from '../App';
import { mockCategories, mockPopularItems } from '../data/mockData';
import { Logo } from './Logo';

interface HomeProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
  onSearch: (query: string) => void;
  onCategorySelect: (category: Category) => void;
}

export function Home({ selectedRegion, onRegionChange, onSearch, onCategorySelect }: HomeProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleQuickSearch = (item: string) => {
    onSearch(item);
  };

  const regions = [
    { id: 'suwon-yeongtong', city: '수원시', district: '영통구' },
    { id: 'suwon-jangan', city: '수원시', district: '장안구' },
    { id: 'suwon-paldal', city: '수원시', district: '팔달구' },
    { id: 'suwon-gwonseon', city: '수원시', district: '권선구' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Logo className="w-16 h-16" />
            <div>
              <h1 className="text-gray-900">분리수거 가이드</h1>
              <p className="text-gray-500 text-sm">우리 지역 분리수거 규칙을 확인하세요</p>
            </div>
          </div>

          {/* Region Selector */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">내 지역</span>
            </div>
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const region = regions.find(r => r.id === e.target.value);
                if (region) onRegionChange(region);
              }}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.city} {region.district}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="품목을 검색하세요 (예: 페트병, 스티로폼)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </form>

        {/* Popular Items */}
        <div className="mb-10">
          <h2 className="text-gray-900 mb-4">자주 찾는 품목</h2>
          <div className="flex flex-wrap gap-2">
            {mockPopularItems.map((item) => (
              <button
                key={item}
                onClick={() => handleQuickSearch(item)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-gray-900 mb-4">카테고리별 규칙</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-green-200"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${category.color} mb-3`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            💡 잘못된 정보가 있나요? 각 품목 상세 페이지에서 신고해주세요!
          </p>
        </div>
      </div>
    </div>
  );
}