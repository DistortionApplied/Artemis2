import { MissionEvent, parseMET } from "./types";

interface MissionTimelineProps {
  events: MissionEvent[];
  selectedEvent: MissionEvent | null;
  missionTime: number;
  onEventSelect: (event: MissionEvent | null) => void;
  onBurnApprove: (eventId: string) => void;
  onBurnHold: (eventId: string, eventTitle: string) => void;
}

export function MissionTimeline({ events, selectedEvent, missionTime, onEventSelect, onBurnApprove, onBurnHold }: MissionTimelineProps) {
  const totalMissionTime = 806400; // Splashdown at ~224 hours in seconds
  const progressPercent = Math.min((missionTime / totalMissionTime) * 100, 100);

  // Show all events sorted chronologically by MET time
  const keyEvents = [...events].sort((a, b) => {
    const aTime = parseMET(a.met);
    const bTime = parseMET(b.met);
    return aTime - bTime;
  });

  return (
    <div className="bg-neutral-800 rounded p-2 flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-cyan-400">MISSION TIMELINE</h3>
        <span className="text-xs text-neutral-400">
          {Math.floor(progressPercent)}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2 bg-neutral-600 rounded">
          <div
            className="h-2 bg-cyan-500 rounded transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-neutral-500 mt-1">
          <span>T+0</span>
          <span>T+{Math.floor(missionTime / 3600)}:{Math.floor((missionTime % 3600) / 60).toString().padStart(2, '0')}</span>
          <span>T+224</span>
        </div>
      </div>

      {/* Timeline Events - Horizontal Scrolling */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {keyEvents.map((event) => (
            <div key={event.id} className="flex-shrink-0">
              {/* Event Card */}
              <button
                onClick={() => onEventSelect(event)}
                className={`w-28 h-20 p-2 rounded text-xs transition-all hover:scale-105 ${
                  event.status === "completed"
                    ? "bg-green-900/50 border border-green-800"
                    : event.status === "current"
                    ? "bg-cyan-900/50 border-2 border-cyan-600"
                    : event.status === "pending_approval"
                    ? "bg-amber-900/50 border-2 border-amber-600"
                    : "bg-neutral-700 border border-neutral-600"
                } ${event.playerAction ? "ring-1 ring-amber-400" : ""}`}
              >
                <div className="text-center h-full flex flex-col justify-between">
                  <div className={`font-bold text-xs leading-tight ${
                    event.status === "completed" ? "text-green-400" :
                    event.status === "current" ? "text-cyan-400" :
                    event.status === "pending_approval" ? "text-amber-400" :
                    "text-neutral-300"
                  }`}>
                    {event.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                  <div className="text-neutral-500 font-mono text-xs">
                    {event.met}
                  </div>
                  <div className={`text-xs px-1 py-0.5 rounded ${
                    event.status === "completed" ? "bg-green-800/50" :
                    event.status === "current" ? "bg-cyan-800/50" :
                    event.status === "pending_approval" ? "bg-amber-800/50" :
                    "bg-neutral-600/50"
                  }`}>
                    {event.status === "pending_approval" ? "PENDING" :
                     event.status === "current" ? "CURRENT" :
                     event.status.toUpperCase()}
                  </div>
                </div>
              </button>

              {/* Action buttons for pending events */}
              {event.status === "pending_approval" && event.playerAction && (
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={() => onBurnApprove(event.id)}
                    className="flex-1 px-1 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-bold"
                  >
                    APPROVE
                  </button>
                  <button
                    onClick={() => onBurnHold(event.id, event.title)}
                    className="flex-1 px-1 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold"
                  >
                    HOLD
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Event Detail */}
      {selectedEvent && (
        <div className="border-t border-neutral-700 pt-2 mt-2">
          <div className="text-xs">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-cyan-300 truncate">{selectedEvent.title}</span>
              <span className="text-neutral-500 font-mono text-xs">{selectedEvent.met}</span>
            </div>
            <p className="text-neutral-400 text-xs line-clamp-2 mb-1">{selectedEvent.description}</p>
            <div className="flex gap-1">
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                selectedEvent.type === "burn" ? "bg-orange-900/50 text-orange-400" :
                selectedEvent.type === "milestone" ? "bg-green-900/50 text-green-400" :
                selectedEvent.type === "crew" ? "bg-blue-900/50 text-blue-400" :
                selectedEvent.type === "systems" ? "bg-purple-900/50 text-purple-400" :
                "bg-neutral-700 text-neutral-300"
              }`}>
                {selectedEvent.type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}