<script setup lang="ts">
type CustomViewport = {
  width: number
  height: number
  deviceScaleFactor: number
  isMobile: boolean
  hasTouch: boolean
  userAgent: string
}

const props = defineProps<{ modelValue: CustomViewport }>()
const emit = defineEmits<{ 'update:modelValue': [value: CustomViewport] }>()

const update = <K extends keyof CustomViewport>(key: K, value: CustomViewport[K]) =>
  emit('update:modelValue', { ...props.modelValue, [key]: value })
</script>

<template>
  <div class="rounded-lg border border-neutral-200 bg-neutral-50 p-4 space-y-4 animate-fade-in">
    <label class="tag block">Custom Viewport</label>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <label class="space-y-1.5">
        <span class="tag">Width (px)</span>
        <input
          type="number" min="320" max="3840"
          :value="props.modelValue.width"
          @input="update('width', +($event.target as HTMLInputElement).value)"
          class="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600"
        />
      </label>

      <label class="space-y-1.5">
        <span class="tag">Height (px)</span>
        <input
          type="number" min="240" max="2160"
          :value="props.modelValue.height"
          @input="update('height', +($event.target as HTMLInputElement).value)"
          class="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600"
        />
      </label>

      <label class="space-y-1.5">
        <span class="tag">Scale (DPR)</span>
        <select
          :value="props.modelValue.deviceScaleFactor"
          @change="update('deviceScaleFactor', +($event.target as HTMLSelectElement).value)"
          class="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600"
        >
          <option value="1">1×</option>
          <option value="2">2×</option>
          <option value="3">3×</option>
        </select>
      </label>
    </div>

    <div class="flex gap-6">
      <label class="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          :checked="props.modelValue.isMobile"
          @change="update('isMobile', ($event.target as HTMLInputElement).checked)"
          class="w-4 h-4 accent-green-600 rounded cursor-pointer"
        />
        <span class="font-medium text-sm text-neutral-700">Mobile</span>
      </label>
      <label class="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          :checked="props.modelValue.hasTouch"
          @change="update('hasTouch', ($event.target as HTMLInputElement).checked)"
          class="w-4 h-4 accent-green-600 rounded cursor-pointer"
        />
        <span class="font-medium text-sm text-neutral-700">Touch</span>
      </label>
    </div>

    <label class="block space-y-1.5">
      <span class="tag">User Agent</span>
      <input
        type="text"
        :value="props.modelValue.userAgent"
        @input="update('userAgent', ($event.target as HTMLInputElement).value)"
        placeholder="Mozilla/5.0 ..."
        class="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600"
      />
    </label>
  </div>
</template>
