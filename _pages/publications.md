---
layout: page
permalink: /publications/
title: Publications
description: publications by categories in reversed chronological order.
nav: true
nav_order: 2
---

{%- comment -%}
IRIS Lab style publications page.
Filter buttons appear above the publication list.
Each bib entry is wrapped in .pubitem with keyword-based classes
so the filter JS can show/hide entries by topic.
{% endcomment -%}

<link rel="stylesheet" href="{{ '/assets/css/publications.css' | relative_url }}">

<div class="publications">

  <!-- Page header: description + search box side by side -->
  <div class="pub-header">
    <p class="pub-description">{{ page.description }}</p>
    <input type="text" id="bibsearch" spellcheck="false" autocomplete="off" class="search bibsearch-form-input" placeholder="Type to filter">
  </div>

  <!-- Topic filter buttons -->
  <div class="pub-filter-buttons" id="pubFilterButtons">
    <button class="pub-filter-btn active" data-filter="all">Show all</button>
    {%- for kw in site.data.pub_filters -%}
      <button class="pub-filter-btn" data-filter="{{ kw.slug }}">{{ kw.label }}</button>
    {%- endfor -%}
  </div>

  <!-- Bibliography grouped by year -->
  <div class="bib-container">
    {% bibliography %}
  </div>

  <script src="{{ '/assets/js/bibsearch.js' | relative_url }}" type="module"></script>

</div>

<script>
(function () {
  /* ── Topic filter buttons ──────────────────────────────────────── */
  const btns = document.querySelectorAll('.pub-filter-btn');
  const lis  = document.querySelectorAll('.bibliography > li');

  function applyFilter(slug) {
    // 1. show/hide each <li>
    lis.forEach(li => {
      const pubitem = li.querySelector(':scope > .pubitem');
      if (!pubitem) return;
      if (slug === 'all') {
        li.classList.remove('pub-filter-hidden');
      } else {
        li.classList.toggle('pub-filter-hidden', !pubitem.classList.contains(slug));
      }
    });

    // 2. hide year headings that now have zero visible publications
    document.querySelectorAll('h2.bibliography').forEach(h2 => {
      const ol = h2.nextElementSibling;
      if (!ol || !ol.classList.contains('bibliography')) return;
      const visible = Array.from(ol.children).filter(li => !li.classList.contains('pub-filter-hidden'));
      h2.style.display = visible.length ? '' : 'none';
      ol.style.display = visible.length ? '' : 'none';
    });
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  /* ── Expandable Abs / Award / Bib panels ─────────────────────────
     The gem's common.js looks for .links > a.abstract etc.
     Our template uses .publinks instead, so wire it up here.
     Toggling the .open class shows/hides the panel via CSS.  */
  const toggleSpecs = [
    { trigger: '.publink.abstract', target: '.abstract.hidden' },
    { trigger: '.publink.award',    target: '.award.hidden' },
    { trigger: '.publink.bibtex',   target: '.bibtex.hidden' },
  ];

  toggleSpecs.forEach(spec => {
    document.querySelectorAll(spec.trigger).forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const pubitem = link.closest('.pubitem');
        if (!pubitem) return;
        const panel = pubitem.querySelector(spec.target);
        if (!panel) return;
        // close any other open panels in this pubitem
        pubitem.querySelectorAll('.abstract.hidden.open,.award.hidden.open,.bibtex.hidden.open')
          .forEach(p => { if (p !== panel) p.classList.remove('open'); });
        panel.classList.toggle('open');
      });
    });
  });
})();
</script>
