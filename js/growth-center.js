(function () {
  'use strict';

  const root = document.getElementById('growth-center');
  if (!root) return;

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[char]);

  function renderLevel(current, target, levels) {
    return `<div class="gc-levels" aria-label="当前 ${levels[current]}，目标 ${levels[target]}">
      ${levels.map((level, index) => `<span class="${index <= current ? 'is-current' : ''} ${index === target ? 'is-target' : ''}" title="${escapeHtml(level)}"></span>`).join('')}
    </div><small>当前：${escapeHtml(levels[current])} · 目标：${escapeHtml(levels[target])}</small>`;
  }

  function renderCapability(item, levels, focus) {
    const evidence = item.evidence.length
      ? item.evidence.map(link => `<a href="${link.url}" target="_blank" rel="noopener">${escapeHtml(link.title)}</a>`).join('')
      : '<span class="gc-empty-inline">等待项目或博客证据</span>';
    return `<article class="gc-capability ${focus.includes(item.id) ? 'is-focus' : ''}">
      <header><h3>${escapeHtml(item.name)}</h3>${focus.includes(item.id) ? '<b>当前重点</b>' : ''}</header>
      ${renderLevel(item.current, item.target, levels)}
      <dl><div><dt>能力缺口</dt><dd>${escapeHtml(item.gap)}</dd></div><div><dt>下一步</dt><dd>${escapeHtml(item.next)}</dd></div></dl>
      <div class="gc-evidence"><strong>已有证据</strong>${evidence}</div>
    </article>`;
  }

  function renderSkill(item) {
    const tags = item.capabilities.map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
    const proof = item.proof.map(value => `<li>${escapeHtml(value)}</li>`).join('');
    return `<article class="gc-skill-card">
      <header><div class="gc-skill-icon">${escapeHtml(item.icon)}</div><div><small>${escapeHtml(item.category)}</small><h3>${escapeHtml(item.name)}</h3></div><b data-maturity="${escapeHtml(item.maturity)}">${escapeHtml(item.maturity)}</b></header>
      <p>${escapeHtml(item.description)}</p>
      <dl><div><dt>适用场景</dt><dd>${escapeHtml(item.trigger)}</dd></div><div><dt>输入</dt><dd>${escapeHtml(item.input)}</dd></div><div><dt>产出</dt><dd>${escapeHtml(item.output)}</dd></div></dl>
      <div class="gc-skill-tags">${tags}</div>
      <div class="gc-skill-proof"><strong>资产证据</strong><ul>${proof}</ul></div>
      <footer>最后更新 ${escapeHtml(item.updatedAt)}</footer>
    </article>`;
  }

  function renderPluginGroup(group) {
    const skills = group.skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join('');
    return `<article class="gc-plugin-card">
      <header><i>${escapeHtml(group.icon)}</i><div><small>插件能力</small><h3>${escapeHtml(group.name)}</h3></div><b>${group.skills.length}</b></header>
      <p>${escapeHtml(group.description)}</p>
      <div class="gc-plugin-skills">${skills}</div>
    </article>`;
  }

  function render(data) {
    const total = data.domains.reduce((sum, domain) => sum + domain.capabilities.length, 0);
    const independent = data.domains.flatMap(domain => domain.capabilities).filter(item => item.current >= 3).length;
    const gap = data.domains.flatMap(domain => domain.capabilities).filter(item => item.current < item.target).length;
    root.innerHTML = `
      <section class="gc-hero">
        <div><span>AI GROWTH WORKSPACE</span><h1>${escapeHtml(data.meta.title)}</h1><p>${escapeHtml(data.meta.target)}</p><em>${escapeHtml(data.meta.positioning)}</em></div>
        <div class="gc-meta"><strong>${escapeHtml(data.meta.lastUpdated)}</strong><span>${escapeHtml(data.meta.sourceFreshness)}</span></div>
      </section>

      <section class="gc-stats">
        <div><strong>${total}</strong><span>跟踪能力</span></div><div><strong>${independent}</strong><span>达到独立</span></div><div><strong>${gap}</strong><span>仍有差距</span></div><div><strong>${data.focus.length}</strong><span>当前重点</span></div>
      </section>

      <section class="gc-today">
        <div class="gc-today-mark">今日</div><div><time>${escapeHtml(data.today.date)}</time><h2>${escapeHtml(data.today.title)}</h2><p>${escapeHtml(data.today.reason)}</p><ul><li>时间：${escapeHtml(data.today.timebox)}</li><li>交付：${escapeHtml(data.today.deliverable)}</li></ul></div>
        <button id="gc-copy-feedback">复制完成反馈</button>
      </section>

      <section class="gc-section"><div class="gc-heading"><div><span>CAPABILITY GRAPH</span><h2>智能能力图谱</h2></div><p>能力等级由理解、实践与项目证据共同决定。</p></div>
        <div class="gc-domains">${data.domains.map(domain => `<section class="gc-domain"><header><i>${domain.icon}</i><h2>${escapeHtml(domain.name)}</h2></header><div>${domain.capabilities.map(item => renderCapability(item, data.levels, data.focus)).join('')}</div></section>`).join('')}</div>
      </section>

      <section class="gc-section"><div class="gc-heading"><div><span>TECH RADAR</span><h2>最新技术与岗位信号</h2></div><p>只保留与目标相关、来源可追溯的变化。</p></div>
        <div class="gc-radar">${data.radar.map(item => `<article><b>${escapeHtml(item.type)}</b><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.relevance)}</p><a href="${item.source}" target="_blank" rel="noopener">${escapeHtml(item.sourceName)} · 扫描于 ${escapeHtml(item.scannedAt)}</a></article>`).join('')}</div>
      </section>

      <section class="gc-section"><div class="gc-heading"><div><span>SKILL ASSETS</span><h2>我的 Skill 资产库</h2></div><p>${data.skills.summary.personal} 个个人资产 · ${data.skills.summary.plugin} 个插件能力 · 同步于 ${escapeHtml(data.skills.lastSynced)}</p></div>
        <div class="gc-skill-intro"><strong>个人 Skill 是可带走的工作资产，插件 Skill 是当前可调用的能力工具箱。</strong><span>插件被结合你的流程深度定制后，可以升级为定制资产。</span></div>
        <div class="gc-skill-filters" role="tablist" aria-label="Skill 分类">
          <button class="is-active" data-skill-filter="all">全部 <b>${data.skills.summary.personal + data.skills.summary.customized + data.skills.summary.plugin}</b></button>
          <button data-skill-filter="personal">我的资产 <b>${data.skills.summary.personal}</b></button>
          <button data-skill-filter="customized">定制资产 <b>${data.skills.summary.customized}</b></button>
          <button data-skill-filter="plugin">插件能力 <b>${data.skills.summary.plugin}</b></button>
        </div>
        <div class="gc-skill-panel" data-skill-panel="personal"><div class="gc-skill-grid">${data.skills.items.filter(item => item.kind === 'personal').map(renderSkill).join('')}</div></div>
        <div class="gc-skill-panel" data-skill-panel="customized" data-empty="true" hidden><div class="gc-skill-empty"><strong>还没有定制资产</strong><span>当通用 Skill 被加入你的规则、模板和验证流程后，会出现在这里。</span></div></div>
        <div class="gc-skill-panel" data-skill-panel="plugin"><div class="gc-plugin-grid">${data.skills.pluginGroups.map(renderPluginGroup).join('')}</div></div>
      </section>

      <section class="gc-section"><div class="gc-heading"><div><span>REVIEWS</span><h2>每日与每周复盘</h2></div></div>
        <div class="gc-review-grid"><article><h3>每日复盘</h3><p>由 AI 根据今日任务生成，只补充完成结果、最大困难和可复用经验。</p><strong>${data.reviews.daily.length} 条记录</strong></article><article><h3>每周复盘</h3><p>汇总成果、能力变化、面试故事和下周唯一重点。</p><strong>${data.reviews.weekly.length} 条记录</strong></article></div>
      </section>

      <aside class="gc-privacy">公开页面只展示安全摘要。职业困惑、真实公司项目和详细复盘保存在私人成长档案中，由 AI 助手维护。</aside>`;

    document.getElementById('gc-copy-feedback').addEventListener('click', async event => {
      const text = `我完成了今日成长任务「${data.today.title}」。结果是：\n最大困难：\n我学到的可复用经验：\n形成的证据：`;
      try { await navigator.clipboard.writeText(text); event.currentTarget.textContent = '已复制，发给成长助手'; }
      catch (_) { window.prompt('复制下面内容发给成长助手：', text); }
    });

    const skillButtons = [...root.querySelectorAll('[data-skill-filter]')];
    const skillPanels = [...root.querySelectorAll('[data-skill-panel]')];
    skillButtons.forEach(button => button.addEventListener('click', () => {
      const filter = button.dataset.skillFilter;
      skillButtons.forEach(item => item.classList.toggle('is-active', item === button));
      skillPanels.forEach(panel => {
        panel.hidden = filter === 'all' ? panel.dataset.empty === 'true' : panel.dataset.skillPanel !== filter;
      });
    }));
  }

  fetch('/growth/dashboard.json', { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch(error => { root.innerHTML = `<div class="growth-loading">成长档案加载失败：${escapeHtml(error.message)}</div>`; });
})();
