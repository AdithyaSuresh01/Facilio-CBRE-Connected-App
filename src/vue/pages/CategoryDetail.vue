<template>
  <div v-if="!category" class="bg-white min-h-screen flex items-center justify-center font-['Roboto',sans-serif]">
    <div class="text-center">
      <p class="text-[20px] text-[#283648] mb-4">Category not found</p>
      <button @click="goHome" class="text-[#3c229d] underline cursor-pointer">
        Go back to Home
      </button>
    </div>
  </div>

  <div v-else class="bg-white min-h-screen flex flex-col font-['Roboto',sans-serif]">
    <div class="flex-1 w-full max-w-[1024px] mx-auto px-[24px] py-[24px] flex flex-col gap-[24px]">
      <FacilioLogo />

      <div class="pt-[16px]">
        <button
          @click="goHome"
          class="flex items-center gap-[4px] text-[#283648] mb-[16px] hover:text-[#0024D6] transition-colors cursor-pointer"
        >
          <ArrowLeft :size="14" />
          <span
            class="font-['Roboto',sans-serif] font-normal leading-[20px] text-[14px]"
            style="font-variation-settings: 'wdth' 100"
          >
            Back
          </span>
        </button>

        <h1
          class="font-['Roboto',sans-serif] font-medium leading-[28px] text-[#283648] text-[20px] mb-[4px]"
          style="font-variation-settings: 'wdth' 100"
        >
          {{ category.title }}
        </h1>
        <p
          class="font-['Roboto',sans-serif] font-normal leading-[22px] text-[#384a62] text-[16px] mb-[20px]"
          style="font-variation-settings: 'wdth' 100"
        >
          {{ category.description }}
        </p>

        <div class="flex gap-[8px] mb-[16px] flex-wrap">
          <button
            v-for="filter in filters"
            :key="filter.label"
            @click="activeFilter = filter.label"
            class="flex items-center gap-[6px] px-[12px] py-[6px] rounded-full text-[13px] font-['Roboto',sans-serif] font-medium transition-all cursor-pointer"
            :class="
              activeFilter === filter.label
                ? 'bg-white text-[#0024D6] border border-[#0024D6]'
                : 'bg-white text-[#283648] border border-[#dbdbdb] hover:border-[#0024D6]/40'
            "
            style="font-variation-settings: 'wdth' 100"
          >
            {{ filter.label }}
            <span
              class="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[11px] px-[4px]"
              :class="
                activeFilter === filter.label
                  ? 'bg-[#0024D6] text-white'
                  : 'bg-[#f0f0f0] text-[#607796]'
              "
            >
              {{ filter.count }}
            </span>
          </button>
        </div>

        <div class="relative w-full mb-[24px]">
          <Search
            :size="16"
            class="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#607796] pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search resources..."
            class="w-full pl-[36px] pr-[12px] py-[10px] rounded-[10px] border border-[#dbdbdb] bg-white text-[14px] font-['Roboto',sans-serif] text-[#283648] placeholder:text-[#9aa8bc] outline-none focus:border-[#0024D6] transition-colors"
            style="font-variation-settings: 'wdth' 100"
          />
        </div>

        <p
          class="font-['Roboto',sans-serif] font-medium leading-[18px] text-[#607796] text-[11px] tracking-[1px] uppercase mb-[12px]"
          style="font-variation-settings: 'wdth' 100"
        >
          {{ filteredResources.length }} Results
        </p>

        <div class="flex flex-col">
          <div
            v-for="resource in filteredResources"
            :key="resource.id"
            @click="previewResource = resource"
            class="flex items-center justify-between py-[12px] px-[8px] border-b border-[#f0f0f0] transition-colors cursor-pointer hover:bg-[#eef4ff]"
          >
            <div class="flex items-center gap-[12px]">
              <FileText v-if="resource.type === 'Article'" :size="16" class="text-[#607796]" />
              <Video v-else-if="resource.type === 'Video'" :size="16" class="text-[#607796]" />
              <Globe v-else :size="16" class="text-[#607796]" />
              <p
                class="font-['Roboto',sans-serif] font-normal leading-[20px] text-[14px] text-[#283648]"
                style="font-variation-settings: 'wdth' 100"
              >
                {{ resource.title }}
              </p>
            </div>
            <span
              class="font-['Roboto',sans-serif] font-medium text-[12px] leading-[18px] px-[8px] py-[2px] rounded-[4px] border bg-[#f5f5f5] text-[#283648] border-[#dbdbdb]"
              style="font-variation-settings: 'wdth' 100"
            >
              {{ resource.type }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <FooterBar />

    <div
      v-if="previewResource"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="previewResource = null"
    >
      <div class="bg-white rounded-[16px] w-[90vw] max-w-[800px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div class="flex items-center justify-between p-[20px] border-b border-[#eae9e9]">
          <div class="flex items-center gap-[12px]">
            <div class="w-[32px] h-[32px] rounded-[8px] bg-[#f5f5f5] flex items-center justify-center">
              <Play v-if="previewResource.type === 'Video'" :size="16" class="text-[#283648]" />
              <FileText v-else-if="previewResource.type === 'Article'" :size="16" class="text-[#283648]" />
              <FileIcon v-else :size="16" class="text-[#283648]" />
            </div>
            <div>
              <p
                class="font-['Roboto',sans-serif] font-medium text-[16px] leading-[22px] text-[#283648]"
                style="font-variation-settings: 'wdth' 100"
              >
                {{ previewResource.title }}
              </p>
              <p
                class="font-['Roboto',sans-serif] font-normal text-[12px] leading-[18px] text-[#607796]"
                style="font-variation-settings: 'wdth' 100"
              >
                {{
                  previewResource.type === "Video"
                    ? "Video Preview"
                    : previewResource.type === "Article"
                      ? "Article"
                      : "PDF Document Preview"
                }}
              </p>
            </div>
          </div>
          <button
            @click="previewResource = null"
            class="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            <X :size="18" class="text-[#607796]" />
          </button>
        </div>

        <div class="flex-1 overflow-auto p-[20px] bg-[#f8f8fa]">
          <div
            v-if="previewResource.type === 'Article' && previewResource.content"
            class="bg-white rounded-[12px] border border-[#eae9e9] p-[24px]"
          >
            <div class="flex flex-col gap-[4px]">
              <template v-for="(block, idx) in articleBlocks" :key="idx">
                <div
                  v-if="block.type === 'paragraph' && block.isIntro"
                  class="bg-[#f0f4ff] rounded-[10px] px-[20px] py-[16px] mb-[8px] flex items-start gap-[12px]"
                >
                  <BookOpen :size="18" class="text-[#0024D6] mt-[2px] shrink-0" />
                  <p
                    class="font-['Roboto',sans-serif] font-normal text-[14px] leading-[23px] text-[#283648]"
                    style="font-variation-settings: 'wdth' 100"
                    v-html="renderInlineMarkdown(block.text)"
                  />
                </div>

                <div
                  v-else-if="block.type === 'heading'"
                  class="flex items-center gap-[10px] mt-[20px] mb-[10px]"
                >
                  <div class="w-[3px] h-[20px] rounded-full bg-[#0024D6]" />
                  <h2
                    class="font-['Roboto',sans-serif] font-medium text-[15px] leading-[22px] text-[#283648]"
                    style="font-variation-settings: 'wdth' 100"
                  >
                    {{ block.text }}
                  </h2>
                </div>

                <ul
                  v-else-if="block.type === 'bullets'"
                  class="flex flex-col gap-[6px] mb-[8px] pl-[4px]"
                >
                  <li
                    v-for="(item, itemIdx) in block.items"
                    :key="itemIdx"
                    class="flex items-start gap-[10px] py-[6px] px-[12px] rounded-[8px] bg-[#f9fafb] border border-[#f0f0f0]"
                  >
                    <CheckCircle2 :size="15" class="text-[#0024D6] mt-[3px] shrink-0" />
                    <span
                      class="font-['Roboto',sans-serif] font-normal text-[13.5px] leading-[21px] text-[#384a62]"
                      style="font-variation-settings: 'wdth' 100"
                      v-html="renderInlineMarkdown(item)"
                    />
                  </li>
                </ul>

                <div
                  v-else-if="block.type === 'qa'"
                  class="border border-[#eae9e9] rounded-[10px] overflow-hidden mb-[8px]"
                >
                  <div class="flex items-start gap-[10px] bg-[#f8f9fb] px-[16px] py-[12px]">
                    <HelpCircle :size="15" class="text-[#0024D6] mt-[2px] shrink-0" />
                    <p
                      class="font-['Roboto',sans-serif] font-medium text-[13.5px] leading-[21px] text-[#283648]"
                      style="font-variation-settings: 'wdth' 100"
                    >
                      {{ block.question }}
                    </p>
                  </div>
                  <div v-if="block.answer" class="px-[16px] py-[12px] pl-[41px]">
                    <p
                      class="font-['Roboto',sans-serif] font-normal text-[13.5px] leading-[21px] text-[#384a62]"
                      style="font-variation-settings: 'wdth' 100"
                    >
                      {{ block.answer }}
                    </p>
                  </div>
                </div>

                <p
                  v-else-if="block.type === 'paragraph'"
                  class="font-['Roboto',sans-serif] font-normal text-[13.5px] leading-[22px] text-[#384a62] mb-[6px]"
                  style="font-variation-settings: 'wdth' 100"
                  v-html="renderInlineMarkdown(block.text)"
                />
              </template>
            </div>
          </div>

          <div
            v-else-if="previewResource.type === 'Video' && previewResource.url"
            class="w-full aspect-video bg-black rounded-[12px] overflow-hidden"
          >
            <video
              :src="previewResource.url"
              controls
              autoplay
              class="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div
            v-else-if="previewResource.type === 'PDF' && previewResource.url"
            class="w-full h-[60vh] rounded-[12px] overflow-hidden bg-white border border-[#eae9e9]"
          >
            <iframe
              :src="previewResource.url"
              :title="previewResource.title"
              class="w-full h-full"
              style="border: none"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-[12px] p-[16px] border-t border-[#eae9e9]">
          <template v-if="previewResource.type === 'PDF' && previewResource.url">
            <a
              :href="previewResource.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#f5f5f5] text-[#384a62] font-['Roboto',sans-serif] font-medium text-[13px] hover:bg-[#e8e8e8] transition-colors cursor-pointer no-underline"
              style="font-variation-settings: 'wdth' 100"
            >
              <ExternalLink :size="14" />
              Open in New Tab
            </a>
            <a
              :href="previewResource.url"
              download
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#0024D6] text-white font-['Roboto',sans-serif] font-medium text-[13px] hover:bg-[#001bab] transition-colors cursor-pointer no-underline"
              style="font-variation-settings: 'wdth' 100"
            >
              <Download :size="14" />
              Download
            </a>
          </template>
          <a
            v-else-if="previewResource.url"
            :href="previewResource.url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-[16px] py-[8px] rounded-[8px] bg-[#0024D6] text-white font-['Roboto',sans-serif] font-medium text-[13px] hover:bg-[#001bab] transition-colors no-underline"
            style="font-variation-settings: 'wdth' 100"
          >
            Open in New Tab
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
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
} from "lucide-vue-next";
import FacilioLogo from "../components/FacilioLogo.vue";
import FooterBar from "../components/FooterBar.vue";
import { categories, type Resource } from "@/app/components/data";

type FilterType = "All" | "Articles" | "Videos" | "PDF";

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string; isIntro?: boolean }
  | { type: "bullets"; items: string[] }
  | { type: "qa"; question: string; answer: string };

const route = useRoute();
const router = useRouter();

const activeFilter = ref<FilterType>("All");
const previewResource = ref<Resource | null>(null);
const searchQuery = ref("");

const category = computed(() => {
  return categories.find((item) => item.slug === String(route.params.slug));
});

const resources = computed(() => category.value?.resources ?? []);

const filters = computed(() => {
  const articleCount = resources.value.filter((resource) => resource.type === "Article").length;
  const videoCount = resources.value.filter((resource) => resource.type === "Video").length;
  const pdfCount = resources.value.filter((resource) => resource.type === "PDF").length;

  return [
    { label: "All" as FilterType, count: resources.value.length },
    { label: "Articles" as FilterType, count: articleCount },
    { label: "Videos" as FilterType, count: videoCount },
    { label: "PDF" as FilterType, count: pdfCount },
  ];
});

const filteredResources = computed(() => {
  return resources.value.filter((resource) => {
    if (activeFilter.value === "Articles" && resource.type !== "Article") {
      return false;
    }
    if (activeFilter.value === "Videos" && resource.type !== "Video") {
      return false;
    }
    if (activeFilter.value === "PDF" && resource.type !== "PDF") {
      return false;
    }

    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return resource.title.toLowerCase().includes(query);
  });
});

const articleBlocks = computed(() => {
  if (!previewResource.value || previewResource.value.type !== "Article" || !previewResource.value.content) {
    return [] as Block[];
  }

  return parseArticleContent(previewResource.value.content);
});

function goHome() {
  router.push("/");
}

function parseArticleContent(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];

  let index = 0;
  let isFirstParagraph = true;

  while (index < lines.length) {
    const line = lines[index];

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", text: line.replace("## ", "") });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].replace("- ", ""));
        index += 1;
      }
      blocks.push({ type: "bullets", items });
      continue;
    }

    if (line.startsWith("**Q:")) {
      const question = line.replace(/\*\*/g, "").replace("Q: ", "").replace("Q:", "");
      let answer = "";
      index += 1;
      if (index < lines.length && lines[index].startsWith("A:")) {
        answer = lines[index].replace("A: ", "").replace("A:", "");
        index += 1;
      }
      blocks.push({ type: "qa", question, answer });
      continue;
    }

    if (line.startsWith("A:")) {
      blocks.push({ type: "paragraph", text: line });
      index += 1;
      continue;
    }

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    blocks.push({ type: "paragraph", text: line, isIntro: isFirstParagraph });
    isFirstParagraph = false;
    index += 1;
  }

  return blocks;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineMarkdown(text: string): string {
  return escapeHtml(text).replace(
    /\*\*(.*?)\*\*/g,
    "<strong class=\"font-medium text-[#283648]\">$1</strong>"
  );
}
</script>
