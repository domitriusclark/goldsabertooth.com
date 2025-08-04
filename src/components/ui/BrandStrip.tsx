import { cx } from '../../utils/classes';

const categories = [
  { name: 'PLAYMATS', icon: '🎯', color: 'bg-electric-blue' },
  { name: 'STICKERS', icon: '⚡', color: 'bg-neon-orange' },
  { name: 'TOKENS', icon: '🔮', color: 'bg-neon-lime' },
  { name: 'APPAREL', icon: '👕', color: 'bg-psychedelic-purple' },
];

export default function BrandStrip() {
  return (
    <section className="py-12 bg-ink border-y-4 border-electric-blue overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="graffiti-sm text-center text-neon-lime mb-8">
          CHOOSE YOUR CHAOS
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];
            const rotation = rotations[index % rotations.length];
            
            return (
              <a
                key={category.name}
                href={`/shop?tag=${category.name.toLowerCase()}`}
                className={cx(
                  'group relative comic-border p-6 text-center transition-all duration-300',
                  'hover:scale-105 hover:rotate-0 focus:outline-none focus:ring-2',
                  'focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-ink',
                  category.color,
                  rotation
                )}
              >
                <div className="text-4xl mb-3 filter drop-shadow-sm">
                  {category.icon}
                </div>
                <h3 className="font-display text-lg text-ink font-black">
                  {category.name}
                </h3>
                
                {/* Hover arrow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-2xl text-ink animate-bounce">→</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-8">
          <p className="font-body text-paper text-lg">
            Each piece tells a story of <span className="text-electric-blue font-bold">rebellion</span> and{' '}
            <span className="text-neon-orange font-bold">magic</span>
          </p>
        </div>
      </div>
    </section>
  );
}