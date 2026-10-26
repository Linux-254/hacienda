import React from 'react';

type SectionLabelProps = {
  number?: string;
  children: React.ReactNode;
  align?: 'left' | 'center';
};

export function SectionLabel({
  number,
  children,
  align = 'left',
}: SectionLabelProps) {
  return (
    <div
      className={`flex items-center gap-4 ${
        align === 'center' ? 'justify-center text-center' : 'justify-start'
      }`}
    >
      {number && (
        <span className="font-mono text-[10px] tracking-widest text-[#C9A24B]/70">
          [{number}]
        </span>
      )}
      <span className="eyebrow">{children}</span>
      <span className="h-px w-10 bg-[#C9A24B]/30" />
    </div>
  );
}
