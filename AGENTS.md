# UI/UX Pattern Library — 專案規範

本文件是 **UI/UX Pattern Library** 的唯一專案規範，定義專案目的、案例分析方式、資料結構、檔案命名、截圖管理、搜尋篩選與介面行為。

**任何 AI 或協作者在修改專案、分析網站或新增案例前，都必須先完整閱讀本文件。**

若新的需求與本規範衝突，除非使用者明確要求進行全專案調整，否則應優先維持既有：

- 案例資料 Schema
- 檔案結構
- 分析方法
- UI 元件
- 視覺系統
- 搜尋與篩選邏輯

---

## 1. 專案目的

UI/UX Pattern Library 是一個個人的網站設計案例收藏與分析資料庫。

使用者提供網站 URL 與網站截圖後，AI 依照本文件規則分析網站，將可觀察到的 UI/UX 設計轉換成標準化案例資料，加入既有案例庫。

每個案例應協助回答：

1. 這個網站使用了哪些設計選擇？
2. 這些設計可能產生什麼使用效果？
3. 哪些 UI/UX Pattern 值得重複使用？
4. 這些 Pattern 適合使用在哪些產品或情境？
5. 畫面中有哪些可能的 UX 風險或限制？

本網站定位為：

> **收藏介面、拆解模式、建立自己的設計語彙。**

網站主要用途約為：

- 80% 視覺探索與案例收藏
- 20% 設計分析與學習

因此網站應維持視覺型案例資料庫的特性，而不是傳統 Dashboard 或純文字知識庫。

---

## 2. 核心原則

所有開發與案例新增都必須遵守以下原則：

- 收藏值得參考的介面。
- 將網站設計拆解成可重複使用的 UI/UX Pattern。
- 所有案例使用相同資料 Schema。
- 所有案例共用相同案例卡片與詳細資料 Modal。
- 首頁以 Screenshot 與探索為主，深入分析放在 Modal。
- 分析必須以實際可觀察證據為基礎。
- 明確區分「畫面中可見的事實」與「基於設計原則的推論」。
- 優先提供具體、精簡且可實際應用的分析。
- 不可為了填滿欄位而虛構資訊。
- 不可虛構使用者研究、數據、轉換成果、訪談、A/B Test 或網站實際成效。
- 專案必須維持純靜態網站，可直接部署至 GitHub Pages。
- 不使用 Backend、Database、Framework 或 Build Process。

---

## 3. 專案結構

專案固定維持以下結構：

```text
uiux-pattern-library/
├── index.html
├── style.css
├── script.js
├── AGENTS.md
├── data/
│   └── cases.json
└── assets/
    └── screenshots/
```

各檔案用途：

- `index.html`：網站主要結構。
- `style.css`：全站視覺系統與響應式樣式。
- `script.js`：案例載入、搜尋、篩選、卡片與 Modal 邏輯。
- `AGENTS.md`：本專案唯一開發與案例分析規範。
- `data/cases.json`：所有案例的唯一資料來源。
- `assets/screenshots/`：網站案例截圖。

### 重要規則

案例資料不得直接寫入：

- `index.html`
- `script.js`

新增案例時，正常情況下只應修改：

```text
data/cases.json
assets/screenshots/
```

新增案例不應要求修改 `index.html`。

---

## 4. 案例資料 Schema

`data/cases.json` 中每一個案例都必須使用相同結構。

```json
{
  "id": "linear",
  "name": "Linear",
  "url": "https://linear.app",
  "screenshot": [
    "assets/screenshots/linear-01.webp",
    "assets/screenshots/linear-02.webp"
  ],
  "screenshot_highlights": [
    {
      "screenshot_index": 0,
      "x": 50,
      "y": 35,
      "label": "Primary action",
      "description": "The CTA follows the headline in the same visual column."
    }
  ],

  "website_type": "SaaS",

  "design_styles": [
    "Dark",
    "Minimal"
  ],

  "analysis": {
    "overview": "",
    "color_system": "",
    "typography": "",
    "layout": "",
    "navigation": "",
    "cta": "",
    "interaction": "",
    "information_hierarchy": ""
  },

  "components": [
    "Sidebar",
    "Command Palette"
  ],

  "ux_strengths": [
    ""
  ],

  "potential_issues": [
    ""
  ],

  "reusable_patterns": [
    {
      "name": "",
      "description": "",
      "best_for": "",
      "advantages": [],
      "limitations": []
    }
  ],

  "use_cases": [],

  "tags": [],

  "created_at": "YYYY-MM-DD"
}
```

