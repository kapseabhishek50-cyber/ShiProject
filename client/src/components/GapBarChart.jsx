import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartFrame from './ChartFrame.jsx';
import { percent, shorten } from '../lib/format.js';

/**
 * Single-series horizontal bar chart for priority scores.
 *
 * One series, so no legend - the title names the measure. Bars are all one hue:
 * length already encodes magnitude, and repainting each bar by its own value
 * would say the same thing twice while implying the colours mean categories. The
 * band sits in the tooltip and the table instead.
 *
 * Horizontal because competency names are long: rotated x-axis labels are the
 * most common way a bar chart of named things becomes unreadable.
 */
export default function GapBarChart({ rows = [], title, subtitle, height = 300 }) {
  const data = rows.map((row) => ({
    name: shorten(row.competency?.name ?? row.name, 26),
    fullName: row.competency?.name ?? row.name,
    priority: Number(row.priority ?? 0),
    current: row.currentLevel,
    required: row.requiredLevel,
    band: row.band,
  }));

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      height={height}
      columns={['Competency', 'Current', 'Required', 'Priority', 'Band']}
      rows={data.map((row) => [
        row.fullName,
        row.current,
        row.required,
        percent(row.priority, 1),
        row.band,
      ])}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 4, left: 4 }}>
          {/* Grid only on the measured axis, hairline weight, no vertical rules. */}
          <CartesianGrid horizontal={false} stroke="var(--gridline)" />
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(value) => percent(value)}
            stroke="var(--baseline)"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            stroke="var(--baseline)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'var(--surface-2)' }}
            content={<GapTooltip />}
            wrapperStyle={{ outline: 'none' }}
          />
          <Bar dataKey="priority" radius={[0, 4, 4, 0]} barSize={14} isAnimationActive={false}>
            {data.map((row) => (
              <Cell key={row.fullName} fill="var(--series-1)" />
            ))}
            {/* Selective direct labels: the value, at the end of each bar. */}
            <LabelList
              dataKey="priority"
              position="right"
              formatter={(value) => percent(value)}
              style={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function GapTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-md border border-hairline bg-surface p-2.5 text-xs shadow-card">
      <p className="font-medium text-ink">{row.fullName}</p>
      <p className="mt-1 text-ink-2">
        Level {row.current} against a requirement of {row.required}
      </p>
      <p className="tnum mt-0.5 text-ink-2">
        Priority {percent(row.priority, 1)} · {row.band}
      </p>
    </div>
  );
}
