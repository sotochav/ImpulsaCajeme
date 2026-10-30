/* =========================================================
   Waste2Value – app.js
   1. Knowledge base (materials + upcycling ideas)
   2. Helpers & DOM references
   3. Camera handling (getUserMedia, capture, errors)
   4. Image upload / drag & drop / sample items
   5. Real AI analysis (TensorFlow.js: MobileNet or custom model)
   6. Rendering (results, tabs, idea cards)
   7. UI chrome (nav, toasts, reveal animations)
   8. Init
   ========================================================= */
(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. KNOWLEDGE BASE
     Each material has a list of ideas. Ideas belong to one of
     the CATEGORIES used by the filter tabs.
     --------------------------------------------------------- */
  const CATEGORIES = ["Decoración", "Jardín", "Manualidades", "Almacenamiento"];

  const MATERIALS = {
    "plastic-bottle": {
      label: "Botella de plástico",
      material: "PET (plástico #1)",
      icon: "🧴",
      recycling: "Muy reciclable",
      co2: 0.08,
      keywords: ["bottle", "pet", "plastic", "soda", "water"],
      tip: "Enjuaga la botella, quita la etiqueta y guarda la tapa. Ambos materiales te sirven para los proyectos de abajo.",
      ideas: [
        {
          id: "pb-planter", title: "Maceta autorregable", category: "Jardín", difficulty: "Fácil", time: "20 min", emoji: "🌱",
          summary: "Un sistema de mecha mantiene la tierra húmeda y uniforme, ideal para hierbas y plantas pequeñas.",
          tools: ["Tijeras o cúter", "Cuerda de algodón o tira de tela", "Tierra para macetas", "Planta pequeña"],
          steps: [
            "Corta la botella por la mitad. Pide ayuda a un adulto si el plástico es muy grueso.",
            "Haz un agujero en la tapa y pasa una tira de 20 cm de cuerda de algodón para que cuelgue a ambos lados.",
            "Pon la parte superior invertida dentro de la inferior para que la cuerda quede dentro de la base.",
            "Añade agua en la base hasta que quede justo debajo de la tapa y luego llena la parte superior con tierra.",
            "Planta tu hierba o planta, riega un poco y rellena el depósito cuando se vacíe."
          ]
        },
        {
          id: "pb-feeder", title: "Comedero colgante para pájaros", category: "Jardín", difficulty: "Fácil", time: "15 min", emoji: "🐦",
          summary: "Dos cucharas de madera convierten la botella en un comedero para aves del jardín.",
          tools: ["Cúter", "2 cucharas de madera", "Cuerda", "Semillas para pájaros"],
          steps: [
            "Lava y seca bien la botella y quita la etiqueta.",
            "Haz un agujero a unos 5 cm del fondo en cada lado y pasa el mango de una cuchara por ambos orificios para que las cucharas queden fuera.",
            "Corta una pequeña abertura justo encima de cada cuchara y alisa los bordes con papel de lija o cinta.",
            "Rellena la botella con semillas y vuelve a poner la tapa.",
            "Ata una cuerda al cuello y cuélgalo de una rama resistente, lejos del alcance de los gatos."
          ]
        },
        {
          id: "pb-organizer", title: "Trío organizador de escritorio", category: "Almacenamiento", difficulty: "Fácil", time: "25 min", emoji: "✏️",
          summary: "Tres botellas cortadas a distintas alturas guardan bolígrafos, tijeras y pinceles ordenadamente.",
          tools: ["Tijeras", "Pintura acrílica o cinta washi", "Pegamento fuerte", "Base de cartón"],
          steps: [
            "Corta tres botellas a distintas alturas, por ejemplo 8 cm, 11 cm y 14 cm.",
            "Cubre los bordes con cinta washi o lija para que no queden afilados.",
            "Pinta o envuelve cada botella con colores que te gusten y deja que se seque por completo.",
            "Pega las tres botellas lado a lado y luego fija el conjunto sobre una base de cartón.",
            "Deja que se seque el pegamento durante una hora y luego guarda bolígrafos, pinceles y tijeras."
          ]
        },
        {
          id: "pb-caps", title: "Mosaico con tapas de botella", category: "Decoración", difficulty: "Media", time: "2 hrs", emoji: "🎨",
          summary: "Recoge tapas de colores y organízalas en un bonito colgante para la pared.",
          tools: ["Tapas de botella (unos 60)", "Pistola de pegamento caliente", "Lápiz", "Cartón o madera contrachapada"],
          steps: [
            "Lava las tapas y ordénalas por color.",
            "Haz un boceto sencillo sobre la base, como una flor, una ola o un sol.",
            "Coloca las tapas sobre el diseño antes de pegarlas y ajusta el patrón.",
            "Pega las tapas una a una desde el centro hacia fuera.",
            "Añade un lazo de cuerda en la parte trasera y cuelga tu mosaico."
          ]
        }
      ]
    },

    "glass-jar": {
      label: "Frasco de vidrio",
      material: "Vidrio",
      icon: "🫙",
      recycling: "Infinitamente reciclable",
      co2: 0.3,
      keywords: ["jar", "glass", "mason", "jam", "jars"],
      tip: "Remoja la etiqueta en agua tibia con jabón. Un poco de aceite elimina el pegamento pegado.",
      ideas: [
        {
          id: "gj-herbs", title: "Frasco de hierbas para la ventana", category: "Jardín", difficulty: "Fácil", time: "30 min", emoji: "🌿",
          summary: "Cultiva albahaca, menta o perejil en un frasco bonito junto a una ventana soleada.",
          tools: ["Piedras", "Tierra para macetas", "Plántulas de hierbas", "Cuchara"],
          steps: [
            "Lava el frasco y sécalo bien.",
            "Añade una capa de 3 cm de piedras en el fondo, porque los frascos no tienen drenaje.",
            "Coloca tierra hasta llenar aproximadamente tres cuartos del frasco.",
            "Planta la plántula, aprieta la tierra con suavidad y riega un poco.",
            "Colócalo en una ventana luminosa y riega solo cuando la tierra esté seca en la superficie."
          ]
        },
        {
          id: "gj-lantern", title: "Farol de luciérnagas", category: "Decoración", difficulty: "Fácil", time: "20 min", emoji: "🏮",
          summary: "Un farol cálido y brillante para tu balcón o terraza.",
          tools: ["Cable de alambre", "Alicates", "Cordel", "Vela LED"],
          steps: [
            "Limpia el frasco y quita la tapa.",
            "Envuelve el cuello del frasco con alambre dos veces y tuerce los extremos para fijarlo.",
            "Haz un lazo largo en la parte superior para formar un asa y dobla los extremos con los alicates.",
            "Decora el cuello con cordel, cuentas o cinta.",
            "Pon una vela LED (nunca una llama real dentro de un frasco cerrado) y cuélgalo."
          ]
        },
        {
          id: "gj-pantry", title: "Tarros para despensa", category: "Almacenamiento", difficulty: "Fácil", time: "30 min", emoji: "🥣",
          summary: "Almacenamiento transparente y hermético para pasta, arroz, frutos secos y especias.",
          tools: ["Agua tibia con jabón", "Etiquetas de pizarra o pegatinas", "Marcador"],
          steps: [
            "Remoja el frasco en agua con jabón y quita la etiqueta.",
            "Elimina el resto del pegamento con un poco de aceite y vuelve a lavar.",
            "Secca el frasco y comprueba que la tapa cierre bien.",
            "Pon una etiqueta y escribe el contenido y la fecha.",
            "Llénalos con productos secos y colócalos en un estante."
          ]
        },
        {
          id: "gj-vase", title: "Jarrón de vidrio esmerilado", category: "Manualidades", difficulty: "Media", time: "1 hr", emoji: "💐",
          summary: "Dale un acabado esmerilado elegante al frasco con rayas o formas.",
          tools: ["Spray para vidrio opaco", "Cinta de pintor", "Periódico", "Guantes"],
          steps: [
            "Limpia el frasco y déjalo seco por completo.",
            "Pon cinta de pintor en rayas, zigzag o formas donde quieras dejar el vidrio transparente.",
            "Trabaja al aire libre o en un lugar ventilado sobre papel de periódico y usa guantes.",
            "Aplica dos o tres capas ligeras de spray, dejando 10 minutos entre capas.",
            "Quita la cinta al cabo de unos 30 minutos y deja que el jarrón se cure durante la noche."
          ]
        }
      ]
    },

    "cardboard-box": {
      label: "Caja de cartón",
      material: "Cartón corrugado",
      icon: "📦",
      recycling: "Reciclable si está seco y limpio",
      co2: 0.5,
      keywords: ["box", "cardboard", "carton", "package", "boxes"],
      tip: "Aplana la caja y mantén el cartón seco. Quita cintas y etiquetas si quieres compostarlo o usarlo como mantillo.",
      ideas: [
        {
          id: "cb-dividers", title: "Separadores para cajones", category: "Almacenamiento", difficulty: "Fácil", time: "25 min", emoji: "🗂️",
          summary: "Compartimentos a medida para calcetines, cables, material de oficina y utensilios de cocina.",
          tools: ["Regla", "Lápiz", "Tijeras o cúter", "Pegamento o cinta"],
          steps: [
            "Mide la altura, anchura y profundidad del cajón.",
            "Corta tiras de cartón ligeramente más cortas que la altura del cajón para que encajen bien.",
            "Haz ranuras a mitad de las tiras para que puedan encajar como una cuadrícula.",
            "Ensámbalas para formar compartimentos y prueba el ajuste.",
            "Cúbrelas con papel de regalo o tela si quieres y colócalas en el cajón."
          ]
        },
        {
          id: "cb-art", title: "Arte geométrico para pared", category: "Decoración", difficulty: "Media", time: "90 min", emoji: "🔷",
          summary: "Un panel moderno en estilo panal hecho con tiras de cartón.",
          tools: ["Cúter", "Regla metálica", "Pistola de pegamento caliente", "Pintura"],
          steps: [
            "Corta tiras de cartón de unos 4 cm de ancho con cúter y regla, siempre alejando la hoja de tu cuerpo.",
            "Dobla o enrolla las tiras para crear triángulos, hexágonos o celdas curvas.",
            "Pega las celdas unas junto a otras formando un conjunto que te guste.",
            "Pinta la pieza con dos o tres colores y deja que se seque.",
            "Añade un lazo para colgar en la parte posterior y monta la pieza en la pared."
          ]
        },
        {
          id: "cb-mulch", title: "Barrera para malas hierbas", category: "Jardín", difficulty: "Fácil", time: "10 min", emoji: "🌻",
          summary: "Aplasta las malas hierbas y alimenta la tierra con hojas de cartón sencillo.",
          tools: ["Tijeras", "Manguera de jardín", "Mantillo o compost"],
          steps: [
            "Quita cintas, grapas y etiquetas brillantes de la caja y aplánala.",
            "Extiende las láminas sobre la zona con malas hierbas, solapando los bordes unos 10 cm.",
            "Humedece el cartón con agua para que se mantenga en su sitio y empiece a ablandarse.",
            "Cubre con 8 a 10 cm de compost o mantillo.",
            "Déjalo unos días. Las malas hierbas morirán y el cartón se descompondrá en la tierra."
          ]
        },
        {
          id: "cb-scratcher", title: "Almohadilla para arañar", category: "Manualidades", difficulty: "Fácil", time: "40 min", emoji: "🐱",
          summary: "Tu gato va a adorar esta almohadilla resistente y de varias capas.",
          tools: ["Cúter", "Pegamento no tóxico", "Regla", "Catnip (opcional)"],
          steps: [
            "Corta muchas tiras de cartón de unos 5 cm de ancho y la misma longitud.",
            "Enróllalas o apílalas con las ondulaciones hacia arriba.",
            "Guárdalas bien en una tapa de caja o marco para que no se muevan.",
            "Pégalas juntas con pegamento no tóxico y presiona bien.",
            "Espolvorea catnip por encima y pon libros encima durante la noche."
          ]
        }
      ]
    },

    "tin-can": {
      label: "Lata de metal",
      material: "Acero / hojalata",
      icon: "🥫",
      recycling: "Muy reciclable",
      co2: 0.15,
      keywords: ["can", "tin", "cans", "steel", "metal", "soup"],
      tip: "Lava bien la lata y comprueba el borde. Cubre o aplana los bordes afilados antes de usarla.",
      ideas: [
        {
          id: "tc-holder", title: "Maceta para lápices", category: "Almacenamiento", difficulty: "Fácil", time: "20 min", emoji: "🖊️",
          summary: "Un recipiente resistente y colorido para bolígrafos, pinceles y utensilios de cocina.",
          tools: ["Cinta washi o alicates", "Pintura o cordel", "Pegamento fuerte"],
          steps: [
            "Lava la lata y quita la etiqueta.",
            "Cubre el borde con cinta washi o presiónalo con alicates para evitar que quede afilado.",
            "Pinta el exterior con un color vivo y deja que se seque.",
            "Envuelve la lata con cordel o tela y pega con pegamento.",
            "Añade un sellador transparente si quieres que la pintura dure más."
          ]
        },
        {
          id: "tc-lantern", title: "Farol de hojalata perforada", category: "Decoración", difficulty: "Media", time: "90 min", emoji: "🕯️",
          summary: "Martilla un patrón en la lata para conseguir un efecto de luz estrellada por la noche.",
          tools: ["Martillo", "Clavo", "Toalla", "Marcador permanente", "Vela LED", "Alambre"],
          steps: [
            "Rellena la lata con agua y congélala. El hielo evita que el metal se deforme.",
            "Dibuja un patrón de puntos con un rotulador permanente.",
            "Coloca la lata sobre una toalla doblada y golpea cada punto con el martillo y el clavo.",
            "Deja que se derrita el hielo, vacía el agua y seca la lata.",
            "Haz dos agujeros cerca del borde, pasa un asa de alambre y coloca una vela LED."
          ]
        },
        {
          id: "tc-planter", title: "Maceta colgante para hierbas", category: "Jardín", difficulty: "Fácil", time: "25 min", emoji: "🪴",
          summary: "Una fila de macetas coloridas para vallar, balcón o cocina.",
          tools: ["Martillo y clavo", "Cuerda", "Pintura", "Tierra para macetas"],
          steps: [
            "Lava la lata y cubre el borde para evitar cortes.",
            "Haz tres agujeros de drenaje en la base con martillo y clavo.",
            "Pinta la lata y déjala secar bien.",
            "Haz dos agujeros opuestos cerca de la parte superior y pasa la cuerda.",
            "Rellena de tierra, añade hierbas y cuélgala de un gancho o barra."
          ]
        }
      ]
    },

    "tshirt": {
      label: "Camiseta vieja",
      material: "Tela de algodón",
      icon: "👕",
      recycling: "Dona o reutiliza",
      co2: 2.1,
      keywords: ["shirt", "tshirt", "tee", "cloth", "clothes", "fabric", "cotton", "shirts"],
      tip: "Las camisetas manchadas o gastadas son perfectas. La tela elástica se enrolla en los bordes y funciona muy bien para trenzar y hacer nudos.",
      ideas: [
        {
          id: "ts-tote", title: "Bolsa sin coser", category: "Manualidades", difficulty: "Fácil", time: "30 min", emoji: "👜",
          summary: "Una bolsa reutilizable hecha con tijeras y nudos, sin necesidad de coser.",
          tools: ["Tijeras de tela", "Regla o tiza"],
          steps: [
            "Extiende la camiseta y corta ambas mangas, luego amplia el escote en forma de cuenco.",
            "Da la vuelta a la camiseta.",
            "Corta un fleco de 2,5 cm en la parte inferior, de unos 8 a 10 cm de alto, a través de las dos capas.",
            "Ata cada fleco delantero con su correspondiente trasero con un doble nudo para cerrar la base.",
            "Dale la vuelta a la bolsa y pruébala con algo ligero."
          ]
        },
        {
          id: "ts-rug", title: "Alfombrilla de hilo de camiseta", category: "Decoración", difficulty: "Media", time: "2 hrs", emoji: "🧶",
          summary: "Convierte varias camisetas en una alfombrilla trenzada y suave para el baño o junto a la cama.",
          tools: ["Tijeras de tela", "3 o 4 camisetas", "Aguja e hilo"],
          steps: [
            "Corta la parte inferior de cada camiseta y divide el cuerpo en lazos de 3 cm de ancho.",
            "Une los lazos en una tira larga haciendo un pequeño corte en cada uno y pasando uno por el otro.",
            "Estira la tira para que los bordes se enrollen y se conviertan en hilo suave.",
            "Trenza tres hebras para formar una cuerda larga.",
            "Enrolla la trenza en espiral y cose a medida que avanzas."
          ]
        },
        {
          id: "ts-hanger", title: "Colgador de plantas tipo macramé", category: "Jardín", difficulty: "Fácil", time: "20 min", emoji: "🌿",
          summary: "Un tejido suave y elástico que sujeta una maceta pequeña a cualquier altura.",
          tools: ["Tijeras de tela", "Maceta pequeña", "Gancho de pared o techo"],
          steps: [
            "Corta el cuerpo de la camiseta en cuatro tiras de unos 4 cm de ancho y 80 cm de largo y estira cada una.",
            "Dobla las tiras por la mitad y haz un nudo en el extremo doblado para formar un lazo.",
            "Distribuye las tiras y átalas por parejas a unos 15 cm; vuelve a emparejarlas y haz otro nudo a 30 cm.",
            "Reúne todas las tiras en la parte inferior con un último nudo para formar una cesta.",
            "Coloca la maceta dentro y cuélgala del gancho."
          ]
        }
      ]
    },

    "paper": {
      label: "Periódico / papel",
      material: "Fibra de papel",
      icon: "📰",
      recycling: "Muy reciclable",
      co2: 0.05,
      keywords: ["paper", "newspaper", "magazine", "news", "flyer", "papers", "newspapers", "magazines"],
      tip: "Mantén el papel seco y limpio. El periódico funciona muy bien para proyectos de jardín porque se descompone de forma natural.",
      ideas: [
        {
          id: "np-beads", title: "Perlas de papel enrollado", category: "Manualidades", difficulty: "Fácil", time: "45 min", emoji: "📿",
          summary: "Haz perlas de colores para collares, pulseras o llaveros.",
          tools: ["Tijeras", "Pegamento en barra", "Brocheta", "Barniz transparente", "Hilo"],
          steps: [
            "Corta triángulos largos y finos de páginas de revista o periódico, con unos 2 cm de ancho en la base.",
            "Coloca el extremo ancho sobre una brocheta y enrolla el papel hasta la punta.",
            "Pon pegamento en la punta para sellar la perla y deslízala fuera de la brocheta.",
            "Pinta una capa de barniz transparente y deja que se seque sobre la brocheta.",
            "Enhebra las perlas en un hilo con el patrón que quieras."
          ]
        },
        {
          id: "np-pots", title: "Macetas biodegradables para semillas", category: "Jardín", difficulty: "Fácil", time: "15 min", emoji: "🌱",
          summary: "Siembra semillas en macetas de papel que puedes plantar directamente en el suelo.",
          tools: ["Periódico", "Vaso pequeño o lata como molde", "Tierra", "Semillas"],
          steps: [
            "Corta el periódico en tiras de unos 12 cm de ancho.",
            "Envuelve la tira alrededor del vidrio dejando unos 3 cm por la parte inferior.",
            "Dobla el sobrante hacia dentro para formar la base y presiónalo bien.",
            "Saca la maceta de papel del vidrio, rellénala con tierra y siembra las semillas.",
            "Cuando las plántulas estén listas, planta la maceta entera en el suelo; el papel se descompone solo."
          ]
        },
        {
          id: "np-bowl", title: "Cuenco de papel maché", category: "Decoración", difficulty: "Media", time: "3 hrs + secado", emoji: "🥣",
          summary: "Un cuenco decorativo ligero y resistente que puedes pintar a tu gusto.",
          tools: ["Harina y agua", "Cuenco viejo como molde", "Film transparente", "Pintura y barniz"],
          steps: [
            "Mezcla una parte de harina con dos de agua hasta formar una pasta suave.",
            "Cubre el exterior de un cuenco invertido con film para que el papel no se pegue.",
            "Tira periódicos en tiras, sumérgelos en la pasta y añádelos en capas de 4 a 5 sobre el cuenco.",
            "Déjalo secar 24 horas y luego separa con cuidado el cuenco de papel del molde.",
            "Recorta el borde, pinta el cuenco y finaliza con una capa de barniz."
          ]
        }
      ]
    },

    "wood-pallet": {
      label: "Palé de madera",
      material: "Madera recuperada",
      icon: "🪵",
      recycling: "Madera reutilizable",
      co2: 6.0,
      keywords: ["pallet", "wood", "wooden", "timber", "plank", "planks", "pallets"],
      tip: "Busca el sello HT (tratado térmicamente). Evita los palés marcados con MB, porque se les ha tratado con bromuro de metilo.",
      ideas: [
        {
          id: "wp-garden", title: "Huerto vertical de hierbas", category: "Jardín", difficulty: "Media", time: "2 hrs", emoji: "🥬",
          summary: "Una pared vertical y compacta para hierbas o flores hecha con un solo palé.",
          tools: ["Martillo y palanca", "Lija", "Tela para jardín", "Grapadora", "Tornillos y taladro"],
          steps: [
            "Lija bien el palé con guantes y mascarilla.",
            "Grapa la tela de jardín detrás y en la parte inferior y lados para crear bolsas de tierra.",
            "Coloca el palé en vertical contra una pared o valla y fijalo con soportes y tornillos.",
            "Rellena cada hueco con tierra y planta hierbas o flores.",
            "Riega suavemente desde arriba para que el agua descienda por los niveles."
          ]
        },
        {
          id: "wp-shelf", title: "Estantería rústica de pared", category: "Decoración", difficulty: "Media", time: "2 hrs", emoji: "📚",
          summary: "Una cómoda estantería con estilo para libros, plantas y velas.",
          tools: ["Sierra de mano", "Lija", "Taladro", "Mancha para madera", "Anclajes de pared"],
          steps: [
            "Corta un trozo de palé para la longitud de la estantería y lija cada superficie hasta dejarla lisa.",
            "Elige una tabla para la balda y otra para el soporte trasero.",
            "Atornilla la tabla a la parte trasera formando un ángulo recto y añade pequeñas escuadras debajo.",
            "Aplica tinte o aceite para madera y deja que se seque.",
            "Marca la pared, coloca los anclajes y monta la estantería. Comprueba que quede nivelada."
          ]
        },
        {
          id: "wp-table", title: "Mesa de centro de palé", category: "Decoración", difficulty: "Difícil", time: "5 hrs", emoji: "🛋️",
          summary: "Una pieza de estilo llamativo con ruedas, ideal para salones o terrazas.",
          tools: ["Taladro", "Lijadora orbital", "4 ruedas", "Sellador para madera", "Guantes y mascarilla"],
          steps: [
            "Elige dos palés iguales y revisa si tienen clavos o astillas. Elimínalos.",
            "Lija ambos palés bien, empezando con papel grueso y acabando con uno fino.",
            "Apila los palés y atorníllalos desde dentro para ocultar los fijadores.",
            "Pon las cuatro ruedas en las esquinas de la base.",
            "Sella la madera con dos capas de sellador, dejando secar completamente entre capa y capa."
          ]
        },
        {
          id: "wp-rack", title: "Zapatero para botas y zapatos", category: "Almacenamiento", difficulty: "Media", time: "90 min", emoji: "👢",
          summary: "Un soporte resistente para el recibidor que aguanta botas embarradas con facilidad.",
          tools: ["Sierra de mano", "Lija", "Taladro", "Sellador para madera"],
          steps: [
            "Corta el palé por la mitad para crear dos secciones más cortas.",
            "Lija las astillas, prestando especial atención a los bordes.",
            "Coloca una sección vertical como respaldo y la otra de lado para formar la balda.",
            "Fija las dos secciones con tornillos y escuadras.",
            "Sella la madera y coloca el soporte en el recibidor o porche."
          ]
        }
      ]
    },

    "wine-cork": {
      label: "Corcho de vino",
      material: "Corcho natural",
      icon: "🍾",
      recycling: "Reutiliza o deposita en un punto especial",
      co2: 0.01,
      keywords: ["cork", "corks", "stopper", "wine"],
      tip: "El corcho natural es ligero, resistente al agua y fácil de cortar, perfecto para manualidades pequeñas.",
      ideas: [
        {
          id: "wc-board", title: "Tablero de corcho para notas", category: "Decoración", difficulty: "Fácil", time: "45 min", emoji: "📌",
          summary: "Un panel de notas con alfileres que además funciona como pieza decorativa.",
          tools: ["Unos 40 corchos", "Pistola de pegamento caliente", "Marco o base de cartón", "Cúter afilado"],
          steps: [
            "Corta la mitad de los corchos por la longitud para que tengan bordes planos. Hazlo sobre una tabla y alejándote de los dedos.",
            "Dispón los corchos dentro del marco en el patrón que te guste, por filas o en espiga.",
            "Recorta los corchos que deban ajustarse bien en los bordes.",
            "Pega cada corcho con un poco de pegamento y apriétalo bien.",
            "Déjalo secar una hora, cuélgalo y añade tus notas y fotos con chinchetas."
          ]
        },
        {
          id: "wc-markers", title: "Marcas para plantas del jardín", category: "Jardín", difficulty: "Fácil", time: "15 min", emoji: "🏷️",
          summary: "Etiqueta tus plántulas con etiquetas de corcho resistentes a la lluvia.",
          tools: ["Cúter", "Marcador resistente al agua", "Brochetas de bambú"],
          steps: [
            "Haz un pequeño corte en la parte superior de cada corcho y un agujero en la base.",
            "Introduce una brocheta de bambú en el hueco inferior del corcho.",
            "Escribe el nombre de la planta en una pequeña tarjeta con marcador resistente al agua y deslízala en la ranura.",
            "Sella la tarjeta con un poco de cinta transparente si va a llover mucho.",
            "Introduce las brochetas en la tierra junto a cada planta."
          ]
        },
        {
          id: "wc-coasters", title: "Posavasos de corcho", category: "Manualidades", difficulty: "Fácil", time: "30 min", emoji: "☕",
          summary: "Posavasos resistentes al calor para proteger tus mesas con estilo.",
          tools: ["Unos 20 corchos", "Cúter afilado", "Pistola de pegamento caliente", "Fieltro o cartón"],
          steps: [
            "Corta los corchos en discos de 1 cm con un cuchillo afilado, siempre alejando la hoja de ti.",
            "Corta un círculo de fieltro o cartón de unos 10 cm para la base.",
            "Coloca los discos de corcho sobre la base en un círculo muy ajustado.",
            "Pega cada disco, rellenando huecos con recortes más pequeños si hace falta.",
            "Recorta el exceso y deja que se seque antes de usarlo."
          ]
        }
      ]
    }
  };

  /* Mensajes mostrados uno tras otro mientras la "IA" trabaja */
  const LOADING_STEPS = [
    "Preparando imagen…",
    "Detectando bordes y formas…",
    "Clasificando material…",
    "Buscando ideas de reutilización…"
  ];

  /* ---------------------------------------------------------
     2. HELPERS & DOM REFERENCES
     --------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const rand = (min, max) => min + Math.random() * (max - min);
  const round1 = (n) => Math.round(n * 10) / 10;

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Tiny DOM builder: el("div", { class: "x", onClick: fn }, child, "text")
   * Text is always inserted as text nodes, never as HTML.
   */
  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "dataset") Object.assign(node.dataset, value);
      else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2).toLowerCase(), value);
      else node.setAttribute(key, value === true ? "" : String(value));
    }
    for (const child of children.flat()) {
      if (child === null || child === undefined || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  /** Restart a CSS animation class on an element. */
  function retrigger(node, className) {
    node.classList.remove(className);
    void node.offsetWidth; // force reflow
    node.classList.add(className);
  }

  /** Count a number up inside a node. */
  function animateNumber(node, to, duration = 900, decimals = 1) {
    if (prefersReducedMotion) {
      node.textContent = to.toFixed(decimals);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = (to * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const dom = {
    header: $("#header"),
    navToggle: $("#navToggle"),
    siteNav: $("#siteNav"),
    heroCta: $("#heroCta"),
    year: $("#year"),

    stage: $("#stage"),
    video: $("#video"),
    preview: $("#preview"),
    sample: $("#sample"),
    sampleEmoji: $("#sampleEmoji"),
    sampleLabel: $("#sampleLabel"),
    placeholder: $("#placeholder"),
    scanFrame: $("#scanFrame"),
    analyzing: $("#analyzing"),
    analyzeStatus: $("#analyzeStatus"),
    progressFill: $("#progressFill"),
    flash: $("#flash"),
    canvas: $("#canvas"),

    startBtn: $("#startBtn"),
    captureBtn: $("#captureBtn"),
    switchBtn: $("#switchBtn"),
    stopBtn: $("#stopBtn"),
    clearBtn: $("#clearBtn"),
    fileInput: $("#fileInput"),
    fileLabel: $("#fileLabel"),
    cameraAlert: $("#cameraAlert"),
    cameraAlertText: $("#cameraAlertText"),
    samples: $("#samples"),

    results: $("#results"),
    resultsHeading: $("#resultsHeading"),
    resultCard: $("#resultCard"),
    resultImg: $("#resultImg"),
    resultEmoji: $("#resultEmoji"),
    resultBadge: $("#resultBadge"),
    objectName: $("#objectName"),
    materialName: $("#materialName"),
    detectedTip: $("#detectedTip"),
    ringFg: $("#ringFg"),
    confValue: $("#confValue"),
    confLabel: $("#confLabel"),
    alts: $("#alts"),
    statRecycling: $("#statRecycling"),
    statCo2: $("#statCo2"),
    statIdeas: $("#statIdeas"),
    tabs: $("#tabs"),
    ideasGrid: $("#ideasGrid"),
    ideaCount: $("#ideaCount"),
    scanAgainBtn: $("#scanAgainBtn"),

    toasts: $("#toasts"),
    srAnnounce: $("#srAnnounce"),
    aiStatus: $("#aiStatus"),
    sampleButtons: []
  };

  /* App state */
  const state = {
    stream: null,         // active MediaStream
    facing: "environment",// preferred camera: "environment" (rear) or "user" (front)
    mode: "idle",         // idle | camera | preview | analyzing
    busy: false,          // true while the simulated AI is running
    imageUrl: null,       // data URL of the current image (null for sample items)
    lastKey: null,        // last detected material, used to avoid repeats
    result: null,         // { key, confidence, alternatives, manual }
    filter: "Todo"        // active category tab
  };

  /* ---------------------------------------------------------
     3. SCANNER UI STATE
     --------------------------------------------------------- */
  /** Show or hide the right pieces of the stage for each mode. */
  function setMode(mode) {
    state.mode = mode;
    const showMedia = mode === "preview" || mode === "analyzing";

    dom.stage.dataset.mode = mode;
    dom.placeholder.hidden = mode !== "idle";
    dom.video.hidden = mode !== "camera";
    dom.preview.hidden = !(showMedia && state.imageUrl);
    dom.sample.hidden = !(showMedia && !state.imageUrl);
    dom.scanFrame.hidden = !(mode === "camera" || mode === "analyzing");
    dom.scanFrame.classList.toggle("locked", mode === "analyzing");
    dom.analyzing.hidden = mode !== "analyzing";

    updateControls();
  }

  /** Enable or disable buttons depending on state. */
  function updateControls() {
    const live = state.mode === "camera";
    const busy = state.busy;

    dom.startBtn.disabled = live || busy;
    dom.captureBtn.disabled = !live || busy;
    dom.switchBtn.disabled = !live || busy;
    dom.stopBtn.disabled = !live || busy;
    dom.clearBtn.hidden = !(state.mode === "preview" && !busy);
    dom.fileInput.disabled = busy;
    dom.fileLabel.classList.toggle("is-disabled", busy);
    dom.sampleButtons.forEach((btn) => { btn.disabled = busy; });
  }

  function showCameraAlert(message) {
    dom.cameraAlertText.textContent = message;
    dom.cameraAlert.hidden = false;
  }

  function hideCameraAlert() {
    dom.cameraAlert.hidden = true;
    dom.cameraAlertText.textContent = "";
  }

  /** Show an image (data URL) or a sample emoji inside the stage. */
  function setPreview(src, sampleKey = null) {
    state.imageUrl = src || null;
    if (src) {
      dom.preview.src = src;
    } else {
      dom.preview.removeAttribute("src");
      const sample = MATERIALS[sampleKey];
      dom.sampleEmoji.textContent = sample ? sample.icon : "📦";
      dom.sampleLabel.textContent = sample ? `Ejemplo · ${sample.label}` : "Objeto de ejemplo";
    }
    setMode("preview");
  }

  function clearPreview() {
    state.imageUrl = null;
    dom.preview.removeAttribute("src");
  }

  /** Back to the starting state. */
  function resetScanner() {
    if (state.busy) return;
    stopStream();
    clearPreview();
    hideCameraAlert();
    setMode("idle");
  }

  /* ---------------------------------------------------------
     3b. CAMERA
     --------------------------------------------------------- */
  function stopStream() {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
      state.stream = null;
    }
    dom.video.srcObject = null;
  }

  /** Turn a getUserMedia error into a friendly message. */
  function cameraErrorMessage(err) {
    const name = err && err.name ? err.name : "";
    switch (name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "Se bloqueó el acceso a la cámara. Permite el uso desde la barra de direcciones o la configuración del sitio y vuelve a intentarlo. También puedes subir una foto.";
      case "NotFoundError":
      case "DevicesNotFoundError":
        return "No se encontró una cámara en este dispositivo. Sube una foto o prueba un ejemplo.";
      case "NotReadableError":
      case "TrackStartError":
        return "La cámara está ocupada o no está disponible. Cierra otras apps que la puedan estar usando e inténtalo de nuevo.";
      case "OverconstrainedError":
      case "ConstraintNotSatisfiedError":
        return "Esta cámara no admite la configuración solicitada. Prueba a cambiarla o sube una foto.";
      case "SecurityError":
        return "El navegador bloqueó el acceso por motivos de seguridad. Abre la app desde https:// o http://localhost y vuelve a intentarlo.";
      case "AbortError":
        return "La cámara no pudo iniciarse. Inténtalo de nuevo.";
      default:
        return "Algo salió mal al iniciar la cámara. Aun así puedes subir una foto o probar un ejemplo.";
    }
  }

  async function startCamera() {
    if (state.busy || state.mode === "camera") return;
    hideCameraAlert();

    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      const msg = "Tu navegador no admite acceso a la cámara aquí. Usa https:// o http://localhost o sube una foto.";
      showCameraAlert(msg);
      toast("La cámara no está disponible en este navegador.", "error");
      return;
    }

    dom.startBtn.classList.add("is-loading");
    dom.startBtn.setAttribute("aria-busy", "true");
    stopStream();

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: state.facing }, width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false
        });
      } catch (firstError) {
        // Some devices reject specific constraints, so retry with the simplest request.
        if (firstError && (firstError.name === "OverconstrainedError" || firstError.name === "ConstraintNotSatisfiedError")) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw firstError;
        }
      }

      state.stream = stream;
      dom.video.srcObject = stream;

      // Mirror the preview only for front cameras
      const track = stream.getVideoTracks()[0];
      const settings = track && track.getSettings ? track.getSettings() : {};
      dom.video.classList.toggle("mirrored", settings.facingMode === "user" || (!settings.facingMode && state.facing === "user"));

      try { await dom.video.play(); } catch (_) { /* autoplay may be deferred; the stream still works */ }

      clearPreview();
      setMode("camera");
      toast("Cámara lista. Apunta a un objeto y pulsa Capturar.", "success");
    } catch (err) {
      console.error("Camera error:", err);
      stopStream();
      setMode(state.imageUrl ? "preview" : "idle");
      const message = cameraErrorMessage(err);
      showCameraAlert(message);
      toast("No se pudo iniciar la cámara.", "error");
    } finally {
      dom.startBtn.classList.remove("is-loading");
      dom.startBtn.removeAttribute("aria-busy");
      updateControls();
    }
  }

  async function flipCamera() {
    if (state.mode !== "camera" || state.busy) return;
    state.facing = state.facing === "environment" ? "user" : "environment";
    stopStream();
    setMode("idle");
    await startCamera();
  }

  function stopCamera() {
    stopStream();
    setMode(state.imageUrl ? "preview" : "idle");
    toast("Cámara detenida.", "info");
  }

  /** Grab the current video frame, stop the camera and analyse it. */
  function captureFrame() {
    const video = dom.video;
    if (!state.stream || !video.videoWidth || !video.videoHeight) {
      toast("La cámara todavía está calentándose. Prueba otra vez en un segundo.", "warn");
      return;
    }

    try {
      const canvas = dom.canvas;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

      retrigger(dom.flash, "on");
      stopStream();
      setPreview(dataUrl);
      runAnalysis();
    } catch (err) {
      console.error("Capture error:", err);
      toast("No se pudo capturar la imagen. Inténtalo de nuevo.", "error");
    }
  }

  /* ---------------------------------------------------------
     4. UPLOAD / DRAG & DROP / SAMPLES
     --------------------------------------------------------- */
  const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

  function handleFile(file) {
    if (!file || state.busy) return;

    if (!file.type || !file.type.startsWith("image/")) {
      toast("Elige un archivo de imagen (JPG, PNG, WebP…).", "error");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast("La imagen supera los 10 MB. Elige una más pequeña.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      stopStream();
      hideCameraAlert();
      setPreview(String(reader.result));
      runAnalysis();
    };
    reader.onerror = () => toast("No se pudo leer la imagen. Prueba con otra.", "error");
    reader.readAsDataURL(file);
  }

  function useSample(key) {
    if (state.busy || !MATERIALS[key]) return;
    stopStream();
    hideCameraAlert();
    setPreview(null, key);
    runAnalysis({ hintKey: key });
  }

  function buildSamples() {
    dom.samples.replaceChildren(
      ...Object.entries(MATERIALS).map(([key, m]) =>
        el("button", {
          type: "button", class: "chip", dataset: { key },
          "aria-label": `Probar ejemplo: ${m.label}`,
          onClick: () => useSample(key)
        }, el("span", { "aria-hidden": "true" }, m.icon), m.label)
      )
    );
    dom.sampleButtons = $$(".chip", dom.samples);
  }

  /* ---------------------------------------------------------
     5. IA REAL (TensorFlow.js)
     Dos modos, el primero que funcione:
       a) Modelo propio entrenado con Teachable Machine, si existe
          la carpeta ./model/ (model.json + metadata.json + pesos).
       b) MobileNet (ImageNet, 1000 clases generales) y un mapa de
          etiquetas -> materiales de Waste2Value.
     Todo corre en el navegador: las fotos nunca se suben.
     --------------------------------------------------------- */
  const AI_CONFIG = {
    customModelUrl: "./model/model.json",
    customMetadataUrl: "./model/metadata.json",
    // Si la mejor puntuación queda por debajo, la app dice que no reconoce el objeto.
    minScore: { custom: 0.45, imagenet: 0.08 }
  };

  /* Etiquetas de ImageNet (búsqueda por texto) -> material, con un peso de 0 a 1.
     MobileNet no conoce "frasco", "lata", "palé" ni "corcho" como clases propias,
     así que se usan objetos cercanos con pesos menores. Para más precisión,
     entrena un modelo propio (ver instrucciones de Teachable Machine). */
  const IMAGENET_HINTS = {
    "plastic-bottle": { "water bottle": 1, "pop bottle": 1, "soda bottle": 1, "pill bottle": 0.6, "water jug": 0.6, "bottlecap": 0.4 },
    "glass-jar": { "vase": 0.8, "beaker": 0.8, "wine bottle": 0.6, "beer bottle": 0.6, "beer glass": 0.5, "goblet": 0.5, "pitcher": 0.5, "perfume": 0.5, "measuring cup": 0.4, "cocktail shaker": 0.4, "whiskey jug": 0.4 },
    "cardboard-box": { "carton": 1, "packet": 0.8, "crate": 0.6, "envelope": 0.4, "shopping basket": 0.2 },
    "tin-can": { "milk can": 1, "tin opener": 0.7, "can opener": 0.7, "ashcan": 0.6, "trash can": 0.6, "hair spray": 0.5, "oil filter": 0.5, "rain barrel": 0.4, "saltshaker": 0.3 },
    "tshirt": { "jersey": 1, "t-shirt": 1, "tee shirt": 1, "sweatshirt": 0.9, "cardigan": 0.7, "pajama": 0.7, "apron": 0.5, "sarong": 0.5, "poncho": 0.5, "kimono": 0.5, "cloak": 0.4, "jean": 0.4, "miniskirt": 0.4, "sock": 0.4, "quilt": 0.4, "bath towel": 0.4 },
    "paper": { "newspaper": 1, "comic book": 0.7, "book jacket": 0.6, "menu": 0.5, "paper towel": 0.6, "toilet tissue": 0.5, "binder": 0.4, "crossword puzzle": 0.5, "envelope": 0.4 },
    "wood-pallet": { "crate": 0.6, "picket fence": 0.5, "worm fence": 0.5, "park bench": 0.4, "pier": 0.3, "dock": 0.3, "bookcase": 0.3, "chest": 0.3 },
    "wine-cork": { "corkscrew": 0.8, "red wine": 0.5, "wine bottle": 0.3, "bottlecap": 0.3 }
  };

  /** Suma, por material, la probabilidad de las clases de ImageNet que le corresponden. */
  function scoreFromImageNet(predictions) {
    const scores = {};
    for (const { className, probability } of predictions) {
      const name = className.toLowerCase();
      for (const [key, hints] of Object.entries(IMAGENET_HINTS)) {
        let weight = 0;
        for (const [phrase, w] of Object.entries(hints)) {
          if (name.includes(phrase)) weight = Math.max(weight, w);
        }
        if (weight > 0) scores[key] = (scores[key] || 0) + probability * weight;
      }
    }
    return scores;
  }

  /* ----- Estado y carga del modelo ----- */
  let enginePromise = null;

  function setAiStatus(kind, text) {
    dom.aiStatus.dataset.state = kind;
    dom.aiStatus.textContent = text;
  }

  /** Intenta cargar un modelo propio de Teachable Machine desde ./model/. */
  async function loadCustomModel() {
    const response = await fetch(AI_CONFIG.customMetadataUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("No hay modelo propio");
    const meta = await response.json();
    const rawLabels = meta.labels || meta.wordLabels;
    if (!Array.isArray(rawLabels) || !rawLabels.length) throw new Error("metadata.json sin etiquetas");

    // Cada clase debe llamarse como la clave del material ("plastic-bottle")
    // o como su nombre en español ("Botella de plástico").
    const byName = {};
    for (const [key, m] of Object.entries(MATERIALS)) {
      byName[key.toLowerCase()] = key;
      byName[m.label.toLowerCase()] = key;
    }
    const keys = rawLabels.map((label) => byName[String(label).trim().toLowerCase()] || null);
    if (!keys.some(Boolean)) throw new Error("Las clases no coinciden con los materiales");

    const net = await tf.loadLayersModel(AI_CONFIG.customModelUrl);
    return { net, keys, size: meta.imageSize || 224 };
  }

  /** Carga (una sola vez) el mejor motor disponible. */
  function loadModel() {
    if (enginePromise) return enginePromise;

    setAiStatus("loading", "Cargando modelo de IA…");
    enginePromise = (async () => {
      if (!window.tf) throw new Error("TensorFlow.js no se cargó. ¿Hay conexión a internet?");

      try {
        const custom = await loadCustomModel();
        setAiStatus("ready", "IA lista · modelo propio");
        return { type: "custom", ...custom };
      } catch (_) {
        /* No hay modelo propio: se usa MobileNet. */
      }

      if (!window.mobilenet) throw new Error("MobileNet no se cargó. ¿Hay conexión a internet?");
      const model = await window.mobilenet.load({ version: 2, alpha: 1.0 });
      try { // Calentamiento: la primera inferencia es la más lenta
        const warm = tf.zeros([224, 224, 3]);
        await model.classify(warm, 1);
        warm.dispose();
      } catch (_) { /* no es crítico */ }
      setAiStatus("ready", "IA lista · MobileNet (modelo general)");
      return { type: "imagenet", model };
    })().catch((err) => {
      enginePromise = null; // permite reintentar en el siguiente análisis
      setAiStatus("error", "No se pudo cargar la IA. Revisa tu conexión.");
      throw err;
    });

    return enginePromise;
  }

  /** Clasifica con el modelo propio: recorte cuadrado central, 224x224, valores de -1 a 1. */
  async function scoreWithCustom(engine, imgEl) {
    const output = tf.tidy(() => {
      const pixels = tf.browser.fromPixels(imgEl);
      const [h, w] = pixels.shape;
      const side = Math.min(h, w);
      const crop = pixels.slice([Math.floor((h - side) / 2), Math.floor((w - side) / 2), 0], [side, side, 3]);
      const resized = tf.image.resizeBilinear(crop, [engine.size, engine.size]);
      const input = tf.cast(resized, "float32").div(127).sub(1).expandDims(0);
      return engine.net.predict(input);
    });
    const probs = Array.from(await output.data());
    output.dispose();

    const scores = {};
    probs.forEach((p, i) => {
      const key = engine.keys[i];
      if (key) scores[key] = (scores[key] || 0) + p;
    });
    return scores;
  }

  /**
   * Analiza la imagen y devuelve { key, confidence, alternatives } o { unknown: true }.
   * La confianza es el porcentaje de probabilidad del modelo que apunta a ese material.
   */
  async function predictWithAI(imgEl) {
    const engine = await loadModel();
    try { await imgEl.decode(); } catch (_) { /* la imagen ya puede estar lista */ }

    let scores;
    if (engine.type === "custom") {
      scores = await scoreWithCustom(engine, imgEl);
    } else {
      const raw = await engine.model.classify(imgEl, 10);
      scores = scoreFromImageNet(raw);
    }

    const ranked = Object.entries(scores)
      .filter(([, score]) => score * 100 >= 0.1)
      .sort((a, b) => b[1] - a[1]);

    const minScore = AI_CONFIG.minScore[engine.type];
    if (!ranked.length || ranked[0][1] < minScore) return { unknown: true };

    const [bestKey, bestScore] = ranked[0];
    const alternatives = ranked.slice(1, 3).map(([key, score]) => ({ key, confidence: round1(score * 100) }));

    // Si el modelo sólo vio un material, se completan las opciones con otros (sin porcentaje)
    for (const key of shuffle(Object.keys(MATERIALS))) {
      if (alternatives.length >= 2) break;
      if (key !== bestKey && !alternatives.some((a) => a.key === key)) alternatives.push({ key, confidence: null });
    }

    return { key: bestKey, confidence: round1(Math.min(99.9, bestScore * 100)), alternatives };
  }

  /** Mensajes de estado mientras la barra de progreso avanza. */
  async function playLoadingSequence() {
    const total = LOADING_STEPS.length;
    dom.progressFill.style.width = "0%";
    void dom.progressFill.offsetWidth;

    for (let i = 0; i < total; i++) {
      dom.analyzeStatus.textContent = LOADING_STEPS[i];
      dom.progressFill.style.width = `${Math.round(((i + 0.6) / total) * 100)}%`;
      await sleep(450 + Math.random() * 250);
    }
    dom.progressFill.style.width = "100%";
  }

  async function runAnalysis({ hintKey = null } = {}) {
    if (state.busy) return;
    state.busy = true;
    hideCameraAlert();
    setMode("analyzing");

    try {
      let prediction;
      let manual = false;

      if (hintKey && MATERIALS[hintKey]) {
        // Ejemplo de demostración: no hay foto real que analizar
        await playLoadingSequence();
        const others = shuffle(Object.keys(MATERIALS).filter((k) => k !== hintKey)).slice(0, 2);
        prediction = {
          key: hintKey,
          confidence: 100,
          alternatives: others.map((key) => ({ key, confidence: null })),
          note: "Ejemplo de demostración"
        };
        manual = true;
      } else {
        // La IA trabaja mientras corre la animación; si el modelo aún se descarga, se espera
        const aiPromise = predictWithAI(dom.preview).catch((error) => ({ error }));
        await playLoadingSequence();
        dom.analyzeStatus.textContent = "Terminando el análisis…";
        const result = await aiPromise;

        if (result.error) {
          console.error("AI error:", result.error);
          showCameraAlert("No se pudo ejecutar la IA. Comprueba tu conexión a internet (el modelo se descarga la primera vez) y vuelve a intentarlo.");
          toast("No se pudo cargar la IA.", "error");
          setMode("preview");
          return;
        }
        if (result.unknown) {
          showCameraAlert("No pude reconocer el objeto con seguridad. Prueba con mejor luz, un fondo liso y el objeto bien centrado, o mira un ejemplo en el panel lateral.");
          toast("No reconocí el objeto.", "warn");
          setMode("preview");
          return;
        }
        prediction = result;
      }

      renderResult(prediction, manual);
      setMode("preview");

      const m = MATERIALS[prediction.key];
      dom.srAnnounce.textContent = `He detectado ${m.label} con un ${prediction.confidence}% de confianza. Hay ${m.ideas.length} ideas de reutilización más abajo.`;
      toast(`Detectado: ${m.label} (${prediction.confidence}%)`, "success");

      dom.results.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      dom.resultsHeading.focus({ preventScroll: true });
    } catch (err) {
      console.error("Analysis error:", err);
      toast("Algo salió mal durante el análisis. Inténtalo de nuevo.", "error");
      setMode("preview");
    } finally {
      state.busy = false;
      updateControls();
    }
  }

  /* ---------------------------------------------------------
     6. RENDERING
     --------------------------------------------------------- */
  function renderResult(prediction, manual) {
    const m = MATERIALS[prediction.key];
    state.result = { ...prediction, manual };
    state.filter = "Todo";

    dom.results.hidden = false;

    if (state.imageUrl) {
      dom.resultImg.src = state.imageUrl;
      dom.resultImg.hidden = false;
      dom.resultEmoji.hidden = true;
    } else {
      dom.resultImg.hidden = true;
      dom.resultImg.removeAttribute("src");
      dom.resultEmoji.hidden = false;
      dom.resultEmoji.textContent = m.icon;
    }
    dom.resultBadge.textContent = m.icon;

    dom.objectName.textContent = m.label;
    dom.materialName.textContent = m.material;
    dom.detectedTip.textContent = m.tip;
    dom.statRecycling.textContent = m.recycling;
    dom.statCo2.textContent = `≈ ${m.co2 < 0.1 ? m.co2.toFixed(2) : m.co2.toFixed(1)} kg`;
    dom.statIdeas.textContent = String(m.ideas.length);

    dom.confLabel.textContent = prediction.note || (manual ? "Confirmado por ti" : "Confianza de la IA");
    animateConfidence(manual ? 100 : prediction.confidence);

    renderAlternatives();
    renderTabs();
    renderIdeas();
    retrigger(dom.resultCard, "pop");
  }

  function animateConfidence(value) {
    const circumference = 2 * Math.PI * 34;
    dom.ringFg.style.strokeDasharray = String(circumference);
    dom.ringFg.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      dom.ringFg.style.strokeDashoffset = String(circumference * (1 - value / 100));
    }));
    animateNumber(dom.confValue, value, 1000, Number.isInteger(value) ? 0 : 1);
  }

  function renderAlternatives() {
    const { alternatives } = state.result;
    dom.alts.replaceChildren(
      el("span", { class: "alts-label" }, "¿No es exacto? Prueba:"),
      ...alternatives.map((alt) => {
        const m = MATERIALS[alt.key];
        return el("button", { type: "button", class: "chip", onClick: () => chooseAlternative(alt.key) },
          el("span", { "aria-hidden": "true" }, m.icon),
          m.label,
          alt.confidence !== null && alt.confidence !== undefined ? el("small", {}, `${alt.confidence}%`) : null
        );
      })
    );
  }

  /** The user overrides the AI guess with another material. */
  function chooseAlternative(key) {
    if (state.busy || !MATERIALS[key] || !state.result) return;
    const prev = state.result;

    const merged = [
      { key: prev.key, confidence: prev.manual ? null : prev.confidence },
      ...prev.alternatives.filter((a) => a.key !== key && a.key !== prev.key)
    ].slice(0, 3);

    state.lastKey = key;
    renderResult({ key, confidence: 100, alternatives: merged }, true);
    dom.srAnnounce.textContent = `He cambiado a ${MATERIALS[key].label}. Se muestran ${MATERIALS[key].ideas.length} ideas.`;
    toast(`Cambiado a ${MATERIALS[key].label}`, "info");
    dom.results.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  }

  /* ----- Category tabs ----- */
  function renderTabs() {
    const ideas = MATERIALS[state.result.key].ideas;
    const categories = ["Todo", ...CATEGORIES];

    dom.tabs.replaceChildren(
      ...categories.map((cat) => {
        const count = cat === "Todo" ? ideas.length : ideas.filter((i) => i.category === cat).length;
        const selected = cat === state.filter;
        return el("button", {
          type: "button", role: "tab", class: "tab", dataset: { cat },
          "aria-selected": String(selected), tabindex: selected ? "0" : "-1",
          disabled: count === 0,
          onClick: () => setFilter(cat)
        }, cat, el("span", { class: "tab-count" }, count));
      })
    );
  }

  function setFilter(cat) {
    state.filter = cat;
    $$(".tab", dom.tabs).forEach((tab) => {
      const selected = tab.dataset.cat === cat;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    renderIdeas();
  }

  /** Arrow-key navigation for the tab list (accessibility). */
  function onTabsKeydown(event) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;

    const tabs = $$(".tab:not(:disabled)", dom.tabs);
    if (!tabs.length) return;
    const current = tabs.findIndex((t) => t === document.activeElement);
    let next = current < 0 ? 0 : current;

    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;

    event.preventDefault();
    tabs[next].focus();
    tabs[next].click();
  }

  /* ----- Idea cards ----- */
  function renderIdeas() {
    const all = MATERIALS[state.result.key].ideas;
    const ideas = state.filter === "Todo" ? all : all.filter((i) => i.category === state.filter);

    dom.ideasGrid.replaceChildren(...ideas.map((idea, index) => buildIdeaCard(idea, index)));
    dom.ideaCount.textContent = `${ideas.length} idea${ideas.length === 1 ? "" : "s"} · ${state.filter}`;
  }

  function buildIdeaCard(idea, index) {
    const panelId = `panel-${idea.id}`;
    const total = idea.steps.length;
    let done = 0;

    const card = el("article", { class: "idea", style: `--i:${index}` });
    const progressText = el("span", { class: "progress-text" }, `0 / ${total} pasos completados`);
    const progressFill = el("span", { class: "progress-fill" });

    const list = el("ol", { class: "steps" },
      idea.steps.map((text, i) => {
        const inputId = `${idea.id}-step-${i}`;
        const box = el("input", { type: "checkbox", id: inputId });

        box.addEventListener("change", () => {
          done += box.checked ? 1 : -1;
          progressText.textContent = `${done} / ${total} pasos completados`;
          progressFill.style.width = `${(done / total) * 100}%`;
          const complete = done === total;
          card.classList.toggle("complete", complete);
          if (complete) toast(`"${idea.title}" completado. ¡Muy bien!`, "success");
        });

        return el("li", {},
          el("label", { for: inputId },
            box,
            el("span", { class: "step-num", "aria-hidden": "true" }, i + 1),
            el("span", { class: "step-text" }, text)
          )
        );
      })
    );

    const panel = el("div", { class: "panel", id: panelId, inert: true },
      el("div", { class: "panel-inner" },
        el("h4", { class: "panel-title" }, "Guía paso a paso"),
        list,
        el("div", { class: "progress", "aria-hidden": "true" }, progressFill),
        progressText
      )
    );

    const toggleLabel = el("span", {}, "Ver guía paso a paso");
    const toggle = el("button", {
      type: "button", class: "btn btn-green btn-sm toggle",
      "aria-expanded": "false", "aria-controls": panelId
    }, toggleLabel, el("span", { class: "chev", "aria-hidden": "true" }));

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggleLabel.textContent = open ? "Ocultar guía" : "Ver guía paso a paso";
      card.classList.toggle("open", open);
      panel.inert = !open;
    });

    card.append(
      el("div", { class: "idea-head" },
        el("span", { class: "idea-emoji", "aria-hidden": "true" }, idea.emoji),
        el("div", {},
          el("h3", { class: "idea-title" }, idea.title),
          el("div", { class: "badges" },
            el("span", { class: `badge diff-${idea.difficulty.toLowerCase()}` }, idea.difficulty),
            el("span", { class: "badge" }, `⏱ ${idea.time}`),
            el("span", { class: "badge cat" }, idea.category)
          )
        )
      ),
      el("p", { class: "idea-summary" }, idea.summary),
      el("div", {},
        el("p", { class: "tools-title" }, "Herramientas y materiales"),
        el("ul", { class: "tool-list" }, idea.tools.map((tool) => el("li", {}, tool)))
      ),
      toggle,
      panel
    );

    return card;
  }

  /* ---------------------------------------------------------
     7. UI CHROME: toasts, nav, reveal animations
     --------------------------------------------------------- */
  const TOAST_ICONS = { success: "✅", error: "⛔", warn: "⚠️", info: "ℹ️" };

  function toast(message, type = "info", duration = 4200) {
    // Keep at most three toasts on screen
    while (dom.toasts.children.length >= 3) dom.toasts.firstElementChild.remove();

    const node = el("div", { class: `toast toast-${type}`, role: type === "error" ? "alert" : "status" },
      el("span", { "aria-hidden": "true" }, TOAST_ICONS[type] || TOAST_ICONS.info),
      el("span", {}, message)
    );
    dom.toasts.append(node);
    requestAnimationFrame(() => node.classList.add("show"));

    setTimeout(() => {
      node.classList.remove("show");
      setTimeout(() => node.remove(), 400);
    }, duration);
  }

  function setupNav() {
    dom.navToggle.addEventListener("click", () => {
      const open = dom.siteNav.classList.toggle("open");
      dom.navToggle.setAttribute("aria-expanded", String(open));
    });

    $$("a", dom.siteNav).forEach((link) => {
      link.addEventListener("click", () => {
        dom.siteNav.classList.remove("open");
        dom.navToggle.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("scroll", () => {
      dom.header.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
  }

  function setupReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  /* ---------------------------------------------------------
     8. INIT
     --------------------------------------------------------- */
  function bindEvents() {
    dom.startBtn.addEventListener("click", startCamera);
    dom.captureBtn.addEventListener("click", captureFrame);
    dom.switchBtn.addEventListener("click", flipCamera);
    dom.stopBtn.addEventListener("click", stopCamera);
    dom.clearBtn.addEventListener("click", resetScanner);

    dom.fileInput.addEventListener("change", () => {
      handleFile(dom.fileInput.files && dom.fileInput.files[0]);
      dom.fileInput.value = ""; // allow picking the same file again
    });

    // Drag & drop onto the stage
    ["dragenter", "dragover"].forEach((evt) =>
      dom.stage.addEventListener(evt, (e) => {
        e.preventDefault();
        if (!state.busy) dom.stage.classList.add("dragging");
      })
    );
    ["dragleave", "dragend", "drop"].forEach((evt) =>
      dom.stage.addEventListener(evt, () => dom.stage.classList.remove("dragging"))
    );
    dom.stage.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      handleFile(file);
    });

    dom.tabs.addEventListener("keydown", onTabsKeydown);

    dom.scanAgainBtn.addEventListener("click", () => {
      resetScanner();
      document.getElementById("scanner").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      setTimeout(() => dom.startBtn.focus({ preventScroll: true }), 500);
    });

    dom.heroCta.addEventListener("click", () => {
      setTimeout(() => dom.startBtn.focus({ preventScroll: true }), 700);
    });

    // Always release the camera when leaving the page
    window.addEventListener("pagehide", stopStream);
  }

  function init() {
    dom.year.textContent = String(new Date().getFullYear());
    buildSamples();
    loadModel().catch(() => {}); // precarga el modelo en segundo plano
    setupNav();
    setupReveal();
    bindEvents();
    setMode("idle");
  }

  init();
})();