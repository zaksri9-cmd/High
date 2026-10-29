interface Env {
  EMAIL: {
    send(message: {
      to: string;
      from: string;
      subject: string;
      text: string;
    }): Promise<{ messageId: string }>;
  };
  CONTACT_TO: string;
}

const ALLOWED_ORIGINS = [
  "https://proffitecno.com",
  "https://www.proffitecno.com",
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || "";
    const allowed = ALLOWED_ORIGINS.includes(origin);

    const headers: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
      "Vary": "Origin",
    };

    if (allowed) {
      headers["Access-Control-Allow-Origin"] = origin;
      headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
      headers["Access-Control-Allow-Headers"] = "Content-Type";
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers,
      });
    }

    if (!allowed) {
      return Response.json(
        { error: "Origin not allowed" },
        { status: 403, headers }
      );
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405, headers }
      );
    }

    try {
      const data = await request.json() as {
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
      };

      const name = String(data.name || "").trim();
      const email = String(data.email || "").trim();
      const subject = String(data.subject || "رسالة من الموقع").trim();
      const message = String(data.message || "").trim();

      if (
        !name || !email || !message ||
        name.length > 100 ||
        email.length > 254 ||
        subject.length > 200 ||
        message.length > 5000 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        return Response.json(
          { error: "بيانات غير صالحة" },
          { status: 400, headers }
        );
      }

      if (!env.CONTACT_TO) {
        return Response.json(
          { error: "Contact email is not configured" },
          { status: 500, headers }
        );
      }

      await env.EMAIL.send({
        to: env.CONTACT_TO,
        from: "welcome@proffitecno.com",
        subject: `[Afterglow] ${subject}`,
        text:
          `الاسم: ${name}\n` +
          `بريد الزائر: ${email}\n\n` +
          `الرسالة:\n${message}`,
      });

      return Response.json(
        { success: true },
        { status: 200, headers }
      );
    } catch {
      return Response.json(
        { error: "تعذر إرسال الرسالة" },
        { status: 500, headers }
      );
    }
  },
} satisfies ExportedHandler<Env>;
