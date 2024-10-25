
import './App.scss'
// import PeerChat from './components/PeerChat/PeerChat'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Code } from './pages/Code/Code'

function App() {
 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      {/* <Route path="/chat" element={<PeerChat code={""} setCode={()}/>}></Route> */}
      <Route path="/code" element={<Code/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
