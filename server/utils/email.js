import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM    = process.env.EMAIL_FROM || 'Portfolio Contact <onboarding@codeforgeai.in>'
const INBOX   = process.env.EMAIL_TO   || 'codeforge.coder@gmail.com'

/* ─────────────────────────────────────────────────────────────────────────
   sendContactNotification
   Sends a notification to YOUR inbox when someone fills the contact form
──────────────────────────────────────────────────────────────────────────*/
export const sendContactNotification = async ({ fullName, email, phone, subject, message, id }) => {
  const { error } = await resend.emails.send({
    from   : FROM,
    to     : [INBOX],
    replyTo: email,                            // reply goes straight to the visitor
    subject: `[Portfolio] ${subject} — from ${fullName}`,
    html   : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body        { font-family: 'Segoe UI', Arial, sans-serif; background: #0d0d0d; margin: 0; padding: 0; }
          .container  { max-width: 600px; margin: 40px auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a; }
          .header     { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px; text-align: center; }
          .header h1  { color: #000; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
          .header p   { color: rgba(0,0,0,0.7); margin: 6px 0 0; font-size: 13px; }
          .body       { padding: 32px; }
          .field      { margin-bottom: 20px; }
          .label      { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #f59e0b; margin-bottom: 6px; }
          .value      { background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 12px 14px; color: #e5e5e5; font-size: 14px; line-height: 1.6; word-break: break-word; }
          .message    { white-space: pre-wrap; }
          .footer     { text-align: center; padding: 20px 32px 28px; color: #555; font-size: 12px; border-top: 1px solid #2a2a2a; }
          .id         { display: inline-block; margin-top: 6px; font-size: 11px; color: #3a3a3a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Message</h1>
            <p>Someone reached out via your portfolio</p>
          </div>
          <div class="body">
            <div class="field">
              <div class="label">From</div>
              <div class="value">${fullName}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${email}" style="color:#f59e0b;text-decoration:none;">${email}</a></div>
            </div>
            ${phone ? `
            <div class="field">
              <div class="label">Phone</div>
              <div class="value">${phone}</div>
            </div>` : ''}
            <div class="field">
              <div class="label">Subject</div>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <div class="label">Message</div>
              <div class="value message">${message}</div>
            </div>
          </div>
          <div class="footer">
            Portfolio Contact Form
            <br />
            <span class="id">Message ID: ${id}</span>
          </div>
        </div>
      </body>
      </html>
    `,
  })

  if (error) throw new Error(error.message)
}

/* ─────────────────────────────────────────────────────────────────────────
   sendAutoReply
   Sends a confirmation email to the visitor who contacted you
──────────────────────────────────────────────────────────────────────────*/
export const sendAutoReply = async ({ fullName, email }) => {
  const { error } = await resend.emails.send({
    from   : FROM,
    to     : [email],
    subject: `Got your message, ${fullName}! I'll be in touch soon.`,
    html   : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body        { font-family: 'Segoe UI', Arial, sans-serif; background: #0d0d0d; margin: 0; padding: 0; }
          .container  { max-width: 560px; margin: 40px auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a; }
          .header     { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 36px 32px; text-align: center; }
          .header h1  { color: #000; margin: 0; font-size: 20px; font-weight: 700; }
          .body       { padding: 32px; color: #d4d4d4; font-size: 15px; line-height: 1.7; }
          .name       { color: #f59e0b; font-weight: 600; }
          .highlight  { background: #111; border-left: 3px solid #f59e0b; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 14px; color: #a3a3a3; }
          .footer     { text-align: center; padding: 20px 32px 28px; color: #555; font-size: 12px; border-top: 1px solid #2a2a2a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thanks for reaching out! 👋</h1>
          </div>
          <div class="body">
            <p>Hey <span class="name">${fullName}</span>,</p>
            <p>
              I've received your message and I really appreciate you taking the time to write.
              I'll review it and get back to you as soon as possible — usually within 24 hours.
            </p>
            <div class="highlight">
              If your matter is urgent, feel free to call me directly at <strong>+91 9199519751</strong>.
            </div>
            <p>Talk soon,<br /><strong>Ravi Bhushan</strong></p>
          </div>
          <div class="footer">
            This is an automated reply — please don't respond to this email.
          </div>
        </div>
      </body>
      </html>
    `,
  })

  if (error) throw new Error(error.message)
}
