export default {
  async fetch(request, env) {
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const country = request.cf?.country || "XX";
    const city = request.cf?.city || "";
    const isGreen = ['US','MA','UK','DE','FR','CA','SA','AE','GB','ES','IT'].includes(country);
    
    console.log(`IP=${ip} ZONE=${country} CITY=${city} ${isGreen ? 'GREEN' : 'RED'}`);

    // صفحة الاحصائيات فالـ PC - كتدخل ليها من: /stats-pc
    if (new URL(request.url).pathname === "/stats-pc") {
      return new Response(`<html><body style="background:#111;color:#0f0;padding:20px;font-family:monospace"><h1>✅ اللوغات خدامين فالـ PC</h1><p>IP=${ip}</p><p>ZONE=${country} - ${city}</p><p>${isGreen ? '🟢 خضرا' : '🔴 حمرا'}</p><p>دابا سير لـ Cloudflare > Real-time logs غادي يبانو</p></body></html>`, {headers: {"content-type":"text/html;charset=UTF-8"}});
    }

    return env.ASSETS.fetch(request);
  }
}
