export const sendVerificationEmailTemplate = (name, verificationLink) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your AlgoNinja Account</title>
      <style>
        /* Base styles for standard light mode layout */
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #111827; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; padding: 40px 0; background-color: #f9fafb; }
        .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background-color: #111827; padding: 30px; text-align: center; border-bottom: 3px solid #ff9900; }
        .logo { font-size: 24px; font-weight: 800; color: #ff9900; letter-spacing: 0.5px; margin: 0; }
        .logo span { color: #ffffff; }
        .content { padding: 40px 35px; }
        .salutation { font-size: 20px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 16px; }
        .text { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 28px; }
        .btn-container { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; padding: 14px 32px; background-color: #ff9900; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 15px; border-radius: 8px; box-shadow: 0 4px 10px rgba(255, 153, 0, 0.25); transition: background-color 0.2s; }
        .link-alt { font-size: 13px; color: #9ca3af; line-height: 1.5; word-break: break-all; margin-top: 24px; padding-top: 20px; border-top: 1px dashed #e5e7eb; }
        .link-alt a { color: #ff9900; text-decoration: none; }
        .footer { background-color: #f3f4f6; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .footer a { color: #ff9900; text-decoration: none; }

        /* 🔥 SYSTEM-LEVEL DARK MODE COMPATIBILITY MATRIX */
        @media (prefers-color-scheme: dark) {
          body, .wrapper { background-color: #0b0f19 !important; color: #f9fafb !important; }
          .container { background-color: #111827 !important; border-color: #1f2937 !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); }
          .salutation { color: #ffffff !important; }
          .text { color: #9ca3af !important; }
          .footer { background-color: #0b0f19 !important; color: #6b7280 !important; border-top-color: #1f2937 !important; }
          .link-alt { border-top-color: #1f2937 !important; color: #4b5563 !important; }
        }

        /* MOBILE SPECIFIC OPTIMIZATIONS */
        @media screen and (max-width: 480px) {
          .content { padding: 30px 20px !important; }
          .salutation { font-size: 18px !important; }
          .text { font-size: 14px !important; }
          .btn { width: 100%; box-sizing: border-box; text-align: center; padding: 14px 20px !important; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="logo">Algo<span>Ninja</span> 🔥</h1>
          </div>
          <div class="content">
            <p class="salutation">Welcome to the Dojo, ${name}!</p>
            <p class="text">Thank you for registering on AlgoNinja. Before you can jump into solving elite DSA problems, cracking coding sheets, and customizing your profile, we need to verify your email address.</p>
            
            <div class="btn-container">
              <a href="${verificationLink}" target="_blank" class="btn">Verify Email Address</a>
            </div>
            
            <p class="text" style="margin-bottom: 0;">This verification link is highly confidential and will strictly <strong>expire in 10 minutes</strong> for safety restrictions.</p>
            
            <div class="link-alt">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationLink}" target="_blank">${verificationLink}</a>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} AlgoNinja. All rights reserved.</p>
            <p style="margin: 6px 0 0 0;">Level up your coding engine. Built for technical excellence.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};