import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'RIS | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const next = params.get("next") || "/";
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="bg-[url('/images/bg-auth.svg')] min-h-screen flex items-center justify-center">
            <div className="absolute top-10 flex flex-col items-center gap-2">
    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight bg-linear-to-r from-indigo-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
      RIS
    </h1>
    <div className="w-32 h-10 bg-emerald-400/20 blur-3xl rounded-full" />

  <p className="text-sm text-gray-400">Resume Intelligence System</p>
  </div>

  {/* 🔥 AUTH CARD */}
  <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.7)] flex flex-col gap-8">

    <div className="flex flex-col items-center gap-2 text-center">
      <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
      <p className="text-sm text-gray-400">
        Log in to continue your journey
      </p>
    </div>

    <div>
      {isLoading ? (
        <button className="auth-button animate-pulse w-full">
          Signing you in...
        </button>
      ) : (
        <>
          {auth.isAuthenticated ? (
            <button className="primary-button w-full" onClick={auth.signOut}>
              Log Out
            </button>
          ) : (
            <button className="primary-button w-full" onClick={auth.signIn}>
              Log In
            </button>
          )}
        </>
      )}
    </div>

  </div>
        </main>
    )
}

export default Auth