### Schema 規則

- 所有案例都必須保留完整 Schema。
- 不可為單一案例新增專屬欄位。
- 即使沒有足夠內容，`analysis` 內所有欄位仍須保留。
- 無法確認的陣列可以為空陣列 `[]`。
- `id` 必須唯一。
- `id` 使用小寫 kebab-case。
- `url` 必須為完整的 HTTP(S) 網址。
- `screenshot` 必須是字串陣列，每個元素都是相對於專案根目錄的圖片路徑。至少提供一張；多張依首頁到下方或使用者提供的順序排列。
- `screenshot_highlights` 是全案例共用的標註陣列，可為空；每筆含 `screenshot_index`（從 0 起）、`x`、`y`（相對截圖的 0–100 百分比）、`label`、`description`。
- `created_at` 使用 `YYYY-MM-DD`。

---

## 5. 新增案例流程

### 5.1 使用者最低限度需要提供的資訊

新增案例時，使用者只需要提供：

1. 網站 URL
2. Screenshot 路徑

例如：

```text
URL：https://linear.app
Screenshot：assets/screenshots/linear-01.webp
```

使用者**不需要**另外提供：

- Website Type
- Design Style
- UI Components
- UX Strengths
- Potential Issues
- Reusable Patterns
- Use Cases
- Tags
- 分析格式
- JSON Schema

這些內容都應由 AI 閱讀本文件後自行依規則判斷。

---

### 5.2 AI 新增案例時必須執行的流程

收到 URL 與 Screenshot 路徑後，AI 必須：

1. 完整閱讀 `AGENTS.md`。
2. 檢查 `data/cases.json`，理解既有案例與分類慣例。
3. 確認一個或多個 Screenshot 路徑，並記錄其展示順序。
4. 讀取提供的 Screenshot，將其視為主要視覺分析依據。
5. 若可存取網站 URL，可將網站內容作為補充證據。
6. 依照本文件的分析規則進行 UI/UX 分析。
7. 自行判斷：
   - `id`
   - `name`
   - `website_type`
   - `design_styles`
   - `analysis`
   - `components`
   - `ux_strengths`
   - `potential_issues`
   - `reusable_patterns`
   - `use_cases`
   - `tags`
   - `created_at`
8. 建立符合既有 Schema 的完整案例物件。
9. 將案例加入 `data/cases.json`。
10. 不得刪除或覆蓋既有案例。
11. 驗證 JSON 語法與 Schema。
12. 確認新案例可以正常使用：
   - Gallery
   - Search
   - Website Type Filter
   - Design Style Filter
   - UI Pattern Filter
   - Detail Modal
   - External Website Link

新增案例正常情況下不得修改：

- `index.html`
- 共用卡片元件
- Modal 結構
- 全站視覺系統

---

## 6. 分析證據優先順序

分析網站時，證據優先順序為：

1. 使用者提供的 Screenshot
2. AI 實際可存取並觀察到的網站內容
3. 專案既有分類與 Pattern 慣例

Screenshot 是主要視覺證據。

若網站 URL 無法存取：

- 仍可根據 Screenshot 分析可見的視覺與 UI 特徵。
- 不可宣稱已實際瀏覽網站。
- 不可推測 Screenshot 中看不到的互動或頁面。

若互動方式無法驗證：

- 使用審慎描述。
- 或將對應欄位留空。
- 不得自行補寫不存在的互動。

---

## 7. 分析方法

所有案例分析應優先遵循：

> **觀察 → 設計效果 → 可重用原則**

### 觀察

描述實際看見的 UI 特徵。

例如：

> 首頁使用大面積深色背景，主要標題採高亮白色文字，互動元素使用紫藍色作為 Accent Color。

