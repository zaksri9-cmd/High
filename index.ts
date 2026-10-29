interface Env {
  EMAIL: SendEmail;
  CONTACT_TO: string;
}

const ALLOWED_ORIGINS = [
  "https://proffitecno.com",
  "https://www.proffitecno.com",
  "https://high.pages.dev",
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (origin && isAllowedOrigin(origin)) {
      corsHeaders["Access-Control-Allow-Origin"] = origin;
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Not Found", { status: 404, headers: corsHeaders });
    }

    try {
      const { name, email, subject, message } = await request.json() as any;

      if (!name || !email || !message) {
        return Response.json({ success: false, error: "Missing fields" }, { status: 400, headers: corsHeaders });
      }

      await env.EMAIL.send({
        from: "ProffiTecno Contact <welcome@proffitecno.com>",
        to: env.CONTACT_TO,
        replyTo: { name, email },
        subject: `[Contact] ${subject || "New message"} - from ${name}`,
        text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
        html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><p>${message.replace(/\n/g, "<br>")}</p>`
      });

      return Response.json({ success: true }, { headers: corsHeaders });
    } catch (e: any) {
      return Response.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders });
    }
  },
} as ExportedHandler<Env>;
