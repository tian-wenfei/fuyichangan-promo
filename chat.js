/* ============================================================
   AI小茯 · 原生 JS 聊天机器人
   移植自原 React 版本（teamData / chatLogic / speech / ChatPanel）
   ============================================================ */

/* ===== 内容数据（源自 teamData.ts） ===== */
const teamInfo = {
  name: '茯忆长安团队',
  description: '本团队跨专业组建，成员涵盖工程造价、电气工程及自动化、土木工程、视觉传达设计、软件技术、旅游管理等多个专业方向，深耕陕南富硒茯茶产业，聚焦传统茯茶人工发花品质不稳、生产效率低、硒含量难管控等行业痛点。团队从实地调研起步，历经多轮技术迭代，自主研发智能化发花设备与数字化管理系统，依托5G物联网、AI视觉识别、红外光谱监测等技术，推动富硒茯茶从传统"经验发花"转向"智能发花"。项目以科技赋能农业、联农带农助力乡村振兴为核心，打造集智能设备研发、租赁运维、技术服务、产业链协同于一体的现代农业解决方案，同时结合产品溯源搭载公益寻亲功能，兼顾产业价值与社会价值。团队已斩获多项专利、软件著作权，落地多个试点并实现规模化增收，是深耕现代农业与食品科技领域的大学生创业团队。',
  vision: '成为富硒茯茶产业智能化升级先行者，打造可复制、可推广的农业科技赋能范本，引领茶产业数字化、智能化转型。',
  mission: '以科创技术改造传统制茶工艺，用智能装备与专业服务降低茶农、中小茶企技术应用门槛，提质增效、助农增收，推动陕南富硒茶产业高质量发展，助力乡村全面振兴。',
  members: [
    { name: '朱晨雨', role: '创始人/项目负责人', bio: '工程造价专业，带队开展茶乡调研，定位产业核心痛点，统筹项目整体规划与落地推进', expertise: ['项目管理', '产业规划', '团队统筹'] },
    { name: '王奕裴', role: '参数调控', bio: '茶学专业，负责金花培育、发花工艺参数调试与茶叶品质检测工作。', expertise: ['金花培育', '参数调控', '品质检测'] },
    { name: '贾博涵', role: '核心技术成员', bio: '土木工程专业，负责设备研发、模块化结构设计与结构优化', expertise: ['设备研发', '结构设计', '技术优化'] },
    { name: '李青清', role: '品牌设计成员', bio: '视觉传达设计专业，负责品牌视觉设计、产品包装策划与文化挖掘', expertise: ['品牌设计', '包装策划', '文化挖掘'] },
    { name: '冯毅', role: '财务负责人', bio: '工程造价专业，负责项目财务管理、成本核算与资金效能优化', expertise: ['财务管理', '成本核算', '资金优化'] },
    { name: '田文飞', role: '系统开发成员', bio: '软件技术专业，负责数字化系统开发、功能优化及后期技术支持', expertise: ['系统开发', '功能优化', '技术支持'] },
    { name: '杨晨曦', role: '运营推广成员', bio: '视觉传达设计专业，负责新媒体运营、品牌宣传与内容推广', expertise: ['新媒体运营', '品牌宣传', '内容推广'] },
    { name: '李思涵', role: '财务分析成员', bio: '土木工程专业，负责财务数据分析，为项目决策提供数据支撑', expertise: ['财务分析', '数据决策', '数据分析'] }
  ],
  /* 指导老师名单，与 README.md「指导老师」一行保持一致 */
  advisors: ['李华君', '王云鹤', '靳谐美', '李万华', '宁国良', '时春喜'],
  projects: [
    /* 注意：下方「能耗下降24%」是陕南试点场景的实测值，与 projectFacts.values 中
       面向全产业的「能耗降低12%」（同 index.html #value 板块）口径不同，两者并存不冲突，
       改动时请勿互相覆盖 */
    { name: '智能化发花装置2.0', description: '依托5G物联网、AI视觉识别、红外光谱监测、磁耦联自动清洁等技术，搭建"智能硬件+云平台"一体化系统，实时调控温湿度、监测金花生长与硒元素含量；搭载AI分拣系统，自动分级、二次回料，产品发花合格率达98%。设备落地陕南平利县、紫阳县等多个茶乡试点，试点场景实测：发酵周期缩短18%、能耗下降24%、分拣效率提升5倍，硒元素含量稳定性提升32个百分点。', tags: ['现代农业', '智能装备', '物联网', 'AI视觉', '富硒茯茶'] },
    { name: '茶叶梯级利用与处置一体化系统', description: '基于视觉识别技术实现茶叶智能分级，区分特级、一级、二级、茶末、茶渣等品类并匹配不同应用方向，做到原料梯级利用、物尽其用，减少原料损耗。单试点年减少茶叶损耗1.2吨，直接增收近15万元。', tags: ['AI识别', '智能分拣', '资源梯级利用', '数字化管理'] },
    { name: '富硒茯茶全流程溯源系统', description: '结合区块链技术，消费者扫码可查询茶叶从种植、加工到成品的全流程数据；同步搭载公益寻亲板块，依托产品流量助力公益。', tags: ['产品溯源', '区块链', '公益赋能', '品牌数字化'] }
  ],
  contact: {
    email: '948979226@qq.com',
    phone: '+86 15091730188',
    website: 'https://fuyichangan.netlify.app/',
    location: '陕西省渭南市临渭区向阳路街道办事处文昌阁社区'
  }
};

