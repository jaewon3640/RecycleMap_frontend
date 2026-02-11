import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Calendar, Flag } from 'lucide-react';
import axios from 'axios';

// Props 타입 정의 (any 대신 인터페이스 권장)
interface ItemCardProps {
  item: {
    id: number;
    itemName: string;
    category: string;
    method?: string;
    disposal_method?: string;
    caution?: string;
  };
  regionId: number;
  onFeedback: (id: number) => void;
}

export function ItemCard({ item, regionId, onFeedback }: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const splitData = (text: string | undefined) => {
    if (!text) return [];
    return text.split('|').map(s => s.trim()).filter(s => s !== "");
  };

  useEffect(() => {
    // 카드가 열릴 때만 API 호출
    if (!isExpanded || !regionId || !item.category) return;

    setLoading(true);
    axios.get('http://localhost:8080/api/schedules/disposalOne', {
      params: {
        regionId: Number(regionId),
        category: item.category.trim().toUpperCase()
      }
    })
    .then(response => {
      setSchedule(response.data);
    })
    .catch(err => {
      console.error("스케줄 로딩 실패:", err.response?.data || err.message);
    })
    .finally(() => setLoading(false));

  }, [isExpanded, regionId, item.category]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all hover:shadow-md">
      {/* 1. 헤더 영역 (클릭 시 확장) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50/50"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold">
            {item.category}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{item.itemName}</h3>
        </div>
        {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* 2. 배출 일정 섹션 */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-emerald-900 font-bold text-sm mb-1">배출 일정</p>
              {loading ? (
                <p className="text-emerald-700 text-sm animate-pulse">일정을 불러오는 중...</p>
              ) : schedule ? (
                <p className="text-emerald-800 text-sm leading-relaxed">
                  <span className="font-semibold">{schedule.regionName}</span> 지역은 <br/>
                  <span className="font-bold text-emerald-600">[{schedule.dayOfWeek}]</span>에 배출합니다.
                </p>
              ) : (
                <p className="text-emerald-700 text-sm italic">등록된 배출 일정 정보가 없습니다.</p>
              )}
            </div>
          </div>

          {/* 3. 배출 방법 */}
          <div className="mb-6">
            <h4 className="text-gray-900 font-bold mb-4 text-sm">배출 방법</h4>
            <div className="space-y-3">
              {/* API 응답 필드명이 method 혹은 disposal_method인 경우 모두 대응 */}
              {splitData(item.disposal_method || item.method).map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-1">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 주의사항 */}
          {item.caution && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <span className="font-bold text-amber-900 text-sm">주의사항</span>
              </div>
              <ul className="space-y-1 ml-6">
                {splitData(item.caution).map((warn, idx) => (
                  <li key={idx} className="text-xs text-amber-800 list-disc leading-relaxed">{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. 신고 버튼 */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // ⭐ 부모로부터 받은 item.id를 안전하게 전달
                if (item.id) {
                  onFeedback(item.id);
                } else {
                  console.warn("아이템 ID가 없습니다.");
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all text-xs font-medium"
            >
              <Flag className="w-4 h-4" />
              <span>잘못된 정보 신고하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}