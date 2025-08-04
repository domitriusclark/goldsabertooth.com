import type { APIRoute } from 'astro';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = ContactSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: validation.error.errors[0].message,
          code: 'VALIDATION_ERROR'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { name, email, subject, message } = validation.data;

    // Log the contact form submission
    const timestamp = new Date().toISOString();
    const contactData = {
      timestamp,
      name,
      email,
      subject: subject || 'No subject',
      message,
      userAgent: request.headers.get('user-agent') || 'Unknown',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown'
    };

    console.log('Contact form submission:', JSON.stringify(contactData, null, 2));

    // In a real implementation, you would:
    // 1. Send email via service like SendGrid, Resend, or Mailgun
    // 2. Store in database
    // 3. Send to CRM or support system
    
    // For now, we'll just log it and return success
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate processing

    return new Response(
      JSON.stringify({
        message: 'Message sent! We\'ll get back to you within 24 hours.',
        success: true
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Contact API error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Something went wrong sending your message. Please try again or email us directly.',
        code: 'INTERNAL_ERROR'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Handle other HTTP methods
export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      error: 'Method not allowed. Use POST to send a message.',
      code: 'METHOD_NOT_ALLOWED'
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST',
      },
    }
  );
};