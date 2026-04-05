import { CommMessage } from "./types";

interface CommunicationsLogProps {
  commLog: CommMessage[];
}

export function CommunicationsLog({ commLog }: CommunicationsLogProps) {
  // Show only the last 10 messages to keep it compact
  const displayMessages = commLog.slice(-10);

  return (
    <div className="bg-neutral-800 rounded p-2 flex-1 overflow-hidden">
      <h3 className="text-xs font-bold text-cyan-400 mb-2 text-center">COMM LOG</h3>
      <div className="flex-1 overflow-y-auto text-xs space-y-0.5">
        {displayMessages.length === 0 ? (
          <p className="text-neutral-500 text-center py-4">No communications</p>
        ) : (
          displayMessages.map(msg => (
            <div key={msg.id} className={`p-1 rounded text-xs ${
              msg.type === "alert" ? "bg-red-900/30" :
              msg.type === "approval_request" ? "bg-amber-900/30" :
              msg.type === "crew_report" ? "bg-blue-900/30" :
              msg.type === "system" ? "bg-neutral-700/50" :
              "bg-neutral-800/50"
            }`}>
              <div className="flex items-center gap-1">
                <span className="text-neutral-500 font-mono text-xs flex-shrink-0">
                  {msg.time}
                </span>
                <span className={`font-bold text-xs flex-shrink-0 ${
                  msg.from === "CAPCOM" ? "text-green-400" :
                  msg.from === "CDR" ? "text-cyan-400" :
                  msg.from === "PLT" ? "text-blue-400" :
                  msg.from === "MS1" ? "text-purple-400" :
                  msg.from === "MS2" ? "text-pink-400" :
                  "text-neutral-400"
                }`}>
                  {msg.from}:
                </span>
                <span className="text-neutral-300 text-xs truncate">
                  {msg.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}