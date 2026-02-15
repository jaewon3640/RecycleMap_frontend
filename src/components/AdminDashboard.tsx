import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, MessageSquare, Database, ArrowLeft, 
  Trash2, ExternalLink, MessageCircle, ClipboardList, Send
} from 'lucide-react';
import axios from 'axios';

interface BoardResponse {
  id: number;
  title: string;
  content: string; // 상세 조회를 위해 추가
  authorName: string;
  status: string;
  createdAt: string;
}

interface FeedbackResponse {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'boards' | 'feedbacks'>('boards');
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ 상세 보기 상태 추가
  const [selectedBoard, setSelectedBoard] = useState<BoardResponse | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'boards') {
        const res = await axios.get('http://localhost:8080/api/board/search-name', { headers });
        setBoards(res.data);
      } else {
        const res = await axios.get('http://localhost:8080/api/feedbacks/admin', { headers });
        setFeedbacks(res.data);
      }
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSelectedBoard(null); // 탭 변경 시 상세창 닫기
  }, [activeTab]);

  // ✅ 게시글 상세 조회 핸들러
  const handleBoardClick = async (id: number) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/board/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setSelectedBoard(res.data);
    } catch (err) {
      alert("게시글 상세 정보를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 답글 등록 핸들러 (예시 API)
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    try {
      await axios.post(`http://localhost:8080/api/board/${selectedBoard?.id}/reply`, 
        { content: replyContent },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }}
      );
      alert("답글이 등록되었습니다.");
      setReplyContent('');
      setSelectedBoard(null);
      fetchData();
    } catch (err) {
      alert("답글 등록에 실패했습니다.");
    }
  };

  const handleDeleteBoard = async (id: number) => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/board/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setBoards(boards.filter(b => b.id !== id));
      setSelectedBoard(null);
    } catch (err) {
      alert("삭제 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (동일) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Admin Center</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('boards')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'boards' ? 'bg-green-600 text-white' : 'hover:bg-slate-800'}`}>
            <ClipboardList className="w-5 h-5" />
            <span className="font-medium">게시판 관리</span>
          </button>
          <button onClick={() => setActiveTab('feedbacks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'feedbacks' ? 'bg-green-600 text-white' : 'hover:bg-slate-800'}`}>
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">사용자 피드백</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>사용자 페이지로</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* 상세 뷰가 활성화되었을 때 */}
        {selectedBoard ? (
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => setSelectedBoard(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
            </button>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-green-600 text-sm font-black uppercase tracking-widest mb-2 block">Q&A DETAIL</span>
                  <h3 className="text-2xl font-black text-slate-900">{selectedBoard.title}</h3>
                </div>
                <button onClick={() => handleDeleteBoard(selectedBoard.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-2xl mb-8 text-slate-700 leading-relaxed font-medium">
                {selectedBoard.content}
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-400 border-t border-slate-50 pt-6">
                <span className="font-bold text-slate-600">작성자: {selectedBoard.authorName}</span>
                <span>•</span>
                <span>{new Date(selectedBoard.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* 답글 영역 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" /> 관리자 답변 달기
              </h4>
              <textarea 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="사용자에게 남길 답변을 입력하세요..."
                className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all resize-none mb-4 font-medium"
              />
              <button 
                onClick={handleReplySubmit}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                <Send className="w-4 h-4" /> 답변 등록하기
              </button>
            </div>
          </div>
        ) : (
          /* 목록 뷰 (기존 코드 유지) */
          <>
            <header className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  {activeTab === 'boards' ? '게시판 관리' : '피드백 관리'}
                </h2>
                <p className="text-slate-500 font-medium">RecycleMap 서비스의 소중한 데이터들입니다.</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border text-sm font-bold text-slate-600">
                총 {activeTab === 'boards' ? boards.length : feedbacks.length} 건
              </div>
            </header>

            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>
            ) : (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">
                        {activeTab === 'boards' ? '제목 (클릭 시 상세)' : '피드백 내용'}
                      </th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">작성자</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-center">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activeTab === 'boards' ? (
                      boards.map((board) => (
                        <tr key={board.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                          <td className="px-6 py-4 text-sm font-bold text-slate-400">#{board.id}</td>
                          {/* 제목 클릭 시 상세 보기로 이동 */}
                          <td onClick={() => handleBoardClick(board.id)} className="px-6 py-4 text-sm font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                            {board.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">{board.authorName}</td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteBoard(board.id); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      feedbacks.map((fb) => (
                        <tr key={fb.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-slate-400">#{fb.id}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">{fb.content}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">{fb.authorName}</td>
                          <td className="px-6 py-4 text-center">
                            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><ExternalLink className="w-5 h-5" /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}