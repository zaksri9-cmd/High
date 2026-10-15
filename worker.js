export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" }
      });
    }

    const headers = {
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "SAMEORIGIN"
    };

    if (url.pathname === "/health") {
      return new Response("OK", {
        headers: {
          ...headers,
          "Content-Type": "text/plain; charset=utf-8"
        }
      });
    }

    // Serve the site through Cloudflare Assets when configured.
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);

      if (response.status !== 404) {
        const newHeaders = new Headers(response.headers);

        for (const [key, value] of Object.entries(headers)) {
          newHeaders.set(key, value);
        }

        return new Response(
          request.method === "HEAD" ? null : response.body,
          {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          }
        );
      }
    }

    return new Response("Site assets are not configured.", {
      status: 503,
      headers: {
        ...headers,
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }
};
