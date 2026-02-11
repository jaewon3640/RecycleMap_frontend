import { ArrowLeft, Search } from 'lucide-react';
import { Region } from '../App';
import { searchItems } from '../data/mockData';
import { ItemCard } from './ItemCard';

interface SearchResultsProps {
  region: Region;
  query: string;
  onBack: () => void;
  // ⭐ 수정: App.tsx와 동일하게 (id, name) 인자를 받도록 변경
  onFeedback: (trashDetailId: number, itemName: string) => void;
}

export function SearchResults({ region, query, onBack, onFeedback }: SearchResultsProps) {
  const results = searchItems(query);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-xl">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">검색 결과</h1>
              <p className="text-gray-500 text-sm">"{query}"에 대한 결과 {results.length}건</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Region Info */}
        <div className="bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-gray-600">
            현재 지역: <span className="text-gray-900 font-medium">{region.city} {region.district}</span>
          </p>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((item) => (
              <ItemCard
                key={item.id || item.name} // item.id가 있으면 id를, 없으면 name을 key로 사용
                regionId={region.dbId}      // ⭐ ItemCard에 regionId 전달 추가
                item={{
                    ...item,
                    itemName: item.itemName || item.name, // 필드명 호환성 처리
                    category: item.category || '기타'
                }}
                // ⭐ ItemCard로부터 id를 받아 onFeedback(id, name) 호출
                onFeedback={(id: number) => onFeedback(id, item.itemName || item.name)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-bold mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500 mb-6 text-sm">
              "{query}"에 대한 정보를 찾을 수 없습니다
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              홈으로 돌아가기
            </button>
          </div>
        )}

        {/* Help Box */}
        {results.length === 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-900 mb-2 font-bold">💡 검색 팁</p>
            <ul className="text-sm text-blue-800 space-y-1 opacity-90">
              <li>• 정확한 품목명으로 검색해보세요 (예: 페트병, 스티로폼)</li>
              <li>• 비슷한 단어로 검색해보세요 (예: 플라스틱컵 → 테이크아웃컵)</li>
              <li>• 카테고리 메뉴에서 직접 찾아보세요</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}