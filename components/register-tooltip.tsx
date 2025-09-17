"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

interface RegisterTooltipProps {
  referralCode: string
  showTooltip?: boolean
  children: React.ReactNode
  onRegisterClick?: () => void
}

export default function RegisterTooltip({
  referralCode,
  showTooltip = true,
  children,
  onRegisterClick
}: RegisterTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeAllTooltipsEvent = 'close-tooltips'

  const updateTooltipPosition = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const preferredBelowTop = rect.bottom + 8
    const preferredAboveTop = rect.top - 8

    // Provisional width until we can measure real tooltip
    const provisionalWidth = isMobile ? Math.min(280, window.innerWidth - 32) : 320
    const left = Math.max(
      provisionalWidth / 2,
      Math.min(rect.left + rect.width / 2, window.innerWidth - provisionalWidth / 2)
    )

    // Set provisional top (below), will refine after measuring
    setTooltipPos({ top: preferredBelowTop, left })
  }

  useEffect(() => {
    // Ensure portal only renders on client
    setIsMounted(true)
  }, [])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      toast({
        title: "Đã sao chép",
        description: "Mã giới thiệu đã được sao chép vào clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        title: "Lỗi",
        description: "Không thể sao chép mã giới thiệu",
        variant: "destructive",
      })
    }
  }

  const handleMouseEnter = () => {
    if (!isMobile && showTooltip) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      // ensure only one tooltip visible globally
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(closeAllTooltipsEvent))
      }
      updateTooltipPosition()
      setIsVisible(true)

      // Auto hide after 6 seconds on desktop too
      const timeout = setTimeout(() => {
        setIsVisible(false)
      }, 6000)
      setTapTimeout(timeout)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile && showTooltip) {
      // Delay hide slightly to avoid flicker
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 150)
      if (tapTimeout) {
        clearTimeout(tapTimeout)
        setTapTimeout(null)
      }
    }
  }

  const handleClick = () => {
    if (isMobile && showTooltip) {
      // Mobile interaction logic
      if (tapCount === 0) {
        // First tap: show tooltip
        updateTooltipPosition()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event(closeAllTooltipsEvent))
        }
        setIsVisible(true)
        setTapCount(1)

        // Reset tap count after 6 seconds
        const timeout = setTimeout(() => {
          setTapCount(0)
          setIsVisible(false)
        }, 6000)
        setTapTimeout(timeout)
      } else if (tapCount === 1) {
        // Second tap: redirect
        clearTimeout(tapTimeout!)
        setTapCount(0)
        setIsVisible(false)
        if (onRegisterClick) {
          onRegisterClick()
        }
      }
    } else if (!isMobile) {
      // Desktop: direct redirect (tooltip is handled by hover)
      if (onRegisterClick) {
        onRegisterClick()
      }
    }
  }

  // Handle click outside to hide tooltip on mobile/desktop and keep position updated
  useEffect(() => {
    const handleCloseAll = () => {
      setIsVisible(false)
      setTapCount(0)
      if (tapTimeout) {
        clearTimeout(tapTimeout)
        setTapTimeout(null)
      }
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        handleCloseAll()
      }
    }

    if (isVisible) {
      updateTooltipPosition()
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', updateTooltipPosition, true)
      window.addEventListener('resize', updateTooltipPosition)
      // After render, re-measure actual tooltip width and clamp again
      requestAnimationFrame(() => {
        if (tooltipRef.current) {
          const actualWidth = tooltipRef.current.offsetWidth || (isMobile ? Math.min(280, window.innerWidth - 32) : 320)
          const actualHeight = tooltipRef.current.offsetHeight || 0
          const rect = containerRef.current?.getBoundingClientRect()
          if (rect) {
            const left = Math.max(
              actualWidth / 2,
              Math.min(rect.left + rect.width / 2, window.innerWidth - actualWidth / 2)
            )
            // Decide above/below based on available space
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top
            const showBelow = spaceBelow >= actualHeight + 12 || spaceBelow >= spaceAbove
            const top = showBelow ? rect.bottom + 8 : rect.top - actualHeight - 8
            setTooltipPos({ top, left })
          }
        }
      })
    }
    window.addEventListener(closeAllTooltipsEvent, handleCloseAll as EventListener)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', updateTooltipPosition, true)
      window.removeEventListener('resize', updateTooltipPosition)
      window.removeEventListener(closeAllTooltipsEvent, handleCloseAll as EventListener)
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
    }
  }, [isMobile, isVisible, tapTimeout])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tapTimeout) {
        clearTimeout(tapTimeout)
      }
    }
  }, [tapTimeout])

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={handleClick}>
        {children}
      </div>

      {isMounted && isVisible && showTooltip && createPortal(
        <div
          ref={tooltipRef}
          className={`
            fixed z-[99999] rounded-xl
            transition-all duration-300 ease-out transform
            ${isMobile
              ? 'p-2'
              : 'w-[320px] max-w-[80vw] p-4'
            }
            ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}
          `}
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: 'translateX(-50%)',
            width: 'fit-content',
            minWidth: isMobile ? Math.min(280, window.innerWidth - 32) : 320,
            maxWidth: isMobile ? Math.min(280, window.innerWidth - 32) : '80vw',
            background: `
              linear-gradient(135deg, #EAF4FF 0%, #F0F8FF 50%, #E6F3FF 100%),
              linear-gradient(45deg, transparent 0%, rgba(144, 202, 249, 0.1) 50%, transparent 100%)
            `,
            backgroundBlendMode: 'overlay',
            border: 'none',
            borderRadius: '16px',
            position: 'relative',
            boxShadow: `
              0 0 0 1px rgba(144, 202, 249, 0.4),
              0 0 0 2px rgba(255, 255, 255, 0.8),
              0 4px 12px rgba(144, 202, 249, 0.15),
              0 8px 24px rgba(144, 202, 249, 0.1),
              0 16px 48px rgba(144, 202, 249, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.9),
              inset 0 -1px 0 rgba(144, 202, 249, 0.1),
              inset 1px 0 0 rgba(255, 255, 255, 0.6),
              inset -1px 0 0 rgba(144, 202, 249, 0.05)
            `,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            pointerEvents: 'auto'
          }}
        >
          {/* Arrow pointing to button - Unified seamless design */}
          <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 transition-all duration-300 ease-in-out"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderBottom: '12px solid rgba(144, 202, 249, 0.4)',
              filter: 'drop-shadow(0 2px 4px rgba(144, 202, 249, 0.2))',
            }}
          />
          <div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 transition-all duration-300 ease-in-out"
            style={{
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid rgba(255, 255, 255, 0.8)',
              filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.9))',
            }}
          />
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 transition-all duration-300 ease-in-out"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid #EAF4FF',
              background: 'linear-gradient(135deg, #EAF4FF 0%, #F0F8FF 50%, #E6F3FF 100%)',
            }}
          />
          {/* Inner highlight */}
          <div
            className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0 transition-all duration-300 ease-in-out"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid rgba(255, 255, 255, 0.6)',
            }}
          />

          <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#1976D2] rounded-full animate-pulse"></div>
              <h3 className={`${isMobile ? 'text-xs font-semibold' : 'text-sm font-semibold'} text-[#333]`}>
                Lưu ý trong quá trình đăng ký
              </h3>
            </div>

            <p className={`${isMobile ? 'text-[10px] leading-tight' : 'text-xs leading-relaxed'} text-[#333] whitespace-normal break-words`}>
              Vui lòng nhập đúng "Mã giấy thiệu", để được hỗ trợ phê duyệt nhanh và nhận ưu đãi
            </p>

            <div className={`flex items-center gap-1 ${isMobile ? 'flex-wrap' : 'flex-wrap'}`}>
              <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-[#333]`}>Mã giấy thiệu:</span>
              <code
                className={`${isMobile ? 'text-xs font-bold' : 'text-sm font-bold'} font-mono whitespace-pre-wrap break-words px-3 py-2 rounded-lg text-white shadow-lg transition-all duration-200 hover:scale-105`}
                style={{
                  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                  color: 'white',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  boxShadow: `
                    0 2px 4px rgba(25, 118, 210, 0.3),
                    0 4px 8px rgba(25, 118, 210, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                  `,
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {referralCode}
              </code>
              <Button
                size="sm"
                variant="outline"
                className={`${isMobile ? 'h-5 px-1 text-[10px]' : 'h-6 px-2 text-xs'} border-[#1976D2] text-[#1976D2] hover:bg-[#1976D2] hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                onClick={handleCopyCode}
                style={{
                  boxShadow: '0 1px 3px rgba(25, 118, 210, 0.2)',
                  border: '1px solid #1976D2'
                }}
              >
                {copied ? (
                  <>
                    <Check className={`${isMobile ? 'w-2 h-2 mr-1' : 'w-3 h-3 mr-1'}`} />
                    {isMobile ? 'Đã sao' : 'Đã sao chép'}
                  </>
                ) : (
                  <>
                    <Copy className={`${isMobile ? 'w-2 h-2 mr-1' : 'w-3 h-3 mr-1'}`} />
                    Sao chép
                  </>
                )}
              </Button>
            </div>

            <p className={`${isMobile ? 'text-[9px]' : 'text-[11px]'} text-[#1976D2] whitespace-normal break-words`}>
              Vui lòng sao chép mã giới thiệu và dán vào ô 'Mã giới thiệu' khi đăng ký.
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
