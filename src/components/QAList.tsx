import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  PlusCircle, 
  User, 
  ChevronRight 
} from 'lucide-react';
import axios from 'axios';

interface QAListProps {
  onBack: () => void;
  onSelectPost: (postId: number) => void;
  onGoToWrite: () => void;
}

export function QAList({ onBack, onSelectPost, onGoToWrite }: QAListProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 게시글 가져오기 함수
  const fetchPosts = async (titleQuery: string = "") => {
    setIsLoading(true);
    try {
      // ✅ 해결: userId 파라미터를 삭제하여 "전체 게시글"을 요청합니다.
      const response = await axios.get('http://localhost:8080//api/board/search-name', {
        params: {
          title: titleQuery
        }
      });

      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        setPosts([]); 
      }
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
      setPosts([]); 
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(keyword);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Q&A 게시판</h2>
          </div>
          <button 
            onClick={onGoToWrite}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            질문하기
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="제목으로 검색해 보세요" 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium"
          />
        </form>

        <div className="space-y-3">
          {isLoading ? (
            <div className="py-20 text-center text-gray-400 font-bold">데이터를 불러오는 중...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <button 
                key={post.id}
                onClick={() => onSelectPost(post.id)}
                className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-md transition-all group text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">Question</span>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <User className="w-3 h-3" /> 
                      {/* 백엔드 DTO의 authorName(조인 결과)을 출력 */}
                      {post.authorName || '작성자 미상'} 
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))
          ) : (
            <div className="py-20 text-center text-gray-400">
              {keyword ? `'${keyword}'에 대한 검색 결과가 없습니다.` : "등록된 게시글이 없습니다."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}