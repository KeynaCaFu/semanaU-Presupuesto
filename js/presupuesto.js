// Semana U 2026 · datos del presupuesto
// Los totales de la página se calculan a partir de estos datos (no hay que sumar a mano).
//
// - dia: 'semana' (toda la semana / compra previa) | 'lu' | 'ma' | 'mi' | 'ju' | 'vi'
//   Es el día en que se USA la compra (la fecha de la hoja de cálculo), no el día en que se compra.
//   Todas las compras se hacen con al menos ANTICIPACION_DIAS de anticipación a ese día.
// - fecha: solo si hay que aclararla en la tabla (ej. una compra registrada el 31/10)
// - para: ids de las actividades que usan esa compra (muestra la foto de la actividad)
// - uso: en compras de 'semana', en qué días/actividades se reparte (se muestra en la tabla)
// - precio: null = pendiente de cotizar (no suma al total)

const CATEGORIAS = {
  premios: { nombre: 'Premios' },
  materiales: { nombre: 'Materiales' },
  snacks: { nombre: 'Snacks de talleres' },
  alimentacion: { nombre: 'Alimentación' },
  concierto: { nombre: 'Concierto' },
  recreacion: { nombre: 'Recreación' },
}

// Las compras se hacen al menos 2 semanas antes del día en que se usan
const ANTICIPACION_DIAS = 14

// fecha: día de uso (año, mes 1-12, día). 'semana' usa el inicio de la semana (lunes 26).
const DIAS = [
  { id: 'semana', fecha: [2026, 10, 26], corto: 'Toda la semana', titulo: 'Toda la semana', sub: 'Compras que se usan en varios días: premios, alimentación, artículos deportivos y snacks' },
  { id: 'lu', fecha: [2026, 10, 26], corto: 'Lunes 26', titulo: 'Lunes 26 de octubre', sub: 'Día 1' },
  { id: 'ma', fecha: [2026, 10, 27], corto: 'Martes 27', titulo: 'Martes 27 de octubre', sub: 'Día 2' },
  { id: 'mi', fecha: [2026, 10, 28], corto: 'Miércoles 28', titulo: 'Miércoles 28 de octubre', sub: 'Día 3' },
  { id: 'ju', fecha: [2026, 10, 29], corto: 'Jueves 29', titulo: 'Jueves 29 de octubre', sub: 'Día 4' },
  { id: 'vi', fecha: [2026, 10, 30], corto: 'Viernes 30', titulo: 'Viernes 30 de octubre', sub: 'Día 5' },
  { id: 'sa', fecha: [2026, 10, 31], corto: 'Sábado 31', titulo: 'Sábado 31 de octubre', sub: 'Día 6 · Hackaton' },
]

