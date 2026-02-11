import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Calendar, Flag } from 'lucide-react';
import axios from 'axios';

export function ItemCard({ item, regionId, onFeedback }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const splitData = (text: string) => {
    if (!text) return [];
    return text.split('|').map(s => s.trim()).filter(s => s !== "");
  };

  useEffect(() => {
  // 1. 카드가 열릴 때마다 무조건 로그를 찍어봅니다.
  console.log("카드 확장됨!", { 
    isExpanded, 
    rawRegionId: regionId, 
    category: item.category 
  });

  // 2. 조건을 하나씩 체크하며 로그를 남깁니다.
  if (!isExpanded) return;
  if (!regionId) {
    console.error("오류: regionId가 없습니다!");
    return;
  }
  if (!item.category) {
    console.error("오류: category가 없습니다!");
    return;
  }

  setLoading(true);
  
  // 3. API 호출
  axios.get('http://localhost:8080/api/schedules/disposalOne', {
    params: {
      regionId: Number(regionId), // 숫자로 강제 변환
      category: item.category.trim().toUpperCase()
    }
  })
  .then(response => {
    console.log("서버 응답 성공:", response.data);
    setSchedule(response.data);
  })
  .catch(err => {
    console.error("서버 응답 실패:", err.response?.data || err.message);
  })
  .finally(() => setLoading(false));

}, [isExpanded, regionId, item.category]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all hover:shadow-md">
      {/* 1. 헤더 영역 */}
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

          {/* 3. 배출 방법 (item.method 또는 item.disposal_method 대응) */}
          <div className="mb-6">
            <h4 className="text-gray-900 font-bold mb-4 text-sm">배출 방법</h4>
            <div className="space-y-3">
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
      // item 객체 안에 있는 id를 인자로 넘겨줍니다!
      // 보통 백엔드에서 받아온 데이터는 item.id에 PK가 담겨있습니다.
      onFeedback(item.id); 
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