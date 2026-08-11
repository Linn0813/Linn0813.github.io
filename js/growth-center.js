(() => {
  const root = document.getElementById('growth-center');
  if (!root) return;
  const WORKBENCH_URL = 'https://linn-growth-lab.yuxiaoling407.chatgpt.site';
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const list = values => `<ul>${values.map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`;

  function renderLearning(item) {
    return `<article class="gc-learning-card">
      <header><b>${escapeHtml(item.category)}</b><time>${escapeHtml(item.sourceDate)}</time></header>
      <h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.summary)}</p>
      <div><small>为什么值得关注</small><strong>${escapeHtml(item.whyNow)}</strong></div>
      <div><small>起步练习</small><strong>${escapeHtml(item.starterTask)}</strong></div>
      <a href="${item.source}" target="_blank" rel="noopener">${escapeHtml(item.sourceName)} ↗</a>
    </article>`;
  }

  function renderRadar(item) {
    return `<article><header><b>${escapeHtml(item.category)}</b><time>${escapeHtml(item.publishedAt)}</time></header>
      <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>
      <div><small>与你的关系</small><strong>${escapeHtml(item.whyUseful)}</strong></div>
      <a href="${item.source}" target="_blank" rel="noopener">${escapeHtml(item.sourceName)} · 一手来源 ↗</a></article>`;
  }

  function renderSkill(item) {
    return `<article class="gc-skill-card gc-skill-detail-card">
      <header><div class="gc-skill-icon">${escapeHtml(item.icon)}</div><div><small>${escapeHtml(item.category)}</small><h3>${escapeHtml(item.name)}</h3></div><b>${escapeHtml(item.maturity)}</b></header>
      <p>${escapeHtml(item.overview)}</p>
      <div class="gc-skill-sections"><section><h4>适用场景</h4>${list(item.whenToUse)}</section><section><h4>输入</h4>${list(item.inputs)}</section><section class="gc-workflow"><h4>工作流</h4><ol>${item.workflow.map((value, index) => `<li><span>${index + 1}</span>${escapeHtml(value)}</li>`).join('')}</ol></section><section><h4>产出</h4>${list(item.outputs)}</section><section><h4>使用证据</h4>${list(item.evidence)}</section><section class="gc-limits"><h4>边界与限制</h4>${list(item.limitations)}</section></div>
      <footer><span>使用 ${item.usageCount} 次 · 最近 ${escapeHtml(item.lastUsed)}</span><strong>下次验证：${escapeHtml(item.nextValidation)}</strong></footer>
    </article>`;
  }

  function renderPlugin(group) {
    return `<article class="gc-plugin-card"><header><i>${escapeHtml(group.icon)}</i><div><small>插件能力</small><h3>${escapeHtml(group.name)}</h3></div></header><p>${escapeHtml(group.description)}</p><div class="gc-plugin-skills">${group.skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join('')}</div></article>`;
  }

  function render(data) {
    const view = root.dataset.view || 'overview';
    root.innerHTML = `
      <nav class="gc-subnav" aria-label="成长中心页面">
        <a href="/growth/" data-growth-view="overview">总览</a>
        <a href="/growth/capabilities/" data-growth-view="capabilities">成长方向</a>
        <a href="/growth/radar/" data-growth-view="radar">资讯雷达</a>
        <a href="/growth/skills/" data-growth-view="skills">Skill 库</a>
        <a href="/growth/reviews/" data-growth-view="reviews">复盘</a>
        <a class="gc-workbench-nav" href="${WORKBENCH_URL}" target="_blank" rel="noopener">私人工作台 ↗</a>
      </nav>

      <section class="gc-hero" data-growth-section="overview">
        <div><p>持续学习系统</p><em>能力方向持续搜集，选择与水平由本人决定</em></div>
        <div class="gc-meta"><strong>${escapeHtml(data.meta.lastUpdated)}</strong><span>${escapeHtml(data.meta.sourceFreshness)}</span></div>
      </section>
      <section class="gc-stats" data-growth-section="overview">
        <div><strong>${data.learningPool.length}</strong><span>候选方向</span></div><div><strong>${data.radar.length}</strong><span>资讯信号</span></div><div><strong>${data.skills.summary.personal}</strong><span>个人 Skill</span></div><div><strong>本人</strong><span>唯一评级者</span></div>
      </section>
      <section class="gc-workbench-bridge" data-growth-section="overview">
        <div><small>PRIVATE WORKBENCH</small><h2>选择、打卡、自评与复盘，在私人工作台完成</h2><p>博客沉淀公开候选方向、资讯、Skill 和安全摘要；工作台保存你的选择、本人自评和每天的操作记录。</p></div>
        <a href="${WORKBENCH_URL}" target="_blank" rel="noopener">打开私人工作台 <span>需要本人登录</span></a>
      </section>
      <section class="gc-learning-note" data-growth-section="overview"><strong>重要规则</strong><p>博客文章可能由 AI 协助写作，因此不会被当作“已经掌握”的证据；工作台也不会从文章自动推断能力等级。</p></section>
      <section class="gc-overview-links" data-growth-section="overview">
        <a href="/growth/capabilities/"><strong>成长方向</strong><span>${data.learningPool.length} 个持续搜集的候选方向</span></a>
        <a href="/growth/radar/"><strong>资讯雷达</strong><span>${data.radar.length} 条一手来源信号</span></a>
        <a href="/growth/skills/"><strong>Skill 库</strong><span>查看输入、工作流、产出、证据和限制</span></a>
        <a href="${WORKBENCH_URL}" target="_blank" rel="noopener"><strong>今天做什么</strong><span>只根据你在工作台主动选择的方向生成</span></a>
      </section>

      <section class="gc-section" data-growth-section="capabilities"><div class="gc-heading"><div><h2>候选学习方向</h2></div><p>来自持续搜集的一手技术信号，不代表你已经掌握。加入个人成长树与水平自评在工作台完成。</p></div><div class="gc-learning-grid">${data.learningPool.map(renderLearning).join('')}</div></section>
      <section class="gc-section" data-growth-section="radar"><div class="gc-heading"><div><h2>资讯雷达</h2></div><p>信息收集不等于学习计划；只有你主动选择后才会进入每日任务。</p></div><div class="gc-radar gc-radar-v4">${data.radar.map(renderRadar).join('')}</div></section>
      <section class="gc-section" data-growth-section="skills"><div class="gc-heading"><div><h2>个人 Skill 详情</h2></div><p>${data.skills.summary.personal} 个个人资产 · ${data.skills.summary.plugin} 个插件能力 · ${escapeHtml(data.skills.lastSynced)}</p></div><div class="gc-skill-grid gc-skill-grid-v4">${data.skills.items.map(renderSkill).join('')}</div><details class="gc-plugin-vault"><summary>查看插件工具箱</summary><div class="gc-plugin-grid">${data.skills.pluginGroups.map(renderPlugin).join('')}</div></details></section>
      <section class="gc-section" data-growth-section="reviews"><div class="gc-heading"><div><h2>每日与每周复盘</h2></div><p>详细复盘只保存在私人工作台；公开页面仅展示经过确认的安全摘要。</p></div><div class="gc-review-grid"><article><h3>每日复盘</h3><p>围绕本人选择的学习方向记录结果、困难和可复用经验。</p><strong>${data.reviews?.daily?.length ?? 0} 条公开摘要</strong></article><article><h3>每周复盘</h3><p>由真实打卡汇总，不从博客文章推断能力。</p><strong>${data.reviews?.weekly?.length ?? 0} 条公开摘要</strong></article></div></section>
      <aside class="gc-privacy">公开博客不展示你的私有自评、详细工作记录和敏感项目内容。选择、自评和打卡保存在需要本人登录的工作台。</aside>`;

    root.querySelectorAll('[data-growth-section]').forEach(section => { section.hidden = section.dataset.growthSection !== view; });
    root.querySelectorAll('[data-growth-view]').forEach(link => { link.classList.toggle('is-active', link.dataset.growthView === view); });
  }

  fetch('/growth/dashboard.json', { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch(error => { root.innerHTML = `<div class="growth-loading">成长档案加载失败：${escapeHtml(error.message)}</div>`; });
})();
