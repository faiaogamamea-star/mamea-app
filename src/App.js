import React, { useState, useEffect, useCallback } from 'react';
 
const COLORS = {
  bg: '#04060D',
  surface: '#0B0F1A',
  card: '#111827',
  border: '#1F2937',
  accent: '#00C896',
  accentDim: '#00C89620',
  gold: '#F59E0B',
  red: '#EF4444',
  blue: '#3B82F6',
  text: '#F9FAFB',
  muted: '#6B7280',
  sub: '#9CA3AF',
};
 
const styles = {
  app: {
    fontFamily: "'Syne', sans-serif",
    background: COLORS.bg,
    minHeight: '100vh',
    color: COLORS.text,
    maxWidth: 480,
    margin: '0 auto',
    position: 'relative',
    overflowX: 'hidden',
  },
  disclaimer: {
    background: '#1a1000',
    borderBottom: `1px solid ${COLORS.gold}40`,
    padding: '8px 16px',
    fontSize: 11,
    color: COLORS.gold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  header: {
    padding: '16px 20px 12px',
    borderBottom: `1px solid ${COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: COLORS.surface,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: -0.5,
    color: COLORS.accent,
  },
  logoBadge: {
    fontSize: 9,
    fontWeight: 600,
    background: COLORS.accentDim,
    color: COLORS.accent,
    padding: '2px 7px',
    borderRadius: 4,
    marginLeft: 8,
    letterSpacing: 1,
  },
  nav: {
    display: 'flex',
    background: COLORS.surface,
    borderBottom: `1px solid ${COLORS.border}`,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  navItem: (active) => ({
    flex: '0 0 auto',
    padding: '12px 16px',
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    color: active ? COLORS.accent : COLORS.muted,
    borderBottom: active ? `2px solid ${COLORS.accent}` : '2px solid transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    letterSpacing: 0.5,
    transition: 'all 0.15s',
  }),
  content: {
    padding: '16px',
    paddingBottom: 80,
  },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
  assetRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  assetIcon: (color) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    background: color + '20',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    marginRight: 12,
    flexShrink: 0,
  }),
  assetName: {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.text,
  },
  assetSub: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    fontFamily: "'DM Mono', monospace",
  },
  price: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'DM Mono', monospace",
    textAlign: 'right',
  },
  change: (positive) => ({
    fontSize: 11,
    fontWeight: 600,
    color: positive ? COLORS.accent : COLORS.red,
    textAlign: 'right',
    marginTop: 2,
    fontFamily: "'DM Mono', monospace",
  }),
  pill: (color) => ({
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 20,
    background: color + '20',
    color: color,
    letterSpacing: 0.5,
  }),
  signalCard: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeft: `3px solid ${COLORS.accent}`,
  },
  planCard: (featured) => ({
    background: featured ? COLORS.accent + '12' : COLORS.card,
    border: `1px solid ${featured ? COLORS.accent : COLORS.border}`,
    borderRadius: 14,
    padding: 20,
    marginBottom: 14,
  }),
  btn: (variant) => ({
    display: 'block',
    width: '100%',
    padding: '12px',
    borderRadius: 10,
    border: variant === 'outline' ? `1px solid ${COLORS.accent}` : 'none',
    background: variant === 'solid' ? COLORS.accent : 'transparent',
    color: variant === 'solid' ? '#000' : COLORS.accent,
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 0.5,
    marginTop: 14,
    textAlign: 'center',
  }),
};
 
// ── CoinGecko IDs ──────────────────────────────────────────────────────────────
const CRYPTO_META = [
  { id: 'bitcoin',      name: 'Bitcoin',  symbol: 'BTC', icon: '₿', color: '#F59E0B', geckoId: 'bitcoin' },
  { id: 'ethereum',     name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: '#818CF8', geckoId: 'ethereum' },
  { id: 'solana',       name: 'Solana',   symbol: 'SOL', icon: '◎', color: '#14F195', geckoId: 'solana' },
  { id: 'binancecoin',  name: 'BNB',      symbol: 'BNB', icon: 'B', color: '#F3BA2F', geckoId: 'binancecoin' },
  { id: 'ripple',       name: 'XRP',      symbol: 'XRP', icon: '✕', color: '#3B82F6', geckoId: 'ripple' },
];
 
const STOCKS_STATIC = [
  { id: 'nvda', name: 'NVIDIA',    symbol: 'NVDA', price: null, change: null, sector: 'Tech',   icon: '⬡', color: '#76B900' },
  { id: 'aapl', name: 'Apple',     symbol: 'AAPL', price: null, change: null, sector: 'Tech',   icon: '', color: '#818CF8' },
  { id: 'tsla', name: 'Tesla',     symbol: 'TSLA', price: null, change: null, sector: 'EV',     icon: 'T', color: '#EF4444' },
  { id: 'msft', name: 'Microsoft', symbol: 'MSFT', price: null, change: null, sector: 'Tech',   icon: '⊞', color: '#00BCF2' },
  { id: 'amzn', name: 'Amazon',    symbol: 'AMZN', price: null, change: null, sector: 'Retail', icon: 'a', color: '#FF9900' },
];
 
const REALESTATE = [
  { id: 'national', name: 'National Avg',  symbol: 'USA',  price: 428500, change: 0.3,  type: 'Residential', icon: '🏠', color: '#00C896' },
  { id: 'nyc',      name: 'New York City', symbol: 'NYC',  price: 912000, change: -0.2, type: 'Metro',        icon: '🗽', color: '#3B82F6' },
  { id: 'miami',    name: 'Miami',         symbol: 'MIA',  price: 645000, change: 1.1,  type: 'Metro',        icon: '🌴', color: '#F59E0B' },
  { id: 'austin',   name: 'Austin TX',     symbol: 'AUS',  price: 489000, change: -0.8, type: 'Metro',        icon: '🤠', color: '#EC4899' },
  { id: 'reit',     name: 'REIT Index',    symbol: 'REIT', price: 94.2,   change: 0.5,  type: 'Index',        icon: '📊', color: '#00C896' },
];
 
const SIGNALS = [
  { asset: 'BTC',         type: 'MOMENTUM', signal: 'Price consolidating above key support. RSI at 52 — neutral zone. Watch volume for next directional move.', sentiment: 'NEUTRAL',  time: '2h ago' },
  { asset: 'NVDA',        type: 'EARNINGS', signal: 'Q1 beat expectations by 12%. AI chip demand driving forward guidance revision upward.',                     sentiment: 'BULLISH',  time: '4h ago' },
  { asset: 'ETH',         type: 'ON-CHAIN', signal: 'Network fees declining week-over-week. Active addresses up 7%. Staking ratio stable at 28%.',              sentiment: 'NEUTRAL',  time: '6h ago' },
  { asset: 'REAL ESTATE', type: 'MACRO',    signal: 'Fed held rates steady. 30-year mortgage avg at 6.82%. Inventory rising in Sun Belt markets.',              sentiment: 'CAUTIOUS', time: '1d ago' },
  { asset: 'SOL',         type: 'ECOSYSTEM', signal: 'DEX volume surpassed $8B weekly. Developer activity up 34% year-over-year.',                             sentiment: 'BULLISH',  time: '1d ago' },
];
 
const NEWS = [
  { title: 'Fed signals no rate cuts until inflation hits 2% target',         source: 'Reuters',  time: '1h ago',  url: 'https://reuters.com' },
  { title: 'Bitcoin ETF inflows hit record $1.2B in single day',              source: 'CoinDesk', time: '3h ago',  url: 'https://coindesk.com' },
  { title: 'NVIDIA surpasses Apple in market cap — AI era milestone',         source: 'Bloomberg',time: '5h ago',  url: 'https://bloomberg.com' },
  { title: 'Housing inventory rises for 4th consecutive month',               source: 'Redfin',   time: '8h ago',  url: 'https://redfin.com' },
  { title: 'Ethereum layer-2 transactions exceed mainnet for first time',     source: 'The Block',time: '12h ago', url: 'https://theblock.co' },
  { title: 'S&P 500 closes at all-time high amid tech rally',                 source: 'CNBC',     time: '1d ago',  url: 'https://cnbc.com' },
];
 
const PORTFOLIOS = [
  { name: 'Macro Alpha',    focus: 'Diversified',    return30d: '+18.4%', allocation: 'BTC 40% · NVDA 30% · REIT 20% · Cash 10%', followers: '12.4K' },
  { name: 'Crypto Core',   focus: 'Digital Assets', return30d: '+31.2%', allocation: 'BTC 50% · ETH 30% · SOL 20%',               followers: '8.9K'  },
  { name: 'Tech Horizon',  focus: 'Growth Stocks',  return30d: '+9.6%',  allocation: 'NVDA 35% · MSFT 25% · AAPL 25% · TSLA 15%', followers: '21K'   },
  { name: 'Income Builder',focus: 'Yield',           return30d: '+4.2%',  allocation: 'REIT 40% · Bonds 35% · Dividend ETF 25%',   followers: '6.1K'  },
];
 
// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtPrice(price, symbol) {
  if (price === null) return '—';
  if (symbol === 'REIT') return `$${price.toFixed(2)}`;
  if (price >= 1000)    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (price >= 1)       return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(4)}`;
}
 
function SentimentBadge({ sentiment }) {
  const color = sentiment === 'BULLISH' ? COLORS.accent : sentiment === 'CAUTIOUS' ? COLORS.gold : COLORS.muted;
  return <span style={styles.pill(color)}>{sentiment}</span>;
}
 
function AssetRow({ asset }) {
  const pos = asset.change >= 0;
  return (
    <div style={styles.assetRow}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <div style={styles.assetIcon(asset.color)}>
          <span style={{ color: asset.color, fontWeight: 800 }}>{asset.icon}</span>
        </div>
        <div>
          <div style={styles.assetName}>{asset.name}</div>
          <div style={styles.assetSub}>{asset.symbol} · {asset.sector || asset.type || 'CRYPTO'}</div>
        </div>
      </div>
      <div>
        <div style={styles.price}>{fmtPrice(asset.price, asset.symbol)}</div>
        {asset.change !== null
          ? <div style={styles.change(pos)}>{pos ? '+' : ''}{asset.change.toFixed(2)}%</div>
          : <div style={{ fontSize: 11, color: COLORS.muted, textAlign: 'right' }}>—</div>
        }
      </div>
    </div>
  );
}
 
// ── Fetch live crypto from CoinGecko (free, no key) ───────────────────────────
async function fetchCryptoPrices() {
  const ids = CRYPTO_META.map(c => c.geckoId).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('CoinGecko fetch failed');
  return res.json();
}
 
// ── Dashboard ──────────────────────────────────────────────────────────────────
function Dashboard({ cryptoData, loading, lastUpdated }) {
  const btc = cryptoData.find(c => c.symbol === 'BTC');
  const eth = cryptoData.find(c => c.symbol === 'ETH');
 
  return (
    <div style={styles.content}>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>
          Market Overview
          {lastUpdated && (
            <span style={{ fontSize: 10, color: COLORS.accent, marginLeft: 8, fontWeight: 400, letterSpacing: 0 }}>
              · Live via CoinGecko
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'BTC Price',     val: loading ? '...' : fmtPrice(btc?.price, 'BTC'), color: COLORS.gold },
            { label: 'ETH Price',     val: loading ? '...' : fmtPrice(eth?.price, 'ETH'), color: '#818CF8' },
            { label: 'Fear & Greed',  val: '52 · Neutral',                                 color: COLORS.muted },
          ].map(m => (
            <div key={m.label} style={{ flex: '1 1 30%', background: COLORS.surface, borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>{m.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: m.color, fontFamily: "'DM Mono', monospace" }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>
 
      <div style={styles.card}>
        <div style={styles.sectionTitle}>Top Crypto · Live Prices</div>
        {loading
          ? <div style={{ color: COLORS.muted, fontSize: 13, padding: '12px 0' }}>Fetching live prices from CoinGecko...</div>
          : cryptoData.slice(0, 5).map(a => <AssetRow key={a.id} asset={a} />)
        }
      </div>
 
      <div style={styles.sectionTitle}>Latest Signal</div>
      <div style={{ ...styles.signalCard, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent }}>{SIGNALS[0].asset}</span>
          <SentimentBadge sentiment={SIGNALS[0].sentiment} />
        </div>
        <div style={{ fontSize: 13, color: COLORS.sub, lineHeight: 1.5 }}>{SIGNALS[0].signal}</div>
        <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 8 }}>{SIGNALS[0].time}</div>
      </div>
 
      <div style={{ ...styles.card, borderColor: COLORS.gold + '40' }}>
        <div style={{ fontSize: 11, color: COLORS.gold, lineHeight: 1.6 }}>
          <strong>Information Only.</strong> All data is for educational and research purposes only. MAMEA does not provide financial advice, manage money, or execute transactions.
        </div>
      </div>
    </div>
  );
}
 
// ── Markets ────────────────────────────────────────────────────────────────────
function Markets({ cryptoData, loading }) {
  const [sub, setSub] = useState('crypto');
 
  const data = sub === 'crypto' ? cryptoData
    : sub === 'stocks' ? STOCKS_STATIC
    : REALESTATE;
 
  return (
    <div style={styles.content}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['crypto', 'stocks', 'realestate'].map(t => (
          <button key={t} onClick={() => setSub(t)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 8,
            background: sub === t ? COLORS.accent : COLORS.card,
            color: sub === t ? '#000' : COLORS.muted,
            border: `1px solid ${sub === t ? COLORS.accent : COLORS.border}`,
            fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, cursor: 'pointer',
          }}>
            {t === 'realestate' ? 'REAL EST.' : t.toUpperCase()}
          </button>
        ))}
      </div>
 
      <div style={styles.card}>
        <div style={styles.sectionTitle}>
          {sub === 'crypto' ? 'Cryptocurrency' : sub === 'stocks' ? 'Equities' : 'Real Estate'}
          {sub === 'crypto' && (
            <span style={{ fontSize: 10, color: COLORS.accent, marginLeft: 8, fontWeight: 400, letterSpacing: 0 }}>
              {loading ? '· Loading...' : '· Live via CoinGecko'}
            </span>
          )}
          {sub !== 'crypto' && (
            <span style={{ fontSize: 10, color: COLORS.muted, marginLeft: 8, fontWeight: 400, letterSpacing: 0 }}>· Reference data</span>
          )}
        </div>
        {sub === 'crypto' && loading
          ? <div style={{ color: COLORS.muted, fontSize: 13, padding: '12px 0' }}>Fetching live prices...</div>
          : data.map(a => <AssetRow key={a.id} asset={a} />)
        }
      </div>
 
      <div style={{ fontSize: 11, color: COLORS.muted, textAlign: 'center', padding: '8px 0 16px', lineHeight: 1.5 }}>
        {sub === 'crypto' ? 'Live crypto data via CoinGecko · Updates every 60s' : 'Reference data only · Not financial advice'}
      </div>
    </div>
  );
}
 
// ── Signals ────────────────────────────────────────────────────────────────────
function Signals() {
  return (
    <div style={styles.content}>
      <div style={{ ...styles.card, borderColor: COLORS.accent + '40', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 700, marginBottom: 6 }}>ℹ What Are Signals?</div>
        <div style={{ fontSize: 12, color: COLORS.sub, lineHeight: 1.6 }}>
          Signals are automated observations based on publicly available market data. They are <strong style={{ color: COLORS.text }}>not financial advice</strong> and should not be used as the sole basis for any investment decision.
        </div>
      </div>
      <div style={styles.sectionTitle}>Market Signals · {new Date().toLocaleDateString()}</div>
      {SIGNALS.map((s, i) => (
        <div key={i} style={styles.signalCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.accent }}>{s.asset}</span>
              <span style={styles.pill(COLORS.muted)}>{s.type}</span>
            </div>
            <SentimentBadge sentiment={s.sentiment} />
          </div>
          <div style={{ fontSize: 13, color: COLORS.sub, lineHeight: 1.6 }}>{s.signal}</div>
          <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 8 }}>{s.time}</div>
        </div>
      ))}
    </div>
  );
}
 
