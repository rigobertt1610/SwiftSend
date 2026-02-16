import { useState, useRef } from 'react'
import { UploadCloud, File, X } from 'lucide-react'

export default function FileDropzone({ file, onFileSelect, error }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleClick = () => inputRef.current?.click()

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const removeFile = (e) => {
    e.stopPropagation()
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div
        onClick={handleClick}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                     transition-all duration-200
                     ${isDragging
                       ? 'border-primary bg-primary-light scale-[1.02]'
                       : error
                         ? 'border-danger bg-danger-light'
                         : file
                           ? 'border-success/40 bg-success/5'
                           : 'border-border hover:border-primary/40 hover:bg-primary-light/50'
                     }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
        />

        {file ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {file.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {formatSize(file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="w-8 h-8 rounded-lg hover:bg-danger/10 flex items-center justify-center
                         transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-danger" />
            </button>
          </div>
        ) : (
          <div className="py-2">
            <UploadCloud
              className={`w-10 h-10 mx-auto mb-3 ${
                isDragging ? 'text-primary' : 'text-text-secondary/40'
              }`}
            />
            <p className="text-sm text-text-secondary">
              <span className="text-primary font-medium">Haz clic para subir</span>
              {' '}o arrastra tu archivo aquí
            </p>
            <p className="text-xs text-text-secondary/60 mt-1">
              Cualquier tipo de archivo
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-danger mt-1.5 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  )
}
