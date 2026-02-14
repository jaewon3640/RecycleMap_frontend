import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, ShieldCheck, Send, User, Calendar } from 'lucide-react';
import axios from 'axios';

interface QADetailProps {
  postId: number;
  onBack: () => void;
}

export function QADetail({ postId, onBack }: QADetailProps) {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // BoardController의 @GetMapping("/{id}") 호출
        const response = await axios.get(`/api/board/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("게시글 상세 조회 실패:", error);
        alert("게시글을 불러올 수 없습니다.");
        onBack();
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [postId]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-400 font-bold">
      게시글을 읽어오는 중...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <span className="font-bold text-gray-900">질문 상세 보기</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Question Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-xs font-black rounded-full border border-amber-100 uppercase tracking-tighter">
              Question
            </span>
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
              <Calendar className="w-3 h-3" />
              {post.createdAt || '2026-02-12'}
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
            {post.title}
          </h2>
          
          <div className="text-gray-700 leading-relaxed font-medium min-h-[150px] whitespace-pre-wrap">
            {post.content}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-800">{post.userName || '수원시민'}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified User</p>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Section Placeholder */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-800">답변</h3>
          </div>

          {/* DTO에 답변 리스트가 있다면 map으로 렌더링, 현재는 예시 디자인만 유지 */}
          <div className="bg-green-50/50 border-2 border-green-100 rounded-[2rem] p-8 relative overflow-hidden">
             <ShieldCheck className="absolute top-4 right-4 w-12 h-12 text-green-200 opacity-50" />
            
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-black rounded-full">ADMIN</span>
              <span className="text-xs text-gray-400 font-bold">RecycleMap 매니저</span>
            </div>
            
            <p className="text-gray-800 leading-relaxed font-bold">
              올바른 분리배출에 대한 답변입니다. 백엔드에서 답변 정보를 제공하면 여기에 표시됩니다. 🌱
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}