### 設計效果

說明這些選擇可能如何影響使用者。

例如：

> 高明度文字與深色背景形成明顯對比，使主要資訊在高密度介面中仍能快速被辨識。

### 可重用原則

將案例轉換成可套用至其他設計的原則。

例如：

> 在資訊密度較高的產品中，可將高亮色集中保留給核心操作與狀態提示，以降低整體視覺噪音。

---

## 8. 分析語氣規則

分析應：

- 專業
- 精簡
- 具體
- 有設計評論觀點
- 可以指出優點與限制
- 避免無依據的稱讚

避免單獨使用：

- 漂亮
- 高級
- 現代
- 很有質感
- 很直覺
- 很舒服

若使用這類描述，必須補充具體 UI 證據與原因。

例如不要寫：

> 這個網站的深色設計很高級。

應寫：

> 大面積低亮度背景降低非核心資訊的視覺重量，再透過高亮文字與局部 Accent Color 建立層級，使畫面在資訊密度較高的情況下仍維持清楚的注意力焦點。

若分析屬於推論而非已驗證結果，使用：

- 「可能有助於……」
- 「可能降低……」
- 「在……情境下可能……」

不可將推論寫成已證實的使用結果。

---

## 9. 網站類型規則

`website_type` 必須優先從以下分類選擇：

- `SaaS`
- `Portfolio`
- `E-commerce`
- `Editorial`
- `Landing Page`
- `Productivity`
- `AI Product`
- `Other`

每個案例只能選擇一個主要類型。

只有當既有分類都明顯不適用時，才使用 `Other`。

不得為單一案例建立語意相近的新分類。

---

## 10. 設計風格規則

`design_styles` 優先使用以下受控詞彙：

- `Minimal`
- `Dark`
- `Editorial`
- `Brutalist`
- `Playful`
- `Experimental`
- `Corporate`
- `Futuristic`
- `Developer-focused`

風格代表視覺方向，不代表品質評分。

若需要新增新的 Design Style，必須符合：

1. 與既有分類有明確差異。
2. 未來可能套用至多個案例。
3. 同步更新 `AGENTS.md`。
4. 確認 Filter 可以自動讀取新風格。

不要建立只適用於單一網站的風格名稱。

---

## 11. 可重用模式規則

`reusable_patterns` 是本專案最重要的分析內容之一。

每個 Pattern 必須包含：

- `name`
- `description`
- `best_for`
- `advantages`
- `limitations`

Pattern 不可以只是元件名稱。

例如只寫：

> Command Palette

是不完整的。

應進一步回答：

- 它如何運作？
- 為什麼值得使用？
- 適合什麼產品？
- 有什麼優點？
- 有什麼限制？

Pattern 的目的不是描述單一網站，而是：

> **將設計方式轉換成未來其他產品也可以參考的設計知識。**

若證據足夠，應至少提供一項優點與一項限制。

若無法合理判斷，不得為了填滿欄位而虛構。

---

## 12. UX 優勢規則

`ux_strengths` 應描述網站從可觀察介面中呈現出的 UX 優勢。

優先分析：

- 資訊層級
- 可掃視性
- 導覽
- 操作入口
- 視覺回饋
- CTA 明確度
- 元件一致性
- 認知負擔
- 內容組織

不可使用未經證實的結果，例如：

> 提升使用者留存率。

可以改成：

> 清楚的資訊層級可能有助於使用者快速辨識主要操作與次要資訊。

---

## 13. 潛在問題規則

每個案例應盡量包含可觀察的 UX 風險或限制。

不得虛構：

- 使用者抱怨
- 訪談結果
- Conversion Rate
- Bounce Rate
- A/B Test
- Analytics
- 使用者研究
- 商業成果

Potential Issue 必須能對應到可見的 UI 特徵。

例如：

> 低對比的 Secondary Text 在較小螢幕或低亮度環境下可能降低可讀性。

而不是：

> 使用者會覺得不好用。

若證據不足，應明確表達不確定性。

---

## 14. Screenshot 規則

所有案例 Screenshot 存放於：

