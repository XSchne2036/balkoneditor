export const NovodachLogo = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`} aria-label="NOVO DACH">
    <span className="relative flex h-9 w-9 items-center justify-center rounded-md bg-brand-petrol">
      <span className="absolute h-[2px] w-6 rotate-45 rounded-full bg-white" />
    </span>
    <span className="flex flex-col leading-none">
      <span className="rounded-sm bg-brand-yellow px-1.5 py-0.5 text-[13px] font-bold uppercase tracking-[0.2em] text-brand-petrol">
        NOVO
      </span>
      <span className="mt-0.5 px-1.5 text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-petrol">
        DACH
      </span>
    </span>
  </div>
);
