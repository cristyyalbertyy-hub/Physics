import { useState, type ReactNode } from 'react';

type Props = {
  label: string;
  description: string;
  children: (props: { onMissing: () => void }) => ReactNode;
};

export function MediaBlock({ label, description, children }: Props) {
  const [missing, setMissing] = useState(false);

  return (
    <section className="media-block">
      <header className="media-block-head">
        <h3>{label}</h3>
        <p className="muted small">{description}</p>
      </header>
      {missing ? (
        <div className="missing-box">
          <p>No file is available for this section yet.</p>
          <p className="muted small">
            Add the asset under <code>Public</code> using the naming pattern for this subchapter.
          </p>
        </div>
      ) : (
        children({ onMissing: () => setMissing(true) })
      )}
    </section>
  );
}
