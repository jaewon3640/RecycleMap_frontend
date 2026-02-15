import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Recycle, Leaf, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import axios from 'axios';

interface LoginProps {
  // ✅ role 인자를 추가하여 App.tsx에 권한 정보를 넘깁니다.
  onLoginSuccess: (nickname: string, role: string) => void;
  onGoToSignup: () => void;
}

export function Login({ onLoginSuccess, onGoToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password,
      });

      // ✅ 백엔드 응답에서 role을 추가로 구조 분해 할당합니다.
      const { accessToken, refreshToken, nickname, role } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('nickname', nickname);
      localStorage.setItem('userEmail', email); 
      // ✅ 나중을 위해 로컬 스토리지에도 권한 정보를 저장합니다.
      localStorage.setItem('userRole', role);

      // ✅ 닉네임과 권한 정보를 함께 부모 컴포넌트로 전달합니다.
      onLoginSuccess(nickname, role);

    } catch (err: any) {
      if (err.response && err.response.data) {
        const serverMessage = typeof err.response.data === 'object' 
                              ? err.response.data.message 
                              : err.response.data;
        setError(serverMessage);
      } else {
        setError('서버와 연결할 수 없습니다. 네트워크 상태를 확인하세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen grid md:grid-cols-2 gap-8 p-4 md:p-8">
        {/* 왼쪽 섹션 - 브랜드 소개 */}
        <div className="hidden md:flex flex-col justify-center px-8 lg:px-16">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
                <Logo className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl text-green-800 font-bold">RecycleMap</h1>
                  <p className="text-sm text-green-600">분리수거 가이드</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl text-green-900 leading-tight font-bold">
                  지구를 위한<br />
                  <span className="text-green-600">작은 실천</span>
                </h2>
                <p className="text-lg text-green-700 leading-relaxed">
                  우리 지역의 분리수거 규칙을 쉽고 정확하게.<br />
                  올바른 분리수거로 환경을 지켜요 🌱
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-green-900 font-semibold mb-1">정확한 정보</h3>
                <p className="text-sm text-green-600">지역별 맞춤 규칙</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-3">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-green-900 font-semibold mb-1">환경 보호</h3>
                <p className="text-sm text-green-600">지속 가능한 미래</p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션 - 로그인 폼 */}
        <div className="flex items-center justify-center">
          <div className="w-full max-md">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">환영합니다!</h2>
                <p className="text-gray-600">RecycleMap에 로그인하세요</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 ml-1">이메일</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 ml-1">비밀번호</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 transition-all">
                    <p className="text-sm text-red-700 font-semibold">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isLoading ? '로그인 중...' : '로그인'}</span>
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-medium">또는</span></div>
              </div>

              <button
                onClick={onGoToSignup}
                className="w-full py-4 bg-white hover:bg-gray-50 text-green-700 font-bold border-2 border-green-200 hover:border-green-300 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <span>계정 만들기</span>
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-8">© 2026 RecycleMap. 수원시 분리수거 가이드</p>
          </div>
        </div>
      </div>
    </div>
  );
}