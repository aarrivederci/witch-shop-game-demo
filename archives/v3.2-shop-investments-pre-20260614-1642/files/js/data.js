/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Game Data (英语学习版)

   【玩法改造】
   - 道具名称全部采用四六级英语词汇
   - 每个道具有 word（英文单词）+ meaning（中文释义）
   - 完成订单 = 在键盘区正确拼写该单词
   - keys[] 字段保持兼容（与 word 一致）
═══════════════════════════════════════════════════════ */

/* ─── PHASES / PROGRESSION ─── */
const PHASES = [
  { id: 0, name: '初学者',    coinsNeeded: 0,    label: '✨ 初学者' },
  { id: 1, name: '魔药师',    coinsNeeded: 200,  label: '🧪 魔药师' },
  { id: 2, name: '占卜者',    coinsNeeded: 600,  label: '🔮 占卜者' },
  { id: 3, name: '符文师',    coinsNeeded: 1400, label: '✨ 符文师' },
  { id: 4, name: '大魔女',    coinsNeeded: 3000, label: '⭐ 大魔女'  },
];

/* ─── POTION RECIPES ─── */
// price: 商品价格，影响订单需要拼写的单词数量和单词难度
// unlockCost: 解锁该道具需要的金币数量（可选，不设置则默认已解锁）
const POTIONS = [
  {
    id: 'heal',
    name: '治愈药水',
    icon: '🧪',
    price: 20,
    tier: 1,
    desc: '治愈轻伤，回复体力',
    unlocked: true,
  },
  {
    id: 'calm',
    name: '安眠药水',
    icon: '💜',
    price: 28,
    tier: 1,
    desc: '带来安稳的睡眠',
    unlocked: true,
  },
  {
    id: 'lucky',
    name: '幸运药水',
    icon: '🍀',
    price: 35,
    tier: 1,
    desc: '今天手气不错！',
    unlocked: true,
  },
  {
    id: 'vanish',
    name: '隐身药水',
    icon: '👁️',
    price: 50,
    tier: 2,
    desc: '暂时让你消失无踪',
    unlocked: false,
    unlockCost: 50,
  },
  {
    id: 'vigor',
    name: '力量药水',
    icon: '💪',
    price: 45,
    tier: 2,
    desc: '力大如牛，一时之勇',
    unlocked: false,
    unlockCost: 60,
  },
  {
    id: 'recall',
    name: '记忆药水',
    icon: '🧠',
    price: 60,
    tier: 2,
    desc: '唤回珍贵的回忆',
    unlocked: false,
    unlockCost: 80,
  },
  {
    id: 'speed',
    name: '迅捷药水',
    icon: '⚡',
    price: 55,
    tier: 2,
    desc: '快如闪电，身轻如燕',
    unlocked: false,
    unlockCost: 100,
  },
  {
    id: 'antidote',
    name: '解毒药水',
    icon: '🍵',
    price: 65,
    tier: 2,
    desc: '祛除体内的毒素',
    unlocked: false,
    unlockCost: 120,
  },
  {
    id: 'ancient',
    name: '龙息酿',
    icon: '🐉',
    price: 120,
    tier: 3,
    desc: '传说中的古老秘方',
    unlocked: false,
    unlockCost: 200,
  },
  {
    id: 'serene',
    name: '月华水',
    icon: '🌙',
    price: 80,
    tier: 3,
    desc: '月夜采集的神圣之水',
    unlocked: false,
    unlockCost: 150,
  },
  {
    id: 'fire_resist',
    name: '抗火药水',
    icon: '🔥',
    price: 70,
    tier: 3,
    desc: '在烈焰中行走而不伤',
    unlocked: false,
    unlockCost: 180,
  },
  {
    id: 'water_breath',
    name: '水下呼吸药水',
    icon: '🌊',
    price: 75,
    tier: 3,
    desc: '在深海中自由呼吸',
    unlocked: false,
    unlockCost: 200,
  },
  {
    id: 'night_vision',
    name: '夜视药水',
    icon: '🦉',
    price: 65,
    tier: 3,
    desc: '黑暗中看清一切',
    unlocked: false,
    unlockCost: 160,
  },
  {
    id: 'regeneration',
    name: '再生药水',
    icon: '💚',
    price: 90,
    tier: 3,
    desc: '持续恢复生命力',
    unlocked: false,
    unlockCost: 250,
  },
  {
    id: 'levitation',
    name: '漂浮药水',
    icon: '☁️',
    price: 85,
    tier: 4,
    desc: '违抗重力的魔法',
    unlocked: false,
    unlockCost: 300,
  },
  {
    id: 'transformation',
    name: '变形药水',
    icon: '🦋',
    price: 100,
    tier: 4,
    desc: '短暂改变形态',
    unlocked: false,
    unlockCost: 350,
  },
  {
    id: 'time_slow',
    name: '时光缓流药水',
    icon: '⏳',
    price: 110,
    tier: 4,
    desc: '让时间为你放慢脚步',
    unlocked: false,
    unlockCost: 400,
  },
  {
    id: 'berserker',
    name: '狂战士药水',
    icon: '⚔️',
    price: 95,
    tier: 4,
    desc: '释放内心的野性力量',
    unlocked: false,
    unlockCost: 380,
  },
  {
    id: 'ethereal',
    name: '虚化药水',
    icon: '👻',
    price: 130,
    tier: 4,
    desc: '穿越物质世界',
    unlocked: false,
    unlockCost: 450,
  },
  {
    id: 'phoenix',
    name: '凤凰之泪',
    icon: '🔆',
    price: 200,
    tier: 4,
    desc: '传说能令人重生的神药',
    unlocked: false,
    unlockCost: 600,
  },
];

/* ─── DIVINATION SERVICES ─── */
const DIVINATIONS = [
  {
    id: 'tarot_simple',
    name: '塔罗牌占卜',
    icon: '🃏',
    price: 40,
    tier: 2,
    desc: '揭示命运的轨迹',
    unlocked: false,
    unlockCost: 100,
  },
  {
    id: 'crystal_ball',
    name: '水晶球预言',
    icon: '🔮',
    price: 65,
    tier: 2,
    desc: '窥探未来的迷雾',
    unlocked: false,
    unlockCost: 120,
  },
  {
    id: 'star_read',
    name: '星象解读',
    icon: '⭐',
    price: 55,
    tier: 3,
    desc: '以星辰为向导',
    unlocked: false,
    unlockCost: 150,
  },
  {
    id: 'bone_cast',
    name: '骨符卜算',
    icon: '🦴',
    price: 90,
    tier: 3,
    desc: '古老的骨符占卜术',
    unlocked: false,
    unlockCost: 180,
  },
  {
    id: 'palm_reading',
    name: '掌纹解读',
    icon: '✋',
    price: 45,
    tier: 2,
    desc: '从掌纹中看出过去与未来',
    unlocked: false,
    unlockCost: 110,
  },
  {
    id: 'tea_leaves',
    name: '茶叶占卜',
    icon: '🍵',
    price: 50,
    tier: 2,
    desc: '从茶叶的形状预知未来',
    unlocked: false,
    unlockCost: 130,
  },
  {
    id: 'rune_stones',
    name: '卢恩石占卜',
    icon: '🪨',
    price: 70,
    tier: 3,
    desc: '古老的北欧占卜术',
    unlocked: false,
    unlockCost: 200,
  },
  {
    id: 'pendulum',
    name: '灵摆占卜',
    icon: '⚖️',
    price: 60,
    tier: 3,
    desc: '让灵摆告诉你答案',
    unlocked: false,
    unlockCost: 170,
  },
  {
    id: 'mirror_scrying',
    name: '魔镜占卜',
    icon: '🪞',
    price: 80,
    tier: 3,
    desc: '透过魔镜窥见真相',
    unlocked: false,
    unlockCost: 220,
  },
  {
    id: 'dream_reading',
    name: '解梦',
    icon: '💤',
    price: 55,
    tier: 3,
    desc: '解读梦境中的预兆',
    unlocked: false,
    unlockCost: 160,
  },
  {
    id: 'numerology',
    name: '数字命理',
    icon: '🔢',
    price: 65,
    tier: 3,
    desc: '从数字中揭示命运',
    unlocked: false,
    unlockCost: 190,
  },
  {
    id: 'oracle_cards',
    name: '神谕卡占卜',
    icon: '🎴',
    price: 75,
    tier: 3,
    desc: '神灵的讯息',
    unlocked: false,
    unlockCost: 210,
  },
  {
    id: 'astrology',
    name: '星盘解读',
    icon: '♈',
    price: 100,
    tier: 4,
    desc: '完整的星象图解析',
    unlocked: false,
    unlockCost: 300,
  },
  {
    id: 'crystal_scrying',
    name: '水晶透视',
    icon: '💎',
    price: 110,
    tier: 4,
    desc: '通过水晶看见幻象',
    unlocked: false,
    unlockCost: 350,
  },
  {
    id: 'spirit_board',
    name: '通灵板',
    icon: '👁️‍🗨️',
    price: 95,
    tier: 4,
    desc: '与灵魂对话',
    unlocked: false,
    unlockCost: 320,
  },
  {
    id: 'smoke_reading',
    name: '烟雾占卜',
    icon: '💨',
    price: 85,
    tier: 4,
    desc: '从香烟的形状预知未来',
    unlocked: false,
    unlockCost: 280,
  },
  {
    id: 'sand_divination',
    name: '沙盘占卜',
    icon: '🏜️',
    price: 90,
    tier: 4,
    desc: '沙粒描绘出的命运',
    unlocked: false,
    unlockCost: 300,
  },
  {
    id: 'moon_reading',
    name: '月相占卜',
    icon: '🌙',
    price: 105,
    tier: 4,
    desc: '月亮的盈亏预示着变化',
    unlocked: false,
    unlockCost: 380,
  },
  {
    id: 'blood_prophecy',
    name: '血之预言',
    icon: '🩸',
    price: 130,
    tier: 4,
    desc: '以血为媒介的强大占卜',
    unlocked: false,
    unlockCost: 450,
  },
  {
    id: 'fate_weaving',
    name: '命运编织',
    icon: '🧵',
    price: 150,
    tier: 4,
    desc: '传说能改写命运的禁忌占卜',
    unlocked: false,
    unlockCost: 500,
  },
];

/* ─── CHARM SERVICES ─── */
const CHARMS = [
  {
    id: 'love_charm',
    name: '爱情符咒',
    icon: '💕',
    price: 50,
    tier: 3,
    desc: '让心意得以传达',
    unlocked: false,
    unlockCost: 150,
  },
  {
    id: 'ward_charm',
    name: '辟邪符咒',
    icon: '🛡️',
    price: 45,
    tier: 3,
    desc: '抵御邪恶与不幸',
    unlocked: false,
    unlockCost: 140,
  },
  {
    id: 'wealth_charm',
    name: '招财符咒',
    icon: '💰',
    price: 70,
    tier: 3,
    desc: '财运滚滚而来',
    unlocked: false,
    unlockCost: 180,
  },
  {
    id: 'wisdom_charm',
    name: '智慧符文',
    icon: '📖',
    price: 80,
    tier: 4,
    desc: '开启心灵的智慧之门',
    unlocked: false,
    unlockCost: 250,
  },
  {
    id: 'health_charm',
    name: '健康符咒',
    icon: '💚',
    price: 55,
    tier: 3,
    desc: '保佑身体康健',
    unlocked: false,
    unlockCost: 160,
  },
  {
    id: 'courage_charm',
    name: '勇气符文',
    icon: '🦁',
    price: 60,
    tier: 3,
    desc: '赋予无畏的勇气',
    unlocked: false,
    unlockCost: 170,
  },
  {
    id: 'peace_charm',
    name: '和平符咒',
    icon: '🕊️',
    price: 65,
    tier: 3,
    desc: '化解争端与冲突',
    unlocked: false,
    unlockCost: 190,
  },
  {
    id: 'binding_charm',
    name: '契约符文',
    icon: '🔗',
    price: 75,
    tier: 3,
    desc: '确保约定必被遵守',
    unlocked: false,
    unlockCost: 200,
  },
  {
    id: 'travel_charm',
    name: '旅行护符',
    icon: '🧭',
    price: 50,
    tier: 3,
    desc: '保护旅途平安',
    unlocked: false,
    unlockCost: 150,
  },
  {
    id: 'memory_charm',
    name: '记忆符文',
    icon: '🧠',
    price: 70,
    tier: 3,
    desc: '增强记忆与学习能力',
    unlocked: false,
    unlockCost: 210,
  },
  {
    id: 'beauty_charm',
    name: '魅力符咒',
    icon: '✨',
    price: 85,
    tier: 4,
    desc: '提升个人魅力',
    unlocked: false,
    unlockCost: 280,
  },
  {
    id: 'silence_charm',
    name: '静音符文',
    icon: '🤫',
    price: 65,
    tier: 4,
    desc: '消除一切声音',
    unlocked: false,
    unlockCost: 240,
  },
  {
    id: 'truth_charm',
    name: '真实符咒',
    icon: '👁️',
    price: 90,
    tier: 4,
    desc: '无法说谎的约束',
    unlocked: false,
    unlockCost: 320,
  },
  {
    id: 'growth_charm',
    name: '生长符文',
    icon: '🌱',
    price: 75,
    tier: 4,
    desc: '加速植物生长',
    unlocked: false,
    unlockCost: 260,
  },
  {
    id: 'sleep_charm',
    name: '沉睡符咒',
    icon: '😴',
    price: 80,
    tier: 4,
    desc: '引导进入深度睡眠',
    unlocked: false,
    unlockCost: 290,
  },
  {
    id: 'light_charm',
    name: '光明符文',
    icon: '💡',
    price: 70,
    tier: 4,
    desc: '驱散黑暗与恐惧',
    unlocked: false,
    unlockCost: 270,
  },
  {
    id: 'shadow_charm',
    name: '暗影符咒',
    icon: '🌑',
    price: 95,
    tier: 4,
    desc: '融入阴影之中',
    unlocked: false,
    unlockCost: 350,
  },
  {
    id: 'element_charm',
    name: '元素符文',
    icon: '🔥',
    price: 110,
    tier: 4,
    desc: '操控基础元素',
    unlocked: false,
    unlockCost: 400,
  },
  {
    id: 'soul_charm',
    name: '灵魂符咒',
    icon: '👻',
    price: 120,
    tier: 4,
    desc: '与灵魂沟通的桥梁',
    unlocked: false,
    unlockCost: 450,
  },
  {
    id: 'eternal_charm',
    name: '永恒符文',
    icon: '♾️',
    price: 150,
    tier: 4,
    desc: '传说能让符咒永不消失',
    unlocked: false,
    unlockCost: 550,
  },
];

