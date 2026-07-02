import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProfileProvider, useProfile } from './context/ProfileContext'
import ProfileGate from './screens/ProfileGate'
import Home from './screens/Home'
import ModuleDetail from './screens/ModuleDetail'
import Quiz from './screens/Quiz'
import Result from './screens/Result'
import CourseSummary from './screens/CourseSummary'
import Revision from './screens/Revision'

function Gated({ children }) {
  const { profileId } = useProfile()
  if (!profileId) return <ProfileGate />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Gated>
            <Home />
          </Gated>
        }
      />
      <Route
        path="/module/:moduleId"
        element={
          <Gated>
            <ModuleDetail />
          </Gated>
        }
      />
      <Route
        path="/module/:moduleId/quiz"
        element={
          <Gated>
            <Quiz />
          </Gated>
        }
      />
      <Route
        path="/module/:moduleId/result"
        element={
          <Gated>
            <Result />
          </Gated>
        }
      />
      <Route
        path="/module/:moduleId/cours"
        element={
          <Gated>
            <CourseSummary />
          </Gated>
        }
      />
      <Route
        path="/revision"
        element={
          <Gated>
            <Revision />
          </Gated>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ProfileProvider>
      <HashRouter>
        <div className="min-h-screen">
          <AppRoutes />
        </div>
      </HashRouter>
    </ProfileProvider>
  )
}