// ── News ───────────────────────────────────────────────────────────────────────
function NewsTab() {
  return (
    <div style={styles.content}>
      <div style={styles.sectionTitle}>Market News</div>
      {NEWS.map((n, i) => (
        <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <div style={{ ...styles.card, cursor: 'pointer' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, lineHeight: 1.4, marginBottom: 8 }}>{n.title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={styles.pill(COLORS.blue)}>{n.source}</span>
              <span style={{ fontSize: 11, color: COLORS.muted }}>{n.time}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
 
// ── Top Portfolios ─────────────────────────────────────────────────────────────
function TopPortfolios() {
  return (
    <div style={styles.content}>
      <div style={{ ...styles.card, borderColor: COLORS.gold + '40', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, marginBottom: 6 }}>📊 Research Tool Only</div>
        <div style={{ fontSize: 12, color: COLORS.sub, lineHeight: 1.6 }}>
          Publicly shared portfolio allocations for research and educational purposes. Past returns are hypothetical and do not guarantee future performance.
        </div>
      </div>
      <div style={styles.sectionTitle}>Public Portfolio Research</div>
      {PORTFOLIOS.map((p, i) => (
        <div key={i} style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{p.focus}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.accent, fontFamily: "'DM Mono', monospace" }}>{p.return30d}</div>
              <div style={{ fontSize: 10, color: COLORS.muted }}>30d · hypothetical</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: COLORS.sub, background: COLORS.surface, padding: '8px 10px', borderRadius: 8, lineHeight: 1.5 }}>
            {p.allocation}
          </div>
          <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 8 }}>{p.followers} following</div>
        </div>
      ))}
    </div>
  );
}
 
