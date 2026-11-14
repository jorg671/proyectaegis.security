/**
 * URL base del backend.
 * En desarrollo se define en frontend/.env (VITE_API_URL=http://localhost:3000).
 * Si no existe, usa el backend desplegado en Render.
 */
export const API_URL =
  import.meta.env.VITE_API_URL || 'https://aegis-security-backend.onrender.com'
