<script setup lang="ts">
import { ref } from 'vue'
import {
  PhDownloadSimple,
  PhArrowsOut,
  PhX,
  PhCheckCircle,
} from '@phosphor-icons/vue'
import type { ScreenshotSuccess } from '@/lib/api'

const props = defineProps<{
  result: ScreenshotSuccess
  url: string | null
}>()

const emit = defineEmits<{
  download: []
  reset: []
}>()

const lightboxOpen = ref(false)

const domain = (url: string | null) => {
  if (!url) return 'unknown'
  try { return new URL(url).hostname } catch { return url }
}
</script>

<template>
  <div class="space-y-4 animate-fade-in">
    <!-- Header bar -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-2 text-sm">
        <PhCheckCircle :size="16" class="text-green-600 flex-shrink-0" weight="fill" />
        <span class="font-medium text-green-600">Captured</span>
        <span class="text-neutral-500">·</span>
        <span class="text-neutral-600 font-mono text-xs">{{ domain(url) }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="lightboxOpen = true"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 text-sm font-medium transition-all hover:border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100"
        >
          <PhArrowsOut :size="14" />
          <span class="hidden sm:inline">Expand</span>
        </button>
        <button
          type="button"
          @click="emit('download')"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-green-600 bg-green-600 text-white text-sm font-medium transition-all hover:border-green-700 hover:bg-green-700 active:bg-green-800"
        >
          <PhDownloadSimple :size="14" />
          <span class="hidden sm:inline">Download</span>
        </button>
        <button
          type="button"
          @click="emit('reset')"
          class="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-all hover:border-red-200 hover:text-red-600 active:bg-red-50"
          title="Clear"
        >
          <PhX :size="14" />
        </button>
      </div>
    </div>

    <!-- Preview (scrollable for tall full-page captures) -->
    <div
      class="relative max-h-[60vh] overflow-auto rounded-lg border border-neutral-200 bg-neutral-50"
    >
      <img
        :src="result.objectUrl"
        alt="Screenshot preview"
        class="w-full cursor-zoom-in"
        @click="lightboxOpen = true"
        loading="lazy"
      />
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-auto"
        @click.self="lightboxOpen = false"
      >
        <div class="relative">
          <button
            type="button"
            @click="lightboxOpen = false"
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <PhX :size="18" />
          </button>
          <img
            :src="result.objectUrl"
            alt="Screenshot fullsize"
            class="max-w-[90vw] max-h-[90vh] rounded-lg"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