/* ─── ALCHEMY SERVICES ─── */
const ALCHEMY = [
  {
    id: 'transmute_copper',
    name: '炼铜成银',
    icon: '⚗️',
    price: 100,
    tier: 4,
    desc: '将普通金属提炼升华',
    unlocked: false,
    unlockCost: 300,
  },
  {
    id: 'elixir_youth',
    name: '青春灵药',
    icon: '✨',
    price: 150,
    tier: 4,
    desc: '据说能留住青春',
    unlocked: false,
    unlockCost: 400,
  },
  {
    id: 'philosophers',
    name: '贤者之石碎片',
    icon: '💎',
    price: 300,
    tier: 4,
    desc: '炼金术的终极追求',
    unlocked: false,
    unlockCost: 800,
  },
  {
    id: 'metal_purify',
    name: '金属提纯',
    icon: '⚙️',
    price: 90,
    tier: 4,
    desc: '提炼出最纯净的金属',
    unlocked: false,
    unlockCost: 280,
  },
  {
    id: 'essence_extract',
    name: '精华萃取',
    icon: '🧬',
    price: 110,
    tier: 4,
    desc: '提取物质的核心精华',
    unlocked: false,
    unlockCost: 320,
  },
  {
    id: 'crystal_grow',
    name: '水晶培育',
    icon: '💎',
    price: 120,
    tier: 4,
    desc: '催生魔法水晶',
    unlocked: false,
    unlockCost: 350,
  },
  {
    id: 'gem_synthesis',
    name: '宝石合成',
    icon: '💍',
    price: 130,
    tier: 4,
    desc: '创造完美的宝石',
    unlocked: false,
    unlockCost: 380,
  },
  {
    id: 'life_essence',
    name: '生命精华',
    icon: '🌺',
    price: 140,
    tier: 4,
    desc: '提炼生命的能量',
    unlocked: false,
    unlockCost: 420,
  },
  {
    id: 'soul_distill',
    name: '灵魂蒸馏',
    icon: '👻',
    price: 160,
    tier: 4,
    desc: '提炼灵魂的本质',
    unlocked: false,
    unlockCost: 450,
  },
  {
    id: 'time_extract',
    name: '时光萃取',
    icon: '⏰',
    price: 170,
    tier: 4,
    desc: '捕捉流逝的时间',
    unlocked: false,
    unlockCost: 480,
  },
  {
    id: 'element_fusion',
    name: '元素融合',
    icon: '🌟',
    price: 150,
    tier: 4,
    desc: '将不同元素完美结合',
    unlocked: false,
    unlockCost: 440,
  },
  {
    id: 'void_craft',
    name: '虚空锻造',
    icon: '🌌',
    price: 180,
    tier: 4,
    desc: '在虚空中创造物质',
    unlocked: false,
    unlockCost: 500,
  },
  {
    id: 'light_condense',
    name: '光之凝聚',
    icon: '☀️',
    price: 140,
    tier: 4,
    desc: '将光芒凝聚成实体',
    unlocked: false,
    unlockCost: 420,
  },
  {
    id: 'shadow_forge',
    name: '暗影锻造',
    icon: '🌑',
    price: 145,
    tier: 4,
    desc: '以黑暗塑造形体',
    unlocked: false,
    unlockCost: 430,
  },
  {
    id: 'star_extract',
    name: '星辰精粹',
    icon: '⭐',
    price: 190,
    tier: 4,
    desc: '提炼星辰的力量',
    unlocked: false,
    unlockCost: 550,
  },
  {
    id: 'moon_essence',
    name: '月华精华',
    icon: '🌙',
    price: 175,
    tier: 4,
    desc: '收集月光的能量',
    unlocked: false,
    unlockCost: 490,
  },
  {
    id: 'dragon_blood',
    name: '龙血炼化',
    icon: '🐉',
    price: 220,
    tier: 4,
    desc: '炼化龙族的血液',
    unlocked: false,
    unlockCost: 600,
  },
  {
    id: 'divine_craft',
    name: '神圣锻造',
    icon: '✝️',
    price: 250,
    tier: 4,
    desc: '以神圣之力锻造',
    unlocked: false,
    unlockCost: 700,
  },
  {
    id: 'chaos_synthesis',
    name: '混沌合成',
    icon: '🌪️',
    price: 280,
    tier: 4,
    desc: '从混沌中创造秩序',
    unlocked: false,
    unlockCost: 750,
  },
  {
    id: 'immortal_elixir',
    name: '不朽灵药',
    icon: '♾️',
    price: 350,
    tier: 4,
    desc: '传说中的永生之药',
    unlocked: false,
    unlockCost: 1000,
  },
];

/* ─── PERSONALITY TRAITS POOL ─── */
// 性格标签池：所有NPC共享这些性格特质
const PERSONALITY_TRAITS = {
  friendly: {
    label: '友好的',
    dialogueStyle: 'warm', // 温暖、热情的语气
    tipModifier: 0,
  },
  honorable: {
    label: '荣誉的',
    dialogueStyle: 'formal', // 正式、庄重的语气
    tipModifier: 0.1,
  },
  shrewd: {
    label: '精明的',
    dialogueStyle: 'calculating', // 精打细算的语气
    tipModifier: 0.2,
  },
  timid: {
    label: '胆怯的',
    dialogueStyle: 'nervous', // 紧张、不安的语气
    tipModifier: -0.2,
  },
  arrogant: {
    label: '傲慢的',
    dialogueStyle: 'haughty', // 傲慢、自大的语气
    tipModifier: 0.3,
  },
  humble: {
    label: '谦逊的',
    dialogueStyle: 'polite', // 礼貌、谦卑的语气
    tipModifier: -0.1,
  },
  romantic: {
    label: '浪漫的',
    dialogueStyle: 'dreamy', // 梦幻、感性的语气
    tipModifier: 0.1,
  },
  curious: {
    label: '好奇的',
    dialogueStyle: 'inquisitive', // 好奇、询问的语气
    tipModifier: 0.2,
  },
  melancholic: {
    label: '忧郁的',
    dialogueStyle: 'sad', // 悲伤、忧郁的语气
    tipModifier: 0.5,
  },
  wise: {
    label: '睿智的',
    dialogueStyle: 'philosophical', // 哲理、深邃的语气
    tipModifier: 0.4,
  },
  gruff: {
    label: '粗鲁直率的',
    dialogueStyle: 'blunt', // 直率、粗鲁的语气
    tipModifier: 0.2,
  },
  elegant: {
    label: '优雅的',
    dialogueStyle: 'refined', // 优雅、精致的语气
    tipModifier: 0.6,
  },
  devout: {
    label: '虔诚的',
    dialogueStyle: 'reverent', // 虔诚、敬畏的语气
    tipModifier: 0.3,
  },
  cautious: {
    label: '谨慎的',
    dialogueStyle: 'wary', // 警惕、小心的语气
    tipModifier: 0.1,
  },
  cheerful: {
    label: '欢快的',
    dialogueStyle: 'jovial', // 欢快、活泼的语气
    tipModifier: 0,
  },
  eccentric: {
    label: '古怪的',
    dialogueStyle: 'quirky', // 古怪、奇特的语气
    tipModifier: 0.3,
  },
  playful: {
    label: '顽皮的',
    dialogueStyle: 'mischievous', // 调皮、恶作剧的语气
    tipModifier: 1.0,
  },
  mysterious: {
    label: '神秘的',
    dialogueStyle: 'cryptic', // 神秘、隐晦的语气
    tipModifier: 0.5,
  },
  innocent: {
    label: '天真的',
    dialogueStyle: 'naive', // 天真、单纯的语气
    tipModifier: 0.2,
  },
  cunning: {
    label: '狡猾的',
    dialogueStyle: 'sly', // 狡猾、阴险的语气
    tipModifier: 0.7,
  },
};

/* ─── CUSTOMER IDENTITIES (职业身份) ─── */
// 身份池：定义不同的职业/种族身份
const CUSTOMER_IDENTITIES = {
  traveler: {
    name: '旅行者',
    emoji: '🧳',
    preferModule: 'potions',
    baseTipMultiplier: 1.0,
  },
  knight: {
    name: '骑士',
    emoji: '⚔️',
    preferModule: 'potions',
    baseTipMultiplier: 1.1,
  },
  merchant: {
    name: '商人',
    emoji: '💼',
    preferModule: 'potions',
    baseTipMultiplier: 1.3,
  },
  student: {
    name: '学生',
    emoji: '📚',
    preferModule: 'potions',
    baseTipMultiplier: 0.8,
  },
  noble: {
    name: '贵族',
    emoji: '👑',
    preferModule: 'divination',
    baseTipMultiplier: 1.5,
  },
  farmer: {
    name: '农夫',
    emoji: '🌾',
    preferModule: 'divination',
    baseTipMultiplier: 0.9,
  },
  lover: {
    name: '恋人',
    emoji: '💑',
    preferModule: 'charms',
    baseTipMultiplier: 1.2,
  },
  scholar: {
    name: '学者',
    emoji: '🔬',
    preferModule: 'alchemy',
    baseTipMultiplier: 1.4,
  },
  ghost: {
    name: '幽灵',
    emoji: '👻',
    preferModule: 'divination',
    baseTipMultiplier: 2.0,
  },
  elf: {
    name: '精灵',
    emoji: '🧝',
    preferModule: 'charms',
    baseTipMultiplier: 1.6,
  },
  dwarf: {
    name: '矮人',
    emoji: '⛏️',
    preferModule: 'potions',
    baseTipMultiplier: 1.3,
  },
  vampire: {
    name: '吸血鬼',
    emoji: '🧛',
    preferModule: 'alchemy',
    baseTipMultiplier: 1.8,
  },
  priest: {
    name: '牧师',
    emoji: '⛪',
    preferModule: 'charms',
    baseTipMultiplier: 1.4,
  },
  witch_hunter: {
    name: '猎魔人',
    emoji: '🗡️',
    preferModule: 'potions',
    baseTipMultiplier: 1.2,
  },
  bard: {
    name: '吟游诗人',
    emoji: '🎵',
    preferModule: 'divination',
    baseTipMultiplier: 1.1,
  },
  alchemist: {
    name: '炼金术士',
    emoji: '🔬',
    preferModule: 'alchemy',
    baseTipMultiplier: 1.5,
  },
  dragon: {
    name: '幼龙',
    emoji: '🐲',
    preferModule: 'alchemy',
    baseTipMultiplier: 2.5,
  },
  necromancer: {
    name: '死灵法师',
    emoji: '💀',
    preferModule: 'divination',
    baseTipMultiplier: 1.7,
  },
  fairy: {
    name: '花仙子',
    emoji: '🧚',
    preferModule: 'charms',
    baseTipMultiplier: 1.3,
  },
  demon: {
    name: '恶魔',
    emoji: '😈',
    preferModule: 'alchemy',
    baseTipMultiplier: 2.0,
  },
};

