import { Category, ItemDetail } from '../App';

export const mockCategories: Category[] = [
  {
    id: 'plastic',
    name: '플라스틱',
    icon: '♻️',
    color: 'bg-blue-100',
    description: '페트병, 용기류'
  },
  {
    id: 'paper',
    name: '종이',
    icon: '📄',
    color: 'bg-yellow-100',
    description: '박스, 신문, 책'
  },
  {
    id: 'can',
    name: '캔/고철',
    icon: '🥫',
    color: 'bg-gray-100',
    description: '음료수캔, 철재'
  },
  {
    id: 'glass',
    name: '유리',
    icon: '🍾',
    color: 'bg-green-100',
    description: '병, 유리용기'
  },
  {
    id: 'vinyl',
    name: '비닐',
    icon: '🛍️',
    color: 'bg-purple-100',
    description: '비닐봉투, 랩'
  },
  {
    id: 'styrofoam',
    name: '스티로폼',
    icon: '📦',
    color: 'bg-pink-100',
    description: '포장재, 완충재'
  },
  {
    id: 'food',
    name: '음식물',
    icon: '🍎',
    color: 'bg-orange-100',
    description: '생선류 제외'
  },
  {
    id: 'general',
    name: '일반쓰레기',
    icon: '🗑️',
    color: 'bg-red-100',
    description: '종량제봉투 사용'
  },
];

export const mockPopularItems = [
  '페트병',
  '스티로폼',
  '테이크아웃컵',
  '과자봉지',
  '택배박스',
  '종이컵',
  '배달용기',
  '우유팩'
];

