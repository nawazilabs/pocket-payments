import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  LogOut,
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
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Payments Home | Nawazi Labs" },
      {
        name: "description",
        content: "A mobile-first payments and services home screen from Nawazi Labs.",
      },
      { property: "og:title", content: "Payments Home | Nawazi Labs" },
      {
        property: "og:description",
        content: "A mobile-first payments and services home screen from Nawazi Labs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<{
    email?: string;
    userMetadata: Record<string, unknown>;
  } | null>(null);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    let mounted = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted || (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED")) {
        return;
      }
      setUser(session?.user ? { email: session.user.email, userMetadata: session.user.user_metadata } : null);
      setCheckedSession(true);
    });

    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ? { email: data.user.email, userMetadata: data.user.user_metadata } : null);
      setCheckedSession(true);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (checkedSession && !user) {
      void router.navigate({ to: "/auth" });
    }
  }, [checkedSession, router, user]);

  if (!checkedSession || !user) {
    return (
      <main className="wallet-loading" aria-label="Checking your account">
        <span className="paytm-wordmark">paytm</span>
      </main>
    );
  }

  const displayName = typeof user.userMetadata["full_name"] === "string"
    ? user.userMetadata["full_name"]
    : user.email ?? "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "S";

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await router.navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="paytm-screen">
      <div className="status-bar" aria-hidden="true">
        <span>17:39 ◉ ▣ ◌</span>
        <span>◉ 5G ▮▮ 36</span>
      </div>

      <header className="topbar">
        <div className="identity">
          <div className="avatar">{initial}</div>
          <div className="festival-mark">
            <span>GOLDEN</span>
            <span>DIWALI</span>
          </div>
        </div>
        <div className="topbar-actions">
          <Bell className="bell-icon" aria-hidden="true" />
          <Button variant="ghost" size="icon" aria-label="Sign out" title="Sign out" onClick={signOut}>
            <LogOut aria-hidden="true" />
          </Button>
        </div>
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
