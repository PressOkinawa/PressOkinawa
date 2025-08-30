import { Resend } from 'resend';

export const prerender = false;

type Payload = { name: string; email: string; message: string; botcheck?: string };

// 簡易エスケープ（HTML本文用）
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const json = (status: number, body: any) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export async function POST({ request }: { request: Request }) {
  try {
    const data = (await request.json()) as Payload;

    if (data.botcheck) return json(200, { ok: true });
    if (!data.name || !data.email || !data.message) return json(400, { ok: false, error: 'missing fields' });

    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    await resend.emails.send({
      from: import.meta.env.MAIL_FROM ?? 'Press Okinawa <onboarding@resend.dev>',
      to: [import.meta.env.CONTACT_TO_EMAIL ?? 'pressokinawa@gmail.com'],
      subject: `お問い合わせ: ${data.name}`,
      replyTo: data.email, // 型に合わせて camelCase に変更
      text: `名前: ${data.name}\nメール: ${data.email}\n\n${data.message}`,
      html: `
        <h2>お問い合わせ</h2>
        <p><strong>名前:</strong> ${esc(data.name)}</p>
        <p><strong>メール:</strong> ${esc(data.email)}</p>
        <p><strong>内容:</strong><br>${esc(data.message).replace(/\n/g, '<br>')}</p>
      `,
    });

    return json(200, { ok: true });
  } catch (err) {
    console.error(err);
    return json(500, { ok: false });
  }
}