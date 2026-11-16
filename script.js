(() => {
  "use strict";
  const CASES_URL = "data/cases.json";
  const $ = (selector, root = document) => root.querySelector(selector);
  const grid = $("#case-grid"), search = $("#search-input"), typeFilter = $("#type-filter"), styleFilter = $("#style-filter"), patternFilter = $("#pattern-filter");
  const state = {cases: [], query: "", type: "", style: "", pattern: ""};
  const WEBSITE_TYPE_LABELS = {"SaaS":"SaaS","Portfolio":"作品集","E-commerce":"電商","Editorial":"編輯／內容","Landing Page":"登陸頁","Productivity":"生產力工具","AI Product":"AI 產品","Other":"其他"};
  const DESIGN_STYLE_LABELS = {"Minimal":"極簡","Dark":"深色","Editorial":"編輯風格","Brutalist":"粗野主義","Playful":"活潑","Experimental":"實驗性","Corporate":"企業風格","Futuristic":"未來感","Developer-focused":"開發者導向"};
  const UI_LABELS = {"Hero Carousel":"主視覺輪播","Campaign CTA":"活動 CTA","Product Hero":"產品主視覺","Dual CTA":"雙 CTA","Product Carousel":"商品輪播","Category Navigation":"分類導覽","Utility Navigation":"工具導覽","Promotional Banner":"促銷橫幅","Global Navigation":"全站導覽","Search":"搜尋","Sidebar":"側邊導覽","Command Palette":"指令面板","Campaign Mosaic":"活動拼貼","Product Feature Sections":"產品特色區塊","Product UI Preview":"產品介面預覽","Sign-up CTA":"註冊 CTA","Price CTA":"價格 CTA","Text Link":"文字連結","Carousel Control":"輪播控制","Customer Logo Row":"客戶 Logo 列","Highlighted Headline":"重點文字標題","Large Hero Statement":"大型主視覺標語","Pickup Field":"上車地點欄位","Drop-off Field":"下車地點欄位","Floating Booking CTA":"浮動預約 CTA","Ride Type Selector":"行程類型選擇","Service Navigation":"服務導覽","Region Selector":"地區選擇","Travel Photo Mosaic":"旅遊照片拼貼","campaign":"品牌活動","product discovery":"商品探索","AI workspace":"AI 工作空間","knowledge management":"知識管理","developer tools":"開發工具","e-commerce":"電商","product development":"產品開發","product hero":"產品主視覺","productivity":"生產力","project management":"專案管理","ride booking":"叫車預約","marketplace":"多邊平台","mobility":"移動服務","sportswear":"運動服飾"};
  const displayLabel = (value, labels = UI_LABELS) => labels[value] || value;
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const safeHttpUrl = (value) => { try { const url = new URL(value); return ["http:","https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } };
  const uniq = (values) => [...new Set(values.filter((value) => typeof value === "string" && value.trim()))].sort((a,b) => a.localeCompare(b,"en"));
  const hasExactKeys = (value, keys) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every((key)=>Object.hasOwn(value,key));
  function validCase(item) {
    const caseKeys = ["id","name","url","screenshot","screenshot_highlights","website_type","design_styles","analysis","components","ux_strengths","potential_issues","reusable_patterns","use_cases","tags","created_at"];
    const analysisKeys = ["overview","color_system","typography","layout","navigation","cta","interaction","information_hierarchy"];
    const patternKeys = ["name","description","best_for","advantages","limitations"];
    const stringArrays = ["design_styles","components","ux_strengths","potential_issues","use_cases","tags"];
    return hasExactKeys(item,caseKeys) && typeof item.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) && typeof item.name === "string" && !!safeHttpUrl(item.url) && Array.isArray(item.screenshot) && item.screenshot.length > 0 && item.screenshot.every((path)=>typeof path === "string" && path.trim()) && Array.isArray(item.screenshot_highlights) && item.screenshot_highlights.every((point)=>hasExactKeys(point,["screenshot_index","x","y","label","description"]) && Number.isInteger(point.screenshot_index) && point.screenshot_index >= 0 && point.screenshot_index < item.screenshot.length && [point.x,point.y].every((value)=>typeof value === "number" && value >= 0 && value <= 100) && typeof point.label === "string" && typeof point.description === "string") && typeof item.website_type === "string" && stringArrays.every((key)=>Array.isArray(item[key]) && item[key].every((value)=>typeof value === "string")) && hasExactKeys(item.analysis,analysisKeys) && analysisKeys.every((key)=>typeof item.analysis[key] === "string") && Array.isArray(item.reusable_patterns) && item.reusable_patterns.every((pattern)=>hasExactKeys(pattern,patternKeys) && ["name","description","best_for"].every((key)=>typeof pattern[key] === "string") && ["advantages","limitations"].every((key)=>Array.isArray(pattern[key]) && pattern[key].every((value)=>typeof value === "string"))) && /^\d{4}-\d{2}-\d{2}$/.test(item.created_at);
  }
  async function loadCases() {
    try {
      const response = await fetch(CASES_URL);
      if (!response.ok) throw new Error(`Could not load ${CASES_URL} (${response.status})`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("cases.json must contain an array of cases.");
      const normalized = data.map((item)=>({...item,screenshot:typeof item?.screenshot === "string" ? [item.screenshot] : item?.screenshot,screenshot_highlights:item?.screenshot_highlights ?? []}));
      state.cases = normalized.filter(validCase);
      if (state.cases.length !== data.length) console.warn("Some invalid case records were skipped.");
      buildFilters();
      render();
      grid.setAttribute("aria-busy","false");
      if (!state.cases.length) showState("目前沒有有效案例。請在 data/cases.json 新增案例。");
    } catch (error) {
      console.error(error);
      grid.setAttribute("aria-busy","false");
      $("#result-count").textContent = "無法載入案例資料";
      showState("無法載入 data/cases.json。請以本機靜態伺服器或 GitHub Pages 開啟此網站。");
    }
  }
  function casePatterns(item) { return uniq([...item.components, ...item.reusable_patterns.map((pattern)=>pattern.name)]); }
  function fillFilter(select, label, values, labels) {
    const selected = select.value;
    select.innerHTML = `<option value="">${escapeHTML(label)}</option>${values.map((value)=>`<option value="${escapeHTML(value)}">${escapeHTML(labels ? displayLabel(value,labels) : displayLabel(value))}</option>`).join("")}`;
    if (values.includes(selected)) select.value = selected;
  }
  function buildFilters() {
    fillFilter(typeFilter,"網站類型",uniq(state.cases.map((item)=>item.website_type)),WEBSITE_TYPE_LABELS);
    fillFilter(styleFilter,"設計風格",uniq(state.cases.flatMap((item)=>item.design_styles)),DESIGN_STYLE_LABELS);
    fillFilter(patternFilter,"UI Pattern",uniq(state.cases.flatMap(casePatterns)));
  }
  function searchableText(item) {
    return [item.name,item.website_type,...item.design_styles,...item.components,...item.reusable_patterns.flatMap((pattern)=>Object.values(pattern)),...item.use_cases,...item.tags].flat(Infinity).join(" ").toLocaleLowerCase();
  }
  function getFilteredCases() {
    const query = state.query.trim().toLocaleLowerCase();
    return state.cases.filter((item) => (!query || searchableText(item).includes(query)) && (!state.type || item.website_type === state.type) && (!state.style || item.design_styles.includes(state.style)) && (!state.pattern || casePatterns(item).includes(state.pattern)));
  }
  function render() {
    const filtered = getFilteredCases();
    $("#hero-count").textContent = String(state.cases.length).padStart(2,"0");
    $("#result-count").textContent = `${String(filtered.length).padStart(2,"0")} 個案例 / 共 ${String(state.cases.length).padStart(2,"0")} 個`;
    const hasFilters = !!(state.query || state.type || state.style || state.pattern);
    $("#reset-filters").hidden = !hasFilters;
    grid.innerHTML = filtered.map(cardHTML).join("");
    if (!filtered.length) showState(hasFilters ? "找不到符合條件的案例，請更換關鍵字或重設篩選。" : "目前沒有案例，請在 data/cases.json 新增第一筆案例。");
    else hideState();
  }
  function uniqueInOrder(values) { return [...new Set(values.filter((value)=>typeof value === "string" && value.trim()))]; }
  function cardPatternItems(item) {
    const items = [...item.components, ...item.reusable_patterns.map((pattern)=>pattern.name)];
    const visual = /hero|campaign|bento|mosaic/i;
    const interaction = /cta|pricing|dashboard|command|sidebar|search|filter/i;
    return uniqueInOrder([...items.filter((value)=>visual.test(value)),...items.filter((value)=>interaction.test(value)),...items.filter((value)=>!visual.test(value)&&!interaction.test(value))]);
  }
  function cardLabels(item) {
    const patterns = cardPatternItems(item);
    const brandTokens = new Set(item.name.toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
    const patternTokens = new Set(patterns.map((value)=>value.toLocaleLowerCase()));
    const topics = uniqueInOrder(item.tags).filter((tag)=>!brandTokens.has(tag.toLocaleLowerCase())&&tag.toLocaleLowerCase()!==item.website_type.toLocaleLowerCase()&&!patternTokens.has(tag.toLocaleLowerCase())).sort((a,b)=>b.trim().split(/\s+/).length-a.trim().split(/\s+/).length||a.localeCompare(b,"en"));
    const selected = [], seen = new Set();
    const add = (values)=>values.forEach((value)=>{const key=value.toLocaleLowerCase();if(!seen.has(key)&&selected.length<4){seen.add(key);selected.push(value);}});
    add(patterns.slice(0,2));
    add(topics.slice(0,2));
    add(patterns.slice(2));
    add(topics.slice(2));
    return selected;
  }
  function cardHTML(item,index) {
    const screenshot = escapeHTML(item.screenshot[0]);
    const styles = item.design_styles.slice(0,2).map((style)=>escapeHTML(displayLabel(style,DESIGN_STYLE_LABELS))).join(" / ") || "未分類";
    const tags = cardLabels(item).map((pattern)=>`<span class="card-tag">${escapeHTML(displayLabel(pattern))}</span>`).join("");
    const demo = item.tags.includes("demo") ? " · 示範" : "";
    return `<article class="case-card" data-case-id="${escapeHTML(item.id)}" tabindex="0" role="button" aria-label="查看 ${escapeHTML(item.name)} 案例分析"><div class="screenshot-frame"><img src="${screenshot}" alt="${escapeHTML(item.name)} 網站截圖" loading="lazy" data-image-fallback><span class="image-index">案例 ${String(index+1).padStart(2,"0")}${demo}</span><span class="image-open" aria-hidden="true">↗</span></div><div class="card-info"><div class="card-title-line"><h3>${escapeHTML(item.name)}</h3><span class="card-type">${escapeHTML(displayLabel(item.website_type,WEBSITE_TYPE_LABELS))}</span></div><p class="card-style">${styles}</p><div class="card-tags">${tags}</div></div></article>`;
  }
  function showState(message) { const node = $("#page-state"); node.textContent = message; node.hidden = false; }
  function hideState() { $("#page-state").hidden = true; }
  function detailList(items) { return items.length ? `<ul>${items.map((item)=>`<li>${escapeHTML(item)}</li>`).join("")}</ul>` : `<p class="muted-copy">尚無紀錄。</p>`; }
  function section(title,content,extra="") { return `<section class="modal-section ${extra}"><h3>${escapeHTML(title)}</h3>${content}</section>`; }
  function renderPattern(pattern, index) {
    return `<article class="pattern-card"><div class="pattern-card-heading"><span class="pattern-index">PATTERN ${String(index).padStart(2,"0")}</span><h4>${escapeHTML(displayLabel(pattern.name))}</h4></div><p class="pattern-description">${escapeHTML(pattern.description)}</p><div class="pattern-fields"><div class="pattern-best-for"><strong>適用於</strong><span>${escapeHTML(pattern.best_for || "未註明")}</span></div><div><strong>優勢</strong>${detailList(pattern.advantages)}</div><div><strong>限制</strong>${detailList(pattern.limitations)}</div></div></article>`;
  }
  function renderScreenshotViewer(item, index) {
    const screenshots = item.screenshot;
    const current = Math.max(0, Math.min(index, screenshots.length - 1));
    const controls = screenshots.length > 1 ? `<button class="screenshot-nav screenshot-nav-prev" type="button" data-screenshot-step="-1" aria-label="上一張截圖">←</button><button class="screenshot-nav screenshot-nav-next" type="button" data-screenshot-step="1" aria-label="下一張截圖">→</button><span class="screenshot-counter" aria-live="polite">${String(current + 1).padStart(2,"0")} / ${String(screenshots.length).padStart(2,"0")}</span>` : "";
    const points = item.screenshot_highlights.filter((point)=>point.screenshot_index === current);
    const markers = points.map((point,index)=>`<span class="highlight-marker" style="left:${point.x}%;top:${point.y}%" aria-hidden="true">${index + 1}</span>`).join("");
    const notes = points.length ? `<ol class="highlight-notes">${points.map((point,index)=>`<li><span class="highlight-number">${index + 1}</span><div><strong>${escapeHTML(point.label)}</strong><p>${escapeHTML(point.description)}</p></div></li>`).join("")}</ol>` : "";
    return `<div class="modal-image-viewer${screenshots.length > 1 ? " has-multiple" : ""}" data-screenshot-viewer data-case-id="${escapeHTML(item.id)}" data-index="${current}"><div class="screenshot-stage"><img class="modal-hero-image" src="${escapeHTML(screenshots[current])}" alt="${escapeHTML(item.name)} 網站截圖，第 ${current + 1} 張，共 ${screenshots.length} 張" data-image-fallback>${markers}</div>${controls}${notes}</div>`;
  }
  function stepScreenshot(viewer, direction) {
    const item = state.cases.find((entry)=>entry.id === viewer.dataset.caseId);
    if (!item || item.screenshot.length < 2) return;
    const next = (Number(viewer.dataset.index) + direction + item.screenshot.length) % item.screenshot.length;
    viewer.outerHTML = renderScreenshotViewer(item, next);
  }
  function openModal(id) {
    const item = state.cases.find((entry)=>entry.id === id); if (!item) return;
    const url = safeHttpUrl(item.url);
    const demo = item.tags.includes("demo");
    const styles = item.design_styles.map((style)=>`<span class="taxonomy-chip">${escapeHTML(displayLabel(style,DESIGN_STYLE_LABELS))}<span class="label-original">${escapeHTML(style)}</span></span>`).join("");
    const tags = item.tags.map((tag)=>`<span class="card-tag">${escapeHTML(displayLabel(tag))}</span>`).join("");
    const analysis = item.analysis;
    $("#modal-body").innerHTML = `<div class="modal-body"><div class="modal-heading"><div><p class="modal-kicker">案例分析&nbsp; / &nbsp;${escapeHTML(item.id.toUpperCase())}</p><h2 id="modal-title">${escapeHTML(item.name)}</h2></div>${url ? `<a class="modal-url" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.url)} ↗</a>` : ""}</div>${demo ? `<div class="demo-banner">示範案例 — 僅供介面展示，非真實網站分析。</div>` : ""}${renderScreenshotViewer(item,0)}<div class="modal-taxonomy"><span class="taxonomy-chip type-chip">${escapeHTML(displayLabel(item.website_type,WEBSITE_TYPE_LABELS))}<span class="label-original">${escapeHTML(item.website_type)}</span></span>${styles}</div>${section("設計總覽",`<p>${escapeHTML(analysis.overview || "尚無分析紀錄。")}</p>`)}${section("可重用 Pattern",item.reusable_patterns.length ? `<div class="pattern-list">${item.reusable_patterns.map((pattern,index)=>renderPattern(pattern,index+1)).join("")}</div>` : `<p>尚無可重用 Pattern 紀錄。</p>`)}<div class="analysis-grid">${section("色彩系統",`<p>${escapeHTML(analysis.color_system || "尚無分析紀錄。")}</p>`)}${section("字體排版",`<p>${escapeHTML(analysis.typography || "尚無分析紀錄。")}</p>`)}${section("版面配置",`<p>${escapeHTML(analysis.layout || "尚無分析紀錄。")}</p>`)}${section("導覽",`<p>${escapeHTML(analysis.navigation || "尚無分析紀錄。")}</p>`)}${section("CTA",`<p>${escapeHTML(analysis.cta || "尚無分析紀錄。")}</p>`)}${section("互動",`<p>${escapeHTML(analysis.interaction || "尚無分析紀錄。")}</p>`)}${section("資訊層級",`<p>${escapeHTML(analysis.information_hierarchy || "尚無分析紀錄。")}</p>`)}</div>${section("UX 優勢",detailList(item.ux_strengths),"list-section")}${section("潛在問題",detailList(item.potential_issues),"list-section")}${section("適用情境",detailList(item.use_cases),"list-section")}${section("UI 元件",detailList(item.components.map((value)=>displayLabel(value))),"list-section")}<section class="modal-section"><h3>Tags</h3><div class="modal-tags">${tags || "—"}</div></section><div class="modal-footer">${url ? `<a class="visit-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">造訪網站 <span aria-hidden="true">↗</span></a>` : ""}</div></div>`;
    const dialog = $("#case-modal");
    if (!dialog.open) dialog.showModal();
  }
  grid.addEventListener("click",(event)=>{const card=event.target.closest("[data-case-id]");if(card)openModal(card.dataset.caseId);});
  grid.addEventListener("keydown",(event)=>{const card=event.target.closest("[data-case-id]");if(card&&["Enter"," "].includes(event.key)){event.preventDefault();openModal(card.dataset.caseId);}});
  document.addEventListener("error",(event)=>{if(event.target.matches?.("img[data-image-fallback]")){const placeholder=document.createElement("div");placeholder.className=event.target.classList.contains("modal-hero-image")?"image-placeholder modal-image-placeholder":"image-placeholder";placeholder.setAttribute("role","img");placeholder.setAttribute("aria-label",`${event.target.alt}（截圖無法顯示）`);placeholder.textContent="截圖無法顯示";event.target.replaceWith(placeholder);}},{capture:true});
  $("#modal-body").addEventListener("click",(event)=>{const button=event.target.closest("[data-screenshot-step]");if(button){const viewer=button.closest("[data-screenshot-viewer]");if(viewer)stepScreenshot(viewer,Number(button.dataset.screenshotStep));}});
  $("#case-modal").addEventListener("keydown",(event)=>{if(!["ArrowLeft","ArrowRight"].includes(event.key))return;const viewer=$("[data-screenshot-viewer].has-multiple");if(!viewer)return;event.preventDefault();stepScreenshot(viewer,event.key==="ArrowRight"?1:-1);});
  $("#modal-close").addEventListener("click",()=>$("#case-modal").close());
  $("#case-modal").addEventListener("click",(event)=>{if(event.target.id==="case-modal")event.target.close();});
  search.addEventListener("input",()=>{state.query=search.value;render();});
  typeFilter.addEventListener("change",()=>{state.type=typeFilter.value;render();});
  styleFilter.addEventListener("change",()=>{state.style=styleFilter.value;render();});
  patternFilter.addEventListener("change",()=>{state.pattern=patternFilter.value;render();});
  $("#reset-filters").addEventListener("click",()=>{state.query="";state.type="";state.style="";state.pattern="";search.value="";typeFilter.value="";styleFilter.value="";patternFilter.value="";render();});
  document.addEventListener("keydown",(event)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();search.focus();}});
  loadCases();
})();
