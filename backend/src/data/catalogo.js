/**
 * Catálogo que la IA conoce: es la "memoria" del negocio.
 *
 * IMPORTANTE: debe coincidir con frontend/src/data/servicios.js y con los
 * textos del sitio. Está duplicado porque backend y frontend se despliegan por
 * separado y no pueden compartir archivos. Cuando el catálogo pase a Supabase
 * (administrable desde el panel), ambos leerán la misma fuente y esta copia
 * desaparece.
 *
 * Regla de oro: lo que NO esté aquí, la IA no debe afirmarlo (ni precios,
 * ni plazos, ni garantías).
 */
const NEGOCIO = {
    nombre: "Aegis Security",
    lema: "Analizar para proteger.",
    descripcion:
        "Aegis Security es un proyecto orientado a la seguridad y a las pruebas de software y hardware. " +
        "No busca solo encontrar fallos: explica los riesgos de forma clara y propone recomendaciones prácticas " +
        "para mejorar la protección de los sistemas. Trabaja en tres ideas: análisis, prevención y protección."
};

const SERVICIOS = [
    {
        slug: "hardware",
        nombre: "Hardware Guard",
        tipo: "Revisión de hardware",
        paraQuien: "Equipos donde la prioridad es revisar componentes físicos, funcionamiento y posibles riesgos.",
        incluye: [
            "Estado de placas, memorias, discos, fuentes, puertos y conectores",
            "Funcionamiento general: estabilidad, fallos intermitentes, ruidos, temperaturas",
            "Riesgos de seguridad físicos (puertos abiertos, componentes accesibles)",
            "Configuraciones de protección: arranque, bloqueos, firmware",
            "Recomendaciones de mejora"
        ],
        precio: "$80.000 COP"
    },
    {
        slug: "software",
        nombre: "Software Sentinel",
        tipo: "Revisión de software",
        paraQuien: "Aplicaciones y sistemas donde se necesita identificar vulnerabilidades y problemas de seguridad.",
        incluye: [
            "Aplicaciones, servicios activos y su entorno",
            "Configuraciones inseguras y permisos excesivos",
            "Vulnerabilidades conocidas y software desactualizado",
            "Puntos de entrada y exposición (accesos remotos, interfaces)",
            "Recomendaciones de mejora"
        ],
        precio: "$120.000 COP"
    },
    {
        slug: "dual",
        nombre: "Dual Guard",
        tipo: "Hardware + Software (análisis integral)",
        paraQuien: "Quien quiere una visión global: combina las dos revisiones en un solo servicio.",
        incluye: [
            "Todo lo de Hardware Guard y Software Sentinel",
            "Riesgos que solo aparecen al revisar hardware y software juntos",
            "Informe general con hallazgos y recomendaciones priorizadas"
        ],
        precio:
            "Menor que contratar Hardware Guard y Software Sentinel por separado " +
            "(el valor exacto se confirma al solicitar el servicio)"
    },
    {
        slug: "capacitacion",
        nombre: "Aprendizaje y Capacitación",
        tipo: "Servicio independiente",
        paraQuien:
            "Quien quiere aprender conceptos y prácticas de seguridad informática, análisis de sistemas e " +
            "identificación de riesgos, con orientación y formación práctica.",
        incluye: [
            "No está incluido en los paquetes de revisión: se contrata por separado"
        ],
        precio: "No está publicado: se confirma al consultar"
    }
];

// Identificadores válidos; el recomendador solo puede devolver uno de estos
const SLUGS_VALIDOS = SERVICIOS.map((s) => s.slug);

module.exports = { NEGOCIO, SERVICIOS, SLUGS_VALIDOS };
