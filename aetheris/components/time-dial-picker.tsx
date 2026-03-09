"use client";

import { useEffect, useMemo, useState } from "react";

type TimeDialPickerProps = {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

const minuteValues = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function getPointPosition(index: number, radius: number) {
  const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 110 + radius * Math.cos(angle),
    y: 110 + radius * Math.sin(angle),
  };
}

function parseTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return { hour12: 12, minute: 0, period: "AM" as const };
  }

  const hour24 = Number(match[1]);
  const minute = Number(match[2]);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return { hour12, minute: Math.min(55, Math.max(0, minute - (minute % 5))), period };
}

function formatTime(hour12: number, minute: number, period: "AM" | "PM") {
  let hour24 = hour12 % 12;
  if (period === "PM") {
    hour24 += 12;
  }
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function TimeDialPicker({ value, onChange, isOpen, onClose }: TimeDialPickerProps) {
  const parsed = useMemo(() => parseTime(value), [value]);
  const [selectedHour, setSelectedHour] = useState(parsed.hour12);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(parsed.period);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedHour(parsed.hour12);
    setSelectedMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [isOpen, parsed.hour12, parsed.minute, parsed.period]);

  if (!isOpen) return null;

  const applySelection = (hour12: number, minute: number, nextPeriod: "AM" | "PM", close = false) => {
    onChange(formatTime(hour12, minute, nextPeriod));
    if (close) {
      onClose();
    }
  };

  const apply = () => {
    applySelection(selectedHour, selectedMinute, period, true);
  };

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[240px] rounded-2xl border border-white/20 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs tracking-wide text-slate-300">Select Time</p>
        <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => {
              setPeriod("AM");
              applySelection(selectedHour, selectedMinute, "AM");
            }}
            className={`rounded px-2 py-0.5 text-xs ${period === "AM" ? "bg-cyan-300/20 text-cyan-200" : "text-slate-300"}`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => {
              setPeriod("PM");
              applySelection(selectedHour, selectedMinute, "PM");
            }}
            className={`rounded px-2 py-0.5 text-xs ${period === "PM" ? "bg-cyan-300/20 text-cyan-200" : "text-slate-300"}`}
          >
            PM
          </button>
        </div>
      </div>

      <div className="relative mx-auto h-[220px] w-[220px]">
        <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30" />
        <div className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-300/30" />

        {Array.from({ length: 12 }, (_, i) => i + 1).map((hour, idx) => {
          const pos = getPointPosition(idx, 85);
          return (
            <button
              key={`h-${hour}`}
              type="button"
              onClick={() => {
                setSelectedHour(hour);
                applySelection(hour, selectedMinute, period);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-[10px] leading-none ${
                selectedHour === hour
                  ? "bg-cyan-300/25 text-cyan-100"
                  : "text-slate-300 hover:bg-white/10"
              }`}
              style={{ left: pos.x, top: pos.y }}
            >
              {hour}
            </button>
          );
        })}

        {minuteValues.map((minute, idx) => {
          const pos = getPointPosition(idx, 52);
          return (
            <button
              key={`m-${minute}`}
              type="button"
              onClick={() => {
                setSelectedMinute(minute);
                applySelection(selectedHour, minute, period);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-[10px] leading-none ${
                selectedMinute === minute
                  ? "bg-teal-300/25 text-teal-100"
                  : "text-slate-400 hover:bg-white/10"
              }`}
              style={{ left: pos.x, top: pos.y }}
            >
              {String(minute).padStart(2, "0")}
            </button>
          );
        })}

        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-xs text-slate-200">
          {formatTime(selectedHour, selectedMinute, period)}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-start gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={apply}
          className="rounded-md border border-cyan-300/40 bg-cyan-300/15 px-2.5 py-1 text-xs text-cyan-200 hover:bg-cyan-300/25"
        >
          Set Time
        </button>
      </div>
    </div>
  );
}
