import Image from "next/image";

export default function TrustedBrandSection() {
  const companyLogos = [
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
  ];

  return (
    <>
      <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

      <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none my-12 py-4">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none" />
        <div
          className="marquee-inner flex will-change-transform min-w-[200%]"
          style={{ animationDuration: "15s" }}
        >
          <div className="flex">
            {[...companyLogos, ...companyLogos].map((company, index) => (
              <Image
                key={index}
                src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
                alt={company}
                className="w-full h-full object-cover mx-6"
                draggable={false}
                width={100}
                height={100}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none" />
      </div>
    </>
  );
}
