export function Skeleton({ variant = 'text', width, height, style, className = '', ...rest }) {
  const cls = `wb-skeleton ${variant ? `wb-skeleton--${variant}` : ''} ${className}`.trim();
  return <span aria-hidden="true" className={cls} style={{ width, height, ...style }} {...rest} />;
}

export function PortfolioCardSkeleton() {
  return (
    <div className="wb-card" style={{ padding: 0, overflow: 'hidden' }}>
      <Skeleton variant="block" style={{ width: '100%', borderRadius: 0 }} />
      <div style={{ padding: 22 }}>
        <Skeleton variant="title" style={{ width: '70%', marginBottom: 12 }} />
        <Skeleton variant="text" style={{ width: '95%', marginBottom: 6 }} />
        <Skeleton variant="text" style={{ width: '60%', marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <Skeleton variant="text" style={{ width: 48, height: 22, borderRadius: 999 }} />
          <Skeleton variant="text" style={{ width: 64, height: 22, borderRadius: 999 }} />
          <Skeleton variant="text" style={{ width: 40, height: 22, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="wb-card" style={{ padding: 0, overflow: 'hidden' }}>
      <Skeleton style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: 0 }} />
      <div style={{ padding: 22 }}>
        <Skeleton variant="title" style={{ width: '85%', marginBottom: 10 }} />
        <Skeleton variant="text" style={{ width: '100%', marginBottom: 6 }} />
        <Skeleton variant="text" style={{ width: '70%', marginBottom: 14 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" style={{ width: 90 }} />
          <Skeleton variant="text" style={{ width: 60 }} />
        </div>
      </div>
    </div>
  );
}

export function BlogFeaturedSkeleton() {
  return (
    <div className="wb-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 64, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <Skeleton style={{ aspectRatio: '4 / 3', borderRadius: 0 }} />
      <div style={{ padding: '48px 48px 48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Skeleton variant="text" style={{ width: 140, marginBottom: 14 }} />
        <Skeleton variant="title" style={{ width: '90%', height: 30, marginBottom: 10 }} />
        <Skeleton variant="title" style={{ width: '60%', height: 30, marginBottom: 24 }} />
        <Skeleton variant="text" style={{ width: '100%', marginBottom: 6 }} />
        <Skeleton variant="text" style={{ width: '95%', marginBottom: 6 }} />
        <Skeleton variant="text" style={{ width: '70%', marginBottom: 24 }} />
        <Skeleton variant="text" style={{ width: 110 }} />
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <>
      <header style={{ padding: '60px 0 40px', background: 'linear-gradient(180deg, var(--color-blue-tint), white)' }}>
        <div className="wb-container" style={{ maxWidth: 800 }}>
          <Skeleton variant="text" style={{ width: 120, marginBottom: 24 }} />
          <Skeleton variant="text" style={{ width: 90, height: 24, borderRadius: 999, marginBottom: 16 }} />
          <Skeleton variant="title" style={{ width: '95%', height: 48, marginBottom: 16 }} />
          <Skeleton variant="title" style={{ width: '70%', height: 48, marginBottom: 24 }} />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Skeleton variant="circle" style={{ width: 36, height: 36 }} />
            <Skeleton variant="text" style={{ width: 110 }} />
            <Skeleton variant="text" style={{ width: 90 }} />
          </div>
        </div>
      </header>
      <section className="wb-section" style={{ paddingTop: 56 }}>
        <div className="wb-container">
          <article style={{ maxWidth: 720, margin: '0 auto' }}>
            {[100, 95, 92, 70, 100, 88, 60].map((w, i) => (
              <Skeleton key={i} variant="text" style={{ width: `${w}%`, marginBottom: 14 }} />
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
