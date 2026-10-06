/**
 * @typedef {Object} SiteItem
 * @property {string} id - 唯一标识
 * @property {string} name - 网站名称
 * @property {string} url - 网站链接（未确定链接的项目使用 "URL_PLACEHOLDER"）
 * @property {string} [icon] - 可选：本地图标文件名（如 "github.svg"）或完整图片 URL
 */

/**
 * 默认初始网站列表（无固定分类，统一展示在同一个快捷网格中）
 * 用户在页面上进行的添加、编辑、删除操作会自动保存在浏览器的 localStorage 中。
 *
 * @type {SiteItem[]}
 */
export const initialSites = [
  {
    id: "peach-island",
    name: "桃花浮岛",
    url: "URL_PLACEHOLDER",
    icon: "peach-island.svg",
  },
  {
    id: "lets-decide",
    name: "Let's Decide",
    url: "URL_PLACEHOLDER",
    icon: "lets-decide.svg",
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/",
    icon: "github.svg",
  },
  {
    id: "aistudio",
    name: "AI Studio",
    url: "https://aistudio.google.com/",
    icon: "aistudio.svg",
  },
  {
    id: "legal-search",
    name: "Legal Search",
    url: "URL_PLACEHOLDER",
    icon: "legal-search.svg",
  },
  {
    id: "cosmic-constitution",
    name: "Cosmic Constitution",
    url: "URL_PLACEHOLDER",
    icon: "cosmic-constitution.svg",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    icon: "chatgpt.svg",
  },
  {
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com/",
    icon: "gemini.svg",
  },
  {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai/",
    icon: "claude.svg",
  },
  {
    id: "codespaces",
    name: "Codespaces",
    url: "https://github.com/codespaces",
    icon: "codespaces.svg",
  },
  {
    id: "repomix",
    name: "Repomix",
    url: "https://repomix.com/",
    icon: "repomix.svg",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    url: "https://dash.cloudflare.com/",
    icon: "cloudflare.svg",
  },
  {
    id: "vercel",
    name: "Vercel",
    url: "https://vercel.com/",
    icon: "vercel.svg",
  },
  {
    id: "substack",
    name: "Substack",
    url: "https://substack.com/",
    icon: "substack.svg",
  },
  {
    id: "x",
    name: "X",
    url: "https://x.com/",
    icon: "x.svg",
  },
  {
    id: "medium",
    name: "Medium",
    url: "https://medium.com/",
    icon: "medium.svg",
  },
  {
    id: "wordpress",
    name: "WordPress",
    url: "https://wordpress.com/",
    icon: "wordpress.svg",
  },
];

export default initialSites;
