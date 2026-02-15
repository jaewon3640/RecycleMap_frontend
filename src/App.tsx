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
import { QAList } from "./components/QAList";
import { QADetail } from "./components/QADetail";
import { QAWrite } from "./components/QAWrite";
// ✅ AdminDashboard를 import 합니다.
import { AdminDashboard } from "./components/AdminDashBoard";

export type ViewType =
  | "login"
  | "signup"
  | "region-select"
  | "home"
  | "category"
  | "search"
  | "feedback"
  | "my-feedback"
  | "feedback-edit"
  | "qa-list"
  | "qa-detail"
  | "qa-write"
  | "admin-dashboard"; // ✅ 타입이 이미 잘 정의되어 있습니다.

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
  const [currentView, setCurrentView] = useState<ViewType>("login");
  const [selectedRegion, setSelectedRegion] = useState<Region>({
    id: "suwon-paldal",
    dbId: 1,
    city: "수원시",
    district: "팔달구",
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const [feedbackTarget, setFeedbackTarget] = useState<{id: number; name: string}>({ id: 0, name: "" });
  const [editingFeedback, setEditingFeedback] = useState<{id: number; content: string; trashDetailId: number;} | null>(null);

  // 사용자 정보 상태 관리
  const [userEmail, setUserEmail] = useState<string>(
    localStorage.getItem('userEmail') || ""
  );
const handleLoginSuccess = (nickname: string, role: string) => {
  // 1. 이메일 상태 동기화
  const savedEmail = localStorage.getItem('userEmail') || "";
  setUserEmail(savedEmail);

  // 2. 권한에 따른 뷰 전환
  // 백엔드에서 ROLE_ADMIN 또는 ADMIN 중 어떤 값으로 오는지 콘솔로 확인해보세요.
  console.log("받아온 권한:", role); 

  if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
    // ✅ 관리자라면 지역 선택(region-select)을 무시하고 대시보드로 이동
    setCurrentView("admin-dashboard"); 
  } else {
    // 일반 유저만 지역 선택으로 이동
    setCurrentView("region-select");
  }
};

  const handleRegionComplete = (region: Region) => { setSelectedRegion(region); setCurrentView("home"); };
  const handleBackToHome = () => { setCurrentView("home"); setSearchQuery(""); setSelectedCategory(null); };
  const handleOpenFeedback = (id: number, name: string) => { setFeedbackTarget({ id, name }); setCurrentView("feedback"); };
  const handleGoToMyFeedback = () => setCurrentView("my-feedback");
  const handleOpenEdit = (id: number, content: string, trashDetailId: number) => {
    setEditingFeedback({ id, content, trashDetailId });
    setCurrentView("feedback-edit");
  };

  // Q&A 핸들러
  const handleGoToQA = () => setCurrentView("qa-list");
  const handleSelectPost = (postId: number) => { setSelectedPostId(postId); setCurrentView("qa-detail"); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. 인증 섹션 */}
      {currentView === "login" && (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onGoToSignup={() => setCurrentView("signup")} 
        />
      )}
      
      {currentView === "signup" && (
        <Signup onGoToLogin={() => setCurrentView("login")} />
      )}

      {/* 2. 관리자 섹션 (추가됨) */}
      {currentView === "admin-dashboard" && (
        <AdminDashboard onBack={handleBackToHome} />
      )}
      
      {/* 3. 사용자 메인 섹션 */}
      {currentView === "region-select" && (
        <RegionSelect onRegionSelect={handleRegionComplete} userName="사용자" />
      )}
      
     {/* 3. 사용자 메인 섹션 */}
{currentView === "home" && (
  <Home
    selectedRegion={selectedRegion}
    onRegionChange={() => setCurrentView("region-select")}
    onSearch={(q) => { setSearchQuery(q); setCurrentView("search"); }}
    onCategorySelect={(c) => { setSelectedCategory(c); setCurrentView("category"); }}
    onGoToMyFeedback={handleGoToMyFeedback}
    onGoToQA={handleGoToQA}
    // ✅ 이 줄이 빠져 있었습니다! 추가해 주세요.
    onGoToAdmin={() => setCurrentView("admin-dashboard")} 
  />
)}

      {/* 4. 분리배출 정보 섹션 */}
      {currentView === "category" && selectedCategory && (
        <CategoryRules region={selectedRegion} category={selectedCategory} onBack={handleBackToHome} onFeedback={handleOpenFeedback} />
      )}

      {currentView === "search" && (
        <SearchResults region={selectedRegion} query={searchQuery} onBack={handleBackToHome} onFeedback={handleOpenFeedback} />
      )}

      {/* 5. 피드백 섹션 */}
      {currentView === "feedback" && (
        <FeedbackForm trashDetailId={feedbackTarget.id} itemName={feedbackTarget.name} region={selectedRegion} onBack={handleBackToHome} />
      )}

      {currentView === "my-feedback" && <MyFeedback onBack={handleBackToHome} onEdit={handleOpenEdit} />}

      {currentView === "feedback-edit" && editingFeedback && (
        <FeedbackEditForm
          feedbackId={editingFeedback.id}
          initialContent={editingFeedback.content}
          trashDetailId={editingFeedback.trashDetailId} 
          onBack={() => setCurrentView("my-feedback")}
          onSuccess={() => setCurrentView("my-feedback")}
        />
      )}

      {/* 6. Q&A 섹션 */}
      {currentView === "qa-list" && (
        <QAList 
          onBack={handleBackToHome}
          onSelectPost={handleSelectPost}
          onGoToWrite={() => setCurrentView("qa-write")} 
        />
      )}

      {currentView === "qa-detail" && selectedPostId && (
        <QADetail 
          postId={selectedPostId} 
          userEmail={userEmail} 
          onBack={handleGoToQA} 
        />
      )}

      {currentView === "qa-write" && (
        <QAWrite 
          onBack={handleGoToQA} 
          onSuccess={handleGoToQA} 
          userEmail={userEmail} 
        />
      )}
    </div>
  );
}

export default App;