export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      try {
        const data = await request.json() as {
          name: string;
          email: string;
          message: string;
        };

        const name = String(data.name || "").trim();
        const email = String(data.email || "").trim();
        const message = String(data.message || "").trim();

        if (!name || !email || !message) {
          return Response.json(
            { ok: false, error: "Please complete all fields." },
            { status: 400 }
          );
        }

        await env.EMAIL.send({
          from: "welcome@proffitecno.com",
          to: "zakariaelasrio884@gmail.com",
          replyTo: email,
          subject: `New website message from ${name}`,
          text:
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`
        });

        return Response.json({ ok: true });

      } catch (error: any) {
        console.error("Email sending error:", error);

        return Response.json(
          {
            ok: false,
            error: "Unable to send your message. Please try again."
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
} as ExportedHandler<any>;
