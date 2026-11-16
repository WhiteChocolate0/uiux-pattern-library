# UI/UX Pattern Library

**網站設計案例分析庫**

UI/UX Pattern Library 是一個用來收藏、分析與整理網站介面設計的個人案例庫。

這個專案的目標不是單純收藏「好看的網站」，而是透過固定的分析框架，將網站中的設計選擇整理成可以再次參考與應用的 UI/UX Pattern。

> 收藏介面，拆解模式，建立自己的設計語彙。

---

## Demo

- GitHub Pages
  [https://whitechocolate0.github.io/uiux-pattern-library/](https://whitechocolate0.github.io/uiux-pattern-library/)

---

## 專案特色

每個網站案例會依照固定規則整理，包括：

- Website Type
- Design Style
- 色彩系統
- 字體排版
- Layout
- Navigation
- CTA
- Interaction
- Information Hierarchy
- UX Strengths
- Potential Issues
- Reusable UI/UX Patterns
- Use Cases
- Tags
- Screenshot Highlights

首頁以網站 Screenshot 作為主要探索入口，並支援：

- 案例搜尋
- Website Type 篩選
- Design Style 篩選
- UI Pattern 篩選
- Detail Modal
- 多張 Screenshot 切換
- Screenshot 重點標註
- 響應式版面

---

## 專案架構

```text
uiux-pattern-library/
├── index.html
├── style.css
├── script.js
├── README.md
├── AGENTS.md
├── data/
│   └── cases.json
└── assets/
    └── screenshots/
```

### 主要檔案

- `index.html`：網站主要結構
- `style.css`：全站視覺與響應式樣式
- `script.js`：案例載入、搜尋、篩選與 Detail Modal
- `data/cases.json`：所有案例的唯一資料來源
- `assets/screenshots/`：案例截圖
- `AGENTS.md`：AI 新增案例與維護專案時必須遵守的規範

---

## 如何新增網站案例？

本專案的核心設計是：

**新增案例時，不需要重新修改主要 HTML。**

只需要提供：

```text
URL：https://example.com
Screenshot：assets/screenshots/example-01.webp
```

AI 會先閱讀 `AGENTS.md`，再依照既有規則完成：

1. 分析網站 UI/UX
2. 判斷 Website Type
3. 判斷 Design Style
4. 整理 UI Components
5. 分析 UX 優勢與潛在問題
6. 萃取 Reusable Patterns
7. 建立符合既有 Schema 的案例資料
8. 寫入 `data/cases.json`
9. 使用既有 Gallery 與 Detail Modal 顯示

因此新增案例通常只需要修改：

```text
data/cases.json
assets/screenshots/
```

---

## AI 分析方法

所有案例遵循相同分析原則：

```text
觀察
↓
設計效果
↓
可重用原則
```

### 觀察

描述 Screenshot 或網站中實際可見的 UI 特徵。

### 設計效果

分析這些設計選擇可能如何影響：

- 資訊理解
- 導覽
- 掃視
- 操作
- 視覺層級

### 可重用原則

將單一網站的設計方式整理成未來其他產品也可以參考的 UI/UX Pattern。

---

## AGENTS.md

本專案使用 `AGENTS.md` 作為 AI 開發與案例分析規範。

任何 AI 在：

- 新增案例
- 修改 Schema
- 修改 UI
- 調整搜尋與篩選
- 新增 Screenshot
- 修改案例資料

之前，都必須先閱讀 `AGENTS.md`。

`AGENTS.md` 定義：

- 專案目的
- Case Schema
- 分析規則
- Screenshot 規則
- Website Type
- Design Style
- Reusable Pattern
- UI 規範
- Search / Filter 規則
- AI 修改規則
- 完成條件

這讓未來新增內容時，不需要每次重新向 AI 說明專案架構。

---

## 技術

本專案使用：

- HTML
- CSS
- Vanilla JavaScript
- JSON
- GitHub Pages

刻意不使用：

- React
- Vue
- Backend
- Database
- Build Tool

以維持簡單、可直接部署且容易持續擴充的專案架構。

---

## 設計方向

網站採用：

- Dark Mode
- Editorial / Archive 風格
- Screenshot-first
- 大量留白
- 清楚的 Typography Hierarchy
- 節制的 Accent Color
- 卡片式案例探索

整體避免設計成傳統 Dashboard 或一般 AI SaaS Landing Page。

---

## 專案延伸方式

未來可以持續新增不同類型的網站案例，例如：

- SaaS
- Portfolio
- E-commerce
- Editorial
- Landing Page
- Productivity
- AI Product

由於所有案例共用同一套 Schema 與 UI 元件，因此案例增加時，不需要重新設計頁面。

這也是本專案最主要的核心：

> **利用清楚的專案規則，讓 AI 能持續且一致地擴充內容。**
