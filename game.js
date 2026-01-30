let gameState = {
    role: '',
    year: 1,
    maxYears: 20,
    stats: {
        finger: 0,
        vision: 0,
        idea: 0,
        knowledge: 0,
        heart: 0,
        fame: 0,
        inherit: 0,
        wealth: 0
    }
};

const roles = {
    heir: { 
        name: "百年老字号传人", 
        icon: "🏠", 
        desc: "家底殷实，民俗深厚，但受祖训束缚。",
        stats: { finger: 40, vision: 30, idea: 20, knowledge: 50, heart: 45, fame: 65, inherit: 10, wealth: 60 } 
    },
    mason: { 
        name: "流浪泥水匠", 
        icon: "🔨", 
        desc: "指力惊人，吃苦耐劳，但缺乏美学与资金。",
        stats: { finger: 75, vision: 15, idea: 25, knowledge: 10, heart: 30, fame: 5, inherit: 0, wealth: 10 } 
    },
    student: { 
        name: "外籍美术留学生", 
        icon: "🎨", 
        desc: "构思新颖，但不懂民俗禁忌。",
        stats: { finger: 5, vision: 50, idea: 75, knowledge: 0, heart: 35, fame: 30, inherit: 5, wealth: 30 } 
    }
};

function goToScene(sceneId) {
    document.querySelectorAll('.game-scene').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(sceneId).classList.add('active');
}

function showModal(title, desc) {
    const modal = document.getElementById('event-modal');
    if(modal) {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-desc').innerHTML = desc;
        modal.classList.remove('hidden');
    } else {
        alert(`${title}\n${desc.replace(/<br>/g, "\n")}`);
    }
}

function closeModal() {
    const modal = document.getElementById('event-modal');
    if(modal) modal.classList.add('hidden');
    checkGameStatus();
}

function updateDashboardUI() {
    const s = gameState.stats;
    
    const setWidth = (id, val) => {
        const el = document.getElementById(id);
        if(el) el.style.width = Math.min(Math.max(val, 0), 100) + '%';
    };

    setWidth('stat-finger', s.finger);
    setWidth('stat-vision', s.vision);
    setWidth('stat-idea', s.idea);
    setWidth('stat-knowledge', s.knowledge);
    
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if(el) el.innerText = Math.floor(val);
    };

    setText('val-heart', s.heart);
    setText('val-fame', s.fame);
    setText('val-inherit', s.inherit);
    setText('val-wealth', s.wealth);
    setText('turn-count', s.year);
}

function addLog(text, type = "normal") {
    const logBox = document.getElementById('game-log');
    if (!logBox) return;
    
    const div = document.createElement('div');
    div.className = `log-item ${type}`;
    div.innerHTML = `<span class="log-year">[第${gameState.year}年]</span> ${text}`;
    
    logBox.prepend(div);
}

function startGame(roleKey) {
    gameState.role = roleKey;
    gameState.year = 1;
    gameState.stats = { ...roles[roleKey].stats };

    const role = roles[roleKey];
    const nameEl = document.getElementById('player-name');
    const avatarEl = document.getElementById('player-avatar');
    if(nameEl) nameEl.innerText = role.name;
    if(avatarEl) avatarEl.innerText = role.icon;

    const logBox = document.getElementById('game-log');
    if(logBox) logBox.innerHTML = '';

    addLog(`【人生开启】你选择了 <strong>${role.name}</strong>。`, "system");
    addLog(role.desc, "system");
    addLog("需平衡【家底】与【传承】，切记：无家底难买好瓷，无民俗难入宗祠。", "highlight");

    updateDashboardUI();
    goToScene('scene-main');
}

