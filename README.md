# 重力離子熱電技術宣傳網站 | Gravity Ion Thermoelectric Technology Website

一個展示突破性重力離子熱電轉換技術的現代化宣傳網站，採用響應式設計與無障礙網頁標準。

A modern promotional website showcasing revolutionary gravity ion thermoelectric conversion technology, built with responsive design and accessibility standards.

## 🚀 專案簡介 | Project Overview

本網站旨在向全球展示重力離子熱電技術的突破性發現，包括：
- 超越卡諾定理限制的能源轉換效率
- 在重力場中實現持續電流產生
- 顛覆傳統熱力學第二定律的實驗證據

This website aims to showcase the breakthrough discoveries in gravity ion thermoelectric technology to a global audience, including:
- Energy conversion efficiency that surpasses Carnot theorem limitations
- Continuous current generation in gravitational fields
- Experimental evidence that challenges the traditional second law of thermodynamics

## 🛠 技術棧 | Tech Stack

### 前端技術 | Frontend Technologies
- **HTML5**: 語義化標籤與無障礙設計
- **Tailwind CSS**: 現代化 CSS 框架，響應式設計
- **JavaScript (ES6+)**: 模組化架構，動畫系統
- **WebP 圖片格式**: 優化載入性能

### 開發工具 | Development Tools
- **Live Server**: 開發伺服器
- **ESLint**: 程式碼品質檢查
- **Prettier**: 程式碼格式化
- **Git**: 版本控制

### 特色功能 | Key Features
- 🎨 **粒子動畫系統**: 模擬離子在重力場中的運動
- 📱 **響應式設計**: 支援手機、平板、桌面裝置
- ♿ **無障礙設計**: ARIA 標籤、鍵盤導航、螢幕閱讀器支援
- 🎯 **SEO 優化**: Meta 標籤、社群媒體分享
- ⚡ **性能優化**: 懶載入、防抖函數、資源預載入
- 🌙 **使用者偏好**: 支援減少動畫、暗色模式偏好

## 📁 專案結構 | Project Structure

```
/
├── index.html                     # 主要 HTML 檔案
├── assets/
│   ├── css/
│   │   └── styles.css            # 自訂 CSS 樣式
│   ├── js/
│   │   ├── main.js               # 主要應用程式邏輯
│   │   ├── animations.js         # 動畫系統與粒子效果
│   │   └── utils.js              # 通用工具函式
│   ├── images/                   # 研究圖片與插圖
│   │   ├── 001-energy-flows-from-hot-to-cold-region.webp
│   │   ├── 003-lithium-and-potassium-ion-fields...webp
│   │   └── ... (更多技術示意圖)
│   └── docs/                     # 研究文獻
│       ├── 1-an-exception-to-the-second-law...md
│       ├── 2-heat-to-electricity-conversion...md
│       └── ... (更多研究論文)
├── package.json                  # Node.js 專案設定
├── .vscode/
│   └── settings.json            # VSCode 設定
├── LICENSE                      # MIT 授權條款
└── README.md                    # 專案說明文件
```

## 🚀 開發環境安裝 | Development Setup