// ── Plans ──────────────────────────────────────────────────────────────────────
function Plans() {
  const plans = [
    { name: 'Free',  price: '$0',  period: 'forever',    featured: false, features: ['Live crypto prices via CoinGecko', 'Basic market signals', 'Top news headlines', 'Market overview dashboard'] },
    { name: 'Pro',   price: '$14', period: 'per month',  featured: true,  features: ['Everything in Free', 'Full signals access', 'Real estate market data', 'Portfolio research hub', 'Weekly market digest email', 'Priority data refresh'] },
    { name: 'Elite', price: '$39', period: 'per month',  featured: false, features: ['Everything in Pro', 'AI-powered market briefs', 'Sector deep dives', 'Early signal access', 'Custom watchlists', 'Dedicated support'] },
  ];
  return (
    <div style={styles.content}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>MAMEA Plans</div>
        <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>
          Market intelligence subscriptions.<br />
          <strong style={{ color: COLORS.gold }}>We do not manage money or execute trades.</strong>
        </div>
      </div>
      {plans.map((p, i) => (
        <div key={i} style={styles.planCard(p.featured)}>
          {p.featured && <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.accent, letterSpacing: 1.5, marginBottom: 8 }}>✦ MOST POPULAR</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{p.name}</div>
            <div>
              <span style={{ fontSize: 22, fontWeight: 800, color: p.featured ? COLORS.accent : COLORS.text, fontFamily: "'DM Mono', monospace" }}>{p.price}</span>
              <span style={{ fontSize: 11, color: COLORS.muted, marginLeft: 4 }}>/{p.period}</span>
            </div>
          </div>
          {p.features.map((f, j) => (
            <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ color: COLORS.accent, fontSize: 12, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: 13, color: COLORS.sub }}>{f}</span>
            </div>
          ))}
          <button style={styles.btn(p.featured ? 'solid' : 'outline')}>
            {p.name === 'Free' ? 'Get Started Free' : `Start ${p.name}`}
          </button>
        </div>
      ))}
      <div style={{ fontSize: 11, color: COLORS.muted, textAlign: 'center', lineHeight: 1.6, padding: '8px 0 16px' }}>
        MAMEA Financial Intelligence LLC · © 2026<br />
        Not a registered investment advisor. Not a broker-dealer.<br />
        Data is for informational purposes only.
      </div>
    </div>
  );
}
 