/* ─── CUSTOMER TYPES (组合的NPC配置) ─── */
// 预设的身份+性格组合，用于生成具体的NPC角色
const CUSTOMER_TYPES = [

  {
    id: 'traveler',
    name: '旅行者',
    charName: '塞勒斯',
    emoji: '🧳',
    personality: 'friendly', // 友好的
    dialogue: [
      '我在旅途中受了点伤……',
      '听说你的药水效果很好！',
      '请给我最好的！',
    ],
    preferModule: 'potions',
    tipMultiplier: 1.0,
    phase: 0,
  },
  {
    id: 'knight',
    name: '骑士',
    charName: '艾德里安',
    emoji: '⚔️',
    personality: 'honorable', // 荣誉的
    dialogue: [
      '魔女，我需要你的帮助。',
      '战场上我需要力量药水。',
      '这是我最后的金币了……',
    ],
    preferModule: 'potions',
    tipMultiplier: 1.1,
    phase: 0,
  },
  {
    id: 'merchant',
    name: '商人',
    charName: '马库斯',
    emoji: '💼',
    personality: 'shrewd', // 精明的
    dialogue: [
      '做生意要靠运气啊！',
      '给我来一瓶幸运药水吧。',
      '价格好说，质量第一！',
    ],
    preferModule: 'potions',
    tipMultiplier: 1.3,
    phase: 0,
  },
  {
    id: 'student',
    name: '学生',
    charName: '林恩',
    emoji: '📚',
    personality: 'timid', // 胆怯的
    dialogue: [
      '考试快到了，好紧张……',
      '有没有什么能帮助记忆的？',
      '我钱不多，能便宜点吗？',
    ],
    preferModule: 'potions',
    tipMultiplier: 0.8,
    phase: 0,
  },
  {
    id: 'noble',
    name: '贵族',
    charName: '艾里克',
    emoji: '👑',
    personality: 'arrogant', // 傲慢的
    dialogue: [
      '本公爵需要一些特别的服务。',
      '价格不是问题，质量才是关键。',
      '快点，我时间宝贵！',
    ],
    preferModule: 'divination',
    tipMultiplier: 1.5,
    phase: 1,
  },
  {
    id: 'farmer',
    name: '农夫',
    charName: '托马斯',
    emoji: '🌾',
    personality: 'humble', // 谦逊的
    dialogue: [
      '今年收成不好，想占卜一下……',
      '明年会更好吧？',
      '谢谢你，魔女大人！',
    ],
    preferModule: 'divination',
    tipMultiplier: 0.9,
    phase: 1,
  },
  {
    id: 'lover',
    name: '恋人',
    charName: '朱利安',
    emoji: '💑',
    personality: 'romantic', // 浪漫的
    dialogue: [
      '我……我喜欢上了一个人……',
      '有什么能帮助我表白的符咒吗？',
      '真的有效果吗？',
    ],
    preferModule: 'charms',
    tipMultiplier: 1.2,
    phase: 2,
  },
  {
    id: 'scholar',
    name: '学者',
    charName: '维克多',
    emoji: '🔬',
    personality: 'curious', // 好奇的
    dialogue: [
      '我在研究古代炼金术……',
      '需要一些特殊的材料。',
      '这对科学很重要！',
    ],
    preferModule: 'alchemy',
    tipMultiplier: 1.4,
    phase: 3,
  },
  {
    id: 'ghost',
    name: '幽灵',
    charName: '埃利亚斯',
    emoji: '👻',
    personality: 'melancholic', // 忧郁的
    dialogue: [
      '嘘……我只是路过……',
      '能帮我占卜一下来世吗？',
      '谢谢……再会……',
    ],
    preferModule: 'divination',
    tipMultiplier: 2.0,
    phase: 2,
  },
  {
    id: 'elf',
    name: '精灵',
    charName: '希尔凡',
    emoji: '🧝',
    personality: 'wise', // 睿智的
    dialogue: [
      '森林里的能量失衡了……',
      '我需要一些符文来恢复平衡。',
      '自然会回报你的善意！',
    ],
    preferModule: 'charms',
    tipMultiplier: 1.6,
    phase: 2,
  },
  {
    id: 'dwarf',
    name: '矮人',
    charName: '格罗因',
    emoji: '⛏️',
    personality: 'gruff', // 粗鲁直率的
    dialogue: [
      '矿洞深处有些不对劲……',
      '给我来瓶能看清黑暗的药水！',
      '我们矮人向来直来直去！',
    ],
    preferModule: 'potions',
    tipMultiplier: 1.3,
    phase: 1,
  },
  {
    id: 'vampire',
    name: '吸血鬼',
    charName: '达里安',
    emoji: '🧛',
    personality: 'elegant', // 优雅的
    dialogue: [
      '夜晚才是我的时间……',
      '我需要一些特殊的服务。',
      '别担心，我已经用过晚餐了。',
    ],
    preferModule: 'alchemy',
    tipMultiplier: 1.8,
    phase: 3,
  },
  {
    id: 'priest',
    name: '牧师',
    charName: '塞巴斯',
    emoji: '⛪',
    personality: 'devout', // 虔诚的
    dialogue: [
      '神殿需要一些祝福……',
      '您的魔法是否符合教义呢？',
      '愿光明庇佑你。',
    ],
    preferModule: 'charms',
    tipMultiplier: 1.4,
    phase: 2,
  },
  {
    id: 'witch_hunter',
    name: '猎魔人',
    charName: '加雷特',
    emoji: '🗡️',
    personality: 'cautious', // 谨慎的
    dialogue: [
      '我在追踪一只怪物……',
      '需要一些药水补给。',
      '你的魔法……是善意的对吧？',
    ],
    preferModule: 'potions',
    tipMultiplier: 1.2,
    phase: 1,
  },
  {
    id: 'bard',
    name: '吟游诗人',
    charName: '菲恩',
    emoji: '🎵',
    personality: 'cheerful', // 欢快的
    dialogue: [
      '我要为一首新歌寻找灵感！',
      '能否预见我的未来？',
      '这将成为传世的歌谣！',
    ],
    preferModule: 'divination',
    tipMultiplier: 1.1,
    phase: 1,
  },
  {
    id: 'alchemist',
    name: '炼金术士',
    charName: '奥利弗',
    emoji: '🔬',
    personality: 'eccentric', // 古怪的
    dialogue: [
      '同行啊！我遇到了瓶颈……',
      '能交流一下炼金的心得吗？',
      '真是精妙的技艺！',
    ],
    preferModule: 'alchemy',
    tipMultiplier: 1.5,
    phase: 3,
  },
  {
    id: 'dragon',
    name: '幼龙',
    charName: '伊格尼斯',
    emoji: '🐲',
    personality: 'playful', // 顽皮的
    dialogue: [
      '咕噜噜……人类的魔法真有趣……',
      '给我看看你最强的炼金术！',
      '不错，值得收藏。',
    ],
    preferModule: 'alchemy',
    tipMultiplier: 2.5,
    phase: 4,
  },
  {
    id: 'necromancer',
    name: '死灵法师',
    charName: '莫里斯',
    emoji: '💀',
    personality: 'mysterious', // 神秘的
    dialogue: [
      '生与死的界限……如此模糊……',
      '我需要与灵魂对话的工具。',
      '死亡只是另一种存在。',
    ],
    preferModule: 'divination',
    tipMultiplier: 1.7,
    phase: 3,
  },
  {
    id: 'fairy',
    name: '花仙子',
    charName: '蒂娜',
    emoji: '🧚',
    personality: 'innocent', // 天真的
    dialogue: [
      '花园需要魔法的滋养！',
      '有让植物生长的符文吗？',
      '真是善良的魔女呢~',
    ],
    preferModule: 'charms',
    tipMultiplier: 1.3,
    phase: 2,
  },
  {
    id: 'demon',
    name: '恶魔',
    charName: '阿扎泽尔',
    emoji: '😈',
    personality: 'cunning', // 狡猾的
    dialogue: [
      '嘿嘿……有趣的小店……',
      '来做个交易如何？',
      '我会记住你的，魔女。',
    ],
    preferModule: 'alchemy',
    tipMultiplier: 2.0,
    phase: 4,
  },
];

/* ─── SHOP UNLOCK ITEMS ─── */
const SHOP_UNLOCKS = [
  {
    id: 'unlock_divination',
    name: '占卜工作台',
    icon: '🔮',
    desc: '解锁占卜服务，吸引更多神秘客人',
    cost: 150,
    module: 'divination',
    purchased: false,
    phase: 0,
  },
  {
    id: 'unlock_charms',
    name: '符文刻印台',
    icon: '✨',
    desc: '解锁符咒服务，施展古老魔法',
    cost: 400,
    module: 'charms',
    purchased: false,
    phase: 1,
  },
  {
    id: 'unlock_alchemy',
    name: '炼金熔炉',
    icon: '⚗️',
    desc: '解锁炼金术，点石成金！',
    cost: 1000,
    module: 'alchemy',
    purchased: false,
    phase: 2,
  },
];

/* ─── SHOP UPGRADE ITEMS ─── */
const SHOP_UPGRADES = [
  {
    id: 'hint_show',
    name: '释义提示',
    icon: '💡',
    desc: '订单卡片上始终显示单词中文释义',
    cost: 60,
    purchased: false,
    effect: 'hint_show',
    phase: 0,
  },
  {
    id: 'customer_patience',
    name: '客人更有耐心',
    icon: '⏳',
    desc: '订单计时器延长50%',
    cost: 120,
    purchased: false,
    effect: 'patience',
    phase: 0,
  },
  {
    id: 'better_tips',
    name: '慷慨小费',
    icon: '💸',
    desc: '所有订单奖励+20%',
    cost: 200,
    purchased: false,
    effect: 'tips',
    phase: 1,
  },
  {
    id: 'more_orders',
    name: '客源广泛',
    icon: '🚪',
    desc: '同时可有3个待处理订单',
    cost: 300,
    purchased: false,
    effect: 'more_orders',
    phase: 1,
  },
  {
    id: 'vip_customers',
    name: 'VIP接待',
    icon: '⭐',
    desc: '偶尔出现高价值神秘客人',
    cost: 500,
    purchased: false,
    effect: 'vip',
    phase: 2,
  },
  {
    id: 'auto_unlock_recipes',
    name: '古籍解读',
    icon: '📜',
    desc: '自动解锁当前阶段全部配方',
    cost: 800,
    purchased: false,
    effect: 'auto_recipes',
    phase: 3,
  },
];

/* ─── BOND / RELATIONSHIP ITEMS ───
   金币的长期消耗点：购买礼物提升角色羁绊，羁绊会参与后续故事解锁。 */
const BOND_LEVELS = [
  { level: 0, exp: 0, label: '初识' },
  { level: 1, exp: 3, label: '熟客' },
  { level: 2, exp: 8, label: '信赖' },
  { level: 3, exp: 15, label: '亲近' },
  { level: 4, exp: 24, label: '命定' },
];

const BOND_GIFTS = [
  { id: 'moon_cookie', name: '月糖饼干', icon: '🍪', category: '点心', rarity: 'common', desc: '普通但温暖的小点心，适合日常维系关系。', cost: 40, exp: 2, phase: 0 },
  { id: 'star_letter', name: '星砂信笺', icon: '💌', category: '心意', rarity: 'uncommon', desc: '写下感谢与邀约，更快拉近彼此距离。', cost: 120, exp: 5, phase: 1 },
  { id: 'memory_charm', name: '回忆护符', icon: '🔖', category: '饰物', rarity: 'rare', desc: '承载共同经历的护符，能推动更深层故事。', cost: 300, exp: 10, phase: 2 },
  { id: 'fate_crystal', name: '命运水晶', icon: '💎', category: '神秘物', rarity: 'epic', desc: '昂贵而稀有的礼物，适合后期消耗金币并冲刺最终羁绊。', cost: 800, exp: 22, phase: 3 },
];

const ROLE_GIFT_PREFERENCES = {
  traveler:     { star_letter: 1.4, memory_charm: 1.2, moon_cookie: 1.0, fate_crystal: 0.9 },
  knight:       { memory_charm: 1.4, moon_cookie: 1.2, star_letter: 1.0, fate_crystal: 0.9 },
  merchant:     { fate_crystal: 1.4, star_letter: 1.2, memory_charm: 1.0, moon_cookie: 0.9 },
  student:      { star_letter: 1.4, moon_cookie: 1.2, memory_charm: 1.0, fate_crystal: 0.8 },
  noble:        { fate_crystal: 1.4, memory_charm: 1.2, star_letter: 1.0, moon_cookie: 0.8 },
  farmer:       { moon_cookie: 1.4, memory_charm: 1.2, star_letter: 1.0, fate_crystal: 0.8 },
  lover:        { star_letter: 1.5, memory_charm: 1.2, moon_cookie: 1.0, fate_crystal: 0.9 },
  scholar:      { memory_charm: 1.4, star_letter: 1.2, fate_crystal: 1.0, moon_cookie: 0.9 },
  ghost:        { memory_charm: 1.5, star_letter: 1.1, moon_cookie: 0.9, fate_crystal: 0.9 },
  elf:          { moon_cookie: 1.3, memory_charm: 1.3, star_letter: 1.1, fate_crystal: 0.9 },
  dwarf:        { memory_charm: 1.4, fate_crystal: 1.2, moon_cookie: 1.0, star_letter: 0.9 },
  vampire:      { fate_crystal: 1.4, memory_charm: 1.3, star_letter: 1.0, moon_cookie: 0.8 },
  priest:       { moon_cookie: 1.3, star_letter: 1.3, memory_charm: 1.0, fate_crystal: 0.8 },
  witch_hunter: { memory_charm: 1.4, moon_cookie: 1.1, star_letter: 1.0, fate_crystal: 0.9 },
  bard:         { star_letter: 1.5, moon_cookie: 1.1, memory_charm: 1.0, fate_crystal: 0.9 },
  alchemist:    { fate_crystal: 1.4, memory_charm: 1.2, star_letter: 1.0, moon_cookie: 0.8 },
  dragon:       { fate_crystal: 1.6, memory_charm: 1.1, moon_cookie: 1.0, star_letter: 0.8 },
  necromancer:  { memory_charm: 1.4, fate_crystal: 1.3, star_letter: 1.0, moon_cookie: 0.8 },
  fairy:        { moon_cookie: 1.6, star_letter: 1.1, memory_charm: 1.0, fate_crystal: 0.8 },
  demon:        { fate_crystal: 1.4, star_letter: 1.3, memory_charm: 1.0, moon_cookie: 0.8 },
};

CUSTOMER_TYPES.forEach(role => {
  role.giftPreferences = ROLE_GIFT_PREFERENCES[role.id] || {};
});

/* ─── STORY ENTRIES ─── */
const ROLE_STORY_THRESHOLDS = [1, 3, 5, 8, 12, 16, 21, 27];