const greetingMessages = [
  '您好！我是 AI小茯，很高兴为您介绍茯忆长安团队~ 请问您想了解哪方面的信息呢？',
  'Hi~ 我是 AI小茯，来自茯忆长安团队！有什么我可以帮您解答的吗？',
  '您好呀！我是 AI小茯，可以问我团队、产品、技术、工艺、成效等方面的问题~',
  '欢迎~ 我是 AI小茯，茯忆长安的智能问答助手，随时为您服务。',
  '您好，我是 AI小茯！想了解智能发花设备、团队成员还是项目成效？'
];

/* 与落地页保持一致的客观事实（供问答复用） */
const projectFacts = {
  tech: [
    'AI 视觉识别系统，分级精度超 98%',
    '红外光谱模块，实时监测硒含量与发酵状态',
    '5G 物联网监测大屏，远程实时监控',
    '茶叶梯级利用与处置一体化系统',
    '「四管」服务模式：管技术 + 管质量 + 管维修 + 管文创'
  ],
  process: [
    '原料筛分：精选陕南富硒毛茶原料，去除杂质',
    '汽蒸渥堆：高温汽蒸软化茶叶，促进微生物初步发酵',
    '压制定型：蒸压成砖，规整成型',
    '发花 · 金花（核心）：智能控温控湿，AI 视觉监测金花密度，红外光谱监测硒含量',
    '干燥成砖：低温慢烘定型，锁住茶香'
  ],
  stats: [
    { value: '98.6%', label: '发花成功率' },
    { value: '55%', label: '茶叶利用效率提升' },
    { value: '3.2 万元', label: '户均年增收' },
    { value: '121 个', label: '就业岗位创造' }
  ],
  rural: '项目以科技赋能农业、联农带农助力乡村振兴，已帮助汉中市西乡镇 15 户农户年均增收 3.2 万元，发花成功率提至 98.6%，较传统方式提高 32 个百分点。',
  welfare: '团队在产品溯源中搭载公益寻亲板块，依托产品流量助力公益，失踪儿童信息来源于公安部儿童失踪信息紧急发布平台。',

  /* 以下内容与落地页 index.html 对应板块保持一致 */

  /* #about 传统发花之困 */
  painPoints: [
    '传统茯茶发花依赖经验，成功率仅 60%–70%',
    '手工操作效率低，难以规模化生产',
    '质量监控缺失，产品一致性差',
    '硒含量无法实时监测，营养价值难以保证'
  ],
  /* #about 智能发花之解 */
  solutions: [
    'AI 视觉识别系统，实时监测金花生长状态',
    '红外光谱技术，精准检测硒含量',
    '5G 物联网，远程监控生产过程',
    '智能化控制系统，自动调节温湿度'
  ],
  /* #value 核心价值与创新 */
  values: [
    { title: '技术突破', desc: 'AI 视觉识别精度 ≥98%，结合红外光谱与 5G 物联网，实现富硒茯茶发花过程精准智控，金花密度提升 50%。' },
    { title: '助农增收', desc: '已帮助汉中市西乡镇 15 户农户年均增收 3.2 万元，发花成功率提至 98.6%，较传统方式提高 32 个百分点。' },
    /* 「能耗降低 12%」为全产业口径，与 projects[0] 的试点实测值 24% 并存，见上方注释 */
    { title: '产业升级', desc: '推动茶产业从「经验依赖」向「数据驱动」转型，整体来看茶叶利用效率提升 55%，能耗降低 12%，创造 121 个就业岗位。' }
  ],
  /* Hero / footer / 版权区的项目定位信息 */
  positioning: {
    slogan: '从「经验发花」到「智能发花」的硒望茶机',
    tagline: '富硒茯茶金花智控设备，助农增收新引擎',
    competition: '中国国际大学生创新大赛 · 高教主赛道 · 创意组',
    teamStatus: '参赛团队：茯忆长安（已创业）',
    intro: '致力于成为茶行业智能化革命的重要参与者，以科技创新守护中国茶文化的世界竞争力。'
  },
  /* 研发历程（产品板块） */
  iteration: '智能化发花装置 2.0 历经 3 年、30 余次实践、2 次迭代更新，结合 AI 识别、红外光谱与 5G 物联网，实现富硒茯茶生产的精准控制与数字化管理。',
  /* footer 关注我们 */
  channels: ['抖音（扫码关注官方账号）', '微信小程序', '茶叶追溯系统（扫码查询全流程溯源信息）'],
  /* #missing 公益寻人名单，与落地页滚动卡片一致 */
  missingChildren: [
    { name: '郑泽文', profile: '男 / 12岁', feature: '身高163cm', place: '甘肃兰州榆中县', time: '2025年10月走失' },
    { name: '董苡柔（十月）', profile: '女 / 2.5岁', feature: '穿粉色衣服', place: '山西运城芮城县', time: '2024年8月走失' },
    { name: '王宇泽', profile: '男 / 13岁', feature: '身高1.6米', place: '陕西西安未央区', time: '2024年6月走失' },
    { name: '周依星', profile: '女 / 11岁', feature: '身高1.52米', place: '湖南娄底市', time: '2024年6月走失' },
    { name: '韩广灵', profile: '女 / 12岁', feature: '身高150cm', place: '吉林松原市', time: '2024年1月走失' },
    { name: '任寅赫', profile: '男 / 13岁', feature: '身高150cm', place: '河南许昌市', time: '2023年11月走失' },
    { name: '赵麒桦', profile: '男 / 8岁', feature: '身高135cm', place: '海南海口市', time: '2023年7月走失' },
    { name: '余乐', profile: '男 / 13岁', feature: '穿红色校服', place: '云南宣威市', time: '2023年6月走失' }
  ]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* 问答意图表（按「具体在前」排序，避免误匹配） */
const INTENTS = [
  { id: 'greeting', patterns: [/你好/, /您好/, /嗨/, /哈喽/, /hello/, /hi/, /在吗/], reply: () => pick(greetingMessages) },
  { id: 'thanks', patterns: [/谢谢/, /感谢/, /辛苦了/, /多谢/], reply: () => pick(['不客气！很高兴能为您介绍茯忆长安团队~', '别客气，随时找我~', '不客气，希望能帮到您！']) },
  /* /怎么用/ 收窄为「怎么用你」，否则会截走「溯源系统怎么用」这类内容型提问 */
  { id: 'help', patterns: [/你能做什么/, /帮助/, /会什么/, /功能/, /怎么用你/, /你怎么用/, /如何使用你/], reply:'我可以为您介绍：团队与成员、指导老师、行业痛点、智能发花设备、核心技术、发花工艺、核心价值、项目成效、助农、公益寻人、溯源与关注渠道、联系方式等。您想了解哪方面？' },
  { id: 'who', patterns: [/你是谁/, /你叫什么/, /自我介绍/, /小茯/], reply: '我是 AI小茯，茯忆长安团队的智能问答助手~ 我熟悉我们的团队、产品与技术，随时为您解答！' },
  {
    /* 必须排在 teamName（/叫什么/、/名字/）与 members、teamIntro 之前，否则「指导老师叫什么」会被误匹配 */
    id: 'advisors', patterns: [/指导老师/, /指导教师/, /带队老师/, /导师/, /老师/, /教授/],
    reply: () => '我们的指导老师共 ' + teamInfo.advisors.length + ' 位：\n\n' +
      teamInfo.advisors.map(n => '· ' + n).join('\n') +
      '\n\n各位老师在产业调研、工艺研究、设备研发与项目申报等方面为团队提供了全程指导。'
  },
  { id: 'teamName', patterns: [/团队名称/, /叫什么/, /名字/], reply: '我们的团队名称是【茯忆长安】，寓意像茯苓一样温润滋养，又承载着长安的文化底蕴~' },
  { id: 'vision', patterns: [/愿景/, /使命/, /目标/, /理念/], reply: () => '**愿景**：' + teamInfo.vision + '\n\n**使命**：' + teamInfo.mission },
  { id: 'competition', patterns: [/创新大赛/, /互联网\+/, /高教主赛道/, /创意组/, /赛道/, /参赛/, /比赛/, /竞赛/, /挑战杯/], reply: () => '我们参加的是**' + projectFacts.positioning.competition + '**。\n\n' + projectFacts.positioning.teamStatus + '。' },
  { id: 'slogan', patterns: [/口号/, /标语/, /slogan/, /定位/, /硒望/], reply: () => '我们的项目主张是：**' + projectFacts.positioning.slogan + '**。\n\n' + projectFacts.positioning.tagline + '。\n\n' + projectFacts.positioning.intro },
  {
    /* 排在 tech / product 之前，保证「传统发花有什么痛点」不会被技术类意图截走 */
    id: 'painPoints', patterns: [/痛点/, /之困/, /难题/, /瓶颈/, /传统发花/, /传统工艺/, /行业问题/, /什么困难/],
    reply: () => '**传统发花之困**：\n' + projectFacts.painPoints.map(p => '· ' + p).join('\n') +
      '\n\n**智能发花之解**：\n' + projectFacts.solutions.map(s => '· ' + s).join('\n')
  },
  {
    id: 'values', patterns: [/核心价值/, /价值/, /创新/, /优势/, /亮点/],
    reply: () => '我们的核心价值与创新：\n\n' + projectFacts.values.map(v => '**' + v.title + '**\n' + v.desc).join('\n\n')
  },
  {
    /* 必须排在 projects（/项目/）之前，否则「项目成效」会被误判为项目介绍 */
    id: 'stats', patterns: [/成效/, /数据/, /成功率/, /增收/, /岗位/, /效率/, /指标/],
    reply: () => '我们的项目成效：\n\n' + projectFacts.stats.map(s => '· **' + s.value + '** — ' + s.label).join('\n')
  },
  { id: 'rural', patterns: [/助农/, /乡村振兴/, /农户/, /联农/], reply: () => projectFacts.rural },
  {
    id: 'welfare', patterns: [/公益/, /寻人/, /失踪/, /寻亲/, /儿童/, /孩子/],
    reply: () => projectFacts.welfare + '\n\n目前官网「公益寻人」区展示的孩子有：\n\n' +
      projectFacts.missingChildren.map((c, i) => (i + 1) + '. **' + c.name + '** ｜ ' + c.profile + ' ｜ ' + c.feature + '\n   ' + c.place + '，' + c.time).join('\n') +
      '\n\n如有线索，请及时联系当地公安机关。'
  },
  { id: 'trace', patterns: [/溯源/, /追溯/, /区块链/, /扫码/], reply: () => '**' + teamInfo.projects[2].name + '**：\n\n' + teamInfo.projects[2].description },
  { id: 'channels', patterns: [/抖音/, /小程序/, /公众号/, /二维码/, /新媒体/, /关注你们/, /社交媒体/], reply: () => '欢迎通过以下渠道关注我们：\n\n' + projectFacts.channels.map(c => '· ' + c).join('\n') + '\n\n以上二维码都可以在官网页脚「关注我们」处扫码。' },
  { id: 'selenium', patterns: [/富硒/, /硒/], reply: '富硒茯茶的关键在于硒元素含量的稳定可控。我们的红外光谱模块可实时监测发酵过程中茶叶的硒含量与发酵状态，保证营养价值；配合 AI 视觉监测金花生长，实现精准智控。' },
  { id: 'tech', patterns: [/技术/, /ai/, /视觉/, /红外/, /光谱/, /5g/, /物联网/, /识别/], reply: () => '我们的核心技术包括：\n\n' + projectFacts.tech.map((t, i) => (i + 1) + '. ' + t).join('\n') },
  { id: 'process', patterns: [/工艺/, /流程/, /步骤/, /怎么做/, /发花过程/], reply: () => '富硒茯茶发花工艺大致分五步：\n\n' + projectFacts.process.map((s, i) => (i + 1) + '. ' + s).join('\n') },
  { id: 'iteration', patterns: [/迭代/, /历程/, /研发多久/, /研发了多久/, /几代/], reply: () => projectFacts.iteration },
  { id: 'product', patterns: [/设备/, /发花机/, /产品/, /装置/, /机器/], reply: () => '我们的核心产品是**' + teamInfo.projects[0].name + '**：\n\n' + teamInfo.projects[0].description },
  {
    id: 'members', patterns: [/成员/, /创始人/, /都有谁/, /谁负责/],
    reply: () => {
      let r = '我们的核心团队成员有：\n\n';
      teamInfo.members.forEach((m, i) => {
        r += (i + 1) + '. **' + m.name + '** - ' + m.role + '\n';
        r += '   ' + m.bio + '\n';
        r += '   专长：' + m.expertise.join('、') + '\n\n';
      });
      return r;
    }
  },
  {
    id: 'projects', patterns: [/项目/, /作品/, /案例/, /做过什么/],
    reply: () => {
      let r = '我们有几个代表性项目：\n\n';
      teamInfo.projects.forEach((p, i) => {
        r += (i + 1) + '. **' + p.name + '**\n';
        r += '   ' + p.description + '\n';
        r += '   标签：' + p.tags.join('、') + '\n\n';
      });
      return r;
    }
  },
  { id: 'teamIntro', patterns: [/介绍/, /团队/, /业务/, /主营/], reply: () => teamInfo.description + '\n\n我们的使命：' + teamInfo.mission },
  { id: 'contact', patterns: [/联系/, /联系方式/, /地址/, /电话/, /邮箱/], reply: () => '您可以通过以下方式联系我们：\n\n**邮箱**：' + teamInfo.contact.email + '\n**电话**：' + teamInfo.contact.phone + '\n**官网**：' + teamInfo.contact.website + '\n**地址**：' + teamInfo.contact.location }
];

/* ===== 匹配引擎（源自 chatLogic.ts） ===== */
function normalize(input) {
  return input
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[，。！？、：；,.!?;:"'‘’“”()（）\-—·]/g, '');
}

function generateResponse(userMessage) {
  const msg = normalize(userMessage);
  for (const intent of INTENTS) {
    if (intent.patterns.some(p => p.test(msg))) {
      return typeof intent.reply === 'function' ? intent.reply() : intent.reply;
    }
  }
  return '抱歉，我暂时没理解您的问题~ 您可以问我：\n\n· 介绍一下团队 / 团队成员\n· 智能发花设备\n· 核心技术 / 发花工艺\n· 项目成效 / 助农\n· 联系方式';
}

/* ===== 语音识别（源自 speech.ts useSpeechRecognition） ===== */
const recognitionState = { instance: null, instanceId: 0, retryCount: 0 };
const MAX_RETRIES = 2;

function speechSupported() {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

function stopRecognition() {
  const r = recognitionState.instance;
  if (r) {
    try {
      recognitionState.instanceId += 1;
      recognitionState.retryCount = 0;
      r.stop();
    } catch (e) { /* 忽略已停止时的错误 */ }
  }
  recognitionState.instance = null;
}

function startRecognition(onResult, onError, onEnd) {
  stopRecognition();
  if (!speechSupported()) {
    onError('您的浏览器不支持语音识别功能，请使用 Chrome、Edge 或 Safari 浏览器');
    return;
  }
  try {
    createRecognition(onResult, onError, onEnd);
  } catch (e) {
    recognitionState.instance = null;
    onError('无法启动语音识别，请检查麦克风权限');
  }
}

function createRecognition(onResult, onError, onEnd) {
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) {
    onError('语音识别服务不可用，请检查浏览器版本');
    return;
  }

  const recognition = new SpeechRecognitionClass();
  const currentInstanceId = recognitionState.instanceId;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'zh-CN';
  recognition.maxAlternatives = 1;

  let silenceTimer = null;
  const clearSilenceTimer = () => { if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; } };
  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimer = setTimeout(() => {
      if (recognitionState.instanceId === currentInstanceId) {
        stopRecognition();
        onEnd();
      }
    }, 30000);
  };

  recognition.onresult = (event) => {
    if (recognitionState.instanceId !== currentInstanceId) return;
    resetSilenceTimer();

    let finalTranscript = '';
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0] ? event.results[i][0].transcript : '';
      if (event.results[i].isFinal) finalTranscript += transcript;
      else interimTranscript += transcript;
    }
    onResult(finalTranscript + interimTranscript, finalTranscript.length > 0);
  };

  recognition.onerror = (event) => {
    if (recognitionState.instanceId !== currentInstanceId) return;
    clearSilenceTimer();

    if (event.error === 'aborted') return;

    if (event.error === 'network' && recognitionState.retryCount < MAX_RETRIES) {
      recognitionState.retryCount += 1;
      const delay = recognitionState.retryCount * 1000;
      setTimeout(() => {
        if (recognitionState.instanceId === currentInstanceId) {
          try { recognition.start(); }
          catch (e) { onError('语音识别重试失败，请改用文字输入'); }
        }
      }, delay);
      return;
    }

    recognitionState.instance = null;

    let errorMessage = '语音识别失败';
    switch (event.error) {
      case 'not-allowed': errorMessage = '请在浏览器设置中允许麦克风权限'; break;
      case 'no-speech': errorMessage = '未检测到语音输入，请靠近麦克风说话'; break;
      case 'audio-capture': errorMessage = '无法访问麦克风，请检查设备连接'; break;
      case 'network': errorMessage = '语音服务网络连接失败（已重试），建议使用文字输入'; break;
      case 'not-supported': errorMessage = '您的浏览器不支持语音识别'; break;
      default: errorMessage = '语音识别失败: ' + event.error;
    }
    onError(errorMessage);
  };

  recognition.onend = () => {
    if (recognitionState.instanceId !== currentInstanceId) return;
    clearSilenceTimer();
    recognitionState.instance = null;
    onEnd();
  };

  recognition.onstart = () => {
    if (recognitionState.instanceId !== currentInstanceId) return;
    recognitionState.retryCount = 0;
    resetSilenceTimer();
  };

  recognitionState.instance = recognition;
  recognition.start();
}

