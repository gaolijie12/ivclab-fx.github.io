/*
 * al-folio i18n language toggle (target language)
 *
 * Injected by _plugins/al_lang_injector.rb before </body> on every page.
 * - inserts a single-label target-language button into the nav bar
 * - toggles content blocks marked <div data-lang="en">/<div data-lang="zh">
 * - rewrites nav labels, a small set of UI strings and the page title
 * - persists the preference in localStorage("al_lang_v2"), default: zh
 *
 * No template overrides: the gem's markup is only read, never replaced.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "al_lang_v2"; // Ignore the previous English-default cache.
  var DEFAULT_LANG = "zh";
  var currentLang = storedLang();

  // Nav bar labels, keyed by path segment ("/" => "", "/publications/" => "publications").
  // Links whose path is not in the map are left untouched.
  var NAV_TEXTS = {
    en: {
      "": "about",
      publications: "publications",
      repositories: "repositories",
      people: "people",
    },
    zh: {
      "": "关于",
      publications: "论文",
      repositories: "代码库",
      people: "成员",
    },
  };

  // UI chrome pairs [lowercase english text, chinese]. Replaced only when an
  // element's ENTIRE visible text matches and it has no element children,
  // so body content is never touched here.
  var UI_PAIRS = [
    ["abs", "摘要"],
    ["details", "详情"],
    ["latest news", "最新动态"],
    ["latest posts", "最新文章"],
    ["selected publications", "精选论文"],
    ["related posts", "相关文章"],
    ["enjoy reading this article?", "喜欢这篇文章吗？"],
    ["back to top", "返回顶部"],
  ];

  var UI_TO_ZH = {};
  var UI_TO_EN = {};
  for (var p = 0; p < UI_PAIRS.length; p++) {
    UI_TO_ZH[UI_PAIRS[p][0]] = UI_PAIRS[p][1];
    UI_TO_EN[UI_PAIRS[p][1]] = UI_PAIRS[p][0];
  }

  var FOOTER_ZH =
    '由 <a href="https://jekyllrb.com/" target="_blank">Jekyll</a> 与 ' +
    '<a href="https://github.com/alshedivat/al-folio">al-folio</a> 主题驱动。' +
    ' 由 <a href="https://pages.github.com/" target="_blank">GitHub Pages</a> 托管。' +
    ' 图片来自 <a href="https://unsplash.com" target="_blank">Unsplash</a>。';

  var footerOriginal = null; // captured lazily; used to restore EN footer

  function storedLang() {
    var v = null;
    try {
      v = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* private mode */
    }
    return v === "zh" || v === "en" ? v : DEFAULT_LANG;
  }

  function injectStyles() {
    if (document.getElementById("al-lang-styles")) return;
    var style = document.createElement("style");
    style.id = "al-lang-styles";
    style.textContent =
      'html[data-lang="en"] [data-lang="zh"],' +
      'html[data-lang="zh"] [data-lang="en"]{display:none!important}' +
      "#al-lang-toggle-container{display:flex;align-items:center}" +
      "#al-lang-toggle{display:inline-flex;align-items:center;gap:.25rem;" +
      "border:0;border-radius:0;box-shadow:none;" +
      "padding:.1rem .5rem;font-size:.78em;line-height:1.4;cursor:pointer;" +
      "color:inherit;background:transparent;vertical-align:middle;white-space:nowrap}" +
      ".profile figure img{box-shadow:none!important;border-radius:0!important;transition:opacity .26s ease}" +
      "@media (max-width: 767px){#al-lang-toggle-container{align-items:flex-start;margin-top:.5rem}}";
    document.head.appendChild(style);
  }

  function mountButton() {
    if (document.getElementById("al-lang-toggle")) return;

    var li = document.createElement("li");
    li.className = "nav-item";
    li.id = "al-lang-toggle-container";

    var btn = document.createElement("button");
    btn.id = "al-lang-toggle";
    btn.type = "button";
    btn.addEventListener("click", function () {
      applyLang(currentLang === "en" ? "zh" : "en");
    });
    li.appendChild(btn);

    var anchors = [document.getElementById("light-toggle"), document.getElementById("search-toggle")];
    var placed = false;
    for (var i = 0; i < anchors.length; i++) {
      if (anchors[i] && anchors[i].parentElement) {
        anchors[i].parentElement.after(li);
        placed = true;
        break;
      }
    }
    if (!placed) {
      var menu = document.querySelector("#navbarNav .navbar-menu-list") || document.querySelector(".navbar-nav");
      if (menu) {
        menu.appendChild(li);
      }
    }
    refreshButton(currentLang);
  }

  function refreshButton(lang) {
    var btn = document.getElementById("al-lang-toggle");
    if (!btn) return;
    var label = lang === "zh" ? "EN" : "中文";
    var hint = lang === "zh" ? "切换到英文" : "Switch to Chinese";
    btn.textContent = label;
    btn.setAttribute("aria-label", hint);
    btn.setAttribute("title", hint);
    btn.setAttribute("lang", lang === "zh" ? "en" : "zh-CN");
  }

  // Directory prefix of the site baseurl, read from the <base> tag
  // (e.g. "al-folio" when served under /al-folio/, "" when baseurl is empty).
  var sitePrefixCache = null;
  function sitePrefix() {
    if (sitePrefixCache !== null) return sitePrefixCache;
    sitePrefixCache = "";
    var baseEl = document.querySelector("base");
    if (baseEl) {
      try {
        var u = new URL(baseEl.getAttribute("href") || "", window.location.href);
        sitePrefixCache = u.pathname.split("/").filter(Boolean).join("/");
      } catch (e) {
        /* keep "" */
      }
    }
    return sitePrefixCache;
  }

  function navSegment(link) {
    var href = link.getAttribute("href") || "";
    var path = href.split("?")[0].split("#")[0];
    // Site-internal links only: relative or starting with "/" (after baseurl).
    if (path.indexOf("http") === 0 && path.indexOf("//") !== 0) return null;
    var prefix = sitePrefix();
    var rel = path.charAt(0) === "/" ? path.slice(1) : path;
    if (prefix && rel.indexOf(prefix + "/") === 0) {
      rel = rel.slice(prefix.length + 1);
    } else if (prefix && rel === prefix) {
      rel = "";
    }
    var parts = rel.split("/").filter(Boolean);
    // Last path segment is the page key; the homepage (no segments) is "".
    return parts.length ? parts[parts.length - 1] : "";
  }

  function rewriteNav(lang) {
    var texts = NAV_TEXTS[lang];
    var scope = document.getElementById("navbar") || document;
    var links = scope.querySelectorAll(".navbar-menu-list a, .nav-item a, a.nav-link");
    for (var i = 0; i < links.length; i++) {
      var seg = navSegment(links[i]);
      if (seg !== null && texts[seg] !== undefined) {
        links[i].textContent = texts[seg];
      }
    }
  }

  function rewriteUiStrings(lang) {
    var map = lang === "zh" ? UI_TO_ZH : UI_TO_EN;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
    var node;
    while ((node = walker.nextNode())) {
      if (node.childElementCount > 0) continue;
      var text = node.textContent.trim().toLowerCase();
      if (!text) continue;
      var replacement = map[text];
      if (replacement !== undefined) {
        node.textContent = replacement;
      }
    }
  }

  function footerEl() {
    return document.querySelector("#footer p") || document.querySelector("footer p");
  }

  function rewriteFooter(lang) {
    var footer = footerEl();
    if (!footer) return;
    var current = footer.innerHTML.trim();
    if (lang === "zh") {
      if (footerOriginal === null) {
        footerOriginal = current; // remember the built-in (EN) footer
      }
      if (current === footerOriginal || /Powered by/i.test(current)) {
        footer.innerHTML = FOOTER_ZH;
      }
    } else if (footerOriginal !== null && footer.innerHTML.trim() === FOOTER_ZH) {
      footer.innerHTML = footerOriginal;
    }
  }

  function rewritePageTitle(lang) {
    var page = window.AL_I18N_PAGE;
    if (!page || !page[lang]) return;
    var entry = page[lang];
    if (entry.title) {
      document.title = entry.title;
    }
    var h1 = document.querySelector("main h1") || document.querySelector("h1");
    if (h1 && h1.childElementCount === 0) {
      var t = h1.textContent.trim();
      if ((page.en && t === page.en.title) || (page.zh && t === page.zh.title)) {
        h1.textContent = entry.title;
      }
    }
  }

  function applyLang(lang) {
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    refreshButton(lang);
    rewriteNav(lang);
    rewriteUiStrings(lang);
    rewriteFooter(lang);
    rewritePageTitle(lang);
  }

  injectStyles();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      mountButton();
      applyLang(currentLang);
    });
  } else {
    mountButton();
    applyLang(currentLang);
  }
})();
