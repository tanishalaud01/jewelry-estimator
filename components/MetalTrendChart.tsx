"use client";

import { useMemo, useRef, useState } from "react";
import type { PriceHistoryPoint } from "@/lib/priceHistory";

const WIDTH = 560;
const HEIGHT = 160;
const PADDING = { top: 16, right: 12, bottom: 24, left: 12 };

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MetalTrendChart({
  label,
  points,
}: {
  label: string;
  points: PriceHistoryPoint[];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plot = useMemo(() => {
    if (points.length < 2) return null;

    const times = points.map((p) => new Date(p.asOf).getTime());
    const values = points.map((p) => p.pricePerGram);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueSpan = maxValue - minValue || maxValue * 0.01 || 1;
    const timeSpan = maxTime - minTime || 1;

    const plotWidth = WIDTH - PADDING.left - PADDING.right;
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

    const xy = points.map((point, i) => {
      const x =
        PADDING.left +
        ((times[i] - minTime) / timeSpan) * plotWidth;
      const y =
        PADDING.top +
        plotHeight -
        ((point.pricePerGram - minValue) / valueSpan) * plotHeight;
      return { x, y };
    });

    const path = xy
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(" ");

    const gridValues = [minValue, (minValue + maxValue) / 2, maxValue];
    const gridLines = gridValues.map((value) => ({
      value,
      y:
        PADDING.top +
        plotHeight -
        ((value - minValue) / valueSpan) * plotHeight,
    }));

    return { xy, path, gridLines, plotWidth };
  }, [points]);

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!plot || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH;

    let nearest = 0;
    let nearestDistance = Infinity;
    plot.xy.forEach((p, i) => {
      const distance = Math.abs(p.x - relativeX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  if (!plot) {
    return (
      <div className="rounded-lg border border-border bg-surface-muted p-4 text-sm text-muted">
        Building {label.toLowerCase()} price history — check back after a few
        more visits.
      </div>
    );
  }

  const hovered = hoverIndex !== null ? plot.xy[hoverIndex] : null;
  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : null;
  const lastPoint = plot.xy[plot.xy.length - 1];
  const recent = points.slice(-5).reverse();

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full touch-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {plot.gridLines.map((line) => (
          <g key={line.value}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={line.y}
              y2={line.y}
              className="stroke-border"
              strokeWidth={1}
            />
            <text
              x={WIDTH - PADDING.right}
              y={line.y - 4}
              textAnchor="end"
              className="fill-muted font-tabular"
              fontSize={10}
            >
              ${line.value.toFixed(2)}
            </text>
          </g>
        ))}

        <path
          d={plot.path}
          fill="none"
          className="text-accent"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={5}
          className="text-accent"
          fill="currentColor"
          stroke="var(--surface)"
          strokeWidth={2}
        />

        {hovered && (
          <g>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PADDING.top}
              y2={HEIGHT - PADDING.bottom}
              className="stroke-muted"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <circle
              cx={hovered.x}
              cy={hovered.y}
              r={5}
              className="text-accent"
              fill="currentColor"
              stroke="var(--surface)"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      <div className="mt-1 min-h-[2.5rem] rounded-md border border-border bg-surface-muted px-3 py-2 text-xs">
        {hoveredPoint ? (
          <>
            <span className="font-tabular font-semibold text-foreground">
              ${hoveredPoint.pricePerGram.toFixed(2)}/g
            </span>
            <span className="ml-2 text-muted">
              {formatTime(hoveredPoint.asOf)} ·{" "}
              {hoveredPoint.source === "live" ? "live" : "fallback"}
            </span>
          </>
        ) : (
          <span className="text-muted">
            Hover the chart for a reading, or see recent values below.
          </span>
        )}
      </div>

      <details className="mt-2 text-xs text-muted">
        <summary className="cursor-pointer select-none">
          Recent readings
        </summary>
        <ul className="mt-1 space-y-0.5 font-tabular">
          {recent.map((point) => (
            <li key={point.asOf} className="flex justify-between">
              <span>{formatTime(point.asOf)}</span>
              <span className="text-foreground">
                ${point.pricePerGram.toFixed(2)}/g
              </span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
