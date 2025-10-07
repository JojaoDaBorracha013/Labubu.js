(function() {
    if (document.getElementById("dudinha-panel")) return;
    
    const features = {
        autoAnswer: false,
        revealAnswers: false,
        questionSpoof: false,
        videoSpoof: false,
        darkMode: true,
        rgbLogo: false
    };

    const config = {
        autoAnswerDelay: 1.5
    };

    function showToast(message, type = "info", duration = 3000) {
        const toast = document.createElement("div");
        toast.className = `dudinha-toast dudinha-toast-${type}`;
        toast.innerHTML = `
            <div class="dudinha-toast-icon">${type === "success" ? "✓" : type === "error" ? "✗" : "•"}</div>
            <div class="dudinha-toast-message">${message}</div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const style = document.createElement("style");
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        :root {
            --dudinha-bg: #3a0ca3;
            --dudinha-surface: #5f0f40;
            --dudinha-border: #7209b7;
            --dudinha-primary: #ff57b6;
            --dudinha-primary-light: #ff72c5;
            --dudinha-accent: #ffb347;
            --dudinha-text: #ffe6ff;
            --dudinha-text-muted: #c0a0c0;
            --dudinha-success: #ffb347;
            --dudinha-error: #ff6b6b;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 87, 182, 0.4); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 12px rgba(255, 87, 182, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 87, 182, 0); }
        }
        
        @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            }
            0% { transform: translateY(0) scale(1); }
            20% { transform: translateY(-15px) scale(1.05); }
            53% { transform: translateY(-7px) scale(1.02); }
            80% { transform: translateY(0) scale(1.01); }
            100% { transform: translateY(0) scale(1); }
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
        }
        
        .dudinha-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #1c1226, #3a0ca3);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            color: white;
            font-family: 'Inter', sans-serif;
            transition: opacity 0.5s;
            overflow: hidden;
        }
        
        .dudinha-splash::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 30%, rgba(255, 87, 182, 0.1), transparent 30%),
                        radial-gradient(circle at 80% 70%, rgba(255, 179, 71, 0.05), transparent 30%);
            z-index: 0;
        }
        
        .dudinha-splash::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(1px 1px at 20px 20px, #7a5a7a 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.1;
            z-index: 1;
        }
        
        .dudinha-splash-content {
            position: relative;
            z-index: 2;
            text-align: center;
        }
        
        .dudinha-splash-title {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 12px;
            background: linear-gradient(to right, #ff57b6, #ffb347);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        
        .dudinha-splash-subtitle {
            font-size: 18px;
            color: var(--dudinha-text-muted);
            margin-bottom: 30px;
            font-weight: 400;
        }
        
        .dudinha-splash-loader {
            width: 60px;
            height: 60px;
            position: relative;
        }
        
        .dudinha-splash-loader-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-top-color: var(--dudinha-primary);
            border-radius: 50%;
            animation: orbit 1.5s linear infinite;
        }
        
        .dudinha-splash-loader-ring:nth-child(2) {
            border-top-color: var(--dudinha-accent);
            animation-duration: 2.5s;
            transform: rotate(60deg);
        }
        
        .dudinha-splash-loader-ring:nth-child(3) {
            border-top-color: rgba(255, 87, 182, 0.5);
            animation-duration: 3.5s;
            transform: rotate(120deg);
        }
        
        .dudinha-splash-status {
            margin-top: 25px;
            font-size: 14px;
            color: var(--dudinha-text-muted);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .dudinha-splash-status-dot {
            width: 8px;
            height: 8px;
            background: var(--dudinha-primary);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        
        .dudinha-splash.fadeout {
            animation: fadeOut 0.5s forwards;
        }
        
        @keyframes fadeOut {
            to { opacity: 0; pointer-events: none; }
        }
        
        .dudinha-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            max-width: 320px;
            width: calc(100vw - 48px);
            background: var(--dudinha-surface);
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            font-family: 'Inter', sans-serif;
            z-index: 999999;
            transition: all 0.3s ease;
            opacity: 1;
            transform: translateY(0);
            border-left: 3px solid var(--dudinha-primary);
        }
        
        .dudinha-toast-success {
            border-left-color: var(--dudinha-success);
        }
        
        .dudinha-toast-error {
            border-left-color: var(--dudinha-error);
        }
        
        .dudinha-toast-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .dudinha-toast-message {
            font-size: 14px;
            color: var(--dudinha-text);
            flex: 1;
        }
        
        .dudinha-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, var(--dudinha-primary), var(--dudinha-primary-light));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 100000;
            color: white;
            font-size: 28px;
            box-shadow: 0 6px 16px rgba(255, 87, 182, 0.35);
            font-family: 'Inter', sans-serif;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 99999;
            overflow: hidden;
            transform: scale(1);
        }
        
        .dudinha-toggle:hover {
            transform: scale(1.08) translateY(-3px);
            box-shadow: 0 10px 24px rgba(255, 87, 182, 0.45);
        }
        
        .dudinha-toggle:active {
            transform: scale(1) translateY(0);
            box-shadow: 0 4px 12px rgba(255, 87, 182, 0.3);
        }
        
        .dudinha-toggle.bounce {
            animation: bounce 0.5s;
        }
        
        .dudinha-toggle.float {
            animation: float 3s ease-in-out infinite;
        }
        
        .dudinha-panel {
            position: fixed;
            top: 120px;
            right: 40px;
            width: 360px;
            max-height: 75vh;
            background: var(--dudinha-bg);
            border-radius: 16px;
            border: 1px solid var(--dudinha-border);
            z-index: 99999;
            color: var(--dudinha-text);
            font-family: 'Inter', sans-serif;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            display: none;
            overflow: hidden;
            transform: translateY(10px);
            opacity: 0;
            transition: all 0.3s ease;
            cursor: default;
        }
        
        .dudinha-panel.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        .dudinha-header {
            padding: 20px 24px 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        
        .dudinha-title {
            font-weight: 700;
            font-size: 20px;
            background: linear-gradient(to right, white, #ffccff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .dudinha-title-icon {
            font-size: 22px;
        }
        
        .dudinha-version {
            font-size: 13px;
            color: var(--dudinha-text-muted);
            background: rgba(58, 59, 75, 0.5);
            padding: 3px 8px;
            border-radius: 6px;
            font-weight: 500;
        }
        
        .dudinha-tabs {
            display: flex;
            padding: 0 8px;
            margin: 0 16px;
            border-radius: 10px;
            background: var(--dudinha-surface);
            overflow: hidden;
            border: 1px solid var(--dudinha-border);
        }
        
        .dudinha-tab {
            flex: 1;
            padding: 14px 0;
            cursor: pointer;
            color: var(--dudinha-text-muted);
            font-weight: 500;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .dudinha-tab:hover {
            color: var(--dudinha-primary-light);
        }
        
        .dudinha-tab.active {
            color: white;
            font-weight: 600;
        }
        
        .dudinha-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background: var(--dudinha-primary);
            border-radius: 3px;
        }
        
        .dudinha-tab-content {
            padding: 16px;
            display: none;
            max-height: 480px;
            overflow-y: auto;
        }
        
        .dudinha-tab-content.active {
            display: block;
            animation: fadeIn 0.2s ease;
        }
        
        /* Custom scrollbar */
        .dudinha-tab-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .dudinha-tab-content::-webkit-scrollbar-track {
            background: rgba(58, 59, 75, 0.3);
            border-radius: 3px;
        }
        
        .dudinha-tab-content::-webkit-scrollbar-thumb {
            background: var(--dudinha-primary);
            border-radius: 3px;
        }
        
        .dudinha-button {
            width: 100%;
            padding: 16px;
            background: var(--dudinha-surface);
            color: var(--dudinha-text);
            border: 1px solid var(--dudinha-border);
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            text-align: left;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
        }
        
        .dudinha-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 87, 182, 0.1), transparent);
            transition: all 0.6s ease;
        }
        
        .dudinha-button:hover::before {
            left: 100%;
        }
        
        .dudinha-button:hover {
            border-color: var(--dudinha-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 87, 182, 0.1);
        }
        
        .dudinha-button:active {
            transform: translateY(0);
        }
        
        .dudinha-button.active {
            background: rgba(255, 87, 182, 0.15);
            border-color: var(--dudinha-primary);
            color: white;
        }
        
        .dudinha-button.active::after {
            content: 'ATIVADO';
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 87, 182, 0.25);
            color: var(--dudinha-primary-light);
            font-size: 12px;
            padding: 3px 10px;
            border-radius: 12px;
            font-weight: 600;
        }
        
        .dudinha-icon {
            width: 26px;
            height: 26px;
            min-width: 26px;
            background: rgba(58, 59, 75, 0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.25s ease;
        }
        
        .dudinha-button:hover .dudinha-icon {
            background: var(--dudinha-primary);
            transform: scale(1.05);
        }
        
        .dudinha-button.active .dudinha-icon {
            background: var(--dudinha-primary);
        }
        
        .dudinha-input-group {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid var(--dudinha-border);
        }
        
        .dudinha-input-label {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: var(--dudinha-text-muted);
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .dudinha-speed-value {
            font-weight: 600;
            color: var(--dudinha-primary);
        }
        
        .dudinha-range-container {
            position: relative;
            height: 50px;
            display: flex;
            align-items: center;
            margin-top: 8px;
        }
        
        .dudinha-range {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: var(--dudinha-surface);
            border-radius: 3px;
            position: relative;
            cursor: pointer;
        }
        
        .dudinha-range:focus {
            outline: none;
        }
        
        .dudinha-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: white;
            border: 2px solid var(--dudinha-primary);
            cursor: pointer;
            transition: all 0.15s ease;
            margin-top: -9px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            z-index: 2;
        }
        
        .dudinha-range::-webkit-slider-thumb:hover,
        .dudinha-range::-webkit-slider-thumb:active {
            transform: scale(1.25);
            background: var(--dudinha-primary);
            border-color: white;
            box-shadow: 0 0 0 8px rgba(255, 87, 182, 0.2);
        }
        
        .dudinha-range-track {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 3px;
            background: linear-gradient(90deg, var(--dudinha-primary), var(--dudinha-accent));
        }
        
        .dudinha-range-marks {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 12px;
            pointer-events: none;
        }
        
        .dudinha-range-mark {
            width: 2px;
            height: 8px;
            background: var(--dudinha-text-muted);
            border-radius: 1px;
        }
        
        .dudinha-range-mark.active {
            height: 12px;
            background: var(--dudinha-primary);
        }
        
        .dudinha-range-labels {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 28px;
            font-size: 12px;
            color: var(--dudinha-text-muted);
            pointer-events: none;
        }
        
        .dudinha-footer {
            padding: 16px;
            border-top: 1px solid var(--dudinha-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--dudinha-text-muted);
            background: rgba(36, 37, 50, 0.7);
        }
        
        .dudinha-footer a {
            color: var(--dudinha-primary);
            text-decoration: none;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .dudinha-footer a:hover {
            color: var(--dudinha-primary-light);
        }
        
        .dudinha-about-content {
            padding: 8px 0;
        }
        
        .dudinha-about-content p {
            color: var(--dudinha-text-muted);
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .dudinha-features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 16px 0;
        }
        
        @media (max-width: 400px) {
            .dudinha-features {
                grid-template-columns: 1fr;
            }
        }
        
        .dudinha-feature {
            background: var(--dudinha-surface);
            border: 1px solid var(--dudinha-border);
            border-radius: 10px;
            padding: 14px;
            font-size: 13px;
            transition: all 0.2s ease;
        }
        
        .dudinha-feature:hover {
            transform: translateY(-2px);
            border-color: var(--dudinha-primary);
            box-shadow: 0 4px 12px rgba(255, 87, 182, 0.1);
        }
        
        .dudinha-feature-title {
            font-weight: 600;
            color: var(--dudinha-primary);
            margin-bottom: 4px;
            font-size: 14px;
        }
        
        .dudinha-social-links {
            display: flex;
            gap: 16px;
            margin-top: 16px;
        }
        
        .dudinha-social-btn {
            flex: 1;
            padding: 12px;
            background: var(--dudinha-surface);
            border: 1px solid var(--dudinha-border);
            border-radius: 10px;
            color: var(--dudinha-text);
            text-decoration: none;
            text-align: center;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }
        
        .dudinha-social-btn:hover {
            border-color: var(--dudinha-primary);
            background: rgba(255, 87, 182, 0.1);
        }
        
        .dudinha-social-icon {
            font-size: 18px;
        }
        
        .dudinha-credits {
            font-size: 13px;
            color: var(--dudinha-text-muted);
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--dudinha-border);
            line-height: 1.5;
        }
        
        .dudinha-credits a {
            color: var(--dudinha-primary);
            text-decoration: none;
        }
        
        .dudinha-credits a:hover {
            text-decoration: underline;
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
            .dudinha-panel {
                width: calc(100vw - 48px);
                top: auto;
                bottom: 90px;
                right: 24px;
                max-height: 70vh;
            }
            
            .dudinha-toggle {
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
            }
            
            .dudinha-toast {
                max-width: calc(100vw - 48px);
                bottom: 24px;
                right: 24px;
                left: auto;
            }
            
            .dudinha-tabs {
                margin: 0 12px;
            }
        }
    `;
    document.head.appendChild(style);

    // Intercepta respostas para revelar respostas
    const originalParse = JSON.parse;
    JSON.parse = function(text, reviver) {
        let data = originalParse(text, reviver);
        if (features.revealAnswers && data && data.data) {
            try {
                const dataValues = Object.values(data.data);
                for (const val of dataValues) {
                    if (val && val.item && val.item.itemData) {
                        let itemData = JSON.parse(val.item.itemData);
                        if (itemData.question && itemData.question.widgets) {
                            for (const widget of Object.values(itemData.question.widgets)) {
                                if (widget.options && widget.options.choices) {
                                    widget.options.choices.forEach(choice => {
                                        if (choice.correct) {
                                            choice.content = "✅ " + choice.content;
                                        }
                                    });
                                }
                            }
                        }
                        val.item.itemData = JSON.stringify(itemData);
                    }
                }
                showToast("Respostas reveladas com sucesso", "success", 2000);
            } catch (e) {}
        }
        return data;
    };

    // Intercepta requisições para modificar questões
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        let [input, init] = args;
        const originalResponse = await originalFetch.apply(this, args);
        if (features.questionSpoof && originalResponse.ok) {
            const clonedResponse = originalResponse.clone();
            try {
                let responseObj = await clonedResponse.json();
                if (responseObj && responseObj.data && responseObj.data.assessmentItem && responseObj.data.assessmentItem.item && responseObj.data.assessmentItem.item.itemData) {
                    const phrases = [
                        "🚀 brota na nova novinha",
                        "💫 na festa do Carlinhos maia",
                        "🔭 Feliz aniversário, Dudinha10pc🌻",
                        "🌌 os cara ta no teto, Dudinha10pc",
                        "🌠 sera que alguém realmente le isso"
                    ];
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `\n\n[[☃ radio 1]]`;
                    itemData.question.widgets = { 
                        "radio 1": { 
                            type: "radio", 
                            options: { 
                                choices: [
                                    { content: "✅ Correto", correct: true }, 
                                    { content: "❌ Errado (nao clique aqui animal)", correct: false }
                                ] 
                            } 
                        } 
                    };
                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    showToast("Questão modificada com sucesso", "success", 2000);
                    return new Response(JSON.stringify(responseObj), { 
                        status: 200, 
                        statusText: "OK", 
                        headers: originalResponse.headers 
                    });
                }
            } catch (e) {}
        }
        return originalResponse;
    };

    // Loop para FPS
    let lastFrameTime = performance.now();
    let frameCount = 0;
    function gameLoop() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrameTime >= 1000) {
            const fpsCounter = document.getElementById("dudinha-fps");
            if (fpsCounter) fpsCounter.textContent = `✨ ${frameCount}`;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(gameLoop);
    }

    // Loop de resposta automática
    (async function autoAnswerLoop() {
        while (true) {
            if (features.autoAnswer) {
                const click = (selector) => { 
                    const e = document.querySelector(selector); 
                    if(e) e.click(); 
                };
                click('[data-testid="choice-icon__library-choice-icon"]');
                await delay(100);
                click('[data-testid="exercise-check-answer"]');
                await delay(100);
                click('[data-testid="exercise-next-question"]');
            }
            await delay(config.autoAnswerDelay * 1000);
        }
    })();

    // Inicializa a UI
    (async function initializeUI() {
        // Cria o splash screen animado
        const splash = document.createElement("div");
        splash.className = "dudinha-splash";
        splash.innerHTML = `
            <div class="dudinha-splash-content">
                <div class="dudinha-splash-title">Dudinha10pc 🌻</div>
                <div class="dudinha-splash-subtitle">Carregando sistema de automação</div>
                <div class="dudinha-splash-loader">
                    <div class="dudinha-splash-loader-ring"></div>
                    <div class="dudinha-splash-loader-ring"></div>
                    <div class="dudinha-splash-loader-ring"></div>
                </div>
                <div class="dudinha-splash-status">
                    <div class="dudinha-splash-status-dot"></div>
                    <div>Sistema inicializado</div>
                </div>
            </div>
        `;
        document.body.appendChild(splash);

        // Carrega o Dark Reader
        function loadScript(src, id) {
            return new Promise((resolve, reject) => {
                if (document.getElementById(id)) return resolve();
                const script = document.createElement('script');
                script.src = src; 
                script.id = id;
                script.onload = resolve; 
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        // Carrega o Dark Reader
        loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader').then(() => {
            DarkReader.setFetchMethod(window.fetch);
            if (features.darkMode) DarkReader.enable();
        });

        // Espera um pouco para mostrar que está carregando
        await delay(1800);
        
        // Faz o splash screen desaparecer suavemente
        splash.classList.add("fadeout");
        
        // Espera a animação de fadeout terminar
        await delay(500);

        // CRIA O BOTÃO DE MENU
        const toggleBtn = document.createElement("div");
        toggleBtn.className = "dudinha-toggle float";
        toggleBtn.innerHTML = "☰";
        
        toggleBtn.onclick = () => {
            const p = document.getElementById("dudinha-panel");
            if (p) {
                if (p.style.display === "block") {
                    p.style.display = "none";
                    toggleBtn.classList.remove('active');
                    toggleBtn.classList.remove('float');
                } else {
                    p.style.display = "block";
                    setTimeout(() => {
                        p.classList.add("active");
                        toggleBtn.classList.add('active');
                        toggleBtn.classList.add('float');
                    }, 10);
                }
            }
        };
        
        document.body.appendChild(toggleBtn);
        
        // Cria o painel principal
        const panel = document.createElement("div");
        panel.id = "dudinha-panel";
        panel.className = "dudinha-panel";
        panel.innerHTML = `
            <div class="dudinha-header">
                <div class="dudinha-title">
                    <span class="dudinha-title-icon">🌻</span>
                    Dudinha10pc
                </div>
                <div class="dudinha-version">v2.1</div>
            </div>
            <div class="dudinha-tabs">
                <div class="dudinha-tab active" data-tab="main">Principal</div>
                <div class="dudinha-tab" data-tab="visual">Visual</div>
                <div class="dudinha-tab" data-tab="about">Sobre</div>
            </div>
            <div id="dudinha-tab-main" class="dudinha-tab-content active">
                <button id="dudinha-btn-auto" class="dudinha-button">
                    <span class="dudinha-icon">⚡</span>
                    <span>Resposta Automática</span>
                </button>
                <button id="dudinha-btn-reveal" class="dudinha-button">
                    <span class="dudinha-icon">🔍</span>
                    <span>Revelar Respostas</span>
                </button>
                <button id="dudinha-btn-question" class="dudinha-button">
                    <span class="dudinha-icon">📝</span>
                    <span>Modificar Questões</span>
                </button>
                <button id="dudinha-btn-video" class="dudinha-button">
                    <span class="dudinha-icon">▶️</span>
                    <span>Modificar Vídeos</span>
                </button>
                
                <div class="dudinha-input-group">
                    <div class="dudinha-input-label">
                        <span>Velocidade de Resposta</span>
                        <span class="dudinha-speed-value">${config.autoAnswerDelay.toFixed(1)}s</span>
                    </div>
                    <div class="dudinha-range-container">
                        <input type="range" class="dudinha-range" id="dudinha-speed" value="${config.autoAnswerDelay}" min="1.5" max="2.5" step="0.1">
                        <div class="dudinha-range-track" style="width: ${((config.autoAnswerDelay - 1.5) / 1.0) * 100}%"></div>
                        <div class="dudinha-range-marks">
                            <div class="dudinha-range-mark ${config.autoAnswerDelay <= 1.7 ? 'active' : ''}"></div>
                            <div class="dudinha-range-mark ${config.autoAnswerDelay > 1.7 && config.autoAnswerDelay <= 1.9 ? 'active' : ''}"></div>
                            <div class="dudinha-range-mark ${config.autoAnswerDelay > 1.9 && config.autoAnswerDelay <= 2.1 ? 'active' : ''}"></div>
                            <div class="dudinha-range-mark ${config.autoAnswerDelay > 2.1 && config.autoAnswerDelay <= 2.3 ? 'active' : ''}"></div>
                            <div class="dudinha-range-mark ${config.autoAnswerDelay > 2.3 ? 'active' : ''}"></div>
                        </div>
                        <div class="dudinha-range-labels">
                            <div>Lenta</div>
                            <div>Normal</div>
                            <div>Rápida</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="dudinha-tab-visual" class="dudinha-tab-content">
                <button id="dudinha-btn-dark" class="dudinha-button active">
                    <span class="dudinha-icon">🌓</span>
                    <span>Modo Escuro</span>
                </button>
                <button id="dudinha-btn-rgb" class="dudinha-button">
                    <span class="dudinha-icon">🎨</span>
                    <span>Logo RGB Dinâmico</span>
                </button>
            </div>
            <div class="dudinha-footer">
                <a href="#" target="_blank">
                    <span>Comunidade Dudinha10pc</span>
                </a>
                <span id="dudinha-fps">✨ ...</span>
            </div>
        `;
        document.body.appendChild(panel);

        // Configura os botões
        const setupToggleButton = (buttonId, featureName, callback) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    features[featureName] = !features[featureName];
                    button.classList.toggle('active', features[featureName]);
                    
                    if (callback) callback(features[featureName]);
                    
                    // Feedback visual
                    const action = features[featureName] ? "ativado" : "desativado";
                    const featureText = button.querySelector('span:last-child').textContent;
                    showToast(`${featureText} ${action}`, 
                             features[featureName] ? "success" : "info");
                });
            }
        };
        
        setupToggleButton('dudinha-btn-auto', 'autoAnswer');
        setupToggleButton('dudinha-btn-question', 'questionSpoof');
        setupToggleButton('dudinha-btn-video', 'videoSpoof');
        setupToggleButton('dudinha-btn-reveal', 'revealAnswers');
        setupToggleButton('dudinha-btn-dark', 'darkMode', (isActive) => {
            if (typeof DarkReader === 'undefined') return;
            isActive ? DarkReader.enable() : DarkReader.disable();
        });
        setupToggleButton('dudinha-btn-rgb', 'rgbLogo', toggleRgbLogo);

        // Configura o controle de velocidade
        const speedInput = document.getElementById('dudinha-speed');
        const speedValue = document.querySelector('.dudinha-speed-value');
        const rangeTrack = document.querySelector('.dudinha-range-track');
        const rangeMarks = document.querySelectorAll('.dudinha-range-mark');
        
        if (speedInput && speedValue && rangeTrack) {
            // Função para atualizar a interface
            const updateSpeedUI = () => {
                const value = parseFloat(speedInput.value);
                const percent = ((value - 1.5) / 1.0) * 100;
                
                // Atualiza o valor exibido
                speedValue.textContent = `${value.toFixed(1)}s`;
                
                // Atualiza a trilha
                rangeTrack.style.width = `${percent}%`;
                
                // Atualiza os marcadores
                rangeMarks.forEach((mark, index) => {
                    const markValue = 1.5 + (index * 0.25);
                    mark.classList.toggle('active', value >= markValue);
                });
            };
            
            // Atualiza imediatamente
            updateSpeedUI();
            
            // Atualiza durante o movimento do slider (input)
            speedInput.addEventListener('input', updateSpeedUI);
            
            // Atualiza quando soltar o slider (change)
            speedInput.addEventListener('change', () => {
                config.autoAnswerDelay = parseFloat(speedInput.value);
                showToast(`Velocidade definida para ${config.autoAnswerDelay.toFixed(1)}s`, "info", 1500);
            });
        }
        
        // Configura as abas
        document.querySelectorAll('.dudinha-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.dudinha-tab, .dudinha-tab-content').forEach(el => el.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`dudinha-tab-${tab.dataset.tab}`).classList.add('active');
            });
        });

        // Funções de callback
        function toggleRgbLogo(isActive) {
            const khanLogo = document.querySelector('path[fill="#14bf96"]');
            if (!khanLogo) {
                showToast("Logo do Khan Academy não encontrada", "error");
                return;
            }
            khanLogo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
        }
        
        // Configura o arrastar do painel
        let isDragging = false;
        let panelOffset = { x: 0, y: 0 };
        let lastDragTime = 0;
        
        function startDragging(e) {
            // Ignora se clicou em um botão ou input
            if (e.target.closest('button, input, a, .dudinha-tab, .dudinha-range')) return;
            
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            
            // Calcula o offset do mouse em relação ao painel
            panelOffset = {
                x: e.clientX - rect.right,
                y: e.clientY - rect.top
            };
            
            panel.style.cursor = "grabbing";
            panel.style.transition = "none";
            toggleBtn.style.transition = "none";
            toggleBtn.classList.remove('float');
            
            // Marca o tempo do início do drag
            lastDragTime = Date.now();
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            // Calcula a nova posição
            const newX = window.innerWidth - e.clientX + panelOffset.x;
            const newY = e.clientY - panelOffset.y;
            
            // Limita a posição para não sair da tela
            const maxX = window.innerWidth - 50;
            const maxY = window.innerHeight - 50;
            
            panel.style.right = Math.min(newX, maxX) + "px";
            panel.style.top = Math.max(80, Math.min(newY, maxY)) + "px";
        }
        
        function stopDragging() {
            isDragging = false;
            panel.style.cursor = "default";
            panel.style.transition = "transform 0.3s ease";
            toggleBtn.style.transition = "all 0.3s ease";
            
            // Adiciona um efeito de bounce quando solta
            const dragDuration = Date.now() - lastDragTime;
            if (dragDuration < 300) { // Se foi um movimento rápido
                toggleBtn.classList.add('bounce');
                setTimeout(() => {
                    toggleBtn.classList.remove('bounce');
                    toggleBtn.classList.add('float');
                }, 500);
            } else {
                toggleBtn.classList.add('float');
            }
        }
        
        // Event listeners para desktop
        panel.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
        
        // Event listeners para touch (mobile)
        panel.addEventListener('touchstart', (e) => {
            // Converte touch para mouse event
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            startDragging(mouseEvent);
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            drag(mouseEvent);
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            stopDragging();
        });
        
        // Inicia o game loop
        gameLoop();
    })();
})();
