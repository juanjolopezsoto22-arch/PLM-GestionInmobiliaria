document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. INDICADORES ECONÓMICOS
    // ==========================================
    const fetchIndicadores = async () => {
        const ufValue = document.getElementById('uf-value');
        const dolarValue = document.getElementById('dolar-value');

        try {
            const response = await fetch('https://mindicador.cl/api');
            if (!response.ok) throw new Error('No se pudo obtener la información de indicadores');
            const data = await response.json();

            if (ufValue && data.uf) {
                const ufStr = '$' + data.uf.valor.toLocaleString('es-CL');
                ufValue.textContent = ufStr;
                localStorage.setItem('lastUf', ufStr);
            }
            if (dolarValue && data.dolar) {
                const dolStr = '$' + data.dolar.valor.toLocaleString('es-CL');
                dolarValue.textContent = dolStr;
                localStorage.setItem('lastDol', dolStr);
            }
        } catch (error) {
            console.warn('Error al conectar con la API de indicadores. Usando datos guardados en caché local:', error);
            // Si la API falla, ya se habrán colocado los valores desde el script inline en index.html
        }
    };

    fetchIndicadores();

    // ==========================================
    // 2. MENÚ MÓVIL (HAMBURGUESA)
    // ==========================================
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksContainer = document.getElementById('nav-links');

    if (mobileMenu && navLinksContainer) {
        mobileMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Animación del botón hamburguesa
            const bars = mobileMenu.querySelectorAll('.bar');
            if (mobileMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Cerrar menú al presionar un enlace
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                mobileMenu.classList.remove('active');
                const bars = mobileMenu.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // ==========================================
    // 4. CARRUSEL HERO (CROSS-FADE ANIMADO)
    // ==========================================
    const heroSlider = document.getElementById('hero-slider');
    const dotsContainer = document.getElementById('hero-dots');
    
    if (heroSlider) {
        const bgImages = [
            'algarobo/Calera.jpg',
            'algarobo/4.jpg',
            'algarobo/3r.jpg',
            'algarobo/2.jpg',
            'algarobo/19.JPG',
            'algarobo/6.jpg',
            'algarobo/16.JPG',
            'algarobo/12.JPG',
        ];
        let currentBgIndex = 0;
        let slideInterval;

        // Crear slides y dots
        bgImages.forEach((imgSrc, index) => {
            // Slide
            const slide = document.createElement('div');
            slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
            slide.style.backgroundImage = `url('${imgSrc}')`;
            heroSlider.appendChild(slide);

            // Dot
            if (dotsContainer) {
                const dot = document.createElement('button');
                dot.className = `dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Ir a diapositiva ${index + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    resetTimer();
                });
                dotsContainer.appendChild(dot);
            }
        });

        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.dot');

        const goToSlide = (index) => {
            slides[currentBgIndex].classList.remove('active');
            if (dots.length) dots[currentBgIndex].classList.remove('active');
            
            currentBgIndex = index;
            
            slides[currentBgIndex].classList.add('active');
            if (dots.length) dots[currentBgIndex].classList.add('active');
        };

        const nextSlide = () => {
            const nextIndex = (currentBgIndex + 1) % bgImages.length;
            goToSlide(nextIndex);
        };

        const resetTimer = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 6000);
        };

        // Iniciar temporizador
        resetTimer();
    }

    // ==========================================
    // 5. INTERACCIONES DEL HERO
    // ==========================================
    const btnVenta = document.getElementById("btn-venta");
    const btnRemodelar = document.getElementById("btn-remodelar");
    const btnTasaciones = document.getElementById("btn-tasaciones");
    const mensajeHero = document.getElementById("mensaje-hero");

    const mostrarMensajeHero = (texto) => {
        if (!mensajeHero) return;
        mensajeHero.style.opacity = '0';
        setTimeout(() => {
            mensajeHero.textContent = texto;
            mensajeHero.style.opacity = '1';
        }, 250);
    };

    const scrollToSection = (id) => {
        const targetElement = document.getElementById(id);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (btnVenta) btnVenta.addEventListener("click", () => scrollToSection("propiedades"));
    if (btnRemodelar) {
        btnRemodelar.addEventListener("click", () => {
            mostrarMensajeHero("Especialistas en remodelación de cocinas, baños y proyectos integrales.");
        });
    }
    if (btnTasaciones) {
        btnTasaciones.addEventListener("click", () => {
            mostrarMensajeHero("Tasaciones profesionales para conocer el valor comercial real de tu inmueble.");
        });
    }

    // ==========================================
    // 6. SERVICIOS TARJETAS (WHATSAPP REDIRECT)
    // ==========================================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const numero = "+56995093892";
            const serviceName = card.getAttribute('data-service');
            const texto = `Hola PLM Gestión Inmobiliaria, estoy navegando por su web y me gustaría contactar por el servicio de: ${serviceName}.`;
            const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(texto)}`;
            window.open(url, '_blank', 'noopener');
        });
        
        // Soporte para teclado (Accesibilidad)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    const btnWhatsappFooter = document.getElementById("btn-whatsapp");
    if (btnWhatsappFooter) {
        btnWhatsappFooter.addEventListener("click", () => {
            const numero = "+56995093892";
            const texto = "Hola PLM Gestión Inmobiliaria, estoy navegando por su web y me gustaría obtener más información.";
            const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(texto)}`;
            window.open(url, '_blank', 'noopener');
        });
    }

    // ==========================================
    // 7. BASE DE DATOS DE PROPIEDADES
    // ==========================================
    const propiedades = [
        {
            id: 1,
            titulo: "Departamento 3D2B - Algarrobo",
            precio: "UF 6.100",
            precioNum: 6100,
            tipo: "departamento",
            comuna: "algarrobo",
            detalles: "Maravillosa Vista Punta Fraile. 3 Dormitorios, 2 Baños, Estacionamiento.",
            imagen: "algarobo/algarrobo.jpg",
            linkPortal: "https://departamento.mercadolibre.cl/MLC-1850251757-departamento-3d2b-maravillosa-vista-punta-fraile-algarrobo-_JM",
            detallesLargos: "Precioso departamento ubicado en sector exclusivo de Algarrobo. Cuenta con 3 cómodos dormitorios, 2 baños completos y cocina equipada. Estacionamiento privado y una vista espectacular directa a Punta Fraile. Condominio con áreas verdes, piscina y control de acceso 24/7."
        },
        {
            id: 2,
            titulo: "Depto Vista Al Mar - Algarrobo",
            precio: "UF 7.290",
            precioNum: 7290,
            tipo: "departamento",
            comuna: "algarrobo",
            detalles: "100 m², 3 Dormitorios, 2 Baños.",
            imagen: "algarrobo3.jpg",
            linkPortal: "https://departamento.mercadolibre.cl/MLC-1883657949-departamento-con-vista-al-mar-en-algarrobo-3d2b-_JM#origin=share&sid=share&action=whatsapp",
            detallesLargos: "Espectacular departamento de 100 m² totales. Vista panorámica garantizada al océano. Cómodo espacio con gran iluminación natural, 3 dormitorios amplios y 2 baños. Excelente estado de conservación, terminaciones de calidad y terraza."
        },
        {
            id: 3,
            titulo: "Casa Espectacular - Alto Macul",
            precio: "UF 11.300",
            precioNum: 11300,
            tipo: "casa",
            comuna: "macul",
            detalles: "390 m², 3 Dormitorios, 3 Baños.",
            imagen: "macul.jpg",
            linkPortal: "https://casa.mercadolibre.cl/MLC-1888977771-casa-espectacular-3d3b-maravillosa-vista-alto-macul-_JM#origin=share&sid=share&action=whatsapp",
            detallesLargos: "Hermosa propiedad familiar en el prestigioso sector de Alto Macul. Cuenta con un terreno total de 390 m² que incluye jardín formado, terrazas y quincho. Interior espacioso de 3 dormitorios (principal en suite con walk-in closet), 3 baños y sala de estar."
        },
        {
            id: 4,
            titulo: "Departamento 3D2B - Punta Fraile",
            precio: "UF 7.900",
            precioNum: 7900,
            tipo: "departamento",
            comuna: "algarrobo",
            detalles: "86 m², 5to Piso, Orientación Norponiente, 3 Dormitorios, 2 Baños.",
            imagen: "algarobo/PF2.jpg",
            linkPortal: "https://departamento.mercadolibre.cl/MLC-1850200153#origin=share&sid=share&action=whatsapp",
            detallesLargos: "Estupendo departamento de 86 m² construidos en 5to piso, con orientación norponiente que asegura sol de tarde. 3 dormitorios, 2 baños, living-comedor con salida a terraza. Incluye estacionamiento y bodega en condominio consolidado."
        },
        {
            id: 5,
            titulo: "Parcela 5D3B - Calera de Tango",
            precio: "UF 13.000",
            precioNum: 13000,
            tipo: "parcela",
            comuna: "calera de tango",
            detalles: "5.620 m² Terreno, 280 m² Construidos, 5 Dormitorios, 3 Baños.",
            imagen: "algarobo/Calera.jpg",
            linkPortal: "https://inmueble.mercadolibre.cl/MLC-1850277873-casa-5d-3b-parcela-en-condominio-calera-de-tango-_JM#origin=share&sid=share&action=whatsapp",
            detallesLargos: "Increíble parcela con gran conectividad y seguridad en condominio cerrado. Terreno plano de 5.620 m² con derechos de agua de riego y jardín consolidado. Casa de 280 m² construidos con estructura sólida, 5 amplios dormitorios y 3 baños."
        },
        {
            id: 6,
            titulo: "Casa / Oficina - Barrio El Golf",
            precio: "UF 19.900",
            precioNum: 19900,
            tipo: "comercial",
            comuna: "providencia",
            detalles: "190 m² Construidos, 5 Privados, 4 Baños, 5 Estacionamientos.",
            imagen: "algarobo/tienda.jpg",
            linkPortal: "https://casa.mercadolibre.cl/MLC-3560169422-casa-oficina-inversionistas-barrio-el-golf-_JM#origin=share&sid=share&action=whatsapp",
            detallesLargos: "Propiedad comercial premium ideal para oficinas corporativas, estudios de profesionales o inversionistas. 190 m² de planta con 5 privados bien distribuidos, 4 baños y espacio de recepción. Cuenta con 5 amplios estacionamientos en patio frontal."
        },
        {
            id: 7,
            titulo: "Departamento en San Miguel - Ciudad del Niño",
            precio: "UF 3.449",
            precioNum: 3449,
            tipo: "departamento",
            comuna: "san miguel",
            detalles: "55 m², 2 Dormitorios, 2 Baños, 1 Estacionamiento, Piso 7, Orientación Oeste.",
            imagen: "algarobo/sanmiguel.jpg",
            linkPortal: "https://departamento.mercadolibre.cl/MLC-1850174241-departamento-en-venta-en-ciudad-del-nino-_JM#origin=share&sid=share&action=whatsapp",
            detallesLargos: "Moderno departamento de 55 m² ubicado a pasos de estación de Metro Ciudad del Niño. Cuenta con 2 dormitorios, 2 baños, cocina de concepto semi-abierto, terraza y 1 estacionamiento. Edificio equipado con piscina, conserjería y quincho."
        },
        {
            id: 8,
            titulo: "Depto en Venta - Centro Histórico",
            precio: "UF 3.550",
            precioNum: 3550,
            tipo: "departamento",
            comuna: "santiago centro",
            detalles: "55 m², 2 Dormitorios, 2 Baños, Piso 12, Orientación Sur, Sin Estacionamiento.",
            imagen: "algarobo/centro1.jpg",
            linkPortal: "https://api.whatsapp.com/send?phone=+56995093892&text=Hola,%20me%20interesa%20el%20Depto%20en%20Venta%20en%20Centro%20Hist%C3%B3rico%20de%20UF%203.550%20(55%20m%C2%B2,%202%20Dormitorios,%202%20Ba%C3%B1os)",
            textoBoton: "Consultar por WhatsApp",
            detallesLargos: "Estupendo departamento remodelado en el corazón del centro de Santiago. 2 dormitorios y 2 baños con excelentes terminaciones, ubicado en piso 12 con orientación sur. Muy buena conectividad a transporte público, comercio y centros culturales."
        },
        {
            id: 9,
            titulo: "Departamento en Venta - Santiago Centro",
            precio: "UF 2.380",
            precioNum: 2380,
            tipo: "departamento",
            comuna: "santiago centro",
            detalles: "25 m², 1 Dormitorio, 1 Baño, Piso 14, Orientación Norte.",
            imagen: "algarobo/centro2.jpg",
            linkPortal: "https://departamento.mercadolibre.cl/MLC-1850277839-departamento-en-venta-en-centro-historico-de-santiago-_JM#origin=share&sid=share&action=whatsapp",
            detallesLargos: "Ideal para inversionistas o profesionales independientes. Acogedor departamento estudio/1 dormitorio en el centro histórico de Santiago. Vista despejada norte en piso 14. Excelente rentabilidad garantizada."
        },
        {
            id: 10,
            titulo: "Depto en Venta - Centro Histórico",
            precio: "UF 3.299",
            precioNum: 3299,
            tipo: "departamento",
            comuna: "santiago centro",
            detalles: "40 m², 2 Dormitorios, 2 Baños, Piso 8, Orientación Poniente.",
            imagen: "algarobo/centro3.jpg",
            linkPortal: "https://departamento.mercadolibre.cl/MLC-1850174271-departamento-en-venta-en-centro-historico-_JM#origin=share&sid=share&action=whatsapp",
            detallesLargos: "Departamento funcional de 40 m² con excelente distribución. 2 dormitorios cómodos y 2 baños completos. Living con ventanales hacia orientación poniente. Ubicado en edificio tranquilo y seguro."
        },
        {
            id: 11,
            titulo: "Galpón/Bodega + Edificio - Stgo Centro",
            precio: "UF 43.900",
            precioNum: 43900,
            tipo: "comercial",
            comuna: "santiago centro",
            detalles: "1.490 m² Totales, Edificio 3 Pisos, Corriente Trifásica, 10 Baños.",
            imagen: "algarobo/fabrica.jpg",
            linkPortal: "https://inmueble.mercadolibre.cl/MLC-1850264857-galpon-bodega-edificio-de-3-pisos-santiago-centro-_JM#origin=share&sid=share&action=whatsapp",
            detallesLargos: "Gran infraestructura industrial y administrativa con excelente conectividad en Santiago Centro. Cuenta con un galpón libre de 1000 m² de doble altura, oficinas administrativas en edificio moderno de 3 pisos, corriente trifásica de alta potencia y 10 baños de servicio."
        }
    ];

    // Contenedores HTML
    const container = document.getElementById("properties-container");
    const filterTipo = document.getElementById("filter-tipo");
    const filterComuna = document.getElementById("filter-comuna");
    const sortPrecio = document.getElementById("sort-precio");
    const searchInput = document.getElementById("search-input");
    const btnBorrarFiltros = document.getElementById("btn-borrar-filtros");

    // Modal HTML elements
    const propertyModal = document.getElementById("property-modal");
    const modalCloseBtn = document.getElementById("modal-close");
    const modalContent = document.getElementById("modal-body-content");

    // ==========================================
    // 8. RENDERIZADO DE PROPIEDADES EN GRILLA
    // ==========================================
    const renderizarPropiedades = (lista) => {
        if (!container) return;
        container.innerHTML = "";

        if (lista.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0; color: var(--text-light);">
                    <i class="fa-solid fa-circle-question" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 16px;"></i>
                    <p style="font-size: 1.15rem; font-weight: 500;">No encontramos propiedades con estos filtros.</p>
                    <p style="font-size: 0.95rem; margin-top: 8px;">Prueba buscando otra comuna o limpiando la barra de búsqueda.</p>
                </div>
            `;
            return;
        }

        lista.forEach(propiedad => {
            const card = document.createElement("div");
            card.className = "property-card glass-panel";
            card.setAttribute("tabindex", "0");
            card.innerHTML = `
                <div class="property-img-wrapper">
                    <img src="${propiedad.imagen}" alt="${propiedad.titulo}" class="property-img" loading="lazy">
                    <span class="property-tag">${propiedad.tipo}</span>
                </div>
                <div class="property-content">
                    <h3 class="property-title">${propiedad.titulo}</h3>
                    <div class="property-price">${propiedad.precio}</div>
                    <p class="property-details">${propiedad.detalles}</p>
                    <button class="btn-property" onclick="event.stopPropagation();">
                        ${propiedad.textoBoton ? '<i class="fa-brands fa-whatsapp"></i> ' + propiedad.textoBoton : '<i class="fa-solid fa-circle-info"></i> Ver Detalles'}
                    </button>
                </div>
            `;

            // Click en la tarjeta abre el modal de detalles
            card.addEventListener("click", () => {
                abrirModalPropiedad(propiedad);
            });

            // Soporte accesibilidad teclado
            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    abrirModalPropiedad(propiedad);
                }
            });

            // Acción del botón interno de la tarjeta
            const btnInner = card.querySelector(".btn-property");
            if (btnInner) {
                btnInner.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (propiedad.textoBoton) {
                        // Es un botón personalizado de WhatsApp
                        window.open(propiedad.linkPortal, '_blank', 'noopener');
                    } else {
                        // Botón genérico de ver detalles
                        abrirModalPropiedad(propiedad);
                    }
                });
            }

            container.appendChild(card);
        });
    };

    // ==========================================
    // 9. LÓGICA DE FILTRADO Y BÚSQUEDA EN TIEMPO REAL
    // ==========================================
    const aplicarFiltrosYOrden = () => {
        let filtradas = [...propiedades];

        // 1. Filtro por palabra clave (Buscador)
        if (searchInput && searchInput.value.trim() !== "") {
            const query = searchInput.value.toLowerCase().trim();
            filtradas = filtradas.filter(p => 
                p.titulo.toLowerCase().includes(query) || 
                p.detalles.toLowerCase().includes(query) ||
                (p.detallesLargos && p.detallesLargos.toLowerCase().includes(query)) ||
                p.comuna.toLowerCase().includes(query)
            );
        }

        // 2. Filtro por Tipo de Propiedad
        if (filterTipo && filterTipo.value !== "todos") {
            const val = filterTipo.value;
            filtradas = filtradas.filter(p => p.tipo === val);
        }

        // 3. Filtro por Comuna
        if (filterComuna && filterComuna.value !== "todas") {
            const val = filterComuna.value;
            filtradas = filtradas.filter(p => p.comuna === val);
        }

        // 4. Ordenamiento por precio
        if (sortPrecio && sortPrecio.value !== "default") {
            const val = sortPrecio.value;
            if (val === "asc") {
                filtradas.sort((a, b) => a.precioNum - b.precioNum);
            } else if (val === "desc") {
                filtradas.sort((a, b) => b.precioNum - a.precioNum);
            }
        }

        renderizarPropiedades(filtradas);
    };

    // Listeners de filtros
    if (searchInput) searchInput.addEventListener('input', aplicarFiltrosYOrden);
    if (filterTipo) filterTipo.addEventListener('change', aplicarFiltrosYOrden);
    if (filterComuna) filterComuna.addEventListener('change', aplicarFiltrosYOrden);
    if (sortPrecio) sortPrecio.addEventListener('change', aplicarFiltrosYOrden);

    // Borrar Filtros
    if (btnBorrarFiltros) {
        btnBorrarFiltros.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterTipo) filterTipo.value = "todos";
            if (filterComuna) filterComuna.value = "todas";
            if (sortPrecio) sortPrecio.value = "default";
            aplicarFiltrosYOrden();
        });
    }

    // ==========================================
    // 10. MODAL DE DETALLES (GLASSMORPHIC MODAL)
    // ==========================================
    const abrirModalPropiedad = (propiedad) => {
        if (!propertyModal || !modalContent) return;

        // Limpiar contenido anterior
        modalContent.innerHTML = "";

        // Construir contenido del modal
        modalContent.innerHTML = `
            <img src="${propiedad.imagen}" alt="${propiedad.titulo}" class="modal-img">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${propiedad.titulo}</h3>
                    <div class="modal-price">${propiedad.precio}</div>
                </div>
                <div class="modal-info-grid">
                    <div class="modal-info-item">
                        <i class="fa-solid fa-map-location-dot"></i>
                        <span><strong>Comuna:</strong> ${propiedad.comuna.charAt(0).toUpperCase() + propiedad.comuna.slice(1)}</span>
                    </div>
                    <div class="modal-info-item">
                        <i class="fa-solid fa-house"></i>
                        <span><strong>Tipo:</strong> ${propiedad.tipo.charAt(0).toUpperCase() + propiedad.tipo.slice(1)}</span>
                    </div>
                </div>
                <p class="modal-description">${propiedad.detallesLargos || propiedad.detalles}</p>
                <div class="modal-buttons">
                    <a href="${propiedad.linkPortal}" target="_blank" rel="noopener" class="btn-modal-secondary">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver en Portal Inmobiliario
                    </a>
                    <button class="btn-modal-primary" id="btn-modal-wsp">
                        <i class="fa-brands fa-whatsapp"></i> Preguntar por WhatsApp
                    </button>
                </div>
            </div>
        `;

        // Configurar botón WhatsApp directo del modal
        const btnModalWsp = modalContent.querySelector("#btn-modal-wsp");
        if (btnModalWsp) {
            btnModalWsp.addEventListener("click", () => {
                const numero = "+56995093892";
                const texto = `Hola PLM Gestión Inmobiliaria, me interesa el inmueble "${propiedad.titulo}" de valor ${propiedad.precio}. Me gustaría recibir más detalles.`;
                const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(texto)}`;
                window.open(url, '_blank', 'noopener');
            });
        }

        // Mostrar modal con animaciones
        propertyModal.classList.add("active");
        propertyModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Desactivar scroll fondo

        // Foco de accesibilidad en el modal
        modalCloseBtn.focus();
    };

    const cerrarModalPropiedad = () => {
        if (!propertyModal) return;
        propertyModal.classList.remove("active");
        propertyModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Reactivar scroll fondo
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", cerrarModalPropiedad);
    }

    // Cerrar haciendo click fuera del modal
    if (propertyModal) {
        propertyModal.addEventListener("click", (e) => {
            if (e.target === propertyModal) {
                cerrarModalPropiedad();
            }
        });
        
        // Cerrar presionando tecla ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && propertyModal.classList.contains("active")) {
                cerrarModalPropiedad();
            }
        });
    }

    // ==========================================
    // 11. INICIALIZACIÓN Y RENDER PREVIO
    // ==========================================
    renderizarPropiedades(propiedades);

});