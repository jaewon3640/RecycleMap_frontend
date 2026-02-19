import { useState, useEffect } from 'react';
import { 
  ArrowLeft, MessageSquare, User, Calendar, 
  Trash2, Edit3, Check, X, Send 
} from 'lucide-react';
import api from '../api';

interface QADetailProps {
  postId: number;
  userEmail: string;
  onBack: () => void;
}

export function QADetail({ postId, userEmail, onBack }: QADetailProps) {
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]); // ✅ 답변 목록 상태
  const [isLoading, setIsLoading] = useState(true);
  
  // 수정/입력 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [newReply, setNewReply] = useState(''); // ✅ 새 답변 입력 상태

  // 헤더 설정 (토큰 필요 시)
  const getHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchData = async () => {
    if (!postId) return;
    try {
      setIsLoading(true);
      // 1. 게시글 상세 조회
      const postRes = await api.get(`/api/board/${postId}`);
      setPost(postRes.data);
      setEditTitle(postRes.data.title);
      setEditContent(postRes.data.content);

      // 2. 답변 목록 조회 (작성하신 BoardReplyController 기반)
      const replyRes = await api.get(`/api/boardReply`, {
        params: { boardId: postId }
      });
      setReplies(replyRes.data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  const isAuthor = post && (post.authorEmail === userEmail || post.email === userEmail);

  // ✅ 답변 등록 함수
  const handleReplySubmit = async () => {
    if (!newReply.trim()) return;
    try {
      // BoardReplyDTO.Request 구조에 맞게 전송
      await api.post(`/api/boardReply/${postId}`, {
        replyContent: newReply,
        authorName: userEmail.split('@')[0] // 이메일 앞부분을 닉네임처럼 사용 (필요시 변경)
      }, { headers: getHeaders() });
      
      setNewReply('');
      fetchData(); // 목록 새로고침
    } catch (error) {
      alert("답변 등록에 실패했습니다.");
    }
  };

  // ✅ 답변 삭제 함수
  const handleDeleteReply = async (replyId: number) => {
    if (!window.confirm("답변을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/boardReply/${replyId}`, { headers: getHeaders() });
      fetchData();
    } catch (error) {
      alert("삭제 권한이 없습니다.");
    }
  };

  // (기존 게시글 수정/삭제 로직 유지...)
  const handleDelete = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/board/${postId}`, { params: { email: userEmail } });
      onBack();
    } catch (error) { alert("삭제 실패"); }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/api/board/${postId}`, 
        { title: editTitle, content: editContent }, 
        { params: { email: userEmail } }
      );
      setIsEditing(false);
      fetchData();
    } catch (error) { alert("수정 실패"); }
  };

  if (isLoading || !post) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 헤더 */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 font-bold text-gray-600"><ArrowLeft size={20}/> 뒤로가기</button>
          {!isEditing && isAuthor && (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="text-blue-600 text-sm font-bold">수정</button>
              <button onClick={handleDelete} className="text-red-600 text-sm font-bold">삭제</button>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* 게시글 본문 영역 */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8">
          {isEditing ? (
            <div className="space-y-4">
              <input className="w-full text-xl font-bold border-b p-2" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              <textarea className="w-full min-h-[200px] p-2 resize-none" value={editContent} onChange={e => setEditContent(e.target.value)} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-bold">취소</button>
                <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold">저장</button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black mb-4">{post.title}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">{post.content}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User size={14}/> <span>{post.authorName}</span>
                <Calendar size={14} className="ml-2"/> <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </>
          )}
        </div>

        {/* ✅ 답변 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-800">답변 {replies.length}개</h3>
          </div>

          {/* 답변 목록 */}
          <div className="space-y-4">
            {replies.length > 0 ? (
              replies.map((reply) => (
                <div key={reply.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><User size={14} className="text-gray-400"/></div>
                      <span className="font-bold text-sm text-gray-700">{reply.authorName}</span>
                    </div>
                    {/* 본인 답변일 경우 삭제 버튼 표시 (이메일 비교 로직 필요시 추가) */}
                    <button onClick={() => handleDeleteReply(reply.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{reply.content}</p>
                  <span className="text-[10px] text-gray-300 block mt-2">{new Date(reply.createdAt).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-400 text-sm">아직 등록된 답변이 없습니다. 첫 답변을 남겨보세요!</div>
            )}
          </div>

          {/* 답변 작성창 (일반 사용자용) */}
          <div className="mt-8 bg-white border-2 border-green-50 rounded-2xl p-4 shadow-sm">
            <textarea 
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="도움이 되는 답변을 남겨주세요."
              className="w-full h-24 p-2 resize-none focus:outline-none text-sm"
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleReplySubmit}
                disabled={!newReply.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm disabled:bg-gray-200 transition-colors"
              >
                <Send size={14}/> 답변 등록
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}