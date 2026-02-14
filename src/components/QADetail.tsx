import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, ShieldCheck, User, Calendar, Trash2, Edit3, Check, X } from 'lucide-react';
import axios from 'axios';

interface QADetailProps {
  postId: number;
  userEmail: string; // ✅ userId: number에서 userEmail: string으로 변경
  onBack: () => void;
}

export function QADetail({ postId, userEmail, onBack }: QADetailProps) {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 수정 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!postId) return;
      try {

        console.log("--- 본인 확인 디버깅 ---");
console.log("1. 내 브라우저의 userEmail:", `"${userEmail}"`);
console.log("2. 서버가 준 작성자 이메일(authorEmail):", `"${post?.authorEmail}"`);
console.log("3. 서버가 준 작성자 이메일(email):", `"${post?.email}"`);
console.log("-----------------------");

        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/board/${postId}`);
        if (response.data) {
          setPost(response.data);
          setEditTitle(response.data.title);
          setEditContent(response.data.content);
        }
      } catch (error) {
        console.error("게시글 상세 조회 실패:", error);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        onBack();
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [postId, onBack]);

  // ✅ [수정] 본인 확인 로직 (게시글의 작성자 이메일과 로그인된 이메일 비교)
  // 백엔드에서 authorEmail 필드를 내려준다고 가정합니다.
  const isAuthor = post && (post.authorEmail === userEmail || post.email === userEmail);

  // ✅ 삭제 처리 함수 (userId 대신 email 사용)
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) return;
    try {
      // 백엔드 API 설계에 따라 쿼리 파라미터로 이메일을 보냅니다.
      await axios.delete(`http://localhost:8080/api/board/${postId}`, {
        params: { email: userEmail }
      });
      alert("삭제되었습니다.");
      onBack();
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다. 권한이 없거나 이미 삭제된 게시글일 수 있습니다.");
    }
  };

  // ✅ 수정 완료 함수 (userId 대신 email 사용)
  const handleUpdate = async () => {
    try {
      if (!userEmail) {
        alert("로그인 정보가 필요합니다.");
        return;
      }

      // 백엔드: @PutMapping("/{boardId}") ... @RequestParam String email
      await axios.put(`http://localhost:8080/api/board/${postId}`, {
        title: editTitle,
        content: editContent
      }, {
        params: { email: userEmail } // 쿼리 스트링으로 이메일 전달
      });

      alert("수정되었습니다.");
      setPost({ ...post, title: editTitle, content: editContent });
      setIsEditing(false);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 오류가 발생했습니다. 권한을 확인하세요.");
    }
  };

  const formatDate = (dateInput: any) => {
    if (!dateInput) return '날짜 정보 없음';
    const date = new Date(dateInput);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-400 font-bold">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <span>게시글을 읽어오는 중...</span>
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 font-bold">
      해당 게시글 정보를 찾을 수 없습니다.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <span className="font-bold text-gray-900">질문 상세 보기</span>
          </div>
          
          {/* ✅ 본인일 때만 수정/삭제 버튼 노출 */}
          {!isEditing && isAuthor && (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" /> 수정
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" /> 삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-xs font-black rounded-full border border-amber-100 uppercase tracking-tighter">
              Question
            </span>
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
              <Calendar className="w-3 h-3" />
              {formatDate(post.createdAt)}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <input 
                className="w-full text-2xl font-black text-gray-900 border-b-2 border-green-500 focus:outline-none py-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
              <textarea 
                className="w-full min-h-[200px] text-gray-700 leading-relaxed font-medium focus:outline-none py-2 resize-none"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="내용을 입력하세요"
              />
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">
                  <X className="w-4 h-4" /> 취소
                </button>
                <button onClick={handleUpdate} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100">
                  <Check className="w-4 h-4" /> 저장하기
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
                {post.title}
              </h2>
              <div className="text-gray-700 leading-relaxed font-medium min-h-[150px] whitespace-pre-wrap">
                {post.content}
              </div>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-800">{post.authorName || '익명 사용자'}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {post.status === 'WAITING' ? '답변 대기' : '답변 완료'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-800">답변</h3>
          </div>

          <div className="bg-green-50/50 border-2 border-green-100 rounded-[2rem] p-8 relative overflow-hidden">
             <ShieldCheck className="absolute top-4 right-4 w-12 h-12 text-green-200 opacity-50" />
            
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-black rounded-full">ADMIN</span>
              <span className="text-xs text-gray-400 font-bold">RecycleMap 매니저</span>
            </div>
            
            <p className="text-gray-800 leading-relaxed font-bold">
              안녕하세요 {post.authorName}님, 요청하신 질문 내용을 확인했습니다. 분리배출 가이드에 따라 정확한 답변을 드릴 수 있도록 검토 중입니다. 🌱
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}