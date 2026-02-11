import { useState } from 'react';
import { MapPin, ArrowRight, Check, Map as MapIcon } from 'lucide-react';
import { Region } from '../App';
import axios from 'axios';

interface RegionSelectProps {
  onRegionSelect: (region: Region) => void;
  userName?: string;
}

type CityType = 'suwon' | 'seoul';

export function RegionSelect({ onRegionSelect, userName }: RegionSelectProps) {
  const [activeCity, setActiveCity] = useState<CityType>('suwon');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  // 1. regionData에 dbId(백엔드 PK) 추가
  const regionData: Record<CityType, Region[]> = {
    suwon: [
      { id: 'suwon-jangan', dbId: 4, city: '수원시', district: '장안구' },
      { id: 'suwon-paldal', dbId: 1, city: '수원시', district: '팔달구' },
      { id: 'suwon-gwonseon', dbId: 2, city: '수원시', district: '권선구' },
      { id: 'suwon-yeongtong', dbId: 3, city: '수원시', district: '영통구' },
    ],
    seoul: [
      { id: 'seoul-gangnam', dbId: 5, city: '서울특별시', district: '강남구' },
      { id: 'seoul-seocho', dbId: 6, city: '서울특별시', district: '서초구' },
      { id: 'seoul-songpa', dbId: 7, city: '서울특별시', district: '송파구' },
      { id: 'seoul-mapo', dbId: 8, city: '서울특별시', district: '마포구' },
      { id: 'seoul-yongsan', dbId: 9, city: '서울특별시', district: '용산구' },
    ]
  };

  const handleConfirm = async () => {
    // 모든 지역 데이터에서 현재 선택된 id와 일치하는 객체 찾기
    const allRegions = [...regionData.suwon, ...regionData.seoul];
    const region = allRegions.find(r => r.id === selectedRegionId);
    
    if (region) {
      // ⚠️ dbId가 있는지 다시 한 번 확인 (디버깅용)
      console.log("백엔드로 보낼 지역 정보:", region);

      try {
        const token = localStorage.getItem('accessToken');
        
        // 백엔드 저장 로직
        await axios.post('http://localhost:8080/api/user/region', {
          city: region.city,
          district: region.district
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // 2. 부모(App.tsx)에게 dbId가 포함된 전체 객체 전달
        onRegionSelect(region);
        
      } catch (err: any) {
        console.error("지역 저장 실패:", err);
        alert("지역 정보를 저장하는 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCityChange = (city: CityType) => {
    setActiveCity(city);
    setSelectedRegionId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm mb-4">
            <MapIcon className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">지역을 선택해주세요</h2>
          {userName && <p className="text-gray-500 mt-2">{userName}님, 반갑습니다!</p>}
        </div>

        {/* 도시 선택 탭 */}
        <div className="flex justify-center gap-4 mb-10">
          {(['suwon', 'seoul'] as CityType[]).map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeCity === city 
                ? 'bg-green-600 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-500 hover:bg-green-50'
              }`}
            >
              {city === 'suwon' ? '수원시' : '서울특별시'}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* 지도 영역 */}
          <div className="lg:col-span-3 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white min-h-[450px] flex items-center">
            {activeCity === 'suwon' ? (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-md">
                <path d="M180,40 L340,50 L380,120 L320,180 L220,180 L160,130 Z" 
                  fill={selectedRegionId === 'suwon-jangan' ? '#047857' : '#10B981'}
                  className="cursor-pointer stroke-white stroke-[2] transition-colors" onClick={() => setSelectedRegionId('suwon-jangan')} />
                <path d="M220,180 L320,180 L360,240 L300,280 L240,260 Z" 
                  fill={selectedRegionId === 'suwon-paldal' ? '#059669' : '#34D399'}
                  className="cursor-pointer stroke-white stroke-[2] transition-colors" onClick={() => setSelectedRegionId('suwon-paldal')} />
                <path d="M160,130 L220,180 L240,260 L300,280 L260,370 L100,360 L60,250 L80,160 Z" 
                  fill={selectedRegionId === 'suwon-gwonseon' ? '#065F46' : '#6EE7B7'}
                  className="cursor-pointer stroke-white stroke-[2] transition-colors" onClick={() => setSelectedRegionId('suwon-gwonseon')} />
                <path d="M320,180 L380,120 L450,180 L430,320 L350,340 L300,280 L360,240 Z" 
                  fill={selectedRegionId === 'suwon-yeongtong' ? '#10B981' : '#A7F3D0'}
                  className="cursor-pointer stroke-white stroke-[2] transition-colors" onClick={() => setSelectedRegionId('suwon-yeongtong')} />
                <g fill="white" fontWeight="700" fontSize="14" className="pointer-events-none text-center">
                  <text x="260" y="110" textAnchor="middle">장안구</text>
                  <text x="300" y="230" textAnchor="middle">팔달구</text>
                  <text x="160" y="260" textAnchor="middle">권선구</text>
                  <text x="385" y="245" textAnchor="middle">영통구</text>
                </g>
              </svg>
            ) : (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-md">
                <circle cx="200" cy="150" r="60" fill={selectedRegionId === 'seoul-mapo' ? '#047857' : '#10B981'} 
                  className="cursor-pointer transition-colors" onClick={() => setSelectedRegionId('seoul-mapo')} />
                <text x="200" y="155" textAnchor="middle" fill="white" fontWeight="700">마포/용산</text>
                <rect x="250" y="220" width="120" height="80" rx="20" fill={selectedRegionId === 'seoul-gangnam' ? '#059669' : '#34D399'} 
                  className="cursor-pointer transition-colors" onClick={() => setSelectedRegionId('seoul-gangnam')} />
                <text x="310" y="265" textAnchor="middle" fill="white" fontWeight="700">강남/서초</text>
              </svg>
            )}
          </div>

          {/* 리스트 영역 */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-sm font-bold text-gray-400 mb-2 px-2 uppercase tracking-wider">Select District</p>
            {regionData[activeCity].map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegionId(region.id)}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  selectedRegionId === region.id
                    ? 'bg-green-600 border-green-700 text-white shadow-md'
                    : 'bg-white border-gray-100 hover:border-green-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <MapPin size={20} className={selectedRegionId === region.id ? 'text-white' : 'text-green-600'} />
                  <span className="font-bold">{region.district}</span>
                </div>
                {selectedRegionId === region.id && <Check size={18} />}
              </button>
            ))}

            <button
              onClick={handleConfirm}
              disabled={!selectedRegionId}
              className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 mt-6 ${
                selectedRegionId ? 'bg-gray-900 text-white shadow-xl hover:bg-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              선택 완료 <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}