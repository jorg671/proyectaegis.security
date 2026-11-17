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
// Rangos orientativos en COP.
// Son parámetros configurables, no tarifas oficiales.
const PRECIOS_ORIENTATIVOS = {
    hardware: {
        minimo: 80000,
        maximo: 180000,
        base: 80000
    },
    software: {
        minimo: 120000,
        maximo: 300000,
        base: 120000
    },
    dual: {
        minimo: 180000,
        maximo: 430000,
        base: 180000,
        descuento: 0.10
    },
    capacitacion: {
        minimo: 150000,
        maximo: 400000,
        base: 150000
    }
};

// Formato de moneda colombiana
const formatoCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);

// Estimación según el alcance indicado por el cliente
const calcularEstimacion = ({
    servicio,
    equipos = 1,
    aplicaciones = 1,
    participantes = 1,
    horas = 1,
    complejidad = "media"
}) => {
    const precio = PRECIOS_ORIENTATIVOS[servicio];

    if (!precio) return null;

    const cantidadEquipos = Math.max(1, Number(equipos) || 1);
    const cantidadApps = Math.max(1, Number(aplicaciones) || 1);
    const cantidadPersonas = Math.max(1, Number(participantes) || 1);
    const duracion = Math.max(1, Number(horas) || 1);

    const factores = {
        baja: 0.85,
        media: 1,
        alta: 1.35
    };

    const factor = factores[complejidad] || 1;

    let estimado = precio.base;

    if (servicio === "hardware") {
        estimado += (cantidadEquipos - 1) * 25000;
    }

    if (servicio === "software") {
        estimado += (cantidadApps - 1) * 35000;
    }

    if (servicio === "dual") {
        estimado += (cantidadEquipos - 1) * 20000;
        estimado += (cantidadApps - 1) * 25000;
        estimado *= (1 - precio.descuento);
    }

    if (servicio === "capacitacion") {
        estimado += (cantidadPersonas - 1) * 15000;
        estimado += (duracion - 1) * 30000;
    }

    estimado *= factor;

    const minimo = Math.round(
        Math.min(precio.maximo, Math.max(precio.minimo, estimado * 0.85))
    );

    const maximo = Math.round(
        Math.min(precio.maximo, Math.max(precio.minimo, estimado * 1.15))
    );

    return {
        minimo,
        maximo,
        formato: `${formatoCOP(minimo)} - ${formatoCOP(maximo)}`,
        moneda: "COP",
        caracter: "Estimación orientativa, no cotización definitiva"
    };
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
        precio: "Desde $80.000 COP (valor aproximado; depende del equipo y del alcance de la revisión)"
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
        precio: "Desde $120.000 COP (valor aproximado; depende de las aplicaciones y del alcance de la revisión)"
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
            "Desde $180.000 COP. Precio combinado, inferior a contratar ambas revisiones por separado " +
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
        precio: "Desde $300.000 COP. Servicio independiente; el valor final depende de la duración, participantes y contenidos"
    }
];

// Identificadores válidos; el recomendador solo puede devolver uno de estos
const SLUGS_VALIDOS = SERVICIOS.map((s) => s.slug);

module.exports = {
    NEGOCIO,
    SERVICIOS,
    SLUGS_VALIDOS,
    PRECIOS_ORIENTATIVOS,
    calcularEstimacion
};