```text
assets/screenshots/
```

### 命名

優先使用 `{id}-{序號兩位數}.webp`，例如：

```text
linear-01.webp
linear-02.webp
notion-01.webp
```

若單張素材或使用者已提供不同名稱／格式，保留既有檔名與格式，不要任意重新命名。

若使用者提供素材為其他格式，也可以使用：

- `.png`
- `.jpg`
- `.jpeg`

### 路徑

JSON 中使用相對路徑陣列，例如：

```json
"screenshot": [
  "assets/screenshots/linear-01.webp",
  "assets/screenshots/linear-02.webp"
]
```

順序即為檢視順序，Gallery 固定以第一張作封面；Modal 於多張時顯示左右控制與張數，支援循環切換及鍵盤左右鍵。單張時不顯示控制。載入端須暫時兼容舊版單一路徑字串，轉為單元素陣列後再驗證。

### 重點標註規則

`screenshot_highlights` 用於在 Detail Modal 的截圖上標出可觀察的設計重點，並在圖下列出說明。

- `screenshot_index` 對應 `screenshot` 陣列索引，從 0 開始。
- `x`、`y` 是截圖上標記中心點的百分比，範圍為 0–100。
- `label` 簡短命名視覺焦點；`description` 說明觀察與設計效果。
- 標註必須能在該張截圖中直接核對，不可標示截圖未呈現的互動或功能。
- 每張圖以 1–4 個重點為宜；沒有可靠重點時留空陣列，不得為了裝飾而添加。
- 標記與圖下編號說明必須同步，使用同一順序。
- 所有案例共用同一標記樣式與版面，不得為單一案例建立客製化標註元件。

### 真實性

不可：

- 偽造真實網站 Screenshot。
- 將合成 Mockup 宣稱為真實網站。
- 在沒有 Screenshot 的情況下自行生成假畫面代替。

若 Screenshot 缺失，應使用網站既有的統一 Missing Screenshot 狀態。

### 無障礙

圖片 `alt` 應包含：

> `{網站名稱} 網站截圖`

---

## 15. 檔案命名規則

- `id` 使用小寫 kebab-case。
- Screenshot 檔名優先採 `{id}-{序號兩位數}.{副檔名}`，並依展示順序編號。
- 不可為每個 Case 建立獨立 HTML。
- 不可為每個 Case 建立獨立 CSS。
- 不可為每個 Case 建立獨立 JavaScript。
- 共用資產使用清楚且具有描述性的檔名。

以下核心檔案名稱不得任意更改：

```text
index.html
style.css
script.js
AGENTS.md
data/cases.json
```

---

## 16. UI 設計規則

網站維持以下視覺方向：

- Dark Mode
- 設計 Archive / Editorial 感
- 近黑色背景
- 節制的 Accent Color
- 明確 Typography Hierarchy
- 繁體中文以 `Noto Sans TC` 作為主要中文字體 fallback；保留 Manrope、DM Sans、DM Mono 的英文層級。
- 大量留白
- Screenshot 為主要視覺
- 卡片式探索
- Hero 保留 Editorial 主視覺與大型標題，但高度應讓使用者能較快進入 Gallery。
- About 區塊需清楚呈現「觀察 → 設計效果 → 可重用原則」分析方法，使用細線、留白與 Mono metadata，避免制式 SaaS 功能卡。

### Typography / Readability

- 一般正文（包含行動版）不得低於 `14px`，行距以 `1.75–1.9` 為原則。
- Modal 正文與行動版 Modal Body 至少 `14px`；UX 優勢、潛在問題、適用情境等列表至少 `13px`，行距約 `1.8`。
- Tag / Chip 原則上不得低於 `10px`；主要可見 Metadata 原則上不得低於 `9px`。
- 卡片名稱應清楚高於 Metadata；Website Type、Design Style 與 Tag 必須有足夠對比。
- Modal Section Title 約 `11–12px`；Pattern 名稱 `16–18px`、描述 `13–14px`，優勢與限制內容至少 `13px`。
- Screenshot Highlight 標題與說明至少 `12px`，行距 `1.6–1.7`；編號至少 `10px`。
- 不可為了 Editorial 風格犧牲閱讀性。行動版不得單純縮小文字解決版面問題，應優先換行、調整間距或改為堆疊排列。

