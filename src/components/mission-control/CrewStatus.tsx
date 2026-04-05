import { CREW_MEMBERS } from "./data";

export function CrewStatus() {
  return (
    <div className="bg-neutral-800 rounded p-2 flex-1 overflow-hidden">
      <h3 className="text-xs font-bold text-cyan-400 mb-2 text-center">CREW</h3>
      <div className="space-y-1">
        {CREW_MEMBERS.map(member => (
          <div key={member.id} className="flex items-center justify-between text-xs p-1 bg-neutral-700 rounded">
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-white text-xs truncate block">{member.name.split(' ')[1]}</span>
              <span className="text-neutral-400 text-xs">{member.role.slice(0, 3).toUpperCase()}</span>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                member.status === "active" ? "bg-green-600 text-white" :
                member.status === "rest" ? "bg-blue-600 text-white" :
                member.status === "exercise" ? "bg-amber-600 text-white" :
                "bg-neutral-600 text-neutral-300"
              }`}>
                {member.status === "active" ? "ACT" :
                 member.status === "rest" ? "RST" :
                 member.status === "exercise" ? "EXC" :
                 "UNK"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}