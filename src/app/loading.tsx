export default function Loading() {
  return (
    <section className="container loading-page" aria-label="Carregando página">
      <div className="skeleton skeleton-title" />
      <div className="skeleton-grid">
        {[1, 2, 3].map((i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
    </section>
  );
}
