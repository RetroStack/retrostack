import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NeonText } from "@/components/effects/NeonText";

const FEATURED_SYSTEMS = [
  {
    name: "TRS-80",
    category: "Computers",
    description: "The legendary Tandy/RadioShack computer that launched the home computing revolution.",
    href: "/systems/computers",
    icon: "80",
  },
  {
    name: "Apple I",
    category: "Computers",
    description: "Steve Wozniak's hand-built masterpiece that started it all for Apple.",
    href: "/systems/computers",
    icon: "I",
  },
  {
    name: "Sorcerer",
    category: "Computers",
    description: "Exidy's powerful CP/M-compatible machine with built-in Microsoft BASIC.",
    href: "/systems/computers",
    icon: "S",
  },
  {
    name: "BitStack",
    category: "Trainer Boards",
    description: "Educational trainer boards including DigiTrainer and DigiMind for learning digital electronics.",
    href: "/systems/trainer-boards",
    icon: "B",
  },
];

export function SystemsPreview() {
  return (
    <section className="py-20">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <NeonText as="h2" color="pink" className="font-display text-xl sm:text-2xl mb-4">
              Featured Systems
            </NeonText>
            <p className="text-gray-400 max-w-xl">
              Explore our collection of vintage computer replicas and educational hardware.
            </p>
          </div>
          <Link
            href="/systems"
            className="mt-4 sm:mt-0 text-retro-cyan hover:text-retro-pink transition-colors font-ui text-sm uppercase tracking-wider"
          >
            View All Systems →
          </Link>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_SYSTEMS.map((system) => (
            <Link
              key={system.name}
              href={system.href}
              className="card-retro p-6 hover-glow-pink group block"
            >
              {/* Icon/Badge */}
              <div className="w-16 h-16 rounded bg-retro-purple/50 flex items-center justify-center mb-4 group-hover:bg-retro-pink/20 transition-colors duration-300">
                <span className="font-display text-2xl text-retro-cyan group-hover:text-retro-pink transition-colors duration-300">
                  {system.icon}
                </span>
              </div>

              {/* Category */}
              <span className="text-xs text-retro-violet uppercase tracking-wider">
                {system.category}
              </span>

              {/* Name */}
              <h3 className="font-ui text-lg text-white mt-1 mb-2 group-hover:text-retro-pink transition-colors duration-300">
                {system.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm">
                {system.description}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
