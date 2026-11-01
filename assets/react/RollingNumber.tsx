/**
 * Digits that roll to their value (odometer), staggered by 32ms per digit, on a spring.
 * Non-digits (separators, currency, %) stay still. Pass the already formatted string.
 */
export function RollingNumber({ text, className }: { text: string; className?: string }) {
  let digitIndex = 0;
  return (
    <span className={`uv-roll ${className ?? ""}`} aria-label={text}>
      {[...text].map((ch, i) => {
        if (!/\d/.test(ch)) return <span key={i} aria-hidden>{ch}</span>;
        const d = Number(ch);
        const order = digitIndex++;
        return (
          <span key={i} className="uv-roll__col" aria-hidden>
            <span className="uv-roll__strip" style={{ ["--d" as string]: d, ["--i" as string]: order }}>
              {Array.from({ length: 10 }, (_, n) => <span key={n}>{n}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}