### 前置需求 | Prerequisites
- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- 現代瀏覽器 (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

### 安裝步驟 | Installation Steps

1. **複製專案 | Clone Repository**
   ```bash
   git clone https://github.com/jim60105/website-gravity-ion-thermolectric.git
   cd website-gravity-ion-thermolectric
   ```

2. **安裝依賴 | Install Dependencies**
   ```bash
   npm install
   ```

3. **啟動開發伺服器 | Start Development Server**
   ```bash
   npm run dev
   ```
   網站將在 `http://localhost:3000` 開啟

### 可用指令 | Available Scripts

- `npm run dev` - 啟動開發伺服器並自動開啟瀏覽器
- `npm start` - 啟動開發伺服器（不自動開啟瀏覽器）
- `npm run lint` - 執行 ESLint 程式碼檢查
- `npm run format` - 使用 Prettier 格式化程式碼

## 🏗 建構與部署 | Build and Deployment

### 本地建構 | Local Build
此專案為純靜態網站，可直接部署以下檔案：
- `index.html`
- `assets/` 資料夾
- 其他靜態資源

### 部署選項 | Deployment Options

1. **GitHub Pages**
   ```bash
   # 直接推送到 gh-pages 分支
   git checkout -b gh-pages
   git push origin gh-pages
   ```

2. **Netlify**
   - 連接 GitHub 儲存庫
   - 建構設定：無需建構步驟
   - 發布目錄：`/` (根目錄)

3. **Vercel**
   ```bash
   # 使用 Vercel CLI
   npx vercel --prod
   ```

4. **傳統主機**
   直接上傳所有檔案到網頁伺服器根目錄

## 🎨 設計系統 | Design System

### 色彩調色盤 | Color Palette
- **Electric Blue** (`#00BFFF`): 電子流動效果
- **Plasma Purple** (`#8A2BE2`): 電漿狀態表示
- **Energy Gold** (`#FFD700`): 能量轉換亮點
- **Deep Space** (`#0B0B2F`): 深邃背景色

### 動畫效果 | Animations
- **粒子系統**: 模擬正負離子在重力場中的分離
- **滾動動畫**: 元素進入視窗時的淡入效果
- **懸停效果**: 按鈕與連結的互動回饋
- **載入動畫**: 表單提交與內容載入指示

## ♿ 無障礙功能 | Accessibility Features

- **語義化 HTML**: 使用 `<main>`, `<section>`, `<article>` 等標籤
- **ARIA 標籤**: 為複雜元件提供無障礙描述
- **鍵盤導航**: 支援 Tab 鍵與 Enter/Space 操作
- **焦點指示器**: 清晰的焦點視覺回饋
- **螢幕閱讀器**: 相容 NVDA, JAWS, VoiceOver
- **對比度**: 符合 WCAG AA 標準
- **減少動畫**: 尊重使用者的動畫偏好設定

## 📱 響應式設計 | Responsive Design

### 斷點設定 | Breakpoints
- **手機** (Mobile): < 768px
- **平板** (Tablet): 768px - 1024px
- **桌面** (Desktop): > 1024px

### 適配特色 | Responsive Features
- 流動式網格佈局
- 可伸縮的圖片與媒體
- 適應性導航選單
- 觸控友善的互動元素

## 🔧 開發規範 | Development Guidelines

### 程式碼風格 | Code Style
- **JavaScript**: ES6+ 語法，模組化設計
- **CSS**: Tailwind 優先，自訂樣式最小化
- **HTML**: 語義化標籤，無障礙屬性完整

### 效能最佳化 | Performance Optimization
- 圖片懶載入 (Lazy Loading)
- 函數防抖 (Debouncing) 與節流 (Throttling)
- 資源預載入 (Resource Preloading)
- 最小化重排與重繪

### 瀏覽器相容性 | Browser Compatibility
| 瀏覽器 | 最低版本 | 支援狀態 |
|--------|----------|----------|
| Chrome | 80+ | ✅ 完全支援 |
| Firefox | 75+ | ✅ 完全支援 |
| Safari | 13+ | ✅ 完全支援 |
| Edge | 80+ | ✅ 完全支援 |
| IE | 11 | ⚠️ 基本支援 |

## 📚 研究文獻 | Research Documentation

網站包含以下重要研究文件：

1. **[熱力學第二定律的例外](assets/docs/1-an-exception-to-the-second-law-of-thermodynamics-might-change-global-energy-rules.md)**
2. **[重力下的熱電轉換](assets/docs/2-heat-to-electricity-conversion-under-gravity-simplified.md)**
3. **[重力對電漿的影響](assets/docs/3-how-heat-converts-to-electricity-under-gravitational-effect-on-plasma.md)**
4. **[五千位教授無法回答的問題](assets/docs/4-the-question-over-five-thousand-professors-could-not-answer.md)**
5. **[卡諾定理的例外](assets/docs/5-an-exception-to-carnots-theorem-inferred-from-tolmans-experiment-ion-containing-fluids-driving-continuous-heat-to-electricity-conversion-under-acceleration-jci-web-c.md)**

## 🤝 貢獻指南 | Contributing

我們歡迎社群貢獻！請遵循以下步驟：

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

### 報告問題 | Reporting Issues
- 使用 GitHub Issues 回報錯誤
- 提供詳細的重現步驟
- 包含瀏覽器版本與作業系統資訊

## 📄 授權條款 | License

本專案採用 [MIT License](LICENSE) 授權。

## 📞 聯絡資訊 | Contact Information

- **研究團隊**: Gravity Ion Thermoelectric Research Team
- **Email**: research@gravity-ion-tech.com
- **網站**: https://gravity-ion-thermoelectric.com

## 🙏 致謝 | Acknowledgments

感謝以下技術與資源：
- [Tailwind CSS](https://tailwindcss.com/) - 現代化 CSS 框架
- [WebP](https://developers.google.com/speed/webp) - 高效圖片格式
- [MDN Web Docs](https://developer.mozilla.org/) - 網頁技術文件
- 所有為無障礙網頁貢獻的開發者社群

---

**建立時間**: 2024年8月  
**最後更新**: 2024年8月  
**版本**: 1.0.0