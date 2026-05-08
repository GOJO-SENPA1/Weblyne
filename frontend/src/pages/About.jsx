import Icon from '../components/Icon.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import anshAvatar from '../assets/ansh-avatar.jpg';

const VALUES = [
  { n: '01', t: 'Transparency', d: 'You see every line item. We share progress weekly. No mysterious "consulting fees" or vague timelines.', icon: 'shield' },
  { n: '02', t: 'Speed', d: 'Most marketing sites launch in 30 days. We respect your time and your money — by moving quickly without cutting corners.', icon: 'lightning' },
  { n: '03', t: 'Local-first', d: 'We build for Nepali context — bilingual content, low-bandwidth performance, eSewa & Khalti by default.', icon: 'map' },
];

const MILESTONES = [
  { date: 'Late 2025', t: 'The idea', d: 'Aditya decides Biratnagar needs a studio that builds for the local context — modern, fast, and honest about being new.' },
  { date: 'Early 2026', t: 'Brand & stack', d: 'Weblyne gets its name, logo and tech foundation — designed and built solo, end to end.' },
  { date: 'May 2026', t: 'Open for our first clients', d: 'Site is live. No fake portfolio, no inflated numbers — booking our first projects with founder-led care.' },
  { date: 'Someday', t: 'A real office', d: "We're online-first today. When the work justifies it, a Biratnagar studio space is on the list." },
];

