import Button from "./Button";
import { cx } from "../../utils/classes";

export default function Hero() {
  return (
    <section className="relative flex justify-center items-center px-4 py-16 min-h-[70vh] overflow-hidden">
      {/* Background textures */}
      <div
        className="absolute inset-0 bg-swirl bg-repeat opacity-20"
        style={{ backgroundSize: "200px 200px" }}
      />
      <div
        className="absolute inset-0 bg-halftone bg-repeat opacity-10"
        style={{ backgroundSize: "150px 150px" }}
      />

      {/* Floating geometric shapes */}
      <div className="top-20 left-10 absolute bg-electric-blue opacity-60 comic-border w-16 h-16 rotate-45 animate-bounce" />
      <div className="top-40 right-20 absolute bg-neon-orange opacity-60 comic-border rounded-full w-12 h-12 animate-pulse" />
      <div className="bottom-32 left-20 absolute bg-neon-lime opacity-60 comic-border w-20 h-8 -rotate-12" />
      <div className="right-16 bottom-20 absolute bg-psychedelic-purple opacity-60 comic-border w-14 h-14 rotate-12 animate-bounce" />

      <div className="z-10 relative mx-auto max-w-4xl text-center">
        {/* Main headline */}
        <h1
          className={cx(
            "graffiti text-electric-blue mb-6",
            "psychedelic-pulse",
            "drop-shadow-comic"
          )}
        >
          GOLDSABERTOOTH
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-8 max-w-2xl font-body text-paper text-xl md:text-2xl leading-relaxed">
          Bold street art meets wizardry. Psychedelic playmats, tokens,
          stickers, and apparel for the{" "}
          <span className="font-bold text-neon-lime">
            rebellious planeswalker
          </span>
          .
        </p>

        {/* CTA Buttons */}
        <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mb-12">
          <Button
            variant="primary"
            size="lg"
            onClick={() => (window.location.href = "/shop")}
            className="px-8 py-4 min-w-48 text-xl"
          >
            SHOP THE CHAOS
          </Button>

          <a
            href="https://etsy.com/shop/goldsabertooth"
            target="_blank"
            rel="noopener noreferrer"
            className={cx(
              "px-8 py-4 text-xl font-display",
              "comic-border bg-psychedelic-purple hover:bg-psychedelic-purple-dark text-paper",
              "btn-psychedelic transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-ink",
              "min-w-48 text-center"
            )}
          >
            ETSY STORE ↗
          </a>
        </div>

        {/* Features */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3 text-center">
          <div className="bg-paper p-6 comic-border rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="mb-2 text-3xl">🎨</div>
            <h3 className="mb-2 font-display text-ink text-lg">ORIGINAL ART</h3>
            <p className="font-body text-gray-600 text-sm">
              Hand-drawn psychedelic designs you won't find anywhere else
            </p>
          </div>

          <div className="bg-paper p-6 comic-border -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="mb-2 text-3xl">⚡</div>
            <h3 className="mb-2 font-display text-ink text-lg">
              FAST SHIPPING
            </h3>
            <p className="font-body text-gray-600 text-sm">
              Get your underground gear delivered in 2-3 business days
            </p>
          </div>

          <div className="bg-paper p-6 comic-border rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="mb-2 text-3xl">🔥</div>
            <h3 className="mb-2 font-display text-ink text-lg">
              LIMITED DROPS
            </h3>
            <p className="font-body text-gray-600 text-sm">
              Exclusive designs with limited quantities - when it's gone, it's
              gone
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
