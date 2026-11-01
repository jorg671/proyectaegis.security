export default function Footer({ compact = false }) {
  if (compact) {
    return (
      <footer className="footer">
        <p className="copy">© 2026 Aegis Security</p>
      </footer>
    )
  }

  return (
    <footer className="footer">
      <div className="footer-logo">
        <span>A</span>EGIS SECURITY
      </div>
      <p>Pruebas. Análisis. Protección.</p>
      <p className="copy">© 2026 Aegis Security. Proyecto académico.</p>
    </footer>
  )
}
