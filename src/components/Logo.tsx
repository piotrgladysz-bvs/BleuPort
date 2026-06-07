interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/** The Bleu Venture Studios "V" mark on the brand square. */
export function Logo({ size = 36, withWordmark = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="grid shrink-0 place-items-center rounded-[28%] bg-brand-gradient shadow-glow"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 64 64"
          width={size * 0.62}
          height={size * 0.62}
          aria-hidden
        >
          <path
            d="M21 18 L21 25 L33 42 L51 23 L44 23 L44 30 L33 33 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth={4.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {withWordmark && (
        <div className="leading-none">
          <div className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bleu<span className="text-brand-500">Port</span>
          </div>
          <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            by Bleu Venture Studios
          </div>
        </div>
      )}
    </div>
  );
}
