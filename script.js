(() => {
  "use strict";
  const CASES_URL = "data/cases.json";
  const $ = (selector, root = document) => root.querySelector(selector);
  const grid = $("#case-grid"), search = $("#search-input"), typeFilter = $("#type-filter"), styleFilter = $("#style-filter"), patternFilter = $("#pattern-filter");
  const state = {cases: [], query: "", type: "", style: "", pattern: ""};
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const safeHttpUrl = (value) => { try { const url = new URL(value); return ["http:","https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } };
  const uniq = (values) => [...new Set(values.filter((value) => typeof value === "string" && value.trim()))].sort((a,b) => a.localeCompare(b,"en"));
  const hasExactKeys = (value, keys) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every((key)=>Object.hasOwn(value,key));
  function validCase(item) {
    const caseKeys = ["id","name","url","screenshot","website_type","design_styles","analysis","components","ux_strengths","potential_issues","reusable_patterns","use_cases","tags","created_at"];
    const analysisKeys = ["overview","color_system","typography","layout","navigation","cta","interaction","information_hierarchy"];
    const patternKeys = ["name","description","best_for","advantages","limitations"];
    const stringArrays = ["design_styles","components","ux_strengths","potential_issues","use_cases","tags"];
    return hasExactKeys(item,caseKeys) && typeof item.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) && typeof item.name === "string" && !!safeHttpUrl(item.url) && typeof item.screenshot === "string" && typeof item.website_type === "string" && stringArrays.every((key)=>Array.isArray(item[key]) && item[key].every((value)=>typeof value === "string")) && hasExactKeys(item.analysis,analysisKeys) && analysisKeys.every((key)=>typeof item.analysis[key] === "string") && Array.isArray(item.reusable_patterns) && item.reusable_patterns.every((pattern)=>hasExactKeys(pattern,patternKeys) && ["name","description","best_for"].every((key)=>typeof pattern[key] === "string") && ["advantages","limitations"].every((key)=>Array.isArray(pattern[key]) && pattern[key].every((value)=>typeof value === "string"))) && /^\d{4}-\d{2}-\d{2}$/.test(item.created_at);
  }
  async function loadCases() {
    try {
      const response = await fetch(CASES_URL);
      if (!response.ok) throw new Error(`Could not load ${CASES_URL} (${response.status})`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("cases.json must contain an array of cases.");
      state.cases = data.filter(validCase);
      if (state.cases.length !== data.length) console.warn("Some invalid case records were skipped.");
      buildFilters();
      render();
      grid.setAttribute("aria-busy","false");
      if (!state.cases.length) showState("No valid cases yet. Add a case to data/cases.json to begin.");
    } catch (error) {
      console.error(error);
      grid.setAttribute("aria-busy","false");
      $("#result-count").textContent = "CASE DATA UNAVAILABLE";
      showState("Could not load data/cases.json. Run this project from a local static server or GitHub Pages.");
    }
  }
  function casePatterns(item) { return uniq([...item.components, ...item.reusable_patterns.map((pattern)=>pattern.name)]); }
  function fillFilter(select, label, values) {
    const selected = select.value;
    select.innerHTML = `<option value="">${escapeHTML(label)}</option>${values.map((value)=>`<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`).join("")}`;
    if (values.includes(selected)) select.value = selected;
  }
  function buildFilters() {
    fillFilter(typeFilter,"Website type",uniq(state.cases.map((item)=>item.website_type)));
    fillFilter(styleFilter,"Design style",uniq(state.cases.flatMap((item)=>item.design_styles)));
    fillFilter(patternFilter,"UI pattern",uniq(state.cases.flatMap(casePatterns)));
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
    $("#result-count").textContent = `${String(filtered.length).padStart(2,"0")} ${filtered.length === 1 ? "CASE" : "CASES"} / ${String(state.cases.length).padStart(2,"0")} IN ARCHIVE`;
    const hasFilters = !!(state.query || state.type || state.style || state.pattern);
    $("#reset-filters").hidden = !hasFilters;
    grid.innerHTML = filtered.map(cardHTML).join("");
    if (!filtered.length) showState(hasFilters ? "No cases match this search. Try another term or reset the filters." : "No cases yet. Add the first case to data/cases.json.");
    else hideState();
  }
  function cardHTML(item,index) {
    const screenshot = escapeHTML(item.screenshot);
    const styles = item.design_styles.slice(0,2).map(escapeHTML).join(" / ") || "Unclassified";
    const tags = uniq([...casePatterns(item),...item.tags]).slice(0,4).map((pattern)=>`<span class="card-tag">${escapeHTML(pattern)}</span>`).join("");
    const demo = item.tags.includes("demo") ? " · DEMO" : "";
    return `<article class="case-card" data-case-id="${escapeHTML(item.id)}" tabindex="0" role="button" aria-label="Study ${escapeHTML(item.name)}"><div class="screenshot-frame"><img src="${screenshot}" alt="${escapeHTML(item.name)} website screenshot" loading="lazy" data-image-fallback><span class="image-index">CASE ${String(index+1).padStart(2,"0")}${demo}</span><span class="image-open" aria-hidden="true">↗</span></div><div class="card-info"><div class="card-title-line"><h3>${escapeHTML(item.name)}</h3><span class="card-type">${escapeHTML(item.website_type)}</span></div><p class="card-style">${styles}</p><div class="card-tags">${tags}</div></div></article>`;
  }
  function showState(message) { const node = $("#page-state"); node.textContent = message; node.hidden = false; }
  function hideState() { $("#page-state").hidden = true; }
  function detailList(items) { return items.length ? `<ul>${items.map((item)=>`<li>${escapeHTML(item)}</li>`).join("")}</ul>` : `<p class="muted-copy">No notes recorded.</p>`; }
  function section(title,content,extra="") { return `<section class="modal-section ${extra}"><h3>${escapeHTML(title)}</h3>${content}</section>`; }
  function renderPattern(pattern) {
    return `<article class="pattern-card"><h4>${escapeHTML(pattern.name)}</h4><p>${escapeHTML(pattern.description)}</p><div class="pattern-fields"><div><strong>BEST FOR</strong><span>${escapeHTML(pattern.best_for || "Not specified")}</span></div><div><strong>ADVANTAGES</strong>${detailList(pattern.advantages)}</div><div><strong>LIMITATIONS</strong>${detailList(pattern.limitations)}</div></div></article>`;
  }
  function openModal(id) {
    const item = state.cases.find((entry)=>entry.id === id); if (!item) return;
    const url = safeHttpUrl(item.url);
    const demo = item.tags.includes("demo");
    const styles = item.design_styles.map((style)=>`<span class="taxonomy-chip">${escapeHTML(style)}</span>`).join("");
    const tags = item.tags.map((tag)=>`<span class="card-tag">${escapeHTML(tag)}</span>`).join("");
    const analysis = item.analysis;
    $("#modal-body").innerHTML = `<div class="modal-body"><div class="modal-heading"><div><p class="modal-kicker">CASE STUDY&nbsp; / &nbsp;${escapeHTML(item.id.toUpperCase())}</p><h2 id="modal-title">${escapeHTML(item.name)}</h2></div>${url ? `<a class="modal-url" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.url)} ↗</a>` : ""}</div>${demo ? `<div class="demo-banner">SYNTHETIC DEMO — illustrative UI, not a real website analysis.</div>` : ""}<img class="modal-hero-image" src="${escapeHTML(item.screenshot)}" alt="${escapeHTML(item.name)} website screenshot" data-image-fallback><div class="modal-taxonomy"><span class="taxonomy-chip type-chip">${escapeHTML(item.website_type)}</span>${styles}</div>${section("Design Overview",`<p>${escapeHTML(analysis.overview || "No analysis recorded.")}</p>`)}<div class="analysis-grid">${section("Color System",`<p>${escapeHTML(analysis.color_system || "No analysis recorded.")}</p>`)}${section("Typography",`<p>${escapeHTML(analysis.typography || "No analysis recorded.")}</p>`)}${section("Layout",`<p>${escapeHTML(analysis.layout || "No analysis recorded.")}</p>`)}${section("Navigation",`<p>${escapeHTML(analysis.navigation || "No analysis recorded.")}</p>`)}${section("CTA",`<p>${escapeHTML(analysis.cta || "No analysis recorded.")}</p>`)}${section("Interaction",`<p>${escapeHTML(analysis.interaction || "No analysis recorded.")}</p>`)}${section("Information Hierarchy",`<p>${escapeHTML(analysis.information_hierarchy || "No analysis recorded.")}</p>`)}</div>${section("UX Strengths",detailList(item.ux_strengths),"list-section")}${section("Potential Issues",detailList(item.potential_issues),"list-section")}${section("Reusable Patterns",item.reusable_patterns.length ? `<div class="pattern-list">${item.reusable_patterns.map(renderPattern).join("")}</div>` : `<p>No reusable patterns recorded.</p>`)}${section("Best For / Use Cases",detailList(item.use_cases),"list-section")}${section("Components",detailList(item.components),"list-section")}<section class="modal-section"><h3>TAGS</h3><div class="modal-tags">${tags || "—"}</div></section><div class="modal-footer">${url ? `<a class="visit-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Visit website <span aria-hidden="true">↗</span></a>` : ""}</div></div>`;
    const dialog = $("#case-modal");
    if (!dialog.open) dialog.showModal();
  }
  grid.addEventListener("click",(event)=>{const card=event.target.closest("[data-case-id]");if(card)openModal(card.dataset.caseId);});
  grid.addEventListener("keydown",(event)=>{const card=event.target.closest("[data-case-id]");if(card&&["Enter"," "].includes(event.key)){event.preventDefault();openModal(card.dataset.caseId);}});
  document.addEventListener("error",(event)=>{if(event.target.matches?.("img[data-image-fallback]")){const placeholder=document.createElement("div");placeholder.className=event.target.classList.contains("modal-hero-image")?"image-placeholder modal-image-placeholder":"image-placeholder";placeholder.setAttribute("role","img");placeholder.setAttribute("aria-label",`${event.target.alt} (image unavailable)`);placeholder.textContent="SCREENSHOT UNAVAILABLE";event.target.replaceWith(placeholder);}},{capture:true});
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
