
import './App.scss'
// import PeerChat from './components/PeerChat/PeerChat'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Code } from './pages/Code/Code'
import { useState } from 'react'

function App() {

  const [username, setUsername] = useState<string | null>(null)
 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home setUsername={setUsername}/>}></Route>
      {/* <Route path="/chat" element={<PeerChat code={""} setCode={()}/>}></Route> */}
      <Route path="/code" element={<Code username={username}/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
