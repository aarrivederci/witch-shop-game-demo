/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Room Renderer (像素风重制版)

   【改动说明】
   - 魔女改为纯 Canvas 像素小人（御姐风格，紫黑配色，尖帽）
   - 有 idle / working / success 三种帧动画
   - setWitchState(state) 供 game.js 调用
   - 保留原有房间背景、货架、蜡烛等场景元素
═══════════════════════════════════════════════════════ */

const Renderer = (() => {
  let canvas, ctx;
  let animFrame = null;
  let tick = 0;

  // 魔女状态机
  let _witchState  = 'idle';   // 'idle' | 'working' | 'success'
  let _witchTimer  = 0;        // 状态持续帧数
  let _witchX      = 0;        // 由 _draw() 动态计算
  let _witchFaceR  = false;    // false=朝右，true=朝左

  /* ─── INIT ─── */
  function init() {
    canvas = document.getElementById('room-canvas');
    ctx    = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false; // 像素锐利
    _startLoop();
  }

  /* ─── SET WITCH STATE (供 game.js 调用) ─── */
  function setWitchState(state) {
    _witchState = state;
    _witchTimer = (state === 'success') ? 90 : (state === 'working') ? 20 : 0;
  }

  /* ─── LOOP ─── */
  function _startLoop() {
    function loop() {
      tick++;
      // 倒计时恢复 idle
      if (_witchTimer > 0) {
        _witchTimer--;
        if (_witchTimer === 0 && _witchState !== 'idle') {
          _witchState = 'idle';
        }
      }
      _draw();
      animFrame = requestAnimationFrame(loop);
    }
    animFrame = requestAnimationFrame(loop);
  }

  /* ─── MAIN DRAW ─── */
  function _draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    _drawBackground(W, H);
    _drawFloor(W, H);
    _drawWalls(W, H);
    _drawWindow(W, H);
    _drawCounter(W, H);
    _drawDecorations(W, H);
    _drawAmbientParticles(W, H);

    // 魔女像素小人
    const floorY = H * 0.72;
    _witchX = W * 0.5;
    _drawWitch(ctx, _witchX, floorY - 4, tick, _witchState);
  }

  /* ─── BACKGROUND ─── */
  function _drawBackground(W, H) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0d0818');
    grad.addColorStop(0.6, '#1a0e2e');
    grad.addColorStop(1, '#0a0612');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  /* ─── FLOOR ─── */
  function _drawFloor(W, H) {
    const floorY = H * 0.72;
    const plankColors = ['#1e0f2e', '#1a0d28', '#221135'];
    const plankH = 18;
    const numPlanks = Math.ceil((H - floorY) / plankH) + 1;
    for (let i = 0; i < numPlanks; i++) {
      ctx.fillStyle = plankColors[i % plankColors.length];
      ctx.fillRect(0, floorY + i * plankH, W, plankH);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, floorY + i * plankH);
      ctx.lineTo(W, floorY + i * plankH);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    const seams = [W * 0.25, W * 0.5, W * 0.75];
    seams.forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x + 10, H);
      ctx.stroke();
    });
  }

  /* ─── WALLS ─── */
  function _drawWalls(W, H) {
    const floorY = H * 0.72;
    const wallGrad = ctx.createLinearGradient(0, 0, 0, floorY);
    wallGrad.addColorStop(0, '#150a25');
    wallGrad.addColorStop(1, '#1e1035');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, W, floorY);

    ctx.strokeStyle = 'rgba(80,50,120,0.15)';
    ctx.lineWidth = 1;
    const brickH = 24, brickW = 48;
    for (let row = 0; row * brickH < floorY; row++) {
      const offset = (row % 2) * (brickW / 2);
      for (let col = -1; col * brickW < W + brickW; col++) {
        ctx.strokeRect(col * brickW + offset, row * brickH, brickW, brickH);
      }
    }
    ctx.fillStyle = '#2d1b4e';
    ctx.fillRect(0, floorY - 8, W, 8);
    ctx.fillStyle = '#3d2560';
    ctx.fillRect(0, floorY - 10, W, 2);
  }

  /* ─── WINDOW ─── */
  function _drawWindow(W, H) {
    const wx = W * 0.5 - 50, wy = H * 0.08;
    const ww = 100, wh = 80;

    const skyGrad = ctx.createRadialGradient(wx + ww / 2, wy + wh / 2, 5, wx + ww / 2, wy + wh / 2, 80);
    const moonPulse = Math.sin(tick * 0.02) * 0.1 + 0.9;
    skyGrad.addColorStop(0, `rgba(30, 20, 70, ${moonPulse})`);
    skyGrad.addColorStop(1, '#050310');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(wx, wy, ww, wh);

    const stars = [[wx+15,wy+12],[wx+60,wy+20],[wx+85,wy+10],[wx+30,wy+50],[wx+75,wy+55],[wx+50,wy+35]];
    stars.forEach(([sx, sy], i) => {
      ctx.globalAlpha = Math.sin(tick * 0.05 + i * 1.3) * 0.5 + 0.5;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(sx, sy, 2, 2);
    });
    ctx.globalAlpha = 1;

    const moonX = wx + 70, moonY = wy + 20;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, 12);
    moonGlow.addColorStop(0, 'rgba(220, 200, 255, 0.9)');
    moonGlow.addColorStop(0.5, 'rgba(180, 160, 240, 0.4)');
    moonGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGlow;
    ctx.beginPath(); ctx.arc(moonX, moonY, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(230, 215, 255, 0.9)';
    ctx.beginPath(); ctx.arc(moonX, moonY, 7, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = '#3d2560'; ctx.lineWidth = 4;
    ctx.strokeRect(wx, wy, ww, wh);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh);
    ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2);
    ctx.stroke();

    const floorGlow = ctx.createRadialGradient(W * 0.5, H * 0.72, 0, W * 0.5, H * 0.72, 80);
    floorGlow.addColorStop(0, 'rgba(100, 60, 200, 0.08)');
    floorGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = floorGlow;
    ctx.fillRect(0, H * 0.55, W, H * 0.2);
  }

  /* ─── COUNTER / SHELF ─── */
  function _drawCounter(W, H) {
    const floorY = H * 0.72;
    const ctrY = floorY - 60, ctrH = 60;
    const ctrGrad = ctx.createLinearGradient(0, ctrY, 0, ctrY + ctrH);
    ctrGrad.addColorStop(0, '#2d1b4e');
    ctrGrad.addColorStop(1, '#1e0f2e');
    ctx.fillStyle = ctrGrad;
    ctx.fillRect(W * 0.05, ctrY, W * 0.9, ctrH);
    ctx.fillStyle = '#3d2560';
    ctx.fillRect(W * 0.04, ctrY - 6, W * 0.92, 8);
    ctx.strokeStyle = '#5b3d8a'; ctx.lineWidth = 2;
    ctx.strokeRect(W * 0.05, ctrY, W * 0.9, ctrH);

    const shelfY = H * 0.35;
    ctx.fillStyle = '#2d1b4e';
    ctx.fillRect(W * 0.05, shelfY, W * 0.9, 8);
    ctx.strokeStyle = '#5b3d8a'; ctx.lineWidth = 1;
    ctx.strokeRect(W * 0.05, shelfY, W * 0.9, 8);
    _drawShelfPotions(W, shelfY);
  }

  /* ─── SHELF POTIONS ─── */
  function _drawShelfPotions(W, shelfY) {
    const bottles = [
      { x: W * 0.12, color: '#9d4edd', glow: 'rgba(157,78,221,0.6)' },
      { x: W * 0.22, color: '#4ade80', glow: 'rgba(74,222,128,0.6)' },
      { x: W * 0.32, color: '#f87171', glow: 'rgba(248,113,113,0.6)' },
      { x: W * 0.55, color: '#2dd4bf', glow: 'rgba(45,212,191,0.6)' },
      { x: W * 0.65, color: '#f4c542', glow: 'rgba(244,197,66,0.6)' },
      { x: W * 0.75, color: '#c77dff', glow: 'rgba(199,125,255,0.6)' },
    ];
    bottles.forEach((b, i) => {
      const bobY = Math.sin(tick * 0.03 + i * 0.8) * 2;
      const bx = b.x, by = shelfY - 28 + bobY;
      const glowGrad = ctx.createRadialGradient(bx, by + 10, 2, bx, by + 10, 14);
      glowGrad.addColorStop(0, b.glow);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath(); ctx.arc(bx, by + 10, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = b.color;
      ctx.globalAlpha = 0.85;
      _drawBottle(ctx, bx, by, 10, 20);
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(bx - 3, by + 4, 3, 6);
    });
  }

  function _drawBottle(ctx, x, y, w, h) {
    ctx.fillRect(x - w * 0.25, y, w * 0.5, h * 0.3);
    ctx.beginPath();
    ctx.ellipse(x, y + h * 0.65, w * 0.5, h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(x - w * 0.2, y - 4, w * 0.4, 5);
  }

  /* ─── DECORATIONS ─── */
  function _drawDecorations(W, H) {
    _drawCandle(ctx, W * 0.08, H * 0.55, tick);
    _drawCandle(ctx, W * 0.92, H * 0.55, tick + 30);
    _drawHerb(ctx, W * 0.2, H * 0.05);
    _drawHerb(ctx, W * 0.8, H * 0.05);
  }

  function _drawCandle(ctx, x, y, t) {
    ctx.fillStyle = '#e8d5a3';
    ctx.fillRect(x - 4, y, 8, 20);
    const flickerX = Math.sin(t * 0.1) * 2;
    const flickerH = 10 + Math.sin(t * 0.07) * 3;
    const flameGrad = ctx.createRadialGradient(x + flickerX, y - flickerH * 0.5, 1, x + flickerX, y, flickerH);
    flameGrad.addColorStop(0, 'rgba(255, 255, 150, 0.95)');
    flameGrad.addColorStop(0.4, 'rgba(255, 140, 0, 0.7)');
    flameGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.ellipse(x + flickerX, y - flickerH * 0.5, 5, flickerH, 0, 0, Math.PI * 2);
    ctx.fill();
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 30);
    glow.addColorStop(0, 'rgba(255, 180, 50, 0.12)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
  }

  function _drawHerb(ctx, x, y) {
    ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * 3, y);
      ctx.quadraticCurveTo(x + i * 4, y + 12, x + i * 5, y + 20);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /* ─── AMBIENT PARTICLES ─── */
  function _drawAmbientParticles(W, H) {
    ctx.fillStyle = 'rgba(199, 125, 255, 0.4)';
    for (let i = 0; i < 8; i++) {
      const px = (Math.sin(tick * 0.01 + i * 2.1) * 0.4 + 0.5) * W;
      const py = (Math.cos(tick * 0.008 + i * 1.7) * 0.3 + 0.4) * H;
      const size = Math.sin(tick * 0.05 + i) * 1 + 1.5;
      ctx.globalAlpha = Math.sin(tick * 0.04 + i * 0.9) * 0.3 + 0.2;
      ctx.beginPath(); ctx.arc(px, py, size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ═══════════════════════════════════════════════════════
     像素风魔女小人（御姐，2x像素缩放，纯 fillRect 绘制）

     坐标系：以脚底(x, y)为基准，向上延伸
     身高约 32 像素单元（×S 缩放后显示）
  ═══════════════════════════════════════════════════════ */
  function _drawWitch(ctx, cx, footY, t, state) {
    const S = 3; // 每像素放大倍数

    // 呼吸/待机浮动
    const idleBob   = (state === 'idle')    ? Math.sin(t * 0.04) * S : 0;
    // 工作时上下挥动
    const workShift = (state === 'working') ? Math.sin(t * 0.25) * S * 2 : 0;
    // 成功时跳跃
    const successY  = (state === 'success') ? -Math.abs(Math.sin(t * 0.18)) * S * 4 : 0;

    const baseY = footY + idleBob + workShift + successY;

    // 魔女朝左（面向左侧，即柜台/顾客方向）
    const flip = -1; // -1=面朝左

    ctx.save();
    // 以人物中心翻转
    ctx.translate(cx, 0);
    ctx.scale(flip, 1);
    ctx.translate(-cx, 0);

    // ── 颜色调色板 ──
    const C = {
      skin:      '#f0c8a0', // 肌肤
      skinSh:    '#d4a07a', // 肌肤阴影
      hair:      '#1a0530', // 深紫黑发
      hairHi:    '#4a1070', // 发高光
      hatBase:   '#1a0530', // 帽子主体
      hatBrim:   '#2d1060', // 帽檐
      hatBand:   '#9d4edd', // 帽带（紫）
      dress:     '#2d1060', // 裙身深紫
      dressMid:  '#3d1880', // 裙身中层
      dressHi:   '#5b2fa0', // 裙亮面
      apron:     '#1a0840', // 围裙
      apronEdge: '#7c3aed', // 围裙边缘
      collar:    '#c77dff', // 领口紫
      cuff:      '#c77dff', // 袖口紫
      shoe:      '#160630', // 鞋子
      shoeHi:    '#3d2060', // 鞋高光
      magic:     '#e040fb', // 魔法粒子
      wandBody:  '#8b6914', // 魔杖木
      wandTip:   '#f4c542', // 魔杖尖
      eye:       '#cc88ff', // 眼睛紫
      lipstick:  '#d4508a', // 口红
      blush:     'rgba(220,100,130,0.35)', // 腮红
    };

    // 把"像素坐标"转换到画布坐标的辅助函数
    // px, py: 像素单元（原点=脚底中心，向上为负）
    // pw, ph: 宽高（像素单元）
    const P = (px, py, pw, ph, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(cx + px * S),
        Math.round(baseY + py * S),
        pw * S,
        ph * S
      );
    };

    // ════ 鞋子（脚） ════
    // 左鞋
    P(-4, -4,  5, 3, C.shoe);
    P(-4, -5,  4, 1, C.shoeHi);
    P(-6, -3,  2, 2, C.shoe); // 鞋尖（向左）
    // 右鞋
    P(0,  -4,  5, 3, C.shoe);
    P(0,  -5,  4, 1, C.shoeHi);

    // ════ 腿部 ════
    // 深色裙摆遮住腿（仅露出鞋）——裙摆从腰到膝
    P(-5, -18, 10, 14, C.dress);     // 裙身下段

    // ════ 裙身 ════
    P(-6, -30, 12, 12, C.dressMid);  // 裙身中段
    P(-5, -31,  2,  2, C.dressHi);   // 左侧高光
    P(-7, -28, 14, 3, C.dress);      // 裙摆展开

    // ════ 腰带 / 围裙 ════
    P(-5, -32,  10, 3, C.apron);
    P(-5, -32,  10, 1, C.apronEdge);
    P(-5, -29,   1, 1, C.apronEdge);
    P( 4, -29,   1, 1, C.apronEdge);

    // ════ 上身 / 胸口 ════
    P(-5, -42, 10, 10, C.dressMid);  // 上身
    P(-4, -43,  8, 10, C.dressHi);   // 前胸高光
    P(-5, -43,  1, 10, C.dress);     // 左侧阴影
    P( 4, -43,  1, 10, C.dress);     // 右侧阴影

    // 领口 V形
    P(-2, -43,  1, 3, C.collar);
    P( 1, -43,  1, 3, C.collar);
    P(-1, -41,  2, 2, C.skin);

    // ════ 袖子（左=魔杖手，右=空手）════
    // 左袖
    P(-9, -42,  4, 8, C.dress);
    P(-10,-40,  4, 6, C.dressMid);
    P(-11,-39,  3, 2, C.cuff);
    // 左手（holding wand）
    P(-11,-38,  3, 3, C.skin);

    // 右袖
    P( 5, -42,  4, 8, C.dress);
    P( 6, -40,  4, 6, C.dressMid);
    P( 6, -39,  3, 2, C.cuff);
    // 右手
    P( 7, -38,  2, 3, C.skin);

    // ════ 魔杖 ════
    const wandBob = (state === 'working') ? Math.round(Math.sin(t * 0.3) * 2) : 0;
    // 杖身（从左手延伸）
    for (let wi = 0; wi < 8; wi++) {
      P(-13 - wi, -38 - wi + wandBob, 2, 2, C.wandBody);
    }
    // 杖尖星星闪烁
    const wandGlow = Math.sin(t * 0.15) * 0.5 + 0.5;
    ctx.globalAlpha = 0.7 + wandGlow * 0.3;
    P(-21, -46 + wandBob, 4, 4, C.wandTip);
    ctx.globalAlpha = wandGlow;
    P(-23, -48 + wandBob, 2, 2, '#fff');   // 星核
    P(-22, -50 + wandBob, 1, 1, '#fff');
    P(-24, -47 + wandBob, 1, 1, '#fff');
    P(-21, -50 + wandBob, 1, 1, '#fff');
    ctx.globalAlpha = 1;

    // ════ 颈部 ════
    P(-1, -45,  2, 3, C.skin);

    // ════ 头部 ════
    // 头型（较长的御姐脸型）
    P(-4, -55, 8, 10, C.skin);        // 脸主体
    P(-5, -54, 1,  8, C.skinSh);      // 左侧阴影
    P( 4, -54, 1,  8, C.skinSh);      // 右侧阴影
    P(-3, -55, 6,  1, C.skinSh);      // 额头下沿

    // 腮红
    ctx.fillStyle = C.blush;
    ctx.fillRect(Math.round(cx + (-5) * S), Math.round(baseY + (-49) * S), 2 * S, 1 * S);
    ctx.fillRect(Math.round(cx + ( 3) * S), Math.round(baseY + (-49) * S), 2 * S, 1 * S);

    // 口红
    P(-1, -47, 2, 1, C.lipstick);

    // 眼睛（细长型，御姐）
    P(-4, -52, 3, 1, '#1a0030');     // 眼眶
    P( 1, -52, 3, 1, '#1a0030');
    P(-3, -52, 2, 1, C.eye);        // 瞳孔
    P( 2, -52, 2, 1, C.eye);
    P(-2, -52, 1, 1, '#fff');        // 眼白高光
    P( 3, -52, 1, 1, '#fff');
    // 睫毛
    P(-5, -53, 1, 1, '#1a0030');
    P(-4, -53, 1, 1, '#1a0030');
    P( 4, -53, 1, 1, '#1a0030');
    P( 5, -53, 1, 1, '#1a0030');

    // 鼻子（一个像素点）
    P( 0, -50, 1, 1, C.skinSh);

    // ════ 头发（长发，御姐）════
    // 刘海
    P(-5, -56,  2, 3, C.hair);
    P(-3, -57,  3, 2, C.hair);
    P( 0, -56,  4, 3, C.hair);
    P(-4, -55,  1, 2, C.hairHi);   // 刘海高光
    // 两侧垂发
    P(-6, -54,  2, 12, C.hair);    // 左侧垂发
    P( 4, -54,  2, 12, C.hair);    // 右侧垂发（向右延长）
    P( 5, -52,  1, 10, C.hairHi);  // 右侧高光
    // 后背长发（在身后）— 以矩形表示
    P(-5, -53,  1, 16, C.hair);    // 背发
    P( 4, -53,  1, 16, C.hair);

    // ════ 尖帽 ════
    // 帽檐
    P(-8, -58, 16, 3, C.hatBrim);
    P(-9, -57, 18, 2, C.hatBrim);
    // 帽身（梯形 → 用多层渐窄的矩形逼近）
    P(-6, -61, 12, 3, C.hatBase);
    P(-5, -65, 10, 4, C.hatBase);
    P(-4, -69,  8, 4, C.hatBase);
    P(-3, -73,  6, 4, C.hatBase);
    P(-2, -77,  4, 4, C.hatBase);
    P(-1, -81,  2, 4, C.hatBase);
    // 帽带
    P(-6, -60,  12, 2, C.hatBand);
    // 帽高光
    P(-4, -74,  1, 12, C.hairHi);
    // 帽尖小星星
    const starPulse = Math.sin(t * 0.1) * 0.5 + 0.5;
    ctx.globalAlpha = 0.6 + starPulse * 0.4;
    P(-1, -83, 2, 2, '#e040fb');
    ctx.globalAlpha = 1;

    // ════ 成功状态：闪光粒子 ════
    if (state === 'success') {
      for (let pi = 0; pi < 6; pi++) {
        const angle  = (t * 0.15 + pi * (Math.PI * 2 / 6));
        const radius = (20 + Math.sin(t * 0.2 + pi) * 8) * S;
        const px2    = Math.round(cx + Math.cos(angle) * radius);
        const py2    = Math.round(baseY - 40 * S + Math.sin(angle) * radius);
        const alpha  = Math.sin(t * 0.2 + pi) * 0.5 + 0.5;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = ['#e040fb','#f4c542','#c77dff','#4ade80','#f87171','#2dd4bf'][pi];
        ctx.fillRect(px2, py2, S * 2, S * 2);
      }
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  /* ─── PUBLIC ─── */
  return { init, setWitchState };
})();
