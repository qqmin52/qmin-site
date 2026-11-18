# Qmin 官网

Qmin（简Q）的官网，纯静态：一个 `index.html` + 一份 CSS + 一个几十行的 JS，没有框架、没有 CDN、没有外部字体。

## 结构

```
index.html            首页（单页）
404.html              自定义 404
assets/style.css      全部样式（含暗色模式）
assets/main.js        复制、进场动画、导航高亮
assets/favicon.svg    图标
robots.txt
.nojekyll             跳过 Jekyll，原样发布
```

## 本地预览

直接双击 `index.html` 就能看；或者起一个静态服务器（推荐，路径行为更接近线上）：

```bash
python -m http.server 8080
# 打开 http://127.0.0.1:8080
```

## 部署

仓库已启用 GitHub Pages，分支 `main`、目录 `/`。推送到 `main` 后一两分钟自动发布：

```
https://qqmin52.github.io/qmin-site/
```

如果 Pages 没开：仓库 Settings → Pages → Source 选 `Deploy from a branch` → `main` / `(root)` → Save。

## 绑定自己的域名

1. 在仓库 Settings → Pages → **Custom domain** 填域名，例如 `qmin.example.com`，Save。
   GitHub 会在仓库根目录生成 `CNAME` 文件（**不要手动删**）。
2. 到域名服务商加解析：

   **用子域名（推荐，如 `qmin.example.com`）**

   | 类型 | 主机记录 | 记录值 |
   | --- | --- | --- |
   | CNAME | `qmin` | `qqmin52.github.io` |

   **用裸域名（如 `example.com`）** —— 加 4 条 A 记录：

   | 类型 | 主机记录 | 记录值 |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |

3. 等 DNS 生效（几分钟到几小时），回到 Settings → Pages 勾选 **Enforce HTTPS**。

换域名时记得同步改 `index.html` 里的 canonical / og:url（目前没写死，避免绑错域名后指向旧地址）。

## 改内容

- 文案、区块都在 `index.html` 里，按注释分段（HERO / 01 WHY / 02 PLUGIN …）。
- 颜色、字号、间距集中在 `assets/style.css` 顶部的 `:root` 变量，改一处全站生效。
- 代码示例里的语法高亮是手写的 `<span class="kw">` 等类名，改代码时注意保留结构。

## 设计说明

纸色 `#F4F1E9`、墨色 `#191510`、朱红 `#C4442A`；无渐变、无玻璃拟态、无外部字体。
暗色模式跟随系统（`prefers-color-scheme`），颗粒质感是内联 SVG 噪点，不额外请求资源。
