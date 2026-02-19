import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api';
import { Region, Category } from '../App';
import { ItemCard } from './ItemCard';

interface CategoryRulesProps {
  region: Region;
  category: Category;
  onBack: () => void;
  // ⭐ 핵심 수정: trashDetailId(숫자)와 itemName(문자열)을 모두 받도록 정의
  onFeedback: (trashDetailId: number, itemName: string) => void;
}

export function CategoryRules({ region, category, onBack, onFeedback }: CategoryRulesProps) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. 방어 코드: 지역 ID가 없으면 실행하지 않음
    if (!region.dbId) {
      console.error("Region DB ID가 없습니다! 지역 선택 상태를 확인하세요.");
      return;
    }

    const fetchTrashDetails = async () => {
      setIsLoading(true);
      try {
        // 2. 백엔드 API 호출 (지역 ID와 카테고리 Enum 값 전달)
        const response = await api.get('/api/trash-detail/all-trash', {
          params: {
            regionId: region.dbId,
            category: category.id.toUpperCase() // Enum 대문자 규격 준수
          }
        });
        setItems(response.data);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrashDetails();
  }, [category.id, region.dbId]); // 의존성 배열에 dbId를 넣어 지역 변경 시에도 대응

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- 상단 헤더 영역 --- */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.color}`}>
              <span className="text-3xl">{category.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-500">{region.city} {region.district}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 본문 콘텐츠 영역 --- */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* 공통 주의사항 안내 섹션 */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">
                {category.name} 배출 시 공통 주의사항
              </p>
              <ul className="text-sm text-blue-800 space-y-1 opacity-90">
                <li>• 이물질(음식물 등)을 깨끗이 비우고 헹궈서 배출하세요.</li>
                <li>• 라벨, 스티커 등 다른 재질은 반드시 제거해 주세요.</li>
                <li>• {region.district}의 정해진 배출 시간과 장소를 지켜주세요.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 품목 리스트 섹션 */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            주요 품목 
            <span className="text-sm font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
              <p className="text-gray-500">배출 정보를 불러오는 중입니다...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="grid gap-4">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  regionId={region.dbId} 
                  item={{
                    ...item, // ⭐ item.id를 포함한 전체 데이터를 ItemCard로 전달
                    name: item.itemName,
                    category: category.id.toUpperCase() 
                  }}
                  // ⭐ 핵심: ItemCard가 보내준 id와 현재 item의 itemName을 상위(App)로 전달
                  onFeedback={(id: number) => onFeedback(id, item.itemName)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500">이 지역의 {category.name} 상세 정보가 아직 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}