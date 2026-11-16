import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/Scrolltotop'
import Home from './pages/Home'
import ServicioPage from './pages/servicios/ServicioPage'
import Login from './pages/admin/Login'
import Panel from './pages/admin/Panel'
import AsistenteIA from './components/AsistenteIA'

function App() {
  return (
    <BrowserRouter basename="/proyectaegis.security">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Una sola ruta para los 3 servicios: el :slug decide el contenido */}
        <Route path="/servicios/:slug" element={<ServicioPage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/panel" element={<Panel />} />
      </Routes>
      {/* Burbuja de IA: se oculta sola en /admin */}
      <AsistenteIA />
    </BrowserRouter>
  )
}

export default App
