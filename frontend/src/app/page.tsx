import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.badge}>🏠 AI-Powered Real Estate Intelligence</div>
          <h1 className={styles.heroTitle}>
            The AI Behind <span className="gradient-text">Better Buys</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Stop guessing. DataSage analyzes property valuations, location quality,
            and market trends to help you make smarter real estate decisions in Delhi-NCR.
          </p>
          <div className={styles.heroCta}>
            <Link href="/properties" className="btn btn-primary btn-lg">
              Explore Properties
            </Link>
            <Link href="/register" className="btn btn-secondary btn-lg">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`section ${styles.features}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            What makes DataSage <span className="gradient-text">different</span>
          </h2>
          <div className={styles.featureGrid}>
            <FeatureCard
              icon="📊"
              title="AI Valuation"
              description="XGBoost ML model predicts fair market value and classifies properties as overpriced, fair, or underpriced."
            />
            <FeatureCard
              icon="🗺️"
              title="Location Intelligence"
              description="Automated scoring based on nearby schools, hospitals, metro stations, parks, and shopping from OpenStreetMap."
            />
            <FeatureCard
              icon="🔍"
              title="Explainable AI"
              description="SHAP-powered explanations tell you exactly which features drive each price prediction. No black boxes."
            />
            <FeatureCard
              icon="💡"
              title="Smart Recommendations"
              description="Personalized property matches based on your budget, lifestyle priorities, and commute preferences."
            />
            <FeatureCard
              icon="⚖️"
              title="Side-by-Side Comparison"
              description="Compare up to 4 properties across 15+ dimensions with automated best-pick analysis."
            />
            <FeatureCard
              icon="📈"
              title="Investment Insights"
              description="Locality price trends, rental yield estimates, and growth potential scoring for investors."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <StatCard number="1,000+" label="Properties Analyzed" />
            <StatCard number="50+" label="Delhi-NCR Localities" />
            <StatCard number="30+" label="AI Features" />
            <StatCard number="6" label="Cities Covered" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to make smarter property decisions?</h2>
            <p className={styles.ctaText}>
              Create a free account to unlock AI valuations, personalized recommendations,
              and property comparisons.
            </p>
            <Link href="/register" className="btn btn-primary btn-lg">
              Get Started — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.featureCard}>
      <span className={styles.featureIcon}>{icon}</span>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statNumber}>{number}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
