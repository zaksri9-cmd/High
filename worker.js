export default {
async fetch(request, env, ctx) {
const url = new URL(request.url);

const data = {
  time: new Date().toISOString(),
  path: url.pathname,
  referrer: request.headers.get("Referer") || "direct",
  country: request.cf?.country || "unknown",
  userAgent: request.headers.get("User-Agent") || "unknown"
};

console.log(JSON.stringify(data));

if (url.pathname === "/health") {
  return Response.json({
    status: "ok",
    message: "Worker is running"
  });
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 60px auto;
      padding: 20px;
      line-height: 1.7;
      color: #222;
    }
    h1 { color: #2457a7; }
  </style>
</head>
<body>
  <h1>Welcome to Our Website</h1>
  <p>Discover useful articles, ideas, and resources.</p>
</body>
</html>`;

return new Response(html, {
  headers: {
    "Content-Type": "text/html; charset=UTF-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  }
});
}
};
