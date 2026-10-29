import React from 'react';

/** A CMS text where **double stars** mark bold parts, shown in `boldClass`. */
export function richText(text: string, boldClass: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).filter((piece) => piece !== '').map((piece, i) =>
    /^\*\*[^*]+\*\*$/.test(piece) ? (
      <span key={i} className={boldClass}>
        {piece.slice(2, -2)}
      </span>
    ) : (
      piece
    )
  );
}

/** A heading with one sentence per line ("Two programmes. One journey for everyone."). */
export function sentenceLines(text: string): React.ReactNode[] {
  // No lookbehind in the pattern: older Safari cannot parse it.
  return text.replace(/([.!?])\s+(?=\S)/g, '$1\n').split('\n').map((line, i) => (
    <span key={i} className="block">
      {line}
    </span>
  ));
}
