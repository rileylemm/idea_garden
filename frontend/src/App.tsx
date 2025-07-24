import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { GardenLayout } from "./components/GardenLayout"
import { Navbar } from "./components/Navbar"
import { HomePage } from "./pages/HomePage"
import { IdeasList } from "./pages/IdeasList"
import { IdeaDetail } from "./pages/IdeaDetail"
import { CreateIdea } from "./pages/CreateIdea"
import { SearchPage } from "./pages/SearchPage"
import { QuickCaptureProvider } from "./contexts/QuickCaptureContext.tsx"
import { QuickCaptureModal } from "./components/QuickCaptureModal"
import { QuickCapturePage } from "./pages/QuickCapturePage"
import { useElectronAPI } from "./hooks/useElectronAPI"

function AppContent() {
  useElectronAPI()
  return (
    <GardenLayout>
      <Navbar />
              <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ideas" element={<IdeasList />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />
          <Route path="/create" element={<CreateIdea />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/quick-capture" element={<QuickCapturePage />} />
        </Routes>
      <QuickCaptureModal />
    </GardenLayout>
  )
}

function App() {
  return (
    <Router>
      <QuickCaptureProvider>
        <AppContent />
      </QuickCaptureProvider>
    </Router>
  )
}

export default App
