import { useState, useEffect } from 'react';
import { ArrowLeft, Send, MessageCircle, CheckCircle2, Info } from 'lucide-react';
import axios from 'axios';

// 1. Props 인터페이스 수정 (trashDetailId 추가)
interface FeedbackEditFormProps {
  feedbackId: number;
  initialContent: string;
  trashDetailId: number; 
  onBack: () => void;
  onSuccess: () => void;
}

export function FeedbackEditForm({ 
  feedbackId, 
  initialContent, 
  trashDetailId, 
  onBack, 
  onSuccess 
}: FeedbackEditFormProps) {
  
  // 텍스트에서 [품목: ...] 태그를 제외한 순수 내용만 추출하는 함수
  const extractPureContent = (fullText: string) => {
    const splitIndex = fullText.indexOf(']');
    if (splitIndex !== -1) {
      return fullText.substring(splitIndex + 1).trim();
    }
    return fullText;
  };

  const [content, setContent] = useState("");
  const [infoTag, setInfoTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 초기 로드시 내용 분리 작업
  useEffect(() => {
    const tagMatch = initialContent.match(/^\[.*?\]/);
    if (tagMatch) {
      setInfoTag(tagMatch[0]);
      setContent(extractPureContent(initialContent));
    } else {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const pureContent = content.trim();
    
    // 백엔드 @Size(min = 10) 검증 대응
    if (pureContent.length < 10) {
      alert("내용은 최소 10자 이상 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // ⭐ 백엔드 DTO(FeedbackDTO.Request) 규격에 맞춰 전송
      await axios.put(
        `http://localhost:8080/api/feedbacks/${feedbackId}`, 
        { 
          content: pureContent,
          trashDetailId: trashDetailId, // @NotNull 필수값
          feedBackType: "CONTENT_ERROR"  // 백엔드 Enum(FeedbackType)에 정의된 값 사용
        }, 
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      alert("피드백이 성공적으로 수정되었습니다.");
      onSuccess();
    } catch (error: any) {
      console.error("수정 실패 상세:", error.response?.data);
      // 백엔드에서 보낸 에러 메시지가 있으면 보여줌
      alert(error.response?.data?.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-900">피드백 수정</span>
          <div className="w-10"></div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* 상단 안내 섹션: 품목/지역 정보 표시 */}
        {infoTag && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-start">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">수정 중인 대상</p>
              <p className="text-sm text-blue-900 font-medium">{infoTag.replace(/[\[\]]/g, '')}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">내용만 수정하기</h2>
            <p className="text-sm text-gray-500">배출 규칙에 대한 의견을 자유롭게 수정해주세요.</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-green-100 rounded-3xl blur-lg opacity-0 group-focus-within:opacity-40 transition-opacity"></div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="피드백 내용을 10자 이상 입력하세요..."
              className="relative w-full min-h-[250px] p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-green-500 focus:bg-white transition-all text-gray-700 leading-relaxed shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <p>지역 및 품목 정보는 고정되며, 텍스트 내용만 수정됩니다.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || content.trim().length < 10}
            className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isSubmitting || content.trim().length < 10
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>수정 완료하기</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}