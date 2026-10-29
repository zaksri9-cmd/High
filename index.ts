export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.EMAIL.send({
      to: "recipient@example.com",
      from: "welcome@proffitecno.com",
      subject: "Welcome to our service!",
      html: "<h1>Welcome!</h1><p>Thanks for signing up.</p>",
      text: "Welcome! Thanks for signing up.",
    });
    return new Response(`Email sent: ${response.messageId}`);
  },
} satisfies ExportedHandler<Env>;
