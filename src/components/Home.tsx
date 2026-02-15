import { useState, useEffect } from 'react'; // ✅ useEffect 추가
import { 
  Search, 
  MapPin, 
  MessageSquare, 
  ChevronRight, 
  HelpCircle, 
  ShieldCheck, // ✅ 관리자 아이콘 추가
  Sparkles
} from 'lucide-react';
import { Region, Category } from '../App';
import { mockCategories, mockPopularItems } from '../data/mockData';
import { Logo } from './Logo';

interface HomeProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
  onSearch: (query: string) => void;
  onCategorySelect: (category: Category) => void;
  onGoToMyFeedback: () => void;
  onGoToQA: () => void;
  onGoToAdmin: () => void; // ✅ 관리자 페이지 이동 함수 추가
}

export function Home({ 
  selectedRegion, 
  onRegionChange, 
  onSearch, 
  onCategorySelect,
  onGoToMyFeedback,
  onGoToQA,
  onGoToAdmin // ✅ Props로 받음
}: HomeProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // ✅ 관리자 상태 관리

  // ✅ 로컬 스토리지에서 권한 정보를 읽어와 관리자 여부 판단
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
      setIsAdmin(true);
    }
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-10">
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
          
          <div className="flex items-center gap-2">
            {/* ✅ 관리자(ADMIN) 권한이 있을 때만 버튼 노출 */}
            {isAdmin && (
              <button 
                onClick={onGoToAdmin}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-900 transition-all shadow-md font-bold text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                관리자 모드
              </button>
            )}

            <button 
              onClick={onGoToMyFeedback}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-sm border border-green-100 font-bold text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              내 활동
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 지역 선택 & 인사말 */}
        <section className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">안녕하세요! 🌱</h2>
            <p className="text-gray-600">오늘 배출하실 쓰레기의 분리수거 방법을 찾아보세요.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-bold text-gray-700 text-sm">현재 설정된 지역</span>
            </div>
            
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const region = regions.find(r => r.id === e.target.value);
                if (region) onRegionChange(region);
              }}
              className="px-4 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700 cursor-pointer min-w-[200px]"
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.city} {region.district}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* 검색창 섹션 */}
        <section className="mb-12">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute inset-0 bg-green-200 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />
              <input
                type="text"
                placeholder="어떤 품목을 버리시나요? (예: 페트병, 배달 용기)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-14 pr-32 py-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:border-green-500 transition-all text-lg font-medium"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                검색
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {mockPopularItems.map((item) => (
              <button
                key={item}
                onClick={() => handleQuickSearch(item)}
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-green-500 hover:text-green-600 transition-all"
              >
                # {item}
              </button>
            ))}
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6 ml-1">
            <div className="w-1.5 h-5 bg-green-500 rounded-full"></div>
            <h3 className="font-bold text-gray-800 text-xl">카테고리별 안내</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category)}
                className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-50 hover:border-green-200 text-left"
              >
                <div className={`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center text-3xl mb-4 shadow-inner transform group-hover:rotate-6 transition-transform`}>
                  {category.icon}
                </div>
                <h4 className="text-gray-900 font-bold mb-1">{category.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{category.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 하단 버튼 섹션 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <button 
            onClick={onGoToQA}
            className="flex items-center justify-between p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-green-400 transition-all text-left group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Q&A 게시판</h4>
                <p className="text-xs text-gray-600">분리수거 질문을 남겨보세요</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-green-500 group-hover:text-green-600 transform group-hover:translate-x-1 transition-all relative" />
          </button>

          <button 
            onClick={onGoToMyFeedback}
            className="flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-green-300 transition-all text-left group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <MessageSquare className="w-6 h-6 text-gray-500 group-hover:text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">내 활동 확인</h4>
                <p className="text-xs text-gray-600">남긴 피드백을 확인하세요</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-green-500 transform group-hover:translate-x-1 transition-all" />
          </button>
        </section>

        <footer className="mt-16 text-center">
          <p className="text-gray-400 text-xs">© 2026 RecycleMap Project. 수원시 공공데이터 활용</p>
        </footer>
      </main>
    </div>
  );
}