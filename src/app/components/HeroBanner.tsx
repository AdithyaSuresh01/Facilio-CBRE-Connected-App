import imgImageFacilio from "figma:asset/722b9281be5b09222cdbefe96f950dbec5af3ad4.png";
import heroIllustration from "figma:asset/efbf9ade99ba2e5bfd139f1c19a09123667f6298.png";
import { Search } from "lucide-react";

export function FacilioLogo() {
  return (
    <div className="h-[18px] relative shrink-0 w-[71.25px]">
      <img
        alt="Facilio"
        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
        src={imgImageFacilio}
      />
    </div>
  );
}

export function HeroBanner({
  searchQuery,
  onSearchChange,
}: {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}) {
  return (
    <div className="bg-[#3c229d] sm:h-[200px] relative rounded-[16px] shrink-0 w-full overflow-hidden">
      {/* Desktop layout */}
      <div className="hidden sm:flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[40px] items-center px-[40px] relative size-full">
          {/* Text content */}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative z-[1]">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full whitespace-pre-wrap">
              <p
                className="capitalize font-['Roboto',sans-serif] font-medium leading-[26px] min-w-full relative shrink-0 text-[#edf5ff] text-[20px] w-[min-content]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Knowledge Base
              </p>
              <p
                className="font-['Roboto',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#d8e3f1] text-[16px] w-[400px] max-w-full"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Manuals, training materials and guidelines enabling seamless operations across the platform
              </p>
            </div>
            {onSearchChange && (
              <div className="relative w-full max-w-[400px]">
                <Search
                  size={16}
                  className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b7cc8] pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-[36px] pr-[12px] py-[9px] rounded-[10px] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.12)] text-[14px] font-['Roboto',sans-serif] text-white placeholder:text-[rgba(255,255,255,0.5)] outline-none focus:border-[rgba(255,255,255,0.5)] focus:bg-[rgba(255,255,255,0.18)] transition-colors"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                />
              </div>
            )}
          </div>
          {/* Illustration image */}
          <img
            src={heroIllustration}
            alt="Help desk illustration"
            className="h-[160px] shrink-0 object-contain absolute bottom-0 right-[40px]"
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex sm:hidden flex-col items-center px-[20px] pt-[24px] pb-[16px] gap-[16px]">
        {/* Text content */}
        <div className="flex flex-col gap-[6px] items-center text-center w-full">
          <p
            className="capitalize font-['Roboto',sans-serif] font-medium leading-[24px] text-[#edf5ff] text-[18px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Knowledge Base
          </p>
          <p
            className="font-['Roboto',sans-serif] font-normal leading-[20px] text-[#d8e3f1] text-[14px] max-w-[320px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Manuals, training materials and guidelines enabling seamless operations across the platform
          </p>
        </div>
        {/* Search bar */}
        {onSearchChange && (
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b7cc8] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-[36px] pr-[12px] py-[9px] rounded-[10px] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.12)] text-[14px] font-['Roboto',sans-serif] text-white placeholder:text-[rgba(255,255,255,0.5)] outline-none focus:border-[rgba(255,255,255,0.5)] focus:bg-[rgba(255,255,255,0.18)] transition-colors"
              style={{ fontVariationSettings: "'wdth' 100" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <div className="flex gap-[8px] h-[48px] items-center justify-center w-full border-t border-[#dbdbdb]">
      <div className="h-[12px] relative shrink-0 w-[48px]">
        <img
          alt="Facilio"
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgImageFacilio}
        />
      </div>
      <div className="bg-[#dbdbdb] h-[10px] shrink-0 w-px" />
      <p
        className="font-['Roboto',sans-serif] font-medium leading-[18px] text-[#607796] text-[12px] opacity-70"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        Help Desk · 2026
      </p>
    </div>
  );
}