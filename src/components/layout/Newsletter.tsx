import { useState } from 'react';
import type { FormEvent } from 'react';
import { cx } from '../../utils/classes';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing! Check your email for confirmation.');
        setEmail('');
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="font-display text-2xl text-electric-blue mb-4 outline-text rotate-1">
        GET THE UNDERGROUND DROPS!
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@wizard.com"
            disabled={status === 'loading'}
            className={cx(
              'flex-1 px-4 py-2 text-ink bg-paper',
              'comic-border placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-electric-blue',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'font-body'
            )}
            aria-label="Email address for newsletter"
          />
          
          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className={cx(
              'px-6 py-2 font-display text-lg text-ink',
              'comic-border bg-neon-lime hover:bg-neon-lime-dark',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'btn-psychedelic focus:outline-none focus:ring-2 focus:ring-electric-blue',
              'whitespace-nowrap'
            )}
          >
            {status === 'loading' ? 'JOINING...' : 'JOIN!'}
          </button>
        </div>

        {/* Status message */}
        {message && (
          <div
            role={status === 'error' ? 'alert' : 'status'}
            className={cx(
              'p-3 text-sm font-body rounded-lg comic-border',
              status === 'success' 
                ? 'bg-neon-lime text-ink' 
                : 'bg-neon-orange text-ink'
            )}
          >
            {message}
          </div>
        )}
      </form>

      <p className="text-xs text-gray-400 mt-3 font-body">
        No spam, just sick MTG art drops and exclusive deals. Unsubscribe anytime.
      </p>
    </div>
  );
}