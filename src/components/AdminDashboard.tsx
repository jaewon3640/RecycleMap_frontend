import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, MessageSquare, ArrowLeft, 
  Trash2, MessageCircle, ClipboardList, Send, Edit2, Check, X
} from 'lucide-react';
import axios from 'axios';

// ✅ 인터페이스 정의
interface BoardResponse {
  id: number;
  title: string;
  content: string;
  authorName: string;
  status: string;
  createdAt: string;
  boardReplyList?: BoardReplyResponse[];
}

interface BoardReplyResponse {
  id: number;
  content: string; 
  authorName: string;
  createdAt: string;
}

interface FeedbackResponse {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
  feedbackStatus: string; // ✅ 백엔드 ENUM 필드명과 일치 (또는 status)
}

interface FeedbackReplyResponse {
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
  
  // 상세 보기 상태
  const [selectedBoard, setSelectedBoard] = useState<BoardResponse | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponse | null>(null);
  const [feedbackReplies, setFeedbackReplies] = useState<FeedbackReplyResponse[]>([]);
  
  // 입력 상태
  const [replyContent, setReplyContent] = useState('');
  const [feedbackReply, setFeedbackReply] = useState('');

  // 수정 모드 상태 (통합 관리)
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const getHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getHeaders();
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
    setSelectedBoard(null);
    setSelectedFeedback(null);
  }, [activeTab]);

  // --- [게시판 로직] ---
  const handleBoardClick = async (id: number) => {
    try {
      setLoading(true);
      const headers = getHeaders();
      const boardRes = await axios.get(`http://localhost:8080/api/board/${id}`, { headers });
      const replyRes = await axios.get(`http://localhost:8080/api/boardReply?boardId=${id}`, { headers });
      setSelectedBoard({ ...boardRes.data, boardReplyList: replyRes.data });
    } catch (err) {
      alert("상세 정보를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (replyContent.trim().length < 5) {
      alert("답변은 5자 이상 입력해야 합니다.");
      return;
    }
    try {
      const replyData = { replyContent: replyContent.trim(), authorName: "관리자" };
      await axios.post(`http://localhost:8080/api/boardReply/${selectedBoard?.id}`, replyData, { headers: getHeaders() });
      setReplyContent('');
      if (selectedBoard) handleBoardClick(selectedBoard.id);
      fetchData(); 
    } catch (err) {
      alert("답변 등록 실패");
    }
  };

  // --- [피드백 로직] ---
  const handleFeedbackClick = async (feedback: FeedbackResponse) => {
    setSelectedFeedback(feedback);
    try {
      const headers = getHeaders();
      const res = await axios.get(`http://localhost:8080/api/feedback-reply?feedbackId=${feedback.id}`, { headers });
      setFeedbackReplies(res.data);
    } catch (err) {
      console.error("피드백 답변 로딩 실패", err);
    }
  };

  const handleFeedbackReplySubmit = async () => {
    if (feedbackReply.trim().length < 10) {
      alert("피드백 답변은 10자 이상 입력해주세요.");
      return;
    }
    try {
      const headers = getHeaders();
      const replyData = { content: feedbackReply.trim(), authorName: "관리자" };
      await axios.post(`http://localhost:8080/api/feedback-reply/${selectedFeedback?.id}`, replyData, { headers });
      alert("조치가 저장되었습니다.");
      setFeedbackReply('');
      if (selectedFeedback) handleFeedbackClick(selectedFeedback);
      fetchData();
    } catch (err) {
      alert("피드백 답변 저장 실패");
    }
  };

  // --- [공통: 삭제/수정 (피드백 전용)] ---
  const handleDeleteFeedbackReply = async (replyId: number) => {
    if (!window.confirm("이 답변을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/feedback-reply/${replyId}`, { headers: getHeaders() });
      if (selectedFeedback) handleFeedbackClick(selectedFeedback);
      fetchData();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  const handleUpdateFeedbackReply = async (replyId: number) => {
    try {
      await axios.put(`http://localhost:8080/api/feedback-reply/${replyId}`, 
        { content: editContent, authorName: "관리자" }, 
        { headers: getHeaders() }
      );
      setEditingReplyId(null);
      if (selectedFeedback) handleFeedbackClick(selectedFeedback);
    } catch (err) {
      alert("수정 실패");
    }
  };

  const handleDeleteBoard = async (id: number) => {
    if (!window.confirm("정말로 게시글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/board/${id}`, { headers: getHeaders() });
      setBoards(boards.filter(b => b.id !== id));
      setSelectedBoard(null);
    } catch (err) {
      alert("게시글 삭제 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
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
        {selectedBoard ? (
          /* --- 게시판 상세 --- */
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setSelectedBoard(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-bold">
              <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
            </button>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-green-600 text-sm font-black uppercase tracking-widest mb-2 block">Q&A DETAIL</span>
                  <h3 className="text-2xl font-black text-slate-900">{selectedBoard.title}</h3>
                </div>
                <button onClick={() => handleDeleteBoard(selectedBoard.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl mb-8 text-slate-700 leading-relaxed font-medium">
                {selectedBoard.content}
              </div>
            </div>

            {/* 게시판 답변 목록 */}
            <div className="mb-6 space-y-4">
              <h4 className="font-black text-slate-900 flex items-center gap-2 px-2">
                <MessageSquare className="w-5 h-5 text-blue-500" /> 등록된 답변
              </h4>
              {selectedBoard.boardReplyList?.map((reply) => (
                <div key={reply.id} className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-blue-700 text-sm">RE: {reply.authorName}</span>
                    <span className="text-[11px] text-blue-400 font-bold">{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-700 bg-white/50 p-4 rounded-xl">{reply.content}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="답변을 입력하세요." className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl mb-2 resize-none" />
              <button onClick={handleReplySubmit} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> 답변 등록하기
              </button>
            </div>
          </div>

        ) : selectedFeedback ? (
          /* --- ✅ 피드백 상세 --- */
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setSelectedFeedback(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-bold">
              <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
            </button>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
              <span className="text-blue-600 text-sm font-black uppercase tracking-widest mb-2 block">USER FEEDBACK</span>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">작성자: {selectedFeedback.authorName}</h3>
                <span className="text-sm text-slate-400 font-bold">{new Date(selectedFeedback.createdAt).toLocaleString()}</span>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl text-slate-700 font-medium leading-relaxed">
                {selectedFeedback.content}
              </div>
            </div>

            {/* ✅ 피드백 답변 목록 */}
            {feedbackReplies.length > 0 && (
              <div className="mb-6 space-y-4">
                <h4 className="font-black text-slate-900 flex items-center gap-2 px-2">
                  <Check className="w-5 h-5 text-green-500" /> 처리된 조치 내역
                </h4>
                {feedbackReplies.map((reply) => (
                  <div key={reply.id} className="bg-green-50 border border-green-100 rounded-2xl p-6">
                    <div className="flex justify-between mb-3">
                      <span className="font-bold text-green-700">{reply.authorName}</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingReplyId(reply.id); setEditContent(reply.content); }} className="text-slate-400 hover:text-blue-500"><Edit2 size={16}/></button>
                        <button onClick={() => handleDeleteFeedbackReply(reply.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    </div>
                    {editingReplyId === reply.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-3 border-2 border-green-200 rounded-xl resize-none" />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleUpdateFeedbackReply(reply.id)} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">저장</button>
                          <button onClick={() => setEditingReplyId(null)} className="px-3 py-1 bg-slate-200 rounded-lg text-sm">취소</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-700 whitespace-pre-wrap">{reply.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-blue-500" /> 신규 조치 등록</h4>
              <textarea value={feedbackReply} onChange={(e) => setFeedbackReply(e.target.value)} placeholder="사용자 피드백에 대한 조치 내용을 입력하세요." className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl mb-4 resize-none font-medium" />
              <button onClick={handleFeedbackReplySubmit} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">조치 기록 저장</button>
            </div>
          </div>

        ) : (
          /* --- 목록 화면 --- */
          <>
            <header className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-slate-900">{activeTab === 'boards' ? '게시판 관리' : '피드백 관리'}</h2>
                <p className="text-slate-500 font-medium">RecycleMap 관리자 대시보드</p>
              </div>
            </header>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">ID</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">{activeTab === 'boards' ? '제목' : '피드백 내용'}</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-center">{activeTab === 'boards' ? '상태' : '작성자'}</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-center">날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'boards' ? (
                    boards.map(board => (
                      <tr key={board.id} onClick={() => handleBoardClick(board.id)} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">#{board.id}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{board.title}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black ${board.status === 'ANSWERED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                            {board.status === 'ANSWERED' ? '답변완료' : '대기중'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-xs text-slate-400 font-bold">{new Date(board.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    feedbacks.map(feedback => (
                      <tr key={feedback.id} onClick={() => handleFeedbackClick(feedback)} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">#{feedback.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900"><div className="max-w-md truncate">{feedback.content}</div></td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black ${feedback.feedbackStatus === 'ANSWERED' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                            {feedback.feedbackStatus === 'ANSWERED' ? '조치완료' : '접수대기'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-xs text-slate-400 font-bold">{new Date(feedback.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}