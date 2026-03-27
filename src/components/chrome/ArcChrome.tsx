import type { ReactNode } from 'react'

type BrowserChromeProps = {
  url: string
  isDark: boolean
  screenshotSrc?: string
  optimisticContent?: ReactNode
  width: number
  height: number
}

export function ArcChrome({ url, isDark, screenshotSrc, optimisticContent, width, height }: BrowserChromeProps) {
  const sidebarBg = isDark ? 'bg-[#1e1e1e]' : 'bg-[#f5f5f5]'
  const textColor = isDark ? 'text-white/80' : 'text-black/70'

  return (
    <div className="window-chrome flex" style={{ width: `${width}px` }}>
      <div className={`${sidebarBg} w-16 flex flex-col items-center py-3 gap-3 border-r ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
        <div className="flex flex-col gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA42]" />
        </div>
        <div className="flex-1" />
        <div className={`w-7 h-7 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/[0.06]'}`} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className={`px-4 py-2 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} border-b ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
          <div className={`text-[12px] ${textColor} truncate`}>{url}</div>
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
    </div>
  )
}
