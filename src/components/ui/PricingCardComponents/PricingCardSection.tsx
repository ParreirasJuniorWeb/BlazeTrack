import { useState } from "react";

export default function PricingCardSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  type plan = {
    name: string;
    description: string;
    features: string[];
    button: string;
    isGrowth: boolean;
    customHeading?: string;
    annualPrice?: string;
    monthlyPrice?: string;
  };

  const plans: plan[] = [
    {
      name: "Starter",
      annualPrice: "9",
      monthlyPrice: "13",
      description: "Best for getting started or short-term use.",
      features: [
        "Core UI components",
        "Responsive layouts",
        "Light & dark themes",
        "Easy customization options",
        "Personal projects usage",
      ],
      button: "Get Started",
      isGrowth: false,
    },
    {
      name: "Growth",
      annualPrice: "5",
      monthlyPrice: "7",
      description: "Ideal for long-term, uninterrupted usage.",
      features: [
        "Advanced UI components",
        "Design token system",
        "Component variants",
        "Commercial usage rights",
        "Regular component updates",
      ],
      button: "Get Started",
      isGrowth: true,
    },
    {
      name: "Custom",
      customHeading: "Let's Talk!",
      description: "Ideal for enterprises usages.",
      features: [
        "Complete design system",
        "Advanced interaction states",
        "Early access updates",
        "Priority developer support",
        "Unlimited commercial usage",
      ],
      button: "Get Started",
      isGrowth: false,
    },
  ];

  return (
    <>
      <section className="bg-black py-16 mt-10">
        <div className="border border-neutral-800"></div>
        <div className="px-4">
          <div className="max-w-5xl mx-auto border border-r-neutral-800 border-l-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 p-6 md:p-8">
              <div>
                <h1 className="text-3xl font-medium text-white max-w-xs mb-5">
                  Pricing That Scales With Your Needs
                </h1>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`text-sm pl-4 pr-2 py-2 rounded-full cursor-pointer transition-colors ${isAnnual ? "text-white border border-neutral-800" : "text-white/60 border border-transparent"}`}
                  >
                    Annually{" "}
                    <span className="bg-neutral-800 text-white text-xs px-2 py-1 rounded-full ml-2">
                      SAVE 30%
                    </span>
                  </button>
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`text-sm px-3 py-2 rounded-full cursor-pointer transition-colors ${!isAnnual ? "text-white border border-neutral-800" : "text-white/60 border border-transparent"}`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="max-w-87.5">
                <p className="text-base text-neutral-200 mb-4">
                  Select a plan that matches your usage today and upgrade
                  anytime as your needs grow.
                </p>
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-sm border border-neutral-600 flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.667 5 7.5 14.167 3.333 10"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-200">
                    30-Day Money-Back Guarantee
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 mt-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`px-8 py-6 flex flex-col ${plan.isGrowth ? "border border-neutral-800 border-b-0" : "max-md:border max-md:border-neutral-800 max-md:border-b-0"}`}
                >
                  {plan.isGrowth ? (
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-white">
                        {plan.name}
                      </h3>
                      <button className="bg-orange-600 text-white text-xs px-2 py-1 rounded-sm">
                        Best Value
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-base font-medium text-white mb-4">
                      {plan.name}
                    </h3>
                  )}
                  {plan.customHeading ? (
                    <h2 className="text-2xl font-semibold text-zinc-50 mb-2">
                      {plan.customHeading}
                    </h2>
                  ) : (
                    <div className="mb-2">
                      <span className="text-2xl font-semibold text-zinc-50">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span
                        className={`${plan.isGrowth ? "text-sm" : "text-xs"} font-medium text-zinc-50`}
                      >
                        /month
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-white mb-5">{plan.description}</p>
                  <div className="border-t border-neutral-800 pt-5 flex flex-col gap-3.5 mb-10">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.667 5 7.5 14.167 3.333 10"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`${plan.isGrowth ? "bg-white text-black" : "border border-neutral-800 text-white hover:bg-neutral-950"} text-sm font-medium py-2.5 rounded-sm transition-colors cursor-pointer ${plan.isGrowth ? "hover:bg-zinc-200" : ""}`}
                  >
                    {plan.button}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border border-neutral-800"></div>
      </section>
    </>
  );
}
