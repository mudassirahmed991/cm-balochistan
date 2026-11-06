import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a1e14]">
      {/* Full length panoramic banner displaying 100% of the image without any crop */}
      <div className="relative w-full">
        <Image
          src="/images/cm-balochistan-banner.png"
          alt="Office of the Chief Minister of Balochistan — Mir Sarfraz Bugti"
          width={1024}
          height={394}
          priority
          sizes="100vw"
          className="w-full h-auto block select-none"
        />
      </div>
    </section>
  );
}
