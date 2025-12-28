(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Robust base path detection from the script URL itself.
  // Example:
  // .../pieces-of-knowledge/js/main.js  => basePath = /pieces-of-knowledge
  const script = document.currentScript;
  let basePath = "";

  if (script && script.src) {
    const u = new URL(script.src);
    basePath = u.pathname.replace(/\/js\/main\.js$/, "");
  } else {
    // Fallback (rare)
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    basePath = first ? `/${first}` : "";
  }

  const embedMap = [
    { id: "newsletter-embed", path: "/embeds/newsletter.html" },
    { id: "donate-embed", path: "/embeds/donate.html" },
    { id: "comments-embed", path: "/embeds/comments.html" },
  ];

  async function loadEmbeds() {
    for (const item of embedMap) {
      const el = document.getElementById(item.id);
      if (!el) continue;

      const url = `${basePath}${item.path}`;

      try {
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          el.innerHTML = `<div class="embed-error">Embed not found: ${url}</div>`;
          continue;
        }

        const html = await res.text();

        // Guard: avoid injecting GitHub 404 HTML
        if (
          /There isn't a GitHub Pages site here/i.test(html) ||
          /<title>\s*404\s*<\/title>/i.test(html)
        ) {
          el.innerHTML = `<div class="embed-error">Embed fetch returned 404 HTML: ${url}</div>`;
          continue;
        }

        el.innerHTML = html;
      } catch (e) {
        el.innerHTML = `<div class="embed-error">Embed fetch failed: ${url}</div>`;
        console.error(e);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", loadEmbeds);
})();
