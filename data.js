/* ---------------------------------------------------------------------------
   GUPET: datos del sitio
   Un solo lugar para el catálogo, las categorías, el blog y las preguntas
   frecuentes. Las páginas se arman desde aquí, así que un cambio de precio
   o un producto nuevo se toca una sola vez y aparece en todo el sitio.

   Precios, marcas y presentaciones: tomados del sitio actual gupet.co.
--------------------------------------------------------------------------- */

var SITE = {
  nombre: 'GUPET',
  claim: 'Todo para tu mascota, bien elegido',
  whatsapp: '573157454408',
  whatsappVisible: '315 745 4408',
  envioGratisDesde: 150000,
  cupones: {
    'GUPET10': { pct: 10, texto: '10% off en tu pedido' },
    'PRIMERA': { pct: 5, texto: '5% off primera compra' }
  }
};

var CATEGORIAS = [
  { id: 'guau',      nombre: 'Guau',       subtitulo: 'Perros',            desc: 'Alimento, higiene, camas y juguetes',  img: 'img/cat-guau.jpg' },
  { id: 'miau',      nombre: 'Miau',       subtitulo: 'Gatos',             desc: 'Alimento, arena, snacks y juguetes',   img: 'img/cat-miau.jpg' },
  { id: 'petlovers', nombre: 'Pet Lovers', subtitulo: 'Accesorios',        desc: 'Ropa, regalos y accesorios',           img: 'img/cat-petlovers.jpg' },
  { id: 'servicios', nombre: 'Servicios',  subtitulo: 'Cuidado extra',     desc: 'Asesoría y acompañamiento',            img: 'img/cat-servicios.jpg' }
];

