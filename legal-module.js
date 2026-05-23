(function() {
    const projectName = document.title || "Maksym Didukh Project";
    const contactEmail = "didukh.maxim@gmail.com";

    // ЕДИНЫЙ ГЛОБАЛЬНЫЙ ОБЪЕКТ СОСТОЯНИЯ (Доступен для всех внутренних функций)
    const themeState = {
        keys: {
            bg: 'siteThemeUniversalColor',
            opacity: 'siteThemeOpacity',
            random: 'siteThemeRandomAccent'
        },
        defaults: {
            bg: '#0c162d', // Тот самый дефолтный синий цвет
            opacity: '1.0',
            random: false
        },
        // Метод для получения текущего актуального значения из localStorage или дефолта
        get(type) {
            const saved = localStorage.getItem(this.keys[type]);
            if (saved === null) return this.defaults[type];
            if (type === 'random') return saved === 'true';
            return saved;
        },
        // Метод для записи нового значения в состояние
        set(type, value) {
            localStorage.setItem(this.keys[type], value);
        },
        // Полный сброс всех настроек к дефолтным
        reset() {
            localStorage.setItem(this.keys.bg, this.defaults.bg);
            localStorage.setItem(this.keys.opacity, this.defaults.opacity);
            localStorage.setItem(this.keys.random, this.defaults.random);
        }
    };

    let isAccepted = false;

    // 1. Инъекция адаптивных стилей темы
    const styleId = 'dm-styles-integrated';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            html, body {
                background-color: var(--u-bg, ${themeState.defaults.bg}) !important;
                color: var(--u-text, #ffffff) !important;
                transition: background-color 0.2s ease, color 0.2s ease !important;
            }

            body div:not([id^="dm-"]):not([class^="dm-"]), 
            body section, body article, body header, body footer:not(.dm-universal-footer), 
            body main, body nav, body aside, body form {
                background-color: var(--u-block-bg) !important;
                color: var(--u-text) !important;
                border-color: var(--u-border) !important;
                opacity: var(--u-opacity, 1) !important;
                transition: opacity 0.15s ease !important;
            }

            body p, body span, body li, body th, body td, body label, body small, body time {
                color: var(--u-text-muted) !important;
            }
            body h1, body h2, body h3, body h4, body h5, body h6, body strong, body b {
                color: var(--u-text) !important;
            }
            body a:not([class^="dm-"]) {
                color: var(--u-link-default, #58a6ff) !important;
                text-decoration: underline !important;
            }
            body button:not([class^="dm-"]), body input:not([class^="dm-"]), body select:not([class^="dm-"]) {
                background-color: var(--u-block-bg) !important;
                color: var(--u-text) !important;
                border: 2px solid var(--u-border) !important;
            }

            /* ИЗОЛИРОВАННЫЕ СТИЛИ СЛУЖЕБНОГО ИНТЕРФЕЙСА */
            #dm-legal-consent, .dm-universal-footer {
                all: initial !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                box-sizing: border-box !important;
            }
            .dm-lock-hard { overflow: hidden !important; height: 100vh !important; width: 100vw !important; position: fixed !important; }
            #dm-legal-consent {
                position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
                background: rgba(10, 10, 12, 0.98) !important; z-index: 2147483647 !important;
                display: flex !important; align-items: center !important; justify-content: center !important;
                backdrop-filter: blur(25px) !important; padding: 10px !important; 
            }
            .dm-consent-box {
                background: #161b22 !important; color: #c9d1d9 !important; padding: 20px 15px !important; border-radius: 12px !important; 
                max-width: 550px !important; width: 100% !important; max-height: 90vh !important; overflow-y: auto !important;
                border: 1px solid #30363d !important; text-align: center !important; box-shadow: 0 20px 60px rgba(0,0,0,1) !important;
            }
            .dm-btn-group { display: flex !important; gap: 10px !important; justify-content: center !important; margin-top: 20px !important; width: 100% !important; }
            .dm-btn {
                background: #238636 !important; color: #fff !important; border: none !important;
                padding: 12px 20px !important; border-radius: 6px !important; cursor: pointer !important;
                font-weight: bold !important; font-size: 14px !important; transition: background 0.2s !important;
                flex: 1 1 auto !important; flex-shrink: 0 !important; white-space: nowrap !important; 
            }
            .dm-btn:hover { background: #2ea043 !important; }
            .dm-btn-secondary { background: #484f58 !important; }
            .dm-btn-secondary:hover { background: #6e7681 !important; }
            
            .dm-universal-footer {
                position: fixed !important; bottom: 0 !important; left: 0 !important; width: 100% !important;
                background: rgba(13, 17, 23, 0.95) !important; color: #8b949e !important; text-align: center !important;
                padding: 8px 10px !important; font-size: 11px !important; z-index: 2147483646 !important;
                border-top: 1px solid #30363d !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 12px !important; flex-wrap: nowrap !important; 
            }
            .dm-universal-footer a { color: #58a6ff !important; text-decoration: none !important; font-weight: bold !important; }
            .dm-controls-group { display: inline-flex !important; align-items: center !important; gap: 10px !important; flex-shrink: 0 !important; }
            .dm-label-text { color: #8b949e !important; font-size: 11px !important; user-select: none !important; }
            
            .dm-inline-picker-wrapper {
                display: inline-flex !important; align-items: center !important; vertical-align: middle !important; flex-shrink: 0 !important; 
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

    // Вспомогательная генерация сочного случайного цвета (HSL)
    function getRandomBrightColor() {
        const h = Math.floor(Math.random() * 360);
        return `hsl(${h}, 95%, 62%)`;
    }

    // 2. Универсальный движок расчета контрастности (HSP алгоритм)
    function applyUniversalTheme(hexColor) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        let hex = hexColor.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return;

        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);

        let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        
        let textColor, textMuted, blockBg, borderStyle, defaultLinkColor;

        if (hsp > 200) { 
            textColor = '#0e1116'; textMuted = '#48525c'; blockBg = 'rgba(0, 0, 0, 0.04)'; borderStyle = 'rgba(0, 0, 0, 0.12)'; defaultLinkColor = '#0969da';
        } else if (hsp < 40) {
            textColor = '#ffffff'; textMuted = '#919eab'; blockBg = 'rgba(255, 255, 255, 0.06)'; borderStyle = 'rgba(255, 255, 255, 0.15)'; defaultLinkColor = '#58a6ff';
        } else {
            if (hsp > 127.5) {
                textColor = '#05070a'; textMuted = 'rgba(0, 0, 0, 0.7)'; blockBg = 'rgba(0, 0, 0, 0.07)'; borderStyle = 'rgba(0, 0, 0, 0.15)'; defaultLinkColor = '#003d99';
            } else {
                textColor = '#ffffff'; textMuted = 'rgba(255, 255, 255, 0.75)'; blockBg = 'rgba(255, 255, 255, 0.09)'; borderStyle = 'rgba(255, 255, 255, 0.2)'; defaultLinkColor = '#9cd4ff';
            }
        }

        const root = document.documentElement;
        root.style.setProperty('--u-bg', hexColor);
        root.style.setProperty('--u-text', textColor);
        root.style.setProperty('--u-text-muted', textMuted);
        root.style.setProperty('--u-block-bg', blockBg);
        root.style.setProperty('--u-border', borderStyle);
        root.style.setProperty('--u-link-default', defaultLinkColor);

        // Запуск массового интеллектуального окрашивания объектов
        colorizeObjectsOnSite();
    }

    // 3. Превращение DIV-ов со ссылками/кнопками в самостоятельные разноцветные дизайн-объекты
    function colorizeObjectsOnSite() {
        const isRandomActive = themeState.get('random');

        if (!isRandomActive) {
            // Если режим выключен — безопасно сбрасываем кастомные стили со всех элементов контента
            document.querySelectorAll('[data-dm-is-object]').forEach(el => {
                el.removeAttribute('data-dm-is-object');
                el.style.removeProperty('color');
            });
            document.querySelectorAll('body a, body button, body p, body span, body li, body div, body h1, body h2, body h3, body h4, body h5, body h6, body strong, body b').forEach(sub => {
                sub.style.removeProperty('color');
                sub.style.removeProperty('border-color');
            });
            return;
        }

        // Выбираем контейнеры верхнего уровня (исключая системные панели)
        const contentContainers = document.querySelectorAll('body div:not([id^="dm-"]):not([class^="dm-"]), body section, body p, body li, body form, body header, body footer:not(.dm-universal-footer)');

        contentContainers.forEach(container => {
            // Ищем интерактивное наполнение
            const hasInteractive = container.querySelector('a, button, input[type="button"], input[type="submit"]');

            if (hasInteractive) {
                // Если объект еще не получил свой цвет — инициализируем его
                if (!container.dataset.dmIs-object) {
                    container.dataset.dmIs-object = getRandomBrightColor();
                }

                const objectColor = container.dataset.dmIs-object;

                // Массово красим весь текст самого контейнера-объекта
                container.style.setProperty('color', objectColor, 'important');

                // Окрашиваем всю массу вложенных элементов в этот же тон
                const subElements = container.querySelectorAll('a, button, h1, h2, h3, h4, h5, h6, span, p, li, strong, b');
                subElements.forEach(child => {
                    if (child.closest('.dm-universal-footer') || child.closest('#dm-legal-consent')) return;

                    child.style.setProperty('color', objectColor, 'important');
                    
                    if (child.tagName.toLowerCase() === 'button') {
                        child.style.setProperty('border-color', objectColor, 'important');
                    }
                });
            }
        });
    }

    function applyOpacity(val) {
        document.documentElement.style.setProperty('--u-opacity', val);
    }

    // Функция синхронизации и контроля состояния (вызывается каждую секунду)
    function enforceSavedColor() {
        const currentBg = themeState.get('bg');
        applyUniversalTheme(currentBg);
        
        const picker = document.getElementById('dmBgPicker');
        if (picker && picker.value !== currentBg) {
            picker.value = currentBg;
        }

        const currentOpacity = themeState.get('opacity');
        applyOpacity(currentOpacity);
        const slider = document.getElementById('dmOpacitySlider');
        if (slider && slider.value !== currentOpacity) {
            slider.value = currentOpacity;
        }

        const currentRandom = themeState.get('random');
        const checkbox = document.getElementById('dmRandomCheckbox');
        if (checkbox && checkbox.checked !== currentRandom) {
            checkbox.checked = currentRandom;
        }
    }

    // Первичная сборка при инициализации страницы
    applyUniversalTheme(themeState.get('bg'));
    applyOpacity(themeState.get('opacity'));

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
            
            <div class="dm-controls-group">
                <span class="dm-label-text">Opacity:</span>
                <input type="range" id="dmOpacitySlider" class="dm-opacity-range" min="0.1" max="1.0" step="0.05" title="Прозрачность блоков">
                
                <label class="dm-checkbox-label" title="Разукрасить весь текст и контент блоков-объектов, содержащих кнопки или ссылки">
                    <input type="checkbox" id="dmRandomCheckbox" class="dm-checkbox-native">
                    <span class="dm-label-text">Рандом</span>
                </label>

                <span class="dm-inline-picker-wrapper">
                    <input type="color" id="dmBgPicker" class="dm-round-picker" title="Design-Thema für alle Seiten ändern">
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
            picker.value = themeState.get('bg');
            picker.addEventListener('input', (e) => applyUniversalTheme(e.target.value));
            picker.addEventListener('change', (e) => {
                themeState.set('bg', e.target.value);
                applyUniversalTheme(e.target.value);
            });
        }

        if (slider) {
            slider.value = themeState.get('opacity');
            slider.addEventListener('input', (e) => applyOpacity(e.target.value));
            slider.addEventListener('change', (e) => {
                themeState.set('opacity', e.target.value);
                applyOpacity(e.target.value);
            });
        }

        if (checkbox) {
            checkbox.checked = themeState.get('random');
            checkbox.addEventListener('change', (e) => {
                themeState.set('random', e.target.checked);
                applyUniversalTheme(themeState.get('bg'));
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                themeState.reset();
                
                applyUniversalTheme(themeState.defaults.bg);
                applyOpacity(themeState.defaults.opacity);
                
                if (picker) picker.value = themeState.defaults.bg;
                if (slider) slider.value = themeState.defaults.opacity;
                if (checkbox) checkbox.checked = themeState.defaults.random;
            });
        }
    }

    window.addEventListener('storage', function(event) {
        if (event.key === themeState.keys.bg && event.newValue) {
            applyUniversalTheme(event.newValue);
        }
        if (event.key === themeState.keys.opacity && event.newValue) {
            applyOpacity(event.newValue);
        }
        if (event.key === themeState.keys.random) {
            applyUniversalTheme(themeState.get('bg'));
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
