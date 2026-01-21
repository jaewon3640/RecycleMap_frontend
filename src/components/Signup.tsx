import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Trash2, Recycle, Leaf, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface SignupProps {
  onSignup: (name: string, email: string, password: string) => void;
  onGoToLogin: () => void;
}

export function Signup({ onSignup, onGoToLogin }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    onSignup(name, email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen grid md:grid-cols-2 gap-8 p-4 md:p-8">
        {/* Left Section - Brand Introduction */}
        <div className="hidden md:flex flex-col justify-center px-8 lg:px-16">
          <div className="space-y-8">
            {/* Logo & Title */}
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

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-green-900 mb-1">정확한 정보</h3>
                <p className="text-sm text-green-600">지역별 맞춤 규칙</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-3">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-green-900 mb-1">환경 보호</h3>
                <p className="text-sm text-green-600">지속 가능한 미래</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-green-900 mb-1">쉬운 검색</h3>
                <p className="text-sm text-green-600">빠른 품목 찾기</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-green-900 mb-1">커뮤니티</h3>
                <p className="text-sm text-green-600">함께 만드는 가이드</p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-green-900">개인화된 분리수거 알림</p>
                  <p className="text-sm text-green-600">맞춤형 알림으로 놓치지 마세요</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-green-900">커뮤니티 피드백 참여</p>
                  <p className="text-sm text-green-600">더 나은 가이드를 함께 만들어요</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-green-900">환경 보호 통계 확인</p>
                  <p className="text-sm text-green-600">나의 기여도를 확인하세요</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg mb-4">
                <Logo className="w-12 h-12" />
                <div>
                  <h1 className="text-xl text-green-800">RecycleMap</h1>
                  <p className="text-xs text-green-600">분리수거 가이드</p>
                </div>
              </div>
            </div>

            {/* Signup Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">시작하기</h2>
                <p className="text-gray-600">RecycleMap 계정을 만들어보세요</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-700 mb-2 ml-1">
                    이름
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="홍길동"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 placeholder:text-gray-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-2 ml-1">
                    이메일
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 placeholder:text-gray-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm text-gray-700 mb-2 ml-1">
                    비밀번호
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="최소 6자 이상"
                        className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 placeholder:text-gray-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2 ml-1">
                    비밀번호 확인
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호 재입력"
                        className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 placeholder:text-gray-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="bg-green-50 border-2 border-green-100 rounded-xl p-4">
                  <p className="text-xs text-green-700 leading-relaxed">
                    회원가입 시 <span className="underline cursor-pointer">이용약관</span> 및{' '}
                    <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하는 것으로 간주됩니다.
                  </p>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span>계정 만들기</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">이미 계정이 있으신가요?</span>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={onGoToLogin}
                className="w-full py-4 bg-white hover:bg-gray-50 text-green-700 border-2 border-green-200 hover:border-green-300 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <span>로그인</span>
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-500 text-sm mt-8">
              © 2025 RecycleMap. 환경을 생각하는 분리수거 가이드
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}