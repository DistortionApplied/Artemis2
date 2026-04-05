"use client";

import { CREW_MEMBERS } from "./data";
import { getPhaseColor, getPhaseName, MissionPhase } from "./types";

interface MissionBriefingProps {
  onStartMission: () => void;
}

export function MissionBriefing({ onStartMission }: MissionBriefingProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-wider mb-2 text-cyan-400">
            ARTEMIS II
          </h1>
          <p className="text-2xl text-cyan-300/80">MISSION CONTROL CONSOLE SIMULATOR</p>
        </div>

        <div className="bg-neutral-900 border border-cyan-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-cyan-900 pb-4">
            MISSION BRIEFING
          </h2>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-cyan-300 mb-3">MISSION OVERVIEW</h3>
              <p className="text-neutral-300 leading-relaxed mb-4">
                Artemis II is the first crewed lunar mission since Apollo 17 in 1972. Four astronauts will
                launch aboard the Orion spacecraft, orbit the Moon, and return to Earth over approximately 10 days.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Your role is Flight Director at NASA Mission Control, Houston. You will monitor telemetry,
                approve critical burns, and guide the crew through each phase of the mission.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-cyan-300 mb-3">CREW</h3>
              <div className="space-y-2 text-neutral-300">
                {CREW_MEMBERS.map(member => (
                  <div key={member.id} className="flex justify-between">
                    <span className="font-semibold text-white">{member.name}</span>
                    <span>{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-800 rounded p-4">
              <p className="text-cyan-400 text-sm mb-1">LAUNCH DATE</p>
              <p className="text-white text-xl font-bold">April 1, 2026</p>
              <p className="text-neutral-400 text-sm">6:35 PM EDT</p>
            </div>
            <div className="bg-neutral-800 rounded p-4">
              <p className="text-cyan-400 text-sm mb-1">DURATION</p>
              <p className="text-white text-xl font-bold">~10 Days</p>
              <p className="text-neutral-400 text-sm">Approx. 220 hours</p>
            </div>
            <div className="bg-neutral-800 rounded p-4">
              <p className="text-cyan-400 text-sm mb-1">MAX DISTANCE</p>
              <p className="text-white text-xl font-bold">250,000+ mi</p>
              <p className="text-neutral-400 text-sm">From Earth</p>
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-6 mb-8">
            <h3 className="text-lg font-bold text-cyan-300 mb-4">KEY PHASES</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${getPhaseColor("launch_sequence")}`}></div>
                <p className="font-semibold">LAUNCH</p>
                <p className="text-neutral-400">T+0 to T+8</p>
              </div>
              <div className="text-center">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${getPhaseColor("high_earth_orbit")}`}></div>
                <p className="font-semibold">HIGH EARTH ORBIT</p>
                <p className="text-neutral-400">T+1 to T+8 hrs</p>
              </div>
              <div className="text-center">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${getPhaseColor("translunar_injection")}`}></div>
                <p className="font-semibold">TRANSLUNAR</p>
                <p className="text-neutral-400">T+25 hrs</p>
              </div>
              <div className="text-center">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${getPhaseColor("lunar_flyby")}`}></div>
                <p className="font-semibold">LUNAR FLYBY</p>
                <p className="text-neutral-400">Day 6</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/30 border border-amber-600 rounded p-4 mb-8">
            <h3 className="text-lg font-bold text-amber-400 mb-2">YOUR ROLE</h3>
            <p className="text-amber-200/80">
              As Flight Director, you must <span className="font-bold">APPROVE</span> critical mission events
              including trajectory correction burns and major milestones. Monitor all telemetry panels.
              Ensure crew safety throughout the mission. Click on events in the timeline to review details
              and provide approvals when required.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onStartMission}
            className="px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xl font-bold rounded transition-colors"
          >
            BEGIN MISSION
          </button>
        </div>
      </div>
    </div>
  );
}