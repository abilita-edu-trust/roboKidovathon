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
