import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  PlusCircle,
  User,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import api from '../api';

const PAGE_SIZE = 10;

interface QAListProps {
  onBack: () => void;
  onSelectPost: (postId: number) => void;
  onGoToWrite: () => void;
  userEmail?: string;
}

export function QAList({ onBack, onSelectPost, onGoToWrite, userEmail }: QAListProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchPosts = async (titleQuery: string = "", page: number = 0) => {
    setIsLoading(true);
    try {
      const response = titleQuery.trim()
        ? await api.get('/api/board/search', { params: { title: titleQuery, page, size: PAGE_SIZE } })
        : await api.get('/api/board', { params: { page, size: PAGE_SIZE } });

      // Spring Page 응답: { content: [...], totalPages, totalElements, number, ... }
      const pageData = response.data;
      setPosts(pageData.content ?? []);
      setTotalPages(pageData.totalPages ?? 0);
      setTotalElements(pageData.totalElements ?? 0);
      setCurrentPage(pageData.number ?? 0);
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
      setPosts([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPosts(keyword, 0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPosts(keyword, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지 번호 목록 계산 (최대 5개 표시)
  const getPageNumbers = () => {
    const delta = 2;
    const start = Math.max(0, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
        {/* 검색창 */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="제목으로 검색해 보세요"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium"
          />
        </form>

        {/* 결과 요약 */}
        {!isLoading && totalElements > 0 && (
          <p className="text-sm text-gray-400 mb-4">
            총 <span className="font-semibold text-gray-600">{totalElements}</span>개의 게시글
            {keyword && <> · &quot;{keyword}&quot; 검색 결과</>}
          </p>
        )}

        {/* 게시글 목록 */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-20 text-center text-gray-400 font-bold flex flex-col items-center gap-4">
               <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
               데이터를 불러오는 중...
            </div>
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
                      {post.authorName || post.nickname || '작성자 미상'}
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

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  page === currentPage
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {page + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}