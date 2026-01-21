import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Calendar, Flag } from 'lucide-react';
import { ItemDetail } from '../App';

interface ItemCardProps {
  item: ItemDetail;
  onFeedback: () => void;
}

export function ItemCard({ item, onFeedback }: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 ${item.categoryColor} rounded-lg`}>
            <span className="text-sm text-gray-700">{item.category}</span>
          </div>
          <h3 className="text-gray-900">{item.name}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {/* Schedule */}
          {item.schedule && (
            <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-900 mb-1">배출 일정</p>
                  <p className="text-sm text-green-800">{item.schedule}</p>
                </div>
              </div>
            </div>
          )}

          {/* Disposal Steps */}
          <div className="mt-4">
            <h4 className="text-gray-900 mb-3">배출 방법</h4>
            <ol className="space-y-2">
              {item.disposal.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Preprocessing */}
          <div className="mt-6">
            <h4 className="text-gray-900 mb-3">전처리 방법</h4>
            <ul className="space-y-2">
              {item.preprocessing.map((tip, index) => (
                <li key={index} className="flex gap-3 text-gray-700">
                  <span className="text-green-500 flex-shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-900 mb-2">주의사항</h4>
                <ul className="space-y-1.5">
                  {item.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-amber-800">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Feedback Button */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFeedback();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
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
