(function() {
    const projectName = document.title || "Maksym Didukh Project";
    const contactEmail = "didukh.maxim@gmail.com";
    const globalStorageKey = 'siteThemeUniversalColor'; // Уникальный ключ для LocalStorage

    let isAccepted = false;

    // 1. Инъекция адаптивных стилей
    const styleId = 'dm-styles-integrated';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* Перекрашивание главных контейнеров */
            html, body {
                background-color: var(--u-bg) !important;
                color: var(--u-text) !important;
                transition: background-color 0.2s ease, color 0.2s ease !important;
            }

            /* Умное адаптивное окрашивание блоков сайта (не ломает структуру, но меняет тему) */
            body div:not([id^="dm-"]):not([class^="dm-"]), 
            body section, body article, body header, body footer:not(.dm-universal-footer), 
            body main, body nav, body aside, body card {
                background-color: var(--u-block-bg) !important;
                color: var(--u-text) !important;
                border-color: var(--u-border) !important;
            }

            /* Контроль читаемости текста стороннего сайта */
            body p, body span, body li, body th, body td, body label, body small, body time {
                color: var(--u-text-muted) !important;
            }
            body h1, body h2, body h3, body h4, body h5, body h6, body strong, body b {
                color: var(--u-text) !important;
            }
            body a:not([class^="dm-"]) {
                color: var(--u-link) !important;
                text-decoration: underline !important;
            }
            body button:not([class^="dm-"]), body input:not([class^="dm-"]), body select:not([class^="dm-"]) {
                background-color: var(--u-block-bg) !important;
                color: var(--u-text) !important;
                border: 1px solid var(--u-border) !important;
            }

            /* ИЗОЛИРОВАННЫЕ СТИЛИ СЛУЖЕБНОГО ИНТЕРФЕЙСА (Полный сброс) */
            #dm-legal-consent, .dm-universal-footer {
                all: initial !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
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
                background: rgba(10, 10, 12, 0.98) !important;
                z-index: 2147483647 !important;
                display: flex !important; align-items: center !important; justify-content: center !important;
                backdrop-filter: blur(25px) !important;
                padding: 10px !important; 
            }
            .dm-consent-box {
                background: #161b22 !important; color: #c9d1d9 !important; 
                padding: 20px 15px !important; border-radius: 12px !important; 
                max-width: 550px !important; width: 100% !important;
                max-height: 90vh !important; overflow-y: auto !important;
                border: 1px solid #30363d !important; text-align: center !important;
                box-shadow: 0 20px 60px rgba(0,0,0,1) !important;
            }
            .dm-btn-group { 
                display: flex !important; 
                flex-wrap: nowrap !important; 
                gap: 10px !important; 
                justify-content: center !important; 
                margin-top: 20px !important; 
                width: 100% !important;
            }
            .dm-btn {
                background: #238636 !important; color: #fff !important; border: none !important;
                padding: 12px 20px !important; border-radius: 6px !important; cursor: pointer !important;
                font-weight: bold !important; font-size: 14px !important; transition: background 0.2s !important;
                flex: 1 1 auto !important;
                flex-shrink: 0 !important; 
                white-space: nowrap !important; 
            }
            .dm-btn:hover { background: #2ea043 !important; }
            .dm-btn-secondary { background: #484f58 !important; }
            .dm-btn-secondary:hover { background: #6e7681 !important; }
            
            .dm-universal-footer {
                position: fixed !important; bottom: 0 !important; left: 0 !important; width: 100% !important;
                background: rgba(13, 17, 23, 0.95) !important; color: #8b949e !important; text-align: center !important;
                padding: 8px 10px !important; font-size: 11px !important; z-index: 2147483646 !important;
                border-top: 1px solid #30363d !important; 
                display: flex !important; align-items: center !important; justify-content: center !important; 
                gap: 10px !important; flex-wrap: nowrap !important; 
            }
            .dm-universal-footer a { color: #58a6ff !important; text-decoration: none !important; font-weight: bold !important; }
            
            .dm-inline-picker-wrapper {
                display: inline-flex !important; align-items: center !important; 
                vertical-align: middle !important; flex-shrink: 0 !important; 
                background: rgba(255, 255, 255, 0.1) !important;
                padding: 2px !important; border-radius: 50% !important; transition: transform 0.2s ease !important;
            }
            .dm-inline-picker-wrapper:hover { transform: scale(1.15) !important; background: rgba(255, 255, 255, 0.2) !important; }
            .dm-round-picker {
                -webkit-appearance: none !important; -moz-appearance: none !important; appearance: none !important;
                width: 18px !important; height: 18px !important; background: transparent !important; border: none !important; cursor: pointer !important; border-radius: 50% !important; display: block !important;
            }
            .dm-round-picker::-webkit-color-swatch-wrapper { padding: 0 !important; }
            .dm-round-picker::-webkit-color-swatch { border: 1px solid #ffffff !important; border-radius: 50% !important; }
            .dm-round-picker::-moz-color-swatch { border: 1px solid #ffffff !important; border-radius: 50% !important; }

            @media (max-height: 250px) { .dm-universal-footer { position: static !important; } }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    // 2. Генератор контрастной адаптивной темы (Светлая / Темная / Цветная)
    function applyUniversalTheme(hexColor) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        let hex = hexColor.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return;

        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);

        // Расчет яркости по формуле HSP
        let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        
        let textColor, textMuted, blockBg, borderStyle, linkColor;

        if (hsp > 200) { 
            // ─── ЯРКАЯ СВЕТЛАЯ ТЕМА (например, Белый фон) ───
            textColor = '#0e1116';
            textMuted = '#48525c';
            blockBg = 'rgba(0, 0, 0, 0.04)'; // Легкое затемнение для внутренних блоков карточек
            borderStyle = 'rgba(0, 0, 0, 0.12)';
            linkColor = '#0969da';
        } else if (hsp < 40) {
            // ─── ГЛУБОКАЯ ТЕМНАЯ ТЕМА (например, Черный фон) ───
            textColor = '#ffffff';
            textMuted = '#919eab';
            blockBg = 'rgba(255, 255, 255, 0.06)'; // Легкое осветление внутренних блоков
            borderStyle = 'rgba(255, 255, 255, 0.15)';
            linkColor = '#58a6ff';
        } else {
            // ─── ЛЮБОЙ ДРУГОЙ ЦВЕТ ИЗ ПАЛИТРЫ (Синий, красный, зеленый и т.д.) ───
            // Если выбран промежуточный цвет, адаптивно подстраиваем внутренние блоки
            if (hsp > 127.5) {
                // Цвет ближе к светлому
                textColor = '#05070a';
                textMuted = 'rgba(0, 0, 0, 0.7)';
                blockBg = 'rgba(0, 0, 0, 0.07)';
                borderStyle = 'rgba(0, 0, 0, 0.15)';
                linkColor = '#003d99';
            } else {
                // Цвет ближе к темному
                textColor = '#ffffff';
                textMuted = 'rgba(255, 255, 255, 0.75)';
                blockBg = 'rgba(255, 255, 255, 0.09)';
                borderStyle = 'rgba(255, 255, 255, 0.2)';
                linkColor = '#9cd4ff';
            }
        }

        // Запись переменных в документ
        const root = document.documentElement;
        root.style.setProperty('--u-bg', hexColor);
        root.style.setProperty('--u-text', textColor);
        root.style.setProperty('--u-text-muted', textMuted);
        root.style.setProperty('--u-block-bg', blockBg);
        root.style.setProperty('--u-border', borderStyle);
        root.style.setProperty('--u-link', linkColor);
    }

    function enforceSavedColor() {
        const savedColor = localStorage.getItem(globalStorageKey) || '#0d1117'; // По умолчанию темный GitHub-цвет
        applyUniversalTheme(savedColor);
        
        const picker = document.getElementById('dmBgPicker');
        if (picker && picker.value !== savedColor) {
            picker.value = savedColor;
        }
    }

    // Первичная инициализация цвета до рендеринга интерфейса
    const initColor = localStorage.getItem(globalStorageKey) || '#0d1117';
    applyUniversalTheme(initColor);

    function mount() {
        if (isAccepted || document.getElementById('dm-legal-consent')) return;
        document.documentElement.classList.add('dm-lock-hard');

        const modal = document.createElement('div');
        modal.id = 'dm-legal-consent';
        modal.innerHTML = `
           <div class="dm-consent-box">
                <h2 style="color:#58a6ff !important; margin:0 0 10px 0 !important; font-size:22px !important; font-weight:bold !important; background:none !important;">Rechtliche Bestätigung</h2>
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
                    • <b>Datenverarbeitung:</b> Es können technische Daten sowie LocalStorage-Daten zur Funktion gespeichert werden.
                </div>
                <p style="color:#f85149 !important; font-weight:bold !important; margin:0 0 15px 0 !important; font-size:14px !important; background:none !important;">
                    Stimmen Sie den Bedingungen für <b>${projectName}</b> zu?
                </p>
                <div class="dm-btn-group">
                    <button class="dm-btn" id="dm-ok-btn">Akzeptieren</button>
                    <button class="dm-btn dm-btn-secondary" onclick="window.location.href='https://google.com'">Ablehnen</button>
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
                <input type="color" id="dmBgPicker" class="dm-round-picker" title="Hintergrundfarbe für alle Seiten ändern">
            </span>
        `;
        document.documentElement.appendChild(footer);

        setupColorPicker();
    }

    function setupColorPicker() {
        const picker = document.getElementById('dmBgPicker');
        if (!picker) return;

        picker.value = localStorage.getItem(globalStorageKey) || '#0d1117';

        picker.addEventListener('input', function(event) {
            applyUniversalTheme(event.target.value);
        });

        picker.addEventListener('change', function(event) {
            localStorage.setItem(globalStorageKey, event.target.value);
            applyUniversalTheme(event.target.value);
        });
    }

    window.addEventListener('storage', function(event) {
        if (event.key === globalStorageKey && event.newValue) {
            applyUniversalTheme(event.newValue);
        }
    });

    setInterval(() => {
        if (!isAccepted) {
            mount();
        } else {
            addFooter();
        }
        enforceSavedColor();
    }, 1000);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
        
