import Image from "next/image";

interface HeroImageProps {
  src: string;
  alt: string;
}

export default function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" priority />
    </div>
  );
}
