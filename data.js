/* Saberium — contenido educativo: campos, materias y banco de preguntas */
(function (S) {
  'use strict';

  S.FIELDS = [
    { id: 'mat', name: 'Matemáticas', world: 'Nodo Numérico', color: '#4C8DFF',
      blurb: 'Cálculo, álgebra, geometría y lógica.',
      subjects: ['Operaciones', 'Fracciones y porcentajes', 'Potencias y raíces', 'Álgebra', 'Geometría', 'Funciones y sucesiones', 'Lógica'] },
    { id: 'nat', name: 'Ciencias Naturales', world: 'Laboratorio Vivo', color: '#2ED98A',
      blurb: 'Biología, física, química y medioambiente.',
      subjects: ['Biología', 'Física', 'Química', 'Medioambiente'] },
    { id: 'soc', name: 'Ciencias Sociales', world: 'Atlas del Tiempo', color: '#FF8A3D',
      blurb: 'Historia, geografía, ciudadanía y economía.',
      subjects: ['Historia de Colombia', 'Historia universal', 'Geografía', 'Ciudadanía', 'Cultura', 'Economía'] },
    { id: 'hum', name: 'Humanidades', world: 'Biblioteca Infinita', color: '#F25CC1',
      blurb: 'Lenguaje, literatura e inglés.',
      subjects: ['Lenguaje', 'Inglés'] },
    { id: 'art', name: 'Artes', world: 'Escenario Vivo', color: '#A98BFF',
      blurb: 'Música y educación física.',
      subjects: ['Música', 'Educación física'] }
  ];

  S.DIFFS = [
    { id: 1, name: 'Fácil', points: 10, coins: 1 },
    { id: 2, name: 'Intermedio', points: 20, coins: 2 },
    { id: 3, name: 'Avanzado', points: 30, coins: 3 }
  ];

  const Q = [];
  let n = 0;
  function add(f, s, d, t, o) {
    o.f = f; o.s = s; o.d = d; o.t = t; o.id = f + (++n);
    o.pts = S.DIFFS[d - 1].points;
    Q.push(o);
  }
  const mc = (f, s, d, q, opts, a, e) => add(f, s, d, 'mc', { q, o: opts, a, e });
  const tf = (f, s, d, q, a, e) => add(f, s, d, 'tf', { q, a, e });
  const fl = (f, s, d, q, a, e) => add(f, s, d, 'fill', { q, a: [].concat(a), e });
  const mt = (f, s, d, q, pairs, e) => add(f, s, d, 'match', { q, pairs, e });
  const od = (f, s, d, q, items, e) => add(f, s, d, 'order', { q, items, e });

  /* ============ MATEMÁTICAS ============ */
  mc('mat', 'Operaciones', 1, '¿Cuánto es 7 × 8?', ['54', '56', '58', '64'], 1, '7 × 8 = 56. Recuerda que 7 × 8 es 7 × 4 × 2 = 28 × 2.');
  mc('mat', 'Operaciones', 1, '¿Cuánto es 125 + 378?', ['493', '503', '513', '603'], 1, '125 + 378 = 503: 100 + 300 = 400, 25 + 78 = 103, y 400 + 103 = 503.');
  fl('mat', 'Operaciones', 1, 'Calcula mentalmente: 144 ÷ 12 = ?', ['12'], '12 × 12 = 144, por eso 144 ÷ 12 = 12.');
  mc('mat', 'Operaciones', 1, 'Cálculo mental: ¿cuánto es 15 × 4?', ['45', '55', '60', '65'], 2, '15 × 4 = (10 × 4) + (5 × 4) = 40 + 20 = 60.');
  tf('mat', 'Potencias y raíces', 1, 'La raíz cuadrada de 81 es 9.', true, '9 × 9 = 81, entonces √81 = 9.');
  mc('mat', 'Fracciones y porcentajes', 1, '¿Cuál de estas fracciones equivale a 1/2?', ['2/3', '3/6', '3/5', '1/3'], 1, '3/6 se simplifica dividiendo numerador y denominador entre 3 y resulta 1/2.');
  mc('mat', 'Fracciones y porcentajes', 2, '¿Cuánto es 3/4 + 1/4?', ['4/8', '1', '3/16', '2'], 1, 'Con el mismo denominador se suman los numeradores: 3/4 + 1/4 = 4/4 = 1.');
  fl('mat', 'Fracciones y porcentajes', 2, '¿Cuál es el 25 % de 200?', ['50'], 'El 25 % es la cuarta parte: 200 ÷ 4 = 50.');
  mc('mat', 'Fracciones y porcentajes', 2, 'Un artículo de $80.000 tiene 15 % de descuento. ¿Cuánto se paga?', ['$65.000', '$68.000', '$70.000', '$72.000'], 1, 'El 15 % de 80.000 es 12.000. Se paga 80.000 − 12.000 = $68.000.');
  mc('mat', 'Potencias y raíces', 2, '¿Cuánto es 2⁵?', ['10', '16', '25', '32'], 3, '2⁵ = 2 × 2 × 2 × 2 × 2 = 32.');
  tf('mat', 'Potencias y raíces', 2, 'Cualquier número distinto de cero elevado a la 0 es igual a 1.', true, 'Por definición a⁰ = 1 cuando a ≠ 0.');
  fl('mat', 'Potencias y raíces', 2, 'Calcula √169.', ['13'], '13 × 13 = 169.');
  fl('mat', 'Álgebra', 2, 'Si 3x + 5 = 20, ¿cuánto vale x?', ['5'], '3x = 20 − 5 = 15, y x = 15 ÷ 3 = 5.');
  mc('mat', 'Álgebra', 3, '¿Cuál es la solución de 2(x − 3) = x + 4?', ['x = 7', 'x = 10', 'x = 14', 'x = −2'], 1, '2x − 6 = x + 4, entonces x = 10.');
  fl('mat', 'Álgebra', 3, 'La ecuación x² − 5x + 6 = 0 tiene dos soluciones. ¿Cuál es la mayor?', ['3'], 'Se factoriza como (x − 2)(x − 3) = 0. Las soluciones son 2 y 3.');
  mc('mat', 'Álgebra', 3, '¿Cuál es la factorización de x² − 9?', ['(x − 3)(x − 3)', '(x − 3)(x + 3)', '(x + 9)(x − 1)', '(x − 9)(x + 1)'], 1, 'Es una diferencia de cuadrados: a² − b² = (a − b)(a + b).');
  mc('mat', 'Geometría', 1, '¿Cuál es el área de un rectángulo de 6 m de largo y 4 m de ancho?', ['10 m²', '20 m²', '24 m²', '48 m²'], 2, 'Área = base × altura = 6 × 4 = 24 m².');
  fl('mat', 'Geometría', 2, '¿Cuál es el perímetro (en cm) de un cuadrado de lado 7 cm?', ['28', '28 cm'], 'Perímetro = 4 × lado = 4 × 7 = 28 cm.');
  mc('mat', 'Geometría', 2, '¿Cuál es el volumen de un cubo de arista 3 cm?', ['9 cm³', '18 cm³', '27 cm³', '81 cm³'], 2, 'Volumen = arista³ = 3 × 3 × 3 = 27 cm³.');
  fl('mat', 'Geometría', 2, 'Un triángulo tiene base 10 cm y altura 6 cm. ¿Cuál es su área en cm²?', ['30', '30 cm2', '30 cm²'], 'Área = (base × altura) ÷ 2 = 60 ÷ 2 = 30.');
  mc('mat', 'Geometría', 3, '¿Cuál es el área de un círculo de radio 5?', ['10π', '25π', '5π', '50π'], 1, 'Área = π × r² = π × 25 = 25π.');
  mt('mat', 'Geometría', 3, 'Relaciona cada figura con su fórmula de área.', [['Cuadrado', 'l × l'], ['Rectángulo', 'b × h'], ['Triángulo', '(b × h) ÷ 2'], ['Círculo', 'π × r²']], 'Cada figura tiene una fórmula propia; el triángulo es la mitad de un rectángulo.');
  fl('mat', 'Funciones y sucesiones', 2, '¿Qué número sigue en la sucesión 3, 7, 11, 15, …?', ['19'], 'La sucesión aumenta de 4 en 4: 15 + 4 = 19.');
  mc('mat', 'Funciones y sucesiones', 2, 'Si f(x) = 2x + 1, ¿cuánto vale f(4)?', ['7', '8', '9', '10'], 2, 'f(4) = 2 × 4 + 1 = 9.');
  mc('mat', 'Funciones y sucesiones', 3, '¿Cuál es el valor del límite de (x² − 4)/(x − 2) cuando x tiende a 2?', ['0', '2', '4', 'No existe'], 2, 'Se factoriza: (x − 2)(x + 2)/(x − 2) = x + 2, que tiende a 4.');
  fl('mat', 'Funciones y sucesiones', 3, 'En una sucesión aritmética con a₁ = 5 y diferencia 3, ¿cuánto vale el término 10?', ['32'], 'aₙ = a₁ + (n − 1)d = 5 + 9 × 3 = 32.');
  od('mat', 'Lógica', 1, 'Ordena de menor a mayor estos números.', ['1/4', '0,3', '1/2', '0,75'], '1/4 = 0,25; después 0,3; luego 1/2 = 0,5 y por último 0,75.');
  fl('mat', 'Lógica', 2, 'Si 3 cuadernos cuestan $9.000, ¿cuánto cuestan 7 cuadernos? (solo el número)', ['21000'], 'Cada cuaderno cuesta $3.000. Entonces 7 × 3.000 = $21.000.');
  mc('mat', 'Lógica', 3, 'Un número aumentado en su 20 % es 60. ¿Cuál es el número?', ['40', '48', '50', '52'], 2, 'Número × 1,2 = 60, entonces número = 60 ÷ 1,2 = 50.');

  /* ============ CIENCIAS NATURALES ============ */
  mc('nat', 'Biología', 1, '¿Qué organelo produce la mayor parte de la energía (ATP) de la célula?', ['Núcleo', 'Mitocondria', 'Ribosoma', 'Vacuola'], 1, 'Las mitocondrias realizan la respiración celular y producen ATP.');
  tf('nat', 'Biología', 1, 'Las células vegetales tienen pared celular.', true, 'La pared celular de celulosa da soporte y forma a las células vegetales.');
  mc('nat', 'Biología', 1, '¿Qué órgano bombea la sangre por todo el cuerpo?', ['Pulmón', 'Hígado', 'Corazón', 'Riñón'], 2, 'El corazón es un músculo que impulsa la sangre por el sistema circulatorio.');
  od('nat', 'Biología', 1, 'Ordena esta cadena alimentaria, del productor al consumidor final.', ['Pasto', 'Saltamontes', 'Rana', 'Serpiente'], 'La energía pasa del productor (pasto) a consumidores primarios, secundarios y terciarios.');
  mc('nat', 'Biología', 2, '¿Qué molécula contiene la información genética de los seres vivos?', ['ADN', 'ATP', 'Glucosa', 'Hemoglobina'], 0, 'El ADN guarda las instrucciones para construir y hacer funcionar a un organismo.');
  mt('nat', 'Biología', 2, 'Relaciona cada sistema del cuerpo con su función.', [['Respiratorio', 'Intercambia gases'], ['Digestivo', 'Descompone alimentos'], ['Circulatorio', 'Transporta sangre'], ['Nervioso', 'Envía señales']], 'Cada sistema cumple una tarea y trabajan coordinados.');
  mc('nat', 'Biología', 2, 'En un ecosistema, los organismos que producen su propio alimento se llaman:', ['Consumidores', 'Descomponedores', 'Productores', 'Parásitos'], 2, 'Los productores, como las plantas, fabrican su alimento mediante la fotosíntesis.');
  mc('nat', 'Biología', 3, 'Dos padres Aa (A dominante, a recesivo) tienen un hijo. ¿Qué probabilidad hay de que sea aa?', ['0 %', '25 %', '50 %', '75 %'], 1, 'El cruce Aa × Aa da AA, Aa, Aa y aa: un cuarto, es decir 25 %.');
  mc('nat', 'Física', 1, '¿En qué unidad del Sistema Internacional se mide la fuerza?', ['Julio', 'Newton', 'Vatio', 'Pascal'], 1, 'La fuerza se mide en newton (N), en honor a Isaac Newton.');
  fl('nat', 'Física', 2, 'Un auto recorre 150 km en 3 horas a velocidad constante. ¿Cuál es su velocidad en km/h?', ['50', '50 km/h'], 'Velocidad = distancia ÷ tiempo = 150 ÷ 3 = 50 km/h.');
  mc('nat', 'Física', 2, '¿Cómo se llama la energía que tiene un cuerpo por estar en movimiento?', ['Potencial', 'Cinética', 'Térmica', 'Química'], 1, 'La energía cinética depende de la masa y de la velocidad del cuerpo.');
  tf('nat', 'Física', 2, 'En el vacío, un objeto pesado cae más rápido que uno liviano.', false, 'Sin resistencia del aire, todos los cuerpos caen con la misma aceleración.');
  tf('nat', 'Física', 2, 'La luz viaja más rápido que el sonido.', true, 'La luz recorre unos 300.000 km/s; el sonido en el aire, unos 340 m/s.');
  mc('nat', 'Física', 3, 'Según F = m · a, ¿qué fuerza actúa sobre una masa de 5 kg con aceleración de 4 m/s²?', ['9 N', '1,25 N', '20 N', '45 N'], 2, 'F = 5 × 4 = 20 N.');
  mc('nat', 'Física', 3, 'Según la ley de Ohm (V = I · R), ¿cuál es el voltaje si I = 2 A y R = 6 Ω?', ['3 V', '8 V', '12 V', '36 V'], 2, 'V = 2 × 6 = 12 V.');
  mc('nat', 'Química', 1, '¿Cuál es el símbolo químico del oro?', ['Or', 'Au', 'Ag', 'Go'], 1, 'Au viene del latín aurum.');
  fl('nat', 'Química', 1, '¿Cuál es el símbolo químico del sodio?', ['Na'], 'Na viene del latín natrium.');
  mc('nat', 'Química', 2, '¿Cuál es la fórmula de la sal de mesa?', ['NaCl', 'KCl', 'H₂O', 'CO₂'], 0, 'La sal de mesa es cloruro de sodio: NaCl.');
  mt('nat', 'Química', 2, 'Relaciona cada elemento con su símbolo.', [['Hierro', 'Fe'], ['Potasio', 'K'], ['Plata', 'Ag'], ['Oxígeno', 'O']], 'Algunos símbolos vienen del latín: Fe (ferrum), K (kalium), Ag (argentum).');
  mc('nat', 'Química', 2, 'Una sustancia con pH 3 es:', ['Ácida', 'Neutra', 'Básica', 'Salina'], 0, 'El pH menor que 7 es ácido, 7 es neutro y mayor que 7 es básico.');
  mc('nat', 'Química', 3, '¿Qué determina el número atómico de un elemento?', ['Sus neutrones', 'Sus electrones de valencia', 'Sus protones', 'Su masa total'], 2, 'El número atómico es el número de protones del núcleo.');
  tf('nat', 'Química', 3, 'Una mezcla de agua y aceite es una mezcla homogénea.', false, 'No se mezclan por completo; se ven dos fases, por eso es heterogénea.');
  mc('nat', 'Química', 3, '¿Qué gas liberan las plantas durante la fotosíntesis?', ['Dióxido de carbono', 'Nitrógeno', 'Oxígeno', 'Metano'], 2, 'Con luz, agua y CO₂ producen glucosa y liberan oxígeno.');
  mc('nat', 'Medioambiente', 1, '¿Qué gas, liberado al quemar combustibles fósiles, aumenta el efecto invernadero?', ['Oxígeno', 'Dióxido de carbono', 'Helio', 'Nitrógeno'], 1, 'El CO₂ retiene calor en la atmósfera y contribuye al calentamiento global.');
  tf('nat', 'Medioambiente', 1, 'Reciclar vidrio ayuda a reducir los residuos y el uso de materias primas.', true, 'El vidrio se puede reciclar muchas veces sin perder calidad.');
  mc('nat', 'Medioambiente', 2, '¿Qué capa de la atmósfera nos protege de la radiación ultravioleta?', ['Troposfera', 'Capa de ozono', 'Ionosfera', 'Exosfera'], 1, 'La capa de ozono absorbe gran parte de los rayos UV del Sol.');
  mc('nat', 'Medioambiente', 2, 'Colombia es reconocido como un país con gran:', ['Desierto', 'Biodiversidad', 'Nieve permanente', 'Tundra'], 1, 'Colombia es uno de los países megadiversos del planeta.');

  /* ============ CIENCIAS SOCIALES ============ */
  mc('soc', 'Historia de Colombia', 1, '¿En qué año ocurrió el Grito de Independencia en Santafé de Bogotá?', ['1492', '1810', '1886', '1991'], 1, 'El 20 de julio de 1810 se dio el Grito de Independencia.');
  mc('soc', 'Historia de Colombia', 1, '¿Qué batalla de 1819 selló la independencia de Colombia?', ['Batalla de Boyacá', 'Batalla de Ayacucho', 'Batalla de Carabobo', 'Batalla de Junín'], 0, 'En el Puente de Boyacá, el 7 de agosto de 1819, triunfó el ejército patriota.');
  mc('soc', 'Historia de Colombia', 1, '¿Cuál es el año de la Constitución que rige hoy en Colombia?', ['1886', '1991', '1948', '2000'], 1, 'La Constitución Política de 1991 reemplazó a la de 1886.');
  od('soc', 'Historia de Colombia', 2, 'Ordena estos hechos de Colombia del más antiguo al más reciente.', ['Grito de Independencia', 'Batalla de Boyacá', 'Constitución de Cúcuta', 'Constitución de 1991'], 'Los hechos ocurrieron en 1810, 1819, 1821 y 1991.');
  mc('soc', 'Historia de Colombia', 3, 'El Frente Nacional, acuerdo de alternancia entre liberales y conservadores, duró entre:', ['1930 y 1946', '1958 y 1974', '1948 y 1953', '1974 y 1990'], 1, 'Se estableció tras el plebiscito de 1957 y rigió de 1958 a 1974.');
  mc('soc', 'Historia universal', 1, '¿En qué año comenzó la Primera Guerra Mundial?', ['1905', '1914', '1939', '1945'], 1, 'Empezó en 1914 y terminó en 1918.');
  mc('soc', 'Historia universal', 2, '¿En qué año ocurrió la Revolución Francesa?', ['1648', '1776', '1789', '1815'], 2, 'Comenzó en 1789 con la toma de la Bastilla.');
  mt('soc', 'Historia universal', 2, 'Relaciona cada personaje con su acontecimiento.', [['Cristóbal Colón', 'Llegó a América en 1492'], ['Napoleón Bonaparte', 'Emperador de Francia'], ['Mahatma Gandhi', 'Independencia de la India'], ['Nelson Mandela', 'Fin del apartheid']], 'Cada personaje marcó un momento clave de la historia.');
  mc('soc', 'Historia universal', 2, '¿En qué año cayó el Muro de Berlín?', ['1961', '1975', '1989', '2001'], 2, 'Cayó el 9 de noviembre de 1989, símbolo del fin de la Guerra Fría.');
  tf('soc', 'Historia universal', 3, 'La Guerra Fría fue un enfrentamiento militar directo y declarado entre Estados Unidos y la Unión Soviética.', false, 'Fue una tensión política, económica e ideológica con guerras indirectas, sin choque directo.');
  mc('soc', 'Geografía', 1, '¿Cuál es la capital de Argentina?', ['Santiago', 'Montevideo', 'Buenos Aires', 'Lima'], 2, 'Buenos Aires es la capital y la ciudad más grande de Argentina.');
  mc('soc', 'Geografía', 1, '¿Cuál es el continente más grande del mundo?', ['África', 'América', 'Asia', 'Europa'], 2, 'Asia ocupa cerca del 30 % de las tierras emergidas.');
  tf('soc', 'Geografía', 1, 'Colombia tiene costas sobre el océano Pacífico y sobre el mar Caribe.', true, 'Es el único país de Suramérica con costas en ambos océanos.');
  mt('soc', 'Geografía', 2, 'Relaciona cada país con su capital.', [['Perú', 'Lima'], ['Ecuador', 'Quito'], ['Brasil', 'Brasilia'], ['Chile', 'Santiago']], 'Brasilia es la capital de Brasil desde 1960, no Río de Janeiro.');
  mc('soc', 'Geografía', 2, '¿Qué río desemboca en el mar Caribe cerca de Barranquilla?', ['Cauca', 'Magdalena', 'Amazonas', 'Orinoco'], 1, 'El río Magdalena es la principal arteria fluvial de Colombia.');
  fl('soc', 'Geografía', 2, '¿Cuál es la capital de Australia?', ['canberra'], 'Canberra es la capital; Sídney es la ciudad más poblada.');
  mc('soc', 'Geografía', 3, '¿Cómo se llama la línea imaginaria que divide la Tierra en hemisferio norte y sur?', ['Meridiano de Greenwich', 'Trópico de Cáncer', 'Ecuador', 'Círculo polar'], 2, 'El Ecuador está a 0° de latitud.');
  mc('soc', 'Ciudadanía', 1, 'Los tres poderes del Estado colombiano son ejecutivo, legislativo y:', ['Militar', 'Judicial', 'Electoral', 'Económico'], 1, 'La rama judicial administra justicia.');
  mc('soc', 'Ciudadanía', 2, '¿Qué mecanismo permite proteger rápidamente los derechos fundamentales?', ['Acción de tutela', 'Referendo', 'Cabildo abierto', 'Plebiscito'], 0, 'La tutela se resuelve en máximo 10 días.');
  tf('soc', 'Ciudadanía', 2, 'Los derechos humanos aplican para todas las personas sin discriminación.', true, 'Son universales: nadie puede ser excluido por origen, género o creencias.');
  mc('soc', 'Ciudadanía', 3, '¿A partir de qué edad se puede votar en Colombia?', ['16 años', '18 años', '21 años', '25 años'], 1, 'La ciudadanía y el derecho al voto se alcanzan a los 18 años.');
  mc('soc', 'Cultura', 1, '¿Cuál es una danza tradicional de la región Caribe colombiana?', ['Cumbia', 'Tango', 'Samba', 'Flamenco'], 0, 'La cumbia mezcla raíces indígenas, africanas y europeas.');
  mc('soc', 'Cultura', 2, '¿Qué festividad de Barranquilla es Patrimonio Cultural Inmaterial de la Humanidad?', ['Feria de las Flores', 'Carnaval de Barranquilla', 'Fiesta del Mar', 'Festival Vallenato'], 1, 'La UNESCO lo declaró patrimonio en 2003.');
  mc('soc', 'Economía', 1, 'La agricultura y la minería pertenecen al sector económico:', ['Primario', 'Secundario', 'Terciario', 'Cuaternario'], 0, 'El sector primario extrae recursos de la naturaleza.');
  mc('soc', 'Economía', 2, '¿Cómo se llama el aumento general y sostenido de los precios?', ['Deflación', 'Inflación', 'Ahorro', 'Devaluación'], 1, 'La inflación reduce el poder adquisitivo del dinero.');
  tf('soc', 'Economía', 2, 'Si la demanda de un producto sube y la oferta no cambia, el precio tiende a subir.', true, 'Más compradores para la misma cantidad de producto presionan el precio hacia arriba.');
  mc('soc', 'Economía', 3, 'El PIB (producto interno bruto) mide:', ['La deuda pública', 'El valor de bienes y servicios producidos en un país', 'El número de empleos', 'Las exportaciones únicamente'], 1, 'Es el valor total de lo producido en un país durante un periodo.');

  /* ============ HUMANIDADES ============ */
  mc('hum', 'Lenguaje', 1, '¿Cuál es un sinónimo de "feliz"?', ['Triste', 'Contento', 'Cansado', 'Enojado'], 1, 'Los sinónimos tienen significado parecido.');
  mc('hum', 'Lenguaje', 1, '¿Cuál es el antónimo de "generoso"?', ['Amable', 'Egoísta', 'Valiente', 'Alegre'], 1, 'Los antónimos tienen significado opuesto.');
  fl('hum', 'Lenguaje', 1, 'Completa con el verbo "ir" en pretérito: "Ayer yo ___ al parque."', ['fui'], 'Yo fui: pretérito perfecto simple de "ir".');
  mc('hum', 'Lenguaje', 2, '¿Cuál palabra está bien escrita?', ['Exepción', 'Excepción', 'Escepción', 'Exsepción'], 1, 'Se escribe "excepción", con "xc".');
  mc('hum', 'Lenguaje', 2, '"Tus ojos son dos luceros" es un ejemplo de:', ['Metáfora', 'Símil', 'Hipérbole', 'Onomatopeya'], 0, 'La metáfora identifica un elemento con otro sin usar "como".');
  mc('hum', 'Lenguaje', 2, '"Es lento como una tortuga" es un ejemplo de:', ['Metáfora', 'Personificación', 'Símil', 'Ironía'], 2, 'El símil compara con "como", "cual" o "parece".');
  mc('hum', 'Lenguaje', 2, '¿A qué género literario pertenece un poema escrito en versos?', ['Narrativo', 'Lírico', 'Dramático', 'Periodístico'], 1, 'El género lírico expresa sentimientos.');
  tf('hum', 'Lenguaje', 2, 'Las palabras agudas llevan tilde cuando terminan en n, s o vocal.', true, 'Ejemplos: canción, café, compás.');
  od('hum', 'Lenguaje', 2, 'Ordena las palabras para formar una oración.', ['María', 'lee', 'un', 'libro'], 'Orden básico en español: sujeto, verbo y complemento.');
  mc('hum', 'Lenguaje', 2, 'Lee: "El río crecía cada tarde por la lluvia, y los vecinos aprendieron a guardar sus pertenencias en lo alto." ¿Por qué guardan sus cosas en lo alto?', ['Por una mudanza', 'Porque el río crecía con la lluvia', 'Porque había un robo', 'Por una fiesta'], 1, 'El texto dice que el río crecía por la lluvia.');
  mc('hum', 'Lenguaje', 3, '¿Quién escribió "Cien años de soledad"?', ['Mario Vargas Llosa', 'Julio Cortázar', 'Gabriel García Márquez', 'Jorge Isaacs'], 2, 'Gabriel García Márquez la publicó en 1967 y ganó el Nobel en 1982.');
  mc('hum', 'Lenguaje', 3, 'En "Compramos pan en la tienda", ¿cuál es el sujeto?', ['Pan', 'Tienda', 'Nosotros (tácito)', 'Compramos'], 2, 'El verbo en primera persona plural indica el sujeto tácito "nosotros".');
  mc('hum', 'Lenguaje', 3, '"Te lo he dicho mil veces" es un ejemplo de:', ['Hipérbole', 'Metáfora', 'Símil', 'Aliteración'], 0, 'La hipérbole exagera una idea para darle fuerza.');
  mc('hum', 'Inglés', 1, 'What does "apple" mean in Spanish?', ['Naranja', 'Manzana', 'Pera', 'Uva'], 1, '"Apple" significa manzana.');
  fl('hum', 'Inglés', 1, 'Translate "house" into Spanish.', ['casa', 'la casa'], '"House" significa casa.');
  mc('hum', 'Inglés', 1, 'Choose the correct word: "She ___ a student."', ['am', 'is', 'are', 'be'], 1, 'Con she / he / it se usa "is".');
  mc('hum', 'Inglés', 2, 'What is the past tense of "go"?', ['Goed', 'Gone', 'Went', 'Going'], 2, '"Go" es un verbo irregular: go → went → gone.');
  fl('hum', 'Inglés', 2, 'Complete: "I ___ happy today." (verb to be)', ['am', "i'm"], 'Con "I" se usa "am".');
  od('hum', 'Inglés', 2, 'Order the words to make a sentence.', ['She', 'goes', 'to', 'school'], 'Orden: sujeto + verbo + complemento.');
  mt('hum', 'Inglés', 2, 'Match each English word with its Spanish translation.', [['Dog', 'Perro'], ['Book', 'Libro'], ['Window', 'Ventana'], ['Friend', 'Amigo']], 'Vocabulario cotidiano.');
  mc('hum', 'Inglés', 2, 'Find the error: "He don\'t like pizza."', ['"He" is wrong', '"don\'t" should be "doesn\'t"', '"like" should be "likes"', '"pizza" is wrong'], 1, 'Con he/she/it se usa "doesn\'t" en negativas del presente.');
  tf('hum', 'Inglés', 2, '"Their" and "there" mean the same thing.', false, '"Their" indica posesión y "there" indica lugar.');
  mc('hum', 'Inglés', 2, 'How do you say "Tengo hambre" in English?', ['I am hungry', 'I have hunger', 'I am hunger', 'I hungry'], 0, 'En inglés se usa "to be": I am hungry.');
  mc('hum', 'Inglés', 3, 'Choose the correct form: "If I ___ rich, I would travel the world."', ['am', 'was being', 'were', 'will be'], 2, 'En condicionales irreales se usa "were".');
  mc('hum', 'Inglés', 3, 'Reading: "Tom wakes up at 6. He eats breakfast and takes the bus to school." How does Tom go to school?', ['By bus', 'By car', 'On foot', 'By bike'], 0, 'El texto dice "takes the bus".');
  fl('hum', 'Inglés', 3, 'Complete with the present perfect: "She has ___ her homework." (finish)', ['finished'], 'Present perfect: have/has + participio pasado.');

  /* ============ ARTES ============ */
  mc('art', 'Música', 1, '¿Cuál de estos instrumentos es de cuerda frotada?', ['Violín', 'Flauta', 'Tambor', 'Trompeta'], 0, 'El violín suena al frotar las cuerdas con un arco.');
  mc('art', 'Música', 1, '¿Cuántas notas musicales básicas existen?', ['5', '7', '8', '12'], 1, 'Do, Re, Mi, Fa, Sol, La y Si.');
  mt('art', 'Música', 1, 'Relaciona cada instrumento con su familia.', [['Violín', 'Cuerda'], ['Tambor', 'Percusión'], ['Flauta', 'Viento'], ['Piano', 'Teclado']], 'Los instrumentos se agrupan según cómo producen el sonido.');
  mc('art', 'Música', 2, '¿Qué instrumentos caracterizan al vallenato tradicional?', ['Acordeón, caja y guacharaca', 'Guitarra eléctrica y batería', 'Arpa y cuatro', 'Violín y chelo'], 0, 'Acordeón, caja vallenata y guacharaca forman el trío tradicional.');
  mc('art', 'Música', 2, 'En compás de 4/4, ¿cuántos tiempos dura una blanca?', ['1', '2', '3', '4'], 1, 'Blanca = 2 tiempos; negra = 1; redonda = 4.');
  od('art', 'Música', 2, 'Ordena las notas para formar la escala ascendente.', ['Sol', 'Do', 'Fa', 'Mi', 'Re'], 'La escala es Do, Re, Mi, Fa, Sol.');
  tf('art', 'Música', 2, 'La cumbia nació de la mezcla de culturas indígenas, africanas y europeas.', true, 'Es un símbolo del mestizaje cultural colombiano.');
  mc('art', 'Música', 3, 'En compás de 4/4, ¿cuántos tiempos tiene cada compás?', ['2', '3', '4', '6'], 2, 'El numerador indica los tiempos por compás.');
  mc('art', 'Música', 3, 'El término "allegro" en una partitura indica un tempo:', ['Lento', 'Moderado', 'Rápido', 'Silencio'], 2, 'Allegro significa vivo y rápido.');
  fl('art', 'Música', 3, 'Patrón rítmico en 4/4: negra + negra + blanca. ¿Cuántos tiempos suman?', ['4'], '1 + 1 + 2 = 4 tiempos.');
  mc('art', 'Música', 3, 'Completa el compás de 4/4: blanca + negra + ___', ['Redonda', 'Negra', 'Blanca', 'Silencio de redonda'], 1, 'Blanca (2) + negra (1) + negra (1) = 4 tiempos.');
  mc('art', 'Música', 3, '¿Cuántas líneas tiene un pentagrama?', ['4', '5', '6', '7'], 1, 'Penta significa cinco.');
  mc('art', 'Educación física', 1, '¿Cuántos jugadores por equipo hay en la cancha en un partido de fútbol?', ['9', '10', '11', '12'], 2, 'Cada equipo juega con 11, incluido el portero.');
  mc('art', 'Educación física', 1, '¿Cuántos jugadores de un equipo de baloncesto están en cancha a la vez?', ['4', '5', '6', '7'], 1, 'Cinco por equipo.');
  mc('art', 'Educación física', 1, '¿Cuántos jugadores por equipo hay en cancha en voleibol?', ['5', '6', '7', '8'], 1, 'Son seis jugadores por equipo.');
  tf('art', 'Educación física', 2, 'En baloncesto se puede caminar con el balón en las manos sin driblar.', false, 'Eso es "pasos": una violación del reglamento.');
  mc('art', 'Educación física', 2, '¿Cuánto dura un partido de fútbol profesional (sin adición)?', ['60 minutos', '80 minutos', '90 minutos', '120 minutos'], 2, 'Dos tiempos de 45 minutos.');
  mc('art', 'Educación física', 2, '¿Cuál capacidad física permite mover las articulaciones con amplitud?', ['Fuerza', 'Resistencia', 'Flexibilidad', 'Velocidad'], 2, 'La flexibilidad depende de articulaciones, músculos y tendones.');
  mc('art', 'Educación física', 2, '¿Para qué sirve el calentamiento antes del ejercicio?', ['Para cansarse más rápido', 'Para preparar el cuerpo y prevenir lesiones', 'Para sustituir la hidratación', 'No sirve para nada'], 1, 'Aumenta la temperatura muscular y el ritmo cardíaco gradualmente.');
  tf('art', 'Educación física', 2, 'El juego limpio implica respetar las reglas, a los compañeros y a los rivales.', true, 'La deportividad es parte esencial del deporte.');
  od('art', 'Educación física', 2, 'Ordena las partes de una sesión de ejercicio.', ['Calentamiento', 'Parte principal', 'Vuelta a la calma'], 'Primero se prepara el cuerpo, luego se trabaja y al final se relaja.');
  mc('art', 'Educación física', 3, '¿Cuál es el hueso más largo del cuerpo humano?', ['Húmero', 'Tibia', 'Fémur', 'Radio'], 2, 'El fémur está en el muslo.');
  mc('art', 'Educación física', 3, '¿Qué músculo principal flexiona el codo?', ['Tríceps', 'Bíceps', 'Deltoides', 'Pectoral'], 1, 'El bíceps braquial flexiona el codo.');
  mc('art', 'Educación física', 3, '¿Cuántos puntos vale un tiro de larga distancia desde detrás de la línea en baloncesto?', ['1', '2', '3', '4'], 2, 'El triple vale 3 puntos.');
  mt('art', 'Educación física', 3, 'Relaciona cada deporte con un elemento propio.', [['Voleibol', 'Red'], ['Baloncesto', 'Aro'], ['Fútbol', 'Portería'], ['Natación', 'Piscina']], 'Cada deporte tiene su propio escenario y material.');

  S.QUESTIONS = Q;
  S.qById = Object.fromEntries(Q.map(q => [q.id, q]));
})(window.S = window.S || {});
