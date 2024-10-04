
import './App.css'
import PeerChat from './components/PeerChat/PeerChat'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home'

function App() {

 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/chat" element={<PeerChat/>}></Route>
      <Route path="/code" element={<PeerChat/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
