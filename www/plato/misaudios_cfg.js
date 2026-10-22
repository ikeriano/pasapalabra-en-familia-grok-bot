// Pasapalabra (plató 3D): momentos del presentador por tipo de frase + «cualquier frase» de cada personaje
(function () {
  var H = [
    ['bienvenida', '«¡Buenas tardes y bienvenidos a Pasapalabra!»', /bienvenidos a Pasapalabra/],
    ['presenta', 'Presentación de concursantes e invitados', /^(Esta tarde, en el equipo|La acompañan|…y el|En el equipo|Le acompañan)/],
    ['silla', '«Empezamos con La silla azul…»', /La silla azul\. Cada|hoy no hay silla azul/],
    ['una4', '«Vamos con Una de cuatro…»', /Una de cuatro\. Pregunta/],
    ['pista', '«La Pista Musical…»', /Pista Musical/i],
    ['sopa', '«Llega la Sopa de letras…»', /Sopa de letras:/],
    ['cruzadas', '«Llegan las Palabras cruzadas…»', /Palabras cruzadas:/],
    ['donde', '«Y ahora, ¿Dónde están?…»', /Dónde están\? Memoriz/],
    ['rosco', '«Bajamos las luces… ¡es la hora de El rosco!»', /Bajamos las luces/],
    ['alaz', '«Ciento diez segundos más los ganados…» (AlaZ)', /^Ciento diez segundos|de la A a la Z o de la Z/],
    ['turno', '«Lucía/Tomás, tu turno.»', /tu turno|^Seguimos con|^Te toca/],
    ['acierto', '«¡Sí! / ¡Muy bien! / ¡Correcto!»', /^(¡Sí!|¡Muy bien!|¡Correcto!|Eso es\.)$/],
    ['fallo', '«No. / Lo siento, no.»', /^(No\.|Lo siento, no\.|No es correcto\.)$/],
    ['tiempo', '«¡Se acabó el tiempo!»', /Se acabó el tiempo/],
    ['bote', '«¡Veinticinco aciertos! ¡Se lleva el bote!»', /Se lleva el bote/],
    ['gana', '«¡… gana el programa!»', /gana el programa/],
    ['empate', '«Empate total…»', /^Empate total/],
    ['despedida', '«Esto ha sido todo por hoy…»', /Esto ha sido todo por hoy/],
    ['otra', 'Cualquier otra frase del presentador', /./]
  ];
  var OTROS = [['A', '🔵 Lucía (concursante azul)'], ['B', '🟠 Tomás (concursante naranja)'], ['C1', '🔵 Nerea (invitada)'], ['C2', '🔵 Paco (invitado)'], ['C3', '🟠 Marga (invitada)'], ['C4', '🟠 Dani (invitado)'], ['R', '📋 Regidora Pili'], ['V', '📢 Voz en off']];
  window.MIS_AUDIOS_CFG = {
    juego: 'pasapalabra', titulo: 'Pasapalabra',
    personajes: [{ id: 'H', nombre: '🎙️ Presentador', momentos: H.map(function (x) { return [x[0], x[1]]; }) }].concat(OTROS.map(function (o) { return { id: o[0], nombre: o[1], momentos: [['habla', 'Cualquier frase de ' + o[1].replace(/^\S+\s/, '')]] }; })),
    // botón en la pantalla de inicio del plató (antes de empezar)
    anclar: function () { return document.querySelector('.start'); },
    estiloBoton: 'display:block;margin:4vh auto 0;padding:10px 18px;border-radius:999px;border:2px solid #ffb02e;background:#0b2fa8;color:#fff;font:800 16px system-ui;cursor:pointer',
    mapa: function (s, t) { if (s !== 'H') return 'habla'; t = String(t || '').trim(); for (var i = 0; i < H.length; i++) if (H[i][2].test(t)) return H[i][0]; return 'otra'; },
    texto: [], sfx: []
  };
})();
