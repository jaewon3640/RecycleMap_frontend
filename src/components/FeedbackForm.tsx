import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Region } from '../App';

interface FeedbackFormProps {
  itemName: string;
  region: Region;
  onBack: () => void;
}

type FeedbackType = 'classification' | 'schedule' | 'content' | 'missing' | 'other';

export function FeedbackForm({ itemName, region, onBack }: FeedbackFormProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('classification');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = [
    { id: 'classification' as FeedbackType, label: '분류 오류', description: '품목의 카테고리가 잘못됨' },
    { id: 'schedule' as FeedbackType, label: '배출 일정 오류', description: '요일/시간 정보가 틀림' },
    { id: 'content' as FeedbackType, label: '내용 오류', description: '배출 방법이나 주의사항이 틀림' },
    { id: 'missing' as FeedbackType, label: '정보 누락', description: '중요한 정보가 빠져있음' },
    { id: 'other' as FeedbackType, label: '기타', description: '그 외 문제' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock submission
    console.log('Feedback submitted:', {
      itemName,
      region,
      feedbackType,
      description,
      timestamp: new Date().toISOString()
    });

    setIsSubmitted(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-gray-900 mb-2">피드백이 전송되었습니다</h2>
          <p className="text-gray-600">
            소중한 의견 감사합니다.<br />
            검토 후 반영하겠습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
          
          <h1 className="text-gray-900">피드백 보내기</h1>
          <p className="text-gray-500">잘못된 정보를 알려주세요</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">품목</p>
                <p className="text-gray-900">{itemName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">지역</p>
                <p className="text-gray-900">{region.city} {region.district}</p>
              </div>
            </div>
          </div>

          {/* Feedback Type */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <label className="block text-gray-900 mb-4">
              문제 유형 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {feedbackTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    feedbackType === type.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="feedbackType"
                    value={type.id}
                    checked={feedbackType === type.id}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <label htmlFor="description" className="block text-gray-900 mb-2">
              상세 설명 <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-4">
              어떤 점이 잘못되었는지 자세히 알려주세요
            </p>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              placeholder="예: 수원시 영통구는 플라스틱을 월요일에 배출하는데, 화요일로 잘못 표시되어 있습니다."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              💡 제출하신 피드백은 관리자가 검토한 후 반영됩니다. 정확한 정보 제공을 위해 공식 출처를 확인해주시면 더욱 도움이 됩니다.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!description.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
            <span>피드백 전송</span>
          </button>
        </form>
      </div>
    </div>
  );
}