/* Cada producto tiene variantes reales: el precio cambia con la presentación. */
var PRODUCTOS = [
  {
    id: 'agility-gold-pequenos-adultos',
    nombre: 'Pequeños Adultos',
    marca: 'Agility Gold',
    cat: 'guau',
    tipo: 'Alimento seco',
    img: 'img/prod-agility.jpg',
    rating: 4.6,
    resenas: 38,
    stock: true,
    tags: ['perro adulto', 'raza pequeña'],
    resumen: 'Alimento seco para perros adultos de raza pequeña, con croqueta reducida para que muerdan sin esfuerzo.',
    detalle: 'Fórmula de mantenimiento para perros adultos de razas pequeñas. Croqueta de tamaño reducido, pensada para mandíbulas chicas, con un balance de proteína y grasa para perros con actividad normal en casa.',
    bullets: [
      'Croqueta pequeña, fácil de masticar',
      'Para perros adultos de raza pequeña',
      'Presentación chica para probar y grande para ahorrar por kilo'
    ],
    variantes: [
      { label: 'Chica',  unidad: 'Presentación chica',  precio: 38299 },
      { label: 'Grande', unidad: 'Presentación grande', precio: 159731 }
    ]
  },
  {
    id: 'hills-urinary-care-cd',
    nombre: 'Urinary Care C/D Multicare',
    marca: "Hill's Prescription Diet",
    cat: 'guau',
    tipo: 'Alimento veterinario',
    img: 'img/prod-hills.jpg',
    rating: 4.8,
    resenas: 21,
    stock: true,
    oferta: true,
    tags: ['dieta veterinaria', 'urinario'],
    resumen: 'Dieta veterinaria para el cuidado del tracto urinario. Se recomienda usarla con indicación de tu veterinario.',
    detalle: 'Línea Prescription Diet formulada para el manejo nutricional del tracto urinario. Es un alimento de uso veterinario: antes de cambiar la dieta de tu mascota, consúltalo con tu veterinario de confianza.',
    bullets: [
      'Formulación para el cuidado urinario',
      'Uso bajo recomendación veterinaria',
      'Presentación única'
    ],
    variantes: [
      { label: 'Única', unidad: 'Presentación única', precio: 113710, precioAntes: 123600 }
    ]
  },
  {
    id: 'nd-prime-feline-frango',
    nombre: 'Prime Feline Frango Castrado',
    marca: 'Farmina N&D',
    cat: 'miau',
    tipo: 'Alimento seco',
    img: 'img/prod-nd.jpg',
    rating: 4.7,
    resenas: 46,
    stock: true,
    tags: ['gato castrado', 'alta proteína'],
    resumen: 'Alimento de alta proteína animal para gatos castrados, con bajo aporte de cereales.',
    detalle: 'Línea Prime de Farmina N&D: alta proporción de proteína de origen animal y baja carga de cereales, en una fórmula pensada para gatos castrados, que tienden a ganar peso con facilidad.',
    bullets: [
      'Alta proteína de origen animal',
      'Pensado para gatos castrados',
      'Dos presentaciones: chica y grande'
    ],
    variantes: [
      { label: 'Chica',  unidad: 'Presentación chica',  precio: 127553 },
      { label: 'Grande', unidad: 'Presentación grande', precio: 437344 }
    ]
  },
  {
    id: 'churu-tuna-seafood-variety',
    nombre: 'Tuna Seafood Variety',
    marca: 'Churu',
    cat: 'miau',
    tipo: 'Snack cremoso',
    img: 'img/prod-churu.jpg',
    rating: 4.9,
    resenas: 112,
    stock: true,
    oferta: true,
    destacado: true,
    tags: ['snack', 'premio', 'atún'],
    resumen: 'El snack cremoso en tubo que casi ningún gato rechaza. Caja de 20, 40 o 60 tubos.',
    detalle: 'Snack cremoso en tubo, variedad de atún y mariscos. Sirve como premio, para dar medicina mezclada o simplemente para el momento de mimo. Se puede dar directo del tubo, sobre el plato o mezclado con el alimento.',
    bullets: [
      'Tres tamaños de caja: 20, 40 y 60 tubos',
      'Ideal como premio o para dar medicamento',
      'El precio cambia según la caja que elijas'
    ],
    variantes: [
      { label: 'x20', unidad: 'Caja x 20 tubos', precio: 60187,  precioAntes: 62594 },
      { label: 'x40', unidad: 'Caja x 40 tubos', precio: 117062, precioAntes: 121745 },
      { label: 'x60', unidad: 'Caja x 60 tubos', precio: 160125, precioAntes: 166530 }
    ]
  },
  {
    id: 'clauders-adult-grain-free',
    nombre: 'Adult Grain Free',
    marca: "Dr. Clauder's",
    cat: 'miau',
    tipo: 'Alimento seco',
    img: 'img/prod-clauders.jpg',
    rating: 4.5,
    resenas: 19,
    stock: true,
    tags: ['sin cereales', 'gato adulto'],
    resumen: 'Alimento sin cereales para gatos adultos, una opción cuando buscas una fórmula más simple.',
    detalle: 'Fórmula libre de cereales para gatos adultos. Suele ser la elección de quienes quieren una lista de ingredientes más corta o han notado molestias digestivas con alimentos con cereal.',
    bullets: [
      'Fórmula sin cereales',
      'Para gatos adultos',
      'Presentación chica y grande'
    ],
    variantes: [
      { label: 'Chica',  unidad: 'Presentación chica',  precio: 79095 },
      { label: 'Grande', unidad: 'Presentación grande', precio: 455382 }
    ]
  },
  {
    id: 'nutra-nuggets-maintenance-gato',
    nombre: 'Maintenance para Gato',
    marca: 'Nutra Nuggets',
    cat: 'miau',
    tipo: 'Alimento seco',
    img: 'img/prod-nutranuggets.jpg',
    rating: 4.3,
    resenas: 27,
    stock: true,
    tags: ['económico', 'gato adulto'],
    resumen: 'Alimento de mantenimiento para gatos adultos: la opción más económica del catálogo.',
    detalle: 'Alimento de mantenimiento diario para gatos adultos sin requerimientos especiales. Es la entrada más accesible del catálogo y funciona bien en casas con varios gatos.',
    bullets: [
      'La opción más económica del catálogo',
      'Mantenimiento diario para gato adulto',
      'Rinde en casas con varios gatos'
    ],
    variantes: [
      { label: 'Chica',  unidad: 'Presentación chica',  precio: 24900 },
      { label: 'Grande', unidad: 'Presentación grande', precio: 172000 }
    ]
  }
];

