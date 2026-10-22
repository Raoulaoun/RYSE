"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { Company } from "@/lib/content";
import { IconCircle } from "./Icon";

const PANEL_ID = "portfolio-panel";
const ANIM_MS = 250;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setHash(hash: string) {
  history.replaceState(null, "", hash);
}

/**
 * Portfolio cards that open a company's details in a panel under the clicked
 * card's row, like an image-search preview. Deep links: #portfolio-<slug>.
 */
export function PortfolioGrid({ companies }: { companies: Company[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [cols, setCols] = useState(3);
  const [open, setOpen] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const justOpened = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const openAt = useCallback(
    (i: number) => {
      window.clearTimeout(closeTimer.current);
      setClosing(false);
      setOpen(i);
      justOpened.current = true;
      setHash(`#portfolio-${companies[i].slug}`);
    },
    [companies],
  );

  const close = useCallback(() => {
    if (open === null) return;
    const i = open;
    setClosing(true);
    closeTimer.current = window.setTimeout(
      () => {
        setOpen(null);
        setClosing(false);
        setHash("#portfolio");
        cardRefs.current[i]?.focus();
      },
      reducedMotion() ? 0 : ANIM_MS,
    );
  }, [open]);

  // Follow the grid's real column count (3 desktop, 2 tablet, 1 mobile).
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => setCols(getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length || 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, []);

  // Deep links: /#portfolio-goldish opens Goldish, on load and on hash changes.
  useEffect(() => {
    const fromHash = () => {
      const slug = /^#portfolio-(.+)$/.exec(window.location.hash)?.[1];
      const i = companies.findIndex((c) => c.slug === slug);
      if (i >= 0) openAt(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [companies, openAt]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // After opening: focus the company name, then bring the panel into view.
  useEffect(() => {
    if (open === null || !justOpened.current) return;
    justOpened.current = false;
    headingRef.current?.focus({ preventScroll: true });
    const reduce = reducedMotion();
    const t = window.setTimeout(
      () => {
        const panel = document.getElementById(PANEL_ID);
        if (!panel) return;
        const header = document.querySelector<HTMLElement>("header.top")?.offsetHeight ?? 0;
        const r = panel.getBoundingClientRect();
        const fullyVisible = r.top >= header + 16 && r.bottom <= window.innerHeight;
        if (!fullyVisible) {
          window.scrollTo({ top: window.scrollY + r.top - header - 16, behavior: reduce ? "instant" : "smooth" });
        }
      },
      reduce ? 0 : ANIM_MS,
    );
    return () => window.clearTimeout(t);
  }, [open]);

  const n = companies.length;
  const row = open === null ? -1 : Math.floor(open / cols);
  const rowEnd = open === null ? -1 : Math.min(n - 1, (row + 1) * cols - 1);

  return (
    <div className="port-grid" ref={gridRef}>
      {companies.map((c, i) => (
        <Fragment key={c.slug}>
          <button
            type="button"
            className="co"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            aria-controls={PANEL_ID}
            aria-expanded={open === i}
            onClick={() => (open === i ? close() : openAt(i))}
          >
            <span className="co-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/logos/${c.logo}.png`} alt="" loading="lazy" />
            </span>
            <span className="co-text">
              <span className="co-name">{c.name}</span>
              <span className="sector">{c.sector}</span>
              {c.exited && <span className="pill-exited">Exited</span>}
            </span>
          </button>
          {i === rowEnd && open !== null && (
            // Keyed by row: switching within a row swaps the content in place.
            <Panel
              key={`row-${row}`}
              c={companies[open]}
              index={open}
              closing={closing}
              headingRef={headingRef}
              onClose={close}
              onPrev={() => openAt((open - 1 + n) % n)}
              onNext={() => openAt((open + 1) % n)}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

function Panel({
  c,
  index,
  closing,
  headingRef,
  onClose,
  onPrev,
  onNext,
}: {
  c: Company;
  index: number;
  closing: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Start collapsed, expand on the next frame so the height transition runs.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const titleId = `pf-title-${c.slug}`;
  return (
    <section
      id={PANEL_ID}
      role="region"
      aria-labelledby={titleId}
      className={"pf-panel" + (shown && !closing ? " shown" : "")}
    >
      <div className="pf-clip">
        <div className="pf-card">
          <div className="pf-img">
            {c.image && (
              <Image src={c.image.src} alt={`${c.name} in pictures`} fill sizes="(min-width: 760px) 440px, 100vw" />
            )}
          </div>
          <div className="pf-body">
            <button type="button" className="pf-close" aria-label="Close company details" onClick={onClose}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="pf-top">
              <span className="eyebrow">
                Portfolio / {String(index + 1).padStart(2, "0")} · {c.where}
              </span>
              <div className="co-id">
                <span className="card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/logos/${c.logo}.png`} alt={`${c.name} logo`} />
                </span>
                <span className="sector-pill">{c.sector}</span>
                {c.exited && <span className="pill-exited">Exited</span>}
              </div>
            </div>
            <h3 id={titleId} ref={headingRef} tabIndex={-1}>
              {c.name}
            </h3>
            <p className="pf-overview">{c.overview}</p>
            <div className="co-block">
              <h4>Key highlights</h4>
              <ul className="highlights">
                {c.highlights.map((h) => (
                  <li key={h}>
                    <IconCircle name="check" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="co-block">
              <h4>Partner&apos;s role &amp; contributions</h4>
              <p className="role-line">{c.role}</p>
            </div>
            <div className="co-block">
              <h4>Commercial impact</h4>
              <div className="tiles three">
                {c.impact.map((s) => (
                  <div className={"tile" + (c.lightStats ? " light" : "")} key={s.label}>
                    <b>{s.value}</b>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              {c.footnotes && (
                <div className="footnotes">
                  {c.footnotes.map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="pf-nav">
              <button type="button" onClick={onPrev}>
                ← Previous company
              </button>
              <button type="button" onClick={onNext}>
                Next company →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