// foto: archivo en img/actividades (solo se muestra si la actividad tiene compras ligadas)
// pos: encuadre de la foto (object-position) · nota: aviso que se muestra en la tarjeta
const ACTIVIDADES = [
  { id: 'inaugural', dia: 'lu', titulo: 'Acto Inaugural Semana U', hora: '9:00 AM' },
  { id: 'desayuno', dia: 'lu', titulo: 'Desayuno Compartido', hora: '' },
  { id: 'totebag', dia: 'lu', titulo: 'Pintemos nuestro Totebag', hora: '2:00 PM', foto: 'totebag.jpg', pos: '50% 65%' },
  { id: 'cocina', dia: 'lu', titulo: 'Taller de Cocina Sabor U', hora: '3:30 PM' },
  { id: 'escondidas', dia: 'lu', titulo: 'Escondidas', hora: '6:00 PM · 10:00 PM', foto: 'escondidas.jpg', pos: '50% 70%' },

  { id: 'ciclistica', dia: 'ma', titulo: 'Ciclística', hora: '7:00 AM', foto: 'ciclistica.jpg' },
  { id: 'piscina', dia: 'ma', titulo: 'Piscina', hora: '9:00 AM · 3:00 PM', foto: 'piscina.jpg', pos: '50% 45%', nota: 'Requisito: gorro y traje de baño de una pieza' },
  { id: 'futbol', dia: 'ma', titulo: 'Campeonato de Fútbol', hora: '5:00 PM · 8:00 PM', foto: 'futbol.jpg' },
  { id: 'pijamada', dia: 'ma', titulo: 'Mini Pijamada', hora: '6:00 PM' },

  { id: 'cuadrangular', dia: 'mi', titulo: 'Cuadrangular Alianza Universitaria', hora: '8:00 AM · 12:00 MD · 5:00 PM', foto: 'cuadrangular.jpg' },
  { id: 'feria', dia: 'mi', titulo: 'Feria de Emprendimiento', hora: '10:00 AM · 11:00 AM · 4:00 PM', foto: 'feria.jpg' },
  { id: 'inflables', dia: 'mi', titulo: 'Inflables', hora: '1:00 PM – 5:00 PM', foto: 'inflables.jpg' },
  { id: 'maceta', dia: 'mi', titulo: 'Taller con Sonia · Arte en Maceta', hora: '2:00 PM', foto: 'plantas-invasoras.jpg', pos: '50% 55%' },
  { id: 'videojuegos', dia: 'mi', titulo: 'Torneo de Videojuegos', hora: '5:00 PM', foto: 'videojuegos.jpg' },
  { id: 'worship', dia: 'mi', titulo: 'Red Universitaria Worship Night', hora: '6:00 PM' },

  { id: 'futbolin', dia: 'ju', titulo: 'Torneo de Futbolín', hora: '9:00 AM · 12:00 PM', foto: 'futbolin.jpg' },
  { id: 'ping-pong', dia: 'ju', titulo: 'Torneo de Ping Pong', hora: '9:00 AM · 12:00 PM', foto: 'ping-pong.jpg' },
  { id: 'powerbi', dia: 'ju', titulo: 'Taller de Power BI', hora: '2:00 PM' },
  { id: 'mecanografia', dia: 'ju', titulo: 'Competencia de Mecanografía', hora: '4:00 PM', foto: 'mecanografia.jpg' },
  { id: 'fiesta', dia: 'ju', titulo: 'Fiesta de Cierre de Semana U', hora: 'Tarde y noche', foto: 'fiesta.jpg', pos: '50% 30%' },

  { id: 'fiscalia', dia: 'vi', titulo: 'Taller Fiscalía en contra del Hostigamiento Sexual', hora: '8:00 AM – 11:00 AM', foto: 'fiscalia.jpg' },
  { id: 'globos', dia: 'vi', titulo: 'Competencia de Globos', hora: '9:00 AM', foto: 'globos.jpg', pos: '50% 65%' },
  { id: 'bingo', dia: 'vi', titulo: 'Bingo', hora: '2:00 PM', foto: 'bingo.jpg', pos: '50% 40%' },
  { id: 'voley', dia: 'vi', titulo: 'Campeonato de Vóley', hora: '2:00 PM', foto: 'voley.jpg', pos: '50% 70%' },
  { id: 'fogata', dia: 'vi', titulo: 'La Fogata · Juegos Tradicionales, Noche de Talento y Comparsa', hora: '6:00 PM', foto: 'fogata.jpg' },

  { id: 'hackaton', dia: 'sa', titulo: 'Hackaton', hora: '7:00 AM – 10:00 PM', foto: 'hackaton.jpg' },
]

