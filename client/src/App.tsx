
import './App.css'
import PeerChat from './components/PeerChat/PeerChat'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

function App() {

 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<h1>Home</h1>}></Route>
      <Route path="/chat" element={<PeerChat/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
