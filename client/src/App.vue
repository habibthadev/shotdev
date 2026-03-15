<script setup lang="ts">
import { ref } from 'vue'
import { PhCameraSlash } from '@phosphor-icons/vue'
import ScreenshotForm from '@/components/ScreenshotForm.vue'
import ScreenshotResult from '@/components/ScreenshotResult.vue'
import { useScreenshot } from '@/composables/useScreenshot'
import type { ScreenshotRequest } from '@/lib/api'

const { state, result, errorMessage, isLoading, hasResult, capture, reset, downloadImage } =
  useScreenshot()

const lastUrl = ref<string | null>(null)

const handleSubmit = async (req: ScreenshotRequest) => {
  lastUrl.value = req.url
  await capture(req)
}
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-3xl">

      <header class="mb-12 text-center">
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-3">
          screenshotter
        </h1>
        <p class="text-base sm:text-lg text-neutral-600 font-medium">
          Capture any website at any viewport. No extensions needed.
        </p>
      </header>

      <main class="rounded-xl border border-neutral-200 bg-white shadow-lg space-y-6 p-6 sm:p-8">
        <ScreenshotForm :loading="isLoading" @submit="handleSubmit" />
      </main>

      <div
        v-if="state === 'error'"
        class="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 animate-fade-in"
      >
        <PhCameraSlash :size="18" class="mt-0.5 shrink-0 text-red-600 flex-shrink-0" />
        <div class="flex-1">
          <p class="font-semibold text-sm text-red-900">Capture failed</p>
          <p class="text-sm text-red-700 mt-0.5">{{ errorMessage }}</p>
        </div>
      </div>

      <div v-if="hasResult && result" class="mt-8">
        <ScreenshotResult
          :result="result"
          :url="lastUrl"
          @download="downloadImage"
          @reset="reset"
        />
      </div>

    </div>
  </div>
</template>
