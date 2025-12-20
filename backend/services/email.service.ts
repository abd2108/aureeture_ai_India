// Email service for sending notifications
// In production, integrate with Resend, SendGrid, or similar service

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
    // For now, log the email
    console.log('📧 Email would be sent:', {
      to: options.to,
      subject: options.subject,
    });
    
    // In production, replace with actual email API call:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'Aureeture <noreply@aureeture.ai>',
    //     to: options.to,
    //     subject: options.subject,
    //     html: options.html,
    //   }),
    // });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateSessionConfirmationEmail(
  recipientName: string,
  sessionTitle: string,
  mentorName: string,
  startTime: Date,
  endTime: Date,
  meetingLink: string,
  isMentor: boolean = false
): { subject: string; html: string } {
  const formattedDate = startTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedStartTime = startTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedEndTime = endTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const subject = isMentor
    ? `New Session Booked: ${sessionTitle}`
    : `Session Confirmed: ${sessionTitle} with ${mentorName}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">${isMentor ? 'New Session Booked' : 'Session Confirmed!'}</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>${isMentor ? `A student has booked a session with you.` : `Your session with ${mentorName} has been confirmed.`}</p>
          
          <h3>Session Details:</h3>
          <ul>
            <li><strong>Title:</strong> ${sessionTitle}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</li>
            ${isMentor ? '' : `<li><strong>Mentor:</strong> ${mentorName}</li>`}
          </ul>
          
          <p><a href="${meetingLink}" class="button">Join Meeting</a></p>
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            This session was automatically confirmed after payment. You can view and manage your sessions in your dashboard.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Aureeture AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}







