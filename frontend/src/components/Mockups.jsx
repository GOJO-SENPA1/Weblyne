// Hand-built fake-but-believable site mockups for portfolio cards.
// Pure HTML/CSS — no images. Ported from the design.

export function MockClinic() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 28, background: '#0d6e8c', color: 'white', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
        <span style={{ fontWeight: 700, letterSpacing: 0.5 }}>◊ KOSHI HEALTH</span>
        <span style={{ display: 'flex', gap: 12, fontSize: 8, opacity: 0.85 }}>
          <span>About</span><span>Doctors</span><span>Services</span><span>Contact</span>
        </span>
        <span style={{ background: 'white', color: '#0d6e8c', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>Book Visit</span>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #e8f7fb, #f5fdff)', padding: '20px 14px', display: 'flex', gap: 12 }}>
        <div style={{ flex: 1.2 }}>
          <div style={{ fontSize: 7, color: '#0d6e8c', fontWeight: 600, marginBottom: 4, letterSpacing: 0.5 }}>YOUR HEALTH, OUR PRIORITY</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: '#062a3a', lineHeight: 1.1, marginBottom: 8 }}>Trusted family care<br />in Biratnagar.</div>
          <div style={{ fontSize: 7, color: '#3b5b6b', lineHeight: 1.5, marginBottom: 8 }}>15+ years caring for the families of Morang district. Same-day appointments available.</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ background: '#0d6e8c', color: 'white', fontSize: 7, padding: '4px 8px', borderRadius: 3, fontWeight: 600 }}>Book Online</div>
            <div style={{ background: 'white', border: '1px solid #cfe6ed', color: '#0d6e8c', fontSize: 7, padding: '4px 8px', borderRadius: 3, fontWeight: 600 }}>Call: 9802···</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#cfe6ed', borderRadius: 6, position: 'relative', minHeight: 70, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(13,110,140,0.4))' }} />
          <div style={{ position: 'absolute', bottom: 4, left: 4, color: 'white', fontSize: 7, fontWeight: 600 }}>Dr. Sharma · MBBS, MD</div>
          <div style={{ position: 'absolute', top: 6, right: 6, background: 'white', borderRadius: 999, padding: '2px 6px', fontSize: 6, color: '#0d6e8c', fontWeight: 700 }}>★ 4.9</div>
        </div>
      </div>
      <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {['General', 'Pediatric', 'Cardio', 'Lab Test'].map((s) => (
          <div key={s} style={{ border: '1px solid #e3eef1', borderRadius: 4, padding: '8px 6px', textAlign: 'center' }}>
            <div style={{ width: 12, height: 12, background: '#e8f7fb', borderRadius: 999, margin: '0 auto 4px' }} />
            <div style={{ fontSize: 6.5, fontWeight: 600, color: '#062a3a' }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockSchool() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 26, background: 'white', borderBottom: '1px solid #f0e8d8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
        <span style={{ fontWeight: 800, fontSize: 9, color: '#7a4a1c', letterSpacing: 0.5 }}>◇ SHREE BIDYA ACADEMY</span>
        <span style={{ display: 'flex', gap: 10, fontSize: 7, color: '#5a4a2a' }}>
          <span>Programs</span><span>Admissions</span><span>Faculty</span><span>News</span>
        </span>
        <span style={{ background: '#7a4a1c', color: 'white', padding: '3px 8px', borderRadius: 999, fontSize: 7, fontWeight: 600 }}>Apply Now</span>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #faf3e3, #fef9ed)', padding: '18px 14px', position: 'relative' }}>
        <div style={{ fontSize: 7, color: '#a86b1c', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>EST. 2008 · BIRATNAGAR</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#3b2410', lineHeight: 1, marginBottom: 6, fontStyle: 'italic' }}>Where curiosity<br />becomes character.</div>
        <div style={{ fontSize: 7, color: '#6b5230', lineHeight: 1.5, maxWidth: '70%', marginBottom: 8 }}>A bilingual K-12 community school. Now accepting applications for grades Nursery–10.</div>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ background: '#7a4a1c', color: 'white', fontSize: 7, padding: '4px 9px', borderRadius: 999, fontWeight: 600 }}>Schedule a Tour</div>
          <div style={{ background: 'transparent', border: '1px solid #c5a06a', color: '#7a4a1c', fontSize: 7, padding: '4px 9px', borderRadius: 999, fontWeight: 600 }}>Brochure ↓</div>
        </div>
        <div style={{ position: 'absolute', right: 12, top: 12, width: 50, height: 50, borderRadius: 999, background: '#fce8b8', opacity: 0.7 }} />
        <div style={{ position: 'absolute', right: 28, bottom: 8, width: 16, height: 16, borderRadius: 999, background: '#7a4a1c' }} />
      </div>
      <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {[['1,200+', 'Students'], ['85+', 'Teachers'], ['17 yrs', 'Heritage']].map(([n, l]) => (
          <div key={l} style={{ borderLeft: '2px solid #c5a06a', paddingLeft: 6 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, color: '#3b2410' }}>{n}</div>
            <div style={{ fontSize: 6, color: '#6b5230', textTransform: 'uppercase', letterSpacing: 0.5 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockRestaurant() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0e0a08', color: '#f4ead4', overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', borderBottom: '1px solid #2a1f17' }}>
        <span style={{ fontWeight: 800, fontSize: 9, letterSpacing: 1, color: '#e6b15a' }}>THE COURTYARD</span>
        <span style={{ display: 'flex', gap: 10, fontSize: 7, color: '#a89677' }}>
          <span>Menu</span><span>Story</span><span>Visit</span><span>Reserve</span>
        </span>
        <span style={{ border: '1px solid #e6b15a', color: '#e6b15a', padding: '3px 8px', fontSize: 7, fontWeight: 600, letterSpacing: 0.5 }}>RESERVE</span>
      </div>
      <div style={{ position: 'relative', height: 110, background: 'radial-gradient(circle at 70% 40%, #3a2614, #14100c)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 12, left: 14, fontSize: 6, letterSpacing: 2, color: '#a89677' }}>EST. 2019 — BIRATNAGAR</div>
        <div style={{ position: 'absolute', top: 28, left: 14, right: 80, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, lineHeight: 1, color: '#f4ead4' }}>A taste of <span style={{ color: '#e6b15a' }}>Mithila</span></div>
        <div style={{ position: 'absolute', top: 68, left: 14, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: '#f4ead4', lineHeight: 1 }}>in every plate.</div>
        <div style={{ position: 'absolute', right: -20, top: 10, width: 90, height: 90, borderRadius: 999, border: '1px solid #6b4a2a', background: 'radial-gradient(circle, #4a2e18, transparent 70%)' }} />
        <div style={{ position: 'absolute', right: 6, top: 36, width: 38, height: 38, borderRadius: 999, background: '#7a4e26' }} />
        <div style={{ position: 'absolute', right: 14, top: 44, width: 22, height: 22, borderRadius: 999, background: '#e6b15a' }} />
      </div>
      <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', fontSize: 6.5, color: '#a89677', letterSpacing: 1 }}>
        <span>★ ★ ★ ★ ★  4.8 / 850 reviews</span>
        <span>OPEN · 11AM–10PM</span>
      </div>
    </div>
  );
}

export function MockEcom() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fafaf7', overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 24, background: 'white', borderBottom: '1px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px' }}>
        <span style={{ fontWeight: 800, fontSize: 9, color: '#1a1a1a' }}>HIMALI · WEAVES</span>
        <span style={{ display: 'flex', gap: 8, fontSize: 7, color: '#444' }}><span>Shop</span><span>Sale</span><span>About</span></span>
        <span style={{ display: 'flex', gap: 8, fontSize: 7 }}><span>♡</span><span>⌕</span><span style={{ background: '#1a1a1a', color: 'white', padding: '2px 6px', borderRadius: 3 }}>Cart · 2</span></span>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 7, color: '#888', letterSpacing: 1, marginBottom: 4 }}>NEW SEASON / DHAKA WOVEN</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1, marginBottom: 8 }}>Threads of the Hills</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[['#a85432', 'Topi'], ['#3a5a3a', 'Dhaka'], ['#c8a877', 'Patuka']].map(([c, l]) => (
            <div key={l}>
              <div style={{ aspectRatio: '1', background: c, borderRadius: 4 }} />
              <div style={{ fontSize: 7, marginTop: 4, fontWeight: 600 }}>{l}</div>
              <div style={{ fontSize: 6.5, color: '#666' }}>Rs 2,400</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const MOCK_BY_KEY = { clinic: MockClinic, school: MockSchool, restaurant: MockRestaurant, ecom: MockEcom };
