(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Simple embed loader: inserts /embeds/*.html into placeholders
  const embedMap = [
    { id: "newsletter-embed", url: "/embeds/newsletter.html" },
    { id: "donate-embed", url: "/embeds/donate.html" },
    { id: "comments-embed", url: "/embeds/comments.html" }
  ];

  embedMap.forEach(async ({ id, url }) => {
    const host = document.getElementById(id);
    if (!host) return;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      host.innerHTML = await res.text();
    } catch (e) {
      host.innerHTML = `<p class="sub">Embed failed to load.</p>`;
    }
  });
})();
