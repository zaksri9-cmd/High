export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/api/contact") {
      try {
        const {name,email,message} = await request.json();
        const msg = env.EMAIL.createMimeMessage();
        msg.setSender({addr: "contact@proffitecno.com"});
        msg.setRecipient(env.CONTACT_TO);
        msg.setSubject(`Message from ${name}`);
        msg.addMessage({contentType: "text/plain", data: `From: ${name} <${email}>\n\n${message}`});
        await env.EMAIL.send(msg);
        return Response.json({ok:true});
      } catch(e){ return Response.json({error: String(e)},{status:500}) }
    }
    return env.ASSETS.fetch(request);
  }
}
