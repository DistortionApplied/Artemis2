"use client";

import { useState } from "react";
import { MissionEvent, MissionPhase, getPhaseColor, getPhaseName } from "./types";
import { TelemetryPanel } from "./TelemetryPanel";
import { MissionTimeline } from "./MissionTimeline";
import { CommunicationsLog } from "./CommunicationsLog";
import { CrewStatus } from "./CrewStatus";
import { OrbitalView } from "./OrbitalView";
import { ApolloComparison } from "./ApolloComparison";

interface MissionControlProps {
  missionTime: number;
  telemetry: any;
  currentPhase: MissionPhase;
  events: MissionEvent[];
  commLog: any[];
  gameSpeed: number;
  selectedEvent: MissionEvent | null;
  onGameSpeedChange: (speed: number) => void;
  onEventSelect: (event: MissionEvent | null) => void;
  onBurnApprove: (eventId: string) => void;
  onBurnHold: (eventId: string, eventTitle: string) => void;
  formatTime: (seconds: number) => string;
}

export function MissionControl({
  missionTime,
  telemetry,
  currentPhase,
  events,
  commLog,
  gameSpeed,
  selectedEvent,
  onGameSpeedChange,
  onEventSelect,
  onBurnApprove,
  onBurnHold,
  formatTime
}: MissionControlProps) {
  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col overflow-hidden">
      {/* Compact Header */}
      <header className="bg-neutral-900 border-b border-cyan-900 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold tracking-wider text-cyan-400">ARTEMIS II</h1>
              <div className={`px-3 py-0.5 rounded text-xs font-bold ${getPhaseColor(currentPhase)}`}>
                {getPhaseName(currentPhase)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-neutral-400">MISSION TIME</p>
              <p className="text-lg font-mono font-bold text-cyan-400">
                {formatTime(missionTime)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">SPEED:</span>
              {[1, 5, 10, 60].map(speed => (
                <button
                  key={speed}
                  onClick={() => onGameSpeedChange(speed)}
                  className={`px-2 py-1 text-xs rounded ${gameSpeed === speed ? "bg-cyan-600" : "bg-neutral-700"}`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - No scrolling needed */}
      <div className="flex-1 grid grid-cols-4 gap-1 p-1 overflow-hidden">
        {/* Left Panel - Telemetry */}
        <div className="flex flex-col gap-1">
          <TelemetryPanel telemetry={telemetry} />
        </div>

        {/* Center Panel - Timeline */}
        <div className="col-span-2 flex flex-col gap-1">
          <MissionTimeline
            events={events}
            selectedEvent={selectedEvent}
            onEventSelect={onEventSelect}
            onBurnApprove={onBurnApprove}
            onBurnHold={onBurnHold}
          />
        </div>

        {/* Right Panel - Communications, Crew/Orbital & Apollo Comparison */}
        <div className="flex flex-col gap-1">
          <CommunicationsLog commLog={commLog} />
          <div className="flex gap-1 flex-1">
            <CrewStatus />
            <OrbitalView telemetry={telemetry} />
          </div>
          <ApolloComparison />
        </div>
      </div>

      {/* Compact Footer */}
      <footer className="bg-neutral-900 border-t border-cyan-900 px-4 py-1 flex-shrink-0">
        <div className="flex justify-center text-xs text-neutral-500">
          <span>NASA MISSION CONTROL - ARTEMIS II - ORION &quot;INTEGRITY&quot;</span>
        </div>
      </footer>
    </div>
  );
}