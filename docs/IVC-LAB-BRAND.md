# IVC LAB · 凌风品牌素材接入

本次应用于当前 Jekyll 网站 `ivclab-fx.github.io`。参考文件中提到的旧 Astro 项目继续暂停；本轮只替换品牌标志，没有应用整站重设计。

## 当前效果

- 参考 https://advml-group.github.io/ 的层次，首页导航只保留页面入口；内页导航保留可返回首页的横向组合。
- 首页顶端单独展示 IVC LAB 艺术字，下方为中英文课题组名称，简介在左、独立图形在右；其他学术内容保留。
- 浅色呈现藏蓝与香槟金；深色通过 CSS `brightness(0) invert(1)` 呈现相同轮廓的白色标志，避免重新绘制导致字形变化。
- 手机与窄平板折叠导航，图形移至简介上方；手机不为隐藏的长版简介预留高度。保留中英文切换、主题和搜索功能。
- 替换浏览器图标和 180 × 180 苹果触屏图标。
- PNG 均保留真实 alpha；没有将品牌展示板作为整张图片放入网页，也没有宣称 PNG 为矢量文件。

## 文件

- `assets/img/brand/ivc-lab-horizontal.png`：透明双色横向标志，2172 × 724。
- `assets/img/brand/ivc-lab-icon.png`：透明独立图形，1254 × 1254。
- `assets/img/brand/ivc-lab-favicon.png`：64 × 64。
- `assets/img/brand/ivc-lab-apple-touch.png`：180 × 180。
- `_includes/lab-logo.liquid`：共用品牌组件，支持完整组合、独立艺术字和图形。艺术字通过 SVG 视口展示原 PNG 的对应部分，保持字形一致；这不是矢量重绘。资源路径通过 `relative_url` 生成。
- `assets/css/brand.css`：尺寸、深色呈现、导航适配。
- `_includes/header.liquid`、`_layouts/about.liquid`：用户站点的主题模板覆盖，记录于 `.al-folio-overrides.yml`。

## 素材来源与制作

使用内置 imagegen，依据已确认的 `08-lingfeng-navy-gold.png` 生成透明横向组合和图形标志。图标缩小为浏览器需要的尺寸时保留透明通道。生成的独立白色试稿存在杂点，未纳入网站；最终深色效果由同一双色图的 alpha 轮廓直接呈白色。

### 横向标志的最终提示词

Use case: background-extraction / logo-brand.
Input image: supplied approved IVC LAB brand board, visual identity reference AND extraction target.
Produce ONE final horizontal website logo on a genuinely transparent background. Reproduce ONLY the TOP ROW lockup: on the left the interwoven I/V/C monogram, followed by the elegant uppercase “IVC LAB” wordmark on the right. Preserve the reference's exact distinctive letter silhouettes, long ascending V flourish, thin tapered terminals, C swoosh, and monogram proportions. Keep full strokes and adequate transparent padding, no clipping. I and C in deep navy #142B49, V monogram and LAB letters in flat champagne gold #AA834A; IVC wordmark navy. Flat uniform ink fills, crisp clean anti-aliased edges, no lighting, metallic texture, gradients, shadow, bevel, texture or mockup. Match the approved top row, do NOT include middle standalone wordmark or bottom blue board. Exactly one logo; no additional text. Wide horizontal composition, tightly framed around artwork with small safety margins. Academic, refined and light. Transparent means real alpha, no white or checkerboard baked into the image.

### 独立图形的最终提示词

Use case: logo-brand / background-extraction. Source: approved IVC LAB brand reference board. Create ONLY the interwoven I,V,C monogram from the TOP LEFT of the reference, NO wordmark and NO text outside monogram. Preserve the exact tall navy serif I, gold sweeping V crossing it, and navy wide flowing C; faithful to approved original. Centered square app/icon composition with safe padding, full long strokes. Flat fills: navy #142B49 I and C, champagne gold #AA834A V. Solid clean strokes, crisp smooth edges, no texture, no shadows, no gradient, no distress, no speckling. Genuinely transparent alpha background, not white. This is a website/favicon brand icon, not a brand board. One monogram only.

## 本地查看与维护

```powershell
docker compose up -d
```

访问 http://localhost:8080/ 。首页介绍继续在 `_pages/about.md` 维护，当前资料占位未被虚构内容替换。此轮保留旧 Logo 文件用于追溯，页面不再使用它们。

生产构建：

```powershell
docker compose exec -T -e JEKYLL_ENV=production jekyll bundle exec jekyll build --destination /tmp/ivc-brand-check
```

已检查桌面、手机、窄平板、深浅色、中英文、图片加载和品牌返回首页。现有语言切换回归测试 14 项通过。构建保留原项目已有的 Bootstrap 兼容、分页及 Notebook lexer 提示。
