import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useEmailAutocomplete } from '../hooks/useEmailAutocomplete'
import { sendEmailWithAttachment, saveSentEmail } from '../services/gmailService'
import EmailInput from '../components/EmailInput'
import FileDropzone from '../components/FileDropzone'
import { Send, LogOut, Loader2, FileText, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Dashboard() {
  const { user, ensureAccessToken, logout } = useAuth()
  const {
    query: email,
    setQuery: setEmail,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    selectSuggestion,
  } = useEmailAutocomplete()

  const [file, setFile] = useState(null)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const [errors, setErrors] = useState({
    email: '',
    file: '',
    body: '',
  })

  const validate = () => {
    const newErrors = { email: '', file: '', body: '' }
    let valid = true

    if (!email.trim()) {
      newErrors.email = 'Este campo es obligatorio'
      valid = false
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Formato de correo no válido'
      valid = false
    }

    if (!file) {
      newErrors.file = 'Este campo es obligatorio'
      valid = false
    }

    if (!body.trim()) {
      newErrors.body = 'Este campo es obligatorio'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSend = async () => {
    if (!validate()) return

    setSending(true)
    try {
      const token = await ensureAccessToken()
      await sendEmailWithAttachment({
        accessToken: token,
        to: email,
        from: user.email,
        subject: `Archivo: ${file.name}`,
        body,
        file,
      })

      saveSentEmail(email)
      setSent(true)
      toast.success('Correo enviado exitosamente')

      setTimeout(() => {
        setEmail('')
        setFile(null)
        setBody('')
        setErrors({ email: '', file: '', body: '' })
        setSent(false)
      }, 2000)
    } catch (error) {
      toast.error(error.message || 'Error al enviar el correo')
    } finally {
      setSending(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Sesión cerrada')
    } catch {
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg text-text-primary">
              Swift<span className="text-primary">Send</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            <span className="text-sm text-text-secondary hidden sm:block">
              {user?.displayName}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-danger/10 text-text-secondary
                         hover:text-danger transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            Enviar archivo
          </h2>
          <p className="text-text-secondary mb-8">
            Completa los 3 pasos para enviar tu archivo al instante.
          </p>

          <div className="bg-surface rounded-2xl shadow-lg shadow-black/5 border border-border p-6 sm:p-8 space-y-6">
            {/* Step 1: Email */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-sm font-medium text-text-secondary">
                  Destinatario
                </span>
              </div>
              <EmailInput
                value={email}
                onChange={(val) => {
                  setEmail(val)
                  if (errors.email) setErrors((e) => ({ ...e, email: '' }))
                }}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                onSelect={(val) => {
                  selectSuggestion(val)
                  if (errors.email) setErrors((e) => ({ ...e, email: '' }))
                }}
                error={errors.email}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Step 2: File */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-sm font-medium text-text-secondary">
                  Archivo adjunto
                </span>
              </div>
              <FileDropzone
                file={file}
                onFileSelect={(f) => {
                  setFile(f)
                  if (errors.file) setErrors((e) => ({ ...e, file: '' }))
                }}
                error={errors.file}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Step 3: Body */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-sm font-medium text-text-secondary">
                  Descripción
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Cuerpo del correo
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4.5 h-4.5 text-text-secondary/50" />
                  <textarea
                    placeholder="Escribe tu mensaje aquí..."
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value)
                      if (errors.body) setErrors((err) => ({ ...err, body: '' }))
                    }}
                    rows={4}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm
                                bg-surface resize-none transition-all duration-200
                                placeholder:text-text-secondary/40
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                ${errors.body
                                  ? 'border-danger ring-2 ring-danger/20'
                                  : 'border-border'
                                }`}
                  />
                </div>
                {errors.body && (
                  <p className="text-xs text-danger mt-1.5">{errors.body}</p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={sending || sent}
              className={`w-full py-3.5 rounded-xl font-medium text-sm
                         flex items-center justify-center gap-2
                         transition-all duration-200 cursor-pointer
                         ${sent
                           ? 'bg-success text-white'
                           : 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]'
                         }
                         disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {sending ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Enviando...
                </>
              ) : sent ? (
                <>
                  <CheckCircle className="w-4.5 h-4.5" />
                  Enviado
                </>
              ) : (
                <>
                  <Send className="w-4.5 h-4.5" />
                  Enviar Correo
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
