import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Calendar, Trash2, Edit2 } from 'lucide-react';
import api from '../api';

// 1. 백엔드 응답 데이터 구조 수정
interface FeedbackResponse {
  id: number;
  content: string;
  categoryName: string; 
  createdAt: string;
  trashDetailId: number; // ⭐ 필수: 백엔드에서 이 값을 내려줘야 수정 시 다시 보낼 수 있습니다.
}

// 2. Props 타입 정의 수정
interface MyFeedbackProps {
  onBack: () => void;
  // ⭐ 인자 개수를 App.tsx와 맞춰 3개로 수정
  onEdit: (id: number, content: string, trashDetailId: number) => void;
}

export function MyFeedback({ onBack, onEdit }: MyFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyFeedbacks();
  }, []);

  const fetchMyFeedbacks = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/api/feedbacks/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // ⭐ 이 로그를 반드시 확인하세요! 
      // 배열 안의 객체에 trashDetailId 라는 이름의 필드가 있는지 보셔야 합니다.
      console.log("서버 응답 전체 데이터:", response.data); 
      
      setFeedbacks(response.data);
    } catch (error) {
      console.error("피드백 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 이 피드백을 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem('accessToken');
      await api.delete(`/api/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch (error) {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">내가 작성한 피드백</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">아직 작성한 피드백이 없어요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div 
                key={feedback.id} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-green-200 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                    {feedback.categoryName}
                  </div>
                  <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button 
                      // ⭐ 중요: onEdit 호출 시 trashDetailId를 반드시 전달!
                      onClick={() => onEdit(feedback.id, feedback.content, feedback.trashDetailId)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(feedback.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                  {feedback.content}
                </p>

                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
                  <div className="flex items-center text-xs text-gray-400 gap-2 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(feedback.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}