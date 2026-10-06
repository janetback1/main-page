/**
 * @typedef {Object} SiteItem
 * @property {string} name - 网站名称
 * @property {string} url - 网站链接（未确定链接的项目使用 "URL_PLACEHOLDER" 标记）
 * @property {string} category - 所属分类（需与 categories.js 中的分类名称对应）
 * @property {string} [description] - 可选的简短说明
 * @property {string} [icon] - 图标文件名（对应 src/assets/icons/ 目录下的 SVG 文件）
 */

/**
 * 统一网站导航数据源
 * ----------------------------------------------------------------------------
 * 维护说明：
 * 1. 新增、删除、修改网站时，只需编辑下方的 sites 数组。
 * 2. 带有 "URL_PLACEHOLDER" 的项目表示尚未配置具体网址，请直接替换为实际 URL（如 "https://..."）。
 * 3. icon 字段填写 src/assets/icons/ 下的文件名（如 "github.svg"）；若留空或文件不存在，页面会自动显示文字缩写图标。
 *
 * @type {SiteItem[]}
 */
export const sites = [
  // ==========================================
  // 1. 我的项目 (TODO: 请将 URL_PLACEHOLDER 替换为实际项目地址)
  // ==========================================
  {
    name: "桃花浮岛",
    url: "URL_PLACEHOLDER", // TODO: 替换为桃花浮岛实际网址
    category: "我的项目",
    description: "个人创意与数字花园项目",
    icon: "peach-island.svg",
  },
  {
    name: "Let's Decide",
    url: "URL_PLACEHOLDER", // TODO: 替换为 Let's Decide 实际网址
    category: "我的项目",
    description: "决策辅助与协作工具",
    icon: "lets-decide.svg",
  },
  {
    name: "Legal Search",
    url: "URL_PLACEHOLDER", // TODO: 替换为 Legal Search 实际网址
    category: "我的项目",
    description: "法律检索与智能分析系统",
    icon: "legal-search.svg",
  },
  {
    name: "Cosmic Constitution",
    url: "URL_PLACEHOLDER", // TODO: 替换为 Cosmic Constitution 实际网址
    category: "我的项目",
    description: "宇宙宪章与跨学科思想实验",
    icon: "cosmic-constitution.svg",
  },

  // ==========================================
  // 2. AI
  // ==========================================
  {
    name: "Google AI Studio",
    url: "https://aistudio.google.com/",
    category: "AI",
    description: "Gemini 模型开发与调试工作台",
    icon: "aistudio.svg",
  },
  {
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    category: "AI",
    description: "OpenAI 对话与推理助手",
    icon: "chatgpt.svg",
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com/",
    category: "AI",
    description: "Google 多模态 AI 助手",
    icon: "gemini.svg",
  },
  {
    name: "Claude",
    url: "https://claude.ai/",
    category: "AI",
    description: "Anthropic 写作与代码分析助手",
    icon: "claude.svg",
  },

  // ==========================================
  // 3. 开发工具
  // ==========================================
  {
    name: "GitHub",
    url: "https://github.com/",
    category: "开发工具",
    description: "代码托管与开源项目协作",
    icon: "github.svg",
  },
  {
    name: "GitHub Codespaces",
    url: "https://github.com/codespaces",
    category: "开发工具",
    description: "云端开发环境与在线编辑器",
    icon: "codespaces.svg",
  },
  {
    name: "Repomix",
    url: "https://repomix.com/",
    category: "开发工具",
    description: "代码仓库打包与 AI 上下文生成",
    icon: "repomix.svg",
  },
  {
    name: "Cloudflare",
    url: "https://dash.cloudflare.com/",
    category: "开发工具",
    description: "域名解析、CDN 与边缘计算",
    icon: "cloudflare.svg",
  },
  {
    name: "Vercel",
    url: "https://vercel.com/",
    category: "开发工具",
    description: "前端项目构建与全球部署平台",
    icon: "vercel.svg",
  },

  // ==========================================
  // 4. 写作与发布
  // ==========================================
  {
    name: "Substack",
    url: "https://substack.com/",
    category: "写作与发布",
    description: "独立专栏与邮件通讯发布",
    icon: "substack.svg",
  },
  {
    name: "X",
    url: "https://x.com/",
    category: "写作与发布",
    description: "实时资讯与公共讨论广场",
    icon: "x.svg",
  },
  {
    name: "Medium",
    url: "https://medium.com/",
    category: "写作与发布",
    description: "深度文章阅读与创作社区",
    icon: "medium.svg",
  },
  {
    name: "WordPress",
    url: "https://wordpress.com/",
    category: "写作与发布",
    description: "博客站点管理与内容发布",
    icon: "wordpress.svg",
  },

  // ==========================================
  // 5. 法律 (TODO: 请将 URL_PLACEHOLDER 替换为常用具体网址)
  // ==========================================
  {
    name: "中国法律资源",
    url: "URL_PLACEHOLDER", // TODO: 替换为常用中国法律法规检索网址
    category: "法律",
    description: "法律法规、司法解释与裁判文书",
    icon: "law-cn.svg",
  },
  {
    name: "美国法律资源",
    url: "URL_PLACEHOLDER", // TODO: 替换为常用美国联邦/州法律与判例网址
    category: "法律",
    description: "联邦法典、最高法院判例与法学评论",
    icon: "law-us.svg",
  },
  {
    name: "法律数据库",
    url: "URL_PLACEHOLDER", // TODO: 替换为常用专业法律数据库网址
    category: "法律",
    description: "综合法规库与比较法文献检索",
    icon: "law-db.svg",
  },
  {
    name: "法律研究工具",
    url: "URL_PLACEHOLDER", // TODO: 替换为常用法律研究与引注工具网址
    category: "法律",
    description: "法条比对、判例追踪与文献管理",
    icon: "law-research.svg",
  },

  // ==========================================
  // 6. 海洋与工程 (TODO: 请将 URL_PLACEHOLDER 替换为常用具体网址)
  // ==========================================
  {
    name: "海洋工程资源",
    url: "URL_PLACEHOLDER", // TODO: 替换为常用海洋工程规范与文献网址
    category: "海洋与工程",
    description: "海工结构、流体力学与规范标准",
    icon: "ocean-eng.svg",
  },
  {
    name: "船舶设计资源",
    url: "URL_PLACEHOLDER", // TODO: 替换为常用船舶设计与船级社规范网址
    category: "海洋与工程",
    description: "船体线型、静水力计算与船级社规范",
    icon: "ship-design.svg",
  },
  {
    name: "开源工程项目",
    url: "URL_PLACEHOLDER", // TODO: 替换为常用开源仿真与工程计算项目网址
    category: "海洋与工程",
    description: "数值仿真、CAD 工具与工程代码库",
    icon: "open-eng.svg",
  },
  {
    name: "海洋数据资源",
    url: "URL_PLACEHOLDER", // TODO: 替换为常用海洋气象、水文与波浪数据网址
    category: "海洋与工程",
    description: "全球海况、水深地形与气象观测数据",
    icon: "ocean-data.svg",
  },
];

export default sites;