/* Marcas que aparecen en el sitio actual. Las que no tienen producto cargado
   en esta demo se muestran igual, para que el cliente vea el alcance real. */
var MARCAS = [
  'Royal Canin', 'Farmina N&D', 'Churu', "Hill's", 'Agility Gold',
  "Dr. Clauder's", 'Nutra Nuggets', 'Monge', 'Orijen', 'Nupec', 'Evolve'
];

var RESENAS = [
  { nombre: 'Laura M.', mascota: 'con Mora, gata de 4 años', texto: 'Pedí los Churu de 40 y llegaron al día siguiente. Mora los reconoce desde que abro la bolsa.', estrellas: 5 },
  { nombre: 'Andrés P.', mascota: 'con Tomás, criollo de 7 años', texto: 'Me ayudaron a elegir la presentación correcta por el tamaño de Tomás en vez de venderme la bolsa más grande.', estrellas: 5 },
  { nombre: 'Daniela R.', mascota: 'con Nube y Pipo, gatos', texto: 'El precio que veo en la página es el que pago. Suena básico, pero en otras tiendas no me pasaba.', estrellas: 4 }
];

var FAQS = [
  {
    q: '¿Cómo elijo la presentación correcta?',
    a: 'En cada producto verás los tamaños disponibles y el precio de cada uno se actualiza al seleccionarlo. Si tienes dudas entre una y otra, escríbenos por WhatsApp con la edad, el tamaño y el peso de tu mascota y te decimos cuál rinde mejor.'
  },
  {
    q: '¿Puedo pagar en línea?',
    a: 'Sí. Agregas al carrito, completas tus datos en el checkout y confirmas. En esta demo el pago está simulado: no se cobra nada ni se guarda información en ningún servidor.'
  },
  {
    q: '¿Hacen envíos a todo el país?',
    a: 'El detalle de cobertura y tiempos está en la página de Envíos. Los datos de esa página son un ejemplo de estructura: al pasar la demo a producción se reemplazan por las zonas y tarifas reales de GUPET.'
  },
  {
    q: '¿Qué pasa si a mi mascota no le gusta el alimento?',
    a: 'Escríbenos antes de seguir insistiendo con la bolsa. Un cambio de alimento se hace gradual, mezclando el nuevo con el anterior durante unos días; muchas veces el rechazo es por el cambio brusco y no por el producto.'
  },
  {
    q: '¿Manejan dietas veterinarias?',
    a: 'Sí, trabajamos líneas como Hill\'s Prescription Diet. Son alimentos de uso veterinario: pídele la indicación a tu veterinario antes de comprarlos.'
  },
  {
    q: '¿Tienen una marca que no veo en el catálogo?',
    a: 'Probablemente sí. Esta demo muestra una selección; el catálogo completo incluye Royal Canin, Monge, Orijen, Nupec y Evolve, entre otras. Pregúntanos por la línea que necesitas y te confirmamos disponibilidad.'
  }
];

