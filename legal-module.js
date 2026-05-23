(function() {
    const projectName = document.title || "Maksym Didukh Project";
    const contactEmail = "didukh.maxim@gmail.com";

    // 1. СТИЛИ (Базовое оформление + инъекция динамических переменных темы для всего сайта)
    const styleId = 'dm-styles-integrated';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* ГЛОБАЛЬНЫЕ НАСТРОЙКИ ТЕМЫ ДЛЯ ВСЕХ СТРАНИЦ */
            body {
                background-color: var(--theme-bg) !important;
                color: var(--theme-text) !important;
                transition: background-color 0.15s ease, color 0.15s ease !important;
            }
            /* Авто-применение темы к стандартным элементам сайта */
            body p, body span, body li, body div:not([class^="dm-"]) { 
                color: var(--theme-text-muted, var(--theme-text)) ; 
            }
            body h1, body h2, body h3, body h4, body h5, body h6 { 
                color: var(--theme-accent, var(--theme-text)) ; 
            }
            body a:not([class^="dm-"]) { 
                color: var(--theme-accent) ; 
            }
            body button:not([class^="dm-"]) {
                background-color: var(--theme-accent) ;
                color: var(--theme-bg) ;
            }

            /* Изолированные стили служебного интерфейса */
            #dm-legal-consent, .dm-universal-footer {
                all: initial !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                box-sizing: border-box !important;
            }
            .dm-lock-hard {
                overflow: hidden !important;
                height: 100vh !important;
                width: 100vw !important;
                position: fixed !important;
            }
            #dm-legal-consent {
                position: fixed !important; top: 0 !important; left: 0 !important;
                width: 100vw !important; height: 100vh !important;
                background: rgba(0,0,0,0.98) !important;
                z-index: 2147483647 !important;
                display: flex !important; align-items: center !important; justify-content: center !important;
                backdrop-filter: blur(25px) !important;
                padding: 10px !important; 
            }
            .dm-consent-box {
                background: #161b22 !important; color: #c9d1d9 !important; 
                padding: 20px 15px !important;
                border-radius: 12px !important; 
                max-width: 550px !important; width: 100% !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
                border: 1px solid #30363d !important; text-align: center !important;
                box-shadow: 0 20px 60px rgba(0,0,0,1) !important;
            }
            .dm-btn-group { 
                display: flex !important; 
                flex-wrap: wrap !important;
                gap: 10px !important; 
                justify-content: center !important; 
                margin-top: 20px !important; 
            }
            .dm-btn {
                background: #238636 !important; color: #fff !important; border: none !important;
                padding: 12px 20px !important; border-radius: 6px !important; cursor: pointer !important;
                font-weight: bold !important; font-size: 14px !important; transition: background 0.2s !important;
                flex: 1 1 120px !important;
            }
            .dm-btn:hover { background: #2ea043 !important; }
            .dm-btn-secondary { background: #484f58 !important; }
            .dm-btn-secondary:hover { background: #6e7681 !important; }
            
            .dm-universal-footer {
                position: fixed !important; bottom: 0 !important; left: 0 !important; width: 100% !important;
                background: rgba(13, 17, 23, 0.95) !important; color: #8b949e !important; text-align: center !important;
                padding: 8px 5px !important; font-size: 11px !important; z-index: 2147483646 !important;
                border-top: 1px solid #30363d !important; 
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 2px !important;
                flex-wrap: wrap !important;
            }
            .dm-universal-footer a { color: #58a6ff !important; text-decoration: none !important; margin: 0 5px !important; font-weight: bold !important; }
            
            /* Контейнер кружка-палитры */
            .dm-inline-picker-wrapper {
                display: inline-flex !important;
                align-items: center !important;
                vertical-align: middle !important;
                margin-left: 5px !important;
                background: rgba(255, 255, 255, 0.1) !important;
                padding: 2px !important;
                border-radius: 50% !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3) !important;
                transition: transform 0.2s ease !important;
            }
            .dm-inline-picker-wrapper:hover {
                transform: scale(1.15) !important;
                background: rgba(255, 255, 255, 0.2) !important;
            }
            .dm-round-picker {
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                appearance: none !important;
                width: 18px !important;
                height: 18px !important;
                background: transparent !important;
                border: none !important;
                cursor: pointer !important;
                border-radius: 50% !important;
                display: block !important;
            }
            .dm-round-picker::-webkit-color-swatch-wrapper { padding: 0 !important; }
            .dm-round-picker::-webkit-color-swatch {
                border: 1px solid #ffffff !important;
                border-radius: 50% !important;
                background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red) !important;
            }
            .dm-round-picker::-moz-color-swatch {
                border: 1px solid #ffffff !important;
                border-radius: 50% !important;
                background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red) !important;
            }

            @media (max-height: 250px) {
                .dm-universal-footer { position: static !important; }
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    let isAccepted = false;
    const globalStorageKey = 'siteBackgroundColor';

    // Вспомогательная функция: парсинг HEX в чистые RGB компоненты
    function hexToRgbComponents(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Вспомогательная функция: перевод HEX в CSS формат rgb()
    function hexToRgbString(hex) {
        const comp = hexToRgbComponents(hex);
        return comp ? `rgb(${comp.r}, ${comp.g}, ${comp.b})` : null;
    }

    // ГЕНЕРАЦИЯ ЦВЕТОВОЙ ТЕМЫ НА ОСНОВЕ ЦВЕТА ФОНА
    function applyThemeVariables(hexColor) {
        const rgb = hexToRgbComponents(hexColor);
        if (!rgb) return;

        // Вычисляем яркость по стандарту HSP (высокое значение = светлый фон)
        const hsp = Math.sqrt(0.299 * (rgb.r * rgb.r) + 0.587 * (rgb.g * rgb.g) + 0.114 * (rgb.b * rgb.b));
        
        let textColor, textColorMuted, accentColor;

        if (hsp > 127.5) {
            // Светлая тема сайта
            textColor = '#0d1117';
            textColorMuted = '#484f58';
            accentColor = rgb.g > 200 && rgb.r < 100 ? '#0066cc' : '#58a6ff'; // адаптация акцента
        } else {
            // Темная тема сайта
            textColor = '#c9d1d9';
            textColorMuted = '#8b949e';
            accentColor = '#58a6ff';
        }

        // Записываем переменные темы в корневой элемент documentElement, чтобы они накрыли все страницы
        const root = document.documentElement;
        root.style.setProperty('--theme-bg', hexColor);
        root.style.setProperty('--theme-text', textColor);
        root.style.setProperty('--theme-text-muted', textColorMuted);
        root.style.setProperty('--theme-accent', accentColor);
    }

    // ЖЕСТКАЯ ПРОВЕРКА И ПРИНУДИТЕЛЬНОЕ УДЕРЖАНИЕ ТЕМЫ НА ВСЕХ СТРАНИЦАХ
    function enforceSavedColor() {
        if (!document.body) return;
        const savedColor = localStorage.getItem(globalStorageKey);
        
        if (savedColor) {
            const currentBg = window.getComputedStyle(document.body).backgroundColor;
            const targetRgbStr = hexToRgbString(savedColor);

            // Проверяем соответствие текущего фона с сохраненным
            if (currentBg !== targetRgbStr && currentBg !== savedColor) {
                applyThemeVariables(savedColor);
            }
            
            // Синхронизируем значение бегунка на палитре
            const picker = document.getElementById('dmBgPicker');
            if (picker && picker.value !== savedColor) {
                picker.value = savedColor;
            }
        }
    }

    // Инициализируем тему незамедлительно
    const initColor = localStorage.getItem(globalStorageKey);
    if (initColor) applyThemeVariables(initColor);

    function mount() {
        if (isAccepted || document.getElementById('dm-legal-consent')) return;

        document.documentElement.classList.add('dm-lock-hard');

        const modal = document.createElement('div');
        modal.id = 'dm-legal-consent';
        modal.innerHTML = `
           <div class="dm-consent-box">
    <h2 style="color:#58a6ff !important; margin:0 0 10px 0 !important; font-size:22px !important; font-weight:bold !important; background:none !important;">
        Rechtliche Bestätigung
    </h2>

    <p style="color:#c9d1d9 !important; margin-bottom:15px !important; font-size:14px !important; background:none !important;">
        Sie nutzen gerade das Projekt: <span style="color:#238636 !important; font-weight:bold !important;">${projectName}</span>
    </p>

    <div style="margin-bottom:20px !important; font-size:13px !important; background:none !important;">
        <a href="https://dmamax.netlify.app/impressum" target="_blank" style="color:#58a6ff !important;">Impressum</a> |
        <a href="https://dmamax.netlify.app/datenschutz" target="_blank" style="color:#58a6ff !important;">Datenschutz</a>
    </div>

    <div style="text-align:left !important; background:#0d1117 !important; padding:15px !important; border-radius:8px !important; border-left:4px solid #58a6ff !important; font-size:12.5px !important; line-height:1.6 !important; color:#c9d1d9 !important; margin-bottom:20px !important;">
        • <b>Inhalte:</b> Nutzer können Inhalte (Texte, Zeichnungen, Nachrichten) erstellen. Diese können im Rahmen der Funktionalität gespeichert werden.<br><br>
        • <b>Externe Inhalte:</b> Einige Projekte können externe Webseiten oder Dienste einbinden. Für deren Inhalte sind die jeweiligen Betreiber verantwortlich.<br><br>
        • <b>Verhaltensregeln:</b> Die Nutzung für rechtswidrige, beleidigende oder schädliche Inhalte ist untersagt.<br><br>
        • <b>Datenverarbeitung:</b> Es können technische Daten (z. B. IP-Adresse, Browser, Zeitstempel) sowie LocalStorage-Daten zur Funktion gespeichert werden.
    </div>

    <p style="color:#f85149 !important; font-weight:bold !important; margin:0 0 15px 0 !important; font-size:14px !important; background:none !important;">
        Stimmen Sie den Bedingungen für <b>${projectName}</b> zu?
    </p>

    <div class="dm-btn-group">
        <button class="dm-btn" id="dm-ok-btn">Akzeptieren</button>
        <button class="dm-btn dm-btn-secondary" onclick="window.location.href='https://google.com'">
            Ablehnen
        </button>
    </div>
</div>`;
        
        document.documentElement.appendChild(modal);

        document.getElementById('dm-ok-btn').addEventListener('click', function() {
            isAccepted = true;
            const el = document.getElementById('dm-legal-consent');
            if (el) el.remove();
            document.documentElement.classList.remove('dm-lock-hard');
            addFooter();
        });
    }

    function addFooter() {
        if (!isAccepted || document.querySelector('.dm-universal-footer')) return;
        const footer = document.createElement('div');
        footer.className = 'dm-universal-footer';
        footer.innerHTML = `
            &copy; 2026 Maksym Didukh | Contact: ${contactEmail} | Project: <b>${projectName}</b> | 
            <a href="https://dmamax.netlify.app/impressum" target="_blank">Impressum</a> | 
            <a href="https://dmamax.netlify.app/datenschutz" target="_blank">Datenschutz</a>
            <span class="dm-inline-picker-wrapper">
                <input type="color" id="dmBgPicker" class="dm-round-picker" title="Design-Thema für alle Seiten ändern">
            </span>
        `;
        document.documentElement.appendChild(footer);

        setupColorPicker();
    }

    function setupColorPicker() {
        const picker = document.getElementById('dmBgPicker');
        if (!picker) return;

        const currentSaved = localStorage.getItem(globalStorageKey);
        if (currentSaved) {
            picker.value = currentSaved;
        }

        // Мгновенная перестройка темы при перетаскивании ползунка
        picker.addEventListener('input', function(event) {
            applyThemeVariables(event.target.value);
        });

        // Фиксация выбранной схемы в память
        picker.addEventListener('change', function(event) {
            localStorage.setItem(globalStorageKey, event.target.value);
            applyThemeVariables(event.target.value);
        });
    }

    // Синхронизация между открытыми вкладками проектов в реальном времени
    window.addEventListener('storage', function(event) {
        if (event.key === globalStorageKey && event.newValue) {
            applyThemeVariables(event.newValue);
        }
    });

    // Постоянный мониторинг темы на каждой странице
    setInterval(() => {
        if (!isAccepted) {
            mount();
        } else {
            addFooter();
        }
        enforceSavedColor();
    }, 1000);

    mount();
})();