/* ===== 语音合成（源自 speech.ts useSpeechSynthesis） ===== */
const synthState = { isSpeaking: false, cancel: null };

const SWEET_VOICE_KEYWORDS = [
  'Xiaoxiao', 'Xiaoyi', 'Yaoyao', 'Xiaobei',
  'Tingting', 'Meijia', 'Yunyang', 'Yunxi'
];

function cleanTextForSpeech(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/[*#_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stopSpeaking() {
  if (synthState.cancel) { synthState.cancel(); synthState.cancel = null; }
  if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); }
  synthState.isSpeaking = false;
}

function speak(text, onEnd) {
  stopSpeaking();

  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  const cleanText = cleanTextForSpeech(text);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'zh-CN';
  utterance.rate = 1.05;
  utterance.pitch = 1.4;
  utterance.volume = 1.0;

  let cancelled = false;

  const setVoice = () => {
    if (cancelled) return;
    const voices = window.speechSynthesis.getVoices();
    const zhVoices = voices.filter(v => v.lang.startsWith('zh'));
    let selectedVoice = null;

    for (const keyword of SWEET_VOICE_KEYWORDS) {
      selectedVoice = zhVoices.find(v => v.name.includes(keyword) && !v.localService);
      if (selectedVoice) break;
    }
    if (!selectedVoice) {
      for (const keyword of SWEET_VOICE_KEYWORDS) {
        selectedVoice = zhVoices.find(v => v.name.includes(keyword) && v.localService);
        if (selectedVoice) break;
      }
    }
    if (!selectedVoice) selectedVoice = zhVoices.find(v => !v.localService);
    if (!selectedVoice) selectedVoice = zhVoices.find(v => v.lang.startsWith('zh-CN')) || zhVoices[0];

    if (selectedVoice) utterance.voice = selectedVoice;
  };

  setVoice();
  window.speechSynthesis.onvoiceschanged = () => setVoice();

  utterance.onstart = () => { synthState.isSpeaking = true; };
  utterance.onend = () => {
    synthState.isSpeaking = false;
    window.speechSynthesis.onvoiceschanged = null;
    if (onEnd) onEnd();
  };
  utterance.onerror = (event) => {
    synthState.isSpeaking = false;
    window.speechSynthesis.onvoiceschanged = null;
    if (event.error !== 'interrupted' && !cancelled && onEnd) onEnd();
  };

  synthState.cancel = () => {
    cancelled = true;
    window.speechSynthesis.cancel();
    window.speechSynthesis.onvoiceschanged = null;
    synthState.isSpeaking = false;
  };

  window.speechSynthesis.speak(utterance);
}