// 每个预设角色（身份 + 性格）各 8 段乙女向事件；按完成该角色订单次数逐步解锁。
const ROLE_STORY_LIBRARY = {
  // ◆ 旅行者 · 塞勒斯 ——「走遍世界的人，终于找到想停下的理由」
  // 背景：二十四岁的青年制图师，为皇家地理协会绘制世界地图。左耳挂着一枚铜指南针耳饰，
  //       靴子永远沾着不同颜色的泥土。笑起来眼尾有细纹，习惯用素描记录一切。
  traveler: [
    ['The Cartographer\'s Habit', '制图师的习惯', 'He set a copper coin spinning on the counter, saying it was a traveler\'s trick for judging whether a surface was level. When the coin toppled in your direction, he made no move to catch it, only remarked: "Hmm, gravity leans toward a very favorable heading." You caught a glimpse of his open notebook—the latest page showed a sketch of that crooked-neck oak tree outside your shop.', '他把一枚铜币放在柜台上旋转，说这是判断桌面是否水平的旅人窍门。铜币倒向你的方向时他没去接，只说："嗯，引力偏向了很好的方位。"你瞥见他摊开的笔记本，最新一页画着你店门口那棵歪脖子橡树。'],
    ['The Seventh Time Passing Through', '第七次路过', 'He admitted this route didn\'t go through your little town at all—he\'d deliberately detoured sixteen miles through mountain roads. You asked why. He pulled from his pocket the paper frog you\'d folded from a candy wrapper last time: "It can\'t hop very far, so I had to come back for it."', '他承认这条路线根本不经过你的小镇，是特意绕了十六里山路。你问为什么，他从口袋掏出上次你随手给他的糖纸折的青蛙："它跳不远，所以我得替它回来。"'],
    ['Forty-Three Kinds of Soil', '四十三种泥土', 'He pulled off his boots to show you the soles—his left foot caked with ochre from red desert sand, his right with black mud from the northern tundra. "Just one more to go." He stepped barefoot onto the moss-covered flagstones outside your shop. "This green kind—I want to step on it every day."', '他脱下靴子给你看鞋底——左脚沾着红土沙漠的赭石，右脚是北方冻原的黑泥。"还差最后一种。"他光脚踩上你店门口的青苔地砖，"这种绿色的，我想天天踩到。"'],
    ['The Portrait Never Finished', '画不完的肖像', 'A gust of wind blew open his sketchbook, revealing seven drawings of you: your back as you stirred the cauldron, your profile counting coins, a blurred outline of you yawning. He hurriedly closed it, explaining that cartographers need to practice figure drawing… but after seven attempts, he still couldn\'t capture the color of your eyes.', '素描本被风吹开，里面有七张你的速写：搅药锅的背影、数金币的侧脸、打哈欠的模糊轮廓。他慌忙合上本子，解释说制图师需要练习人物画……但画了七遍还是抓不住你眼睛的颜色。'],
    ['Aurora Promissory Note', '北极光欠条', 'He left behind a handwritten "promissory note": Owe the witch one aurora borealis. Below, in smaller script, the terms of fulfillment—you must travel with him for three days. Three days would be just enough to reach the secret valley he discovered, where in winter the sky turns green.', '他留下一张手写"欠条"：欠魔女一次北极光。底下小字写着兑现条件——你愿意和他同行三天。三天刚好够走到他发现的秘密山谷，那里冬天能看见绿色的天空。'],
    ['The Lost Compass', '迷路的指南针', 'His copper earring compass broke, its needle spinning endlessly toward your shop. After repair, it pointed true north again—but he kept the broken needle. "Some mistakes are more honest than the right answer."', '他的铜耳饰指南针坏了，指针一直朝着你的店转。修好后它恢复正常，他却把坏掉的指针留了下来。"有些错误比正确答案更诚实。"'],
    ['The Last Blank Space', '最后一块空白', 'Only one blank remained on the world map; once filled, he could report back to the imperial capital. For two full weeks, he hesitated, pen unmoving. When you asked why, he said: "Once I finish, I\'ll have no excuse to return."', '世界地图只剩最后一块空白，填完他就能交差回皇都。他犹豫了整整两周没有动笔。你问原因，他说："画完就没有借口再来了。"'],
    ['Settlement Coordinates', '定居坐标', 'Beside your shop\'s coordinates, he wrote the word "Destination" and circled it three times in red ink. Then he placed his steel pen in your palm and asked: "Would you draw the next map with me?"', '他在你的店铺坐标旁写下"终点"两个字，用红墨水圈了三圈。然后把钢笔放在你掌心，问："接下来的地图，你愿意和我一起画吗？"'],
  ],
  // ◆ 骑士 · 艾德里安 ——「剑刃所向，不再只有荣誉」
  // 背景：三十一岁的王城骑士团副团长，右肩铠甲上刻着十七次战役的纹章。
  //       左手无名指有陈旧烧伤，是五年前救平民留下的。不擅言辞，习惯用行动说话。
  knight: [
    ['The Sound of Armor', '盔甲的声音', 'Every time he pushes through the door, metal clangs against metal. So he began removing his bracers and greaves outside. When you ask why, he answers earnestly: "I didn\'t want to disturb your medicine preparations." Three sets of armor now rest beneath the counter.', '他每次推门都会响起金属碰撞声，于是开始在门外先卸掉护腕和腿甲。你问他为什么，他认真说："怕吵到你调药。"柜台下已经堆了三副护具。'],
    ['A Knight\'s Clumsiness', '骑士的笨拙', 'He wanted to help carry your crate of medicinal herbs, but his iron gauntlets couldn\'t steady the glass vials. When he removed the gloves, you saw his palms—covered in calluses and sword scars, trembling faintly as he gripped the bottles. "First time I\'ve been afraid of breaking something," he murmured.', '他想帮你搬药材木箱，戴着铁手套却拿不稳玻璃瓶。脱下手套后你看见他掌心全是老茧和剑痕，他握瓶子的手在轻微发抖。"第一次怕摔坏东西。"他低声说。'],
    ['A Detour on Patrol', '巡逻改道', 'You learned by chance that his patrol route should have been in the eastern district, yet he circles three miles out of his way to pass your door each day. His lieutenant complained that the captain has been "verifying forest boundary security" five times daily of late.', '你偶然得知他的巡逻路线本该在东城区，却每天绕三里路经过你店门口。副官抱怨说队长最近总"确认森林边界安全"，一天要确认五次。'],
    ['The Lining of a War Cloak', '战袍内衬', 'Embroidered on the lining of his white war cloak are delicate violets—the wildflowers most common outside your shop. When you point this out, the usually taciturn knight stammers uncharacteristically: "...Knights can... can have favorite flowers too."', '他的白色战袍内衬绣着精致的紫罗兰——那是你店门口最常见的野花。你指出来时，这位沉默寡言的骑士罕见地结巴："……骑士也、也可以有喜欢的花。"'],
    ['The Weight of an Oath', '誓言之重', 'At the knighthood ceremony, he declined promotion to captain, citing "a more important promise to keep." The next day, he hung his vice-captain\'s medal in your shop, saying that compared to the royal capital, he\'d rather守护 this door.', '骑士团授勋仪式上他拒绝晋升团长，理由是"有更重要的承诺要守"。第二天他把副团长勋章挂在你店里，说比起王城，他更想守着这扇门。'],
    ['Silent Vigil', '无声守夜', 'On a stormy night when you couldn\'t sleep until dawn, you opened the door to find him standing under the eaves all night—soaked through, sword still sheathed. He only said yesterday\'s divination showed danger, and he was uneasy. Rainwater still drips from his armor.', '暴风雨夜你失眠到天明，推开门发现他在屋檐下站了一夜——全身湿透，剑没出鞘。他只说昨天占卜显示有危险，他不放心。盔甲上的雨水还在滴。'],
    ['A Dulled Blade', '剑刃钝了', 'You notice his sword\'s edge is chipped. He admits he hasn\'t sharpened it lately—his rest time has been spent learning to identify herbs, to walk without making noise, and to ease your burdens.', '你注意到他的配剑刃口有缺损。他承认最近没去磨，因为休息时间都用来学怎么分辨草药、怎么不发出声音走路、怎么让你不那么辛苦。'],
    ['Final Honor', '最后的荣耀', 'The knight plants his family\'s ancestral crest-sword in the ground outside your shop. By ancient knightly law, this marks "the place I will guard with my life." Bound to the hilt is a lily-of-the-valley garland he wove himself—its chime soft, like a vow.', '骑士把家族传承的纹章剑插在你店门外的土地里，依古老骑士律法，这代表"此生守护之地"。剑柄上绑着他亲手编的铃兰花环，铃声很轻，像誓言。'],
  ],
  // ◆ 商人 · 马库斯 ——「精打细算的人，算不出心动的代价」
  // 背景：二十八岁的香料商人，掌管三条商路。右手中指戴着算盘戒指，习惯把所有东西换算成价值。
  //       出身贫民区，靠精明和胆识白手起家，对数字极度敏感，但不懂如何表达感情。
  merchant: [
    ['The Meaning of Small Change', '零头的意义', 'When settling the bill, he counts out seven copper coins as change into your palm. You tell him to keep it, but he insists on placing each coin carefully in your hand. "A merchant\'s reputation lies in precision." The next day, he delivers rare spices worth ten gold coins, calling them "interest on yesterday\'s miscalculation."', '他结账时找你七枚铜币零头，你说不用了，他却坚持数到你掌心。"商人的信誉就是准确。"第二天他送来价值十金币的稀有香料，说是"昨天算错的利息"。'],
    ['Cost Accounting', '成本核算', 'He pulls out his ledger and calculates earnestly: "Your smile made me visit three extra shops for price comparisons today, cost me two deals, eight silver coins in travel expenses..." You ask for the total. He closes the book. "Priceless. But I\'m willing to keep running at a loss."', '他掏出小账本认真计算："你的笑容让我今天多跑了三家店询价，耽误两笔生意，路费八银币……"你问总计多少，他合上本子："无价，但我愿意一直亏下去。"'],
    ['The Bulk Order Trap', '批发陷阱', 'You need to order medicinal herbs in bulk. He lists quotes from three suppliers, then circles the most expensive one. "They\'ll treat you as a long-term client. I\'ve already negotiated—from now on, I\'ll handle the pricing for your orders. Consider it... a privilege of friendship."', '你要订购大批药材，他列出三家供应商报价，最后圈出最贵那家。"他们会把你当长期客户，我已经谈好了——以后你的订单我来议价，作为……朋友的特权。"'],
    ['Caravan Detour', '商队改道', 'The caravan was headed to the northern silver mines—immense profits awaited. But he suddenly changed course to your little town. When his partners questioned him, he opened his ledger to the last page. It was blank, save for one line: "Some things aren\'t in the accounts, yet they\'re the greatest return."', '商队要去北方银矿，利润惊人，但他突然改道来你的小镇。合伙人质疑，他摊开账本，最后一页空着，只写了："有些东西不在账目里，却是最大的收益。"'],
    ['The Cost of Honesty', '亏本的诚实', 'You ask him the cost of a certain shipment. The merchant instinctively hesitates for three seconds, then honestly tells you the purchase price. This violates business principles, but he says: "The cost of lying to you is greater than losing my entire caravan."', '你问他某批货物成本，商人本能犹豫三秒后，老实告诉你进价。这违反了商业原则，但他说："对你说谎的代价，比亏掉整个商队都大。"'],
    ['Warehouse Key', '仓库钥匙', 'He hands you the key to his private warehouse, filled with ten years of accumulated treasures. You say it\'s too valuable, but he responds seriously: "I\'ve calculated it—the value of all these things combined doesn\'t equal one \'thank you\' from you."', '他把私人仓库钥匙交给你，里面是十年积累的珍品。你说这太贵重，他认真说："我算过了，这些东西的价值加起来，也不如你说一句\'谢谢\'。"'],
    ['Bankruptcy Resolve', '破产的觉悟', 'To save your shop\'s cash flow, he mortgaged three trade routes. When you panic and ask what he\'ll do, he shrugs casually: "I started from the slums once before—doing it again for you isn\'t a loss. Besides, the most precious asset can\'t be mortgaged."', '为了救你店铺周转，他抵押了三条商路。你惊慌问他怎么办，他却轻松耸肩："我从贫民窟起家过一次，为你再来一次也不算亏。反正最珍贵的资产不能抵押。"'],
    ['The Final Transaction', '最后的交易', 'He produces a contract with his entire fortune listed as Party A, and Party B left blank. "This is the dowry list I prepared, but I want to ask you first—will you trade a lifetime for a merchant who can only calculate how to make you happy?"', '他拿出一份契约，甲方是他全部财产，乙方空白。"这是我准备的聘礼清单，但我想先问你——愿意用一生的时间，换一个只会算计如何让你开心的商人吗?"'],
  ],
  // ◆ 学生 · 林恩 ——「在你面前，胆怯的少年学会了勇敢」
  // 背景：十九岁的魔法学院三年级生，主修药草学。右手食指有墨水印，笔记本边角都磨毛了。
  //       因为口吃常被嘲笑，习惯低着头走路。眼镜总是往下滑，书包里永远塞满借来的参考书。
  student: [
    ['Fallen Notes', '掉落的笔记', 'His bag strap breaks as he enters, notebooks scattering across the floor. As you help him gather them, you notice the margins filled with "Don\'t be nervous" written over and over. His face flushes crimson as he stammers that th-these are study notes.', '他进门时书包带子断了，笔记本散落一地。你帮他捡起时发现边角写满"不要紧张"的自我暗示，他脸红到耳根，结结巴巴说这、这是复习要点。'],
    ['The Quiet Corner', '安静角落', 'The library\'s farthest corner spot was always his—until you began researching there too. He grows so nervous his page-turning becomes three times quieter, yet he always quietly slides reference books your way.', '学院图书馆最角落的位置永远是他的，直到你也开始在那里查资料。他紧张到翻书声音都小了三倍，却每次都把参考文献悄悄推到你面前。'],
    ['Stammered Confession', '口吃的告白', 'After a month of practice, he finally musters his courage, only to freeze on "I li—". You wait patiently as his eyes rim red with frustration, until he finally pulls out a pre-written note from his pocket and hands it to you.', '他练习了一个月终于鼓起勇气，却在说出"我喜"时卡住。你耐心等他说完，他急得眼眶泛红，最后从口袋掏出早就写好的纸条递给你。'],
    ['First Time Side by Side', '第一次并肩', 'When lab groups are assigned, he ends up in yours. His hands shake the entire time mixing compounds, but when you take his hand and say "take your time," he takes a deep breath. That experiment earned the highest grade in class.', '实验课分组，他被分到你这组。配药时他手一直在抖，你握住他的手说"慢慢来"，他深吸一口气，那次实验得了全班最高分。'],
    ['Protecting Books in Rain', '雨中护书', 'A sudden downpour hits, and he covers the precious pharmacology text you lent him with his only jacket, getting soaked himself. When you scold him, he just smiles: "The book is yours—it\'s more important than me."', '暴雨突袭，他把唯一的外套罩在你借给他的珍贵药典上，自己淋得透湿。你责备他，他却笑着说："书是你的，比我重要。"'],
    ['Finals Vigil', '期末守夜', 'Before finals, he falls asleep studying all night in the library. You drape your shawl over him. When he wakes, he finds hot cocoa and a note beside him: "Lynn will do great." He tucked that note into the first page of his graduation album.', '期末考前他通宵复习在图书馆睡着，你给他披上披肩。他醒来发现旁边多了热可可和便签："林恩会考得很好的。"他把便签夹进了毕业相册第一页。'],
    ['Defense Courage', '答辩勇气', 'At his thesis defense, when the committee questions his research, for the first time he doesn\'t bow his head. "This method was taught by the forest witch—she understands herbs better than anyone." For you, he learned to argue back.', '毕业答辩上，评委质疑他的研究，他第一次没有低头。"这个方法是森林魔女教我的，她比任何人都懂药草。"为了你，他学会了反驳。'],
    ['No More Stammering', '不再口吃', 'After graduation he returns to your shop, this time without stuttering, speaking clearly and completely: "I spent three years learning to speak fluently, just to tell you—I want to spend the rest of my life with you."', '毕业后他回到小店，这次没有结巴，清晰地说出完整的句子："我用了三年学会流利说话，就为了告诉你——我想用余生陪伴你。"'],
  ],
  // ◆ 贵族 · 艾里克 ——「在你面前，王冠显得不再重要」
  // 背景：二十六岁的公爵继承人，掌管三个领地。左手小指戴着祖传宝石戒指，每次见人都先看对方鞋子判断身份。
  //       从小被教导"贵族不能示弱"，连笑容都要经过礼仪训练。书房里藏着一本从未示人的平民诗集。
  noble: [
    ['Haughty Disdain', '高傲的挑剔', 'His first words upon entering are complaints about dust on the chairs, his second questioning your qualifications. After drinking the potion, he\'s silent for thirty full seconds before tossing down a bag of gold coins, saying coldly: "Next time I\'ll make an appointment."', '他进门第一句话是嫌弃椅子灰尘，第二句是质疑你的资质。喝下药水后他沉默了整整三十秒，最后丢下一袋金币，冷冷说："下次我会提前预约。"'],
    ['A Noble\'s Apology', '贵族的道歉', 'The butler delivers an apology letter embroidered with the family crest and a crate of rare spices. At the bottom, rarely, a line is handwritten: "If I have offended one truly capable, the discourtesy is mine.—Erik." For the first time, he didn\'t sign with his duke title.', '管家送来绣着家徽的道歉信和一箱珍稀香料。信尾罕见手写了一行小字："若冒犯了真正有本事的人，是我失礼。——艾里克。"第一次，他没署公爵头衔。'],
    ['Dance Partner', '宴会舞伴', 'He personally delivers a ball invitation, explaining nobles must find partners of equal standing. Just as you\'re about to decline, he looks away: "But if you\'re willing, I can be not-a-duke for one evening."', '他亲自登门递来舞会请柬，说贵族间规矩要找门当户对的舞伴。你正要拒绝，他却移开视线："但若你愿意，我可以当一晚上不是公爵。"'],
    ['Silverware and Apron', '银器与围裙', 'When he arrives, you\'re drowning in work. Incredibly, he rolls up his sleeves to help sort herbs. You watch in shock as his gem-laden fingers carefully pinch leaves, and he says seriously: "One should learn useful skills."', '他来店里时你正忙得一团糟，他居然挽起袖子帮你分拣药材。你震惊地看着他用戴满宝石的手指小心翼翼捏起草叶，他认真说："总得学点有用的技能。"'],
    ['The Price of Rumors', '谣言的代价', 'Some capital nobles spread rumors about you; the next day, that family\'s business licenses are all revoked. When he comes to your shop, his eyes are weary: "I dislike using power to oppress people, but harming you is my only red line."', '王城有贵族编排你的谣言，次日那家族的商业执照全被吊销。他来店里时眼神疲惫："我不喜欢用权力压人，但伤害你是我唯一的底线。"'],
    ['Greenhouse Secret', '温室秘密', 'His private greenhouse has one corner forbidden to others, filled entirely with wildflowers common outside your shop. The gardener whispers to you: "The duke spends half an hour there every morning, first thing."', '他私人温室里有一个禁止他人进入的角落，全是你店门口常见的野花。园丁偷偷告诉你："公爵每天早晨第一件事就是来这里待半小时。"'],
    ['Removing the Crest', '摘下徽章', 'The noble council demands he choose between you and his title. In front of everyone, he removes the family crest and places it on the table, saying calmly: "If nobility doesn\'t include protecting those one cherishes, I don\'t need this identity."', '贵族议会要求他在你和爵位间二选一。他当着所有人的面摘下家族徽章放在桌上，平静说："若贵族的定义不包括守护珍视之人，这身份我不要也罢。"'],
    ['A Commoner\'s Proposal', '平民的求婚', 'In the moonlit garden, he prepares no noble ceremony, simply kneels on one knee and asks earnestly: "May I spend the rest of my life learning to become a common man worthy of you?" The ring in his hand is one he polished himself.', '月夜花园里，他没有准备任何贵族仪式，只是单膝跪地，认真问："我可以用余生学习成为配得上你的普通人吗？"手里的戒指是他亲手打磨的。'],
  ],
  // ◆ 农夫 · 托马斯 ——「泥土里长出的爱，最踏实」
  // 背景：三十三岁的麦田主人，拥有十亩祖传良田。手掌厚茧像树皮，指甲缝永远嵌着泥土。
  //       日出而作日落而息，不善言辞但会用行动说话。背心口袋里总装着种子和给鸟留的麦粒。
  farmer: [
    ['Muddy Hands Clumsy', '泥手的笨拙', 'When buying medicine, he wipes his hands on his clothes three times before daring to accept the bottle, afraid of dirtying it. You say you don\'t mind, but he blushes: "Good things deserve clean hands holding them—including the medicine you\'re handing me."', '他来买药时手在衣服上蹭了三次才敢接瓶子，怕弄脏。你说不介意，他却红着脸说：好东西都该被干净的手捧着，包括你递过来的药。'],
    ['Wheat Field Invitation', '麦田邀请', 'He awkwardly invites you to see the wheat fields, reasoning "witches should know where herbs grow." At the field ridge, he places his straw hat on your head, whispering he\'s afraid you\'ll tan, and afraid you\'ll find him too rustic.', '他笨拙地邀请你去看麦田，理由是"魔女应该知道草药长在哪"。走到田埂时他把草帽扣你头上，小声说怕你晒黑，又怕你嫌他土气。'],
    ['Expired Seeds', '过期的种子', 'He brings a packet of seeds as thanks—you discover they\'re precious medicinal herb seeds. Scratching his head, he says he thought about growing them himself but feared doing it poorly, so better to give them to someone who understands—like his heart.', '他送来一包种子说是谢礼，你发现是珍贵的药草种。他挠头说本想自己种，但怕种不好，还是交给懂的人——就像他的心。'],
    ['Harvest Before Storm', '雨中抢收', 'Before a storm, he rushes to salvage herbs, and you go to help. He insists you stand under the tarp while he gets soaked. When you\'re angry, he grins sheepishly: "Farmers don\'t fear rain—but you\'re different."', '暴雨前他急着抢收药草，你去帮忙。他坚持让你站在防雨布下，自己淋得透湿。你生气时，他憨笑："庄稼人不怕淋，你不一样。"'],
    ['Barn Shelter', '谷仓避雨', 'Trapped overnight in the barn, he gives you the only blanket and leans against the hay himself. When you ask if he\'s cold, he shakes his head, saying watching you stay warm keeps him warm.', '你们被困在谷仓过夜，他把唯一的毯子给你，自己靠着草垛。你问他冷不冷，他摇头说，看着你暖和他就不冷了。'],
    ['Harvest Truth', '丰收的真相', 'This year\'s bumper crop, he credits to your medicine. The village chief exposes him: every day before dawn, he\'s been weeding outside your shop, fixing steps, patching windows. "Your medicine doesn\'t make people that diligent."', '今年大丰收，他却说多亏了你的药。村长揭穿他每天天不亮就去你店门口除草、修台阶、补窗缝："你那药哪有让他勤快的功效。"'],
    ['Earth Ring', '泥土戒指', 'He weaves a ring from wheat stalks, embarrassed to say he\'ll replace it with a real one when he\'s saved enough. When you wear it, his eyes brim with tears: "The best harvest of my life is you willing to wear it."', '他用麦秆编了个戒指，不好意思地说等攒够钱换真的。你戴上后他眼眶泛红："我这辈子最好的收成，就是你愿意戴它。"'],
    ['Four Seasons Vow', '四季誓言', 'He kneels at the field ridge, a handful of soil in his palm: "I can\'t read, only farm. But I want to use spring for tilling, summer for protecting, autumn for harvesting, winter for companionship—to spend every season as yours."', '他在田埂跪下，手心摊开一把泥土："我没读过书，只会种地。但我想用春天耕耘、夏天守护、秋天收获、冬天陪伴，把每一季都过成你的。"'],
  ],
  // ◆ 恋人 · 朱利安 ——「把爱情写进每个瞬间的诗人」
  // 背景：二十五岁的小镇书记员，兼职给恋人代笔情书。西装口袋里总塞着沾满涂改的草稿纸。
  //       因为帮太多人告白却从未自己恋爱过而出名。写字时会咬笔帽，紧张时耳根先红。
  lover: [
    ['The Ghostwriter\'s Business', '代笔的生意', 'He comes asking you to verify a love charm\'s effect, saying his client\'s confessions keep failing. After reading the love letter he ghostwrote, you point out the problem: "You\'ve written all the heartfelt feelings for the wrong person." He freezes.', '他来请你帮忙鉴定爱情符咒效果，因为委托人说表白总失败。你看完他代笔的情书，指出问题："你把心动都写给了错的人。"他愣住了。'],
    ['Pink Accident', '粉色的意外', 'While organizing documents, a pink letter slips out with your name at the top. He hastily explains it\'s just practice phrasing—but all seventeen draft pages are addressed to the same recipient, with identical wording throughout.', '他整理文件时掉出一张粉色信纸，抬头写着你的名字。他慌忙解释这是练习措辞——但十七页草稿都是同一个收信人，连措辞都没改。'],
    ['The Clerk\'s Secret Stash', '书记员的私藏', 'People at the town hall mention the clerk keeps a locked drawer. You catch a glimpse inside—it\'s filled with draft love letters bearing your name, progressing from spring\'s "Respected Witch" to winter\'s "I like you."', '镇公所有人说书记员有个上锁的抽屉，你偶然看见里面全是写着你名字的情书草稿。从春天的"尊敬的魔女"写到冬天的"我喜欢你"。'],
    ['Love Letter in the Rain', '雨中情书', 'He runs up in the rain, shoves a letter into your hands, and flees. The paper is soaked but the handwriting remains neat. Three full pages, ending with: "I finally found the courage to write not for others, but for myself."', '他淋着雨把一封信塞到你手里就跑，信纸湿透但字迹工整。写了整整三页，最后一句是："我终于鼓起勇气，不替别人写，而是为自己写。"'],
    ['The Courage to Decline', '退稿的勇气', 'A noble asks him to ghostwrite a courtship letter to you; for once, he refuses. When you ask why, he takes a deep breath: "Because I don\'t want to share a single sentence about you with anyone else."', '有贵族请他代笔追求你，他破天荒拒绝了。你问他原因，他深吸一口气："因为关于你的句子，我一个字都不想分给别人。"'],
    ['Love Theory', '爱情理论', 'He brings a notebook filled with theories, earnestly analyzing confession success rates. Flipping to the last page reveals only one hastily scrawled line: "Meeting you rendered all theories invalid."', '他带来一本写满理论的笔记，认真分析告白成功率。翻到最后一页，只有一句潦草的话："遇见你，所有理论都失效了。"'],
    ['The Clerk\'s Negligence', '书记员失职', 'The mayor complains he\'s been making mistakes lately, constantly distracted. When you visit him, he\'s sketching your profile on the back of official documents—at least twenty drawings hidden in the pile.', '镇长抱怨他最近工作总出错，因为老走神。你去找他时，他正在公文背面画你的侧脸素描，纸堆里藏着至少二十张。'],
    ['Ink Confession', '墨水的告白', 'He gives you a bottle of specially blended ink, calling it a new formula. When you write with it, his handwriting emerges on the paper: "I love you" in three characters, rendered in the most beautiful script he practiced a thousand times.', '他把一瓶特调墨水交给你，说是新配方。你用它写字时，纸上浮现出他的笔迹："我爱你"三个字，用了他练习一千遍的最美字体。'],
  ],
  // ◆ 学者 · 维克多 ——「在你面前，知识分子学会了心跳」
  // 背景：二十九岁的皇家学院研究员，专攻魔法理论与应用。眼镜是特制的观察镜，镜腿上刻满公式。
  //       有随时随地记笔记的强迫症，袍子口袋被笔记本撑变形。失眠三年，因为脑子停不下来。
  scholar: [
    ['The Thirteenth Question', '第十三个问题', 'He asks twelve academic questions every visit—you\'ve grown accustomed. On his thirteenth visit, he unexpectedly poses a personal one: "Would you like a scholar who only knows how to ask questions?"', '他每次来都要问十二个学术问题，你已经习惯。第十三次见面时，他破天荒问了私人问题："你会喜欢一个只会提问的学者吗？"'],
    ['Notebook Invasion', '笔记本入侵', 'He asks for your help finding references. Opening his notebook, you find scribbled between formulas: "The witch smiled three times today," "Her hands look graceful mixing potions," "How to scientifically explain heartbeats."', '他请你帮忙查资料，你翻开他笔记本，发现学术公式之间夹着："今天魔女笑了三次""她调药的手很好看""如何用科学解释心动"。'],
    ['Experiment Gone Wrong', '实验失控', 'His potion experiment fails, splattering you. He fumbles to help clean, stammering incoherently. Finally he drapes his robe over you, face flushed: "I\'m sorry, this was my worst experiment ever."', '他的药剂实验失败喷了你一身，他手忙脚乱地帮你擦拭，紧张到语无伦次。最后他脱下外袍披在你身上，红着脸说：对不起，这是我最失败的实验。'],
    ['Paper Attribution', '论文署名', 'His major publication dedicates half a page of acknowledgments to you—the academic world is stunned. When his advisor questions it, he states seriously: "Her existence helps me understand the meaning of research, more important than any formula."', '他发表的重要论文里致谢部分用了整整半页写你，学术界震惊。导师质疑时，他认真说："她的存在让我理解了研究的意义，这比任何公式都重要。"'],
    ['All-Night Companionship', '通宵陪伴', 'You work through the night preparing potions; he sits quietly in the corner with a book. At dawn you realize he never turned a page. He admits: "Observing you is more absorbing than any research."', '你通宵赶制药剂，他默默坐在角落看书陪你。天亮时你发现他的书从未翻页，他承认："观察你比任何研究都让我专注。"'],
    ['Academic Argument', '学术争论', 'You fiercely debate pharmacology versus magical theory, neither yielding. Suddenly he laughs: "Someone I\'d willingly argue with all night must have already taken residence in all my hypotheses."', '你们为药理和魔法理论大吵一架，谁也不服。最后他忽然笑了："能让我愿意争论一整夜的人，大概已经住进了我的所有假设里。"'],
    ['Insomnia Prescription', '失眠处方', 'He mentions three years of insomnia, every remedy tried. Yet he falls asleep while you prepare medicine. Waking, he looks at you softly: "The prescription wasn\'t medicine—it was you being near."', '他说失眠三年，所有方法都试过。你给他调药时他却睡着了，醒来后他看着你，轻声说："原来处方不是药，是你在身边。"'],
    ['Lifelong Thesis', '终身课题', 'He presents a ring engraved with formulas, calling it the calculated optimal solution. The equation has one conclusion: among all possible futures, the one with you has the highest probability and maximum happiness index.', '他把一枚刻满公式的戒指递给你，说这是计算过的最优解。公式的结论只有一个：在所有可能的未来里，有你的那个概率最高，幸福指数也最大。'],
  ],
  // ◆ 幽灵 · 埃利亚斯 ——「死亡也无法带走的眷恋」
  // 背景：二十七岁时离世的钢琴师，已徘徊人间五年。半透明的身影只在月夜清晰，总穿着生前最后一次演出的礼服。
  //       可以触碰琴键和纸张，但无法感受温度。记得生前所有旋律，唯独忘了自己为何留下。
  ghost: [
    ['Midnight Visitor', '午夜访客', 'His first appearance startled you, yet he seemed more flustered than you. Hovering mid-air, he stammered an apology, saying he was drawn by the lamplight—it had been so long since anyone stayed up this late.', '他第一次出现时把你吓了一跳，却比你更慌张。飘在半空结结巴巴道歉，说他只是被灯光吸引，已经很久没见过有人点灯到这么晚了。'],
    ['Transparent Assistance', '透明的帮忙', 'You worked through the night mixing potions; he floated nearby wanting to help but couldn\'t lift anything. Finally he began humming softly to ease your burden, the melody melancholy yet tender. When you looked up, he was watching you intently.', '你熬夜配药，他飘在旁边想帮忙却什么都拿不起。最后他开始轻声哼曲子给你解闷，曲调忧伤又温柔，你抬头时他正认真看着你。'],
    ['Secret of the Old Piano', '旧琴的秘密', 'He always stared at the dust-covered piano in the corner. After you cleaned it, he grew so excited he materialized for a second, his fingertips leaving a single note on the keys—the piece he\'d wanted to finish in life but never could.', '他总盯着店角落蒙尘的旧钢琴。你擦干净后他激动到实体化了一秒，指尖在琴键上留下一个音。那是他生前最后想弹却没弹完的曲子。'],
    ['Frozen Rose', '冰冷的玫瑰', 'At dawn you found a frost-covered rose on the counter. He hovered by the window, not daring to come closer. "Anything a ghost touches grows cold, but I... still wanted to give you a flower." His voice was barely a whisper.', '清晨你发现柜台上有一朵结满霜的玫瑰，他飘在窗边不敢靠近。"幽灵碰过的东西都会变冷，但我……还是想送你花。"他声音小得像叹息。'],
    ['Witnessed Loneliness', '被看见的孤独', 'You asked why he hadn\'t moved on to reincarnation. After a long silence, he said he couldn\'t remember. As you helped him sort through his mortal possessions, finding a concert poster of his younger self, he wept—his tears falling like shattered moonlight.', '你问他为什么不去转生，他沉默很久说不记得了。你陪他翻生前的旧物，看到演出海报上年轻的他，他哭了，眼泪落下时像月光碎片。'],
    ['The Meaning of Warmth', '温度的意义', 'He said he envied most your ability to feel warmth. You placed your hand in the air he\'d passed through, saying earnestly: "Your company is warmth too." That night, his outline appeared clearer than ever before.', '他说最羡慕你能感受温暖。你把手放在他穿过的空气里，认真说："你的陪伴也是温暖。"那天晚上，他的轮廓比以往都清晰。'],
    ['Gate of Reincarnation', '转生之门', 'On the Night of Souls, the reincarnation gate opened for him. He looked at the light beyond, then back at you, finally clenching his transparent fist: "I\'m sorry, but I\'m not ready to forget you." The gate closed before him.', '亡灵节那晚，转生之门为他打开。他看着门后的光，又回头看你，最后握紧透明的拳头："对不起，我还不想忘记你。"门在他面前关闭了。'],
    ['Eternal Vigil', '永恒的守夜', 'After choosing to stay, his memories began returning—he had been waiting for a promise. "The one I\'ve been waiting for all along," he drew near, his phantom hand hovering by your cheek, "was you."', '他说选择留下后，记忆开始回来了——他是在等一个约定。"原来我一直在等的人，"他靠近你，虚幻的手停在你脸颊旁，"就是你。"'],
  ],
  elf: [
    ['Forest Encounter', '林间初遇', 'He descended from the canopy, barefoot and silent. You expected a rebuke for harvesting herbs, but instead he knelt to inspect your cut marks, saying earnestly: "A human who understands respect—the forest hasn\'t seen one in a hundred years."', '他从树冠飘然落下，赤足无声。你以为会责备你采摘药草，他却蹲下检查你留下的切口，认真说："懂得尊重的人类，森林一百年没见过了。"'],
    ['Tea Beneath Ancient Trees', '古树下的茶', 'He brewed tea with dew, calling it morning nectar from a three-hundred-year oak. You tasted grass and sunlight; his gaze softened like spring: "Only someone special may share it."', '他用露水泡茶，说这是三百岁橡树的晨露。你尝到青草和阳光的味道，他看你的眼神温柔得像春天："能分享它的，只有特别的人。"'],
    ['Wind\'s Translation', '风语翻译', 'He taught you the language of wind, though you understood nothing. Laughing softly, he drew near and brushed windswept strands from your face: "The wind says it loves to see me smile—and I only smile for you."', '他教你听风的语言，你什么都听不懂。他轻笑着靠近，替你拂开被风吹乱的碎发："风说，它喜欢看见我笑，而我只在你面前笑。"'],
    ['Silver Bow Vigil', '守夜的银弓', 'Creatures prowled the forest edge; he stood watch on your rooftop all night. At dawn you found his long hair pearled with dew. He simply shook his head: "Protecting what matters is an elf\'s instinct."', '森林边界有魔物徘徊，他整夜站在你店铺屋顶。黎明时你发现他长发上结满露珠，他只是摇头："守护重要的东西，是精灵的本能。"'],
    ['Secret of the Laurel Crown', '月桂冠的秘密', 'He wove a laurel crown and placed it on your head, calling it the forest\'s blessing. An elder told you later: elves weave such crowns only for their life partners—and he\'d gone three hundred years without weaving one.', '他编了一顶月桂花冠要你戴上，说是森林的祝福。族中长老告诉你，精灵只会给生命伴侣编月桂冠，他转了三百年都没编过。'],
    ['Eyes of the Seasons', '季节之瞳', 'You noticed for the first time his eyes changed color. He explained that elven eyes reflect the seasons—but when he looked at you, they fixed on spring\'s tender green: "Because you make me wish to pause forever at the moment all things are born."', '你第一次注意到他眼睛会变色。他解释说精灵之瞳映照四季，但看着你时，瞳色定格在春天的嫩绿："因为你让我想永远停在万物初生的时刻。"'],
    ['Immortal Promise', '不老的诺言', 'He said an elf\'s lifespan is a curse, the deepest pain watching those they cherish age. You held his hand and asked if he\'d regret it. He shook his head: "Even just your lifetime is more precious than my eternity."', '他说精灵的寿命是诅咒，看着珍视的人老去是最深的痛。你握住他的手问会不会后悔，他摇头："即使只有你的一生，也比我的永恒更珍贵。"'],
    ['Roots Intertwined', '根系相连', 'The forest\'s oldest tree opened a passage for you both, roots weaving into an archway. He took your hand and led you through: "An elven wedding needs no vows—the forest has already entwined our roots as one."', '森林最古老的树为你们开出一条通道，树根交织成拱门。他牵起你的手穿过："精灵的婚礼不需要誓言，因为森林已经把我们的根连在了一起。"'],
  ],
  dwarf: [
    ['Threshold Mender', '门槛修补匠', 'The gruff dwarf slammed gold coins down with a thunderous clang, grumbling for the strongest potion. Yet as he left, he paused, pulled out a small hammer, and smoothed your worn threshold, muttering: "So you don\'t trip, little witch."', '粗鲁的矮人把金币摔得震天响，嘴里嘟囔着要最烈的药水。临走时却停下，掏出小锤把你磨损的门槛修平，说："免得你这小魔女摔倒。"'],
    ['Stone Mortar Gift', '石研钵礼物', 'He brought a hefty granite mortar, claiming it came from deep in the mine. When you marveled at its weight, he turned away and mumbled: "Good things should be solid... like how I feel about you... never mind."', '他送来一只沉甸甸的花岗岩研钵，说是矿洞深处的好石头。你惊讶它的重量，他别过脸小声说："好东西就该结实，像我对你的……算了。"'],
    ['Mine Peril', '矿洞遇险', 'You accompanied him to gather glowing moss in the mine. Though he complained you were slow, his rough hand stayed protectively at your side. When the ground suddenly collapsed, he didn\'t hesitate—pulling you into his arms and taking the impact against the rock wall with his back.', '你陪他去矿洞采集发光苔藓，他嘴上嫌你走得慢，粗糙的手却一直护在旁边。地面突然塌陷时，他毫不犹豫把你抱进怀里，用后背撞上岩壁。'],
    ['Secret of the Beard', '胡须的秘密', 'Dwarves treasure their beards above all; his three-strand braid held ancestral runic bells. When you helped arrange it, he froze in nervous tension. The clan elder later told you: only a wife may touch a dwarf\'s beard-braid.', '矮人族最重视胡须，他的三股辫里藏着祖传的铭文铃铛。你帮他整理时他紧张得僵住，族中长老说只有妻子才能碰矮人的胡辫。'],
    ['Blacksmith\'s Clumsiness', '铁匠的笨拙', 'He forged a mithril hairpin with exquisite craftsmanship, yet wrapped it like he\'d used an ore sack. When you wore it, he stared for a long time, stammering: "It\'s... it\'s acceptable. Worthy of you."', '他锻造了一枚秘银发簪，手法精湛，包装却像是用矿石袋随便裹的。你戴上时他盯了很久，结结巴巴："还……还行，配得上你。"'],
    ['Forge Vow', '熔炉誓言', 'The dwarven courtship ritual is forging something together. He invited you to the forge\'s edge; your hammer-strikes interwove with his. He murmured low: "This is our shared rhythm—it will ring for a lifetime."', '矮人族的求爱仪式是共同锻造一件作品。他邀请你来锻炉边，你们的铁锤声交织在一起，他低声说："这是我们共同的节奏，会响一辈子。"'],
    ['Tavern Confessions', '酒馆醉话', 'At the victory feast he drank too much, throwing an arm around your shoulder and declaring to the entire tavern: "This is my witch! Anyone who dares bully her, I\'ll bury in the deepest part of the mine!" The next day he flatly denied it.', '庆功宴上他喝多了，搂着你的肩膀对全酒馆宣布："这是我的魔女！谁敢欺负她，我就把他埋进矿洞最深处！"第二天醒来他死不承认。'],
    ['Stone Ring Pledge', '石戒之约', 'He crafted a mithril ring that could withstand dragon\'s breath, its face set with a crystal from the mine where you first met. Kneeling on one knee, he spoke solemnly in ancient dwarven: "My forge will burn for you forever."', '他打造了一枚能挡龙息的秘银戒指，戒面镶着你们初遇那天矿洞的水晶。他单膝跪地，用矮人古语郑重说："我的熔炉永远为你燃烧。"'],
  ],
  vampire: [
    ['Midnight Caller', '午夜来客', 'The elegant vampire visits only at the stroke of midnight, his cane tapping the floor like the beat of an ancient waltz. He praises the potion\'s enchanting fragrance, then pauses to add: "Though of course, not as enchanting as you."', '优雅的吸血鬼只在午夜准时到访，手杖敲击地板的声音像古老的华尔兹节拍。他夸赞药水的香气迷人，停顿后补充："当然，不及你。"'],
    ['Warm Black Tea', '温热的红茶', 'You prepared heated black tea for him instead of blood. He froze for three seconds, then sipped it earnestly. Under the moonlight he murmured: "In three hundred years, you\'re the first to treat me as a guest, not a monster."', '你为他准备了加热的红茶而非鲜血。他愣了三秒，然后认真品尝。月光下他轻声说："三百年来，第一次有人把我当客人，不是怪物。"'],
    ['Castle Invitation', '古堡邀约', 'A black raven delivered a gilt-edged invitation to a castle banquet. He waited at the door for a full hour just to personally drape a velvet cloak over your shoulders: "Tonight, the candles burn for you alone."', '黑鸦叼来烫金请柬，邀请你参加古堡晚宴。他在门口等了整整一小时，只为亲手为你披上天鹅绒披肩："今夜烛光只为你点燃。"'],
    ['Vampiric Restraint', '血族的克制', 'You accidentally cut your finger; his pupils flared crimson instantly, yet he immediately retreated three steps. Gripping his cane tightly, he apologized in a low voice: "The more I care for someone, the less I dare let instinct near."', '你不小心割伤手指，他瞳孔瞬间泛红，却立刻后退三步。他双手死死攥着手杖，低声道歉："越在乎的人，越不敢让本能靠近。"'],
    ['Treasury Secret', '收藏室秘密', 'He showed you treasures collected over centuries, yet lingered longest before a withered rose. It was the flower you\'d casually placed in a potion bottle last time—he\'d preserved it forever with magic.', '他带你参观珍藏数世纪的宝物，却在一朵干枯玫瑰前停留最久。那是你上次随手插在药瓶上的花，被他用魔法永久保存。'],
    ['Dawn\'s Warmth', '黎明的温度', 'You concocted a potion allowing vampires to briefly endure sunlight. At dawn he stood by the window, watching the first rays illuminate your face: "So this is the gentle light that greets you every morning."', '你调制出能让吸血鬼短暂承受阳光的药剂。清晨他站在窗边，看着第一缕晨光照在你脸上："原来你每天醒来，都被这样温柔的光包围。"'],
    ['Curse of Eternity', '永恒的诅咒', 'He said immortality is the cruelest punishment, for it means watching all you cherish depart. You grasped his cold hand, and he said hoarsely: "But if I\'d never met you, this eternity would be far more hollow."', '他说不朽是最残酷的惩罚，因为会目送所有珍视之人离开。你握住他冰冷的手，他哑声说："但如果不遇见你，这永恒更加空洞。"'],
    ['Blood Moon Oath', '血月誓约', 'On the night of the blood moon, he offered his true name and blood pact through his family\'s ancient rite. "My eternity belongs to you—even if it buys only your single lifetime, I give it willingly." He kissed your fingertips.', '血月之夜，他用家族传承的仪式献上自己的真名与血契。"我的永恒属于你，哪怕只换来你的一生，我也甘愿。"他吻上你的指尖。'],
  ],
  priest: [
    ['Question of Holy Light', '圣光疑问', 'The devout priest cautiously asks if your magic might offend the divine. After you demonstrate a healing potion, he clasps his hands and smiles, saying kindness itself is the purest prayer.', '虔诚的牧师谨慎询问你的魔法是否会冒犯神明。你展示治愈药水后，他合掌微笑，说善意本身就是最纯净的祈祷。'],
    ['Breakfast After the Bells', '钟声早餐', 'After the morning bells, he brings temple-baked bread, explaining you often forget to eat. Halfway through his blessing, he suddenly falters—because your smile is too close.', '清晨钟声后，他送来神殿烤面包，理由是你常忙到忘记吃饭。祝福词念到一半，他忽然卡壳，因为你笑得太近。'],
    ['Confessional Secret', '忏悔室秘密', 'In the confessional he admits in a low voice that lately his prayers always drift to you. Through the wooden partition, he cannot see your expression, yet hears his own heartbeat louder than the bells.', '他在忏悔室里低声承认最近祈祷总会想到你。隔着木窗，他看不见你的表情，却听见自己心跳比钟声更响。'],
    ['Blessed Bracelet', '祝福手绳', 'He weaves a white cord bracelet that he says wards off malice. As he ties it on, his fingertips tremble slightly, as if completing a promise more intimate than any ritual.', '他编了一条白色手绳，说能驱散恶意。系上时他的指尖微颤，像在完成一场比仪式更私人的承诺。'],
    ['Shelter on a Rainy Night', '雨夜收留', 'The storm washes out the small bridge; he stays at your shop to help tend the ill. Late at night he drapes a blanket over you, murmuring that God will forgive him for letting his gaze linger a moment longer.', '暴雨冲垮小桥，他留在小店帮忙照看病人。夜深时他为你披上毯子，轻声说神会原谅他把目光多停留一会儿。'],
    ['Doctrine and Heart', '教义与心意', 'The elder questions his frequent visits to the witch\'s shop. He responds calmly: if faith demands distance from kindness, then he is willing to reinterpret faith. Your name gives him courage.', '长老质疑他频繁来往魔女小店，他平静回应：若信仰要求远离善良，那他愿重新理解信仰。你的名字让他变得勇敢。'],
    ['Altar Bouquet', '圣坛花束', 'After the festival service, a bouquet of purple wildflowers appears on the altar. He says it\'s offered to the divine, and also to the one who taught him that love and mercy need not contradict.', '节庆礼拜后，圣坛上多了一束紫色小花。他说献给神明，也献给让他理解爱与慈悲并不矛盾的人。'],
    ['Vow of Light', '以光为誓', 'The priest takes your hand in the morning light, his solemnity rivaling that of reciting scripture. "I vow to spend my life proving that drawing close to you is not a fall from grace, but the path to which the light has led me."', '牧师在晨光中握住你的手，郑重得像宣读圣典。“我愿以余生证明，靠近你不是堕落，而是我被光引领的方向。”'],
  ],
  witch_hunter: [
    ['Blade\'s Scrutiny', '刀锋审视', 'The cautious witch hunter keeps his hand on his blade the first time he enters, his gaze cold as silver. But after you heal his injured arm from tracking, he falls silent for a long moment, then simply says he owes you one.', '谨慎的猎魔人第一次进店时手不离刀，眼神冷得像银刃。可你救下他追踪时受伤的手臂后，他沉默许久，只说欠你一次。'],
    ['Safe Distance', '安全距离', 'He always stood by the door, ready to retreat at any moment. But on his third visit, he willingly took a seat at the counter and placed his weapon a little farther away: "Today, I want to try trusting you."', '他总站在门边，方便随时撤退。第三次来时却主动坐到柜台前，把武器放远一点：“今天我想试着相信你。”'],
    ['Hunting at Dusk', '共猎黄昏', 'You provide tracking powder to aid his monster hunt; he shields you from danger. Returning at dusk, he hands you the trophy, saying without your magic, he couldn\'t have won.', '你提供追踪药粉协助他狩猎魔物，他负责挡住危险。黄昏归来时，他把战利品交给你，说没有你的魔法，他赢不了。'],
    ['False Accusation', '误会通缉', 'Someone in town falsely accuses you of dark magic; he investigates through the night. Facing the inquisitor, he draws his blade for a witch for the first time, his voice calm and unyielding.', '城里有人诬告你使用黑魔法，他连夜调查证据。面对审判官，他第一次为魔女拔刀，声音冷静得不容置疑。'],
    ['Map of Scars', '伤痕地图', 'He shows you his old wounds, each one earned from past mistrust. As you gently apply salve, he murmurs that perhaps what he should hunt most is his own prejudice.', '他让你查看身上旧伤，每一道都来自曾经的不信任。你轻轻涂药时，他低声说，也许他最该猎杀的是自己的偏见。'],
    ['Silver Blade Charm', '银刃护符', 'He grinds a sliver of silver blade into a charm for you, one that warns of malice. You ask if he fears weakening his weapon; he answers that his true weapon has already learned to protect you.', '他把一小片银刃磨成护符送你，能警示恶意。你问他不怕削弱武器吗，他回答真正的武器已经学会保护你。'],
    ['Campfire Confession', '篝火坦白', 'During the hunt you share a campfire; he speaks of losing companions in the past. Firelight reflected in his eyes, he says he won\'t leave those important to him outside danger again.', '追猎途中你们共守一堆篝火，他讲起失去同伴的过去。火光映在他眼里，他说不想再把重要的人留在危险之外。'],
    ['Laying Down the Hunter\'s Name', '放下猎名', 'He submits his resignation, no longer defining himself solely as a witch hunter. Entering the shop empty-handed, he asks earnestly: May I stay as someone who admires you?', '他递交辞呈，不再以猎魔人为唯一身份。走进小店时，他空着双手，认真地问：我能不能作为一个爱慕你的人留下？'],
  ],
  bard: [
    ['Off-Key Love Song', '跑调情歌', 'The cheerful bard strikes three wrong chords the moment he enters, yet insists it\'s improvisation. When you laugh aloud, he immediately declares this will become his new piece, "The Witch\'s Laughter."', '欢快的吟游诗人一进门就弹错三个和弦，却坚持说这是即兴。你笑出声后，他立刻宣布这将成为新曲《魔女的笑声》。'],
    ['Rhyming Orders', '押韵订单', 'Every time he orders, he rhymes, nearly causing you to mix up ingredients. As apology he gifts you a short poem, the last line concealing your name, spoken like a kiss.', '他每次点单都要押韵，害你差点把药材放错。赔礼时他送你一段短诗，最后一句藏着你的名字，念起来像亲吻。'],
    ['Town Square Ballad', '广场传唱', 'A song begins to circulate in the town square, singing of how the forest witch lights up the night. When you confront him, he winks and says art requires truth—and his truth is all about you.', '小镇广场开始流行一首歌，唱森林魔女如何点亮夜晚。你找他算账，他眨眼说艺术需要真实，而他的真实全与你有关。'],
    ['Broken String Nocturne', '破弦夜曲', 'Before the performance his lute string snaps; you mend it with a small spell. On stage he improvises a new piece, reserving his deepest bow at curtain call for you backstage.', '演出前琴弦断裂，你用小魔法帮他修好。他在台上临时改曲，把谢幕时最深的鞠躬献给后台的你。'],
    ['The Traveling Troupe', '旅行剧团', 'The theater troupe invited him to leave, but he hesitated. You said the opportunity was rare, yet he asked in return: "If the story I most want to write is here, why should I go far away?"', '剧团邀请他离开，他却犹豫不决。你说机会难得，他反问：“如果最想写的故事在这里，我为什么要去远方？”'],
    ['Rain Alley Duet', '雨巷二重奏', 'On a rainy night he holds an umbrella for you in the alley, raindrops drumming out a rhythm. He hums a melody for you to add words; your offhand line, he solemnly transcribes into his songbook.', '雨夜他在巷口为你撑伞，雨点敲成节拍。他哼着旋律让你填词，你随口一句，他竟郑重写进随身歌本。'],
    ['Silent Singer', '沉默的歌者', 'His voice goes hoarse, yet he still uses notes to make you laugh. The last one reads: Even when I cannot sing, you\'re still the one I most want to tell my heart to.', '他嗓子哑了，却仍用纸条逗你笑。最后一张纸条写着：原来不能唱歌时，我还是最想把心意告诉你。'],
    ['Final Song Dedication', '终曲献名', 'The finale piece of the celebration is named after you. Amidst the cheers of the entire audience, he jumps down from the stage and takes your hand: "I\'ve sung many legends, but I only wish to write the rest of my life with you."', '庆典压轴曲名为你的名字。全场欢呼中，他跳下舞台牵起你的手：“我唱过很多传说，但只想和你写余生。”'],
  ],
  alchemist: [
    ['Smoking Colleague', '冒烟同行', 'The eccentric alchemist bursts in clutching a smoking flask, excitedly calling you a fellow practitioner. After the explosion, his first instinct isn\'t to save the experiment—it\'s to check if you\'re hurt.', '古怪的炼金术士抱着冒烟烧瓶冲进店里，兴奋地称你为同行。爆炸声后，他第一反应不是救实验，而是检查你有没有受伤。'],
    ['Anti-Gravity Lunch', '反重力午餐', 'His experiment sends lunch floating to the ceiling; you both stand on chairs grabbing at bread. Amid the chaos he laughs brightly, saying even failures are delightful when working with you.', '他的实验让午餐漂到天花板，你们只能站在椅子上抢面包。混乱中他笑得灿烂，说与你合作连失败都可爱。'],
    ['Wonderful Formula', '奇妙配方', 'He proposes adding moon dew, sugar frost, and a dash of heartbeat to the new potion. When you ask how to measure a heartbeat, he leans close, earnestly offering himself as a sample.', '他提出把月露、糖霜和一点点心跳加入新药。你问心跳怎么量，他立刻贴近，认真表示自己可以提供样本。'],
    ['Glass Greenhouse', '玻璃温室', 'The alchemy greenhouse blooms with metal flowers; he says each records visitors\' voices. You approach one—it plays on loop his practice attempts at asking you on a date.', '炼金温室里开满金属花，他说每朵都会记录访客声音。你靠近一朵，里面反复播放的是他练习邀请你约会的话。'],
    ['Amnesia Potion', '失忆药剂', 'He accidentally drinks a short-term memory potion, yet still instinctively shields you. Upon recovery he proudly declares: Apparently liking you is written into my soul\'s reaction formula.', '他误饮短效失忆药水，却仍本能地把你护在身后。恢复后他得意宣布：看来喜欢你已经写进灵魂反应式。'],
    ['Rival Competition', '同行竞争', 'In the academy contest you\'re assigned as opponents; he declares rivalry aloud, yet secretly reserves the best materials for you. When you confront him, he says winning matters less than your happiness.', '学院比赛中你们被分到对手组，他嘴上宣战，暗地却把最佳材料留给你。你质问他，他说胜负没有你开心重要。'],
    ['Alchemical Heart', '炼金心脏', 'He shows you a mechanical heart that simulates emotion. The device beats wildly near you; he touches his own chest and admits: The real one does the same.', '他展示一枚机械心脏，说能模拟情绪。机器一靠近你就剧烈跳动，他却摸着自己胸口承认：真品也是这样。'],
    ['Philosopher\'s Kiss', '贤者之吻', 'Legend says the Philosopher\'s Stone grants wishes; he finally creates a fragment, yet uses it as the stone in your ring. He says immortality and gold are boring—only loving you is worth a lifetime of study.', '传说贤者之石能实现愿望，他终于炼成一小块，却用来做你的戒面。他说永生和黄金都无聊，唯有与你相爱值得研究一生。'],
  ],
  dragon: [
    ['Mischievous Dragon Tail', '龙尾捣乱', 'The playful young dragon sticks his tail into the herb cabinet, scattering sparkles everywhere. After you glare at him, he obediently folds his wings—yet secretly pushes the shiniest gem toward you.', '顽皮的幼龙把尾巴伸进药材柜，弄得满地亮晶晶。他被你瞪了一眼后乖乖收好翅膀，却偷偷把最闪的宝石推给你。'],
    ['Gold Coin Nest', '金币窝垫', 'He invites you to visit his treasure hoard, proudly saying the softest spot is reserved for honored guests. After you sit, he quickly adds: Also reserved for my favorite human.', '他邀请你参观自己的宝物窝，骄傲地说最软的位置留给贵客。你坐下后，他立刻补充：也是留给最喜欢的人类。'],
    ['Sneezing Sparks', '喷嚏火花', 'The young dragon catches a cold and sneezes sparks, nearly igniting the curtains. As you feed him potion, he pitifully rests his chin in your palm, like an oversized pouting cat.', '幼龙感冒喷出小火花，差点点燃窗帘。你喂他药水时，他委屈地把下巴搁在你手心，像一只超大号撒娇猫。'],
    ['Flight Trial', '飞行试乘', 'He insists on taking you on a low-altitude flight, circling the forest again and again. After landing he smugly asks if you were scared; when you say not really, his ear-scales flush red.', '他坚持带你低空飞行，绕着森林转了一圈又一圈。落地后他得意地问怕不怕，你说还好，他反而红了耳鳞。'],
    ['Treasure Inventory', '藏宝清单', 'He begins listing your hair ribbon, notes, and empty potion bottles in his treasure inventory. When you protest, he earnestly explains that dragons only hoard the most precious things.', '他开始把你的发带、便签和空药瓶列入藏宝清单。你抗议后，他认真解释龙只收藏最珍贵的东西。'],
    ['Coming-of-Age Horns', '成年礼角', 'A young dragon\'s coming-of-age requires decorating the horns; he gives you the choice. You tie on a purple ribbon, and he shows it off to his clan for three solid days.', '幼龙成年礼需要装饰龙角，他把选择权交给你。你系上一条紫丝带，他在族人面前炫耀了整整三天。'],
    ['Guarding Territory', '守护领地', 'Thieves approach the shop; he coils on the roof and growls low. Afterward he pretends he was just protecting territory—yet the boundary clearly encompasses only your window.', '有盗贼靠近小店，他盘在屋顶发出低吼。事后他装作只是保护领地，可领地边界明显只圈住了你的窗户。'],
    ['Dragon Courtship', '龙族求偶', 'He brings a cavern\'s worth of gems, solemnly asking if it\'s enough for a courtship gift. You say it\'s too much; he immediately takes back most, leaving only the one that matches your eye color.', '他带来一山洞宝石，郑重询问够不够做求偶礼。你说太夸张，他立刻收起大半，只留下最像你眼睛颜色的一颗。'],
  ],
  necromancer: [
    ['Whispers in Black Robes', '黑袍低语', 'The mysterious necromancer stands in the shadows, his voice echoing as if from an ancient well. When you hand him the warm potion, he pauses—a rare occurrence—and says it\'s been a long time since anyone gave him "warmth."', '神秘的死灵法师站在阴影里，声音像从古井传来。你递给他温热药剂时，他罕见停顿，说已经很久没人给他“温度”。'],
    ['Skeleton Messenger', '骷髅信使', 'A small skeleton delivers an order along with a lopsided daisy. The note reads "It insists you\'ll like this," yet the handwriting betrays who truly chose the flower.', '一只小骷髅送来订单和一朵歪头雏菊。纸条上写着"它坚持认为你会喜欢"，字迹却暴露了真正挑花的人。'],
    ['Dance of the Dead', '亡者舞会', 'He invites you to a ball that appears only during lunar eclipses. Skeleton musicians play ancient melodies; through black gloves he takes your hand and spins you, courteous to the point of reverence.', '他邀请你参加只在月食出现的舞会。骷髅乐手奏起旧曲，他隔着黑手套牵你旋转，礼貌得近乎虔诚。'],
    ['Soul Divination', '灵魂占卜', 'You divine his soul\'s echo and glimpse the shadow of a boy afraid of solitude. He closes the crystal sphere, murmuring that now there\'s you beside that shadow.', '你为他占卜灵魂回声，看见他少年时害怕孤独的影子。他合上水晶球，低声说如今影子旁边多了你。'],
    ['Forbidden Tome Bookmark', '禁书书签', 'He lends you a forbidden tome with a black rose bookmark inside. Each time you turn a page, the bookmark displays a reminder: Rest early—don\'t make a certain necromancer worry.', '他借你一本禁书，里面夹着黑玫瑰书签。每次翻页，书签都会浮现一句提醒：早点休息，别让某位死灵法师担心。'],
    ['Daylight Practice', '白昼练习', 'To avoid frightening customers, he practices smiling in daylight—the result looks more like a curse. You laugh until you lean on the counter; he sighs helplessly, yet calls your laughter the most effective resurrection spell.', '为了不吓到客人，他练习在白天微笑，结果更像诅咒。你笑到扶柜台，他无奈叹息，却把你的笑声称作最有效的复活术。'],
    ['Boundary of Life and Death', '生死边界', 'When the undead spiral out of control he tells you to flee, yet you stay to help with the barrier. After the dust settles, he takes your hand, revealing true fear for the first time: Nearly losing you is more terrifying than death.', '亡灵失控时他让你先走，你却留下协助结界。尘埃落定后，他握住你的手，第一次显露真实恐惧：差点失去你，比死亡可怕。'],
    ['Before Eternal Sleep', '永眠之前', 'He burns the soul contract, signifying he will no longer lock himself in death. "If you\'re willing," the gaze beneath the black robe turns tender, "I want to learn how to live and love you."', '他把灵魂契约烧毁，表示不再把自己锁在死亡里。“若你愿意，”黑袍下的眼神温柔，“我想学习怎样活着爱你。”'],
  ],
  fairy: [
    ['Pollen Greeting', '花粉问候', 'The innocent flower fairy scatters a trail of sparkling pollen, turning your hair into a temporary garland. She apologizes frantically, but you laugh—so she declares it today\'s most successful magic.', '天真的花仙子洒下一串闪亮花粉，把你的头发变成临时花环。她慌忙道歉，你却笑了，于是她宣布这是今天最成功的魔法。'],
    ['Dewdrop Breakfast', '露珠早餐', 'She brings a sweet made from a dewdrop, solemn as if presenting treasure. You taste morning flower fragrance; she watches with her chin in her hands, happily flapping her wings until she nearly crashes into the lamp.', '她带来一枚露珠做的甜点，郑重得像献宝。你尝到清晨花香，她托腮看你，开心地拍翅膀拍到差点撞上灯。'],
    ['Miniature Date', '迷你约会', 'She converts a teacup into a two-person boat and invites you to sail in the washbasin. Though the route only circles the tabletop, she earnestly says this is the highest-class date in the fairy kingdom.', '她把茶杯改造成双人小船，邀请你在水盆里航行。虽然路线只有桌面一圈，她仍认真说这是仙子王国最高规格约会。'],
    ['Language of Flowers Misunderstanding', '花语误会', 'The flower she gives you means "want to see you every day" in flower language, though she has no idea. When you explain, she blushes entirely into a raspberry.', '她送你的花在花语里代表"想每天见你"，自己却完全不知道。你解释后，她整个人红成一颗覆盆子。'],
    ['Wing Raincoat', '翅膀雨衣', 'On a rainy day she makes herself a raincoat from leaves, then brings you an umbrella so tiny it only covers a finger. When you accept it, she spins circles in the air with joy.', '下雨天她用叶片给自己做雨衣，又给你带来一把小到只能遮住手指的伞。你收下后，她幸福得在空中转圈。'],
    ['Sugar Frost Crisis', '糖霜危机', 'She sneaks sugar frost and gets stuck in the jar; when you rescue her, her face is covered in white. After three seconds of solemn reflection, she saves the sweetest first bite for you.', '她偷吃糖霜陷进罐子里，被你救出来时满脸雪白。她严肃反省三秒，然后把第一口最甜的糖霜留给你。'],
    ['Fairy Dust Courage', '仙尘勇气', 'To protect the garden, she musters courage to face a crow for the first time. When you arrive, she\'s trembling in front of the flowers, yet still calling your name to embolden herself.', '为了保护花园，她第一次鼓起勇气面对乌鸦。你赶到时，她正颤抖着挡在花前，却还不忘喊你的名字给自己壮胆。'],
    ['A Tiny Vow', '小小誓言', 'She placed a flower seed in your palm, saying that a fairy\'s love would bloom. The next day, a miniature rose sprouted on the windowsill, with "I like you" written on every petal.', '她把一枚花籽放进你掌心，说仙子的爱会开花。第二天窗台长出一株迷你玫瑰，每片花瓣都写着“喜欢你”。'],
  ],
  demon: [
    ['Contract Smile', '契约笑意', 'The cunning demon spreads contract scrolls across the counter, clauses ornate and perilous. After you strike through each trap, he smiles with delight, saying clever witches are the most captivating.', '狡猾的恶魔把契约卷轴铺满柜台，条款华丽又危险。你逐条划掉陷阱后，他反而笑得愉快，说聪明的魔女最让人着迷。'],
    ['Losing Proposition', '赔本诱惑', 'He offers to trade a wish for your afternoon. You refuse the deal, yet he leaves premium materials anyway, shrugging that occasionally taking a loss lets him observe interesting reactions.', '他提出用一个愿望换你的午后时间。你拒绝交易，他却照样留下高级材料，耸肩说偶尔赔本也能观察有趣反应。'],
    ['Tail Betrayal', '尾巴泄密', 'The demon claims he\'s just passing through, but his tail honestly coils around the counter, refusing to leave. When you look at him, he immediately covers his face with his wings, insisting it\'s a base physiological response.', '恶魔嘴上说只是路过，尾巴却诚实地卷住柜台不肯走。你看向他，他立刻用翅膀遮脸，声称这是低等生理反应。'],
    ['Infernal Afternoon Tea', '地狱下午茶', 'He invites you to taste infernal desserts—horrifying in appearance yet surprisingly delicious. Seeing your enjoyment, he smugly announces he\'s bought the establishment, just to delight you anytime.', '他邀请你品尝地狱甜点，外表恐怖却意外美味。看你喜欢，他得意宣布已买下那家店，只为以后随时哄你开心。'],
    ['Soul Not for Sale', '灵魂不售', 'When a fellow demon wanted to buy your soul, he stepped in front of you with a smile, his tone still playful yet chillingly lethal: "Everything belonging to this witch is not on the trading list."', '有恶魔同族想买你的灵魂，他笑着挡在前面，语气仍轻佻却杀意森冷：“这位魔女的任何东西，都不在交易名单上。”'],
    ['True Name as a Wager', '真名筹码', 'A demon\'s true name holds binding power, yet he told you half of its syllables. When you asked why he trusted you, he looked away: "Because you never abuse the vulnerability others entrust to you."', '恶魔真名拥有束缚力量，他却把一半音节告诉你。你问为何信任，他避开视线：“因为你从不滥用别人交出的脆弱。”'],
    ['Trap Backfires', '骗局反噬', 'He sets a trap to make you admit you miss him, but you turn the tables. The contract ignites in pink flames; he stares at the clause "the one smitten loses," falling uncharacteristically silent.', '他设局想让你承认想他，结果被你反将一军。契约燃起粉色火焰，他盯着条款上"心动者认输"，罕见地沉默了。'],
    ['Unfair Trade', '不公平交易', 'He presents one final contract with a single term: permission to remain by your side. The compensation reads "his true heart"—he says it\'s the least cunning deal he\'s ever made.', '他递来最后一份契约，条件只有一条：允许他长久陪在你身边。报酬栏写着他的真心，他说这是他做过最不狡猾的交易。'],
  ],
};

