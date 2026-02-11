import { useState } from 'react';
import { Search, MapPin, MessageSquare, ChevronRight, Bell } from 'lucide-react';
import { Region, Category } from '../App';
import { mockCategories, mockPopularItems } from '../data/mockData';
import { Logo } from './Logo';

interface HomeProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
  onSearch: (query: string) => void;
  onCategorySelect: (category: Category) => void;
  onGoToMyFeedback: () => void; // 피드백 페이지 이동 함수 추가
}

export function Home({ 
  selectedRegion, 
  onRegionChange, 
  onSearch, 
  onCategorySelect,
  onGoToMyFeedback 
}: HomeProps) {
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
    { id: 'suwon-yeongtong', dbId: 1, city: '수원시', district: '영통구' },
  { id: 'suwon-jangan', dbId: 2, city: '수원시', district: '장안구' },
  { id: 'suwon-paldal', dbId: 3, city: '수원시', district: '팔달구' },
  { id: 'suwon-gwonseon', dbId: 4, city: '수원시', district: '권선구' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-bold text-green-900 leading-tight">RecycleMap</h1>
              <p className="text-[10px] text-green-600 font-medium tracking-wider uppercase">Suwon Guide</p>
            </div>
          </div>
          
          {/* 내 피드백 이동 버튼 */}
          <button 
            onClick={onGoToMyFeedback}
            className="group flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm border border-green-100"
          >
            <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="text-sm font-bold">내 피드백</span>
          </button>
        </div>
      </header>

      {/* Hero Section & Region Selector */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">안녕하세요! 🌱</h2>
            <p className="text-gray-600">오늘 배출하실 쓰레기의 분리수거 방법을 찾아보세요.</p>
          </div>

          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-bold text-emerald-900">현재 설정된 지역</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-white px-2 py-1 rounded-md shadow-sm">수원시 특화</span>
            </div>
            
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const region = regions.find(r => r.id === e.target.value);
                if (region) onRegionChange(region);
              }}
              className="w-full px-4 py-3 bg-white border-2 border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium text-gray-700 transition-all cursor-pointer appearance-none"
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
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Search Bar */}
        <section className="mb-12">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute inset-0 bg-green-200 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />
              <input
                type="text"
                placeholder="어떤 품목을 버리시나요? (예: 페트병, 햇반 용기)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/5 transition-all text-lg"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                검색
              </button>
            </div>
          </form>

          {/* Popular Items */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4 ml-1">
              <div className="w-1 h-4 bg-green-500 rounded-full"></div>
              <h3 className="font-bold text-gray-800">인기 검색어</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockPopularItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleQuickSearch(item)}
                  className="px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6 ml-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-green-500 rounded-full"></div>
              <h3 className="font-bold text-gray-800 text-xl">카테고리별 안내</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {mockCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category)}
                className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-50 hover:border-green-200 text-left relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${category.color.split(' ')[0]}`}></div>
                
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${category.color} mb-4 shadow-inner transform group-hover:rotate-6 transition-transform`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h4 className="text-gray-900 font-bold mb-1 text-lg">{category.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{category.description}</p>
                <div className="mt-4 flex items-center text-green-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  자세히 보기 <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Info Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 text-center md:text-left">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">잘못된 정보를 발견하셨나요?</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  지역별 배출 규칙은 지자체 사정에 따라 변경될 수 있습니다.<br />
                  피드백을 남겨주시면 빠르게 검토 후 반영하겠습니다.
                </p>
              </div>
            </div>
            <button 
              onClick={onGoToMyFeedback}
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              내 피드백 확인하기
            </button>
          </div>
        </div>
        
        <footer className="mt-20 text-center pb-10">
          <p className="text-gray-400 text-sm">© 2026 RecycleMap Project. 수원시 환경국 공공데이터 활용</p>
        </footer>
      </main>
    </div>
  );
}