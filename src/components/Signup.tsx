import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Trash2, Recycle, Leaf, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import axios from 'axios'; // npm install axios 필요

interface SignupProps {
  onGoToLogin: () => void;
}

export function Signup({ onGoToLogin }: SignupProps) {
  // 1. 상태 관리
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. 서버 통신 함수 (handleSubmit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 프론트엔드 1차 검증
    if (!name || !email || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setIsLoading(true);

    try {
      // 백엔드 API 호출 (DTO 필드명: email, password, passwordCheck, nickname)
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        email: email,
        password: password,
        passwordCheck: confirmPassword,
        nickname: name
      });

      if (response.status === 200) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        onGoToLogin();
      }
    } catch (err: any) {
      // 백엔드 GlobalExceptionHandler에서 합친 메시지를 출력
      if (err.response && err.response.data) {
        // 서버에서 보낸 ErrorResponse의 message 필드를 사용
        setError(err.response.data.message || '입력 정보를 확인해주세요.');
      } else {
        setError('서버와 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 3. UI 렌더링
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen grid md:grid-cols-2 gap-8 p-4 md:p-8">
        {/* Left Section - Brand Introduction */}
        <div className="hidden md:flex flex-col justify-center px-8 lg:px-16">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
                <Logo className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl text-green-800">RecycleMap</h1>
                  <p className="text-sm text-green-600">분리수거 가이드</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl text-green-900 leading-tight">
                  함께 만드는<br />
                  <span className="text-green-600">깨끗한 환경</span>
                </h2>
                <p className="text-lg text-green-700 leading-relaxed">
                  RecycleMap 커뮤니티에 참여하여<br />
                  올바른 분리수거 문화를 만들어가요 🌍
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-green-900 mb-1">정확한 정보</h3>
                <p className="text-sm text-green-600">지역별 맞춤 규칙</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-3">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-green-900 mb-1">환경 보호</h3>
                <p className="text-sm text-green-600">지속 가능한 미래</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">시작하기</h2>
                <p className="text-gray-600">RecycleMap 계정을 만들어보세요</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 ml-1">이름</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="홍길동"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 ml-1">이메일</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 ml-1">비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="최소 8자 이상"
                      className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 ml-1">비밀번호 확인</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호 재입력"
                      className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {/* 에러 메시지 표시 영역 */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-shake">
                    <p className="text-sm text-red-700 font-medium">⚠️ {error}</p>
                  </div>
                )}

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 group transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
                >
                  {isLoading ? '계정 생성 중...' : '계정 만들기'}
                  {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <span className="relative px-4 bg-white text-sm text-gray-500">이미 계정이 있으신가요?</span>
              </div>

              <button
                onClick={onGoToLogin}
                className="w-full py-4 bg-white text-green-700 border-2 border-green-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                로그인으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}