export default function About() {
  return (
    <>
      <header className="wb-pagehead">
        <div className="wb-container wb-pagehead__inner">
          <span className="wb-eyebrow">Our story</span>
          <h1 style={{ marginTop: 14 }}>A studio rooted<br />in Biratnagar.</h1>
          <p>Weblyne is an online-first web studio based in Biratnagar — building modern websites and apps for Nepali businesses, with founder-led care on every project.</p>
        </div>
      </header>

      <section className="wb-section">
        <div className="wb-container">
          <div className="wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <span className="wb-eyebrow">2025 → today</span>
              <h2 style={{ marginTop: 12, marginBottom: 24 }}>Local roots,<br />global standards.</h2>
              <p style={{ fontSize: 17, color: 'var(--color-text)', lineHeight: 1.6, marginBottom: 16 }}>
                We grew up watching Biratnagar's small businesses struggle online — paying for templates that never worked, getting lost in Kathmandu agencies' priority lists, or simply avoiding the web altogether.
              </p>
              <p style={{ fontSize: 17, color: 'var(--color-text)', lineHeight: 1.6, marginBottom: 16 }}>
                Weblyne exists to change that. We build modern, fast, beautiful websites and apps to international standards — but priced and supported for Nepali businesses, and crafted with the local context in mind.
              </p>
              <p style={{ fontSize: 17, color: 'var(--color-text)', lineHeight: 1.6 }}>
                Every project starts with us showing up in person. Every one ends with you knowing your way around the system we built. That's the deal.
              </p>
            </div>
            <div style={{ position: 'relative', aspectRatio: '4/5', maxWidth: 420, marginLeft: 'auto', width: '100%' }}>
              <div style={{ position: 'absolute', inset: 0, transform: 'translate(16px, 16px)', background: 'var(--color-blue)', borderRadius: 20 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1d2a4a, #042c53)', borderRadius: 20, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 28 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 30%, rgba(124,158,255,0.4), transparent 60%)' }} />
                <div style={{ position: 'absolute', top: 28, left: 28, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>BIRATNAGAR · NEPAL</div>
                <div style={{ position: 'relative', color: 'white' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, fontWeight: 500, marginBottom: 8 }}>"We don't ship<br />websites. We ship<br />businesses online."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wb-section" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="wb-container">
          <div className="wb-section__head">
            <div>
              <span className="wb-eyebrow">Meet the founder</span>
              <h2 style={{ marginTop: 12 }}>The team behind Weblyne.</h2>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="wb-card wb-stack-md" style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '320px 1fr' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--color-blue), var(--color-navy))', position: 'relative', overflow: 'hidden', minHeight: 280 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2), transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 24, left: 24, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 96, color: 'rgba(255,255,255,0.95)', lineHeight: 1, letterSpacing: '-0.06em' }}>AB</div>
                <div style={{ position: 'absolute', top: 24, right: 24, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>FOUNDER</div>
              </div>
              <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: 28, marginBottom: 6 }}>Aditya Bhujel</h3>
                <div style={{ color: 'var(--color-blue)', fontWeight: 600, marginBottom: 4 }}>Founder &amp; Lead Developer</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24, fontFamily: 'var(--font-mono)' }}>Biratnagar, Nepal</div>
                <p style={{ color: 'var(--color-text)', fontSize: 15, lineHeight: 1.6, marginBottom: 24, maxWidth: 540 }}>
                  Self-taught developer building Weblyne from Biratnagar. Early in the journey, deeply into modern web tech — and serious about doing right by every client we take on.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                  {['React', 'Next.js', 'TypeScript', 'Node.js', 'Postgres', 'Figma', 'SEO'].map(s => (
                    <span key={s} className="wb-chip" style={{ fontSize: 12 }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { name: 'linkedin', href: 'https://www.linkedin.com/in/aditya-bhujel-8755942b2/', label: 'LinkedIn' },
                    { name: 'github', href: 'https://github.com/Shadow-ops-alt', label: 'GitHub' },
                    { name: 'twitter', href: 'https://x.com/HWFH13', label: 'X (Twitter)' },
                    { name: 'mail', href: 'mailto:adityabhujel999@gmail.com', label: 'Email' },
                  ].map(s => (
                    <a key={s.name} href={s.href} target={s.name === 'mail' ? undefined : '_blank'} rel="noreferrer" aria-label={s.label} style={{
                      width: 38, height: 38, borderRadius: 10,
                      border: '1px solid var(--color-line)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-text-muted)',
                    }}><Icon name={s.name} size={16} /></a>
                  ))}
                </div>
              </div>
            </div>
            <div className="wb-card wb-stack-md" style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '320px 1fr' }}>
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: 280 }}>
                <img src={anshAvatar} alt="Ansh Bohara" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,44,83,0.65) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', top: 24, right: 24, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>CO-FOUNDER</div>
              </div>
              <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: 28, marginBottom: 6 }}>Ansh Bohara</h3>
                <div style={{ color: 'var(--color-blue)', fontWeight: 600, marginBottom: 4 }}>Co-Founder &amp; Side Developer</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24, fontFamily: 'var(--font-mono)' }}>Biratnagar, Nepal</div>
                <p style={{ color: 'var(--color-text)', fontSize: 15, lineHeight: 1.6, marginBottom: 24, maxWidth: 540 }}>
                  Self-taught cybersecurity enthusiast and co-builder of Weblyne, based in Biratnagar. Passionate about breaking things apart to understand how they work — from web vulnerabilities to AI systems. Deeply into modern web tech, prompt engineering, and security research, while helping build something clients can actually trust.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                  {['Prompt Engineering', 'Burp Suite', 'Python', 'GitHub', 'React'].map(s => (
                    <span key={s} className="wb-chip" style={{ fontSize: 12 }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { name: 'linkedin', href: 'https://www.linkedin.com/in/ansh-bohara-47169a344', label: 'LinkedIn' },
                    { name: 'github', href: 'https://github.com/GOJO-SENPA1', label: 'GitHub' },
                    { name: 'twitter', href: 'https://x.com/AnshBohra08975', label: 'X (Twitter)' },
                    { name: 'mail', href: 'mailto:anshbohara10@proton.me', label: 'Email' },
                  ].map(s => (
                    <a key={s.name} href={s.href} target={s.name === 'mail' ? undefined : '_blank'} rel="noreferrer" aria-label={s.label} style={{
                      width: 38, height: 38, borderRadius: 10,
                      border: '1px solid var(--color-line)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-text-muted)',
                    }}><Icon name={s.name} size={16} /></a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wb-section">
        <div className="wb-container">
          <div className="wb-section__head">
            <div>
              <span className="wb-eyebrow">What we stand for</span>
              <h2 style={{ marginTop: 12 }}>Three values, no compromise.</h2>
            </div>
          </div>
          <div className="wb-grid wb-grid--cols-3 wb-stagger" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {VALUES.map((v, i) => (
              <div key={v.n} style={{ padding: 32, border: '1px solid var(--color-line)', borderRadius: 16, position: 'relative', '--i': i }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-blue-light)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Icon name={v.icon} size={22} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-faint)', letterSpacing: '0.1em' }}>{v.n} / 03</div>
                <h3 style={{ marginTop: 8, marginBottom: 12, fontSize: 22 }}>{v.t}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 15, lineHeight: 1.6 }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wb-section" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="wb-container">
          <div className="wb-section__head">
            <div>
              <span className="wb-eyebrow">Milestones</span>
              <h2 style={{ marginTop: 12 }}>Year one, in moments.</h2>
            </div>
          </div>
          <div className="wb-stagger" style={{ position: 'relative', maxWidth: 800, margin: '0 auto', paddingLeft: 48 }}>
            <div style={{ position: 'absolute', left: 12, top: 8, bottom: 8, width: 2, background: 'var(--color-line-strong)' }} />
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: 32, '--i': i }}>
                <div style={{ position: 'absolute', left: -42, top: 4, width: 24, height: 24, borderRadius: 999, background: 'white', border: '2px solid var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-blue)' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-blue)', letterSpacing: '0.05em', marginBottom: 6 }}>{m.date}</div>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>{m.t}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 15, maxWidth: 560 }}>{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
