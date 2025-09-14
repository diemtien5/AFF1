"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Phone, MessageCircle, Shield } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { supabase } from "@/lib/supabase"
import { useNavbarLinks } from "@/hooks/use-navbar-links"
import { useTrackingActions } from "@/hooks/use-tracking-actions"

import MobileNavigation from "@/components/mobile-navigation"
import Image from "next/image"
import MobileSidebar from "@/components/mobile-sidebar"
import RegisterTooltip from "@/components/register-tooltip"

interface LoanPackage {
  id: string
  name: string
  slug: string
  description: string
  loan_limit: string
  interest_rate: string
  disbursement_speed: string
  logo: string
  image: string
  register_link: string
  detail_link: string
  referral_code?: string
  tooltip_enabled?: boolean
}

interface Consultant {
  id: string
  name: string
  avatar: string
  phone: string
  zalo: string
  facebook: string
  email: string
  credit_cards: string
  loans: string
  ewallets: string
  zalo_link?: string
}

interface NavbarLink {
  id: string
  title: string
  url: string
}

const chartData = [
  { name: "TNEX", value: 18, color: "#3B82F6", approved: 1250 },
  { name: "VIB", value: 15, color: "#10B981", approved: 980 },
  { name: "HDBank", value: 14, color: "#F59E0B", approved: 890 },
  { name: "VPBank", value: 13, color: "#EF4444", approved: 750 },
  { name: "FCredit", value: 12, color: "#8B5CF6", approved: 680 },
  { name: "Lotte", value: 11, color: "#06B6D4", approved: 620 },
  { name: "Muadee", value: 10, color: "#F97316", approved: 580 },
  { name: "CUB", value: 7, color: "#84CC16", approved: 420 },
]

