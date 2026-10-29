export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const { name, email, message } = await request.json() as any;
        
        const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: 'zakariaelasrio884@gmail.com' }] }],
            from: { email: 'contact@proffitecno.com', name: 'Proffitecno' },
            subject: `رسالة من ${name}`,
            content: [{ type: 'text/plain', value: `الاسم: ${name}\nالايميل: ${email}\n\n${message}` }]
          })
        });
        
        const txt = await res.text();
        if (!res.ok) return Response.json({ ok: false, error: txt }, { status: 500 });
        return Response.json({ ok: true });
      } catch (e: any) {
        return Response.json({ ok: false, error: e.message }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
} as ExportedHandler<any>;
