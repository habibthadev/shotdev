import type { ReactNode } from 'react'

type BrowserChromeProps = {
  url: string
  isDark: boolean
  screenshotSrc?: string
  optimisticContent?: ReactNode
  width: number
  height: number
}

export function SafariChrome({ url, isDark, screenshotSrc, optimisticContent, width, height }: BrowserChromeProps) {
  const toolbarBg = isDark ? 'bg-[#2d2d2d]' : 'bg-[#f6f6f6]'
  const textColor = isDark ? 'text-white/80' : 'text-black/70'
  const addressBarBg = isDark ? 'bg-white/10' : 'bg-black/[0.04]'

  return (
    <div className="window-chrome" style={{ width: `${width}px` }}>
      <div className={`${toolbarBg} border-b ${isDark ? 'border-white/10' : 'border-black/[0.06]'}`}>
        <div className="flex items-center gap-2 px-3.5 py-2.5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA42]" />
          </div>
          
          <div className="flex-1 flex justify-center px-8">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-md ${addressBarBg} min-w-[280px] max-w-[480px]`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path 
                  d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" 
                  stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'} 
                  strokeWidth="1"
                />
              </svg>
              <span className={`text-[12px] ${textColor} truncate`}>{url}</span>
            </div>
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