function doAction(actionType) {
    if (gameState.year > gameState.maxYears) return;

    const s = gameState.stats;
    let msg = "";
    let modalTitle = "";
    let modalDesc = "";
    let cost = 0;
    
    const currentYear = gameState.year;

    switch(actionType) {
        case 'study_basic': 
            cost = 2;
            if(s.wealth < cost) {
                showModal("囊中羞涩", "连最便宜的练手瓷片都买不起了，先去接点小活赚钱吧。");
                return; 
            }
            s.wealth -= cost;
            s.finger += 8; 
            s.heart += 3;
            msg = "闭关苦练铰瓷，指尖满是伤痕，但技艺精进。";
            
            if(s.finger < 30 && Math.random() < 0.2) {
                s.finger = Math.max(0, s.finger - 5);
                modalTitle = "意外划伤";
                modalDesc = "操作不当，瓷片划伤了手掌，修养导致指力暂时下降。";
                showModal(modalTitle, modalDesc);
            }
            break;
            
        case 'study_folk': 
            s.knowledge += 10; 
            s.vision += 5;
            msg = "走访村中老人，记录下关于“龙凤仪态”的口诀。";
            break;

        case 'create_small': 
            if(s.finger >= 20) {
                let income = Math.floor(10 + s.fame * 0.1);
                s.wealth += income; 
                s.fame += 2; 
                s.finger += 1;
                msg = `承接民居屋脊修缮，赚取了 ${income} 家底。`;
            } else {
                s.wealth -= 2;
                s.fame -= 3;
                modalTitle = "搞砸了";
                modalDesc = "指力不足，剪出的瓷片参差不齐，被雇主嫌弃，赔了点材料费。";
                showModal(modalTitle, modalDesc);
            }
            break;

        case 'create_master': 
            cost = 30;
            if(s.wealth < cost) {
                showModal("资金不足", `创作宗祠级作品需要顶级胎骨和颜料，至少需要 ${cost} 家底。<br>当前仅有: ${s.wealth}`);
                return;
            }
            
            s.wealth -= cost;

            let successRate = (s.finger * 0.4) + (s.knowledge * 0.4) + (s.vision * 0.2);
            let roll = (Math.random() * 100) - 10; 

            if(successRate > roll) {
                let reward = 50;
                s.fame += 25; 
                s.inherit += 10; 
                s.wealth += reward; 
                s.heart += 10;
                msg = "宗祠作品惊艳全村！";
                modalTitle = "神来之笔";
                modalDesc = `你对传统禁忌的把控（民俗 ${s.knowledge}）与精湛工艺（指力 ${s.finger}）完美融合。<br>族老们一致认可，名望大涨！`;
                showModal(modalTitle, modalDesc);
            } else {
                s.fame -= 15; 
                s.heart -= 10;
                msg = "宗祠作品引发争议，损失惨重。";
                modalTitle = "技艺未到";
                modalDesc = "虽然投入重金，但作品因“造型呆板”或“触犯纹样禁忌”被拒收。<br>材料费打了水漂，名望受损。";
                showModal(modalTitle, modalDesc);
            }
            break;

        case 'teach': 
            if(s.fame > 50 && s.knowledge > 40) {
                s.inherit += 15; 
                s.fame += 5;
                s.wealth -= 5;
                msg = "开门收徒，将平生所学倾囊相授。";
            } else {
                showModal("无人拜师", "你的名望不足，或者对民俗典故知之甚少（民俗知识<40），<br>无法让年轻人信服。");
                return;
            }
            break;

        case 'exhibit': 
            cost = 15;
            if(s.inherit > 20 && s.wealth >= cost) {
                s.wealth -= cost;
                s.fame += 20; 
                s.vision += 15;
                msg = "前往省城参加非遗展，虽然花销不少，但大开眼界。";
            } else {
                showModal("条件未达", "参展需要一定的作品积累（传承值>20），且需支付差旅费。");
                return;
            }
            break;
            
        default:
            console.error("未知行动类型");
            return;
    }

    gameState.year++;

    for(let key in s) {
        if(key === 'inherit') {
             if(s[key] > 100) s[key] = 100;
        } else {
             if(s[key] > 100) s[key] = 100;
        }
        if(s[key] < 0) s[key] = 0;
    }

    addLog(msg);
    updateDashboardUI();
}

function checkGameStatus() {
    const s = gameState.stats;

    if(s.wealth <= 0 && gameState.year > 3) {
    }

    if(gameState.year > gameState.maxYears) {
        let endingTitle = "";
        let endingDesc = "";
        
        if(s.inherit >= 80) {
            endingTitle = "结局：走向世界";
            endingDesc = "你的技艺不仅在本地传承有序，更惊艳了世界。你的名字被刻入非遗名录，从乡村走向了国际舞台！";
        } else if (s.inherit >= 30) {
            endingTitle = "结局：匠人守望";
            endingDesc = "你在本地颇有名气，虽然没有大富大贵，但带出了几个好徒弟，这门手艺在你们手中顽强地活着。";
        } else {
            endingTitle = "结局：隐匿时光";
            endingDesc = "随着年岁增长，你逐渐干不动了。因为没有得力的传人，这门技艺随着你的老去，慢慢淡出了人们的视野...";
        }

        showModal(endingTitle, endingDesc);
        document.querySelector('.action-area').style.pointerEvents = 'none';
        document.querySelector('.action-area').style.opacity = '0.5';
    }
}
