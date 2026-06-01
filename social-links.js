(function () {
  const fallbackConfig = {
    showFooter: true,
    showFloating: true,
    openInNewTab: true,
    links: [
      { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/hdpth" },
      { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/hdpth" },
      { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/hdpth" }
    ]
  };

  const icons = {
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M17.5 6.8h.01"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 10v8"/><path d="M6.5 6.5v.01"/><path d="M11 18v-8"/><path d="M11 13.5c0-2 1.2-3.5 3.2-3.5 2.2 0 3.3 1.4 3.3 4v4"/></svg>'
  };

  function scriptBaseUrl() {
    const script = document.currentScript;
    return script ? new URL(".", script.src) : new URL("./", window.location.href);
  }

  function createLink(item, openInNewTab) {
    const link = document.createElement("a");
    link.className = "social-link";
    link.href = item.url;
    link.setAttribute("aria-label", item.label);
    link.setAttribute("title", item.label);
    if (openInNewTab) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.innerHTML = icons[item.platform] || icons.facebook;
    return link;
  }

  function createGroup(config) {
    const group = document.createElement("div");
    group.className = "social-links";
    config.links.forEach((item) => group.appendChild(createLink(item, config.openInNewTab)));
    return group;
  }

  function render(config) {
    if (!config.links || !config.links.length) return;

    if (config.showFooter) {
      const footer = document.querySelector(".footer .container") || document.querySelector(".footer");
      if (footer && !footer.querySelector(".social-block")) {
        const block = document.createElement("div");
        block.className = "social-block";
        block.innerHTML = '<div class="social-block-title">Follow HDPTH</div>';
        block.appendChild(createGroup(config));
        const footerBottom = footer.querySelector(".footer-bottom");
        if (footerBottom) {
          footer.insertBefore(block, footerBottom);
        } else {
          footer.appendChild(block);
        }
      }
    }

    if (config.showFloating && !document.querySelector(".social-float")) {
      const float = createGroup(config);
      float.className = "social-float";
      document.body.appendChild(float);
    }
  }

  const configUrl = new URL("social-links.json", scriptBaseUrl());
  fetch(configUrl)
    .then((response) => response.ok ? response.json() : fallbackConfig)
    .then(render)
    .catch(() => render(fallbackConfig));
})();