function _buildRoleStoryEntries() {
  return CUSTOMER_TYPES.flatMap(role => {
    const storyList = ROLE_STORY_LIBRARY[role.id] || [];
    return storyList.map((entry, index) => {
      // 支持两种格式：[title, body] 或 [titleEN, titleCN, bodyEN, bodyCN]
      let titleEN, titleCN, bodyEN, bodyCN;
      if (entry.length === 4) {
        [titleEN, titleCN, bodyEN, bodyCN] = entry;
      } else {
        // 兼容旧格式（纯中文）
        [titleCN, bodyCN] = entry;
        titleEN = titleCN;
        bodyEN = bodyCN;
      }
      
      return {
        id: `${role.id}_${role.personality}_story_${index + 1}`,
        roleId: role.id,
        charName: role.charName || role.name,
        roleName: role.name,
        emoji: role.emoji,
        titleEN: titleEN,
        titleCN: titleCN,
        bodyEN: bodyEN,
        bodyCN: bodyCN,
        scope: 'character',
        route: index < 4 ? 'public' : 'inner',
        characterIds: [role.id],
        // 保留兼容性字段
        title: titleCN,
        text: bodyCN,
        unlockOrders: {
          identity: role.id,
          personality: role.personality,
          count: ROLE_STORY_THRESHOLDS[index],
        },
        unlockBond: {
          roleId: role.id,
          level: Math.max(0, Math.floor(index / 2)),
        },
        preview: {
          hiddenTitle: index < 4 ? `${role.charName || role.name}的下一段故事` : `${role.charName || role.name}的深层心事`,
          hint: index < 4
            ? `${role.charName || role.name}似乎因为店里的往来，慢慢对你放下戒心。`
            : `${role.charName || role.name}还有一些不愿轻易说出口的事情。`,
          visibleHints: [
            `继续完成${role.charName || role.name}的委托`,
            '提升与 TA 的羁绊等级',
          ],
          revealPolicy: 'partial',
        },
      };
    });
  });
}

