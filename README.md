1. Contexto
El proyecto consiste en una aplicación web interactiva y de entretenimiento visual basada en un motor de física 2D en tiempo real. Está ambientada con una temática de Halloween y desarrollada utilizando tecnologías web nativas (HTML5, CSS3 y JavaScript moderno). El sistema simula un entorno cerrado donde interactúan múltiples entidades gráficas redondas que se desplazan de manera fluida, rebotan elásticamente y responden a interacciones directas del usuario mediante el cursor.

2. Objetivo
Diseñar, estructurar y programar un simulador visual en el navegador web que cumpla con los siguientes parámetros técnicos y estéticos:

Mantener de forma dinámica y permanente un número fijo de 25 objetos activos en el área de juego.

Implementar 4 patrones de movimiento aleatorio autónomo para las entidades (hacia arriba, hacia abajo, en diagonal y en trayectorias circulares/espirales), los cuales varían mediante un temporizador interno.

Simular colisiones elásticas bidimensionales entre los objetos y las paredes del contenedor, acompañadas de efectos de partículas (explosiones/chispas) al colisionar o al ser destruidos.

Proveer una interfaz de usuario limpia que separe el área gráfica del canvas de los textos informativos, incorporando un sistema de audio ambiental de fondo, cursor personalizado temático y contadores detallados de rendimiento, clics e interacciones.

3. Justificación
Rendimiento y Ligereza: Al utilizar tecnologías nativas (HTML5 Canvas y JavaScript sin librerías externas pesadas), la aplicación garantiza una tasa de refresco fluida (60 FPS) y un consumo mínimo de recursos en cualquier navegador moderno.

Experiencia de Usuario (UX/UI): La separación en tres archivos independientes (index.html, styles.css y main.js) facilita el mantenimiento del código, su escalabilidad y su integración en diferentes servidores web locales o remotos.

Atractivo Visual y Temático: La integración de recortes circulares de imágenes con soporte de respaldo vectorial (SVG), efectos de partículas dinámicas y un diseño de interfaz oscura con acentos neón permite ofrecer una experiencia inmersiva atractiva para el usuario.

4. Operación del Videojuego / Simulación
La aplicación opera de manera completamente interactiva en tiempo real mediante el siguiente flujo de funcionamiento:

Inicialización: Al cargar la página, el motor instancia el canvas, precarga la imagen de fondo, las texturas de los personajes de Halloween, el cursor personalizado y el reproductor de audio. Automáticamente genera y posiciona 25 elementos activos.

Bucle Principal (animate):

Limpia el fotograma anterior y dibuja la imagen de fondo en el canvas.

Evalúa de manera continua el contador de objetos para asegurar que, si alguno es destruido, se regenere inmediatamente un nuevo ente aleatorio manteniendo el límite estricto de 25.

Ejecuta la física de colisiones elásticas entre las entidades.

Actualiza las posiciones de los objetos según su patrón de movimiento asignado y gestiona los rebotes en los bordes.

Actualiza y renderiza las partículas de chispas en pantalla hasta desvanecerlas por completo.

Interacción del Usuario:

Clic sobre un objeto: Al hacer clic con el ratón sobre cualquiera de los entes activos, este se destruye generando una explosión de partículas, incrementa el contador de objetos eliminados y el sistema genera un reemplazo automático en otra zona del canvas.

Contadores en pantalla: El usuario puede visualizar en la barra superior el número de objetos activos, colisiones en tiempo real, clics totales realizados, objetos eliminados y los fotogramas por segundo (FPS).

Música ambiental: Cuenta con un botón flotante de control para alternar el estado de reproducción de la música de fondo (ON/OFF).
