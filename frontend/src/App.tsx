import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { GardenLayout } from "./components/GardenLayout"
import { Navbar } from "./components/Navbar"
import { HomePage } from "./pages/HomePage"
import { IdeasList } from "./pages/IdeasList"
import { IdeaDetail } from "./pages/IdeaDetail"
import { CreateIdea } from "./pages/CreateIdea"
import { SearchPage } from "./pages/SearchPage"

function App() {
  return (
    <Router>
      <GardenLayout>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ideas" element={<IdeasList />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />
          <Route path="/create" element={<CreateIdea />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </GardenLayout>
    </Router>
  )
}

export default App
