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

        // Reset tap count after 5 seconds
        const timeout = setTimeout(() => {
          setTapCount(0)
          setIsVisible(false)
        }, 5000)
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
    } else if (!isMobile && onRegisterClick) {
      // Desktop: direct redirect
      onRegisterClick()
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
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4
            transition-all duration-300 ease-in-out
            ${isMobile
              ? 'w-full max-w-[calc(100vw-2rem)] left-1/2 transform -translate-x-1/2 top-full mt-2'
              : 'w-80 -translate-x-1/2 left-1/2 -top-2'
            }
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          style={{
            maxWidth: isMobile ? 'calc(100vw - 2rem)' : '80vw',
            transform: isMobile
              ? 'translateX(-50%)'
              : 'translateX(-50%) translateY(-100%)',
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-gray-800">
                Lưu ý trong quá trình đăng ký
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Để được hưởng ưu đãi tốt nhất, vui lòng nhập đúng mã giới thiệu khi đăng ký.
            </p>

            {/* Referral code section */}
            <div className="bg-blue-50/50 border border-blue-200/40 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 font-medium">Mã giới thiệu:</span>
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

              <div className="bg-white border border-blue-200/60 rounded-md p-2">
                <code className="text-sm font-bold text-blue-800 font-mono">
                  {referralCode}
                </code>
              </div>
            </div>

            <p className="text-xs text-blue-600 text-center italic">
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
        </div>
      )}
    </div>
  )
}
