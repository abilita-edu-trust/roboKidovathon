import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useT } from '../content/useT';
import { bi, type Bi, type CmsLink } from '../content/core';
import { hasLabel } from '../content/sections/frame';

/** A "Text & media" block added in the Site CMS: title, text, an image or a video, and an optional button. */
export interface MediaData {
  title: Bi;
  text: Bi;
  image: string;
  /** MP4/WebM; shown with play controls, the image as its first frame. */
  video: string;
  button: CmsLink;
}

export const mediaDefaults = (): MediaData => ({
  title: bi(''),
  text: bi(''),
  image: '',
  video: '',
  button: { label: bi(''), href: '' },
});

export const MediaBlock: React.FC<{ id: string; data: MediaData; go: (href: string) => void }> = ({ id, data, go }) => {
  const { t } = useT();
  const title = t(data.title);
  const text = t(data.text);
  const hasMedia = Boolean(data.video || data.image);
  if (!title && !text && !hasMedia) return null;

  return (
    <section id={id} className="w-full bg-white text-[#0A1930] py-12 sm:py-16 px-4 sm:px-6 lg:px-10 scroll-mt-20">
      <div className={`max-w-[1400px] mx-auto grid grid-cols-1 gap-8 lg:gap-12 items-center ${hasMedia && (title || text) ? 'lg:grid-cols-2' : ''}`}>
        {hasMedia && (
          <div className="w-full overflow-hidden border border-slate-200 bg-[#F2F8FD]">
            {data.video ? (
              <video src={data.video} poster={data.image || undefined} controls playsInline preload="metadata" className="block w-full h-auto" />
            ) : (
              <img src={data.image} alt={title} loading="lazy" className="block w-full h-auto" />
            )}
          </div>
        )}
        {(title || text || hasLabel(data.button)) && (
          <div className="space-y-4 max-w-2xl">
            {title && <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{title}</h2>}
            {text && <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">{text}</p>}
            {hasLabel(data.button) && (
              <button
                type="button"
                onClick={() => go(data.button.href)}
                className="px-6 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t(data.button.label)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
