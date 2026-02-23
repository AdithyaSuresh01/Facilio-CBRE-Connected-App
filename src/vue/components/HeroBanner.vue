<template>
  <div class="bg-[#3c229d] sm:h-[200px] relative rounded-[16px] shrink-0 w-full overflow-hidden">
    <div class="hidden sm:flex flex-row items-center size-full">
      <div class="content-stretch flex gap-[40px] items-center px-[40px] relative size-full">
        <div class="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative z-[1]">
          <div class="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full whitespace-pre-wrap">
            <p
              class="capitalize font-['Roboto',sans-serif] font-medium leading-[26px] min-w-full relative shrink-0 text-[#edf5ff] text-[20px] w-[min-content]"
              style="font-variation-settings: 'wdth' 100"
            >
              Knowledge Base
            </p>
            <p
              class="font-['Roboto',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#d8e3f1] text-[16px] w-[400px] max-w-full"
              style="font-variation-settings: 'wdth' 100"
            >
              Manuals, training materials and guidelines enabling seamless operations across the platform
            </p>
          </div>
          <div v-if="searchable" class="relative w-full max-w-[400px]">
            <Search
              :size="16"
              class="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b7cc8] pointer-events-none"
            />
            <input
              type="text"
              :value="searchQuery"
              @input="onInput"
              placeholder="Search categories..."
              class="w-full pl-[36px] pr-[12px] py-[9px] rounded-[10px] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.12)] text-[14px] font-['Roboto',sans-serif] text-white placeholder:text-[rgba(255,255,255,0.5)] outline-none focus:border-[rgba(255,255,255,0.5)] focus:bg-[rgba(255,255,255,0.18)] transition-colors"
              style="font-variation-settings: 'wdth' 100"
            />
          </div>
        </div>

        <div class="absolute bottom-0 right-[40px] h-[160px] w-[220px] pointer-events-none">
          <div class="relative h-full w-full">
            <div class="absolute inset-x-0 bottom-[8px] h-[14px] rounded-full bg-[#2f1882]/65 blur-[2px]" />
            <div
              class="absolute right-[20px] bottom-[24px] h-[104px] w-[104px] rounded-full border-[10px] border-[#9f8de0] bg-[#f7f4ff]"
            />
            <div
              class="absolute left-[20px] bottom-[30px] h-[76px] w-[120px] rounded-[14px] border border-[#8f7ed0] bg-[#d7c8ff]"
            />
            <div class="absolute right-[44px] bottom-[60px] h-[20px] w-[40px] rounded-full bg-[#e7deff]" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex sm:hidden flex-col items-center px-[20px] pt-[24px] pb-[16px] gap-[16px]">
      <div class="flex flex-col gap-[6px] items-center text-center w-full">
        <p
          class="capitalize font-['Roboto',sans-serif] font-medium leading-[24px] text-[#edf5ff] text-[18px]"
          style="font-variation-settings: 'wdth' 100"
        >
          Knowledge Base
        </p>
        <p
          class="font-['Roboto',sans-serif] font-normal leading-[20px] text-[#d8e3f1] text-[14px] max-w-[320px]"
          style="font-variation-settings: 'wdth' 100"
        >
          Manuals, training materials and guidelines enabling seamless operations across the platform
        </p>
      </div>
      <div v-if="searchable" class="relative w-full">
        <Search
          :size="16"
          class="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b7cc8] pointer-events-none"
        />
        <input
          type="text"
          :value="searchQuery"
          @input="onInput"
          placeholder="Search categories..."
          class="w-full pl-[36px] pr-[12px] py-[9px] rounded-[10px] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.12)] text-[14px] font-['Roboto',sans-serif] text-white placeholder:text-[rgba(255,255,255,0.5)] outline-none focus:border-[rgba(255,255,255,0.5)] focus:bg-[rgba(255,255,255,0.18)] transition-colors"
          style="font-variation-settings: 'wdth' 100"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from "lucide-vue-next";

withDefaults(
  defineProps<{
    searchQuery?: string;
    searchable?: boolean;
  }>(),
  {
    searchQuery: "",
    searchable: true,
  }
);

const emit = defineEmits<{
  "update:searchQuery": [value: string];
}>();

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit("update:searchQuery", value);
}
</script>
