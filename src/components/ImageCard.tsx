import Image from "next/image";

interface ImageCardProps {
  src: string;
  alt: string;
  title: string;
}

export default function ImageCard({ src, alt, title }: ImageCardProps) {
  return (
    <div className="flex flex-col">
      <div className="relative w-full aspect-[1/1.375]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
      <div className="p-3 bg-white">
        <p className="text-sm-body font-medium text-dark truncate">{title}</p>
      </div>
    </div>
  );
}