const COMPRAS = [
  // ---------- PREMIOS (5/10/2026) ----------
  { cat: 'premios', dia: 'semana', item: 'Sombreros', cant: 65, precio: 6071, prov: 'Imprenta Color' },
  { cat: 'premios', dia: 'semana', item: 'Sombrillas', cant: 65, precio: 4590, prov: 'Imprenta Color' },
  { cat: 'premios', dia: 'semana', item: 'Brazaletes Tyvek', cant: 200, precio: 102, prov: 'Imprenta Color' },
  { cat: 'premios', dia: 'semana', item: 'Pines troquelados', cant: 20, precio: 4590, prov: 'Imprenta Color' },
  { cat: 'premios', dia: 'semana', item: 'Pines redondos', cant: 230, precio: 765, prov: 'Imprenta Color' },
  { cat: 'premios', dia: 'semana', item: 'Libreta', cant: 65, precio: 3054.9, prov: 'Tienda Publicitaria' },
  { cat: 'premios', dia: 'semana', item: 'Mouse pad', cant: 65, precio: 1989, prov: 'Tienda Publicitaria' },
  { cat: 'premios', dia: 'semana', item: 'Tote bag', cant: 65, precio: 1479, prov: 'Tienda Publicitaria', para: ['totebag'] },
  { cat: 'premios', dia: 'semana', item: 'Camisas', cant: 15, precio: 8007, prov: 'Tienda Publicitaria' },

  // ---------- ALIMENTACIÓN ----------
  { cat: 'alimentacion', dia: 'semana', item: 'Almuerzos', cant: 102, precio: 2500, prov: 'Antojitos Eli', nota: '100 almuerzos + ₡5.000 de transporte. Una parte es para el Hackaton del sábado 31 (cantidad exacta por definir).', para: ['hackaton'] },
  { cat: 'alimentacion', dia: 'semana', item: 'Frutas', cant: 1, precio: 91375, prov: 'Cruce de Cisneros' },
  { cat: 'alimentacion', dia: 'ju', item: 'Pinchos de carne', cant: 500, precio: 1000, prov: 'Ninas', para: ['fiesta'] },

  // ---------- MATERIALES ----------
  { cat: 'materiales', dia: 'lu', item: 'Hojas blancas', cant: 20, precio: 2000, prov: 'ASO · Almacén El Rey', nota: '20 resmas' },
  { cat: 'materiales', dia: 'lu', item: 'Cajas de pintura', cant: 10, precio: 4000, prov: 'Almacén El Rey' },
  { cat: 'materiales', dia: 'lu', item: 'Cajas de lápices de color Facela', cant: 10, precio: 2950, prov: 'Almacén El Rey' },
  { cat: 'materiales', dia: 'lu', item: 'Resaltador', cant: 10, precio: 2700, prov: 'Almacén El Rey' },
  { cat: 'materiales', dia: 'lu', item: 'Cajas de lápiz de escribir Facela', cant: 10, precio: 1300, prov: 'Almacén El Rey' },
  { cat: 'materiales', dia: 'lu', item: 'Pinceles', cant: 10, precio: 3250, prov: 'Almacén El Rey' },
  { cat: 'materiales', dia: 'lu', item: 'Pintura Cantilan', cant: 20, precio: 3975, prov: 'Almacén El Rey' },
  { cat: 'materiales', dia: 'lu', item: 'Clips taza 600 unidades', cant: 2, precio: 2790, prov: 'Office · ASO' },
  { cat: 'materiales', dia: 'lu', item: 'Lienzo tela canvas', cant: 100, precio: 1200, prov: 'Almacén El Rey' },
  { cat: 'materiales', dia: 'lu', item: 'Cajas plásticas para almacenamiento', cant: 4, precio: 6500, prov: 'Almacén El Rey' },
  { cat: 'materiales', dia: 'lu', item: 'Tintas de impresora', cant: 8, precio: 6190, prov: 'GT52 · Office ASO' },
  {
    cat: 'materiales', dia: 'semana', item: 'Artículos deportivos', cant: 1, precio: 182886, prov: 'Costa Rica Mall',
    nota: 'Bolas de ping pong, vóleibol, futsala y fútbol; raquetas, net y palos para la mesa de ping pong; gorro de natación',
    para: ['piscina', 'futbol', 'ping-pong', 'voley'],
    uso: 'Torneos y piscina (martes a viernes)',
  },
  { cat: 'materiales', dia: 'lu', item: 'FRA-TELA pintura para tela', cant: 30, precio: 950, prov: 'Mis Colores, Suplementos para arte', para: ['totebag'] },
  { cat: 'materiales', dia: 'mi', item: 'Macetas · Taller con Sonia', cant: 20, precio: 975, prov: 'Almacén El Rey', para: ['maceta'] },
  { cat: 'materiales', dia: 'lu', item: 'Luces', cant: 5, precio: null, prov: '' },

  // ---------- SNACKS DE TALLERES ----------
  { cat: 'snacks', dia: 'semana', item: 'Kerns melocotón', cant: 10, precio: 818.58, prov: 'Beto y Más', uso: 'Fogata (viernes) y Hackaton (sábado)', para: ['fogata', 'hackaton'] },
  { cat: 'snacks', dia: 'semana', item: 'Pepsi', cant: 80, precio: 1084.07, prov: 'Beto y Más', uso: 'Fogata (viernes) y Hackaton (sábado)', para: ['fogata', 'hackaton'] },
  { cat: 'snacks', dia: 'semana', item: 'Tortillas', cant: 50, precio: 930, prov: 'Beto y Más', uso: 'Fogata (viernes) y Hackaton (sábado)', para: ['fogata', 'hackaton'] },
  { cat: 'snacks', dia: 'semana', item: 'Vasos descartables', cant: 10, precio: 720, prov: 'Maxi Palí', uso: 'Fogata (viernes) y Hackaton (sábado)', para: ['fogata', 'hackaton'] },
  { cat: 'snacks', dia: 'ma', item: 'Confites', cant: 2, precio: 3480, prov: 'Maxi Palí' },
  { cat: 'snacks', dia: 'ma', item: 'Hidratante en polvo', cant: 6, precio: 4950, prov: 'Maxi Palí', para: ['ciclistica'] },
  { cat: 'snacks', dia: 'vi', item: 'Bolsa de confites', cant: 2, precio: 7000, prov: 'Almacenes El Rey' },
  { cat: 'snacks', dia: 'vi', item: 'Piñatas', cant: 2, precio: 500, prov: 'Almacenes El Rey' },
  { cat: 'snacks', dia: 'vi', item: 'Pinchos', cant: 3, precio: 450, prov: 'Almacenes El Rey' },
  { cat: 'snacks', dia: 'vi', item: 'Kerns 3 litros', cant: 6, precio: 850, prov: 'Maxi Palí' },
  { cat: 'snacks', dia: 'vi', item: 'Galleta mantequilla', cant: 4, precio: 2000, prov: 'Maxi Palí' },
  { cat: 'snacks', dia: 'vi', item: 'Paquetes de snack salado', cant: 4, precio: 2040, prov: 'Maxi Palí' },
  { cat: 'snacks', dia: 'vi', item: 'Malvaviscos', cant: 10, precio: 2560, prov: 'Maxi Palí', para: ['fogata'] },
  { cat: 'snacks', dia: 'sa', item: 'Pepsi 3 litros', cant: 18, precio: 1500, prov: 'Maxi Palí', para: ['hackaton'] },
  { cat: 'snacks', dia: 'sa', item: 'Galleta cremas', cant: 4, precio: 2000, prov: 'Maxi Palí', para: ['hackaton'] },
  { cat: 'snacks', dia: 'sa', item: 'Galleta bokitas', cant: 4, precio: 2010, prov: 'Maxi Palí', para: ['hackaton'] },
  { cat: 'snacks', dia: 'sa', item: 'Café', cant: 1, precio: 7350, prov: 'Maxi Palí', para: ['hackaton'] },

  // ---------- RECREACIÓN ----------
  {
    cat: 'recreacion', dia: 'mi', item: 'Magical Kingdom', cant: 1, precio: 699720, prov: 'Magical Kingdom',
    nota: 'Gladiadores, bolas, futbolín y caballitos. Está concursando por proveeduría; aún no se sabe si sale por CC.',
    para: ['inflables'],
  },

  // ---------- CONCIERTO ----------
  {
    cat: 'concierto', dia: 'ju', item: 'Concierto', cant: 1, precio: 1400000, prov: 'Gimario + Proveedor Fran',
    nota: 'Gimario: ₡1.020.000', para: ['fiesta'],
  },
]