export const mockItemDatabase: Record<string, ItemDetail> = {
  '페트병': {
    name: '페트병',
    category: '플라스틱',
    categoryColor: 'bg-blue-100',
    disposal: [
      '내용물을 완전히 비우기',
      '물로 헹구기',
      '라벨 제거하기',
      '뚜껑 분리하기',
      '압축하여 배출하기'
    ],
    preprocessing: [
      '내부를 깨끗이 헹궈주세요',
      '라벨이 잘 떨어지지 않으면 물에 담가두었다가 제거하세요',
      '뚜껑과 몸통은 같은 플라스틱이지만 분리 배출해야 합니다'
    ],
    warnings: [
      '이물질이 남아있으면 재활용이 불가능합니다',
      '뚜껑을 분리하지 않으면 일반쓰레기로 처리됩니다',
      '찌그러뜨리지 않고 배출하면 수거 공간이 부족할 수 있습니다'
    ],
    schedule: '수원시 영통구: 화요일/목요일 저녁 8시 이후 배출'
  },
  '스티로폼': {
    name: '스티로폼',
    category: '스티로폼',
    categoryColor: 'bg-pink-100',
    disposal: [
      '이물질 완전히 제거',
      '테이프, 스티커 떼어내기',
      '깨끗한 상태로 배출',
      '큰 것은 잘게 부수기'
    ],
    preprocessing: [
      '과일, 야채 스티로폼 박스는 물로 씻어주세요',
      '택배용 완충재는 가능한 반품하거나 재사용하세요',
      '비닐 코팅이 있거나 색상이 있는 스티로폼은 일반쓰레기입니다'
    ],
    warnings: [
      '라면 용기나 컵라면 용기는 일반쓰레기입니다',
      '건축 자재용 스티로폼은 대형폐기물로 처리해야 합니다',
      '이물질이 묻어있으면 재활용 불가합니다'
    ],
    schedule: '수원시 영통구: 수요일 저녁 8시 이후 배출'
  },
  '테이크아웃컵': {
    name: '테이크아웃컵',
    category: '플라스틱',
    categoryColor: 'bg-blue-100',
    disposal: [
      '내용물 완전히 비우기',
      '물로 헹구기',
      '빨대, 뚜껑 분리',
      '플라스틱 배출함에 버리기'
    ],
    preprocessing: [
      '음료를 다 비우고 물로 헹궈주세요',
      '빨대와 뚜껑은 별도로 분리해주세요',
      '홀더(컵 슬리브)는 일반쓰레기입니다'
    ],
    warnings: [
      '종이컵처럼 보여도 플라스틱 코팅이 된 경우가 많습니다',
      '빨대는 재질에 따라 플라스틱 또는 일반쓰레기로 분리하세요',
      '내용물이 남아있으면 재활용이 불가능합니다'
    ],
    schedule: '수원시 영통구: 화요일/목요일 저녁 8시 이후 배출'
  },
  '과자봉지': {
    name: '과자봉지',
    category: '비닐',
    categoryColor: 'bg-purple-100',
    disposal: [
      '내용물을 완전히 비우기',
      '이물질 털어내기',
      '비닐류와 함께 배출'
    ],
    preprocessing: [
      '과자 부스러기를 깨끗이 털어내세요',
      '여러 개를 모아서 배출하면 좋습니다',
      '지퍼백에 모아서 배출해도 됩니다'
    ],
    warnings: [
      '알루미늄 코팅이 된 과자봉지는 일반쓰레기입니다',
      '이물질이 많이 묻어있으면 일반쓰레기로 배출하세요',
      '젖은 상태로 배출하면 안 됩니다'
    ],
    schedule: '수원시 영통구: 월요일/금요일 저녁 8시 이후 배출'
  },
  '택배박스': {
    name: '택배박스',
    category: '종이',
    categoryColor: 'bg-yellow-100',
    disposal: [
      '테이프, 송장 제거',
      '박스 펼치기',
      '끈으로 묶어서 배출',
      '비오는 날 배출 금지'
    ],
    preprocessing: [
      '송장, 테이프, 철핀을 모두 제거해주세요',
      '박스를 완전히 펼쳐서 부피를 줄여주세요',
      '코팅된 부분이나 비닐이 붙어있으면 떼어내세요'
    ],
    warnings: [
      '젖은 박스는 재활용이 불가능합니다',
      '오염된 박스는 일반쓰레기로 배출하세요',
      '너무 큰 박스는 잘라서 배출해주세요'
    ],
    schedule: '수원시 영통구: 수요일 저녁 8시 이후 배출'
  },
  '종이컵': {
    name: '종이컵',
    category: '종이',
    categoryColor: 'bg-yellow-100',
    disposal: [
      '내용물 비우기',
      '물로 헹구기',
      '압축하여 배출',
      '종이류와 분리 배출'
    ],
    preprocessing: [
      '음료를 완전히 비우고 물로 헹궈주세요',
      '여러 개를 겹쳐서 배출하면 좋습니다',
      '완전히 말린 후 배출하세요'
    ],
    warnings: [
      '플라스틱 코팅이 있지만 종이류로 분류됩니다',
      '이물질이 묻어있으면 재활용이 어렵습니다',
      '찌그러진 상태로 배출해도 됩니다'
    ],
    schedule: '수원시 영통구: 수요일 저녁 8시 이후 배출'
  },
  '배달용기': {
    name: '배달용기',
    category: '플라스틱',
    categoryColor: 'bg-blue-100',
    disposal: [
      '음식물 완전히 제거',
      '물로 깨끗이 씻기',
      '물기 제거',
      '플라스틱으로 배출'
    ],
    preprocessing: [
      '기름기가 많은 음식물은 휴지로 닦아내세요',
      '물로 여러 번 헹궈서 깨끗하게 해주세요',
      '검은색 용기는 일반쓰레기입니다'
    ],
    warnings: [
      '음식물이 남아있으면 재활용 불가합니다',
      '검은색 플라스틱은 선별이 어려워 일반쓰레기입니다',
      '뚜껑과 본체를 분리할 필요는 없습니다'
    ],
    schedule: '수원시 영통구: 화요일/목요일 저녁 8시 이후 배출'
  },
  '우유팩': {
    name: '우유팩',
    category: '종이',
    categoryColor: 'bg-yellow-100',
    disposal: [
      '내용물 완전히 비우기',
      '물로 헹구기',
      '펼쳐서 말리기',
      '우유팩 전용 수거함 배출'
    ],
    preprocessing: [
      '우유를 완전히 비우고 물로 여러 번 헹궈주세요',
      '가위로 잘라서 펼쳐주세요',
      '햇볕에 말려서 배출하면 더 좋습니다'
    ],
    warnings: [
      '일반 종이와 분리해서 배출해야 합니다',
      '마트나 주민센터의 전용 수거함을 이용하세요',
      '우유팩은 고급 펄프로 재활용됩니다'
    ],
    schedule: '수원시 영통구: 전용 수거함 이용 (상시)'
  },
  '캔': {
    name: '캔',
    category: '캔/고철',
    categoryColor: 'bg-gray-100',
    disposal: [
      '내용물 비우기',
      '물로 헹구기',
      '압축하여 배출'
    ],
    preprocessing: [
      '음료를 완전히 비우고 헹궈주세요',
      '담배꽁초 등 이물질을 넣지 마세요'
    ],
    warnings: [
      '페인트캔, 부탄가스캔은 별도 처리가 필요합니다',
      '찌그러뜨려서 배출해도 됩니다'
    ],
    schedule: '수원시 영통구: 화요일/목요일 저녁 8시 이후 배출'
  },
  '유리병': {
    name: '유리병',
    category: '유리',
    categoryColor: 'bg-green-100',
    disposal: [
      '내용물 비우기',
      '물로 헹구기',
      '뚜껑 분리',
      '깨지지 않게 배출'
    ],
    preprocessing: [
      '라벨을 제거할 필요는 없습니다',
      '뚜껑은 재질별로 분리해주세요',
      '깨진 유리는 신문지에 싸서 일반쓰레기로 배출하세요'
    ],
    warnings: [
      '내열유리, 크리스탈은 일반쓰레기입니다',
      '거울, 판유리는 대형폐기물입니다',
      '소주병, 맥주병은 빈용기 보증금 제도를 이용하세요'
    ],
    schedule: '수원시 영통구: 수요일 저녁 8시 이후 배출'
  }
};