### Localization / Display Labels

- Schema 與案例資料可保留英文受控詞彙；前台主要面向繁體中文使用者，應以繁體中文顯示名稱。
- Website Type、Design Style、Components、UI Pattern 與常見 Tags 透過 `script.js` 的 Display Label Mapping 顯示中文；未知值保留原文。
- Detail Modal 的 Website Type 與 Design Style 可採「中文 · English」並列；首頁卡片優先使用精簡中文。
- Display Mapping 只改變呈現文字。Filter option 的 `value`、搜尋索引、資料值及比較邏輯都必須繼續使用 `cases.json` 原始值。
- 不得為了前台中文化修改案例資料 Schema 或原始分類／標籤值。新增常見詞彙翻譯時，應同步更新共用 Mapping，不建立案例專用翻譯邏輯。

避免：

- 傳統 Dashboard
- 一般 AI SaaS Landing Page
- 過度漸層
- 大量 Glassmorphism
- 過度裝飾
- 為單一案例設計特殊版面

### 案例卡片

首頁案例卡片只顯示：

- Screenshot
- Website Name
- Website Type
- 主要 Design Style
- 2–4 個 Pattern 或 Tag

詳細分析只能放在 Detail Modal。

---

## 17. Detail Modal 規則

所有案例共用相同 Detail Modal。

固定資訊順序：

1. 網站名稱
2. Website URL
3. Screenshot
4. Website Type
5. Design Styles
6. Design Overview
7. 可重用 Pattern
8. 色彩系統
9. 字體排版
10. 版面配置
11. 導覽
12. CTA
13. 互動
14. 資訊層級
15. UX 優勢
16. 潛在問題
17. 適用情境
18. UI 元件
19. Tags
20. 造訪網站

可重用 Pattern 是本專案的核心輸出，應緊接設計總覽呈現。每張 Pattern Card 使用共用樣式，依 `reusable_patterns` 陣列順序由前端產生 `PATTERN 01`、`PATTERN 02` 等編號，不得新增 Schema 欄位。卡片資訊順序為 Pattern Name、Description、適用於、優勢、限制。

不得因為單一案例改變 Modal 結構。

---

## 18. 搜尋規則

搜尋必須涵蓋：

- `name`
- `website_type`
- `design_styles`
- `components`
- `reusable_patterns.name`
- `reusable_patterns.description`
- `reusable_patterns.best_for`
- `reusable_patterns.advantages`
- `reusable_patterns.limitations`
- `use_cases`
- `tags`

搜尋不區分英文大小寫。

搜尋結果應與 Filter 同時作用。

清空搜尋文字時，不得自行清除目前啟用的 Filter。

---

## 19. Filter 規則

網站提供三種主要 Filter：

1. Website Type
2. Design Style
3. UI Pattern

UI Pattern 選項應從以下資料動態整理：

```text
components
reusable_patterns[].name
```

新增案例後，只要資料中出現新的 Pattern，就應自動出現在 Filter 中。

不得因新增 Pattern 而手動修改 `index.html`。

---

## 20. Schema 修改規則

不可為單一案例修改 Schema。

Schema 修改屬於全專案變更。

若使用者明確要求修改 Schema，必須同步檢查：

- `AGENTS.md`
- `data/cases.json`
- `script.js`
- Schema Validation
- Search
- Filters
- Gallery Card
- Detail Modal
- Existing Cases

修改後仍必須維持：

> 新增一般案例不需要修改 `index.html`。

修改 Screenshot Schema 時，需將所有既有字串路徑遷移為陣列；載入端可在遷移期間將舊字串正規化成單元素陣列，避免舊資料造成整站失效。新增 `screenshot_highlights` 等全案例欄位時，必須更新所有既有案例、驗證器、Modal 顯示與本文件；無標註案例使用空陣列。

---

## 21. AI 修改規則

任何 AI 在修改本專案前，都必須：

