import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Region, Category } from '../App';
import { getItemsByCategory } from '../data/mockData';
import { ItemCard } from './ItemCard';

interface CategoryRulesProps {
  region: Region;
  category: Category;
  onBack: () => void;
  onFeedback: (itemName: string) => void;
}

export function CategoryRules({ region, category, onBack, onFeedback }: CategoryRulesProps) {
  const items = getItemsByCategory(category.id);

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
          
          <div className="flex items-center gap-4">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.color}`}>
              <span className="text-3xl">{category.icon}</span>
            </div>
            <div>
              <h1 className="text-gray-900">{category.name}</h1>
              <p className="text-gray-500">{region.city} {region.district}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* General Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 mb-2">
                {category.name} 배출 시 주의사항
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 이물질을 완전히 제거하고 배출해주세요</li>
                <li>• 다른 재질과 섞이지 않도록 분리해주세요</li>
                <li>• 배출 시간과 장소를 확인해주세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h2 className="text-gray-900 mb-4">주요 품목 ({items.length}개)</h2>
          
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <ItemCard
                  key={item.name}
                  item={item}
                  onFeedback={() => onFeedback(item.name)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-500">등록된 품목이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