const STORY_ENTRIES = [
  {
    id: 'intro',
    title: '第一章：小店开张',
    text: '在幽深的森林边缘，有一间小小的魔女小店。艾露娜——或者叫你起的名字——继承了祖母留下的魔法配方，决定开始她的经营之旅。\n\n「只要用心，每一杯魔药都能带去温暖。」',
    scope: 'prologue',
    route: 'archive',
    unlockPhase: 0,
    unlockCoins: 0,
  },
  ..._buildRoleStoryEntries(),
  {
    id: 'shop_reputation_crisis',
    title: '口碑危机',
    text: '傍晚时分，你在门口发现几张被风吹来的传单。上面写着：「森林边的小店最近总让客人空手而归。」\n\n这不是终点，却是一个提醒：每一次迟到、每一次失败，都会在小镇的耳语里留下痕迹。第二天清晨，有人敲响店门，没有责备，只问你是否需要帮忙重新整理订单簿。',
    scope: 'shop',
    route: 'if',
    unlockStats: { customersLostMin: 5 },
    preview: {
      hiddenTitle: '小镇的耳语',
      hint: '最近似乎有些客人带着失望离开了。小镇上的传言开始变多。',
      visibleHints: [
        '让店铺经历一次经营压力',
        '关注没有被及时服务的客人',
      ],
      revealPolicy: 'partial',
    },
  },
  {
    id: 'grand_witch',
    title: '大魔女',
    text: '消息在小镇中传开了：「森林边那间小店的魔女，她的魔法是真的！」\n\n如今，来自四面八方的客人络绎不绝。你的祖母若是看到，一定会微笑的。\n\n「魔法，从未离我们而去。」',
    scope: 'shop',
    route: 'public',
    unlockOrders: { count: 30 },
    preview: {
      hiddenTitle: '更远处的传闻',
      hint: '当足够多的客人带着满意离开，森林边的小店会被更多人记住。',
      visibleHints: ['完成更多订单'],
      revealPolicy: 'partial',
    },
  },
];

