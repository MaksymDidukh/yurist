
(function() {
    const projectName = document.title || "Maksym Didukh Project";
    const contactEmail = "didukh.maxim@gmail.com";

    // 1. СТИЛИ (Адаптация под микро-размеры + стилизация палитры)
    const styleId = 'dm-styles-integrated';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
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
                max-height: 90vh !important; /* Важно для 200px высоты */
                overflow-y: auto !important;   /* Добавляет скролл если экран мал */
                border: 1px solid #30363d !important; text-align: center !important;
                box-shadow: 0 20px 60px rgba(0,0,0,1) !important;
            }
            .dm-btn-group { 
                display: flex !important; 
                flex-wrap: wrap !important; /* Кнопки переносятся на новую строку */
                gap: 10px !important; 
                justify-content: center !important; 
                margin-top: 20px !important; 
            }
            .dm-btn {
                background: #238636 !important; color: #fff !important; border: none !important;
                padding: 12px 20px !important; border-radius: 6px !important; cursor: pointer !important;
                font-weight: bold !important; font-size: 14px !important; transition: background 0.2s !important;
                flex: 1 1 120px !important; /* Кнопки тянутся и переносятся */
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
            
            /* Стилизация контейнера кружка-палитры */
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

            /* Скрытие футера если экран слишком низкий, чтобы не мешал кнопкам */
            @media (max-height: 250px) {
                .dm-universal-footer { position: static !important; }
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    let isAccepted = false;

    // Инициализация фонового цвета при загрузке скрипта
    const storageKey = 'bg_color_' + window.location.pathname;
    const savedColor = localStorage.getItem(storageKey);
    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
    }

    function mount() {
        if (isAccepted || document.getElementById('dm-legal-consent')) return;

        document.documentElement.classList.add('dm-lock-hard');

        const modal = document.createElement('div');
        modal.id = 'dm-legal-consent';
        modal.innerHTML = `
           <div class="dm-consent-box">
    <h2 style="color:#58a6ff !important; margin:0 0 10px 0 !important; font-size:22px !important; font-weight:bold !important;">
        Rechtliche Bestätigung
    </h2>

    <p style="color:#c9d1d9 !important; margin-bottom:15px !important; font-size:14px !important;">
        Sie nutzen gerade das Projekt: <span style="color:#238636 !important; font-weight:bold !important;">${projectName}</span>
    </p>

    <div style="margin-bottom:20px !important; font-size:13px !important;">
        <a href="https://dmamax.netlify.app/impressum" target="_blank" style="color:#58a6ff !important;">Impressum</a> |
        <a href="https://dmamax.netlify.app/datenschutz" target="_blank" style="color:#58a6ff !important;">Datenschutz</a>
    </div>

    <div style="text-align:left !important; background:#0d1117 !important; padding:15px !important; border-radius:8px !important; border-left:4px solid #58a6ff !important; font-size:12.5px !important; line-height:1.6 !important; color:#c9d1d9 !important; margin-bottom:20px !important;">

        • <b>Inhalte:</b> Nutzer können Inhalte (Texte, Zeichnungen, Nachrichten) erstellen. Diese können im Rahmen der Funktionalität gespeichert werden.<br><br>

        • <b>Externe Inhalte:</b> Einige Projekte können externe Webseiten oder Dienste einbinden. Für deren Inhalte sind die jeweiligen Betreiber verantwortlich.<br><br>

        • <b>Verhaltensregeln:</b> Die Nutzung für rechtswidrige, beleдиниющие oder schädliche Inhalte ist untersagt.<br><br>

        • <b>Datenverarbeitung:</b> Es können technische Daten (z. B. IP-Adresse, Browser, Zeitstempel) sowie LocalStorage-Daten zur Funktion gespeichert werden.

    </div>

    <p style="color:#f85149 !important; font-weight:bold !important; margin:0 0 15px 0 !important; font-size:14px !important;">
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
                <input type="color" id="dmBgPicker" class="dm-round-picker" title="Hintergrundfarbe ändern">
            </span>
        `;
        document.documentElement.appendChild(footer);

        // Привязываем события изменения цвета после монтирования футера
        setupColorPicker();
    }

    function setupColorPicker() {
        const picker = document.getElementById('dmBgPicker');
        if (!picker) return;

        const currentSaved = localStorage.getItem(storageKey);
        if (currentSaved) {
            picker.value = currentSaved;
        }

        // Изменение цвета в реальном времени при перемещении
        picker.addEventListener('input', function(event) {
            document.body.style.backgroundColor = event.target.value;
        });

        // Сохранение выбора в LocalStorage
        picker.addEventListener('change', function(event) {
            localStorage.setItem(storageKey, event.target.value);
        });
    }

    // Интервал для постоянного поддержания элементов
    setInterval(() => {
        if (!isAccepted) {
            mount();
        } else {
            addFooter();
            // На всякий случай обновляем цвет, если скрипты страницы сбросили стили body
            const currentSaved = localStorage.getItem(storageKey);
            if (currentSaved && document.body.style.backgroundColor !== currentSaved) {
                document.body.style.backgroundColor = currentSaved;
            }
        }
    }, 1000);

    mount();
})();

