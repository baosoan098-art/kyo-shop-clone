import Link from 'next/link'

const featureItems = [
  {
    icon: 'f',
    title: 'Facebook',
    text: 'fb.com/kyoauthentic',
  },
  {
    icon: 'Q',
    title: 'Đảm bảo chất lượng',
    text: '100% chính hãng',
  },
  {
    icon: 'S',
    title: 'Free ship',
    text: 'đơn hàng từ 800k',
  },
  {
    icon: 'H',
    title: 'Hotline: 0975 436 989',
    text: 'tư vấn miễn phí 24/7',
  },
]

const footerNavItems = [
  { href: '/', label: 'Trang chủ' },
  { href: '/qua-tang', label: 'Quà tặng' },
  { href: '/shop', label: 'Son môi' },
  { href: '/shop', label: 'Nước hoa' },
  { href: '/shop', label: 'Chống nắng' },
  { href: '/shop', label: 'Trang điểm mặt' },
  { href: '/shop', label: 'Chăm sóc da' },
  { href: '/shop', label: 'Chăm sóc tóc' },
  { href: '/shop', label: 'Khuyến mãi' },
  { href: '/shop', label: 'Shop all' },
  { href: '/blog', label: 'Tin tức' },
]

export default function SiteFooter() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid #f6c4d4',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          background: '#f58cab',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <p style={{ margin: 0 }}>
            KYO Authentic - Mỹ phẩm & Quà tặng cao cấp chính hãng
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <span>kyoauthentic@gmail.com</span>
            <span>024.66.737.999</span>
            <span>Facebook</span>
            <span>Instagram</span>
            <span>YouTube</span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#fff8fb',
          borderBottom: '1px solid #f4d6e0',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: '#ef4f93',
              minWidth: '220px',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '62px',
                height: '62px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'linear-gradient(135deg, rgba(244,114,182,1) 0%, rgba(236,72,153,1) 100%)',
                color: '#ffffff',
                fontSize: '30px',
                fontWeight: 800,
              }}
            >
              K
            </span>
            <div>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                KYO.VN
              </div>
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '13px',
                  color: '#9f1239',
                  fontWeight: 600,
                }}
              >
                Mỹ phẩm & quà tặng chính hãng
              </div>
            </div>
          </Link>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '18px',
              flex: 1,
              minWidth: '280px',
            }}
          >
            {featureItems.map((item) => (
              <div
                key={item.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffe0ea',
                    color: '#ef4f93',
                    fontSize: '24px',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#111827',
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '14px',
                      color: '#374151',
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Link
              href="/shop"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ef4f93',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 800,
              }}
            >
              T
            </Link>
            <Link
              href="/cart"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ef4f93',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 800,
              }}
            >
              G
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid #ffffff',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '16px 20px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px 14px',
            flexWrap: 'wrap',
          }}
        >
          {footerNavItems.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              style={{
                textDecoration: 'none',
                color: item.label === 'Trang chủ' ? '#ef4f93' : '#374151',
                textTransform: 'uppercase',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