/* ─── ROOM DECORATIONS (canvas drawing data) ─── */
const ROOM_DECORATIONS = [
  { emoji: '🕯️',  x: 0.08, y: 0.15 },
  { emoji: '🕯️',  x: 0.92, y: 0.15 },
  { emoji: '📚',  x: 0.15, y: 0.45 },
  { emoji: '🧺',  x: 0.82, y: 0.55 },
  { emoji: '🌿',  x: 0.05, y: 0.65 },
  { emoji: '🪄',  x: 0.88, y: 0.35 },
  { emoji: '⚗️',  x: 0.50, y: 0.20 },
  { emoji: '🦇',  x: 0.30, y: 0.08 },
  { emoji: '🦇',  x: 0.70, y: 0.12 },
];

/* ─── WITCH SPRITE STATES ─── */
const WITCH_EMOJI = {
  idle:    '🧙‍♀️',
  working: '🧙‍♀️',
  success: '🧙‍♀️',
};

/* ─── ALIASES (for backward compatibility / checker) ─── */
const SHOP_ITEMS = [...SHOP_UNLOCKS, ...SHOP_UPGRADES];
const PHASE_THRESHOLDS = PHASES.map(p => p.coinsNeeded);
const CUSTOMERS = CUSTOMER_TYPES;

/* MAX_PHASE */
// (defined in state.js as: const MAX_PHASE = PHASES.length - 1)
