(() => {
  const root = document.getElementById('growth-center');
  if (!root) return;
  const workbenchUrl = 'https://linn-growth-lab.linnlingling.workers.dev/';
  const publicGrowthUrl = 'https://linn-growth-lab.linnlingling.workers.dev/public/growth.json';

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
  const list = values => `<ul>${(values ?? []).map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`;

  function renderSkill(item) {
    return `<details class="gc-public-skill">
      <summary><span>${escapeHtml(item.icon)}</span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category)} · ${escapeHtml(item.maturity)}</small></div><time>${escapeHtml(item.lastUsed)}</time></summary>
      <div class="gc-public-skill-detail"><p>${escapeHtml(item.overview)}</p><div class="gc-skill-sections"><section><h4>适用场景</h4>${list(item.whenToUse)}</section><section><h4>输入</h4>${list(item.inputs)}</section><section class="gc-workflow"><h4>工作流</h4><ol>${(item.workflow ?? []).map((value, index) => `<li><span>${index + 1}</span>${escapeHtml(value)}</li>`).join('')}</ol></section><section><h4>产出</h4>${list(item.outputs)}</section><section class="gc-limits"><h4>边界与限制</h4>${list(item.limitations)}</section></div><footer>最近更新 ${escapeHtml(item.lastUsed)}</footer></div>
    </details>`;
  }

  function renderCapabilityPackage(item, skillsById) {
    const relatedSkills = (item.skillIds ?? []).map(id => skillsById.get(id)).filter(Boolean);
    return `<article class="gc-capability-package">
      <header><small>${escapeHtml(item.domain)}</small><h3>${escapeHtml(item.name)}</h3></header>
      <p>${escapeHtml(item.summary)}</p>
      <section><h4>解决的问题</h4><p>${escapeHtml(item.problem)}</p></section>
      ${(item.components ?? []).length ? `<section><h4>核心组成</h4><ul>${item.components.map(component => `<li><strong>${escapeHtml(component.layer)}</strong><span>${escapeHtml(component.name)}</span></li>`).join('')}</ul></section>` : ''}
      ${relatedSkills.length ? `<section><h4>相关 Skill</h4><div class="gc-related-skills">${relatedSkills.map(skill => `<span>${escapeHtml(skill.name)}</span>`).join('')}</div></section>` : ''}
      ${item.evolution ? `<section class="gc-capability-evolution"><h4>能力演进</h4><p>${escapeHtml(item.evolution)}</p></section>` : ''}
    </article>`;
  }

  function renderDigest(item) {
    return `<article class="gc-digest-row"><time>${escapeHtml(item.date)}</time><div><h3><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.summary)}</p><small>${Number(item.itemCount) || 0} 条精选资讯</small></div><a href="${escapeHtml(item.url)}" aria-label="查看 ${escapeHtml(item.title)}">查看 →</a></article>`;
  }

  function renderPublicTree(projection) {
    const domains = projection?.tree?.domains ?? [];
    if (!projection) return '<p class="gc-public-empty">已掌握内容暂时无法读取，请稍后刷新。</p>';
    if (!domains.length) return '<p class="gc-public-empty">目前还没有公开已掌握的内容。完成学习并在私人工作台主动确认后，才会显示在这里。</p>';
    return `<div class="gc-public-tree">${domains.map((domain, domainIndex) => `
      <details class="gc-tree-domain" ${domainIndex === 0 ? 'open' : ''}>
        <summary><span>${String(domainIndex + 1).padStart(2, '0')}</span><strong>${escapeHtml(domain.name)}</strong><small>${domain.modules?.length ?? 0} 个模块</small></summary>
        <div>${(domain.modules ?? []).map(module => `
          <section class="gc-tree-module"><h3>${escapeHtml(module.name)}</h3><div>
            ${(module.contents ?? []).map(content => `<article class="gc-tree-content is-mastered"><div><strong>${escapeHtml(content.name)}</strong><small>已掌握</small></div>${content.masteredAt ? `<time>${escapeHtml(String(content.masteredAt).slice(0, 10))}</time>` : ''}</article>`).join('')}
          </div></section>`).join('')}</div>
      </details>`).join('')}</div>`;
  }

  function render(data, projection) {
    const view = root.dataset.view || 'overview';
    const digests = Array.isArray(data.informationDigests) ? data.informationDigests : [];
    const projectedMastered = Array.isArray(projection?.masteredCapabilities) ? projection.masteredCapabilities : null;
    const mastered = projectedMastered ?? (Array.isArray(data.masteredCapabilities) ? data.masteredCapabilities : []);
    const skills = [...(data.skills?.items ?? [])].sort((a, b) => String(b.lastUsed).localeCompare(String(a.lastUsed)));
    const skillsById = new Map(skills.map(skill => [skill.id, skill]));
    const capabilityPackages = data.capabilityPackages?.items ?? [];
    const pluginGroups = data.skills?.pluginGroups ?? [];
    const latestDigest = digests[0];
    const latestSkill = skills[0];

    root.innerHTML = `
      <nav class="gc-subnav" aria-label="成长记录页面">
        <a href="/growth/" data-growth-view="overview">总览</a>
        <a href="/growth/capabilities/" data-growth-view="capabilities">能力资产</a>
        <a href="/growth/radar/" data-growth-view="radar">每日资讯</a>
        <a href="/growth/skills/" data-growth-view="skills">Skill 库</a>
        <a class="gc-workbench-nav" href="${workbenchUrl}" target="_blank" rel="noopener noreferrer">私人工作台</a>
      </nav>

      <section class="gc-owner-intro" data-growth-section="overview"><p>我的成长记录</p><h2>展示我已经形成的专业能力、工作方法和持续沉淀</h2><span>持续更新于 ${escapeHtml(data.meta?.lastUpdated)}</span></section>
      <section class="gc-owner-stats" data-growth-section="overview"><div><strong>${capabilityPackages.length}</strong><span>公开能力包</span></div><div><strong>${digests.length}</strong><span>每日资讯整理</span></div><div><strong>${skills.length}</strong><span>个人 Skill</span></div></section>
      <section class="gc-owner-links" data-growth-section="overview"><a href="/growth/radar/"><small>最近的资讯整理</small><strong>${latestDigest ? escapeHtml(latestDigest.title) : '第一篇资讯整理完成后会出现在这里'}</strong><span>${latestDigest ? escapeHtml(latestDigest.date) : '等待首次公开沉淀'} →</span></a><a href="/growth/skills/"><small>最近更新的 Skill</small><strong>${latestSkill ? escapeHtml(latestSkill.name) : 'Skill 资产正在整理'}</strong><span>${latestSkill ? `${escapeHtml(latestSkill.category)} · ${escapeHtml(latestSkill.maturity)}` : '查看 Skill 库'} →</span></a></section>
      <section class="gc-mastered-preview" data-growth-section="overview"><div class="gc-heading"><div><h2>已经形成的能力</h2></div><p>只展示已完成、可说明且经过脱敏的能力包</p></div>${capabilityPackages.length ? `<ul>${capabilityPackages.map(item => `<li><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.domain)}</span></li>`).join('')}</ul><a class="gc-tree-link" href="/growth/capabilities/">查看能力资产 →</a>` : '<p class="gc-public-empty">完成并确认公开的能力包会出现在这里。</p>'}</section>

      <section class="gc-section" data-growth-section="capabilities"><div class="gc-heading"><div><h2>我的能力资产</h2></div><p>按真实问题组织，只呈现已经形成且有助于理解的组成</p></div>${capabilityPackages.length ? `<div class="gc-capability-package-grid">${capabilityPackages.map(item => renderCapabilityPackage(item, skillsById)).join('')}</div>` : '<p class="gc-public-empty">完成并确认公开的能力包会出现在这里。</p>'}</section>

      <section class="gc-section" data-growth-section="radar"><div class="gc-heading"><div><h2>每日资讯</h2></div><p>每天一篇，只保留我判断后值得留下的内容</p></div>${digests.length ? `<div class="gc-digest-list">${digests.map(renderDigest).join('')}</div>` : '<p class="gc-public-empty">第一篇资讯整理完成后会出现在这里。之后可以按日期查看每天筛选过的内容和详细来源。</p>'}</section>

      <section class="gc-section" data-growth-section="skills"><div class="gc-heading"><div><h2>我的 Skill</h2></div><p>${skills.length} 个个人工作流资产 · 点击查看详情</p></div><div class="gc-public-skill-list">${skills.map(renderSkill).join('')}</div><details class="gc-plugin-vault"><summary>插件能力 · ${Number(data.skills?.summary?.plugin) || 0} 项</summary><div class="gc-plugin-list">${pluginGroups.map(group => `<details><summary><span>${escapeHtml(group.icon)}</span><strong>${escapeHtml(group.name)}</strong></summary><p>${escapeHtml(group.description)}</p><small>${(group.skills ?? []).map(escapeHtml).join(' · ')}</small></details>`).join('')}</div></details></section>`;

    root.querySelectorAll('[data-growth-section]').forEach(section => {
      section.hidden = section.dataset.growthSection !== view;
    });
    root.querySelectorAll('[data-growth-view]').forEach(link => {
      link.classList.toggle('is-active', link.dataset.growthView === view);
    });
  }

  Promise.all([
    fetch('/growth/dashboard.json', { cache: 'no-store' }).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }),
    fetch(publicGrowthUrl, { cache: 'no-store' })
      .then(response => (response.ok ? response.json() : null))
      .catch(() => null),
  ])
    .then(([data, projection]) => render(data, projection))
    .catch(error => {
      root.innerHTML = `<div class="growth-loading">内容加载失败：${escapeHtml(error.message)}</div>`;
    });
})();
