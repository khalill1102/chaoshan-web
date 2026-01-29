// 游戏状态数据
let gameState = {
    role: '',
    year: 1,
    stats: {
        finger: 0, // 指力
        vision: 0, // 眼界
        idea: 0,   // 构思
        heart: 0,  // 匠心
        fame: 0,   // 名望
        inherit: 0 // 传承值
    }
};

// 角色预设数据 
const roles = {
    heir: { 
        name: "百年老字号传人", icon: "🏠", 
        stats: { finger: 40, vision: 30, idea: 30, heart: 45, fame: 65, inherit: 10 } 
    },
    mason: { 
        name: "流浪泥水匠", icon: "🔨", 
        stats: { finger: 75, vision: 15, idea: 25, heart: 30, fame: 5, inherit: 0 } 
    },
    student: { 
        name: "外籍美术留学生", icon: "🎨", 
        stats: { finger: 5, vision: 50, idea: 75, heart: 35, fame: 30, inherit: 5 } 
    }
};

// 1. 切换场景函数
function goToScene(sceneId) {
    // 隐藏所有场景
    document.querySelectorAll('.game-scene').forEach(el => {
        el.classList.remove('active');
    });
    // 显示目标场景
    document.getElementById(sceneId).classList.add('active');
}

// 2. 开始游戏
function startGame(roleKey) {
    // 初始化数据
    gameState.role = roleKey;
    gameState.year = 1;
    // 深度复制角色属性
    gameState.stats = { ...roles[roleKey].stats };

    // 更新UI
    updateDashboardUI();
    document.getElementById('player-name').innerText = roles[roleKey].name;
    document.getElementById('player-avatar').innerText = roles[roleKey].icon;

    // 添加初始日志
    addLog(`【开启人生】你选择了 <strong>${roles[roleKey].name}</strong>。`, "system");
    addLog("你要在这一年里打磨技艺。是坚守古法，还是拥抱创新？一切由你决定。", "system");

    // 进入主界面
    goToScene('scene-main');
}

// 3. 更新界面数值
function updateDashboardUI() {
    // 更新进度条宽度
    document.getElementById('stat-finger').style.width = gameState.stats.finger + '%';
    document.getElementById('stat-vision').style.width = gameState.stats.vision + '%';
    document.getElementById('stat-idea').style.width = gameState.stats.idea + '%';
    
    // 更新数值文本
    document.getElementById('val-heart').innerText = gameState.stats.heart;
    document.getElementById('val-fame').innerText = gameState.stats.fame;
    document.getElementById('val-inherit').innerText = gameState.stats.inherit;
    document.getElementById('turn-count').innerText = gameState.stats.year;
}

// 4. 添加日志
function addLog(text, type = "normal") {
    const logBox = document.getElementById('game-log');
    const p = document.createElement('div');
    p.className = `log-item ${type}`;
    p.innerHTML = `[第${gameState.stats.year}年] ${text}`;
    logBox.prepend(p); // 新消息在最上面
}

// 5. 核心：执行操作逻辑 [cite: 59, 114]
function doAction(actionType) {
    gameState.year++; // 每年只能做一件事
    
    let msg = "";
    const s = gameState.stats;

    switch(actionType) {
        case 'study_basic': // 基础练习：加指力
            s.finger += 10; s.heart += 5;
            msg = "你闭关苦练铰瓷基本功，手指被瓷片划破多次，但指力精进不少。(指力+10, 匠心+5)";
            break;
            
        case 'study_folk': // 研读民俗：加眼界
            s.vision += 10; s.fame += 2;
            msg = "你走访了村里的老人，听他们讲戏文里的故事。你对嵌瓷题材的理解更深了。(眼界+10, 名望+2)";
            break;

        case 'create_small': // 接小订单：加名望，减匠心(如果不达标)
            if(s.finger > 30) {
                s.fame += 5; s.heart += 2;
                msg = "你为邻居修缮了屋脊上的花鸟。虽然是小活，但你完成得一丝不苟。(名望+5)";
            } else {
                s.fame -= 2; s.heart -= 5;
                msg = "由于指力不足，你剪出的瓷片边缘毛糙，邻居似乎不太满意。(名望下降，匠心受损)";
            }
            break;

        case 'create_master': // 宗祠大作：高风险高回报 [cite: 63]
            if(s.finger > 60 && s.vision > 50) {
                s.fame += 20; s.inherit += 10; s.heart += 10;
                msg = "<strong>【神来之笔】</strong>你主持了宗祠的修缮！龙凤栩栩如生，全村人都来围观，称你是大师再世！(名望大涨，传承值+10)";
            } else {
                s.fame -= 10; s.heart -= 5;
                msg = "<strong>【搞砸了】</strong>你强行承接大工程，但技艺火候未到，不仅被退单，还成了行内的笑柄。";
            }
            break;

        case 'teach': // 收徒 [cite: 86]
            if(s.fame > 50) {
                s.inherit += 15;
                msg = "你的名气吸引了年轻人来拜师。你将平生所学倾囊相授，看着技艺有了传人，你倍感欣慰。(传承值+15)";
            } else {
                msg = "你想收徒，但因为名气不大，无人问津。看来还得先磨练自己。";
            }
            break;

        case 'exhibit': // 展览
            if(s.inherit > 20) {
                s.fame += 15; s.vision += 5;
                msg = "你带着作品参加了市里的非遗展。虽然有人说这是“老古董”，但更多人被这种色彩震撼。(名望+15)";
            } else {
                msg = "你的作品数量太少，主办方婉拒了你的参展申请。";
            }
            break;
    }

    // 限制数值上限
    for(let key in s) {
        if(s[key] > 100) s[key] = 100;
        if(s[key] < 0) s[key] = 0;
    }

    // 写入日志并更新UI
    addLog(msg);
    updateDashboardUI();
}