<template>
  <div class="bg-white min-h-screen flex flex-col font-['Roboto',sans-serif]">
    <div class="flex-1 w-full max-w-[1024px] mx-auto px-[24px] py-[24px] flex flex-col gap-[24px]">
      <FacilioLogo />
      <HeroBanner v-model:searchQuery="searchQuery" :searchable="true" />
      <div v-if="filteredCategories.length === 0" class="flex items-center justify-center py-[40px]">
        <p
          class="font-['Roboto',sans-serif] font-normal text-[14px] text-[#607796]"
          style="font-variation-settings: 'wdth' 100"
        >
          No categories match your search.
        </p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          @click="openCategory(category.slug)"
          class="bg-white relative rounded-[16px] cursor-pointer transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] group"
        >
          <div class="flex flex-col gap-[8px] items-start p-[16px] w-full">
            <div class="flex items-center justify-between w-full">
              <p
                class="capitalize font-['Roboto',sans-serif] font-medium leading-[20px] text-[#283648] text-[14px]"
                style="font-variation-settings: 'wdth' 100"
              >
                {{ category.title }}
              </p>
              <ChevronRight
                :size="16"
                class="text-[#283648] opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <p
              class="font-['Roboto',sans-serif] font-normal leading-[20px] text-[#384a62] text-[14px] whitespace-pre-wrap"
              style="font-variation-settings: 'wdth' 100; font-feature-settings: 'liga' 0"
            >
              {{ category.description }}
            </p>
          </div>
          <div
            aria-hidden="true"
            class="absolute border-[#eae9e9] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[16px] group-hover:border-[#c0c0c0] transition-colors"
          />
        </div>
      </div>
    </div>
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { ChevronRight } from "lucide-vue-next";
import HeroBanner from "../components/HeroBanner.vue";
import FooterBar from "../components/FooterBar.vue";
import FacilioLogo from "../components/FacilioLogo.vue";
import { categories } from "@/app/components/data";

const router = useRouter();
const searchQuery = ref("");

const filteredCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return categories;
  }

  return categories.filter((category) => {
    return (
      category.title.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    );
  });
});

function openCategory(slug: string) {
  router.push(`/category/${slug}`);
}
</script>
