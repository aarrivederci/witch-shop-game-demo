/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Customer System (敲击次数驱动版)

   【玩法改造】
   - 订单使用 words[] 拼写任务，totalClicks 由 Orders.addOrder 计算
   - faster_brew 升级：预估计时 -20%
   - 计时器公式：以价格推导的预计单词数估算
═══════════════════════════════════════════════════════ */

const Customers = (() => {

  const BASE_SPAWN_MS = 5000;  // 基础生成时间从8秒减少到5秒
  const QUICK_SPAWN_MS = 1500; // 订单完成后快速生成新订单

  let _spawnTimer    = null;
  let _onOrderRequest = null;
  let _quickSpawnRequested = false; // 标记是否需要快速生成

  /* ─── INIT ─── */
  function init(onOrderRequest) {
    _onOrderRequest = onOrderRequest;
    _scheduleNext();
  }

  /* ─── STOP ─── */
  function stop() {
    if (_spawnTimer) {
      clearTimeout(_spawnTimer);
      _spawnTimer = null;
    }
  }

  /* ─── SCHEDULE NEXT SPAWN ─── */
  function _scheduleNext() {
    const interval = _spawnInterval();
    _spawnTimer = setTimeout(() => {
      _trySpawn();
      _scheduleNext();
    }, interval);
  }

  function _spawnInterval() {
    // 如果标记了快速生成，使用快速间隔
    if (_quickSpawnRequested) {
      _quickSpawnRequested = false;
      return QUICK_SPAWN_MS;
    }
    
    const reduction = State.phase * 800;
    const base = Math.max(BASE_SPAWN_MS - reduction, 2000); // 最小间隔从3秒减到2秒
    return base * (0.6 + Math.random() * 0.5); // 范围从0.7-1.3改为0.6-1.1，更快
  }

  /* ─── REQUEST QUICK SPAWN ─── */
  // 订单完成后调用，加速下一个订单的生成
  function requestQuickSpawn() {
    _quickSpawnRequested = true;
    // 如果订单未满且有等待的定时器，重置定时器以立即生成
    if (!Orders.isFull() && _spawnTimer) {
      clearTimeout(_spawnTimer);
      _spawnTimer = setTimeout(() => {
        _trySpawn();
        _scheduleNext();
      }, QUICK_SPAWN_MS);
    }
  }

  /* ─── TRY SPAWN ─── */
  function _trySpawn() {
    if (Orders.isFull()) return;

    const customer = _pickCustomer();
    if (!customer) return;

    const recipe = _pickRecipeForCustomer(customer);
    if (!recipe) return;

    const order = _buildOrder(customer, recipe);
    if (_onOrderRequest) _onOrderRequest(order);
  }

  /* ─── PICK CUSTOMER ─── */
  function _pickCustomer() {
    const eligible = CUSTOMER_TYPES.filter(c => c.phase <= State.phase);
    if (!eligible.length) return null;

    if (State.upgrades.vip && Math.random() < 0.1) {
      const vip = eligible.filter(c => c.phase === State.phase);
      if (vip.length) return vip[Math.floor(Math.random() * vip.length)];
    }

    // 20% 概率生成动态组合的NPC（身份+随机性格）
    if (Math.random() < 0.2) {
      const dynamicCustomer = _generateDynamicCustomer(eligible);
      if (dynamicCustomer) return dynamicCustomer;
    }

    return eligible[Math.floor(Math.random() * eligible.length)];
  }

  /* ─── GENERATE DYNAMIC CUSTOMER ─── */
  // 从身份池和性格池动态生成NPC
  function _generateDynamicCustomer(eligibleCustomers) {
    // 从合格的NPC中随机选一个作为身份基础
    const baseCustomer = eligibleCustomers[Math.floor(Math.random() * eligibleCustomers.length)];
    
    // 获取该NPC的身份信息
    const identityKey = baseCustomer.id;
    const identity = CUSTOMER_IDENTITIES[identityKey];
    if (!identity) return null;

    // 随机选择一个性格（排除原有性格，增加变化性）
    const personalityKeys = Object.keys(PERSONALITY_TRAITS);
    const availablePersonalities = personalityKeys.filter(p => p !== baseCustomer.personality);
    if (!availablePersonalities.length) return null;
    
    const newPersonality = availablePersonalities[Math.floor(Math.random() * availablePersonalities.length)];
    const personalityData = PERSONALITY_TRAITS[newPersonality];

    // 生成组合台词（根据身份+性格）
    const dynamicDialogue = _generateDialogueByPersonality(identity, personalityData);

    // 计算新的小费倍率（基础倍率 + 性格修正）
    const tipMultiplier = identity.baseTipMultiplier * (1 + personalityData.tipModifier);

    // 返回动态生成的NPC
    return {
      id: `${identityKey}_${newPersonality}`,
      identityId: identityKey,
      name: `${personalityData.label}${identity.name}`,
      emoji: identity.emoji,
      personality: newPersonality,
      dialogue: dynamicDialogue,
      preferModule: identity.preferModule,
      tipMultiplier: Math.round(tipMultiplier * 10) / 10,
      phase: baseCustomer.phase,
      _isDynamic: true, // 标记为动态生成
    };
  }

  /* ─── GENERATE DIALOGUE BY PERSONALITY ─── */
  // 根据身份和性格生成台词
  function _generateDialogueByPersonality(identity, personalityData) {
    const style = personalityData.dialogueStyle;
    const name = identity.name;
    
    // 根据不同的性格风格生成不同台词
    const dialogueTemplates = {
      warm: [
        `你好！我是${name}，很高兴见到你~`,
        '听说这里的魔法很棒呢！',
        '谢谢你的帮助，真是太好了！',
      ],
      formal: [
        `我是${name}，前来寻求您的协助。`,
        '请为我提供最专业的服务。',
        '感谢您的帮助，我会铭记于心。',
      ],
      calculating: [
        `嗯……${name}听说你这里性价比不错。`,
        '价格合理的话，我们可以谈谈。',
        '还算满意，下次可能还会来。',
      ],
      nervous: [
        `那个……我是${name}……打扰了……`,
        '真的可以帮我吗？我有点担心……',
        '谢……谢谢你……',
      ],
      haughty: [
        `本${name}听说你有些本事。`,
        '别让我失望，懂吗？',
        '还行吧，勉强过得去。',
      ],
      polite: [
        `您好，我是${name}，冒昧打扰了。`,
        '真不好意思麻烦您……',
        '非常感谢，您真是太好了！',
      ],
      dreamy: [
        `啊……${name}感觉这里好浪漫……`,
        '能帮我实现一个美好的愿望吗？',
        '真是梦幻般的体验……',
      ],
      inquisitive: [
        `${name}对这个很好奇！`,
        '这个魔法是怎么运作的呢？',
        '真有趣！学到了很多！',
      ],
      sad: [
        `${name}……只是想找个地方静一静……`,
        '也许……魔法能帮到我吧……',
        '谢谢……至少还有温暖存在……',
      ],
      philosophical: [
        `${name}在思考命运的本质……`,
        '魔法与智慧，本是一体。',
        '感悟颇深，多谢指点。',
      ],
      blunt: [
        `${name}！直说吧，你能做什么？`,
        '别废话，快点！',
        '行，还算利索！',
      ],
      refined: [
        `${name}欣赏优雅的事物。`,
        '请展示你最精致的技艺。',
        '完美，正如我所期待的。',
      ],
      reverent: [
        `${name}代表神殿前来。`,
        '愿神明庇佑你的魔法。',
        '神会记住你的善行。',
      ],
      wary: [
        `${name}……你的魔法安全吗？`,
        '我需要小心确认一下……',
        '看起来还算可靠……',
      ],
      jovial: [
        `哈哈！${name}来啦！`,
        '这里真热闹，我喜欢！',
        '太棒了！下次再来！',
      ],
      quirky: [
        `${name}觉得这里有种奇妙的能量……`,
        '给我来点不寻常的东西！',
        '哦！真是意外的惊喜！',
      ],
      mischievous: [
        `嘿嘿，${name}来搞点有趣的事情！`,
        '能整点刺激的吗？',
        '哇哦！好玩！',
      ],
      cryptic: [
        `${name}……从阴影中而来……`,
        '命运的轮回……你能看见吗？',
        '一切都在预料之中……',
      ],
      naive: [
        `${name}第一次来这种地方！`,
        '真的会有魔法吗？好期待！',
        '哇！真的有效果耶！',
      ],
      sly: [
        `${name}对你的小店……很感兴趣呢……`,
        '我们可以做个特殊的交易……',
        '呵呵……记住今天……',
      ],
    };

    return dialogueTemplates[style] || dialogueTemplates.warm;
  }


  /* ─── PICK RECIPE ─── */
  function _pickRecipeForCustomer(customer) {
    const allRecipes = _getAllUnlockedRecipes();
    if (!allRecipes.length) return null;

    const preferred = allRecipes.filter(r => r._module === customer.preferModule);
    const pool = (preferred.length && Math.random() < 0.7) ? preferred : allRecipes;

    return pool[Math.floor(Math.random() * pool.length)];
  }

  function _getAllUnlockedRecipes() {
    const result = [];
    const moduleMap = {
      potions:    { data: POTIONS,     key: 'potions'    },
      divination: { data: DIVINATIONS, key: 'divination' },
      charms:     { data: CHARMS,      key: 'charms'     },
      alchemy:    { data: ALCHEMY,     key: 'alchemy'    },
    };
    Object.entries(moduleMap).forEach(([mod, info]) => {
      if (!State.modules[mod]) return;
      info.data.forEach(r => {
        if (isRecipeUnlocked(r.id)) {
          result.push({ ...r, _module: mod });
        }
      });
    });
    return result;
  }

  /* ─── BUILD ORDER ─── */
  function _buildOrder(customer, recipe) {
    // Orders.addOrder 会用真实词库重算 totalClicks；这里先按价格估算计时。
    let totalClicks = _estimateTotalClicks(recipe);
    if (State.upgrades.faster_brew) {
      totalClicks = Math.max(4, Math.round(totalClicks * 0.8));
    }

    // 计时器：每次点击给 2.5 秒 + 基础 5 秒，按 tier 放大，再乘耐心倍率
    const baseTime = (5000 + totalClicks * 2500) * (1 + (recipe.tier - 1) * 0.1);
    const timerMs  = Math.round(baseTime * getTimerMultiplier());

    const baseReward = Math.round(recipe.price * customer.tipMultiplier * getRewardMultiplier());

    return {
      id:          `order_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      customer,
      recipe,
      totalClicks,           // 需要的总敲击次数
      progress:    0,        // 已累计敲击次数
      timerMs,
      elapsed:     0,
      reward:      baseReward,
      module:      recipe._module,
      status:      'pending',
      dialogue:    _pickDialogue(customer),
    };
  }

  function _estimateTotalClicks(recipe) {
    const price = Number(recipe && recipe.price) || 0;
    const wordCount = Math.min(5, Math.max(1, Math.floor(price / 30)));
    return wordCount * 6;
  }

  function _pickDialogue(customer) {
    const lines = customer.dialogue;
    return lines[Math.floor(Math.random() * lines.length)];
  }

  /* ─── PUBLIC ─── */
  return { init, stop, requestQuickSpawn };
})();
