(() => {
  const root = document.getElementById('growth-center');
  if (!root) return;
  const workbenchUrl = 'https://linn-growth-lab.yuxiaoling407.chatgpt.site/';

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
  const list = values => `<ul>${(values ?? []).map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`;

  function renderSkill(item) {
    return `<details class="gc-public-skill">
      <summary><span>${escapeHtml(item.icon)}</span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category)} · ${escapeHtml(item.maturity)}</small></div><time>${escapeHtml(item.lastUsed)}</time></summary>
      <div class="gc-public-skill-detail"><p>${escapeHtml(item.overview)}</p><div class="gc-skill-sections"><section><h4>适用场景</h4>${list(item.whenToUse)}</section><section><h4>输入</h4>${list(item.inputs)}</section><section class="gc-workflow"><h4>工作流</h4><ol>${(item.workflow ?? []).map((value, index) => `<li><span>${index + 1}</span>${escapeHtml(value)}</li>`).join('')}</ol></section><section><h4>产出</h4>${list(item.outputs)}</section><section><h4>使用证据</h4>${list(item.evidence)}</section><section class="gc-limits"><h4>边界与限制</h4>${list(item.limitations)}</section></div><footer>使用 ${Number(item.usageCount) || 0} 次 · 最近 ${escapeHtml(item.lastUsed)}</footer></div>
    </details>`;
  }

  function renderDigest(item) {
    return `<article class="gc-digest-row"><time>${escapeHtml(item.date)}</time><div><h3><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.summary)}</p><small>${Number(item.itemCount) || 0} 条精选资讯</small></div><a href="${escapeHtml(item.url)}" aria-label="查看 ${escapeHtml(item.title)}">查看 →</a></article>`;
  }

  function render(data) {
    const view = root.dataset.view || 'overview';
    const digests = Array.isArray(data.informationDigests) ? data.informationDigests : [];
    const mastered = Array.isArray(data.masteredCapabilities) ? data.masteredCapabilities : [];
    const skills = [...(data.skills?.items ?? [])].sort((a, b) => String(b.lastUsed).localeCompare(String(a.lastUsed)));
    const pluginGroups = data.skills?.pluginGroups ?? [];
    const latestDigest = digests[0];
    const latestSkill = skills[0];

    root.innerHTML = `
      <nav class="gc-subnav" aria-label="成长记录页面">
        <a href="/growth/" data-growth-view="overview">总览</a>
        <a href="/growth/radar/" data-growth-view="radar">每日资讯</a>
        <a href="/growth/skills/" data-growth-view="skills">Skill 库</a>
        <a class="gc-workbench-nav" href="${workbenchUrl}" target="_blank" rel="noopener noreferrer">私人工作台</a>
      </nav>

      <section class="gc-owner-intro" data-growth-section="overview"><p>我的成长记录</p><h2>把掌握的能力、筛选过的资讯和反复使用的工作流留在这里</h2><span>持续更新于 ${escapeHtml(data.meta?.lastUpdated)}</span></section>
      <section class="gc-owner-stats" data-growth-section="overview"><div><strong>${mastered.length}</strong><span>已公开掌握能力</span></div><div><strong>${digests.length}</strong><span>每日资讯整理</span></div><div><strong>${skills.length}</strong><span>个人 Skill</span></div></section>
      <section class="gc-owner-links" data-growth-section="overview"><a href="/growth/radar/"><small>最近的资讯整理</small><strong>${latestDigest ? escapeHtml(latestDigest.title) : '第一篇资讯整理完成后会出现在这里'}</strong><span>${latestDigest ? escapeHtml(latestDigest.date) : '等待首次公开沉淀'} →</span></a><a href="/growth/skills/"><small>最近更新的 Skill</small><strong>${latestSkill ? escapeHtml(latestSkill.name) : 'Skill 资产正在整理'}</strong><span>${latestSkill ? `${escapeHtml(latestSkill.category)} · ${escapeHtml(latestSkill.maturity)}` : '查看 Skill 库'} →</span></a></section>
      <section class="gc-mastered-preview" data-growth-section="overview"><div class="gc-heading"><div><h2>我已经掌握的能力</h2></div><p>只展示由我亲自标记为已掌握的内容</p></div>${mastered.length ? `<ul>${mastered.map(item => `<li><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.category)}</span></li>`).join('')}</ul>` : '<p class="gc-public-empty">公开能力树还在重整。确定新的树结构后，这里只会出现已经掌握的节点。</p>'}</section>

      <section class="gc-section" data-growth-section="capabilities"><div class="gc-heading"><div><h2>能力树正在重整</h2></div></div><p class="gc-public-empty">候选方向、正在学习和自评内容保留在私人工作台。公开树确定后，只展示已经掌握的节点及其博文、Skill 和项目证据。</p></section>

      <section class="gc-section" data-growth-section="radar"><div class="gc-heading"><div><h2>每日资讯</h2></div><p>每天一篇，只保留我判断后值得留下的内容</p></div>${digests.length ? `<div class="gc-digest-list">${digests.map(renderDigest).join('')}</div>` : '<p class="gc-public-empty">第一篇资讯整理完成后会出现在这里。之后可以按日期查看每天筛选过的内容和详细来源。</p>'}</section>

      <section class="gc-section" data-growth-section="skills"><div class="gc-heading"><div><h2>我的 Skill</h2></div><p>${skills.length} 个个人工作流资产 · 点击查看详情</p></div><div class="gc-public-skill-list">${skills.map(renderSkill).join('')}</div><details class="gc-plugin-vault"><summary>插件能力 · ${Number(data.skills?.summary?.plugin) || 0} 项</summary><div class="gc-plugin-list">${pluginGroups.map(group => `<details><summary><span>${escapeHtml(group.icon)}</span><strong>${escapeHtml(group.name)}</strong></summary><p>${escapeHtml(group.description)}</p><small>${(group.skills ?? []).map(escapeHtml).join(' · ')}</small></details>`).join('')}</div></details></section>`;

    root.querySelectorAll('[data-growth-section]').forEach(section => {
      section.hidden = section.dataset.growthSection !== view;
    });
    root.querySelectorAll('[data-growth-view]').forEach(link => {
      link.classList.toggle('is-active', link.dataset.growthView === view);
    });
  }

  fetch('/growth/dashboard.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(render)
    .catch(error => {
      root.innerHTML = `<div class="growth-loading">内容加载失败：${escapeHtml(error.message)}</div>`;
    });
})();
