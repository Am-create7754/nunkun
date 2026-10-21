import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';
import api from '../api';
import { useGoogleLogin } from '@react-oauth/google';

export default function Auth() {
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [nameInput, setNameInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        if (email && password) {
          const { data } = await api.post('/auth/login', { email, password });
          login(data.name, data.token);
          navigate('/menu');
        }
      } else {
        // Register Mode
        if (nameInput && email && password) {
          const { data } = await api.post('/auth/register', { name: nameInput, email, password });
          login(data.name, data.token);
          navigate('/menu');
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Authentication failed');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await api.post('/auth/google', { token: tokenResponse.access_token });
        login(data.name, data.token);
        navigate('/menu');
      } catch (error: any) {
        alert(error.response?.data?.message || 'Google Auth failed');
      }
    },
    onError: () => {
      alert('Google Login Failed');
    }
  });

  const handleMockSocialLogin = async (platform: string) => {
    if (platform === 'Google') {
      googleLogin();
    } else {
      alert(`${platform} login not fully implemented in this demo.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F1] flex p-4 md:p-8 justify-center items-center">
      <div className="w-full max-w-[1200px] h-[85vh] min-h-[650px] bg-white rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-xl">

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white h-full relative overflow-y-auto hide-scrollbar">

          <div className="mb-10 text-center">
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="font-body text-gray-500 text-sm">
              {isLogin ? 'Enter your email and password to access your account' : 'Sign up to start customizing delicious cakes'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block font-body text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C96B4B] font-body text-sm transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block font-body text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C96B4B] font-body text-sm transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-body text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C96B4B] font-body text-sm transition-colors"
                required
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm font-body">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#C96B4B] focus:ring-[#C96B4B] accent-[#C96B4B]" />
                  Remember me
                </label>
                <a href="#" className="font-bold text-gray-900 hover:text-[#C96B4B] transition-colors">Forgot Password</a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#E58F4C] hover:bg-[#D47E3B] text-white py-3.5 rounded-xl font-body font-bold text-lg transition-colors mt-4"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center">
              <div className="absolute border-t border-gray-200 w-full"></div>
              <span className="bg-white px-4 text-xs font-body text-gray-400 relative z-10">Or {isLogin ? 'login' : 'sign up'} with</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button onClick={() => handleMockSocialLogin('Google')} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors">
                {/* Google Icon Mock */}
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.369 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.109 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                <span className="font-body text-sm font-bold text-gray-700">Google</span>
              </button>

              <button onClick={() => handleMockSocialLogin('Apple')} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors">
                {/* Apple Icon Mock */}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.641-.026 2.662-1.48 3.662-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.246-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                </svg>
                <span className="font-body text-sm font-bold text-gray-700">Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm font-body text-gray-500">
            {isLogin ? (
              <>Don't have an account? <button onClick={() => setIsLogin(false)} className="font-bold text-gray-900 hover:text-[#C96B4B]">Register</button></>
            ) : (
              <>Already have an account? <button onClick={() => setIsLogin(true)} className="font-bold text-gray-900 hover:text-[#C96B4B]">Sign In</button></>
            )}
          </div>

        </div>

        {/* Right Side: Image and Overlay */}
        <div className="w-full md:w-1/2 relative h-64 md:h-full bg-gray-200 hidden md:block">
          <img
            src="/images/image copy.png"
            alt="Delicious croissants"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Top Tag */}
          <div className="absolute top-8 left-0 bg-white px-6 py-2 rounded-r-xl font-heading font-bold tracking-widest text-sm text-gray-900 shadow-md">
            MORNING RISE
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="font-heading text-4xl mb-4 leading-tight">Try Our New Chocolate Almond Croissant!</h2>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-6">
              Indulge in the perfect harmony of rich chocolate and toasted almonds, wrapped in our buttery, flaky croissant. A treat you won't forget!
            </p>

            <div className="flex items-center gap-2 opacity-50 mb-8">
              <div className="w-8 h-1 bg-white rounded-full"></div>
              <div className="w-8 h-1 bg-white/40 rounded-full"></div>
              <div className="w-8 h-1 bg-white/40 rounded-full"></div>
            </div>
          </div>

          {/* Back to Home Button */}
          <Link
            to="/"
            className="absolute bottom-0 right-0 bg-white text-gray-900 px-8 py-4 rounded-tl-[32px] font-body text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            Back to Home <span>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
