(function() {
    const projectName = document.title || "Maksym Didukh Project";
    const contactEmail = "didukh.maxim@gmail.com";
    const globalStorageKey = 'siteThemeHue'; // Храним оттенок (hue) вместо жесткого HEX

    // 1. Динамическое определение базовой темы сайта
    let isDefaultDark = false;
    
    function detectSiteTheme() {
        if (!document.body) return;
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bodyBg.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
            // Рассчитываем яркость фона сайта (HSP)
            const hsp = Math.sqrt(0.299 * (rgb[0] * rgb[0]) + 0.587 * (rgb[1] * rgb[1]) + 0.114 * (rgb[2] * rgb[2]));
            isDefaultDark = hsp <= 127.5;
        }
    }

    // 2. Инъекция адаптивных стилей
    const styleId = 'dm-styles-integrated';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* Адаптивный фильтр для всего сайта, сохраняющий читаемость */
            html {
                filter: hue-rotate(var(--theme-hue, 0deg)) saturate(var(--theme-saturation, 100%));
                transition: filter 0.3s ease !important;
            }
            /* Исключаем картинки, видео и служебный интерфейс из инверсии/искажения цветов */
            img, video, iframe, .dm-exclude-theme, #dm-legal-consent, .dm-universal-footer {
                filter: hue-rotate(calc(-1 * var(--theme-hue, 0deg))) !important;
            }

            /* Изолированные стили служебного интерфейса */
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
            .dm-btn-group { display: flex !important; flex-wrap: wrap !important; gap: 10px !important; justify-content: center !important; margin-top: 20px !important; }
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
                border-top: 1px solid #30363d !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 2px !important; flex-wrap: wrap !important;
            }
            .dm-universal-footer a { color: #58a6ff !important; text-decoration: none !important; margin: 0 5px !important; font-weight: bold !important; }
            
            .dm-inline-picker-wrapper {
                display: inline-flex !important; align-items: center !important; vertical-align: middle !important;
                margin-left: 5px !important; background: rgba(255, 255, 255, 0.1) !important;
                padding: 2px !important; border-radius: 50% !important; transition: transform 0.2s ease !important;
            }
            .dm-inline-picker-wrapper:hover { transform: scale(1.15) !important; background: rgba(255, 255, 255, 0.2) !important; }
            .dm-round-picker {
                -webkit-appearance: none !important; -moz-appearance: none !important; appearance: none !important;
                width: 18px !important; height: 18px !important; background: transparent !important; border: none !important; cursor: pointer !important; border-radius: 50% !important; display: block !important;
            }
            .dm-round-picker::-webkit-color-swatch-wrapper { padding: 0 !important; }
            .dm-round-picker::-webkit-color-swatch { border: 1px solid #ffffff !important; border-radius: 50% !important; background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red) !important; }
            .dm-round-picker::-moz-color-swatch { border: 1px solid #ffffff !important; border-radius: 50% !important; background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red) !important; }

            @media (max-height: 250px) { .dm-universal-footer { position: static !important; } }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    let isAccepted = false;

    // Преобразование HEX-цвета во вращение оттенка (Hue) относительно базового синего/базового цвета
    function updateThemeFromHex(hexColor) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        let hex = hexColor.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return;

        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // ахроматический (серый)
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        // Переводим в градусы для CSS hue-rotate
        const degrees = Math.round(h * 360);
        
        const root = document.documentElement;
        root.style.setProperty('--theme-hue', `${degrees}deg`);
        // Если пользователь выбрал ненасыщенный цвет, приглушаем общую насыщенность сайта
        root.style.setProperty('--theme-saturation', `${Math.max(s * 100, 40)}%`);
    }

    function enforceSavedColor() {
        const savedColor = localStorage.getItem(globalStorageKey) || '#58a6ff';
        updateThemeFromHex(savedColor);
        
        const picker = document.getElementById('dmBgPicker');
        if (picker && picker.value !== savedColor) {
            picker.value = savedColor;
        }
    }

    // Инициализация при старте
    const initColor = localStorage.getItem(globalStorageKey) || '#58a6ff';
    updateThemeFromHex(initColor);

    function mount() {
        if (isAccepted || document.getElementById('dm-legal-consent')) return;
        detectSiteTheme();

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
                    • <b>Inhalte:</b> Nutzer können Inhalte (Texte, Zeichnungen, Nachrichten) erstellen. Diese können im Rahmen की Funktionalität gespeichert werden.<br><br>
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
                <input type="color" id="dmBgPicker" class="dm-round-picker" title="Design-Thema für alle Seiten ändern">
            </span>
        `;
        document.documentElement.appendChild(footer);

        setupColorPicker();
    }

    function setupColorPicker() {
        const picker = document.getElementById('dmBgPicker');
        if (!picker) return;

        picker.value = localStorage.getItem(globalStorageKey) || '#58a6ff';

        picker.addEventListener('input', function(event) {
            updateThemeFromHex(event.target.value);
        });

        picker.addEventListener('change', function(event) {
            localStorage.setItem(globalStorageKey, event.target.value);
            updateThemeFromHex(event.target.value);
        });
    }

    window.addEventListener('storage', function(event) {
        if (event.key === globalStorageKey && event.newValue) {
            updateThemeFromHex(event.newValue);
        }
    });

    setInterval(() => {
        if (!isAccepted) {
            mount();
        } else {
            addFooter();
        }
        detectSiteTheme();
        enforceSavedColor();
    }, 1000);

    // Первичный запуск при полной готовности DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
                               
