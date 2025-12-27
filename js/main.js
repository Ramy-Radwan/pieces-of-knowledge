(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // GitHub project-pages safe base: "/pieces-of-knowledge"
  const project = location.pathname.split("/")[1]; // "pieces-of-knowledge"
  const BASE = project ? `/${project}` : "";

  const embedMap = [
    { id: "newsletter-embed", url: `${BASE}/embeds/newsletter.html` },
    { id: "donate-embed", url: `${BASE}/embeds/donate.html` },
    { id: "comments-embed", url: `${BASE}/embeds/comments.html` },
  ];

  embedMap.forEach(async ({ id, url }) => {
    const host = document.getElementById(id);
    if (!host) return;

    try {
      const res = await fetch(url, { cache: "no-cache" });

      // IMPORTANT: don’t inject 404 HTML
      if (!res.ok) throw new Error(`Embed HTTP ${res.status}: ${url}`);

      host.innerHTML = await res.text();
    } catch (e) {
      host.innerHTML = `<p class="sub">Embed failed to load.</p>`;
      console.error(e);
    }
  });
})();
