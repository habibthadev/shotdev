import { ref, computed } from 'vue'
import { captureScreenshot, type ScreenshotRequest, type ScreenshotSuccess } from '@/lib/api'

export type CaptureState = 'idle' | 'loading' | 'success' | 'error'

export const useScreenshot = () => {
  const state = ref<CaptureState>('idle')
  const result = ref<ScreenshotSuccess | null>(null)
  const errorMessage = ref<string | null>(null)
  const lastUrl = ref<string | null>(null)

  // Revoke previous object URL to avoid memory leaks
  const revokeResult = () => {
    if (result.value?.objectUrl) {
      URL.revokeObjectURL(result.value.objectUrl)
    }
  }

  const capture = async (req: ScreenshotRequest) => {
    revokeResult()
    state.value = 'loading'
    errorMessage.value = null
    result.value = null
    lastUrl.value = req.url

    const res = await captureScreenshot(req)

    if (res.ok) {
      result.value = res
      state.value = 'success'
    } else {
      errorMessage.value = res.message
      state.value = 'error'
    }
  }

  const reset = () => {
    revokeResult()
    state.value = 'idle'
    result.value = null
    errorMessage.value = null
    lastUrl.value = null
  }

  const downloadImage = () => {
    if (!result.value) return
    const a = document.createElement('a')
    a.href = result.value.objectUrl
    const ext = result.value.blob.type === 'image/jpeg' ? 'jpg' : 'png'
    const domain = lastUrl.value ? new URL(lastUrl.value).hostname : 'screenshot'
    a.download = `${domain}-${result.value.preset}-${Date.now()}.${ext}`
    a.click()
  }

  return {
    state: computed(() => state.value),
    result: computed(() => result.value),
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => state.value === 'loading'),
    hasResult: computed(() => state.value === 'success'),
    capture,
    reset,
    downloadImage,
  }
}
