
import './App.scss'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Code } from './pages/Code/Code'
import { useState } from 'react'

function App() {

  const [username, setUsername] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home setUsername={setUsername} setEmail={setEmail}/>}></Route>
      <Route path="/code" element={<Code username={username} setUsername={setUsername} email={email} setEmail={setEmail}/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
