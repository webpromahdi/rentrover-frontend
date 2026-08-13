import Logo from "@/components/shared/Logo";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export const AuthPanel = ({ register = false }: { register?: boolean }) => {
  const title = register
    ? "Join RentRover Today"
    : "Your Next Adventure Starts Here";
  const subtitle = register
    ? "List your gear or rent what you need — it's free to join."
    : "Join 1,200+ adventurers renting premium outdoor gear.";
  return (
    <aside className="relative hidden overflow-hidden bg-slate-900 lg:flex lg:min-h-[780px] lg:items-center lg:justify-center">
      <Image
        src="https://i.ibb.co/gFLcqLT5/auth.webp"
        alt="People enjoying outdoor adventures with rental gear"
        fill
        priority
        sizes="(max-width: 1024px) 0vw, 50vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-slate-900/85" />
      <div className="relative z-10 max-w-md px-10 text-center text-white">
        <div className="mx-auto w-fit">
          <Logo inverse />
        </div>
        <h2 className="mt-10 text-4xl font-extrabold leading-tight tracking-[-0.03em]">
          {title}
        </h2>
        <p className="mt-5 text-lg leading-7 text-slate-200">{subtitle}</p>
        {register ? (
          <div className="mt-11 grid grid-cols-3 gap-6 border-y border-white/20 py-6">
            {[
              ["300+", "Providers"],
              ["5,000+", "Gear Items"],
              ["50+", "Categories"],
            ].map(([number, label]) => (
              <div key={label}>
                <p className="text-2xl font-extrabold">{number}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-300">
                  {label}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <ul className="mx-auto mt-10 max-w-xs space-y-4 text-left text-sm font-semibold text-slate-100">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-5 shrink-0 text-white" />
              Verified Providers
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-5 shrink-0 text-white" />
              Flexible Dates
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-5 shrink-0 text-white" />
              Secure Payments
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
};