1. 先閱讀 `AGENTS.md`。
2. 檢查既有檔案與資料。
3. 優先沿用現有架構。
4. 避免為單一案例增加特殊邏輯。

AI 不得：

- 虛構 UX Research。
- 虛構 Analytics。
- 虛構網站互動。
- 任意修改 Schema。
- 任意修改全站視覺系統。
- 為單一 Case 建立特殊 Component。
- 為新增案例大量修改 HTML。
- 將 Demo 內容當成真實案例。
- 將無法確認的資訊寫成事實。

案例文字輸出至 HTML 前必須安全處理。

外部連結僅接受 HTTP(S)。

所有外部連結應使用：

```html
rel="noopener noreferrer"
```

專案必須維持 GitHub Pages 可直接部署。

---

## 22. 錯誤與缺漏處理

網站不得因單一案例資料有問題而整體失效。

應處理：

- Screenshot 不存在
- 欄位為空
- Array 為空
- URL 無效
- JSON 載入失敗
- cases.json 為空

若 `cases.json` 無法載入，網站應顯示清楚錯誤訊息，而不是空白頁面。

若 Screenshot 不存在，應顯示統一的 Missing Screenshot 狀態。

---

## 23. 新案例完成定義

只有符合以下全部條件，新案例才算完成：

### Data

- `cases.json` 可以正常解析。
- Case 符合完整 Schema。
- `id` 唯一。
- URL 有效。
- `screenshot` 是至少含一個有效路徑的字串陣列，所有 Screenshot Path 正確。
- `screenshot_highlights` 使用固定格式；索引必須指向存在的截圖，座標必須介於 0–100。

### Gallery

- 首頁正常顯示新案例。
- Screenshot 正常顯示。
- 若有重點標註，標記位置與圖下說明一致且可由截圖核對。
- Website Type 與 Design Style 正確。

### Search

- 可以透過網站名稱搜尋到案例。
- Pattern、Use Case 或 Tag 可以被搜尋。

### Filter

- Website Type Filter 正常。
- Design Style Filter 正常。
- UI Pattern Filter 正常。

### Modal

- Detail Modal 可以正常開啟。
- 多張 Screenshot 可用左右按鈕與鍵盤方向鍵切換，並正確顯示張數；單張時不顯示切換控制。
- 所有可用分析內容正確呈現。
- Modal 可以正常關閉。
- 鍵盤操作正常。

### Link

- Visit Website 可以正確開啟原網站。

### Compatibility

- 既有案例仍可正常顯示。
- 不需要修改 `index.html`。
- 不需要建立 Case 專用元件。
- 桌面與手機版皆可正常使用。

---

## 24. 全專案完成定義

整個專案必須符合：

- `data/cases.json` 是案例的唯一資料來源。
- 所有案例使用相同 Schema。
- 新增案例不需要修改 HTML。
- Gallery 可以正常產生。
- Search 可以正常使用。
- Website Type、Design Style 與 UI Pattern Filter 可以組合使用。
- Detail Modal 可以正常顯示所有案例。
- 缺少資料時有合理 fallback。
- 不包含虛構研究或無證據的案例結論。
- 網站具有基本無障礙支援。
- 桌面與行動裝置皆可正常瀏覽。
- 可直接部署至 GitHub Pages。
- 不需要 Build Step、Backend 或 Database。

---

## 25. 最簡新增案例指令

當本專案架構完成後，使用者新增案例時，只需要提供：

```text
請先閱讀 AGENTS.md，並依照規範新增以下網站案例：

URL：https://example.com
Screenshot：assets/screenshots/example-01.webp
```

收到此類指令後，AI 必須自行完成：

```text
閱讀 AGENTS.md
↓
檢查既有 cases.json
↓
查看 Screenshot
↓
必要時檢視網站 URL
↓
進行 UI/UX 分析
↓
判斷分類與 Pattern
↓
建立完整 Case Schema
↓
寫入 data/cases.json
↓
驗證 Search / Filter / Modal
↓
確認既有案例未受影響
```

**使用者不需要每次重新提供分析規則、資料格式或新增流程。這些規則都應由本 `AGENTS.md` 統一管理。**
