import Image from "next/image";

const supportLinks = [
  "Giới thiệu",
  "Liên hệ",
  "Chính sách thanh toán",
  "Chính sách khiếu nại",
  "Chính sách vận chuyển",
  "Chính sách đổi trả và hoàn tiền",
  "Chính sách kiểm hàng",
  "Chính sách bảo mật thông tin",
];

const categoryLinks = [
  "Son Môi",
  "Nước Hoa",
  "Nước Hoa Nam",
  "Nước Hoa Nữ",
  "Trang Điểm Mặt",
  "Trang Điểm Mắt",
  "Chăm Sóc Da",
  "Quà Tặng",
  "Sản Phẩm Khuyến Mãi",
];

const socialLinks = [
  {
    label: "Facebook",
    bg: "bg-[#355AA3]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M13.5 21v-7h2.4l.6-3h-3v-1.6c0-1 .3-1.7 1.7-1.7H16V5.1c-.2 0-.9-.1-1.8-.1-2.7 0-4.5 1.6-4.5 4.7V11H7v3h2.7v7h3.8Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    bg: "bg-[#2E6E99]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm10.8 1.7a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    bg: "bg-[#111111]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M3 5h18v14H3V5Zm2 2v.5L12 13l7-5.5V7H5Zm14 10V9.9l-7 5.4-7-5.4V17h14Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    bg: "bg-[#0B85C8]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M6.8 8.7H3.5V20h3.3V8.7Zm.2-3.5a1.9 1.9 0 1 0-3.8 0 1.9 1.9 0 0 0 3.8 0ZM20.5 13.1c0-3.4-1.8-5-4.3-5-2 0-2.9 1.1-3.4 1.9v-1.6H9.5V20h3.3v-6.3c0-.3 0-.7.1-.9.2-.7.8-1.4 1.8-1.4 1.3 0 1.8 1 1.8 2.5V20h3.3v-6.9Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    bg: "bg-[#D43B24]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2c-1.8-.5-7.6-.5-7.6-.5s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30.7 30.7 0 0 0 2 12a30.7 30.7 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30.7 30.7 0 0 0 22 12a30.7 30.7 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
      </svg>
    ),
  },
];

const certificationImages = [
  {
    alt: "Đã thông báo Bộ Công Thương",
    src: "/images/footer/bo-cong-thuong.png",
    width: 210,
    height: 58,
  },
  {
    alt: "DMCA Protected",
    src: "/images/footer/dmca-badge.png",
    width: 122,
    height: 58,
  },
];

const paymentImages = [
  {
    alt: "Visa",
    src: "/images/footer/payment-visa.svg",
    width: 76,
    height: 34,
  },
  {
    alt: "MasterCard",
    src: "/images/footer/payment-mastercard.svg",
    width: 76,
    height: 34,
  },
  {
    alt: "Cash On Delivery",
    src: "/images/footer/payment-cod.svg",
    width: 76,
    height: 34,
  },
  {
    alt: "Bank Transfer",
    src: "/images/footer/payment-bank.svg",
    width: 76,
    height: 34,
  },
  {
    alt: "ATM",
    src: "/images/footer/payment-atm.svg",
    width: 60,
    height: 34,
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-6">
      <div className="bg-[#f78ba8]">
        <div className="mx-auto grid max-w-[1480px] gap-7 px-5 py-8 text-[#111111] md:grid-cols-2 xl:grid-cols-4 xl:gap-9 xl:px-10 xl:py-9">
          <div>
            <h3 className="text-[1.12rem] font-bold uppercase text-[#193345] md:text-[1.28rem]">
              KYO AUTHENTIC
            </h3>

            <div className="mt-4 space-y-3 text-[0.86rem] leading-7">
              <p>Mỹ phẩm &amp; Quà tặng cao cấp chính hãng</p>
              <p>Thương hiệu trực thuộc Công ty TNHH KYO PACIFIC</p>
              <p>
                <strong>MST</strong> 0110522922
              </p>
              <p>Cấp bởi sở Kế hoạch và Đầu tư TP Hà Nội - 27/10/2023</p>
              <p>
                <strong>Địa chỉ:</strong> Số 24 ngõ 165 Phố Dương Quảng Hàm, P.Quan
                Hoa, Q. Cầu Giấy, Tp. Hà Nội
              </p>
              <p>
                <strong>E-mail:</strong> kyoauthentic@gmail.com
              </p>
              <p>
                <strong>Hotline:</strong> 0975.436.989 (zalo, imes)
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-[1.12rem] font-bold uppercase text-[#193345] md:text-[1.28rem]">
              THÔNG TIN HỖ TRỢ
            </h3>

            <div className="mt-4 space-y-2.5 text-[0.86rem] leading-7">
              {supportLinks.map((item) => (
                <a key={item} href="#" className="block hover:underline">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[1.12rem] font-bold uppercase text-[#193345] md:text-[1.28rem]">
              DANH MỤC CHÍNH
            </h3>

            <div className="mt-4 space-y-2.5 text-[0.86rem] leading-7">
              {categoryLinks.map((item) => (
                <a key={item} href="#" className="block hover:underline">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[1.12rem] font-bold uppercase text-[#193345] md:text-[1.28rem]">
              THEO DÕI CHÚNG TÔI
            </h3>

            <p className="mt-4 max-w-[340px] text-[0.86rem] leading-7">
              Đăng ký email để không bỏ lỡ các chương trình khuyến mãi và những
              thông tin mới nhất
            </p>

            <div className="mt-4 flex max-w-[360px] overflow-hidden rounded-full border border-[#f0a35e] bg-white">
              <input
                type="email"
                placeholder="Email"
                className="h-11 flex-1 bg-transparent px-4 text-[0.9rem] text-[#666666] outline-none"
              />
              <button
                type="button"
                className="min-w-[82px] rounded-full bg-[#ef3f7f] px-5 text-[0.9rem] font-bold text-white"
              >
                GỬI
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  aria-label={item.label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${item.bg}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {certificationImages.map((item) => (
                <Image
                  key={item.alt}
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="h-auto w-auto max-w-full object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#2f2f2f]">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-5 py-4 text-[#a5a5a5] md:flex-row md:items-center md:justify-between xl:px-10">
          <p className="text-[0.8rem] font-semibold">
            © 2015 - 2026 Công ty TNHH KYO PACIFIC. All Rights Reserved
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {paymentImages.map((item) => (
              <Image
                key={item.alt}
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-auto w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
