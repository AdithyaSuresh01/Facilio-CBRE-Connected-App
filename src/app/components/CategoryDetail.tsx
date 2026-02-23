import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FacilioLogo, Footer } from "./HeroBanner";
import { categories, type ResourceType, type Resource } from "./data";
import {
  ArrowLeft,
  FileText,
  Video,
  FileIcon,
  X,
  Globe,
  Play,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Download,
  ExternalLink,
  Search,
} from "lucide-react";

type FilterType = "All" | "Articles" | "Videos" | "PDF";

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-['Roboto',sans-serif]">
        <div className="text-center">
          <p className="text-[20px] text-[#283648] mb-4">Category not found</p>
          <button
            onClick={() => navigate("/")}
            className="text-[#3c229d] underline"
          >
            Go back to Home
          </button>
        </div>
      </div>
    );
  }

  const articleCount = category.resources.filter(
    (r) => r.type === "Article"
  ).length;
  const videoCount = category.resources.filter(
    (r) => r.type === "Video"
  ).length;
  const pdfCount = category.resources.filter((r) => r.type === "PDF").length;
  const totalCount = category.resources.length;

  const filteredResources = category.resources.filter((resource) => {
    if (activeFilter === "All") {
    } else if (activeFilter === "Articles" && resource.type !== "Article") {
      return false;
    } else if (activeFilter === "Videos" && resource.type !== "Video") {
      return false;
    } else if (activeFilter === "PDF" && resource.type !== "PDF") {
      return false;
    }

    if (searchQuery.trim()) {
      return resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  const filters: { label: FilterType; count: number }[] = [
    { label: "All", count: totalCount },
    { label: "Articles", count: articleCount },
    { label: "Videos", count: videoCount },
    { label: "PDF", count: pdfCount },
  ];

  const handleResourceClick = (resource: Resource) => {
    setPreviewResource(resource);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-['Roboto',sans-serif]">
      <div className="flex-1 w-full max-w-[1024px] mx-auto px-[24px] py-[24px] flex flex-col gap-[24px]">
        <FacilioLogo />

        <div className="pt-[16px]">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-[4px] text-[#283648] mb-[16px] hover:text-[#0024D6] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span
              className="font-['Roboto',sans-serif] font-normal leading-[20px] text-[14px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Back
            </span>
          </button>

          {/* Category Title */}
          <h1
            className="font-['Roboto',sans-serif] font-medium leading-[28px] text-[#283648] text-[20px] mb-[4px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {category.title}
          </h1>
          <p
            className="font-['Roboto',sans-serif] font-normal leading-[22px] text-[#384a62] text-[16px] mb-[20px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {category.description}
          </p>

          {/* Filter Tabs */}
          <div className="flex gap-[8px] mb-[16px] flex-wrap">
            {filters.map((filter) => (
              <FilterTab
                key={filter.label}
                label={filter.label}
                count={filter.count}
                isActive={activeFilter === filter.label}
                onClick={() => setActiveFilter(filter.label)}
              />
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full mb-[24px]">
            <Search
              size={16}
              className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#607796] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-[36px] pr-[12px] py-[10px] rounded-[10px] border border-[#dbdbdb] bg-white text-[14px] font-['Roboto',sans-serif] text-[#283648] placeholder:text-[#9aa8bc] outline-none focus:border-[#0024D6] transition-colors"
              style={{ fontVariationSettings: "'wdth' 100" }}
            />
          </div>

          {/* Results count */}
          <p
            className="font-['Roboto',sans-serif] font-medium leading-[18px] text-[#607796] text-[11px] tracking-[1px] uppercase mb-[12px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {filteredResources.length} Results
          </p>

          {/* Resource List */}
          <div className="flex flex-col">
            {filteredResources.map((resource) => (
              <ResourceRow
                key={resource.id}
                resource={resource}
                onClick={() => handleResourceClick(resource)}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />

      {/* Preview Modal */}
      {previewResource && (
        <PreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
        />
      )}
    </div>
  );
}

interface FilterTabProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

function FilterTab({ label, count, isActive, onClick }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-full text-[13px] font-['Roboto',sans-serif] font-medium transition-all cursor-pointer ${
        isActive
          ? "bg-white text-[#0024D6] border border-[#0024D6]"
          : "bg-white text-[#283648] border border-[#dbdbdb] hover:border-[#0024D6]/40"
      }`}
      style={{ fontVariationSettings: "'wdth' 100" }}
    >
      {label}
      <span
        className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[11px] px-[4px] ${
          isActive
            ? "bg-[#0024D6] text-white"
            : "bg-[#f0f0f0] text-[#607796]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function getResourceIcon(type: ResourceType) {
  switch (type) {
    case "Article":
      return <FileText size={16} className="text-[#607796]" />;
    case "Video":
      return <Video size={16} className="text-[#607796]" />;
    case "PDF":
      return <Globe size={16} className="text-[#607796]" />;
  }
}

function getTypeBadgeStyles(_type: ResourceType) {
  return "bg-[#f5f5f5] text-[#283648] border-[#dbdbdb]";
}

interface ResourceRowProps {
  resource: Resource;
  onClick: () => void;
}

function ResourceRow({ resource, onClick }: ResourceRowProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between py-[12px] px-[8px] border-b border-[#f0f0f0] transition-colors cursor-pointer hover:bg-[#eef4ff]"
    >
      <div className="flex items-center gap-[12px]">
        {getResourceIcon(resource.type)}
        <p
          className="font-['Roboto',sans-serif] font-normal leading-[20px] text-[14px] text-[#283648]"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          {resource.title}
        </p>
      </div>
      <span
        className={`font-['Roboto',sans-serif] font-medium text-[12px] leading-[18px] px-[8px] py-[2px] rounded-[4px] border ${getTypeBadgeStyles(
          resource.type
        )}`}
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        {resource.type}
      </span>
    </div>
  );
}

interface PreviewModalProps {
  resource: Resource;
  onClose: () => void;
}

function PreviewModal({ resource, onClose }: PreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[16px] w-[90vw] max-w-[800px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-[20px] border-b border-[#eae9e9]">
          <div className="flex items-center gap-[12px]">
            {resource.type === "Video" ? (
              <div className="w-[32px] h-[32px] rounded-[8px] bg-[#f5f5f5] flex items-center justify-center">
                <Play size={16} className="text-[#283648]" />
              </div>
            ) : resource.type === "Article" ? (
              <div className="w-[32px] h-[32px] rounded-[8px] bg-[#f5f5f5] flex items-center justify-center">
                <FileText size={16} className="text-[#283648]" />
              </div>
            ) : (
              <div className="w-[32px] h-[32px] rounded-[8px] bg-[#f5f5f5] flex items-center justify-center">
                <FileIcon size={16} className="text-[#283648]" />
              </div>
            )}
            <div>
              <p
                className="font-['Roboto',sans-serif] font-medium text-[16px] leading-[22px] text-[#283648]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                {resource.title}
              </p>
              <p
                className="font-['Roboto',sans-serif] font-normal text-[12px] leading-[18px] text-[#607796]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                {resource.type === "Video"
                  ? "Video Preview"
                  : resource.type === "Article"
                  ? "Article"
                  : "PDF Document Preview"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            <X size={18} className="text-[#607796]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-[20px] bg-[#f8f8fa]">
          {resource.type === "Article" && resource.content && (
            <div className="bg-white rounded-[12px] border border-[#eae9e9] p-[24px]">
              <ArticleContent content={resource.content} />
            </div>
          )}

          {resource.type === "Video" && (
            <div className="w-full aspect-video bg-black rounded-[12px] overflow-hidden">
              <video
                src={resource.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {resource.type === "PDF" && (
            <div className="w-full h-[60vh] rounded-[12px] overflow-hidden bg-white border border-[#eae9e9]">
              <iframe
                src={resource.url}
                title={resource.title}
                className="w-full h-full"
                style={{ border: "none" }}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-[12px] p-[16px] border-t border-[#eae9e9]">
          {resource.type === "PDF" && (
            <>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#f5f5f5] text-[#384a62] font-['Roboto',sans-serif] font-medium text-[13px] hover:bg-[#e8e8e8] transition-colors cursor-pointer no-underline"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                <ExternalLink size={14} />
                Open in New Tab
              </a>
              <a
                href={resource.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#0024D6] text-white font-['Roboto',sans-serif] font-medium text-[13px] hover:bg-[#001bab] transition-colors cursor-pointer no-underline"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                <Download size={14} />
                Download
              </a>
            </>
          )}
          {resource.type !== "PDF" && resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-[16px] py-[8px] rounded-[8px] bg-[#0024D6] text-white font-['Roboto',sans-serif] font-medium text-[13px] hover:bg-[#001bab] transition-colors no-underline"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Open in New Tab
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticleContent({ content }: { content: string }) {
  const lines = content.split("\n");

  // Parse lines into structured blocks
  type Block =
    | { type: "heading"; text: string }
    | { type: "paragraph"; text: string; isIntro?: boolean }
    | { type: "bullets"; items: string[] }
    | { type: "qa"; question: string; answer: string };

  const blocks: Block[] = [];
  let i = 0;
  let isFirstParagraph = true;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", text: line.replace("## ", "") });
      i++;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace("- ", ""));
        i++;
      }
      blocks.push({ type: "bullets", items });
    } else if (line.startsWith("**Q:")) {
      const question = line.replace(/\*\*/g, "").replace("Q: ", "").replace("Q:", "");
      let answer = "";
      i++;
      if (i < lines.length && lines[i].startsWith("A:")) {
        answer = lines[i].replace("A: ", "").replace("A:", "");
        i++;
      }
      blocks.push({ type: "qa", question, answer });
    } else if (line.startsWith("A:")) {
      // Stray answer line — treat as paragraph
      blocks.push({ type: "paragraph", text: line });
      i++;
    } else if (line.trim() === "") {
      i++;
    } else {
      blocks.push({ type: "paragraph", text: line, isIntro: isFirstParagraph });
      isFirstParagraph = false;
      i++;
    }
  }

  return (
    <div className="flex flex-col gap-[4px]">
      {blocks.map((block, idx) => {
        if (block.type === "paragraph" && block.isIntro) {
          return (
            <div
              key={idx}
              className="bg-[#f0f4ff] rounded-[10px] px-[20px] py-[16px] mb-[8px] flex items-start gap-[12px]"
            >
              <BookOpen
                size={18}
                className="text-[#0024D6] mt-[2px] shrink-0"
              />
              <p
                className="font-['Roboto',sans-serif] font-normal text-[14px] leading-[23px] text-[#283648]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                {renderInlineMarkdown(block.text)}
              </p>
            </div>
          );
        }

        if (block.type === "heading") {
          return (
            <div
              key={idx}
              className="flex items-center gap-[10px] mt-[20px] mb-[10px]"
            >
              <div className="w-[3px] h-[20px] rounded-full bg-[#0024D6]" />
              <h2
                className="font-['Roboto',sans-serif] font-medium text-[15px] leading-[22px] text-[#283648]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                {block.text}
              </h2>
            </div>
          );
        }

        if (block.type === "bullets") {
          return (
            <ul
              key={idx}
              className="flex flex-col gap-[6px] mb-[8px] pl-[4px]"
            >
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-[10px] py-[6px] px-[12px] rounded-[8px] bg-[#f9fafb] border border-[#f0f0f0]"
                >
                  <CheckCircle2
                    size={15}
                    className="text-[#0024D6] mt-[3px] shrink-0"
                  />
                  <span
                    className="font-['Roboto',sans-serif] font-normal text-[13.5px] leading-[21px] text-[#384a62]"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    {renderInlineMarkdown(item)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "qa") {
          return (
            <div
              key={idx}
              className="border border-[#eae9e9] rounded-[10px] overflow-hidden mb-[8px]"
            >
              <div className="flex items-start gap-[10px] bg-[#f8f9fb] px-[16px] py-[12px]">
                <HelpCircle
                  size={15}
                  className="text-[#0024D6] mt-[2px] shrink-0"
                />
                <p
                  className="font-['Roboto',sans-serif] font-medium text-[13.5px] leading-[21px] text-[#283648]"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {block.question}
                </p>
              </div>
              {block.answer && (
                <div className="px-[16px] py-[12px] pl-[41px]">
                  <p
                    className="font-['Roboto',sans-serif] font-normal text-[13.5px] leading-[21px] text-[#384a62]"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    {block.answer}
                  </p>
                </div>
              )}
            </div>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={idx}
              className="font-['Roboto',sans-serif] font-normal text-[13.5px] leading-[22px] text-[#384a62] mb-[6px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {renderInlineMarkdown(block.text)}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <span key={key++} className="font-medium text-[#283648]">
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return parts;
}