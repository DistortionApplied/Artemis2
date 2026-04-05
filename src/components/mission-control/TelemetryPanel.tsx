import { Telemetry } from "./types";

interface TelemetryPanelProps {
  telemetry: Telemetry;
}

export function TelemetryPanel({ telemetry }: TelemetryPanelProps) {
  return (
    <div className="bg-neutral-800 rounded p-2 flex-1 overflow-hidden">
      <h3 className="text-xs font-bold text-cyan-400 mb-2 text-center">TELEMETRY</h3>

      {/* Primary Telemetry - Compact */}
      <div className="space-y-1 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-neutral-400">ALT:</span>
          <span className="font-mono text-cyan-300">{telemetry.altitude.toFixed(0)}km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">VEL:</span>
          <span className="font-mono text-cyan-300">{telemetry.velocity.toFixed(0)}m/s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">G:</span>
          <span className={`font-mono ${telemetry.gForce > 4 ? "text-red-400" : "text-cyan-300"}`}>
            {telemetry.gForce.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Distance */}
      <div className="space-y-1 text-xs mb-3 border-t border-neutral-700 pt-2">
        <div className="flex justify-between">
          <span className="text-neutral-400">EARTH:</span>
          <span className="font-mono text-cyan-300">{telemetry.distanceFromEarth.toFixed(0)}km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">MOON:</span>
          <span className="font-mono text-cyan-300">{telemetry.distanceFromMoon.toFixed(0)}km</span>
        </div>
      </div>

      {/* Systems Status - Compact */}
      <div className="space-y-1 text-xs mb-3 border-t border-neutral-700 pt-2">
        <div className="flex justify-between">
          <span className="text-neutral-400">FUEL:</span>
          <span className={`font-mono ${telemetry.fuelPercent < 30 ? "text-amber-400" : "text-cyan-300"}`}>
            {telemetry.fuelPercent.toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">PWR:</span>
          <span className={`font-mono ${telemetry.powerLevel < 50 ? "text-amber-400" : "text-cyan-300"}`}>
            {telemetry.powerLevel.toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">SOLAR:</span>
          <span className={`font-mono ${telemetry.solarArrayStatus === "deployed" ? "text-green-400" : "text-amber-400"}`}>
            {telemetry.solarArrayStatus === "deployed" ? "OK" : "ERR"}
          </span>
        </div>
      </div>

      {/* Environment */}
      <div className="space-y-1 text-xs border-t border-neutral-700 pt-2">
        <div className="flex justify-between">
          <span className="text-neutral-400">TEMP:</span>
          <span className="font-mono text-cyan-300">{telemetry.cabinTemp.toFixed(0)}°F</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">CO2:</span>
          <span className="font-mono text-cyan-300">{telemetry.co2Level.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">COMM:</span>
          <span className={`font-mono ${telemetry.commSignalStrength < 50 ? "text-amber-400" : "text-green-400"}`}>
            {telemetry.commSignalStrength.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}