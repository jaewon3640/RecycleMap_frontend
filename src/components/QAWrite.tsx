import { useState } from 'react';
import { ArrowLeft, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api';

interface QAWriteProps {
  onBack: () => void;
  onSuccess: () => void;
  userEmail: string; // ✅ userId (number) 대신 userEmail (string)을 받습니다.
}

export function QAWrite({ onBack, onSuccess, userEmail }: QAWriteProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 프론트엔드 유효성 검사
    if (title.length < 1 || title.length > 100) {
      setError("제목은 1자 이상 100자 이하로 입력해주세요.");
      return;
    }
    if (content.length < 10 || content.length > 1000) {
      setError("내용은 최소 10자 이상 1000자 이하로 작성해주세요.");
      return;
    }

    // 로그인 정보 확인
    if (!userEmail) {
      setError("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // ✅ [중요] userId 대신 email을 Request Body에 담아 보냅니다.
      // 백엔드 DTO 필드명이 'email' 혹은 'authorEmail'인지 확인 후 맞춰주세요.
      await api.post('/api/board/write', {
        title: title,
        content: content
      });

      alert("질문이 성공적으로 등록되었습니다! 🌱");
      onSuccess(); 
    } catch (err: any) {
      console.error("등록 실패:", err);
      setError(err.response?.data?.message || "등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">질문하기</h2>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !title || content.length < 10}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-md active:scale-95"
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-green-50 rounded-2xl border border-green-100">
          <div className="flex items-center gap-2 mb-2 text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">작성 팁</span>
          </div>
          <p className="text-sm text-green-600 font-medium leading-relaxed">
            수원시의 분리배출에 대해 궁금한 점을 자유롭게 물어보세요.<br/>
            구체적인 품목과 상태를 적어주시면 더 정확한 답변을 받으실 수 있습니다.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold animate-pulse">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 ml-1">제목</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="질문의 핵심 내용을 요약해주세요"
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-bold text-lg text-gray-900 placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 ml-1">내용</label>
            <textarea 
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="궁금하신 내용을 자세히 작성해주세요 (최소 10자 이상)"
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium text-gray-800 placeholder:text-gray-300 resize-none leading-relaxed"
            />
            <div className="flex justify-end mt-2">
              <span className={`text-xs font-bold ${content.length < 10 ? 'text-gray-300' : 'text-green-500'}`}>
                {content.length} / 1000자
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}