/* ===== 聊天 UI 状态机（源自 ChatPanel.tsx） ===== */
const chat = {
  state: 'idle',          // idle | listening | thinking | speaking
  messages: [],
  voiceText: '',
  inputText: '',
  showSuggestions: true,
  initialized: false
};

/* DOM 引用 */
let els = {};

const ICONS = {
  copy: '<svg class="msg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>',
  copyDone: '<svg class="msg-icon msg-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
  speak: '<svg class="msg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  stop: '<svg class="msg-icon" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
  mic: '<svg class="voice-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>',
  micFill: '<svg class="voice-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 19c-2.76 0-5-2.24-5-5V7c0-2.76 2.24-5 5-5s5 2.24 5 5v7c0 2.76-2.24 5-5 5z"/></svg>',
  speaker: '<svg class="voice-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>',
  brain: '<svg class="voice-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>'
};

function headerStatusText(state) {
  switch (state) {
    case 'listening': return '🎤 正在倾听...';
    case 'thinking': return '🧠 正在思考...';
    case 'speaking': return '🔊 正在回答...';
    default: return '💡 点击下方按钮或输入文字开始对话';
  }
}

function bottomStatusText(state) {
  switch (state) {
    case 'listening': return '🎤 正在倾听，请对着麦克风说话...';
    case 'thinking': return '🧠 AI小茯正在思考如何回答您...';
    case 'speaking': return '🔊 AI小茯正在回答，请稍候...';
    default: return '💡 点击上方按钮或输入文字，与AI小茯畅聊';
  }
}

