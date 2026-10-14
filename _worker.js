export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/stats-pc") {
      const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";
      const c = request.cf?.country || "XX";
      return new Response(`<h1>✅ خدام</h1><p>IP: ${ip}</p><p>Country: ${c}</p>`, {headers:{"content-type":"text/html;charset=utf-8"}});
    }
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return fetch(request);
  }
}
