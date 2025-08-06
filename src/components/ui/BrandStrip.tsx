import { cx } from "../../utils/classes";

const categories = [
  { name: "PLAYMATS", icon: "🎯", color: "bg-electric-blue" },
  { name: "STICKERS", icon: "⚡", color: "bg-neon-orange" },
  { name: "TOKENS", icon: "🔮", color: "bg-neon-lime" },
  { name: "APPAREL", icon: "👕", color: "bg-psychedelic-purple" },
];

export default function BrandStrip() {
  return (
    <section className="bg-ink py-12 border-electric-blue border-y-4 overflow-hidden">
      <div className="mx-auto px-4 max-w-7xl">
        <h2 className="mb-8 text-neon-lime text-center graffiti-sm">
          SHOP OUR WARES
        </h2>

        <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
          {categories.map((category, index) => {
            const rotations = [
              "rotate-1",
              "-rotate-1",
              "rotate-2",
              "-rotate-2",
            ];
            const rotation = rotations[index % rotations.length];

            return (
              <a
                key={category.name}
                href={`/shop?tag=${category.name.toLowerCase()}`}
                className={cx(
                  "group relative comic-border p-6 text-center transition-all duration-300",
                  "hover:scale-105 hover:rotate-0 focus:outline-none focus:ring-2",
                  "focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-ink",
                  category.color,
                  rotation
                )}
              >
                <div className="drop-shadow-sm mb-3 text-4xl filter">
                  {category.icon}
                </div>
                <h3 className="font-display font-black text-ink text-lg">
                  {category.name}
                </h3>

                {/* Hover arrow */}
                <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-ink text-2xl animate-bounce">→</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <div className="mt-8 text-center">
          <p className="font-body text-paper text-lg">
            Each piece tells a story of{" "}
            <span className="font-bold text-electric-blue">rebellion</span> and{" "}
            <span className="font-bold text-neon-orange">magic</span>
          </p>
        </div>
      </div>
    </section>
  );
}
