import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Calendar, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

const PAGE_SIZE = 10;

interface FeedbackResponse {
  id: number;
  content: string;
  feedbackTypeDescription: string;
  createdAt: string;
  trashDetailId: number;
}

interface MyFeedbackProps {
  onBack: () => void;
  onEdit: (id: number, content: string, trashDetailId: number) => void;
}

export function MyFeedback({ onBack, onEdit }: MyFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchMyFeedbacks(0);
  }, []);

  const fetchMyFeedbacks = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/feedbacks/my', {
        params: { page, size: PAGE_SIZE }
      });

      // Spring Page 응답: { content: [...], totalPages, totalElements, number }
      const pageData = response.data;
      setFeedbacks(pageData.content ?? []);
      setTotalPages(pageData.totalPages ?? 0);
      setTotalElements(pageData.totalElements ?? 0);
      setCurrentPage(pageData.number ?? 0);
    } catch (error) {
      console.error("피드백 로딩 실패:", error);
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMyFeedbacks(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 이 피드백을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/feedbacks/${id}`);
      fetchMyFeedbacks(currentPage);
    } catch (error) {
      alert("삭제에 실패했습니다.");
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const start = Math.max(0, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
          <>
            {totalElements > 0 && (
              <p className="text-sm text-gray-400 mb-4">
                총 <span className="font-semibold text-gray-600">{totalElements}</span>개의 피드백
              </p>
            )}
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-green-200 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                      {feedback.feedbackTypeDescription}
                    </div>
                    <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
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

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      page === currentPage
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}