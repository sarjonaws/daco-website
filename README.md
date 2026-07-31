# Daco Technologies — sitio web

Sitio estático de una página, implementado a partir del diseño
**"Daco Technologies - Website v3 Dark"** del proyecto de Claude Design
*Identidad visual Daco Technologies*.

Sin dependencias, sin build: HTML, CSS y un archivo JS.

## Estructura

```
index.html                 Marcado semántico de todas las secciones
assets/css/styles.css      Tokens de diseño + estilos (tema oscuro)
assets/js/main.js          Reveal al hacer scroll + efecto "agua" del cursor
assets/img/isotipo.svg     Isotipo (favicon)
.claude/launch.json        Config del servidor local para el panel Browser
```

## Ejecutar en local

Cualquier servidor estático sirve. Por ejemplo:

```bash
python -m http.server 4173
```

Luego abre http://localhost:4173.

## Secciones

Navegación · Hero · Clientes · Servicios · Proceso · El isotipo (Nosotros) ·
Testimonio · CTA de contacto · Pie de página.

## Notas de implementación

- **Tokens.** Todos los colores del diseño se conservan en `oklch()` y viven
  como custom properties en `:root` (`--bg`, `--accent`, `--surface`, …).
- **Isotipo.** Un solo componente `.isotype` parametrizado por instancia con
  `--iso-size`, `--iso-ring`, `--iso-radius` y `--iso-overlap`, para las tres
  escalas del diseño (navegación, hero, sección del isotipo).
- **Estados.** Los `style-hover` / `style-active` del archivo de diseño se
  tradujeron a reglas `:hover` / `:active` reales.
- **Reveal.** La animación de entrada usa `IntersectionObserver` con el mismo
  escalonado del diseño (`(i % 4) * 60ms`). Al terminar se retira la animación
  para no bloquear el `transform` de los estados `:hover`.
- **Efecto agua.** El halo que sigue al cursor y las ondas concéntricas solo se
  activan con puntero de precisión (`pointer: fine`); el `requestAnimationFrame`
  se pausa cuando la pestaña queda oculta.
- **Accesibilidad.** Enlace de salto al contenido, `:focus-visible` visible,
  landmarks (`header` / `main` / `footer`), secciones etiquetadas y soporte
  completo de `prefers-reduced-motion`. Sin JS el contenido sigue visible.

## Decisiones tomadas sobre el diseño

- El diseño usa `div` no interactivos para navegación y botones; aquí son
  enlaces reales: **Hablemos** y **Agenda una llamada** apuntan a `#contacto`,
  y el botón del CTA es un `mailto:hola@dacotech.mx`.
- **Ver nuestro trabajo** apunta a `#servicios`. La versión oscura del diseño
  no incluye la sección "Trabajo reciente" (sí existe en
  `Website v3.dc.html`, y sus datos siguen definidos en la versión oscura),
  así que no se implementó. Si la quieres de vuelta, el contenido de los cuatro
  casos está en el archivo de diseño.
