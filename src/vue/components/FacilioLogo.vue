<template>
  <div
    :class="small ? 'h-[12px] w-[48px]' : 'h-[18px] w-[71.25px]'"
    class="relative shrink-0 rounded-[3px] bg-[#2563eb] text-white"
    aria-label="Facilio logo"
  >
    <div class="absolute inset-0 flex items-center justify-center">
      <span
        :class="small ? 'text-[8px]' : 'text-[11px]'"
        class="font-['Roboto',sans-serif] font-medium tracking-[0.8px] uppercase leading-none"
      >
        Facilio
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    small?: boolean;
  }>(),
  {
    small: false,
  }
);
</script>