function inputPlaceholder(state) {
  switch (state) {
    case 'listening': return '🎤 语音识别中，请说话...';
    case 'thinking': return '🧠 AI小茯正在思考...';
    case 'speaking': return '🔊 AI小茯正在回答...';
    default: return '输入文字，或点击下方按钮开始语音对话...';
  }
}

function setState(state) {
  chat.state = state;

  if (els.status) els.status.textContent = headerStatusText(state);
  if (els.avatar) els.avatar.classList.toggle('avatar-pulse-listen', state === 'listening');
  if (els.statusText) {
    els.statusText.textContent = bottomStatusText(state);
    els.statusText.className = 'status-text status-text-' + state;
  }
  if (els.input) {
    els.input.placeholder = inputPlaceholder(state);
    els.input.disabled = (state === 'thinking' || state === 'speaking');
  }
  if (els.send) els.send.disabled = !chat.inputText.trim() || (state === 'thinking' || state === 'speaking');
  renderVoiceButton(state);
}

function renderVoiceButton(state) {
  if (!els.voiceBtn) return;
  let html = '';
  if (state === 'idle') {
    html = ICONS.mic + '<span class="voice-btn-label">开始对话</span>';
  } else if (state === 'listening') {
    html = '<div class="mic-listening-icon">' + ICONS.micFill + '<div class="pulse-ring pulse-ring-1"></div><div class="pulse-ring pulse-ring-2"></div></div><span class="voice-btn-label">点击停止</span>';
  } else if (state === 'speaking') {
    html = ICONS.speaker + '<span class="voice-btn-label">停止回答</span>';
  } else {
    html = ICONS.brain + '<span class="voice-btn-label">思考中...</span>';
  }
  els.voiceBtn.innerHTML = html;
  els.voiceBtn.className = 'voice-main-btn voice-main-btn-' + state;
  els.voiceBtn.disabled = (state === 'thinking');
}

