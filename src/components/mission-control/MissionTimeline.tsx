import { MissionEvent } from "./types";

interface MissionTimelineProps {
  events: MissionEvent[];
  selectedEvent: MissionEvent | null;
  onEventSelect: (event: MissionEvent | null) => void;
  onBurnApprove: (eventId: string) => void;
  onBurnHold: (eventId: string, eventTitle: string) => void;
}

export function MissionTimeline({ events, selectedEvent, onEventSelect, onBurnApprove, onBurnHold }: MissionTimelineProps) {
  const completedCount = events.filter(e => e.status === "completed").length;
  const totalEvents = events.length;

  // Get key events to display on timeline
  const keyEvents = events.filter(event =>
    event.status === "completed" ||
    event.status === "current" ||
    event.status === "pending_approval"
  );

  return (
    <div className="bg-neutral-800 rounded p-2 flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-cyan-400">MISSION TIMELINE</h3>
        <span className="text-xs text-neutral-400">
          {completedCount}/{totalEvents}
        </span>
      </div>

      {/* Horizontal Timeline */}
      <div className="flex-1 relative">
        {/* Timeline progress bar */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-neutral-600">
          <div
            className="h-0.5 bg-cyan-500 transition-all duration-500"
            style={{ width: `${(completedCount / totalEvents) * 100}%` }}
          ></div>
        </div>

        {/* Timeline events - horizontal scrolling */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-8">
          {keyEvents.map((event, index) => (
            <div key={event.id} className="flex-shrink-0 relative">
              {/* Timeline dot */}
              <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full border-2 ${
                event.status === "completed"
                  ? "bg-green-500 border-green-400"
                  : event.status === "current"
                  ? "bg-cyan-500 border-cyan-400 animate-pulse"
                  : event.status === "pending_approval"
                  ? "bg-amber-500 border-amber-400"
                  : "bg-neutral-600 border-neutral-500"
              }`} />

              {/* Event card */}
              <button
                onClick={() => onEventSelect(event)}
                className={`w-24 h-16 p-1 rounded text-xs transition-all hover:scale-105 ${
                  event.status === "completed"
                    ? "bg-green-900/50 border border-green-800"
                    : event.status === "current"
                    ? "bg-cyan-900/50 border-2 border-cyan-600"
                    : event.status === "pending_approval"
                    ? "bg-amber-900/50 border-2 border-amber-600"
                    : "bg-neutral-700 border border-neutral-600"
                } ${event.playerAction ? "ring-1 ring-amber-400" : ""}`}
              >
                <div className="text-center">
                  <div className={`font-bold text-xs leading-tight ${
                    event.status === "completed" ? "text-green-400" :
                    event.status === "current" ? "text-cyan-400" :
                    event.status === "pending_approval" ? "text-amber-400" :
                    "text-neutral-300"
                  }`}>
                    {event.title.split(' ')[0]}
                  </div>
                  <div className="text-neutral-500 font-mono text-xs mt-0.5">
                    {event.met}
                  </div>
                </div>
              </button>

              {/* Action buttons for pending events */}
              {event.status === "pending_approval" && event.playerAction && (
                <div className="flex gap-0.5 mt-1">
                  <button
                    onClick={() => onBurnApprove(event.id)}
                    className="flex-1 px-1 py-0.5 bg-green-600 hover:bg-green-500 rounded text-xs font-bold"
                  >
                    GO
                  </button>
                  <button
                    onClick={() => onBurnHold(event.id, event.title)}
                    className="flex-1 px-1 py-0.5 bg-red-600 hover:bg-red-500 rounded text-xs font-bold"
                  >
                    HOLD
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Event Detail - Compact */}
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