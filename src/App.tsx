import { useState } from "react";
import { Home } from "./components/Home";
import { CategoryRules } from "./components/CategoryRules";
import { SearchResults } from "./components/SearchResults";
import { FeedbackForm } from "./components/FeedbackForm";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { RegionSelect } from "./components/RegionSelect";
import { MyFeedback } from "./components/MyFeedback";
import { FeedbackEditForm } from "./components/FeedbackEditForm";

// 1. 화면 타입 정의
export type ViewType =
  | "login"
  | "signup"
  | "region-select"
  | "home"
  | "category"
  | "search"
  | "feedback"
  | "my-feedback"
  | "feedback-edit";

// 2. 인터페이스 정의
export interface Region {
  id: string;
  dbId: number;
  city: string;
  district: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string; 
}

function App() {
  // --- 상태 관리 ---
  const [currentView, setCurrentView] = useState<ViewType>("login");
  const [selectedRegion, setSelectedRegion] = useState<Region>({
    id: "suwon-paldal",
    dbId: 1,
    city: "수원시",
    district: "팔달구",
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 피드백 등록 대상 상태
  const [feedbackTarget, setFeedbackTarget] = useState<{id: number; name: string}>({ 
    id: 0, 
    name: "" 
  });

  // ⭐ 피드백 수정을 위한 상태: 백엔드 DTO 규격(@NotNull trashDetailId)에 맞춰 필드 추가
  const [editingFeedback, setEditingFeedback] = useState<{
    id: number; 
    content: string; 
    trashDetailId: number; 
  } | null>(null);

  // --- 이벤트 핸들러 ---

  const handleLoginSuccess = () => setCurrentView("region-select");

  const handleRegionComplete = (region: Region) => {
    setSelectedRegion(region);
    setCurrentView("home");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const handleOpenFeedback = (id: number, name: string) => {
    setFeedbackTarget({ id, name });
    setCurrentView("feedback");
  };

  const handleGoToMyFeedback = () => {
    setCurrentView("my-feedback");
  };

  // ⭐ 수정 화면 진입 핸들러: MyFeedback에서 넘어오는 3개의 인자를 처리합니다.
  const handleOpenEdit = (id: number, content: string, trashDetailId: number) => {
    setEditingFeedback({ 
      id, 
      content, 
      trashDetailId 
    });
    setCurrentView("feedback-edit");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. 로그인 */}
      {currentView === "login" && (
        <Login onLoginSuccess={handleLoginSuccess} onGoToSignup={() => setCurrentView("signup")} />
      )}

      {/* 2. 회원가입 */}
      {currentView === "signup" && (
        <Signup onGoToLogin={() => setCurrentView("login")} />
      )}

      {/* 3. 지역 선택 */}
      {currentView === "region-select" && (
        <RegionSelect onRegionSelect={handleRegionComplete} userName="사용자" />
      )}

      {/* 4. 홈 */}
      {currentView === "home" && (
        <Home
          selectedRegion={selectedRegion}
          onRegionChange={() => setCurrentView("region-select")}
          onSearch={(q) => { setSearchQuery(q); setCurrentView("search"); }}
          onCategorySelect={(c) => { setSelectedCategory(c); setCurrentView("category"); }}
          onGoToMyFeedback={handleGoToMyFeedback}
        />
      )}

      {/* 5. 카테고리 상세 */}
      {currentView === "category" && selectedCategory && (
        <CategoryRules
          region={selectedRegion}
          category={selectedCategory}
          onBack={handleBackToHome}
          onFeedback={(id, name) => handleOpenFeedback(id, name)}
        />
      )}

      {/* 6. 검색 결과 */}
      {currentView === "search" && (
        <SearchResults
          region={selectedRegion}
          query={searchQuery}
          onBack={handleBackToHome}
          onFeedback={(id, name) => handleOpenFeedback(id, name)}
        />
      )}

      {/* 7. 피드백 작성 (신규 등록) */}
      {currentView === "feedback" && (
        <FeedbackForm
          trashDetailId={feedbackTarget.id}
          itemName={feedbackTarget.name}
          region={selectedRegion}
          onBack={handleBackToHome}
        />
      )}

      {/* 8. 내 피드백 목록: 수정 버튼 클릭 시 handleOpenEdit 호출 */}
      {currentView === "my-feedback" && (
        <MyFeedback 
          onBack={handleBackToHome} 
          onEdit={handleOpenEdit} 
        />
      )}

      {/* 9. 피드백 수정 폼: 필수값인 trashDetailId를 함께 전달 */}
      {currentView === "feedback-edit" && editingFeedback && (
        <FeedbackEditForm
          feedbackId={editingFeedback.id}
          initialContent={editingFeedback.content}
          trashDetailId={editingFeedback.trashDetailId} 
          onBack={() => setCurrentView("my-feedback")}
          onSuccess={() => {
            setCurrentView("my-feedback"); 
          }}
        />
      )}
    </div>
  );
}

export default App;