interface Env {
  EMAIL: {
    send(message: {
      to: string;
      from: string;
      subject: string;
      text: string;
      html?: string;
    }): Promise<{ messageId: string }>;
  };
  CONTACT_TO: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
    };

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
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
        return new Response(
          JSON.stringify({ error: "بيانات غير صالحة" }),
          { status: 400, headers }
        );
      }

      if (!env.CONTACT_TO) {
        return new Response(
          JSON.stringify({ error: "Contact email is not configured" }),
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

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "تعذر إرسال الرسالة" }),
        { status: 500, headers }
      );
    }
  },
} satisfies ExportedHandler<Env>;
