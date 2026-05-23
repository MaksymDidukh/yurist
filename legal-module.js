(function() {
    const projectName = document.title || "Maksym Didukh Project";
    const contactEmail = "didukh.maxim@gmail.com";
    const globalStorageKey = 'siteBackgroundColor';
    const globalOpacityKey = 'siteThemeOpacity';
    const globalRandomKey = 'siteThemeRandomAccent'; 
    const DEFAULT_BLUE_COLOR = '#0c162d';

    // 1. СТИЛИ (Базовое оформление + динамические переменные фона и текста)
    const styleId = 'dm-styles-integrated';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* ГЛОБАЛЬНЫЕ НАСТРОЙКИ ТЕМЫ ДЛЯ ВСЕХ СТРАНИЦ */
            html, body {
                background-color: var(--theme-bg, ${DEFAULT_BLUE_COLOR}) !important;
                color: var(--theme-text) !important;
                transition: background-color 0.2s ease, color 0.2s ease !important;
            }
            
            /* Применение выбранного пользователем фона к блокам сайта с учетом прозрачности */
            body div:not([class^="dm-"]):not([id^="dm-"]), 
            body section, body article, body header, body footer:not(.dm-universal-footer), 
            body main, body nav, body aside, body form {
                background-color: var(--theme-block-bg) !important;
                border-color: var(--theme-border) !important;
                transition: background-color 0.2s ease, border-color 0.2s ease !important;
            }

            /* Авто-применение темы к стандартным элементам текста */
            body p, body span, body li, body div:not([class^="dm-"]):not([id^="dm-"]), body td, body label { 
                color: var(--theme-text-muted, var(--theme-text)); 
            }
            body h1, body h2, body h3, body h4, body h5, body h6, body strong, body b { 
                color: var(--theme-accent, var(--theme-text)); 
            }
            body a:not([class^="dm-"]) { 
                color: var(--theme-accent); 
            }
            body button:not([class^="dm-"]), body input:not([class^="dm-"]):not([id^="dm-"]), body select:not([class^="dm-"]) {
                background-color: transparent !important;
                border: 2px solid var(--theme-accent) !important;
                color: var(--theme-text) !important;
                border-radius: 4px !important;
            }

            /* Защита геометрии для элементов под воздействием рандома */
            .dm-random-applied {
                transition: color 0.2s ease, border-color 0.2s ease !important;
            }

            /* Изолированные стили служебного интерфейса */
            #dm-legal-consent, .dm-universal-footer {
                all: initial !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                box-sizing: border-box !important;
            }
            .dm-lock-hard {
                overflow: hidden !important; height: 100vh !important; width: 100vw !important; position: fixed !important;
            }
            #dm-legal-consent {
                position: fixed !important; top: 0 !important; left: 0 !important;
                width: 100vw !important; height: 100vh !important;
                background: rgba(10, 10, 12, 0.98) !important; z-index: 2147483647 !important;
                display: flex !important; align-items: center !important; justify-content: center !important;
                backdrop-filter: blur(25px) !important; padding: 10px !important; 
            }
            .dm-consent-box {
                background: #161b22 !important; color: #c9d1d9 !important; padding: 20px 15px !important; border-radius: 12px !important; 
                max-width: 550px !important; width: 100% !important; max-height: 90vh !important; overflow-y: auto !important;
                border: 1px solid #30363d !important; text-align: center !important; box-shadow: 0 20px 60px rgba(0,0,0,1) !important;
            }
            .dm-btn-group { display: flex !important; flex-wrap: wrap !important; gap: 10px !important; justify-content: center !important; margin-top: 20px !important; }
            .dm-btn {
                background: #238636 !important; color: #fff !important; border: none !important;
                padding: 12px 20px !important; border-radius: 6px !important; cursor: pointer !important;
                font-weight: bold !important; font-size: 14px !important; transition: background 0.2s !important; flex: 1 1 120px !important;
            }
            .dm-btn:hover { background: #2ea043 !important; }
            .dm-btn-secondary { background: #484f58 !important; }
            .dm-btn-secondary:hover { background: #6e7681 !important; }
            
            /* СТИЛИ ПАНЕЛИ УПРАВЛЕНИЯ */
            .dm-universal-footer {
                position: fixed !important; bottom: 0 !important; left: 0 !important; width: 100% !important;
                background: rgba(13, 17, 23, 0.96) !important; color: #8b949e !important; text-align: center !important;
                padding: 8px 12px !important; font-size: 11px !important; z-index: 2147483646 !important;
                border-top: 1px solid #30363d !important; 
                display: flex !important; align-items: center !important; justify-content: center !important; gap: 15px !important; flex-wrap: wrap !important;
            }

            /* ИЗОЛИРОВАННАЯ ОБТЕКАЕМАЯ КАПСУЛА IMPRESSUM */
            .dm-impressum-capsule {
                display: inline-flex !important; align-items: center !important; gap: 8px !important;
                background: rgba(255, 255, 255, 0.05) !important; padding: 3px 12px !important;
                border-radius: 20px !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; flex-shrink: 0 !important;
            }
            .dm-impressum-capsule a { 
                color: #58a6ff !important; text-decoration: none !important; font-weight: bold !important; margin: 0 !important; transition: color 0.15s ease !important;
            }
            .dm-impressum-capsule a:hover { color: #79c0ff !important; text-decoration: underline !important; }
            
            /* ЭЛЕМЕНТЫ УПРАВЛЕНИЯ */
            .dm-controls-group { display: inline-flex !important; align-items: center !important; gap: 10px !important; flex-shrink: 0 !important; }
            .dm-label-text { color: #8b949e !important; font-size: 11px !important; user-select: none !important; }
            
            .dm-inline-picker-wrapper {
                display: inline-flex !important; align-items: center !important; vertical-align: middle !important;
                background: rgba(255, 255, 255, 0.1) !important; padding: 2px !important; border-radius: 50% !important; transition: transform 0.2s ease !important;
            }
            .dm-inline-picker-wrapper:hover { transform: scale(1.15) !important; background: rgba(255, 255, 255, 0.2) !important; }
            
            .dm-round-picker {
                -webkit-appearance: none !important; appearance: none !important;
                width: 18px !important; height: 18px !important; background: transparent !important; border: none !important; cursor: pointer !important; border-radius: 50% !important; display: block !important;
            }
            .dm-round-picker::-webkit-color-swatch-wrapper { padding: 0 !important; }
            .dm-round-picker::-webkit-color-swatch { border: 1px solid #ffffff !important; border-radius: 50% !important; }

            .dm-opacity-range {
                -webkit-appearance: none !important; appearance: none !important;
                width: 60px !important; height: 4px !important; background: #30363d !important; border-radius: 2px !important; outline: none !important; cursor: pointer !important; vertical-align: middle !important;
            }
            .dm-opacity-range::-webkit-slider-thumb {
                -webkit-appearance: none !important; appearance: none !important;
                width: 12px !important; height: 12px !important; border-radius: 50% !important; background: #58a6ff !important; cursor: pointer !important;
            }
            .dm-checkbox-label { display: inline-flex !important; align-items: center !important; gap: 4px !important; cursor: pointer !important; }
            .dm-checkbox-native { cursor: pointer !important; margin: 0 !important; width: 13px !important; height: 13px !important; }
            
            .dm-reset-btn {
                background: transparent !important; border: none !important; color: #8b949e !important;
                font-size: 14px !important; cursor: pointer !important; padding: 2px 5px !important;
                display: inline-flex !important; align-items: center !important; justify-content: center !important;
                transition: color 0.2s, transform 0.2s !important; line-height: 1 !important;
            }
            .dm-reset-btn:hover { color: #f85149 !important; transform: rotate(-45deg) !important; }

            @media (max-height: 250px) { .dm-universal-footer { position: static !important; } }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    function getRandomBrightColor() {
        const h = Math.floor(Math.random() * 360);
        return `hsl(${h}, 95%, 62%)`;
    }

    function hexToRgbComponents(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    }

    function hexToRgbString(hex) {
        const comp = hexToRgbComponents(hex);
        return comp ? `rgb(${comp.r}, ${comp.g}, ${comp.b})` : null;
    }

    // ВЫЧИСЛЕНИЕ ЦВЕТОВЫХ ПЕРЕМЕННЫХ НА ОСНОВЕ ЦВЕТА С ПАЛИТРЫ
    function applyThemeVariables(hexColor) {
        const rgb = hexToRgbComponents(hexColor);
        if (!rgb) return;

        const hsp = Math.sqrt(0.299 * (rgb.r * rgb.r) + 0.587 * (rgb.g * rgb.g) + 0.114 * (rgb.b * rgb.b));
        let textColor, textColorMuted, accentColor, blockBg, borderStyle;

        // Берем сохраненное значение прозрачности для подмешивания в блоки
        const opacityVal = localStorage.getItem(globalOpacityKey) || '1.0';

        if (hsp > 200) { 
            textColor = '#0e1116'; textColorMuted = '#48525c'; 
            blockBg = `rgba(0, 0, 0, ${0.05 * parseFloat(opacityVal)})`; 
            borderStyle = 'rgba(0, 0, 0, 0.12)'; accentColor = '#0969da';
        } else if (hsp < 40) {
            textColor = '#ffffff'; textColorMuted = '#919eab'; 
            blockBg = `rgba(255, 255, 255, ${0.07 * parseFloat(opacityVal)})`; 
            borderStyle = 'rgba(255, 255, 255, 0.15)'; accentColor = '#58a6ff';
        } else {
            if (hsp > 127.5) {
                textColor = '#05070a'; textColorMuted = 'rgba(0, 0, 0, 0.7)'; 
                blockBg = `rgba(0, 0, 0, ${0.08 * parseFloat(opacityVal)})`; 
                borderStyle = 'rgba(0, 0, 0, 0.15)'; accentColor = '#003d99';
            } else {
                textColor = '#ffffff'; textColorMuted = 'rgba(255, 255, 255, 0.75)'; 
                blockBg = `rgba(255, 255, 255, ${0.1 * parseFloat(opacityVal)})`; 
                borderStyle = 'rgba(255, 255, 255, 0.2)'; accentColor = '#9cd4ff';
            }
        }

        const root = document.documentElement;
        root.style.setProperty('--theme-bg', hexColor);
        root.style.setProperty('--theme-text', textColor);
        root.style.setProperty('--theme-text-muted', textColorMuted);
        root.style.setProperty('--theme-accent', accentColor);
        root.style.setProperty('--theme-block-bg', blockBg);
        root.style.setProperty('--theme-border', borderStyle);

        // Запуск окрашивания текстов
        colorizeElementsOnSite();
    }

    // УМНЫЙ РАНДОМ: КРАСИТ СТРОГО ТЕКСТ И ИНТЕРФЕЙС, НЕ МЕНЯЯ ВЫБРАННЫЙ ФОН БЛОКОВ
    function colorizeElementsOnSite() {
        const isRandomActive = localStorage.getItem(globalRandomKey) === 'true';

        if (!isRandomActive) {
            // Мягкий сброс кастомного окрашивания текстов
            document.querySelectorAll('.dm-random-applied').forEach(el => {
                el.classList.remove('dm-random-applied');
                el.style.removeProperty('color');
                el.style.removeProperty('border-color');
            });
            document.querySelectorAll('body a, body button, body p, body span, body li, body div, body h1, body h2, body h3, body h4, body h5, body h6, body strong, body b, body input, body select').forEach(sub => {
                if (sub.closest('.dm-universal-footer') || sub.closest('#dm-legal-consent')) return;
                sub.style.removeProperty('color');
                sub.style.removeProperty('border-color');
            });
            return;
        }

        const containers = document.querySelectorAll('body p, body li, body span, body div:not([id^="dm-"]):not([class^="dm-"]), body td, body label');

        containers.forEach(container => {
            if (container.closest('.dm-universal-footer') || container.closest('#dm-legal-consent')) return;

            const hasInteractive = container.querySelector('a, button, input[type="button"], input[type="submit"]');

            if (hasInteractive) {
                if (!container.style.getPropertyValue('--dm-custom-text-color')) {
                    container.style.setProperty('--dm-custom-text-color', getRandomBrightColor());
                }

                const textColorRandom = container.style.getPropertyValue('--dm-custom-text-color');

                container.classList.add('dm-random-applied');
                container.style.setProperty('color', textColorRandom, 'important');

                // Окрашиваем исключительно внутренние тексты, ссылки и обводки кнопок
                const subElements = container.querySelectorAll('a, button, h1, h2, h3, h4, h5, h6, span, p, li, strong, b, input, select');
                subElements.forEach(child => {
                    child.style.setProperty('color', textColorRandom, 'important');
                    
                    if (child.tagName.toLowerCase() === 'button' || child.tagName.toLowerCase() === 'input' || child.tagName.toLowerCase() === 'select') {
                        child.style.setProperty('border-color', textColorRandom, 'important');
                    }
                });
            }
        });
    }

    function applyOpacity(val) {
        localStorage.setItem(globalOpacityKey, val);
        // Пересчитываем переменные темы, так как прозрачность подмешивается в фоны блоков
        applyThemeVariables(localStorage.getItem(globalStorageKey) || DEFAULT_BLUE_COLOR);
    }

    function enforceSavedColor() {
        if (!document.body) return;
        const savedColor = localStorage.getItem(globalStorageKey) || DEFAULT_BLUE_COLOR;
        applyThemeVariables(savedColor);
        
        const picker = document.getElementById('dmBgPicker');
        if (picker && picker.value !== savedColor) picker.value = savedColor;

        const savedOpacity = localStorage.getItem(globalOpacityKey) || '1.0';
        const slider = document.getElementById('dmOpacitySlider');
        if (slider && slider.value !== savedOpacity) slider.value = savedOpacity;

        const isRandomActive = localStorage.getItem(globalRandomKey) === 'true';
        const checkbox = document.getElementById('dmRandomCheckbox');
        if (checkbox && checkbox.checked !== isRandomActive) checkbox.checked = isRandomActive;
    }

    const initColor = localStorage.getItem(globalStorageKey) || DEFAULT_BLUE_COLOR;
    applyThemeVariables(initColor);

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
                    • <b>Verhaltensregeln:</b> Die Nutzung для rechtswidrige, beleidigende oder schädliche Inhalte ist untersagt.<br><br>
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
            <div>
                &copy; 2026 Maksym Didukh | Contact: ${contactEmail} | Project: <b>${projectName}</b>
            </div>
            
            <div class="dm-impressum-capsule">
                <a href="https://dmamax.netlify.app/impressum" target="_blank">Impressum</a>
                <span style="color: rgba(255,255,255,0.2) !important; user-select: none;">|</span>
                <a href="https://dmamax.netlify.app/datenschutz" target="_blank">Datenschutz</a>
            </div>
            
            <div class="dm-controls-group">
                <span class="dm-label-text">Opacity:</span>
                <input type="range" id="dmOpacitySlider" class="dm-opacity-range" min="0.1" max="1.0" step="0.05" title="Прозрачность блоков">
                
                <label class="dm-checkbox-label" title="Разукрасить весь текст блоков с кнопками или ссылками без сдвигов верстки">
                    <input type="checkbox" id="dmRandomCheckbox" class="dm-checkbox-native">
                    <span class="dm-label-text">Рандом</span>
                </label>

                <span class="dm-inline-picker-wrapper">
                    <input type="color" id="dmBgPicker" class="dm-round-picker" title="Design-Thema для всех страниц">
                </span>
                
                <button id="dmResetTheme" class="dm-reset-btn" title="Сбросить все настройки">↺</button>
            </div>
        `;
        document.documentElement.appendChild(footer);

        setupControls();
    }

    function setupControls() {
        const picker = document.getElementById('dmBgPicker');
        const slider = document.getElementById('dmOpacitySlider');
        const checkbox = document.getElementById('dmRandomCheckbox');
        const resetBtn = document.getElementById('dmResetTheme');

        if (picker) {
            picker.value = localStorage.getItem(globalStorageKey) || DEFAULT_BLUE_COLOR;
            picker.addEventListener('input', (e) => applyThemeVariables(e.target.value));
            picker.addEventListener('change', (e) => {
                localStorage.setItem(globalStorageKey, e.target.value);
                applyThemeVariables(e.target.value);
            });
        }

        if (slider) {
            slider.value = localStorage.getItem(globalOpacityKey) || '1.0';
            slider.addEventListener('input', (e) => applyOpacity(e.target.value));
        }

        if (checkbox) {
            checkbox.checked = localStorage.getItem(globalRandomKey) === 'true';
            checkbox.addEventListener('change', (e) => {
                localStorage.setItem(globalRandomKey, e.target.checked);
                applyThemeVariables(localStorage.getItem(globalStorageKey) || DEFAULT_BLUE_COLOR);
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                localStorage.setItem(globalStorageKey, DEFAULT_BLUE_COLOR);
                localStorage.setItem(globalOpacityKey, '1.0');
                localStorage.setItem(globalRandomKey, 'false');
                
                applyThemeVariables(DEFAULT_BLUE_COLOR);
                
                if (picker) picker.value = DEFAULT_BLUE_COLOR;
                if (slider) slider.value = '1.0';
                if (checkbox) checkbox.checked = false;
            });
        }
    }

    window.addEventListener('storage', function(event) {
        if (event.key === globalStorageKey && event.newValue) applyThemeVariables(event.newValue);
        if (event.key === globalOpacityKey && event.newValue) applyOpacity(event.newValue);
        if (event.key === globalRandomKey) applyThemeVariables(localStorage.getItem(globalStorageKey) || DEFAULT_BLUE_COLOR);
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
