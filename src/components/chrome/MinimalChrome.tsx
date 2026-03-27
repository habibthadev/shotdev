import type { ReactNode } from 'react'

type BrowserChromeProps = {
  url: string
  isDark: boolean
  screenshotSrc?: string
  optimisticContent?: ReactNode
  width: number
  height: number
}

export function MinimalChrome({ url, isDark, screenshotSrc, optimisticContent, width, height }: BrowserChromeProps) {
  const toolbarBg = isDark ? 'bg-[#2d2d2d]' : 'bg-[#f6f6f6]'

  return (
    <div className="window-chrome" style={{ width: `${width}px` }}>
      <div className={toolbarBg}>
        <div className="flex items-center gap-2 px-3.5 py-2.5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA42]" />
          </div>
        </div>
      </div>

      <div className={isDark ? 'bg-[#1e1e1e]' : 'bg-white'} style={{ height: `${height}px` }}>
        {optimisticContent ? (
          optimisticContent
        ) : screenshotSrc ? (
          <img src={screenshotSrc} className="w-full h-full object-cover object-top" />
        ) : (
          <div className={`w-full h-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#fafafa]'}`} />
        )}
      </div>
    </div>
  )
}
