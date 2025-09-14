"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface RegisterTooltipProps {
  referralCode: string
  showTooltip?: boolean
  children: React.ReactNode
}

export default function RegisterTooltip({ referralCode, showTooltip = true, children }: RegisterTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

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

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => showTooltip && setIsVisible(true)}
      onMouseLeave={() => showTooltip && setIsVisible(false)}
    >
      {children}

      {isVisible && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-white/95 backdrop-blur-sm border border-blue-200/60 rounded-xl shadow-2xl p-4 w-80 animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/95"></div>

            {/* Content */}
            <div className="space-y-3">
              {/* Title */}
              <h4 className="text-sm font-bold text-blue-800 text-center">
                Lưu ý trong quá trình đăng ký
              </h4>

              {/* Main content */}
              <div className="space-y-2 text-xs text-blue-700 leading-relaxed">
                <p>
                  Quý khách vui lòng nhập đúng mã nhân viên vào mục "Mã giới thiệu", để được hỗ trợ tốt về thẩm định và tăng phê duyệt.
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