function scrollToBottom() {
  if (els.messages) els.messages.scrollTop = els.messages.scrollHeight;
}

function showError(msg) {
  if (!els.errorBanner) return;
  els.errorText.textContent = msg;
  els.errorBanner.style.display = 'flex';
}

function hideError() {
  if (els.errorBanner) els.errorBanner.style.display = 'none';
}

/* 快捷提问 */
const QUICK_QUESTIONS = [
  { icon: '👥', text: '介绍一下团队成员', query: '介绍一下团队成员' },
  { icon: '🚀', text: '团队有哪些项目', query: '你们做过哪些项目' },
  { icon: '🎯', text: '团队的愿景和使命', query: '团队的愿景是什么' },
  { icon: '📞', text: '怎么联系你们', query: '怎么联系你们' }
];

function renderQuickQuestions() {
  if (!els.quickQuestions) return;
  els.quickQuestions.innerHTML = '';
  QUICK_QUESTIONS.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'quick-question-btn';
    btn.innerHTML = '<span class="quick-question-icon">' + q.icon + '</span><span>' + q.text + '</span>';
    btn.addEventListener('click', () => handleSend(q.query));
    els.quickQuestions.appendChild(btn);
  });
}

/* 思考中动画气泡 */
function createThinkingElement() {
  const wrapper = document.createElement('div');
  wrapper.className = 'thinking-wrapper';
  wrapper.innerHTML = '<div class="thinking-avatar">🍃</div>' +
    '<div class="thinking-bubble"><div class="thinking-dots">' +
    '<span class="dot" style="animation-delay:0ms"></span>' +
    '<span class="dot" style="animation-delay:0.2s"></span>' +
    '<span class="dot" style="animation-delay:0.4s"></span>' +
    '</div></div>';
  return wrapper;
}

