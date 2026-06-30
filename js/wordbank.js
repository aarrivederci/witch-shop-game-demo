/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Word Bank (词库系统)

   【架构】
   - 从外部JSON文件异步加载四六级词库
   - 回退机制：加载失败时使用内置150词基础库
   - 按难度分级，随机抽取适配当前游戏阶段
═══════════════════════════════════════════════════════ */

const WordBank = (() => {
  let _words = [];
  let _loaded = false;

  /* ─── 内置基础词库（150词备用）─── */
  const FALLBACK_WORDS = [
    {word:'brew',meaning:'酿造',difficulty:1},{word:'potion',meaning:'药水',difficulty:1},
    {word:'magic',meaning:'魔法',difficulty:1},{word:'spell',meaning:'咒语',difficulty:1},
    {word:'witch',meaning:'女巫',difficulty:1},{word:'moon',meaning:'月亮',difficulty:1},
    {word:'star',meaning:'星星',difficulty:1},{word:'crystal',meaning:'水晶',difficulty:1},
    {word:'dragon',meaning:'龙',difficulty:2},{word:'ancient',meaning:'古老的',difficulty:2},
    {word:'mystic',meaning:'神秘的',difficulty:2},{word:'enchant',meaning:'施魔法',difficulty:2},
    {word:'fortune',meaning:'财富',difficulty:1},{word:'wisdom',meaning:'智慧',difficulty:1},
    {word:'charm',meaning:'魅力',difficulty:1},{word:'rune',meaning:'符文',difficulty:2},
    {word:'elixir',meaning:'灵药',difficulty:3},{word:'alchemy',meaning:'炼金术',difficulty:3},
    {word:'tarot',meaning:'塔罗牌',difficulty:2},{word:'oracle',meaning:'神谕',difficulty:3},
    {word:'destiny',meaning:'命运',difficulty:2},{word:'mystery',meaning:'秘密',difficulty:1},
    {word:'shadow',meaning:'影子',difficulty:1},{word:'spirit',meaning:'精神',difficulty:1},
    {word:'power',meaning:'力量',difficulty:1},{word:'energy',meaning:'能量',difficulty:1},
    {word:'ritual',meaning:'仪式',difficulty:2},{word:'sacred',meaning:'神圣的',difficulty:2},
    {word:'divine',meaning:'神圣的',difficulty:2},{word:'cosmic',meaning:'宇宙的',difficulty:3},
    {word:'eternal',meaning:'永恒的',difficulty:2},{word:'celestial',meaning:'天体的',difficulty:3},
    {word:'forest',meaning:'森林',difficulty:1},{word:'village',meaning:'村庄',difficulty:1},
    {word:'traveler',meaning:'旅行者',difficulty:1},{word:'merchant',meaning:'商人',difficulty:1},
    {word:'knight',meaning:'骑士',difficulty:1},{word:'noble',meaning:'贵族',difficulty:1},
    {word:'scholar',meaning:'学者',difficulty:1},{word:'student',meaning:'学生',difficulty:1},
    {word:'healing',meaning:'治疗',difficulty:1},{word:'remedy',meaning:'治疗',difficulty:2},
    {word:'cure',meaning:'治愈',difficulty:1},{word:'restore',meaning:'恢复',difficulty:1},
    {word:'protect',meaning:'保护',difficulty:1},{word:'shield',meaning:'盾牌',difficulty:1},
    {word:'defend',meaning:'防御',difficulty:1},{word:'guard',meaning:'守卫',difficulty:1},
    {word:'fortune',meaning:'运气',difficulty:1},{word:'lucky',meaning:'幸运的',difficulty:1},
    {word:'chance',meaning:'机会',difficulty:1},{word:'fate',meaning:'命运',difficulty:1},
    {word:'predict',meaning:'预测',difficulty:1},{word:'future',meaning:'未来',difficulty:1},
    {word:'vision',meaning:'视野',difficulty:1},{word:'dream',meaning:'梦想',difficulty:1},
    {word:'memory',meaning:'记忆',difficulty:1},{word:'recall',meaning:'回忆',difficulty:2},
    {word:'forget',meaning:'忘记',difficulty:1},{word:'remember',meaning:'记得',difficulty:1},
    {word:'strong',meaning:'强壮的',difficulty:1},{word:'strength',meaning:'力气',difficulty:1},
    {word:'weak',meaning:'虚弱的',difficulty:1},{word:'courage',meaning:'勇气',difficulty:1},
    {word:'brave',meaning:'勇敢的',difficulty:1},{word:'fear',meaning:'恐惧',difficulty:1},
    {word:'calm',meaning:'平静',difficulty:1},{word:'peace',meaning:'和平',difficulty:1},
    {word:'sleep',meaning:'睡眠',difficulty:1},{word:'rest',meaning:'休息',difficulty:1},
    {word:'awake',meaning:'醒来',difficulty:1},{word:'tired',meaning:'疲倦的',difficulty:1},
    {word:'vanish',meaning:'消失',difficulty:2},{word:'invisible',meaning:'看不见的',difficulty:2},
    {word:'appear',meaning:'出现',difficulty:1},{word:'disappear',meaning:'消失',difficulty:1},
    {word:'transform',meaning:'转变',difficulty:2},{word:'change',meaning:'改变',difficulty:1},
    {word:'magic',meaning:'魔力',difficulty:1},{word:'spell',meaning:'咒文',difficulty:1},
    {word:'curse',meaning:'诅咒',difficulty:2},{word:'blessing',meaning:'祝福',difficulty:2},
    {word:'gift',meaning:'礼物',difficulty:1},{word:'treasure',meaning:'宝藏',difficulty:1},
    {word:'gold',meaning:'黄金',difficulty:1},{word:'silver',meaning:'银',difficulty:1},
    {word:'copper',meaning:'铜',difficulty:1},{word:'metal',meaning:'金属',difficulty:1},
    {word:'stone',meaning:'石头',difficulty:1},{word:'gem',meaning:'宝石',difficulty:2},
    {word:'diamond',meaning:'钻石',difficulty:1},{word:'ruby',meaning:'红宝石',difficulty:2},
    {word:'emerald',meaning:'翡翠',difficulty:2},{word:'sapphire',meaning:'蓝宝石',difficulty:3},
    {word:'herb',meaning:'草药',difficulty:1},{word:'plant',meaning:'植物',difficulty:1},
    {word:'flower',meaning:'花',difficulty:1},{word:'root',meaning:'根',difficulty:1},
    {word:'leaf',meaning:'叶子',difficulty:1},{word:'seed',meaning:'种子',difficulty:1},
    {word:'water',meaning:'水',difficulty:1},{word:'fire',meaning:'火',difficulty:1},
    {word:'earth',meaning:'土地',difficulty:1},{word:'air',meaning:'空气',difficulty:1},
    {word:'wind',meaning:'风',difficulty:1},{word:'storm',meaning:'暴风雨',difficulty:1},
    {word:'rain',meaning:'雨',difficulty:1},{word:'snow',meaning:'雪',difficulty:1},
    {word:'sun',meaning:'太阳',difficulty:1},{word:'light',meaning:'光',difficulty:1},
    {word:'dark',meaning:'黑暗',difficulty:1},{word:'night',meaning:'夜晚',difficulty:1},
    {word:'day',meaning:'白天',difficulty:1},{word:'dawn',meaning:'黎明',difficulty:2},
    {word:'dusk',meaning:'黄昏',difficulty:2},{word:'twilight',meaning:'暮光',difficulty:3},
    {word:'time',meaning:'时间',difficulty:1},{word:'hour',meaning:'小时',difficulty:1},
    {word:'minute',meaning:'分钟',difficulty:1},{word:'second',meaning:'秒',difficulty:1},
    {word:'moment',meaning:'时刻',difficulty:1},{word:'instant',meaning:'瞬间',difficulty:2},
    {word:'eternal',meaning:'永久的',difficulty:2},{word:'forever',meaning:'永远',difficulty:1},
    {word:'ancient',meaning:'远古的',difficulty:2},{word:'old',meaning:'老的',difficulty:1},
    {word:'young',meaning:'年轻的',difficulty:1},{word:'new',meaning:'新的',difficulty:1},
    {word:'fresh',meaning:'新鲜的',difficulty:1},{word:'stale',meaning:'陈旧的',difficulty:2},
    {word:'pure',meaning:'纯净的',difficulty:1},{word:'clean',meaning:'干净的',difficulty:1},
    {word:'dirty',meaning:'脏的',difficulty:1},{word:'poison',meaning:'毒药',difficulty:1},
    {word:'toxic',meaning:'有毒的',difficulty:2},{word:'danger',meaning:'危险',difficulty:1},
    {word:'safe',meaning:'安全的',difficulty:1},{word:'risk',meaning:'风险',difficulty:1},
    {word:'caution',meaning:'小心',difficulty:2},{word:'careful',meaning:'仔细的',difficulty:1},
    {word:'secret',meaning:'秘密',difficulty:1},{word:'hidden',meaning:'隐藏的',difficulty:1},
    {word:'reveal',meaning:'揭示',difficulty:2},{word:'show',meaning:'展示',difficulty:1},
    {word:'hide',meaning:'隐藏',difficulty:1},{word:'seek',meaning:'寻找',difficulty:1},
    {word:'find',meaning:'发现',difficulty:1},{word:'search',meaning:'搜索',difficulty:1},
    {word:'discover',meaning:'发现',difficulty:1},{word:'explore',meaning:'探索',difficulty:1},
    {word:'journey',meaning:'旅程',difficulty:1},{word:'path',meaning:'路径',difficulty:1},
    {word:'road',meaning:'道路',difficulty:1},{word:'way',meaning:'方式',difficulty:1},
    {word:'guide',meaning:'向导',difficulty:1},{word:'lead',meaning:'带领',difficulty:1},
    {word:'follow',meaning:'跟随',difficulty:1},{word:'trust',meaning:'信任',difficulty:1},
    {word:'believe',meaning:'相信',difficulty:1},{word:'doubt',meaning:'怀疑',difficulty:1},
    {word:'hope',meaning:'希望',difficulty:1},{word:'wish',meaning:'愿望',difficulty:1},
    {word:'desire',meaning:'渴望',difficulty:2},{word:'want',meaning:'想要',difficulty:1},
    {word:'need',meaning:'需要',difficulty:1},{word:'require',meaning:'要求',difficulty:2}
  ];

  /* ─── 初始化：异步加载JSON词库 ─── */
  async function init() {
    try {
      if (typeof globalThis !== 'undefined' && Array.isArray(globalThis.__WORD_BANK_JSON__)) {
        _words = globalThis.__WORD_BANK_JSON__.length > 0 ? globalThis.__WORD_BANK_JSON__ : FALLBACK_WORDS;
        _loaded = true;
        console.log(`✅ 词库加载成功：${_words.length} 个单词`);
        return;
      }

      const response = await fetch('js/words-cet.json');
      if (!response.ok) throw new Error('词库加载失败');
      const data = await response.json();
      _words = data.length > 0 ? data : FALLBACK_WORDS;
      _loaded = true;
      console.log(`✅ 词库加载成功：${_words.length} 个单词`);
    } catch (error) {
      console.warn('⚠️ 外部词库加载失败，使用内置词库', error);
      _words = FALLBACK_WORDS;
      _loaded = true;
    }
  }

  /* ─── 等待词库加载完成 ─── */
  function waitForLoad() {
    return new Promise(resolve => {
      if (_loaded) {
        resolve();
      } else {
        const check = setInterval(() => {
          if (_loaded) {
            clearInterval(check);
            resolve();
          }
        }, 50);
      }
    });
  }

  /* ─── 获取随机单词 ─── */
  function getRandomWords(count, options = {}) {
    const minDifficulty = Math.max(1, options.minDifficulty || 1);

    if (!_loaded || _words.length === 0) {
      console.warn('词库未加载，使用备用词');
      return _pickRandomWords(FALLBACK_WORDS, count, minDifficulty, 3);
    }

    // 根据当前游戏阶段选择合适难度
    const phase = typeof State !== 'undefined' ? State.phase : 0;
    let maxDifficulty = Math.max(minDifficulty, Math.min(3, Math.floor(phase / 2) + 1));
    
    return _pickRandomWords(_words, count, minDifficulty, maxDifficulty);
  }

  function _pickRandomWords(source, count, minDifficulty, maxDifficulty) {
    // 高价订单优先抽更难词；若词库不足，再放宽为阶段内可用词。
    let available = source.filter(w => w.difficulty >= minDifficulty && w.difficulty <= maxDifficulty);
    if (available.length === 0) available = source.filter(w => w.difficulty <= maxDifficulty);
    if (available.length === 0) return source.slice(0, count);

    // 如果可用词数量不足，放宽到所有难度
    if (available.length < count * 2) {
      available = source;
    }

    // 打乱可用词库顺序
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    
    // 从打乱后的词库中取前 count 个不重复的词
    const result = [];
    const used = new Set();
    
    for (let i = 0; i < shuffled.length && result.length < count; i++) {
      const word = shuffled[i];
      if (!used.has(word.word)) {
        used.add(word.word);
        result.push({ ...word });
      }
    }
    
    // 如果还是不够，从原词库随机补充（可能会重复，但确保数量）
    while (result.length < count) {
      const word = available[Math.floor(Math.random() * available.length)];
      result.push({ ...word });
    }
    
    return result;
  }

  /* ─── PUBLIC API ─── */
  return { init, waitForLoad, getRandomWords };
})();

// 自动初始化词库
WordBank.init();
