# Semana U 2026 · Presupuesto en HTML

Presentación del presupuesto de Semana U 2026 por día (HTML + CSS + JS puro).
Solo abrí `index.html` en el navegador. `copia.html` es la versión anterior (cronograma).

```
index.html          Estructura de la página
css/styles.css      Todos los estilos (colores en :root)
js/presupuesto.js   DATOS: días, actividades y compras (editá aquí)
js/main.js          Arma resumen, paneles por día y tablas a partir de los datos
img/                Logo, Sarú, hojas decorativas
img/actividades/    Fotos de las actividades
```

- **Totales:** se calculan solos a partir de `js/presupuesto.js`; no hay que sumar a mano.
- **Agregar/corregir una compra:** editá su línea en `COMPRAS` (`dia`, `cant`, `precio`, `prov`).
  Con `precio: null` aparece en "Pendientes de cotizar" y no suma.
- **Día vs. fecha de compra:** `dia` es el día en que se *usa* la compra. La página muestra en cada día
  la fecha límite para comprar (`ANTICIPACION_DIAS` = 14, o sea 2 semanas antes).
- **Ligar una compra a una actividad:** agregá el id de la actividad en `para`. Las actividades
  con compras ligadas se muestran con foto; las demás solo se mencionan.
- **Imprimir / PDF:** Ctrl+P desde el navegador (hay estilos de impresión).
