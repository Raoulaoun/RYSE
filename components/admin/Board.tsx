"use client";

import Link from "next/link";
import { useState, useTransition, type DragEvent } from "react";
import { setStatus } from "@/app/admin/actions";

export type BoardCard = {
  id: number;
  startup: string;
  ref: string;
  founder: string;
  stage: string;
  sector: string;
  meta: string;
  hot: boolean;
  lead: string;
};
export type BoardLane = { key: string; name: string; dot: string; locked: boolean; cards: BoardCard[] };

// Lanes of applications; dragging a card to another lane changes its status.
export function Board({ lanes: initial }: { lanes: BoardLane[] }) {
  const [lanes, setLanes] = useState(initial);
  // Take fresh server data after a save without remounting (which would drop the toast).
  const [seen, setSeen] = useState(initial);
  if (seen !== initial) {
    setSeen(initial);
    setLanes(initial);
  }
  const [over, setOver] = useState<string | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [, start] = useTransition();

  function say(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 3200);
  }

  function move(cardId: number, to: string) {
    const from = lanes.find((l) => l.cards.some((c) => c.id === cardId));
    const target = lanes.find((l) => l.key === to);
    if (!from || !target || from.key === to) return;
    if (target.locked) {
      say("Decide from the application page, so the founder gets an answer.");
      return;
    }
    const card = from.cards.find((c) => c.id === cardId)!;
    const before = lanes;
    setLanes(
      lanes.map((l) =>
        l.key === from.key
          ? { ...l, cards: l.cards.filter((c) => c.id !== cardId) }
          : l.key === to
            ? { ...l, cards: [{ ...card, meta: "Moved just now", hot: false }, ...l.cards] }
            : l,
      ),
    );
    start(async () => {
      const r = await setStatus(cardId, to);
      if (!r.ok) {
        setLanes(before);
        say(r.error);
      } else {
        say(`${card.startup} moved to ${target.name}`);
      }
    });
  }

  const dragProps = (key: string) => ({
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      if (over !== key) setOver(key);
    },
    onDragLeave: (e: DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null);
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setOver(null);
      const id = Number(e.dataTransfer.getData("text/plain"));
      if (id) move(id, key);
    },
  });

  return (
    <>
      <div className="board-scroll">
        <div className="board">
          {lanes.map((l) => (
            <section key={l.key} className={"lane" + (over === l.key ? " over" : "") + (l.locked ? " locked" : "")} aria-label={l.name} {...dragProps(l.key)}>
              <div className="lane-h">
                <h2>
                  <span className="d" style={{ background: l.dot }}></span>
                  {l.name}
                </h2>
                <span className="c">{l.cards.length}</span>
              </div>
              {l.cards.map((k) => (
                <Link
                  key={k.id}
                  href={`/admin/applications/${k.id}`}
                  className={"kard" + (dragging === k.id ? " dragging" : "")}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", String(k.id));
                    e.dataTransfer.effectAllowed = "move";
                    setDragging(k.id);
                  }}
                  onDragEnd={() => setDragging(null)}
                >
                  <div className="top">
                    <span className="strong">{k.startup}</span>
                    <span className="meta-s" style={{ fontSize: 12 }}>
                      {k.ref}
                    </span>
                  </div>
                  <span className="who">{k.founder}</span>
                  <div className="tags">
                    <span className="tag s">{k.stage}</span>
                    <span className="tag s">{k.sector}</span>
                  </div>
                  <div className="bot">
                    <span className={k.hot ? "hot" : "quiet"}>{k.meta}</span>
                    <span className="lead" title="Lead partner">
                      {k.lead}
                    </span>
                  </div>
                </Link>
              ))}
            </section>
          ))}
        </div>
      </div>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
