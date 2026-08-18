interface FooterProps {
  text: string;
}

export default function Footer({ text }: FooterProps) {
  return (
    <footer className="w-full py-6 text-center text-xs text-gray-500 border-t border-white/10 mt-auto">
      {text}
    </footer>
  );
}