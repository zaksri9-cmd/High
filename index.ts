export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // API ديال الكونتاكت
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const { name, email, message } = await request.json() as any;

        if (!name || !email || !message) {
          return Response.json({ ok: false, error: 'Missing fields' }, { status: 400 });
        }

        await env.EMAIL.send({
          from: 'welcome@proffitecno.com',
          to: 'zakariaelasrio884@gmail.com',
          subject: `New contact from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br>${message.replace(/\n/g, '<br>')}</p>`
        });

        return Response.json({ ok: true });
      } catch (e: any) {
        return Response.json({ ok: false, error: e.message || String(e) }, { status: 500 });
      }
    }

    // سيرڤي الملفات العادية
    // @ts-ignore
    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<any>;
