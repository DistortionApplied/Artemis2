import { Telemetry } from "./types";

interface OrbitalViewProps {
  telemetry: Telemetry;
}

export function OrbitalView({ telemetry }: OrbitalViewProps) {
  return (
    <div className="bg-neutral-800 rounded p-2 flex-1 overflow-hidden">
      <h3 className="text-xs font-bold text-cyan-400 mb-1 text-center">ORBIT</h3>

      {/* Compact orbital visualization */}
      <div className="relative h-20 bg-neutral-900 rounded overflow-hidden mb-2">
        <div className="absolute inset-0 flex items-center justify-center">
          {telemetry.distanceFromEarth > 300000 ? (
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mx-auto"></div>
              <p className="text-xs text-cyan-400 mt-1">MOON</p>
            </div>
          ) : telemetry.distanceFromEarth > 10000 ? (
            <div className="text-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mx-auto"></div>
              <p className="text-xs text-cyan-400 mt-1">SPACE</p>
            </div>
          ) : telemetry.distanceFromEarth > 1000 ? (
            <div className="text-center">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mx-auto"></div>
              <p className="text-xs text-cyan-400 mt-1">ORBIT</p>
            </div>
          ) : telemetry.altitude > 100 ? (
            <div className="text-center">
              <div className="w-1 h-1 rounded-full bg-green-400 mx-auto"></div>
              <p className="text-xs text-green-400 mt-1">↑</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs text-amber-400">GND</p>
            </div>
          )}
        </div>

        {/* Simple progress bar */}
        <div className="absolute bottom-1 left-1 right-1">
          <div className="h-0.5 bg-neutral-700 rounded">
            <div
              className="h-0.5 bg-cyan-500 rounded transition-all duration-300"
              style={{ width: `${Math.min(100, (telemetry.distanceFromEarth / 400000) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mission phase indicator */}
      <div className="text-center">
        <p className="text-xs text-neutral-400">
          {telemetry.distanceFromEarth > 300000 ? "Lunar Transit" :
           telemetry.distanceFromEarth > 10000 ? "Deep Space" :
           telemetry.distanceFromEarth > 1000 ? "Earth Orbit" :
           telemetry.altitude > 50 ? "Low Orbit" : "Ground"}
        </p>
      </div>
    </div>
  );
}