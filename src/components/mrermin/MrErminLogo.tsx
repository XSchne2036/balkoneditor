import logo from '@/assets/mrermin-logo.png.asset.json';

export const MrErminLogo = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <img
      src={logo.url}
      alt="Mr. Ermin Logo"
      width={44}
      height={44}
      className="h-11 w-11 rounded-md object-contain"
    />
    <span className="flex flex-col leading-none">
      <span className="text-[15px] font-extrabold uppercase tracking-[0.18em] text-brand-petrol">
        Mr. Ermin
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        Balkon-Konfigurator
      </span>
    </span>
  </div>
);