var POSTS = [
  {
    id: 'cambiar-alimento-sin-problemas',
    titulo: 'Cómo cambiar el alimento de tu mascota sin que le caiga mal',
    fecha: '2026-09-02',
    fechaTexto: '2 de septiembre, 2026',
    cat: 'Alimentación',
    img: 'img/cat-guau.jpg',
    resumen: 'El error más común no es elegir mal la marca: es cambiarla de un día para otro.',
    cuerpo: [
      'Un cambio de alimento de golpe es la causa más frecuente de diarrea y de "no le gustó" en perros y gatos. El sistema digestivo necesita unos días para adaptarse a una fórmula nueva, y ese periodo se puede manejar.',
      'La regla práctica es repartir el cambio en siete días: los dos primeros, 25% de alimento nuevo y 75% del anterior. Los días tres y cuatro, mitad y mitad. Los días cinco y seis, 75% nuevo. El séptimo día, 100% del alimento nuevo.',
      'Durante esa semana vale la pena mirar dos cosas: la consistencia de las heces y las ganas de comer. Si notas heces muy blandas más de dos días seguidos, retrocede un paso en la proporción y quédate ahí un par de días más antes de seguir avanzando.',
      'En gatos hay un detalle extra: son más sensibles a la textura y al olor que al sabor. Si tu gato rechaza el plato, prueba servirlo a temperatura ambiente y no recién sacado de un lugar frío, y evita cambiar el plato o el sitio al mismo tiempo que cambias el alimento.'
    ]
  },
  {
    id: 'cuanto-alimento-darle',
    titulo: '¿Cuánto alimento le doy? Guía rápida por peso y edad',
    fecha: '2026-08-18',
    fechaTexto: '18 de agosto, 2026',
    cat: 'Alimentación',
    img: 'img/cat-miau.jpg',
    resumen: 'La tabla del empaque es un punto de partida, no una sentencia. Cómo ajustarla a tu mascota real.',
    cuerpo: [
      'Toda bolsa trae una tabla de ración diaria según el peso. Esa tabla asume una mascota de actividad promedio, sin castrar y en peso ideal: tres supuestos que muchas veces no se cumplen.',
      'Si tu mascota está castrada, su gasto de energía baja de forma notoria. En la práctica suele necesitar entre 10% y 20% menos de lo que indica la tabla para el mismo peso.',
      'Si pasa la mayor parte del día dentro de casa y sale poco, aplica un ajuste parecido. Si en cambio es un perro joven que camina una hora diaria, la tabla se queda corta.',
      'El mejor indicador no es el número: es tocar las costillas. Deberías sentirlas con una presión suave, sin tener que hundir los dedos, y ver una cintura marcada al mirar desde arriba. Ajusta la ración un 10% cada dos semanas hasta llegar ahí.',
      'Y algo que se pasa por alto: los premios cuentan. Si das snacks a diario, deben representar como máximo el 10% de las calorías del día, y la ración de alimento debería bajar en la misma proporción.'
    ]
  },
  {
    id: 'senales-de-que-tu-gato-no-toma-agua',
    titulo: 'Cinco señales de que tu gato no está tomando suficiente agua',
    fecha: '2026-07-29',
    fechaTexto: '29 de julio, 2026',
    cat: 'Cuidado',
    img: 'img/cat-petlovers.jpg',
    resumen: 'Los gatos beben poco por naturaleza. Cuando además comen solo alimento seco, vale la pena estar atento.',
    cuerpo: [
      'El gato doméstico desciende de un animal de zonas áridas y conserva un impulso de sed bastante bajo. Cuando su dieta es únicamente alimento seco, la única fuente de agua es el bebedero, y muchos gatos no van lo suficiente.',
      'Señales a las que vale la pena prestar atención: orina muy concentrada y de olor fuerte, visitas menos frecuentes a la caja de arena, piel que tarda en volver a su sitio al levantarla suavemente sobre los hombros, letargo poco habitual y encías que se sienten pegajosas al tacto.',
      'Lo que sí funciona para que tomen más: varios bebederos en distintos puntos de la casa, lejos del plato de comida y de la caja de arena; recipientes anchos, porque a muchos gatos les molesta que los bigotes toquen los bordes; y agua fresca cambiada a diario.',
      'Las fuentes de agua en movimiento funcionan muy bien en gatos que no beben del plato. También ayuda incorporar algo de alimento húmedo o snacks cremosos, que aportan humedad además de calorías.',
      'Si notas que tu gato hace esfuerzo al orinar, orina fuera de la caja o va muchas veces sin resultado, eso no es cuestión de hidratación: es una urgencia veterinaria, sobre todo en machos.'
    ]
  }
];
