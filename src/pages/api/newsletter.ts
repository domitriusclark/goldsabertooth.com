import type { APIRoute } from 'astro';
import { z } from 'zod';

const NewsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = NewsletterSchema.safeParse(body);
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

    const { email } = validation.data;

    // For now, just log the email (no actual newsletter service)
    console.log(`Newsletter signup: ${email} at ${new Date().toISOString()}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Success
    return new Response(
      JSON.stringify({
        message: 'Thanks for joining the underground! We\'ll be in touch with the latest chaos.',
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
    console.error('Newsletter API error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Something went wrong. Please try again later.',
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
      error: 'Method not allowed. Use POST to subscribe.',
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