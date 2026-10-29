export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/contact") {
      try {
        const { name, email, message } = await request.json();
        
        const msg = env.EMAIL.createMimeMessage();
        msg.setSender({ addr: "welcome@proffitecno.com", name: "Proffitecno" });
        msg.setRecipient("zakariaelasrio884@gmail.com");
        msg.setSubject(`New Contact: ${name}`);
        msg.addMessage({
          contentType: "text/plain",
          data: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });

        await env.EMAIL.send(msg);
        return Response.json({ ok: true });
      } catch (err) {
        return Response.json({ ok: false, error: String(err) }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
} as ExportedHandler<any>;
