/* ==========================================================================
   PLM Gestión Inmobiliaria — Agente IA Flotante
   ========================================================================== */

(function () {
    'use strict';

    // ── Datos del agente ──────────────────────────────────────────────────────────
    const AGENT_NAME = 'Bruno';
    const WA_NUMBER  = '+56995093892';
    const WA_URL     = `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=`;

    // Propiedades conocidas (espejo de script.js)
    const propiedadesDB = [
        { titulo: "Depto 3D2B - Algarrobo",          precio: "UF 6.100",  tipo: "departamento", comuna: "Algarrobo",        detalles: "Maravillosa Vista Punta Fraile. 3 Dormitorios, 2 Baños, Estacionamiento." },
        { titulo: "Depto Vista Al Mar - Algarrobo",   precio: "UF 7.290",  tipo: "departamento", comuna: "Algarrobo",        detalles: "100 m², 3 Dormitorios, 2 Baños." },
        { titulo: "Casa Espectacular - Alto Macul",   precio: "UF 11.300", tipo: "casa",         comuna: "Macul",            detalles: "390 m², 3 Dormitorios, 3 Baños." },
        { titulo: "Depto 3D2B - Punta Fraile",        precio: "UF 7.900",  tipo: "departamento", comuna: "Algarrobo",        detalles: "86 m², 5to Piso, Orientación Norponiente." },
        { titulo: "Parcela 5D3B - Calera de Tango",   precio: "UF 13.000", tipo: "parcela",      comuna: "Calera de Tango",  detalles: "5.620 m² Terreno, 280 m² Construidos." },
        { titulo: "Casa/Oficina - Barrio El Golf",    precio: "UF 19.900", tipo: "comercial",    comuna: "Providencia",      detalles: "190 m² Construidos, 5 Privados, 5 Estacionamientos." },
        { titulo: "Depto en San Miguel",              precio: "UF 3.449",  tipo: "departamento", comuna: "San Miguel",       detalles: "55 m², 2 Dormitorios, 2 Baños." },
        { titulo: "Depto Centro Histórico (55 m²)",   precio: "UF 3.550",  tipo: "departamento", comuna: "Santiago Centro",  detalles: "55 m², 2 Dormitorios, 2 Baños." },
        { titulo: "Depto Centro Histórico (25 m²)",   precio: "UF 2.380",  tipo: "departamento", comuna: "Santiago Centro",  detalles: "25 m², 1 Dormitorio, 1 Baño." },
        { titulo: "Depto Centro Histórico (40 m²)",   precio: "UF 3.299",  tipo: "departamento", comuna: "Santiago Centro",  detalles: "40 m², 2 Dormitorios, 2 Baños." },
        { titulo: "Galpón/Bodega - Stgo Centro",      precio: "UF 43.900", tipo: "comercial",    comuna: "Santiago Centro",  detalles: "1.490 m² Totales, Edificio 3 Pisos." },
    ];

    // ── Obtener UF y Dólar desde el DOM ──────────────────────────────────────
    function getUF() {
        const el = document.getElementById('uf-value');
        return el ? el.textContent.trim() : 'No disponible';
    }
    function getDolar() {
        const el = document.getElementById('dolar-value');
        return el ? el.textContent.trim() : 'No disponible';
    }

    // \u2500\u2500 Base de conocimiento del asistente \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    const DEFAULT_RESPONSE = '\u00a1Ok! \ud83d\udc4d Aqu\u00ed estoy, cualquier cosa que necesites saber sobre PLM Gesti\u00f3n Inmobiliaria, solo pregunta.';

    function listarPropiedades(lista, introText) {
        if (!lista.length) {
            return '\u00a1Es una propiedad espectacular! \ud83c\udfe1 Cu\u00e9ntame la comuna (Algarrobo, Macul, Providencia, San Miguel, Santiago Centro o Calera de Tango) o el tipo (casa, departamento, parcela) y te paso los datos exactos.';
        }
        const items = lista.map(p => `\u2022 **${p.titulo}** \u2014 ${p.precio}. ${p.detalles}`).join('\n');
        return `${introText}\n\n${items}`;
    }

    const KB = [
        {
            tags: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'que tal'],
            responder: () => `\u00a1Hola! \ud83d\udc4b \u00bfEn qu\u00e9 puedo ayudarte hoy?`
        },
        {
            tags: ['como estas', 'como andas', 'como te va', 'todo bien'],
            responder: () => `\u00a1Muy bien, gracias! \ud83d\ude0a Dispuesto a ayudarte en lo que necesites sobre PLM Gesti\u00f3n Inmobiliaria.`
        },
        {
            tags: ['como te llamas', 'cual es tu nombre', 'quien eres', 'tu nombre'],
            responder: () => `Me llamo **${AGENT_NAME}** \ud83e\udd16, el asistente virtual de PLM Gesti\u00f3n Inmobiliaria. Estoy aqu\u00ed para ayudarte con propiedades, precios, servicios y todo lo que necesites saber sobre la p\u00e1gina.`
        },
        {
            tags: ['precio del dolar', 'precio del uf', 'valor del dolar', 'valor del uf', 'precio dolar', 'precio uf', 'valor dolar', 'valor uf', 'cuanto esta el dolar', 'cuanto esta el uf', 'cuanto vale el dolar', 'cuanto vale el uf', 'uf', 'dolar', 'indicador', 'indicadores'],
            responder: () => `Los valores de hoy son:\n\n**UF:** ${getUF()}\n**D\u00f3lar:** ${getDolar()}\n\nEstos datos se actualizan autom\u00e1ticamente desde el Diario Financiero.`
        },
        {
            tags: ['propiedad', 'propiedades', 'inmueble', 'inmuebles', 'venta', 'arriendo'],
            responder: () => listarPropiedades(propiedadesDB, 'Estas son nuestras propiedades destacadas:') + '\n\nPuedes ver todos los detalles y filtrar por tipo o comuna en la secci\u00f3n **Propiedades Destacadas** de la p\u00e1gina.'
        },
        {
            priority: 1,
            tags: ['departamento', 'departamentos', 'depto', 'deptos'],
            responder: () => listarPropiedades(propiedadesDB.filter(p => p.tipo === 'departamento'), 'Estos son los departamentos disponibles:')
        },
        {
            priority: 1,
            tags: ['casa', 'casas'],
            responder: () => listarPropiedades(propiedadesDB.filter(p => p.tipo === 'casa'), 'Estas son las casas disponibles:')
        },
        {
            priority: 1,
            tags: ['parcela', 'parcelas', 'terreno', 'terrenos'],
            responder: () => listarPropiedades(propiedadesDB.filter(p => p.tipo === 'parcela'), 'Estas son las parcelas disponibles:')
        },
        {
            priority: 1,
            tags: ['comercial', 'galpon', 'bodega', 'oficina', 'oficinas'],
            responder: () => listarPropiedades(propiedadesDB.filter(p => p.tipo === 'comercial'), 'Estas son las propiedades comerciales disponibles:')
        },
        {
            tags: ['precio', 'precios', 'valor', 'cuanto cuesta', 'costo'],
            responder: () => {
                const precios = propiedadesDB.map(p => parseInt(p.precio.replace(/[^\d]/g, ''), 10));
                const min = Math.min(...precios).toLocaleString('es-CL');
                const max = Math.max(...precios).toLocaleString('es-CL');
                return `Nuestras propiedades van desde **UF ${min}** hasta **UF ${max}**, seg\u00fan tipo y ubicaci\u00f3n.\n\nRevisa el listado completo en la secci\u00f3n de Propiedades o preg\u00fantame por una comuna espec\u00edfica.`;
            }
        },
        {
            tags: ['servicio', 'servicios', 'remodelacion', 'tasacion', 'corretaje', 'legal', 'asesoria'],
            responder: () => `Ofrecemos cuatro servicios principales:\n\n\u2022 **Corretaje de Propiedades** \u2014 venta y arriendo con gesti\u00f3n completa.\n\u2022 **Tasaci\u00f3n Inmobiliaria** \u2014 valoraci\u00f3n profesional de tu propiedad.\n\u2022 **Asesor\u00eda Comercial y Legal** \u2014 acompa\u00f1amiento en todo el proceso.\n\u2022 **Remodelaciones y Proyectos** \u2014 cocinas, ba\u00f1os, pisos y m\u00e1s.\n\nPuedes ver el detalle en la secci\u00f3n **Servicios Integrales**.`
        },
        {
            tags: ['contacto', 'whatsapp', 'wsp', 'telefono', 'email', 'correo', 'asesor'],
            responder: () => `Puedes contactarnos por:\n\n\ud83d\udce7 contacto@plm.cl\n\ud83d\udcf1 **WhatsApp**: +56 9 9509 3892\n\nUn asesor te responder\u00e1 a la brevedad.`
        },
        {
            tags: ['navego', 'navegar', 'como uso', 'ayuda', 'como funciona', 'pagina'],
            responder: () => `Puedes explorar la p\u00e1gina as\u00ed:\n\n\u2022 **Propiedades** \u2014 mira y filtra las propiedades disponibles.\n\u2022 **Servicios** \u2014 conoce todo lo que ofrecemos.\n\u2022 **Nosotros** \u2014 por qu\u00e9 elegir PLM Gesti\u00f3n.\n\u2022 **Contacto** \u2014 escr\u00edbenos o abre WhatsApp directo.\n\n\u00bfQuieres que te lleve a alguna de estas secciones?`
        },
        {
            tags: ['credito', 'hipotecario', 'hipoteca'],
            responder: () => `Para cr\u00e9ditos hipotecarios te recomendamos comparar tasas entre bancos y considerar el pie disponible. Nuestro equipo puede orientarte seg\u00fan tu situaci\u00f3n espec\u00edfica \u2014 cont\u00e1ctanos por **WhatsApp** y te ayudamos a evaluar tus opciones.`
        },
        {
            tags: ['proceso de compra', 'como comprar', 'comprar propiedad'],
            responder: () => `El proceso de compra incluye: elecci\u00f3n de la propiedad, firma de promesa de compraventa, gesti\u00f3n del cr\u00e9dito (si aplica), y firma de escritura definitiva. Te acompa\u00f1amos en cada etapa \u2014 escr\u00edbenos por **WhatsApp** para partir.`
        },
        {
            tags: ['rentabilidad', 'inversion'],
            responder: () => `La rentabilidad depende de la ubicaci\u00f3n, tipo de propiedad y modalidad (venta o arriendo). Podemos ayudarte a evaluar el potencial de inversi\u00f3n de una propiedad espec\u00edfica \u2014 preg\u00fantame por una comuna o conversemos por **WhatsApp**.`
        },
        {
            tags: ['subsidio', 'subsidios'],
            responder: () => `Existen subsidios habitacionales seg\u00fan tu perfil (primera vivienda, clase media, etc.). Un asesor puede revisar contigo si calificas \u2014 cont\u00e1ctanos por **WhatsApp** para m\u00e1s detalles.`
        },
        {
            tags: ['por que elegir', 'porque elegirnos', 'quienes son', 'quienes somos', 'por que plm', 'confianza'],
            responder: () => `En PLM Gesti\u00f3n creemos en:\n\n\u2022 **Tu historia es lo primero** \u2014 escuchamos tus objetivos y construimos confianza.\n\u2022 **Entendemos tu prioridad** \u2014 dise\u00f1amos la estrategia ideal para tu tiempo y patrimonio.\n\u2022 **Gesti\u00f3n sin preocupaciones** \u2014 nos encargamos de lo legal, comercial y de marketing.\n\nM\u00e1s detalles en la secci\u00f3n **\u00bfPor qu\u00e9 PLM Gesti\u00f3n?**.`
        },
        {
            tags: ['ubicacion', 'direccion', 'donde estan', 'donde quedan', 'oficina ubicada'],
            responder: () => `Estamos ubicados en **Providencia, Santiago, Chile**. Puedes escribirnos por WhatsApp o correo para coordinar una reuni\u00f3n.`
        }
    ];

    const comunasAliases = [
        { comuna: 'Algarrobo', tags: ['algarrobo'] },
        { comuna: 'Macul', tags: ['macul'] },
        { comuna: 'Calera de Tango', tags: ['calera de tango', 'calera'] },
        { comuna: 'Providencia', tags: ['providencia', 'barrio el golf', 'el golf'] },
        { comuna: 'San Miguel', tags: ['san miguel'] },
        { comuna: 'Santiago Centro', tags: ['santiago centro', 'centro historico'] }
    ];
    comunasAliases.forEach(({ comuna, tags }) => {
        KB.push({
            priority: 1,
            tags,
            responder: () => listarPropiedades(propiedadesDB.filter(p => p.comuna === comuna), `En **${comuna}** tenemos:`)
        });
    });

    // \u2500\u2500 Normalizaci\u00f3n y tolerancia a errores de escritura \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function distanciaEdicion(a, b) {
        const filas = a.length + 1;
        const columnas = b.length + 1;
        const dp = Array.from({ length: filas }, () => new Array(columnas).fill(0));
        for (let i = 0; i < filas; i++) dp[i][0] = i;
        for (let j = 0; j < columnas; j++) dp[0][j] = j;
        for (let i = 1; i < filas; i++) {
            for (let j = 1; j < columnas; j++) {
                dp[i][j] = a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[filas - 1][columnas - 1];
    }

    function palabrasCoinciden(palabraInput, palabraTag) {
        if (palabraInput === palabraTag) return true;
        if (palabraTag.length <= 3) return false; // muy corta: exige coincidencia exacta
        const toleranciaMax = palabraTag.length <= 6 ? 1 : 2;
        return distanciaEdicion(palabraInput, palabraTag) <= toleranciaMax;
    }

    function tagCoincideConTexto(tagClean, tokensInput) {
        const palabrasTag = tagClean.split(' ');
        return palabrasTag.every(palabraTag => tokensInput.some(palabraInput => palabrasCoinciden(palabraInput, palabraTag)));
    }

    function getBotResponse(input) {
        const clean = normalizarTexto(input);
        const tokensInput = clean.split(' ').filter(Boolean);
        let best = null;
        let bestScore = 0;
        let bestPriority = -1;
        for (const entry of KB) {
            const priority = entry.priority || 0;
            for (const tag of entry.tags) {
                const tagClean = normalizarTexto(tag);
                if (tagCoincideConTexto(tagClean, tokensInput)) {
                    const score = tagClean.length;
                    if (priority > bestPriority || (priority === bestPriority && score > bestScore)) {
                        bestPriority = priority; bestScore = score; best = entry;
                    }
                }
            }
        }
        return best ? best.responder() : DEFAULT_RESPONSE;
    }

    // ── Renderiza texto markdown simple (negrita, saltos) ─────────────────────
    function renderMarkdown(text) {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    // ── HTML del agente ───────────────────────────────────────────────────────
    function buildAgentHTML() {
        const wrapper = document.createElement('div');
        wrapper.id = 'plm-agent-root';
        wrapper.innerHTML = `
        <!-- Burbuja flotante del agente -->
        <button id="plm-agent-bubble" aria-label="Abrir asistente PLM" title="¿Necesitas ayuda?">
            <div class="plm-bubble-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" opacity="0.3"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                    <path d="M21 10.5C21 6.36 17.64 3 13.5 3S6 6.36 6 10.5c0 2.85 1.59 5.32 3.94 6.64L9 21l4.5-2.5c.33.02.66.03 1 .03C18.64 18.53 21 14.88 21 10.5z" fill="currentColor"/>
                </svg>
            </div>
            <div class="plm-bubble-pulse"></div>
        </button>

        <!-- Tooltip inicial de bienvenida -->
        <div id="plm-agent-tooltip" class="plm-tooltip" role="complementary">
            <button class="plm-tooltip-close" aria-label="Cerrar sugerencia">×</button>
            <p>👋 ¿Necesitas ayuda para navegar la página?</p>
            <span>Pregúntame sobre propiedades, precios o contacto</span>
        </div>

        <!-- Panel de chat -->
        <div id="plm-agent-panel" class="plm-panel" aria-hidden="true" role="dialog" aria-label="Asistente PLM Gestión">
            <div class="plm-panel-header">
                <div class="plm-header-avatar">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10.5C21 6.36 17.64 3 13.5 3S6 6.36 6 10.5c0 2.85 1.59 5.32 3.94 6.64L9 21l4.5-2.5c.33.02.66.03 1 .03C18.64 18.53 21 14.88 21 10.5z" fill="white"/>
                    </svg>
                </div>
                <div class="plm-header-info">
                    <strong>${AGENT_NAME}</strong>
                    <span class="plm-status"><span class="plm-status-dot"></span> En línea</span>
                </div>
                <button class="plm-panel-close" id="plm-panel-close" aria-label="Cerrar asistente">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </button>
            </div>

            <div class="plm-messages" id="plm-messages"></div>

            <!-- Chips de sugerencias rápidas -->
            <div class="plm-suggestions" id="plm-suggestions">
                <button class="plm-chip" data-query="Ver propiedades disponibles">🏘️ Propiedades</button>
                <button class="plm-chip" data-query="¿Cuál es el valor del UF y Dólar hoy?">📊 UF y Dólar</button>
                <button class="plm-chip" data-query="¿Qué servicios ofrecen?">🛠️ Servicios</button>
                <button class="plm-chip" data-query="¿Cómo los contacto?">📞 Contacto</button>
                <button class="plm-chip" data-query="¿Cuáles son los precios de las propiedades?">💰 Precios</button>
                <button class="plm-chip" data-query="¿Cómo navego la página?">🗺️ Navegar</button>
            </div>

            <div class="plm-input-area">
                <input
                    type="text"
                    id="plm-input"
                    class="plm-input"
                    placeholder="Escribe tu pregunta..."
                    autocomplete="off"
                    maxlength="300"
                    aria-label="Escribir mensaje al asistente"
                >
                <button id="plm-send" class="plm-send-btn" aria-label="Enviar mensaje">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        </div>
        `;
        document.body.appendChild(wrapper);
    }

    // ── Estado del agente ─────────────────────────────────────────────────────
    let isPanelOpen = false;
    let tooltipShown = false;
    let tooltipDismissed = false;
    let isTyping = false;

    // ── Lógica del chat ───────────────────────────────────────────────────────
    function addMessage(content, from = 'bot', isHTML = false) {
        const messages = document.getElementById('plm-messages');
        if (!messages) return;

        const div = document.createElement('div');
        div.className = `plm-msg plm-msg-${from}`;

        if (from === 'bot') {
            div.innerHTML = `
                <div class="plm-msg-avatar">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M21 10.5C21 6.36 17.64 3 13.5 3S6 6.36 6 10.5c0 2.85 1.59 5.32 3.94 6.64L9 21l4.5-2.5c.33.02.66.03 1 .03C18.64 18.53 21 14.88 21 10.5z" fill="currentColor"/></svg>
                </div>
                <div class="plm-msg-bubble">${isHTML ? content : renderMarkdown(content)}</div>
            `;
        } else {
            div.innerHTML = `<div class="plm-msg-bubble">${renderMarkdown(content)}</div>`;
        }

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        if (isTyping) return;
        isTyping = true;
        const messages = document.getElementById('plm-messages');
        const div = document.createElement('div');
        div.className = 'plm-msg plm-msg-bot plm-typing-wrapper';
        div.id = 'plm-typing';
        div.innerHTML = `
            <div class="plm-msg-avatar">
                <svg viewBox="0 0 24 24" fill="none"><path d="M21 10.5C21 6.36 17.64 3 13.5 3S6 6.36 6 10.5c0 2.85 1.59 5.32 3.94 6.64L9 21l4.5-2.5c.33.02.66.03 1 .03C18.64 18.53 21 14.88 21 10.5z" fill="currentColor"/></svg>
            </div>
            <div class="plm-msg-bubble plm-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
        isTyping = false;
        const t = document.getElementById('plm-typing');
        if (t) t.remove();
    }

    function sendMessage(text) {
        if (!text || !text.trim()) return;
        addMessage(text, 'user');

        const input = document.getElementById('plm-input');
        if (input) input.value = '';

        showTyping();
        const delay = 700 + Math.random() * 600;
        setTimeout(() => {
            hideTyping();
            const response = getBotResponse(text);
            addMessage(response, 'bot');

            // Si menciona WhatsApp, agrega botón de acción
            if (response.toLowerCase().includes('whatsapp') || response.toLowerCase().includes('wsp') || response.toLowerCase().includes('asesor')) {
                setTimeout(() => {
                    addMessage(`<a href="${WA_URL}${encodeURIComponent('Hola PLM Gestión Inmobiliaria, estoy navegando por su web y me gustaría obtener más información.')}" target="_blank" rel="noopener" class="plm-wa-btn"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Abrir WhatsApp ahora</a>`, 'bot', true);
                }, 400);
            }
        }, delay);
    }

    // ── Apertura/Cierre del panel ─────────────────────────────────────────────
    function openPanel() {
        isPanelOpen = true;
        const panel = document.getElementById('plm-agent-panel');
        const bubble = document.getElementById('plm-agent-bubble');
        const tooltip = document.getElementById('plm-agent-tooltip');

        if (panel) { panel.classList.add('active'); panel.setAttribute('aria-hidden', 'false'); }
        if (bubble) bubble.classList.add('panel-open');
        if (tooltip) tooltip.classList.remove('visible');

        // Si es la primera vez, enviar mensaje de bienvenida
        const messages = document.getElementById('plm-messages');
        if (messages && messages.children.length === 0) {
            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    addMessage(`¡Hola! 👋 Soy **Bruno**, el asistente virtual de PLM Gestión Inmobiliaria.\n\n¿En qué puedo ayudarte hoy? Puedo informarte sobre propiedades disponibles, créditos hipotecarios, proceso de compra, rentabilidad, subsidios, nuestros servicios o cómo contactarnos.\n\nUsa los botones de abajo o escribe directamente tu pregunta. 😊`, 'bot');
                }, 900);
            }, 100);
        }

        // Enfocar input
        setTimeout(() => {
            const input = document.getElementById('plm-input');
            if (input) input.focus();
        }, 350);
    }

    function closePanel() {
        isPanelOpen = false;
        const panel = document.getElementById('plm-agent-panel');
        const bubble = document.getElementById('plm-agent-bubble');
        if (panel) { panel.classList.remove('active'); panel.setAttribute('aria-hidden', 'true'); }
        if (bubble) bubble.classList.remove('panel-open');
    }

    // ── Tooltip de bienvenida (auto-aparece) ─────────────────────────────────
    function showTooltip() {
        if (tooltipDismissed || isPanelOpen) return;
        const tooltip = document.getElementById('plm-agent-tooltip');
        if (tooltip) { tooltip.classList.add('visible'); tooltipShown = true; }
    }

    function hideTooltip() {
        const tooltip = document.getElementById('plm-agent-tooltip');
        if (tooltip) tooltip.classList.remove('visible');
    }

    // ── Event Listeners ───────────────────────────────────────────────────────
    function bindEvents() {
        // Burbuja flotante
        document.getElementById('plm-agent-bubble')?.addEventListener('click', () => {
            if (isPanelOpen) closePanel(); else openPanel();
            hideTooltip();
        });

        // Cerrar panel
        document.getElementById('plm-panel-close')?.addEventListener('click', closePanel);

        // Cerrar tooltip
        document.querySelector('.plm-tooltip-close')?.addEventListener('click', (e) => {
            e.stopPropagation();
            tooltipDismissed = true;
            hideTooltip();
        });

        // Enviar con botón
        document.getElementById('plm-send')?.addEventListener('click', () => {
            const input = document.getElementById('plm-input');
            if (input) sendMessage(input.value.trim());
        });

        // Enviar con Enter
        document.getElementById('plm-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const input = document.getElementById('plm-input');
                if (input) sendMessage(input.value.trim());
            }
        });

        // Chips de sugerencias
        document.querySelectorAll('.plm-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const q = chip.getAttribute('data-query');
                if (q) sendMessage(q);
            });
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isPanelOpen) closePanel();
        });

        // Cerrar haciendo clic fuera
        document.addEventListener('click', (e) => {
            const root = document.getElementById('plm-agent-root');
            if (isPanelOpen && root && !root.contains(e.target)) {
                closePanel();
            }
        });

        // Scroll → mostrar tooltip después de cierto scroll
        let scrollTooltipShown = false;
        window.addEventListener('scroll', () => {
            if (!scrollTooltipShown && !tooltipDismissed && !isPanelOpen && window.scrollY > 300) {
                scrollTooltipShown = true;
                showTooltip();
                setTimeout(hideTooltip, 7000);
            }
        }, { passive: true });
    }

    // ── Inicialización ────────────────────────────────────────────────────────
    function init() {
        buildAgentHTML();
        bindEvents();

        // Tooltip automático después de 4 segundos
        setTimeout(() => {
            if (!isPanelOpen && !tooltipDismissed) {
                showTooltip();
                setTimeout(() => {
                    if (!isPanelOpen) hideTooltip();
                }, 8000);
            }
        }, 4000);
    }

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
