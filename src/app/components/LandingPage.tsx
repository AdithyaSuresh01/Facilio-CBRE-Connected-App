import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { FacilioLogo, HeroBanner, Footer } from "./HeroBanner";
import { categories } from "./data";
import { useState } from "react";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((category) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.title.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white min-h-screen flex flex-col font-['Roboto',sans-serif]">
      <div className="flex-1 w-full max-w-[1024px] mx-auto px-[24px] py-[24px] flex flex-col gap-[24px]">
        <FacilioLogo />
        <HeroBanner searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <CategoryGrid categories={filteredCategories} />
      </div>
      <Footer />
    </div>
  );
}

function CategoryGrid({ categories: cats }: { categories: typeof categories }) {
  if (cats.length === 0) {
    return (
      <div className="flex items-center justify-center py-[40px]">
        <p
          className="font-['Roboto',sans-serif] font-normal text-[14px] text-[#607796]"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          No categories match your search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
      {cats.map((category, index) => (
        <CategoryCard
          key={category.id}
          title={category.title}
          description={category.description}
          slug={category.slug}
        />
      ))}
    </div>
  );
}

interface CategoryCardProps {
  title: string;
  description: string;
  slug: string;
}

function CategoryCard({
  title,
  description,
  slug,
}: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/category/${slug}`)}
      className="bg-white relative rounded-[16px] cursor-pointer transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] group"
    >
      <div className="flex flex-col gap-[8px] items-start p-[16px] w-full">
        <div className="flex items-center justify-between w-full">
          <p
            className="capitalize font-['Roboto',sans-serif] font-medium leading-[20px] text-[#283648] text-[14px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {title}
          </p>
          <ChevronRight
            size={16}
            className="text-[#283648] opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <p
          className="font-['Roboto',sans-serif] font-normal leading-[20px] text-[#384a62] text-[14px] whitespace-pre-wrap"
          style={{
            fontVariationSettings: "'wdth' 100",
            fontFeatureSettings: "'liga' 0",
          }}
        >
          {description}
        </p>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#eae9e9] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[16px] group-hover:border-[#c0c0c0] transition-colors"
      />
    </div>
  );
}