export default {
  async fetch(request, env) {
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const country = request.cf?.country || "XX";
    console.log(`IP-${ip} ZONE-${country}`);
    const url = new URL(request.url);
    if (url.pathname === "/stats-pc") {
      return new Response(`IP: ${ip} Country: ${country}`, {headers:{"content-type":"text/html"}});
    }
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return fetch(request);
  }
}
