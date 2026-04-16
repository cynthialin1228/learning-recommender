import { useState, useRef } from 'react'
import api from '../api'
import './ResumeUpload.css'

export default function ResumeUpload({ onComplete }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase()
    if (ext !== 'pdf' && ext !== 'tex') {
      setError('Only PDF or TEX files are supported.')
      return
    }
    setError('')
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      // First, test if backend is reachable
      const healthCheck = await api.get('/api/health')
      console.log('✓ Backend is reachable:', healthCheck.data)
      
      const form = new FormData()
      form.append('resume', file)
      const res = await api.post('/api/resumes/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onComplete(res.data)
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Upload failed. Please try again.'
      setError(`${msg} (API: ${import.meta.env.VITE_API_URL || 'not set'})`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-page fade-up">
      <div className="upload-header">
        <h1>Find Your Learning Path</h1>
        <p>Upload your resume and we'll analyze it to recommend what to learn next.</p>
      </div>

      <div className="card">
        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.tex"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <div className="file-selected">
              <span className="file-icon">{file.name.endsWith('.pdf') ? '📄' : '📝'}</span>
              <span className="file-name">{file.name}</span>
              <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          ) : (
            <div className="drop-prompt">
              <span className="drop-icon">⬆️</span>
              <p>Drag & drop your resume here</p>
              <p className="drop-sub">or click to browse — PDF or TEX, max 5MB</p>
            </div>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        {file && (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: '16px' }}
          >
            {loading ? '🔍 Analyzing resume...' : 'Analyze Resume →'}
          </button>
        )}
      </div>

      <p className="upload-note">
        Your resume is processed securely. We only extract skills and experience — no personal data is stored without an account.
      </p>
    </div>
  )
}
