<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhLink, PhArrowsOut, PhTimer, PhCamera } from '@phosphor-icons/vue'
import DeviceSelector from '@/components/DeviceSelector.vue'
import CustomViewport from '@/components/CustomViewport.vue'
import type { Preset, Format, ScreenshotRequest } from '@/lib/api'

const emit = defineEmits<{ submit: [req: ScreenshotRequest] }>()
const props = defineProps<{ loading: boolean }>()

const url = ref('')
const preset = ref<Preset>('desktop')
const fullPage = ref(true)
const format = ref<Format>('png')
const delay = ref(0)

const customViewport = ref({
  width: 1280,
  height: 800,
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
})

const urlError = ref<string | null>(null)

const validateUrl = (val: string): string | null => {
  if (!val.trim()) return 'URL is required'
  try {
    const u = new URL(val.startsWith('http') ? val : `https://${val}`)
    if (!['http:', 'https:'].includes(u.protocol)) return 'Must be HTTP or HTTPS'
    return null
  } catch {
    return 'Enter a valid URL'
  }
}

const normaliseUrl = (val: string) =>
  val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`

const handleSubmit = () => {
  const err = validateUrl(url.value)
  if (err) { urlError.value = err; return }
  urlError.value = null

  emit('submit', {
    url: normaliseUrl(url.value),
    preset: preset.value,
    fullPage: fullPage.value,
    format: format.value,
    delay: delay.value,
    ...(preset.value === 'custom' ? { customViewport: customViewport.value } : {}),
  })
}

const delayLabel = computed(() => (delay.value === 0 ? 'None' : `${delay.value / 1000}s`))
</script>

<template>
  <div class="space-y-6">
    <!-- URL -->
    <div class="space-y-2">
      <label class="tag block">Target URL</label>
      <div class="relative">
        <PhLink
          :size="16"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
        <input
          v-model="url"
          type="text"
          placeholder="example.com"
          autocorrect="off"
          autocapitalize="none"
          spellcheck="false"
          @keydown.enter="handleSubmit"
          @blur="urlError = url ? validateUrl(url) : null"
          :class="[
            'w-full rounded-lg border bg-white py-3 pl-10 pr-4 font-mono text-sm text-neutral-900 placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-colors',
            urlError ? 'border-red-300' : 'border-neutral-200',
          ]"
        />
      </div>
      <p v-if="urlError" class="text-xs text-red-600 font-medium">{{ urlError }}</p>
    </div>

    <!-- Device preset -->
    <DeviceSelector v-model="preset" />

    <!-- Custom viewport -->
    <CustomViewport v-if="preset === 'custom'" v-model="customViewport" />

    <!-- Options row -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <!-- Full page -->
      <div class="space-y-2">
        <div class="flex items-center gap-1.5">
          <PhArrowsOut :size="14" class="text-neutral-500" />
          <label class="tag">Full Page</label>
        </div>
        <div class="flex gap-2">
          <button
            v-for="opt in [true, false]"
            :key="String(opt)"
            type="button"
            @click="fullPage = opt"
            :class="[
              'flex-1 rounded-lg border py-2.5 font-medium text-sm transition-all',
              fullPage === opt
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300',
            ]"
          >
            {{ opt ? 'Yes' : 'No' }}
          </button>
        </div>
      </div>

      <!-- Format -->
      <div class="space-y-2">
        <label class="tag">Format</label>
        <div class="flex gap-2">
          <button
            v-for="f in (['png', 'jpeg'] as Format[])"
            :key="f"
            type="button"
            @click="format = f"
            :class="[
              'flex-1 rounded-lg border py-2.5 font-medium text-sm uppercase transition-all',
              format === f
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300',
            ]"
          >
            {{ f }}
          </button>
        </div>
      </div>

      <!-- Delay -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <PhTimer :size="14" class="text-neutral-500" />
            <label class="tag">Delay</label>
          </div>
          <span class="font-mono text-xs text-green-600 font-medium">{{ delayLabel }}</span>
        </div>
        <input
          type="range"
          v-model.number="delay"
          min="0" max="5000" step="500"
          class="w-full accent-green-600 cursor-pointer"
        />
      </div>
    </div>

    <!-- Submit -->
    <button
      type="button"
      @click="handleSubmit"
      :disabled="props.loading"
      :class="[
        'relative w-full overflow-hidden rounded-lg border border-green-600 bg-green-600 py-3 px-4',
        'font-medium text-white text-sm tracking-wide uppercase',
        'transition-all duration-150 hover:border-green-700 hover:bg-green-700 active:scale-[0.99]',
        'disabled:opacity-50 disabled:pointer-events-none',
        props.loading ? 'glow-green' : 'shadow-md hover:shadow-lg',
      ]"
    >
      <span v-if="!props.loading" class="flex items-center justify-center gap-2">
        <PhCamera :size="16" weight="bold" />
        Capture Screenshot
      </span>
      <span v-else class="flex items-center justify-center gap-2">
        <span class="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
        Capturing...
      </span>
    </button>
  </div>
</template>
