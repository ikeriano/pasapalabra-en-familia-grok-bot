/* Normas sorpresa · catálogo de Pasapalabra (50 normas en 8 categorías).
   req: rasgos que el modo tiene que ofrecer (a|b = vale cualquiera). Cada modo declara sus rasgos en NS.empieza(). */
NS.catalogo({
  juego: 'Pasapalabra', presentador: 'Álvaro Cienfuegos', min: 10, max: 10,
  intro: '¡Atención, que hoy hay normas sorpresa en Pasapalabra! Estas son las normas de esta partida.',
  outro: '¡Ya lo sabes todo! ¡Mucha suerte y a por el rosco!',
  cats: [
    { id: 'reloj', n: 'Reloj', ico: '⏱️' }, { id: 'premio', n: 'Segundos y premios', ico: '💰' }, { id: 'ayuda', n: 'Comodines', ico: '🛟' },
    { id: 'giro', n: 'Giros del rosco', ico: '🔀' }, { id: 'pistas', n: 'Pistas', ico: '🔤' }, { id: 'pruebas', n: 'Pruebas', ico: '🧩' },
    { id: 'fiesta', n: 'Fiesta', ico: '🎉' }, { id: 'voz', n: 'Presentador', ico: '🎤' }],
  reglas: [
    // ⏱️ Reloj
    { id: 'r_doble', c: 'reloj', n: 'Reloj doble', d: 'Todos los relojes duran el doble.', req: ['reloj'], fx: { tiempo: 2 } },
    { id: 'r_generoso', c: 'reloj', n: 'Reloj generoso', d: 'Los relojes duran la mitad más.', req: ['reloj'], fx: { tiempo: 1.5 } },
    { id: 'r_tranqui', c: 'reloj', n: 'Reloj tranquilo', d: 'Los relojes duran un poquito más.', req: ['reloj'], fx: { tiempo: 1.25 } },
    { id: 'r_prisa', c: 'reloj', n: 'Reloj con prisa', d: 'Los relojes van más justos: tres cuartos del tiempo.', req: ['reloj'], fx: { tiempo: 0.75 } },
    { id: 'r_rayo', c: 'reloj', n: 'Reloj relámpago', d: '¡Reto! Los relojes duran la mitad.', req: ['reloj'], fx: { tiempo: 0.5 } },
    { id: 'r_prorroga', c: 'reloj', n: 'Prórroga', d: 'Cuando el reloj llega a cero, te regala diez segundos más una vez.', req: ['prorroga'], fx: { prorroga: 10 } },
    { id: 'r_final20', c: 'reloj', n: 'Regalo de veinte segundos', d: 'Empiezas la final con veinte segundos de regalo.', req: ['final'], fx: { finalMas: 20 } },
    { id: 'r_suerte', c: 'reloj', n: 'Segundos de la suerte', d: 'Antes de la final, una ruleta te regala entre cinco y veinticinco segundos.', req: ['final'], fx: { suerte: true } },
    // 💰 Segundos y premios
    { id: 'p_doble', c: 'premio', n: 'Segundos dobles', d: 'Cada prueba da el doble de segundos para la final.', req: ['segundos'], fx: { premio: 2 } },
    { id: 'p_triple', c: 'premio', n: 'Segundos triples', d: 'Cada prueba da el triple de segundos para la final.', req: ['segundos'], fx: { premio: 3 } },
    { id: 'p_medio', c: 'premio', n: 'Segundos a mitad', d: '¡Reto! Las pruebas dan la mitad de segundos.', req: ['segundos'], fx: { premio: 0.5 } },
    { id: 'p_oro', c: 'premio', n: 'Pregunta de oro', d: 'Una pregunta de cada prueba brilla en dorado: si la aciertas, ganas diez segundos más.', req: ['oro'], fx: { oro: true, oroMas: 10 } },
    { id: 'p_racha', c: 'premio', n: 'Racha de fuego', d: 'Cada tres aciertos seguidos, cinco segundos de premio.', req: ['bonus'], fx: { racha: 5 } },
    { id: 'p_arranque', c: 'premio', n: 'Arranque dulce', d: 'Tu primer acierto vale cinco segundos extra.', req: ['bonus'], fx: { primer: 5 } },
    { id: 'p_multa', c: 'premio', n: 'Fallo con multa', d: 'Cada fallo resta tres segundos. ¡Piénsalo bien!', req: ['bonus'], fx: { multa: 3 } },
    // 🛟 Comodines
    { id: 'a_escudo', c: 'ayuda', n: 'Escudo', d: 'Tu primer fallo no cuenta.', req: ['escudo'], fx: { escudo: 1 } },
    { id: 'a_escudo2', c: 'ayuda', n: 'Doble escudo', d: 'Tus dos primeros fallos no cuentan.', req: ['escudo'], fx: { escudo: 2 } },
    { id: 'a_publico', c: 'ayuda', n: 'Comodín del público', d: 'Una vez por partida, el público te ayuda con la respuesta.', req: ['publico'], fx: { publico: true } },
    { id: 'a_5050', c: 'ayuda', n: 'Cincuenta cincuenta', d: 'Una vez por partida, quitas dos respuestas incorrectas.', req: ['c5050'], fx: { c5050: true } },
    { id: 'a_segunda', c: 'ayuda', n: 'Segunda oportunidad', d: 'Una vez por partida, si fallas, puedes volver a intentarlo.', req: ['segunda'], fx: { segunda: true } },
    { id: 'a_tiempo', c: 'ayuda', n: 'Comodín del tiempo', d: 'Una vez por partida, pulsa el botón y suma quince segundos al reloj.', req: ['ctiempo'], fx: { ctiempo: 15 } },
    // 🔀 Giros del rosco
    { id: 'g_reves', c: 'giro', n: 'Rosco al revés', d: 'El rosco va de la Z a la A.', req: ['reves'], fx: { reves: true } },
    { id: 'g_m', c: 'giro', n: 'Empieza por la M', d: 'El rosco empieza por la letra M.', req: ['empiezaM'], fx: { empiezaM: true } },
    { id: 'g_salteado', c: 'giro', n: 'Letras salteadas', d: 'Las letras del rosco salen en un orden sorpresa.', req: ['salteado'], fx: { salteado: true } },
    { id: 'g_pasa', c: 'giro', n: 'Pasapalabra con premio', d: 'Decir pasapalabra suma un segundo, hasta cinco veces.', req: ['pasar'], fx: { pasaMas: 1 } },
    { id: 'g_letraBarata', c: 'giro', n: 'Letra barata', d: 'En A la Z, pedir letra solo cuesta dos segundos.', req: ['letra'], fx: { letraCoste: 2 } },
    { id: 'g_letraGratis', c: 'giro', n: 'Tres letras gratis', d: 'En A la Z, las tres primeras letras que pidas son gratis.', req: ['letra'], fx: { letrasGratis: 3 } },
    { id: 'g_vocales', c: 'giro', n: 'Vocales de oro', d: 'Acertar en la A, la E, la I, la O o la U suma tres segundos.', req: ['vocales'], fx: { vocales: 3 } },
    // 🔤 Pistas
    { id: 't_longitud', c: 'pistas', n: '¿Cuántas letras?', d: 'Verás cuántas letras tiene cada respuesta.', req: ['pistas'], fx: { longitud: true } },
    { id: 't_ultima', c: 'pistas', n: 'La última letra', d: 'Verás la última letra de cada respuesta.', req: ['pistas'], fx: { ultima: true } },
    { id: 't_regalo', c: 'pistas', n: 'Letra regalo', d: 'Verás una letra escondida de cada respuesta.', req: ['pistas'], fx: { regalo: true } },
    { id: 't_tolerante', c: 'pistas', n: 'Respuesta cariñosa', d: 'Si te equivocas en una sola letra, la respuesta vale.', req: ['tolerante'], fx: { tolerante: true } },
    // 🧩 Pruebas
    { id: 'b_memoria', c: 'pruebas', n: 'Memoria de elefante', d: 'En dónde están, el panel se ve el doble de tiempo.', req: ['memoria'], fx: { memoria: 2 } },
    { id: 'b_vistazo', c: 'pruebas', n: 'Vistazo rápido', d: '¡Reto! En dónde están, el panel se tapa antes.', req: ['memoria'], fx: { memoria: 0.6 } },
    { id: 'b_linterna', c: 'pruebas', n: 'Sopa con linterna', d: 'En la sopa de letras, la primera letra de cada palabra brilla.', req: ['sopa'], fx: { sopaLuz: true } },
    { id: 'b_panel', c: 'pruebas', n: 'Panel premiado', d: 'En la sopa de letras, cada panel completo da tres segundos más.', req: ['sopa'], fx: { panelMas: 3 } },
    { id: 'b_silla', c: 'pruebas', n: 'Silla con tres vidas', d: 'En la silla azul, te eliminan al tercer fallo en vez de al segundo.', req: ['silla'], fx: { vidaSilla: 1 } },
    { id: 'b_pista', c: 'pruebas', n: 'Pista musical generosa', d: 'En la pista musical, cada canción acertada da dos segundos más.', req: ['pistamus'], fx: { pistaMas: 2 } },
    // 🎉 Fiesta
    { id: 'f_confeti', c: 'fiesta', n: 'Lluvia de confeti', d: 'Cada acierto se celebra con confeti.', req: [], fx: { fiesta: 'confeti' } },
    { id: 'f_aplausos', c: 'fiesta', n: 'Público entregado', d: 'El público aplaude cada acierto.', req: [], fx: { fiesta: 'aplausos' } },
    { id: 'f_emojis', c: 'fiesta', n: 'Emojis voladores', d: 'Cada acierto hace volar emojis por la pantalla.', req: [], fx: { fiesta: 'emojis' } },
    { id: 'f_fanfarria', c: 'fiesta', n: 'Fanfarria', d: 'Suena una fanfarria con cada acierto.', req: [], fx: { fiesta: 'fanfarria' } },
    { id: 'f_globos', c: 'fiesta', n: 'Globos', d: 'Suben globos con cada acierto.', req: [], fx: { fiesta: 'globos' } },
    { id: 'f_estrellas', c: 'fiesta', n: 'Cazador de estrellas', d: 'Cada acierto te da una estrella. Al final verás cuántas has juntado.', req: [], fx: { fiesta: 'estrellas', estrellas: true } },
    { id: 'f_animo', c: 'fiesta', n: 'Mensajes de ánimo', d: 'Si fallas, aparece un mensaje bonito para animarte.', req: [], fx: { fiesta: 'animo' } },
    { id: 'f_arcoiris', c: 'fiesta', n: 'Marco arcoíris', d: 'La pantalla se pone un marco de colores del arcoíris.', req: [], fx: { fiesta: 'arcoiris' } },
    // 🎤 Presentador
    { id: 'v_bien', c: 'voz', n: 'Presentador animado', d: 'Te felicito en voz alta cuando aciertas.', req: ['callado'], fx: { vozBien: true } },
    { id: 'v_animo', c: 'voz', n: 'Presentador que anima', d: 'Te animo en voz alta cuando fallas.', req: ['callado'], fx: { vozAnimo: true } },
    { id: 'v_todo', c: 'voz', n: 'Presentador charlatán', d: 'Te felicito cuando aciertas y te animo cuando fallas.', req: ['callado'], fx: { vozBien: true, vozAnimo: true } },
    { id: 'v_cuenta', c: 'voz', n: 'Cuenta atrás cantada', d: 'Canto en voz alta los últimos cinco segundos del reloj.', req: ['cuenta'], fx: { vozCuenta: true } }
  ],
  excl: [['r_rayo', 'p_medio'], ['r_rayo', 'p_multa'], ['r_prisa', 'p_medio']],
  ev: {
    bien: ['¡Muy bien!', '¡Correcto, sigue así!', '¡Fenomenal!', '¡Eso es, qué crack!'],
    animo: ['¡No pasa nada, la siguiente es tuya!', '¡Ánimo, que lo estás haciendo genial!', '¡Casi, casi! ¡Vamos!', '¡Tranquilo, tú puedes!'],
    racha: ['¡Racha de fuego! ¡Tres seguidas!', '¡Imparable! ¡Otra racha!'],
    escudo: ['¡El escudo te protege! Ese fallo no cuenta.'],
    cuenta: ['Cinco', 'Cuatro', 'Tres', 'Dos', 'Uno']
  },
  // rasgos de cada modo (para el catálogo y el recuento)
  modos: {
    'Clásico · La silla azul': ['reloj', 'escudo', 'publico', 'ctiempo', 'segunda', 'pistas', 'tolerante', 'silla', 'callado', 'cuenta'],
    'Clásico · Una de cuatro': ['reloj', 'prorroga', 'segundos', 'bonus', 'oro', 'escudo', 'publico', 'c5050', 'segunda', 'ctiempo', 'callado', 'cuenta'],
    'Clásico · Sopa de letras': ['reloj', 'prorroga', 'segundos', 'bonus', 'publico', 'sopa', 'ctiempo', 'callado', 'cuenta'],
    'Clásico · Palabras cruzadas': ['reloj', 'prorroga', 'segundos', 'bonus', 'oro', 'escudo', 'publico', 'segunda', 'ctiempo', 'pistas', 'tolerante', 'callado', 'cuenta'],
    'Clásico · ¿Dónde están?': ['reloj', 'prorroga', 'segundos', 'bonus', 'escudo', 'memoria', 'ctiempo', 'callado', 'cuenta'],
    'Clásico · El rosco / Rosco diario': ['reloj', 'prorroga', 'final', 'bonus', 'oro', 'escudo', 'publico', 'segunda', 'ctiempo', 'reves', 'empiezaM', 'salteado', 'pasar', 'vocales', 'pistas', 'tolerante', 'callado', 'cuenta'],
    'Clásico · AlaZ': ['reloj', 'prorroga', 'final', 'bonus', 'oro', 'escudo', 'publico', 'segunda', 'ctiempo', 'empiezaM', 'letra', 'vocales', 'pistas', 'tolerante', 'callado', 'cuenta'],
    'Clásico · Carrera / Competición': ['reloj', 'prorroga', 'final', 'segundos', 'bonus', 'oro', 'escudo', 'publico', 'c5050', 'segunda', 'ctiempo', 'reves', 'empiezaM', 'salteado', 'pasar', 'letra', 'vocales', 'pistas', 'tolerante', 'memoria', 'sopa', 'silla', 'callado', 'cuenta'],
    'Programa completo (plató 3D)': ['reloj', 'final', 'segundos', 'bonus', 'oro', 'escudo', 'publico', 'c5050', 'ctiempo', 'empiezaM', 'sopa', 'pasar', 'letra', 'vocales', 'pistas', 'tolerante', 'memoria', 'silla', 'pistamus'],
    'Pasapalabra 3D': ['reloj', 'prorroga', 'final', 'segundos', 'bonus', 'oro', 'escudo', 'ctiempo', 'reves', 'empiezaM', 'pasar', 'vocales', 'tolerante', 'callado', 'cuenta'],
    'Pasapalabra 2: Nueva Edición': ['reloj', 'final', 'segundos', 'bonus', 'escudo', 'pistas', 'tolerante', 'pasar', 'vocales', 'callado'],
    'Pasapalabra Chile': ['reloj', 'final', 'segundos', 'escudo', 'pistas', 'tolerante', 'callado']
  }
});
