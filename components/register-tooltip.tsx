"use client"

import { useState, useEffect, useRef } from "react"
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
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false)
        setTapCount(0)
        if (tapTimeout) {
          clearTimeout(tapTimeout)
          setTapTimeout(null)
        }
      }
    }

    if (isMobile && isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
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

      {isVisible && showTooltip && (
        <>
          {/* Overlay background for mobile */}
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99998]"
              onClick={() => {
                setIsVisible(false)
                setTapCount(0)
                if (tapTimeout) {
                  clearTimeout(tapTimeout)
                  setTapTimeout(null)
                }
              }}
            />
          )}

          {/* Tooltip content */}
          <div
            ref={tooltipRef}
            className={`
              fixed z-[99999] bg-white border-2 border-blue-300 rounded-2xl shadow-2xl
              transition-all duration-300 ease-in-out
              ${isMobile
                ? 'w-[85vw] max-w-[320px] left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 p-5'
                : 'w-[320px] max-w-[80vw] -translate-x-1/2 left-1/2 -top-2 p-4'
              }
              ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
            style={{
              maxWidth: isMobile ? '85vw' : '80vw',
              transform: isMobile
                ? 'translateX(-50%) translateY(-50%)'
                : 'translateX(-50%) translateY(-100%)',
              boxShadow: isMobile
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
          <div className="space-y-4">
            {/* Header with icon */}
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex-shrink-0 shadow-sm"></div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                ⚠️ Lưu ý quan trọng
              </h3>
            </div>

            {/* Description */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
              <p className="text-sm text-amber-800 leading-relaxed font-medium">
                Quý khách vui lòng nhập đúng mã nhân viên vào mục "Mã giấy thiệu" để được hỗ trợ tốt về thẩm định và tăng phê duyệt.
              </p>
            </div>

            {/* Code section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 space-y-3 border border-blue-200">
              <div className="text-center">
                <span className="text-sm text-blue-700 font-semibold">Mã giấy thiệu của bạn:</span>
              </div>

              <div className="bg-white rounded-lg p-3 border-2 border-blue-200 shadow-sm">
                <code className="text-lg font-black text-blue-900 font-mono tracking-wider text-center block">
                  {referralCode}
                </code>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full h-10 text-sm font-semibold border-2 border-blue-400 text-blue-700 hover:bg-blue-100 hover:border-blue-500 transition-all duration-200"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Đã sao chép thành công!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    📋 Sao chép mã
                  </>
                )}
              </Button>
            </div>

            {/* Instruction */}
            <div className="text-center bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs text-green-700 font-medium">
                💡 Vui lòng sao chép mã giới thiệu và dán vào ô 'Mã giới thiệu' khi đăng ký.
              </p>
            </div>

            {/* Mobile action hint */}
            {isMobile && tapCount === 1 && (
              <div className="text-center bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3 border-2 border-orange-300">
                <p className="text-sm text-orange-700 font-bold">
                  👆 Chạm lần nữa để đăng ký ngay
                </p>
              </div>
            )}
          </div>
          </div>
        </>
      )}
    </div>
  )
}
