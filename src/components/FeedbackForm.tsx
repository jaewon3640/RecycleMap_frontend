import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Region } from '../App';
import axios from 'axios';

interface FeedbackFormProps {
  trashDetailId: number;
  itemName: string;
  region: Region;
  onBack: () => void;
}

// 프론트엔드 내부 상태 관리를 위한 타입
type FeedbackTypeKey = 'classification' | 'schedule' | 'content' | 'missing' | 'other';

export function FeedbackForm({ trashDetailId, itemName, region, onBack }: FeedbackFormProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackTypeKey>('classification');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'classification' as FeedbackTypeKey, label: '분류 오류', description: '품목의 카테고리가 잘못됨' },
    { id: 'schedule' as FeedbackTypeKey, label: '배출 일정 오류', description: '요일/시간 정보가 틀림' },
    { id: 'content' as FeedbackTypeKey, label: '내용 오류', description: '배출 방법이나 주의사항이 틀림' },
    { id: 'missing' as FeedbackTypeKey, label: '정보 누락', description: '중요한 정보가 빠져있음' },
    { id: 'other' as FeedbackTypeKey, label: '기타', description: '그 외 문제' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. 상세 내용 길이 검증 (백엔드 @Size(min=10) 대응)
    if (description.trim().length < 10) {
      alert("상세 내용을 10자 이상 입력해주세요.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // ⭐ 2. 로컬 스토리지에서 토큰 가져오기 
      // 프로젝트의 로그인 로직에 따라 'token', 'accessToken', 'jwt' 등 키 이름을 확인하세요.
const token = localStorage.getItem('accessToken');      
console.log("전송 직전 토큰 확인:", token); // 여기에 로그를 찍어보세요.

      if (!token) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        setIsSubmitting(false);
        return;
      }

      // ⭐ 3. 백엔드 FeedbackType Enum 상수명과 1:1 매핑
      const typeMapping: Record<FeedbackTypeKey, string> = {
        classification: 'CLASSIFICATION_ERROR',
        schedule: 'SCHEDULE_ERROR',
        content: 'CONTENT_ERROR',
        missing: 'MISSING_INFO',
        other: 'ETC'
      };

      const feedbackRequest = {
        // 백엔드 DTO 필드명 일치 확인: feedBackType, content, trashDetailId
        feedBackType: typeMapping[feedbackType], 
        content: `[품목: ${itemName} / 지역: ${region.city} ${region.district}] ${description}`,
        trashDetailId: trashDetailId 
      };

      // ⭐ 4. Axios 호출 시 헤더에 토큰 실어 보내기
      const response = await axios.post('http://localhost:8080/api/feedbacks/save', feedbackRequest, {
        headers: {
            'Authorization': `Bearer ${token}` // Bearer 한 칸 띄우는 것 확인
        },
        withCredentials: true 
    });

      if (response.status === 201 || response.status === 200) {
        setIsSubmitted(true);
        // 2초 뒤에 홈으로 이동
        setTimeout(() => onBack(), 2000);
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      console.error('전송 에러 상세:', errorData);
      alert(`전송 실패: ${errorData?.message || "서버와 통신 중 오류가 발생했습니다."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 성공 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">피드백이 전송되었습니다</h2>
          <p className="text-gray-600">소중한 의견 감사합니다. 검토 후 반영하겠습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">돌아가기</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">피드백 보내기</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">대상 품목</p>
                <p className="text-gray-900 font-bold">{itemName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">현재 지역</p>
                <p className="text-gray-900 font-bold">{region.city} {region.district}</p>
              </div>
            </div>
          </div>

          {/* Feedback Type Selection */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-gray-900 font-bold mb-4">문제 유형 <span className="text-red-500">*</span></label>
            <div className="space-y-3">
              {feedbackTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-green-200 ${
                    feedbackType === type.id ? 'border-green-500 bg-green-50' : 'border-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="feedbackType"
                    value={type.id}
                    checked={feedbackType === type.id}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackTypeKey)}
                    className="mt-1 accent-green-600"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label htmlFor="description" className="block text-gray-900 font-bold mb-2">상세 설명 <span className="text-red-500">*</span></label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              placeholder="정보가 어떻게 다른지 10자 이상 자세히 설명해주세요. (예: 분리배출 요일이 화요일이 아니라 수요일입니다.)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
            />
            <p className="mt-2 text-xs text-gray-400 text-right">
              {description.length} / 1000 자 (최소 10자)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={description.trim().length < 10 || isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>{isSubmitting ? "전송 중..." : "피드백 전송하기"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}