// 검색을 위한 동의어 매핑
export const searchSynonyms: Record<string, string[]> = {
  '페트병': ['페트', '음료수병', '물병', 'PET'],
  '스티로폼': ['스티로폼박스', '완충재', '발포 스티렌'],
  '테이크아웃컵': ['플라스틱컵', '일회용컵', '음료컵'],
  '과자봉지': ['과자 봉투', '비닐봉지', '스낵봉지'],
  '택배박스': ['택배 상자', '박스', '골판지'],
  '종이컵': ['일회용 종이컵', '커피컵'],
  '배달용기': ['플라스틱 용기', '음식 용기', '일회용 용기'],
  '우유팩': ['우유곽', '주스팩', '멸균팩'],
  '캔': ['음료수캔', '알루미늄캔', '철캔'],
  '유리병': ['소주병', '맥주병', '병']
};

export function searchItems(query: string): ItemDetail[] {
  const lowerQuery = query.toLowerCase().trim();
  const results: ItemDetail[] = [];
  
  // 직접 매칭
  for (const [itemName, itemDetail] of Object.entries(mockItemDatabase)) {
    if (itemName.toLowerCase().includes(lowerQuery)) {
      results.push(itemDetail);
    }
  }
  
  // 동의어 매칭
  for (const [itemName, synonyms] of Object.entries(searchSynonyms)) {
    if (synonyms.some(syn => syn.toLowerCase().includes(lowerQuery))) {
      const itemDetail = mockItemDatabase[itemName];
      if (itemDetail && !results.includes(itemDetail)) {
        results.push(itemDetail);
      }
    }
  }
  
  return results;
}

export function getItemsByCategory(categoryId: string): ItemDetail[] {
  const categoryNames: Record<string, string> = {
    'plastic': '플라스틱',
    'paper': '종이',
    'can': '캔/고철',
    'glass': '유리',
    'vinyl': '비닐',
    'styrofoam': '스티로폼',
    'food': '음식물',
    'general': '일반쓰레기'
  };
  
  const targetCategory = categoryNames[categoryId];
  return Object.values(mockItemDatabase).filter(item => item.category === targetCategory);
}
