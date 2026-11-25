import type { ReactNode } from 'react';

export type CardTone = 'blue' | 'hcmut' | 'emerald' | 'teal' | 'indigo' | 'red';

type CardSectionProps = {
  title: ReactNode;
  tone?: CardTone;
  action?: ReactNode;
  children: ReactNode;
};

export const CardSection = ({
  title,
  action,
  children,
}: CardSectionProps) => {
  return (
    <section className="overflow-hidden rounded-card border border-hairline bg-surface transition-colors duration-150">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold tracking-tight text-ink sm:text-lg">
          {title}
        </h2>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
};
