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

  const updateTooltipPosition = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const top = rect.bottom + 8 // show under the button

    // Calculate left position to keep tooltip within viewport
    const tooltipWidth = isMobile ? Math.min(280, window.innerWidth - 32) : 320
    const left = Math.max(
      tooltipWidth / 2, // minimum left position
      Math.min(
        rect.left + rect.width / 2, // center of button
        window.innerWidth - tooltipWidth / 2 // maximum right position
      )
    )

    setTooltipPos({ top, left })
  }

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
      setIsVisible(false)
      // Clear timeout when mouse leaves
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

  // Handle click outside to hide tooltip on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isVisible &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false)
        setTapCount(0)
        if (tapTimeout) {
          clearTimeout(tapTimeout)
          setTapTimeout(null)
        }
      }
    }

    if (isVisible) {
      updateTooltipPosition()
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', updateTooltipPosition, true)
      window.addEventListener('resize', updateTooltipPosition)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      window.removeEventListener('scroll', updateTooltipPosition, true)
      window.removeEventListener('resize', updateTooltipPosition)
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

      {isVisible && showTooltip && createPortal(
        <div
          ref={tooltipRef}
          className={`
            fixed z-[99999] rounded-xl
            transition-all duration-500 ease-out transform
            hover:scale-102 hover:brightness-110 hover:rotate-1
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
            backgroundColor: '#EAF4FF',
            border: '2px solid #90CAF9',
            borderRadius: '12px',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.8),
              0 2px 4px rgba(144, 202, 249, 0.3),
              0 4px 8px rgba(144, 202, 249, 0.2),
              0 8px 16px rgba(144, 202, 249, 0.15),
              0 16px 32px rgba(144, 202, 249, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.9),
              inset 0 -1px 0 rgba(144, 202, 249, 0.2),
              inset 1px 0 0 rgba(255, 255, 255, 0.5),
              inset -1px 0 0 rgba(144, 202, 249, 0.1)
            `,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {/* Arrow pointing to button - 3D seamless design */}
          <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 transition-all duration-300 ease-in-out"
            style={{
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid #90CAF9',
              filter: 'drop-shadow(0 2px 4px rgba(144, 202, 249, 0.4)) drop-shadow(0 4px 8px rgba(144, 202, 249, 0.2))',
            }}
          />
          <div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 transition-all duration-300 ease-in-out"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid #EAF4FF',
              filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.8))',
            }}
          />
          {/* 3D highlight on arrow */}
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 transition-all duration-300 ease-in-out"
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
