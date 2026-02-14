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
import { QAWrite } from "./components/QAWrite"; // 신규 추가

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
  | "qa-write"; // 추가

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

  // 핸들러 모음
  const handleLoginSuccess = () => setCurrentView("region-select");
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
      {currentView === "login" && <Login onLoginSuccess={handleLoginSuccess} onGoToSignup={() => setCurrentView("signup")} />}
      {currentView === "signup" && <Signup onGoToLogin={() => setCurrentView("login")} />}
      {currentView === "region-select" && <RegionSelect onRegionSelect={handleRegionComplete} userName="사용자" />}
      
      {currentView === "home" && (
        <Home
          selectedRegion={selectedRegion}
          onRegionChange={() => setCurrentView("region-select")}
          onSearch={(q) => { setSearchQuery(q); setCurrentView("search"); }}
          onCategorySelect={(c) => { setSelectedCategory(c); setCurrentView("category"); }}
          onGoToMyFeedback={handleGoToMyFeedback}
          onGoToQA={handleGoToQA}
        />
      )}

      {currentView === "category" && selectedCategory && (
        <CategoryRules region={selectedRegion} category={selectedCategory} onBack={handleBackToHome} onFeedback={handleOpenFeedback} />
      )}

      {currentView === "search" && (
        <SearchResults region={selectedRegion} query={searchQuery} onBack={handleBackToHome} onFeedback={handleOpenFeedback} />
      )}

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

      {/* Q&A 섹션 */}
      {currentView === "qa-list" && (
        <QAList 
          onBack={handleBackToHome}
          onSelectPost={handleSelectPost}
          onGoToWrite={() => setCurrentView("qa-write")} 
        />
      )}

      {currentView === "qa-write" && (
        <QAWrite 
          userId={1} // 테스트용 ID (실제 세션 ID로 대체 가능)
          onBack={() => setCurrentView("qa-list")}
          onSuccess={() => setCurrentView("qa-list")}
        />
      )}

      {currentView === "qa-detail" && selectedPostId !== null && (
        <QADetail postId={selectedPostId} onBack={() => setCurrentView("qa-list")} />
      )}
    </div>
  );
}

export default App;