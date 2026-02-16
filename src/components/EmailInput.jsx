import { useRef, useEffect } from 'react'
import { Mail } from 'lucide-react'

export default function EmailInput({
  value,
  onChange,
  suggestions,
  showSuggestions,
  onFocus,
  onBlur,
  onSelect,
  error,
}) {
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onBlur()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        Destinatario
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary/50" />
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm
                      bg-surface transition-all duration-200
                      placeholder:text-text-secondary/40
                      focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                      ${error
                        ? 'border-danger ring-2 ring-danger/20'
                        : 'border-border'
                      }`}
        />
      </div>

      {error && (
        <p className="text-xs text-danger mt-1.5">{error}</p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((email) => (
            <button
              key={email}
              type="button"
              onMouseDown={() => onSelect(email)}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary-light
                         transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-text-secondary/50" />
              <span>{email}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
