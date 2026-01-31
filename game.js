window.onload = function() {
    simulateBoot();
};

function simulateBoot() {
    const logs = [
        "> 10%",
        "> 20%",
        "> 30%",
        "> 40%",
        "> 50%",
        "> 60%",
        "> 70%",
        "> 90%",
        "> 100%",
        ">  OK",
        "> --------------------------------",
        "> All Systems Operational.",
        "> Ready to launch Immersive Mode."
    ];
    
    let i = 0;
    const logDiv = document.getElementById('boot-log');
    const progBar = document.getElementById('boot-progress');
    const statusDiv = document.getElementById('device-status');

    const timer = setInterval(() => {
        if (i < logs.length) {
            const p = document.createElement('div');
            p.innerText = logs[i];
            
    
            if (logs[i].includes('OK') || logs[i].includes('Connected') || logs[i].includes('Active') || logs[i].includes('Done')) {
                p.style.color = '#00ff00'; 
                p.style.textShadow = '0 0 5px rgba(0,255,0,0.5)';
            }
            
            logDiv.appendChild(p);
            logDiv.scrollTop = logDiv.scrollHeight;
            progBar.style.width = ((i + 1) / logs.length * 100) + "%";
            i++;
        } else {
            clearInterval(timer);
            statusDiv.style.opacity = "1"; 
            statusDiv.style.transform = "translateY(0)";
        }
    }, 300); 
}


function enterWorkstation() {
    const startScreen = document.getElementById('start-screen');
    startScreen.style.opacity = '0';
    startScreen.style.transition = 'opacity 0.8s';
    
    setTimeout(() => {
        startScreen.style.display = 'none';
        addLog("> 沉浸式系统已启动。力反馈模组已激活。");
        addLog("> 动作捕捉同步率: 99.8%。");
        addLog("> 请使用手柄(鼠标)进行[AI智能扫描]操作。");
    }, 800);
}



let gameState = {
    step: 0,        
    progress: 0,    
    integrity: 25,  
    colorMatch: 0   
};


const steps = [
    { id: 'scan',  name: 'AI 扫描',     time: 2000, log: '正在建立高精度点云模型...', progressAdd: 20 },
    { id: 'clean', name: '胎骨清理',    time: 1500, log: '去除表面风化层与杂质...',  progressAdd: 20 },
    { id: 'cut',   name: '数字剪瓷',    time: 2500, log: '匹配瓷片形状库 (3200种)...', progressAdd: 30 },
    { id: 'paste', name: '嵌贴 & 填缝', time: 3000, log: '应用灰泥物理模拟 & 固化...', progressAdd: 30 }
];


function performAction(actionId) {
    const currentStepIndex = steps.findIndex(s => s.id === actionId);
    
    if (currentStepIndex !== gameState.step) {
        alert("请按照工艺流程顺序操作！当前应执行：" + steps[gameState.step].name);
        return;
    }

    const stepData = steps[currentStepIndex];
    const btn = document.getElementById('btn-' + actionId);
    
    btn.disabled = true;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> <div><div>${stepData.name} 中...</div><div style="font-size:0.7em">Processing...</div></div>`;
    btn.style.background = "#444";
    
    startEffects(actionId);

    addLog(`> [CMD] Executing: ${stepData.name}`);
    addLog(`> ${stepData.log}`);

    setTimeout(() => {
        finishStep(currentStepIndex, btn, stepData);
    }, stepData.time);
}

function finishStep(index, btn, data) {
    
    gameState.step++;
    gameState.progress += data.progressAdd;
    gameState.integrity += 20; 
    if(gameState.integrity > 100) gameState.integrity = 100;
    
    gameState.colorMatch += 25; 
    
    updateProgressBar('prog-total', 'text-total', gameState.progress);
    updateProgressBar('prog-integrity', 'text-integrity', gameState.integrity);
    updateProgressBar('prog-color', 'text-color', gameState.colorMatch);

    
    btn.innerHTML = `<i class="fas fa-check-circle"></i> <div><div>${data.name} 完成</div><div style="font-size:0.7em">Completed</div></div>`;
    btn.classList.add('finished'); 
    btn.style.background = ""; 
  
    stopEffects();
    
    addLog(`> [SUCCESS] ${data.name} 完成。耗时: ${(data.time/1000).toFixed(1)}s`);


    const modelImg = document.getElementById('target-model');
    
    if (gameState.step === 1) modelImg.style.filter = "grayscale(100%) contrast(1.2) brightness(1.0)"; // 扫描后变亮
    if (gameState.step === 2) modelImg.style.filter = "grayscale(80%) contrast(1.1) brightness(1.1)"; // 清理后稍微有点色
    if (gameState.step === 3) modelImg.style.filter = "grayscale(40%) contrast(1.1) brightness(1.1)"; // 剪瓷后更多色
    

    if (gameState.progress >= 100) {
        modelImg.style.filter = "grayscale(0%) contrast(1.1) brightness(1.0)"; 
        modelImg.style.transform = "scale(1.05)"; 
        addLog("> --------------------------------");
        addLog("> 修复工程 100% 完成。");
        addLog("> 嵌瓷（数字化）已生成。请导出。");
        
       
        const submitBtn = document.getElementById('btn-submit');
        submitBtn.classList.add('ready');
        
    } else {
       
        if (gameState.step < steps.length) {
            const nextId = steps[gameState.step].id;
            const nextBtn = document.getElementById('btn-' + nextId);
            nextBtn.disabled = false;
            nextBtn.style.border = "1px solid #00e5ff"; 
            addLog(`> 等待执行下一步: ${steps[gameState.step].name}`);
        }
    }
}


function updateProgressBar(barId, textId, value) {
    document.getElementById(barId).style.width = value + '%';
    if(textId) document.getElementById(textId).innerText = value + '%';
}


function startEffects(actionId) {
    const floatText = document.getElementById('float-text');
    floatText.style.display = 'block';
    
    if (actionId === 'scan') {
        document.getElementById('scan-fx').style.display = 'block';
        floatText.innerText = "SCANNING...";
    } else if (actionId === 'clean') {
        floatText.innerText = "CLEANING...";
    } else if (actionId === 'cut') {
        floatText.innerText = "CALCULATING...";
    } else if (actionId === 'paste') {
        floatText.innerText = "ASSEMBLING...";
    }
}

function stopEffects() {
    document.getElementById('scan-fx').style.display = 'none';
    document.getElementById('float-text').style.display = 'none';
}


function addLog(msg) {
    const consoleBox = document.getElementById('console-log');
    consoleBox.innerHTML += `<div>${msg}</div>`;
    consoleBox.scrollTop = consoleBox.scrollHeight; 
}


function finishGame() {
   
    document.getElementById('result-modal').style.display = 'flex';
}
