import { createFileRoute } from "@tanstack/react-router";
import {
  Banknote,
  BarChart3,
  Bell,
  Bike,
  Building2,
  CalendarDays,
  Car,
  ChevronRight,
  CreditCard,
  Gift,
  Heart,
  Lightbulb,
  Plane,
  QrCode,
  ReceiptText,
  Search,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserPlus,
  UsersRound,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Paytm-inspired Payments Home" },
      {
        name: "description",
        content: "A mobile-first payments and services home screen prototype.",
      },
      { property: "og:title", content: "Paytm-inspired Payments Home" },
      {
        property: "og:description",
        content: "A mobile-first payments and services home screen prototype.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="paytm-screen">
      <div className="status-bar" aria-hidden="true">
        <span>17:39 ◉ ▣ ◌</span>
        <span>◉ 5G ▮▮ 36</span>
      </div>

      <header className="topbar">
        <div className="identity">
          <div className="avatar">S</div>
          <div className="festival-mark">
            <span>GOLDEN</span>
            <span>DIWALI</span>
          </div>
        </div>
        <Bell className="bell-icon" aria-hidden="true" />
      </header>

      <div className="search-field" aria-label="Search for contacts to pay">
        <Search aria-hidden="true" />
        <span>Search for contacts to pay</span>
      </div>

      <section className="quick-actions" aria-label="Quick payments">
        <QuickAction icon={<QrCode />} label={<>Scan any<br />QR</>} />
        <QuickAction icon={<UserPlus />} label={<>Pay<br />Anyone</>} />
        <QuickAction icon={<Building2 />} label={<>To Bank &amp;<br />Self A/c</>} />
        <QuickAction icon={<ReceiptText />} label={<>Balance &amp;<br />History</>} />
      </section>

      <section className="service-panel">
        <SectionHeading title="Recharge & Bills" />
        <div className="service-grid recharge-grid">
          <ServiceItem icon={<Smartphone />} label={<>Mobile<br />Recharge</>} />
          <ServiceItem icon={<CreditCard />} label={<>Credit Card<br />Bill</>} badge="Get ₹50" />
          <ServiceItem icon={<Lightbulb />} label={<>Electricity<br />Bill</>} />
          <ServiceItem icon={<Car />} label={<>FASTag<br />Recharge</>} />
          <ServiceItem icon={<CalendarDays />} label={<>Loan EMI<br />Payment</>} />
        </div>
        <div className="pager-dots" aria-hidden="true"><span /><i /></div>
      </section>

      <div className="exclusive-strip">
        <Gift aria-hidden="true" />
        <div>
          <strong>Exclusive offer for You!</strong>
          <span>Claim your exclusive reward</span>
        </div>
        <ChevronRight aria-hidden="true" />
      </div>

      <section className="offer-grid" aria-label="Offers">
        <article className="postpaid-offer">
          <CalendarDays aria-hidden="true" />
          <div>
            <strong>Postpaid Offer</strong>
            <span>Pay &amp; Earn 11,000 Gold Coins — Activate Now</span>
          </div>
        </article>
        <article className="mini-offer"><Plane aria-hidden="true" /><strong>Get Gold* on Flights</strong></article>
        <article className="mini-offer"><UsersRound aria-hidden="true" /><strong>Refer &amp; Win ₹450</strong></article>
      </section>

      <div className="topic-strip" aria-label="Featured offers">
        <TopicChip icon={<Sparkles />} label="Golden Diwali" />
        <TopicChip icon={<Gift />} label="Refer & Win ₹450" />
        <TopicChip icon={<Banknote />} label="Cashback & Offers" />
      </div>

      <section className="festival-banner">
        <div className="banner-brand">
          <span className="paytm-wordmark">paytm</span>
          <strong>GOLDEN<br />DIWALI</strong>
        </div>
        <div className="banner-copy">
          <span>Pay using Paytm</span>
          <strong>Win Gold Every Hour</strong>
          <span className="banner-cta">Pay Now <ChevronRight aria-hidden="true" /></span>
        </div>
      </section>

      <section className="service-panel finance-panel">
        <SectionHeading title="Financial Services" />
        <div className="service-grid finance-grid">
          <ServiceItem icon={<Banknote />} label="Loan" />
          <ServiceItem icon={<BarChart3 />} label="Mutual Fund" badge="SIP @ ₹21" />
          <ServiceItem icon={<Car />} label="Car Insurance" />
          <ServiceItem icon={<Bike />} label="Bike Insurance" />
          <ServiceItem icon={<Wallet />} label={<>Paytm<br />Postpaid</>} />
          <ServiceItem icon={<TrendingUp />} label="Stocks" />
          <ServiceItem icon={<CreditCard />} label="Get Credit Card" />
          <ServiceItem icon={<Heart />} label={<>Health<br />Insurance</>} badge="Claims" />
        </div>
      </section>

      <div className="scan-dock" aria-hidden="true">
        <QrCode />
        <span>Scan QR</span>
      </div>
    </main>
  );
}

function QuickAction({ icon, label }: { icon: React.ReactNode; label: React.ReactNode }) {
  return (
    <div className="quick-action">
      <span className="quick-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <span>View All <ChevronRight aria-hidden="true" /></span>
    </div>
  );
}

function ServiceItem({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="service-item">
      {badge ? <span className="service-badge">{badge}</span> : null}
      <span className="service-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function TopicChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="topic-chip">
      {icon}
      <span>{label}</span>
    </div>
  );
}
