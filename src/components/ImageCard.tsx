import Image from "next/image";

interface ImageCardProps {
  src: string;
  alt: string;
  title: string;
}

export default function ImageCard({ src, alt, title }: ImageCardProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md flex flex-col">
      <div className="relative w-full h-48">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
      <div className="p-3 bg-white">
        <p className="text-sm-body font-medium text-dark truncate">{title}</p>
      </div>
    </div>
  );
}
