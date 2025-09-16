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
    const left = rect.left + rect.width / 2
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
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile && showTooltip) {
      setIsVisible(false)
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

        // Reset tap count after 8 seconds (increased for better UX)
        const timeout = setTimeout(() => {
          setTapCount(0)
          setIsVisible(false)
        }, 8000)
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
            fixed z-[99999] bg-white border border-gray-200 rounded-xl shadow-lg
            transition-all duration-200 ease-in-out
            ${isMobile
              ? 'w-[92vw] max-w-[320px] p-3'
              : 'w-[320px] max-w-[80vw] p-4'
            }
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: 'translateX(-50%)',
            maxWidth: isMobile ? '92vw' : '80vw',
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-gray-800">
                Lưu ý trong quá trình đăng ký
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed whitespace-normal break-words">
              Quý khách vui lòng nhập đúng mã nhân viên vào mục “Mã giấy thiệu” , để được hỗ trợ tốt về thẩm định và tăng phê duyệt.
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-blue-700">Mã giấy thiệu:</span>
              <code className="text-sm font-bold text-blue-800 font-mono whitespace-pre-wrap break-words">
                {referralCode}
              </code>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Sao chép
                  </>
                )}
              </Button>
            </div>

            <p className="text-[11px] text-blue-600 whitespace-normal break-words">
              Vui lòng sao chép mã giới thiệu và dán vào ô 'Mã giới thiệu' khi đăng ký.
            </p>

            {isMobile && tapCount === 1 && (
              <div className="text-center">
                <p className="text-xs text-orange-600 font-medium">
                  Chạm lần nữa để đăng ký
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