/* 语音实时预览气泡 */
function createVoicePreviewElement() {
  const wrapper = document.createElement('div');
  wrapper.className = 'voice-preview-wrapper';
  wrapper.innerHTML = '<div class="voice-preview-bubble">' +
    '<span class="voice-wave-icon">' +
    '<span class="wave-bar" style="animation-delay:0s"></span>' +
    '<span class="wave-bar" style="animation-delay:0.1s"></span>' +
    '<span class="wave-bar" style="animation-delay:0.2s"></span>' +
    '<span class="wave-bar" style="animation-delay:0.3s"></span>' +
    '<span class="wave-bar" style="animation-delay:0.4s"></span>' +
    '</span><p class="voice-preview-text"></p></div>' +
    '<div class="voice-preview-avatar">👤</div>';
  return wrapper;
}

let thinkingEl = null;
let voicePreviewEl = null;

function setThinking(show) {
  if (show) {
    if (!thinkingEl) thinkingEl = createThinkingElement();
    if (thinkingEl.parentNode !== els.messagesContainer) els.messagesContainer.appendChild(thinkingEl);
  } else if (thinkingEl && thinkingEl.parentNode) {
    thinkingEl.parentNode.removeChild(thinkingEl);
  }
  scrollToBottom();
}

function setVoicePreview(show, text) {
  if (show) {
    if (!voicePreviewEl) voicePreviewEl = createVoicePreviewElement();
    voicePreviewEl.querySelector('.voice-preview-text').textContent = text;
    if (voicePreviewEl.parentNode !== els.messagesContainer) els.messagesContainer.appendChild(voicePreviewEl);
  } else if (voicePreviewEl && voicePreviewEl.parentNode) {
    voicePreviewEl.parentNode.removeChild(voicePreviewEl);
  }
  scrollToBottom();
}

function copyMessage(msg, btn) {
  const done = () => {
    btn.innerHTML = ICONS.copyDone;
    btn.classList.add('msg-action-active');
    setTimeout(() => {
      btn.innerHTML = ICONS.copy;
      btn.classList.remove('msg-action-active');
    }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(msg.content).then(done).catch(() => legacyCopy(msg.content, done));
  } else {
    legacyCopy(msg.content, done);
  }
}

function legacyCopy(text, done) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try { document.execCommand('copy'); } catch (e) { /* ignore */ }
  document.body.removeChild(textarea);
  done();
}

function toggleSpeakMessage(msg, btn) {
  if (btn.dataset.speaking === '1') {
    stopSpeaking();
    btn.dataset.speaking = '';
    btn.innerHTML = ICONS.speak;
    btn.classList.remove('msg-action-active', 'msg-action-speaking');
    return;
  }
  btn.dataset.speaking = '1';
  btn.innerHTML = ICONS.stop;
  btn.classList.add('msg-action-active', 'msg-action-speaking');
  speak(msg.content, () => {
    btn.dataset.speaking = '';
    btn.innerHTML = ICONS.speak;
    btn.classList.remove('msg-action-active', 'msg-action-speaking');
  });
}

