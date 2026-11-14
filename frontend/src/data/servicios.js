/**
 * Catálogo de servicios de Aegis Security.
 *
 * Es la ÚNICA fuente de verdad del catálogo: la página de cada servicio, el
 * panel de administración y los accesos rápidos leen de aquí. Para cambiar un
 * texto o un precio se edita este archivo y no hay que tocar ningún componente.
 *
 * Decisión técnica: los datos están separados de la vista para que más adelante
 * puedan venir de la base de datos (Supabase) sin reescribir los componentes.
 *
 * Formato de texto: lo que va entre **dos asteriscos** se muestra en negrita.
 */
export const servicios = [
  {
    slug: 'hardware',
    titulo: 'Hardware',
    acento: 'Guard',
    subtitulo: 'Revisión de hardware',
    descripcion: [
      '**Hardware Guard** es un servicio especializado en la revisión física de equipos y componentes, diseñado para detectar fallos, riesgos de seguridad y puntos débiles que normalmente pasan desapercibidos en el uso diario.',
      'A diferencia de un simple diagnóstico técnico, este servicio analiza el hardware desde una perspectiva de seguridad: no solo busca si el equipo “funciona”, sino si está expuesto a riesgos, si sus componentes presentan signos de deterioro, manipulación o configuraciones inseguras, y qué acciones se pueden tomar para reforzar su protección.',
      'El objetivo es simple: **encontrar problemas antes de que se conviertan en incidentes**.',
    ],
    tituloDetalle: '¿Qué revisamos?',
    detalles: [
      {
        titulo: 'Componentes físicos del equipo',
        texto:
          'Se inspecciona el estado de placas, memorias, discos, fuentes de poder, puertos y conectores. Se busca desgaste, daños, sobrecalentamiento o conexiones deficientes.',
      },
      {
        titulo: 'Estado y funcionamiento general',
        texto:
          'Se evalúa estabilidad, respuesta, fallos intermitentes, ruidos anormales o temperaturas elevadas que indiquen un problema en desarrollo.',
      },
      {
        titulo: 'Posibles riesgos de seguridad',
        texto:
          'Se identifican escenarios donde el hardware puede ser un punto de entrada: puertos abiertos, componentes accesibles o falta de protección física.',
      },
      {
        titulo: 'Configuraciones de protección',
        texto:
          'Se revisan opciones de arranque, bloqueos, controles de acceso físico, firmware y parámetros que influyen en la exposición del equipo.',
      },
      {
        titulo: 'Recomendaciones de mejora',
        texto:
          'Se entregan acciones concretas: qué corregir, qué reforzar, qué reemplazar y qué prácticas adoptar para reducir riesgos.',
      },
    ],
    precio: { etiqueta: 'Precio', valor: '$80.000 COP' },
  },
  {
    slug: 'software',
    titulo: 'Software',
    acento: 'Sentinel',
    subtitulo: 'Revisión de software',
    descripcion: [
      '**Software Sentinel** está enfocado en analizar aplicaciones y sistemas para identificar vulnerabilidades, problemas de seguridad y configuraciones que puedan representar riesgos reales para tu entorno digital.',
      'No se trata solo de “revisar si el software funciona”. El objetivo es detectar debilidades, fallos de configuración, prácticas inseguras y puntos de exposición que podrían ser aprovechados por amenazas o generar incidentes de seguridad.',
      'El servicio busca darte una visión clara del estado de seguridad de tus aplicaciones y sistemas, junto con recomendaciones prácticas para mejorar su protección.',
    ],
    tituloDetalle: '¿Qué revisamos?',
    detalles: [
      {
        titulo: 'Aplicaciones y sistemas',
        texto:
          'Se revisan aplicaciones instaladas, servicios activos y el entorno en el que operan para detectar debilidades y puntos de exposición.',
      },
      {
        titulo: 'Configuraciones de seguridad',
        texto:
          'Se identifican ajustes inseguros, permisos excesivos y prácticas que aumentan el riesgo de acceso no autorizado.',
      },
      {
        titulo: 'Vulnerabilidades conocidas',
        texto:
          'Se buscan fallos conocidos, software desactualizado y componentes con exposiciones documentadas.',
      },
      {
        titulo: 'Puntos de entrada y exposición',
        texto:
          'Se analizan interfaces, accesos remotos y canales que podrían ser aprovechados por amenazas.',
      },
      {
        titulo: 'Recomendaciones de mejora',
        texto:
          'Se entregan acciones prioritarias para cerrar brechas, endurecer configuraciones y mejorar la postura de seguridad.',
      },
    ],
    precio: { etiqueta: 'Precio', valor: '$120.000 COP' },
  },
  {
    slug: 'dual',
    titulo: 'Dual',
    acento: 'Guard',
    subtitulo: 'Hardware + Software',
    descripcion: [
      '**Dual Guard** combina la revisión de hardware y software en un solo servicio. En lugar de analizar cada capa por separado, este servicio integra ambas perspectivas: el estado físico de los equipos y el análisis de aplicaciones y sistemas. Así se detectan riesgos que muchas veces solo aparecen cuando hardware y software se revisan juntos.',
      'El objetivo es darte una visión global del sistema, identificar debilidades en ambas capas y entregarte recomendaciones claras para reforzar la seguridad de forma coordinada.',
    ],
    tituloDetalle: '¿Qué incluye?',
    detalles: [
      {
        titulo: 'Revisión de componentes físicos',
        texto:
          'Se inspecciona el estado del hardware: placas, memorias, discos, fuentes, puertos y conectores, buscando daños, desgaste, sobrecalentamiento o condiciones que afecten la seguridad y el funcionamiento.',
      },
      {
        titulo: 'Revisión de software y aplicaciones',
        texto:
          'Se analizan aplicaciones, sistemas y su entorno para detectar debilidades, configuraciones inseguras y puntos de exposición en la capa lógica.',
      },
      {
        titulo: 'Identificación de posibles riesgos',
        texto:
          'Se evalúan escenarios de riesgo que involucran tanto el hardware como el software, incluyendo accesos no controlados, fallos combinados y condiciones de exposición.',
      },
      {
        titulo: 'Detección de posibles vulnerabilidades',
        texto:
          'Se buscan vulnerabilidades conocidas, fallos de configuración y debilidades que puedan facilitar incidentes de seguridad en cualquiera de las dos capas.',
      },
      {
        titulo: 'Recomendaciones de seguridad',
        texto:
          'Se entregan acciones concretas y priorizadas para corregir, reforzar y mejorar la protección del sistema de forma integral.',
      },
      {
        titulo: 'Informe general de la revisión',
        texto:
          'Recibes un resumen claro del estado del hardware y del software, los hallazgos principales y las recomendaciones para mejorar la seguridad del sistema.',
      },
    ],
    precio: {
      etiqueta: 'Análisis integral',
      valor: 'Precio menor que por separado',
    },
  },
]

// Búsqueda por la parte final de la URL (/servicios/:slug)
export const buscarServicio = (slug) =>
  servicios.find((servicio) => servicio.slug === slug)
