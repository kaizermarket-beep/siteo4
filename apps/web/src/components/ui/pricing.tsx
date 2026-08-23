"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

// Vendored from 21st.dev, adapted on three points:
//
// - Euros, not dollars, and the annual figure is a real number rather than a
//   percentage claim: two months free on twelve, which is 16.7%, not the 20%
//   the published copy advertises. Rounding that up on a pricing page is the
//   kind of small untruth that costs trust with a first customer.
// - The card tilt only runs on desktop, as published, but the entrance
//   animation starts at opacity 1. Framer Motion's mount transitions are
//   unreliable in this Next 16 + Turbopack + React 19 setup (see the note in
//   globals.css); if the animation never runs, the cards must still be
//   visible rather than stuck invisible.
// - The annual toggle is presentational. Checkout bills monthly today, and
//   the button says so, because a toggle that silently charges a different
//   amount than the one displayed is worse than no toggle.
// - NumberFlow is gone. Its custom element upgraded but React never passed
//   it the value — an interop problem with React 19 here — so the price
//   stayed on the monthly figure while the period switched to "/ an". The
//   page was advertising 12 € per year. A remount-keyed fade gives the same
//   sense of change, costs no dependency, and cannot display a wrong number.

const EUR = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export interface PricingPlan {
  name: string;
  /** Monthly price in euros. */
  price: number;
  /** Yearly price in euros. */
  yearlyPrice: number;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

export interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  /** Shown under the toggle when annual is selected. */
  annualNote?: string;
}

export function Pricing({
  plans,
  title = "Des tarifs clairs",
  description = "Choisissez la formule qui correspond à votre activité.",
  annualNote,
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (!checked || !switchRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = switchRef.current.getBoundingClientRect();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ["#171717", "#a3a3a3", "#d4d4d4", "#fafafa"],
      ticks: 200,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      shapes: ["circle"],
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-2">
      <div className="mb-10 space-y-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto max-w-2xl text-lg whitespace-pre-line text-neutral-600">
          {description}
        </p>
      </div>

      <div className="mb-10 flex items-center justify-center gap-3">
        <span className={cn("text-sm", isMonthly ? "font-medium text-neutral-900" : "text-neutral-500")}>
          Mensuel
        </span>
        <Label className="cursor-pointer">
          <Switch
            ref={switchRef}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            aria-label="Basculer entre tarif mensuel et annuel"
          />
        </Label>
        <span className={cn("text-sm", !isMonthly ? "font-medium text-neutral-900" : "text-neutral-500")}>
          Annuel <span className="text-neutral-500">(2 mois offerts)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ y: 0, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -20 : index === 0 ? 20 : 0,
                    scale: index === 0 || index === 2 ? 0.95 : 1,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.3,
              opacity: { duration: 0.4 },
            }}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-white p-6 text-center",
              plan.isPopular ? "border-2 border-neutral-900" : "border-neutral-200",
              !plan.isPopular && "md:mt-5",
              index === 0 && "origin-right",
              index === 2 && "origin-left"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 flex items-center rounded-tr-xl rounded-bl-xl bg-neutral-900 px-2 py-0.5">
                <Star className="h-3.5 w-3.5 fill-current text-white" />
                <span className="ml-1 text-xs font-semibold text-white">Le plus choisi</span>
              </div>
            )}

            <div className="flex flex-1 flex-col">
              <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
                {plan.name}
              </p>

              <div className="mt-5 flex items-baseline justify-center gap-x-1">
                <span
                  key={isMonthly ? "m" : "y"}
                  className="animate-fade-up text-5xl font-bold tracking-tight text-neutral-900 [font-variant-numeric:tabular-nums]"
                >
                  {EUR.format(isMonthly ? plan.price : plan.yearlyPrice)}
                </span>
                <span className="text-sm font-semibold text-neutral-500">
                  / {isMonthly ? plan.period : "an"}
                </span>
              </div>

              <p className="mt-1 text-xs text-neutral-500">
                {isMonthly ? "facturé chaque mois" : `soit ${Math.round(plan.yearlyPrice / 12)} € par mois`}
              </p>

              <ul className="mt-6 flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-neutral-900" />
                    <span className="text-left text-sm text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="my-5 w-full border-neutral-200" />

              <Link
                href={plan.href}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "group w-full font-semibold tracking-tight transition-all duration-300",
                  plan.isPopular
                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                    : "bg-white text-neutral-900 hover:bg-neutral-100"
                )}
              >
                {plan.buttonText}
              </Link>

              <p className="mt-4 text-xs leading-5 text-neutral-500">{plan.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {!isMonthly && annualNote && (
        <p className="mt-8 text-center text-xs text-neutral-500">{annualNote}</p>
      )}
    </div>
  );
}
