import { useState } from 'react';
import { Home } from './components/Home';
import { CategoryRules } from './components/CategoryRules';
import { SearchResults } from './components/SearchResults';
import { FeedbackForm } from './components/FeedbackForm';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { RegionSelect } from './components/RegionSelect'; // 만든 컴포넌트 임포트

// 1. region-select 타입을 추가하여 화면 흐름 제어
export type ViewType = 'login' | 'signup' | 'region-select' | 'home' | 'category' | 'search' | 'feedback';

export interface Region {
  id: string;
  city: string;
  district: string;
}

// ... Category, ItemDetail 인터페이스 생략 (기존과 동일)

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  
  // 초기 지역 상태 (처음엔 빈 값을 원하시면 타입을 Region | null로 바꾸셔도 됩니다)
  const [selectedRegion, setSelectedRegion] = useState<Region>({
    id: 'suwon-yeongtong',
    city: '수원시',
    district: '영통구'
  });
  
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackItem, setFeedbackItem] = useState<string | null>(null);

  // 로그인 성공 시 -> 지도 선택 화면으로 이동
  const handleLoginSuccess = () => {
    setCurrentView('region-select');
  };

  // 지도에서 지역 선택 완료 시 -> 홈 화면으로 이동
  const handleRegionComplete = (region: Region) => {
    setSelectedRegion(region);
    setCurrentView('home');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1단계: 로그인 */}
      {currentView === 'login' && (
        <Login
          onLogin={handleLoginSuccess}
          onGoToSignup={() => setCurrentView('signup')}
        />
      )}

      {/* 2단계: 회원가입 */}
      {currentView === 'signup' && (
        <Signup
          onSignup={() => setCurrentView('login')}
          onGoToLogin={() => setCurrentView('login')}
        />
      )}

      {/* 3단계: 지역(지도) 선택 - 로그인 성공 시 이곳으로 옴 */}
      {currentView === 'region-select' && (
        <RegionSelect 
          onRegionSelect={handleRegionComplete} 
          userName="사용자" 
        />
      )}

      {/* 4단계: 메인 홈 */}
      {currentView === 'home' && (
        <Home
          selectedRegion={selectedRegion}
          onRegionChange={() => setCurrentView('region-select')} // 홈에서 지역 클릭 시 다시 지도 띄움
          onSearch={(q) => { setSearchQuery(q); setCurrentView('search'); }}
          onCategorySelect={(c) => { setSelectedCategory(c); setCurrentView('category'); }}
        />
      )}

      {/* 기타 결과 및 피드백 화면 */}
      {currentView === 'category' && selectedCategory && (
        <CategoryRules
          region={selectedRegion}
          category={selectedCategory}
          onBack={handleBackToHome}
          onFeedback={(item) => { setFeedbackItem(item); setCurrentView('feedback'); }}
        />
      )}

      {currentView === 'search' && (
        <SearchResults
          region={selectedRegion}
          query={searchQuery}
          onBack={handleBackToHome}
          onFeedback={(item) => { setFeedbackItem(item); setCurrentView('feedback'); }}
        />
      )}

      {currentView === 'feedback' && (
        <FeedbackForm
          itemName={feedbackItem || ''}
          region={selectedRegion}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;