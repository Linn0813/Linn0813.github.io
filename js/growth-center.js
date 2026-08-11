(() => {
  const root = document.getElementById('growth-center');
  if (!root) return;
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const list = values => `<ul>${values.map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`;

  function renderBrief(item) {
    return `<article class="gc-brief-card"><header><b>${escapeHtml(item.category)}</b><time>${escapeHtml(item.publishedAt)}</time></header><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.insight)}</p><div><small>为什么值得继续判断</small><strong>${escapeHtml(item.implication)}</strong></div><a href="${item.source}" target="_blank" rel="noopener">${escapeHtml(item.sourceName)} · 一手来源 ↗</a></article>`;
  }

  function renderSkill(item) {
    return `<article class="gc-skill-card gc-skill-detail-card"><header><div class="gc-skill-icon">${escapeHtml(item.icon)}</div><div><small>${escapeHtml(item.category)}</small><h3>${escapeHtml(item.name)}</h3></div><b>${escapeHtml(item.maturity)}</b></header><p>${escapeHtml(item.overview)}</p><div class="gc-skill-sections"><section><h4>适用场景</h4>${list(item.whenToUse)}</section><section><h4>输入</h4>${list(item.inputs)}</section><section class="gc-workflow"><h4>工作流</h4><ol>${item.workflow.map((value, index) => `<li><span>${index + 1}</span>${escapeHtml(value)}</li>`).join('')}</ol></section><section><h4>产出</h4>${list(item.outputs)}</section><section><h4>使用证据</h4>${list(item.evidence)}</section><section class="gc-limits"><h4>边界与限制</h4>${list(item.limitations)}</section></div><footer><span>使用 ${item.usageCount} 次 · 最近 ${escapeHtml(item.lastUsed)}</span><strong>下次验证：${escapeHtml(item.nextValidation)}</strong></footer></article>`;
  }

  function renderPlugin(group) {
    return `<article class="gc-plugin-card"><header><i>${escapeHtml(group.icon)}</i><div><small>插件能力</small><h3>${escapeHtml(group.name)}</h3></div></header><p>${escapeHtml(group.description)}</p><div class="gc-plugin-skills">${group.skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join('')}</div></article>`;
  }

  function render(data) {
    const view = root.dataset.view || 'overview';
    const workbench = data.workbench;
    root.innerHTML = `
      <nav class="gc-subnav" aria-label="成长沉淀页面">
        <a href="/growth/" data-growth-view="overview">总览</a>
        <a href="/growth/capabilities/" data-growth-view="capabilities">成长树说明</a>
        <a href="/growth/radar/" data-growth-view="radar">资讯分析</a>
        <a href="/growth/skills/" data-growth-view="skills">Skill 库</a>
        <a href="/growth/reviews/" data-growth-view="reviews">复盘沉淀</a>
        <a class="gc-workbench-nav" href="${workbench.url}" target="_blank" rel="noopener">进入私人工作台 ↗</a>
      </nav>

      <section class="gc-hero" data-growth-section="overview"><div><p>学习系统的公开沉淀层</p><em>这里展示结果，不反向定义你的能力</em></div><div class="gc-meta"><strong>${escapeHtml(data.meta.lastUpdated)}</strong><span>工作台是唯一源头</span></div></section>
      <section class="gc-stats" data-growth-section="overview"><div><strong>${workbench.treeDomains}</strong><span>成长树主枝</span></div><div><strong>${workbench.candidateDirections}</strong><span>工作台候选方向</span></div><div><strong>${workbench.dailySignals}</strong><span>本轮信息信号</span></div><div><strong>${data.skills.summary.personal}</strong><span>公开个人 Skill</span></div></section>
      <section class="gc-flow" data-growth-section="overview"><div><span>01</span><strong>外部资讯</strong><small>系统持续搜集</small></div><i>→</i><div><span>02</span><strong>私人成长树</strong><small>本人选择与自评</small></div><i>→</i><div><span>03</span><strong>实践与复盘</strong><small>工作台真实记录</small></div><i>→</i><div><span>04</span><strong>博客沉淀</strong><small>确认后才公开</small></div></section>
      <section class="gc-workbench-bridge" data-growth-section="overview"><div><small>THE ACTUAL WORKSPACE</small><h2>选择、打卡、自评与复盘，都在私人工作台完成</h2><p>博客不是成长树的数据源，也不会通过文章推断能力。文章只能是前面过程确认后的公开输出。</p></div><a href="${workbench.url}" target="_blank" rel="noopener">进入私人工作台 <span>需要本人登录</span></a></section>
      <section class="gc-learning-note" data-growth-section="overview"><strong>永久规则</strong><p>${escapeHtml(data.meta.sourcePolicy)}。${escapeHtml(data.meta.privacy)}。</p></section>
      <section class="gc-overview-links" data-growth-section="overview"><a href="/growth/capabilities/"><strong>成长树说明</strong><span>看结构和规则，不公开你的选择与等级</span></a><a href="/growth/radar/"><strong>资讯分析沉淀</strong><span>${data.researchBriefs.length} 条一手来源分析</span></a><a href="/growth/skills/"><strong>Skill 资产</strong><span>查看输入、工作流、产出和限制</span></a><a href="${workbench.url}" target="_blank" rel="noopener"><strong>开始今天的学习</strong><span>任务只来自你在工作台主动选择的方向</span></a></section>

      <section class="gc-section" data-growth-section="capabilities"><div class="gc-heading"><div><h2>成长树公开说明</h2></div><p>这里只公开树的结构。具体叶子、本人选择、自评等级和任务留在私人工作台。</p></div><div class="gc-domain-summary">${data.domainSummary.map((domain, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHtml(domain.name)}</h3><p>${domain.directionCount} 个方向在工作台持续维护</p></div></article>`).join('')}</div><aside class="gc-rule-card"><strong>成长树如何生长</strong><ol><li>从官方文档、研究报告和岗位变化中发现候选方向</li><li>由 Linn 决定加入、观察或暂停</li><li>水平只由 Linn 本人自评</li><li>真实实践与复盘形成沉淀，经确认后再公开</li></ol><a href="${workbench.url}" target="_blank" rel="noopener">进入完整成长树 ↗</a></aside></section>
      <section class="gc-section" data-growth-section="radar"><div class="gc-heading"><div><h2>每日资讯的分析沉淀</h2></div><p>资讯负责扩大可见范围，不自动变成学习任务或能力结论。</p></div><div class="gc-radar gc-brief-grid">${data.researchBriefs.map(renderBrief).join('')}</div></section>
      <section class="gc-section" data-growth-section="skills"><div class="gc-heading"><div><h2>公开 Skill 详情</h2></div><p>${data.skills.summary.personal} 个个人工作流资产 · ${escapeHtml(data.skills.lastSynced)}</p></div><div class="gc-skill-grid gc-skill-grid-v4">${data.skills.items.map(renderSkill).join('')}</div><details class="gc-plugin-vault"><summary>查看插件工具箱</summary><div class="gc-plugin-grid">${data.skills.pluginGroups.map(renderPlugin).join('')}</div></details></section>
      <section class="gc-section" data-growth-section="reviews"><div class="gc-heading"><div><h2>经确认的复盘沉淀</h2></div><p>详细复盘只保存在私人工作台，公开页面不会自动发布。</p></div><div class="gc-review-grid"><article><h3>每日复盘</h3><p>结果、困难和可复用经验经本人确认后，才会形成公开摘要。</p><strong>${data.reviews?.daily?.length ?? 0} 条公开摘要</strong></article><article><h3>每周复盘</h3><p>汇总只基于真实打卡，不读取博客文章作为能力证据。</p><strong>${data.reviews?.weekly?.length ?? 0} 条公开摘要</strong></article></div></section>
      <aside class="gc-privacy">单向数据流：工作台可以产生博客沉淀；博客永远不能反向修改成长方向、自评等级、每日任务或实践证据。</aside>`;

    root.querySelectorAll('[data-growth-section]').forEach(section => { section.hidden = section.dataset.growthSection !== view; });
    root.querySelectorAll('[data-growth-view]').forEach(link => { link.classList.toggle('is-active', link.dataset.growthView === view); });
  }

  fetch('/growth/dashboard.json', { cache: 'no-store' }).then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); }).then(render).catch(error => { root.innerHTML = `<div class="growth-loading">成长沉淀加载失败：${escapeHtml(error.message)}</div>`; });
})();
