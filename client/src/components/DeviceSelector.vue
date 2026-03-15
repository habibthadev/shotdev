<script setup lang="ts">
import { computed } from 'vue'
import { PhDeviceTablet, PhDeviceMobile, PhMonitor, PhLaptop, PhSliders } from '@phosphor-icons/vue'
import { cn } from '@/lib/utils'
import type { Preset } from '@/lib/api'

const props = defineProps<{ modelValue: Preset }>()
const emit = defineEmits<{ 'update:modelValue': [value: Preset] }>()

type DeviceOption = { key: Preset; label: string; sub: string; icon: unknown }

const OPTIONS: DeviceOption[] = [
  { key: 'desktop',          label: 'Desktop',  sub: '1440×900',   icon: PhMonitor },
  { key: 'laptop',           label: 'Laptop',   sub: '1280×800',   icon: PhLaptop },
  { key: 'tablet',           label: 'Tablet',   sub: '768×1024',   icon: PhDeviceTablet },
  { key: 'mobile-portrait',  label: 'Mobile',   sub: '390×844',    icon: PhDeviceMobile },
  { key: 'mobile-landscape', label: 'Landscape',sub: '844×390',    icon: PhDeviceMobile },
  { key: 'custom',           label: 'Custom',   sub: 'Manual',     icon: PhSliders },
]

const select = (key: Preset) => emit('update:modelValue', key)

const isActive = (key: Preset) => computed(() => props.modelValue === key)
</script>

<template>
  <div>
    <label class="tag mb-3 block">Device Preset</label>
    <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
      <button
        v-for="opt in OPTIONS"
        :key="opt.key"
        type="button"
        @click="select(opt.key)"
        :class="cn(
          'flex flex-col items-center gap-2 rounded-lg border px-3 py-3 text-center transition-all duration-150',
          'hover:border-neutral-300',
          props.modelValue === opt.key
            ? 'border-green-600 bg-green-50 glow-green'
            : 'border-neutral-200 bg-white'
        )"
      >
        <component
          :is="opt.icon"
          :size="18"
          weight="bold"
          :class="props.modelValue === opt.key ? 'text-green-600' : 'text-neutral-400'"
        />
        <div>
          <span class="font-semibold text-xs leading-tight block"
            :class="props.modelValue === opt.key ? 'text-green-700' : 'text-neutral-900'">
            {{ opt.label }}
          </span>
          <span class="font-mono text-[10px] leading-tight text-neutral-500">
            {{ opt.sub }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>