function addMessage(sender, content) {
  const msg = { id: Date.now() + '', content, sender, timestamp: new Date() };
  chat.messages.push(msg);

  const isUser = sender === 'user';
  const row = document.createElement('div');
  row.className = 'msg-row ' + (isUser ? 'msg-row-user' : 'msg-row-bot');

  const wrapper = document.createElement('div');
  wrapper.className = 'msg-wrapper ' + (isUser ? 'msg-wrapper-user' : 'msg-wrapper-bot');

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar ' + (isUser ? 'msg-avatar-user' : 'msg-avatar-bot');
  avatar.textContent = isUser ? '👤' : '🍃';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble ' + (isUser ? 'msg-bubble-user' : 'msg-bubble-bot');

  const text = document.createElement('p');
  text.className = 'msg-text';
  text.textContent = content;

  const footer = document.createElement('div');
  footer.className = 'msg-footer ' + (isUser ? 'msg-footer-user' : 'msg-footer-bot');

  const time = document.createElement('span');
  time.className = 'msg-time';
  time.textContent = msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  const actions = document.createElement('div');
  actions.className = 'msg-actions';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'msg-action-btn';
  copyBtn.title = '复制消息';
  copyBtn.innerHTML = ICONS.copy;
  copyBtn.addEventListener('click', () => copyMessage(msg, copyBtn));
  actions.appendChild(copyBtn);

  if (!isUser) {
    const speakBtn = document.createElement('button');
    speakBtn.className = 'msg-action-btn';
    speakBtn.title = '语音朗读';
    speakBtn.innerHTML = ICONS.speak;
    speakBtn.addEventListener('click', () => toggleSpeakMessage(msg, speakBtn));
    actions.appendChild(speakBtn);
  }

  footer.appendChild(time);
  footer.appendChild(actions);
  bubble.appendChild(text);
  bubble.appendChild(footer);
  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  row.appendChild(wrapper);

  els.messagesContainer.appendChild(row);
  scrollToBottom();
}

/* 发送消息 */
async function handleSend(content) {
  if (chat.state === 'thinking' || chat.state === 'speaking') return;

  stopRecognition();
  stopSpeaking();

  setState('thinking');
  chat.inputText = '';
  if (els.input) els.input.value = '';
  chat.voiceText = '';
  chat.showSuggestions = false;
  hideError();
  if (els.quickQuestions) els.quickQuestions.style.display = 'none';
  setThinking(true);
  setVoicePreview(false, '');

  addMessage('user', content);

  const thinkingTime = 600 + Math.random() * 800;
  await new Promise(resolve => setTimeout(resolve, thinkingTime));

  setThinking(false);
  const botResponse = generateResponse(content);
  addMessage('bot', botResponse);
  setState('speaking');

  speak(botResponse, () => {
    setState('listening');
    startVoiceListening();
  });
}

/* 语音识别结果回调 */
function handleVoiceResult(text, isFinal) {
  setVoicePreview(true, text);
  chat.voiceText = text;

  if (isFinal && text.trim()) {
    const finalText = text.trim();
    setTimeout(() => handleSend(finalText), 300);
  }
}

/* 开始语音监听 */
function startVoiceListening() {
  if (chat.state === 'thinking' || chat.state === 'speaking') return;

  setState('listening');
  hideError();
  chat.voiceText = '';
  setVoicePreview(false, '');

  startRecognition(
    handleVoiceResult,
    (error) => {
      showError(error);
      setState('idle');
      setTimeout(hideError, 5000);
    },
    () => {
      if (chat.state === 'listening') {
        setState('idle');
      }
    }
  );
}

/* 停止语音监听 */
function stopVoiceListening() {
  stopRecognition();
  stopSpeaking();
  setState('idle');
  chat.voiceText = '';
  setVoicePreview(false, '');
}

/* 切换对话状态（语音大按钮） */
function toggleChat() {
  if (chat.state === 'idle') {
    startVoiceListening();
  } else {
    stopVoiceListening();
  }
}

/* 初始化 */
function initChat() {
  if (chat.initialized) return;
  chat.initialized = true;

  els = {
    status: document.getElementById('chatStatus'),
    avatar: document.getElementById('chatAvatar'),
    statusText: document.getElementById('chatStatusText'),
    input: document.getElementById('chatInput'),
    send: document.getElementById('chatSend'),
    voiceBtn: document.getElementById('chatVoiceBtn'),
    messages: document.getElementById('chatMessages'),
    messagesContainer: document.getElementById('chatMessagesContainer'),
    quickQuestions: document.getElementById('chatQuickQuestions'),
    errorBanner: document.getElementById('chatErrorBanner'),
    errorText: document.getElementById('chatErrorText'),
    errorClose: document.getElementById('chatErrorClose')
  };

  if (els.errorClose) els.errorClose.addEventListener('click', hideError);
  if (els.send) els.send.addEventListener('click', () => {
    if (chat.inputText.trim()) handleSend(chat.inputText.trim());
  });
  if (els.input) {
    els.input.addEventListener('input', (e) => {
      chat.inputText = e.target.value;
      if (els.send) els.send.disabled = !chat.inputText.trim() || chat.state === 'thinking' || chat.state === 'speaking';
    });
    els.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && chat.inputText.trim()) {
        e.preventDefault();
        handleSend(chat.inputText.trim());
      }
    });
  }
  if (els.voiceBtn) els.voiceBtn.addEventListener('click', toggleChat);

  renderQuickQuestions();
  addMessage('bot', pick(greetingMessages));
  setState('idle');
}

/* 面板打开时初始化（懒加载） */
document.addEventListener('DOMContentLoaded', () => {
  const aiFab = document.getElementById('aiFab');
  if (aiFab) {
    aiFab.addEventListener('click', initChat);
  }
});
