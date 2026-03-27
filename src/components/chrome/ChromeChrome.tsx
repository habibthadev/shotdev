import type { ReactNode } from 'react'

type BrowserChromeProps = {
  url: string
  isDark: boolean
  screenshotSrc?: string
  optimisticContent?: ReactNode
  width: number
  height: number
}

export function ChromeChrome({ url, isDark, screenshotSrc, optimisticContent, width, height }: BrowserChromeProps) {
  const toolbarBg = isDark ? 'bg-[#2d2d2d]' : 'bg-[#dee1e6]'
  const textColor = isDark ? 'text-white/80' : 'text-black/70'

  return (
    <div className="window-chrome" style={{ width: `${width}px` }}>
      <div className={toolbarBg}>
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-black/[0.06]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA42]" />
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2">
          <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path 
                d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" 
                stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'} 
                strokeWidth="1"
              />
            </svg>
            <span className={`text-[12px] ${textColor} truncate flex-1`}>{url}</span>
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
