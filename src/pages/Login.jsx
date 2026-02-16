import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Send, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
      toast.success('Sesión iniciada correctamente')
      navigate('/dashboard')
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') return
      toast.error('Error al iniciar sesión: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="animate-fade-in w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Send className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">
            Swift<span className="text-primary">Send</span>
          </h1>
          <p className="mt-3 text-text-secondary text-lg">
            Envía archivos por Gmail de forma ultra rápida
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-6 justify-center">
            <Zap className="w-4 h-4 text-warning" />
            <span>Conecta tu cuenta de Google para empezar</span>
          </div>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5
                       bg-surface border-2 border-border rounded-xl
                       hover:border-primary/30 hover:shadow-md
                       transition-all duration-200 cursor-pointer group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium text-text-primary group-hover:text-primary transition-colors">
              Iniciar sesión con Google
            </span>
          </button>

          <p className="text-xs text-text-secondary text-center mt-5">
            Se solicitará permiso para enviar correos en tu nombre
          </p>
        </div>
      </div>
    </div>
  )
}