// ── Main App ───────────────────────────────────────────────────────────────────
const TABS = ['Dashboard', 'Markets', 'Signals', 'News', 'Portfolios', 'Plans'];
 
export default function App() {
  const [activeTab, setActiveTab]   = useState('Dashboard');
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [time, setTime]             = useState(new Date());
 
  const loadPrices = useCallback(async () => {
    try {
      const data = await fetchCryptoPrices();
      const merged = CRYPTO_META.map(meta => ({
        ...meta,
        price:  data[meta.geckoId]?.usd ?? null,
        change: data[meta.geckoId]?.usd_24h_change ?? null,
        cap:    data[meta.geckoId]?.usd_market_cap ?? null,
      }));
      setCryptoData(merged);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Price fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadPrices();
    const priceTimer = setInterval(loadPrices, 60000); // refresh every 60s
    const clockTimer = setInterval(() => setTime(new Date()), 60000);
    return () => { clearInterval(priceTimer); clearInterval(clockTimer); };
  }, [loadPrices]);
 
  const renderTab = () => {
    switch (activeTab) {
      case 'Dashboard':  return <Dashboard cryptoData={cryptoData} loading={loading} lastUpdated={lastUpdated} />;
      case 'Markets':    return <Markets cryptoData={cryptoData} loading={loading} />;
      case 'Signals':    return <Signals />;
      case 'News':       return <NewsTab />;
      case 'Portfolios': return <TopPortfolios />;
      case 'Plans':      return <Plans />;
      default:           return <Dashboard cryptoData={cryptoData} loading={loading} lastUpdated={lastUpdated} />;
    }
  };
 
  return (
    <div style={styles.app}>
      <div style={{
        background: '#1a1000',
        borderBottom: `1px solid ${COLORS.gold}40`,
        padding: '8px 16px',
        fontSize: 11,
        color: COLORS.gold,
        textAlign: 'center',
        letterSpacing: 0.3,
      }}>
        ⚠ MAMEA provides market data and intelligence only — not financial advice. We do not hold assets, execute trades, or manage funds.
      </div>
 
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={styles.logo}>MAMEA</span>
          <span style={styles.logoBadge}>BETA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {lastUpdated && (
            <span style={{ fontSize: 10, color: COLORS.accent, fontFamily: "'DM Mono', monospace" }}>● LIVE</span>
          )}
          <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: "'DM Mono', monospace" }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
 
      <div style={styles.nav}>
        {TABS.map(tab => (
          <div key={tab} style={styles.navItem(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab.toUpperCase()}
          </div>
        ))}
      </div>
 
      {renderTab()}
 
      <div style={{ padding: '24px 20px', borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 10, color: COLORS.muted, textAlign: 'center', lineHeight: 1.8 }}>
          MAMEA Financial Intelligence · © 2026<br />
          For informational purposes only. Not financial advice.<br />
          Crypto prices powered by <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent, textDecoration: 'none' }}>CoinGecko</a><br />
          <span style={{ color: COLORS.accent }}>support@mameaapp.io</span>
        </div>
      </div>
    </div>
  );
}
