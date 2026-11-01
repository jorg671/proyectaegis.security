import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/Scrolltotop'
import Home from './pages/Home'
import Hardware from './pages/servicios/Hardware'
import Software from './pages/servicios/Software'
import Dual from './pages/servicios/Dual'
import Login from './pages/admin/Login'
import Panel from './pages/admin/Panel'

function App() {
  return (
    <BrowserRouter basename="/proyectaegis.security">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios/hardware" element={<Hardware />} />
        <Route path="/servicios/software" element={<Software />} />
        <Route path="/servicios/dual" element={<Dual />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/panel" element={<Panel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
