import { useEffect, useRef } from 'react';

/** Accessible bottom sheet (dialog) — slides up on mobile, centred on desktop. */
export default function Sheet({ open, onClose, title, children, labelledBy = 'sheet-title' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="sheet" onClick={onClose}>
      <div
        className="sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet__grip" aria-hidden="true" />
        <button type="button" className="icon-btn sheet__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        {title && (
          <h2 id={labelledBy} className="sheet__title">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
