import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import ResumeUpload from './components/ResumeUpload'
import CareerPaths from './components/CareerPaths'
import TimeInput from './components/TimeInput'
import TopicList from './components/TopicList'
import ResourceView from './components/ResourceView'
import FeedbackForm from './components/FeedbackForm'
import './App.css'

function AppContent() {
  const { user, logout } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  // Wizard state
  const [step, setStep] = useState('upload')   // upload | paths | time | topics | resources | feedback
  const [resumeData, setResumeData] = useState(null)   // { resumeId, analysis }
  const [selectedPath, setSelectedPath] = useState(null) // { rank, title }
  const [timeData, setTimeData] = useState(null)         // { minutes, sourceType }
  const [learningData, setLearningData] = useState(null) // { learningPathId, topics }
  const [selectedTopic, setSelectedTopic] = useState(null)

  const reset = () => {
    setStep('upload')
    setResumeData(null)
    setSelectedPath(null)
    setTimeData(null)
    setLearningData(null)
    setSelectedTopic(null)
  }

  return (
    <div className="app">
      <nav className="navbar">
        <span className="logo">📚 LearnPath</span>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-email">{user.email}</span>
              <button className="btn-ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="btn-ghost" onClick={() => setShowAuth(true)}>
              Login / Register
            </button>
          )}
        </div>
      </nav>

      <main className="main-content fade-up">
        {step === 'upload' && (
          <ResumeUpload
            onComplete={(data) => { setResumeData(data); setStep('paths') }}
          />
        )}
        {step === 'paths' && (
          <CareerPaths
            paths={resumeData.analysis.targetRoles}
            background={resumeData.analysis.background}
            onSelect={(path) => { setSelectedPath(path); setStep('time') }}
            onBack={() => setStep('upload')}
          />
        )}
        {step === 'time' && (
          <TimeInput
            careerPath={selectedPath.title}
            onSubmit={(data) => { setTimeData(data); setStep('topics') }}
            onBack={() => setStep('paths')}
          />
        )}
        {step === 'topics' && (
          <TopicList
            resumeId={resumeData.resumeId}
            selectedPathRank={selectedPath.rank}
            timeData={timeData}
            onSelect={(topic, learningPathId) => {
              setSelectedTopic(topic)
              setLearningData({ learningPathId })
              setStep('resources')
            }}
            onBack={() => setStep('time')}
          />
        )}
        {step === 'resources' && (
          <ResourceView
            topic={selectedTopic}
            sourceType={timeData.sourceType}
            onFeedback={() => setStep('feedback')}
            onBack={() => setStep('topics')}
          />
        )}
        {step === 'feedback' && (
          <FeedbackForm
            topic={selectedTopic}
            onComplete={reset}
            onBack={() => setStep('resources')}
          />
        )}
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
