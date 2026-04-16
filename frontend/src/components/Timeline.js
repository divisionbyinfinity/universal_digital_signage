import * as React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString();
};

const buildTimelineItems = (data = []) => {
  const items = [];

  data.forEach((item, index) => {
    items.push({
      key: `${item._id || index}-start`,
      title: "Start",
      time: formatDateTime(item.startTime),
      subtitle: item.frequency ? `Frequency: ${item.frequency}` : "Schedule window begins",
      tone: "bg-emerald-500",
    });

    items.push({
      key: `${item._id || index}-end`,
      title: "End",
      time: formatDateTime(item.endTime),
      subtitle: item.endDate ? `End date: ${formatDateTime(item.endDate)}` : "Schedule window ends",
      tone: "bg-sky-500",
    });
  });

  return items;
};

export default function CustomTimeline({ data = [] }) {
  const items = buildTimelineItems(data);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative pl-2">
      <div className="absolute bottom-3 left-[1.05rem] top-3 w-px bg-slate-200" />
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="relative flex gap-4">
            <div className="relative z-10 flex w-9 shrink-0 justify-center">
              <span
                className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-4 border-white shadow ${item.tone}`}
              />
            </div>

            <div className="min-w-0 flex-1 rounded-[22px] border border-slate-200/80 bg-white/90 p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <EventIcon sx={{ fontSize: 18 }} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Schedule marker
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  {item.time}
                </div>
              </div>

              <p className="mt-3 mb-0 text-sm leading-6 text-slate-600">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
