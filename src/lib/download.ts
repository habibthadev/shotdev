import type { ScreenshotResult } from '@/store/screenshot.store'

const MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType })
}

export function downloadImage(result: ScreenshotResult, format: string): void {
  const mimeType = MIME_TYPES[format] || MIME_TYPES.png
  const blob = base64ToBlob(result.image, mimeType)
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `screenshot-${Date.now()}.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(result: ScreenshotResult): Promise<void> {
  const blob = base64ToBlob(result.image, MIME_TYPES.png)
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ])
}
