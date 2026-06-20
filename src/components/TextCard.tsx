interface TextCardProps {
  text: string;
  className?: string;
}

export default function TextCard({ text, className = "" }: TextCardProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-md flex items-center justify-center h-48 bg-void ${className}`}
    >
      <p className="text-title text-white text-center px-4">{text}</p>
    </div>
  );
}