export default function HomePage() {
  const [loanPackages, setLoanPackages] = useState<LoanPackage[]>([])
  const [consultant, setConsultant] = useState<Consultant | null>(null)
  const { navbarLinks, loading: navbarLoading, getNavigationUrls } = useNavbarLinks()
  const { trackImpression, trackClick, trackNavigationClick } = useTrackingActions()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  // Track impressions when loan packages are loaded
  useEffect(() => {
    if (loanPackages.length > 0) {
      loanPackages.forEach(pkg => {
        if (pkg.id) {
          trackImpression(pkg.id, 'homepage')
        }
      })
    }
  }, [loanPackages, trackImpression])

  const fetchData = async () => {
    try {
      // Fetch loan packages
      const { data: packages } = await supabase
        .from("loan_packages")
        .select("*")
        .order("created_at", { ascending: true })

      // Fetch consultant info
      const { data: consultants } = await supabase.from("consultants").select("*").limit(1).single()

      setLoanPackages(packages || [])
      setConsultant(consultants)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Get navigation URLs from the hook
  const navigationUrls = getNavigationUrls()

  if (loading || navbarLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-4">
              {/* Mobile Hamburger Menu */}
              <MobileSidebar consultant={consultant} />

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href={navigationUrls.home}
                  className="text-gray-700 font-medium transition-colors hover:text-blue-600"
                  onClick={() => trackNavigationClick('home')}
                >
                  Trang chủ
                </a>
                <a
                  href={navigationUrls.muadee || "#"}
                  className={`text-gray-700 font-medium transition-colors ${navigationUrls.muadee ? "hover:text-blue-600" : "opacity-50 cursor-not-allowed"}`}
                  onClick={(e) => {
                    if (!navigationUrls.muadee) e.preventDefault()
                    else trackNavigationClick('muadee')
                  }}
                >
                  Thẻ Muadee
                </a>
                <a
                  href={navigationUrls.tnex || "#"}
                  className={`text-gray-700 font-medium transition-colors ${navigationUrls.tnex ? "hover:text-blue-600" : "opacity-50 cursor-not-allowed"}`}
                  onClick={(e) => {
                    if (!navigationUrls.tnex) e.preventDefault()
                    else trackNavigationClick('tnex')
                  }}
                >
                  Vay Tnex
                </a>
                <a
                  href={navigationUrls.fe || "#"}
                  className={`text-gray-700 font-medium transition-colors ${navigationUrls.fe ? "hover:text-blue-600" : "opacity-50 cursor-not-allowed"}`}
                  onClick={(e) => {
                    if (!navigationUrls.fe) e.preventDefault()
                    else trackNavigationClick('fe')
                  }}
                >
                  Vay FE
                </a>
                <a
                  href={navigationUrls.cub || "#"}
                  className={`text-gray-700 font-medium transition-colors ${navigationUrls.cub ? "hover:text-blue-600" : "opacity-50 cursor-not-allowed"}`}
                  onClick={(e) => {
                    if (!navigationUrls.cub) e.preventDefault()
                    else trackNavigationClick('cub')
                  }}
                >
                  Vay CUB
                </a>
                {/* Removed admin login link on desktop per request */}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Introduction Section */}
      <section className="py-4 md:py-8 px-3 md:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              {/* Left Column - Personal Information */}
              <div className="space-y-4 md:space-y-6">
                {/* Personal Avatar and Info */}
                <div className="relative">
                  {/* Avatar - positioned at top left */}
                  <div className="absolute top-0 left-0 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 shadow-lg">
                    {consultant && consultant.avatar ? (
                      <Image
                        src={consultant.avatar}
                        alt="PhucNguyen"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xl md:text-2xl">👤</span>
                      </div>
                    )}
                  </div>

                  {/* Personal Details - with left margin to avoid overlap */}
                  <div className="ml-16 md:ml-20 space-y-2">
                    <h3 className="text-base md:text-lg font-bold text-slate-800">Nguyễn Thành Phúc</h3>
                    <p className="text-sm text-slate-600 font-medium">Tư vấn tài chính</p>
                    <div className="w-20 md:w-24 h-px bg-slate-300"></div>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-3 md:space-y-4">
                  <div className="space-y-2 md:space-y-3 text-sm text-slate-700">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Thẻ tín dụng: <span className="font-medium">HDBank, VPBank, TPBank, VIB</span></span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Thẻ mua trả góp: <span className="font-medium">Muadee, Kredivo</span></span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Vay online: <span className="font-medium">TNEX, CUB, FE, Lotte Finance</span></span>
                    </div>
                  </div>
                </div>

                {/* Contact Information & Action Buttons */}
                <div className="space-y-3 md:space-y-4">
                  <div className="text-center lg:text-left">
                    <p className="text-sm text-slate-600 mb-3 md:mb-4">Liên hệ ngay để được tư vấn:</p>

                    {/* Contact Cards */}
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4">
                      {/* Phone Card */}
                      <div className="group">
                        <Button
                          className="w-full sm:w-44 md:w-48 h-11 md:h-12 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-1"
                          onClick={() => window.open("tel:0888979809", "_self")}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <span className="text-sm">📞</span>
                            </div>
                            <span className="text-sm font-medium">0888.979.809</span>
                          </div>
                        </Button>
                      </div>

                      {/* Zalo Card */}
                      <div className="group">
                        <Button
                          className="w-full sm:w-44 md:w-48 h-11 md:h-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-400 hover:via-indigo-400 hover:to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-1"
                          onClick={() => window.open("https://zalo.me/0888979809", "_blank")}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <span className="text-sm">💬</span>
                            </div>
                            <span className="text-sm font-medium">0888.979.809</span>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 md:mt-4 p-3 bg-blue-50/50 border border-blue-200/30 rounded-lg">
                      <p className="text-xs text-slate-600 text-center">
                        <span className="font-medium">💡</span> Hỗ trợ tư vấn miễn phí 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Important Notice */}
              <div className="space-y-4 md:space-y-6">
                {/* Beautiful Important Notice */}
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/60 rounded-2xl p-4 md:p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-base md:text-lg">💎</span>
                    </div>
                    <h4 className="text-base md:text-lg font-bold text-emerald-800">Lưu ý quan trọng</h4>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-emerald-700 leading-relaxed">
                        Khách hàng lên hồ sơ <strong>không mất bất kỳ khoản phí nào</strong> trước và sau khi giải ngân
                      </p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-emerald-700 leading-relaxed">
                        Hồ sơ có thể gọi tư vấn trực tiếp hoặc online tùy khách hàng
                      </p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-emerald-700 leading-relaxed">
                        Mỗi khi lên hồ sơ khách hàng cần đọc kỹ các thông tin về <strong>lãi suất</strong>, <strong>phí bảo hiểm</strong> và <strong>phí thường niên</strong> (nếu kh mở thẻ tín dụng – thường được miễn phí)
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-emerald-200/50">
                    <div className="flex items-center space-x-2 text-xs text-emerald-600">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span>Thông tin được bảo mật tuyệt đối</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Packages Grid */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {loanPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="group hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-md rounded-2xl w-[320px] flex-shrink-0"
              >
                <CardContent className="p-4 space-y-4">
                  {/* Header với Logo, Tên và Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {pkg.logo ? (
                          <Image
                            src={pkg.logo || "/placeholder.svg"}
                            alt={pkg.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 text-xs">🏦</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-base text-gray-900 truncate">{pkg.name}</h3>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs flex-shrink-0 ml-2">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      4.9/5
                    </Badge>
                  </div>

                  {/* Ảnh đại diện tổ chức */}
                  <div className="flex justify-center">
                    {pkg.image ? (
                      <div className="w-full max-w-[280px] h-32 rounded-xl overflow-hidden bg-gray-50">
                        <Image
                          src={pkg.image || "/placeholder.svg"}
                          alt={pkg.name}
                          width={280}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full max-w-[280px] h-32 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="text-3xl mb-1">📷</div>
                          <div className="text-xs">Ảnh đại diện</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thông tin chi tiết */}
                  <div className="space-y-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">💰</span>
                        <span className="text-sm text-gray-600">Hạn mức vay:</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{pkg.loan_limit}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">📈</span>
                        <span className="text-sm text-gray-600">Lãi suất:</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{pkg.interest_rate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-600">⏱️</span>
                        <span className="text-sm text-gray-600">Giải ngân:</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{pkg.disbursement_speed}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-3 pt-2">
                    <RegisterTooltip
                      referralCode={pkg.referral_code || 'CN09XXXX'}
                      showTooltip={pkg.tooltip_enabled ?? true}
                    >
                      <Button
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white border-0 text-sm rounded-full flex-1 max-w-[130px]"
                        onClick={() => {
                          if (pkg.register_link && pkg.register_link.trim() !== "") {
                            trackClick(pkg.id, 'homepage_register')
                            window.open(pkg.register_link, "_blank", "noopener,noreferrer")
                          } else {
                            // No register link available
                          }
                        }}
                      >
                        🔘 ĐĂNG KÝ
                      </Button>
                    </RegisterTooltip>
                    <Button
                      variant="outline"
                      className="px-4 py-2 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent text-sm rounded-full flex-1 max-w-[130px]"
                      onClick={() => {
                        if (pkg.detail_link && pkg.detail_link.trim() !== "") {
                          trackClick(pkg.id, 'homepage_detail')
                          window.open(pkg.detail_link, "_blank", "noopener,noreferrer")
                        } else {
                          // No detail link available
                        }
                      }}
                    >
                      🔍 CHI TIẾT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Chart */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50/80 to-blue-50/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-slate-800 mb-4 tracking-wide">Thống Kê Tỷ Lệ Duyệt Hồ Sơ</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Dữ liệu thực tế từ hơn 6,000 khách hàng đã được hỗ trợ thành công
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg"></div>
              <div className="relative h-96 p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any, props: any) => [
                        `${value}% (${props.payload.approved} người)`,
                        "Tỷ lệ duyệt",
                      ]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#64748b",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-400/90 to-teal-500/90 p-8 rounded-2xl text-white shadow-lg backdrop-blur-sm">
                  <div className="text-4xl font-light mb-2">6,170</div>
                  <div className="text-emerald-50 font-light text-sm tracking-wide">Hồ sơ được duyệt</div>
                </div>
                <div className="bg-gradient-to-br from-blue-400/90 to-indigo-500/90 p-8 rounded-2xl text-white shadow-lg backdrop-blur-sm">
                  <div className="text-4xl font-light mb-2">87%</div>
                  <div className="text-blue-50 font-light text-sm tracking-wide">Tỷ lệ thành công</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-400/90 to-orange-500/90 p-8 rounded-2xl text-white shadow-lg backdrop-blur-sm">
                <div className="text-3xl font-light mb-2">950 hồ sơ</div>
                <div className="text-amber-50 font-light text-sm tracking-wide leading-relaxed">
                  Chưa đủ điều kiện (được tư vấn cải thiện)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">Tư vấn tài chính</span>
          </div>
          <p className="text-gray-400 mb-4">
            Nơi bạn an tâm tìm kiếm các gói vay và thẻ uy tín từ các tổ chức tài chính thuộc các ngân hàng
          </p>
          <p className="text-sm text-gray-500">© 2024. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavigation />


    </div>
  )
}
