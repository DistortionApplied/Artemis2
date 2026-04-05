"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Telemetry {
  time: string;
  missionElapsedTime: string;
  altitude: number;
  velocity: number;
  distanceFromEarth: number;
  distanceFromMoon: number;
  fuelPercent: number;
  powerLevel: number;
  cabinPressure: number;
  cabinTemp: number;
  co2Level: number;
  radiation: number;
  crewStatus: "nominal" | "warning" | "critical";
  batteryLevel: number;
  solarArrayStatus: "deployed" | "deploying" | "error";
  commSignalStrength: number;
  gForce: number;
}

interface MissionEvent {
  id: string;
  time: string;
  met: string;
  title: string;
  description: string;
  type: "milestone" | "burn" | "communication" | "systems" | "crew" | "decision";
  status: "completed" | "current" | "upcoming" | "pending_approval";
  playerAction?: boolean;
  approved?: boolean;
  outcome?: "success" | "warning" | "critical";
}

interface CommMessage {
  id: string;
  time: string;
  from: "CAPCOM" | "CDR" | "PLT" | "MS1" | "MS2" | "SYSTEM";
  message: string;
  type: "info" | "alert" | "approval_request" | "crew_report" | "system";
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  position: string;
  status: "rest" | "active" | "exercise" | "sleep";
  heartRate: number;
}

type MissionPhase =
  | "prelaunch"
  | "launch_sequence"
  | "ascent"
  | "initial_orbit"
  | "high_earth_orbit"
  | "proximity_ops"
  | "translunar_injection"
  | "outbound_transit"
  | "lunar_flyby"
  | "return_transit"
  | "crew_module_separation"
  | "reentry"
  | "parachute_deploy"
  | "splashdown";

const MISSION_START_DATE = new Date("2026-04-01T22:35:00Z");

const MISSION_EVENTS: MissionEvent[] = [
  {
    id: "launch",
    time: "April 1, 2026 - 6:35 PM EDT",
    met: "T+0:00",
    title: "LAUNCH - Artemis II Liftoff",
    description: "SLS clears tower. Four RS-25 engines and twin SRBs ignite. Crew experiences 4G during ascent.",
    type: "milestone",
    status: "completed",
    outcome: "success"
  },
  {
    id: "maxq",
    time: "T+0:56",
    met: "T+0:56",
    title: "Maximum Dynamic Pressure",
    description: "Rocket passes through max-Q. Structural loads peak at 56 seconds into flight.",
    type: "milestone",
    status: "completed",
    outcome: "success"
  },
  {
    id: "boost_sep",
    time: "T+2:09",
    met: "T+2:09",
    title: "Booster Separation",
    description: "Twin solid rocket boosters separate at 30 miles altitude. Components will land in Atlantic Ocean.",
    type: "milestone",
    status: "completed",
    outcome: "success"
  },
  {
    id: "meco",
    time: "T+8:02",
    met: "T+8:02",
    title: "Main Engine Cutoff (MECO)",
    description: "Core stage main engines shut down. Orion and ICPS in initial elliptical orbit.",
    type: "milestone",
    status: "completed",
    outcome: "success"
  },
  {
    id: "solar_deploy",
    time: "T+0:49",
    met: "T+0:49",
    title: "Solar Array Deployment",
    description: "All four Orion solar array wings fully deployed. Spacecraft now self-sustaining.",
    type: "systems",
    status: "completed",
    outcome: "success"
  },
  {
    id: "perigee_raise",
    time: "T+49:00",
    met: "T+49:00",
    title: "Perigee Raise Burn",
    description: "ICPS performs 43-second burn to raise perigee to stable orbit altitude.",
    type: "burn",
    status: "completed",
    approved: true,
    outcome: "success"
  },
  {
    id: "high_orbit",
    time: "T+1:47:57",
    met: "T+1:47:57",
    title: "Apogee Raise Burn - High Earth Orbit",
    description: "15-minute ICPS burn places Orion in high Earth orbit (70,000 km apogee).",
    type: "burn",
    status: "completed",
    approved: true,
    outcome: "success"
  },
  {
    id: "prox_ops",
    time: "T+3:24:15",
    met: "T+3:24:15",
    title: "Proximity Operations (Prox Ops)",
    description: "CDR Victor Glover takes manual control of Orion for proximity operations demonstration around ICPS.",
    type: "crew",
    status: "current",
    playerAction: true
  },
  {
    id: "rest_cycle_1",
    time: "T+8:30",
    met: "T+8:30",
    title: "First Rest Cycle",
    description: "Crew rests for approximately 4 hours while flight controllers monitor systems.",
    type: "crew",
    status: "upcoming"
  },
  {
    id: "tli_prep",
    time: "T+12:00",
    met: "T+12:00",
    title: "Translunar Injection Preparation",
    description: "Crew woken, systems checked for TLI burn. MS1 Christina Koch prepares main engine.",
    type: "systems",
    status: "upcoming"
  },
  {
    id: "tli",
    time: "T+25:14",
    met: "T+25:14",
    title: "TRANSLUNAR INJECTION (TLI)",
    description: "European Service Module main engine fires for 5 minutes 51 seconds. Delta-V: 1,272 fps. Commits to free-return trajectory.",
    type: "burn",
    status: "pending_approval",
    playerAction: true
  },
  {
    id: "outbound_tc1",
    time: "Day 3",
    met: "T+~48:00",
    title: "Outbound Trajectory Correction 1",
    description: "First of three outbound trajectory correction burns. Jeremy Hansen prepares spacecraft.",
    type: "burn",
    status: "pending_approval",
    playerAction: true
  },
  {
    id: "outbound_tc2",
    time: "Day 4",
    met: "T+~72:00",
    title: "Outbound Trajectory Correction 2",
    description: "Second trajectory correction burn to refine lunar approach.",
    type: "burn",
    status: "pending_approval",
    playerAction: true
  },
  {
    id: "suit_demo",
    time: "Day 5",
    met: "T+~96:00",
    title: "Orion Crew Survival System Suit Demo",
    description: "Crew tests suit pressurization, mobility, eating/drinking while suited.",
    type: "crew",
    status: "upcoming"
  },
  {
    id: "outbound_tc3",
    time: "Day 5 PM",
    met: "T+~100:00",
    title: "Outbound Trajectory Correction 3",
    description: "Final outbound trajectory correction before lunar flyby.",
    type: "burn",
    status: "pending_approval",
    playerAction: true
  },
  {
    id: "lunar_flyby",
    time: "Day 6 - April 6",
    met: "T+~120:00",
    title: "LUNAR FLYBY - Closest Approach",
    description: "Orion passes within 4,000-6,000 miles of lunar surface. Crew surpasses Apollo 13 distance record (248,655 miles). Communications blackout ~41 minutes behind Moon.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "return_tc1",
    time: "Day 7",
    met: "T+~144:00",
    title: "Return Trajectory Correction 1",
    description: "First of three return trajectory correction burns.",
    type: "burn",
    status: "pending_approval",
    playerAction: true
  },
  {
    id: "radiation_shelter",
    time: "Day 8",
    met: "T+~168:00",
    title: "Radiation Shelter Demonstration",
    description: "Crew tests emergency radiation shelter setup for solar particle events.",
    type: "crew",
    status: "upcoming"
  },
  {
    id: "manual_pilot_demo",
    time: "Day 8",
    met: "T+~172:00",
    title: "Manual Piloting Demonstration",
    description: "Crew practices manual control modes for future mission proficiency.",
    type: "crew",
    status: "upcoming"
  },
  {
    id: "return_tc2",
    time: "Day 9",
    met: "T+~192:00",
    title: "Return Trajectory Correction 2",
    description: "Second return trajectory correction burn.",
    type: "burn",
    status: "pending_approval",
    playerAction: true
  },
  {
    id: "entry_prep",
    time: "Day 10",
    met: "T+~210:00",
    title: "Entry Preparation",
    description: "Crew restores cabin, reinstalls seats, dons suits for reentry.",
    type: "systems",
    status: "upcoming"
  },
  {
    id: "service_module_sep",
    time: "Day 10",
    met: "T+~219:00",
    title: "Service Module Separation",
    description: "European Service Module separates. Crew module oriented for reentry.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "reentry",
    time: "Day 10",
    met: "T+~219:20",
    title: "EARTH REENTRY",
    description: "Crew module enters atmosphere at 25,000 mph. Peak heating 3,000°F. Plasma blackout ~4 minutes.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "drogue_deploy",
    time: "Day 10",
    met: "T+~219:35",
    title: "Drogue Parachute Deployment",
    description: "Two 23-foot drogues deploy at 25,000 ft. Slows capsule to 307 mph.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "main_deploy",
    time: "Day 10",
    met: "T+~219:40",
    title: "Main Parachute Deployment",
    description: "Three 116-foot main parachutes deploy at 9,500 ft.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "splashdown",
    time: "Day 10 - April 10",
    met: "T+~220:00",
    title: "MISSION SUCCESS - SPLASHDOWN",
    description: "Orion splashes down in Pacific Ocean ~17 mph. Navy recovery team extracts crew.",
    type: "milestone",
    status: "upcoming"
  }
];

const INITIAL_TELEMETRY: Telemetry = {
  time: "2026-04-01 22:35:00 UTC",
  missionElapsedTime: "T-00:00:00",
  altitude: 0,
  velocity: 0,
  distanceFromEarth: 0,
  distanceFromMoon: 384400,
  fuelPercent: 100,
  powerLevel: 100,
  cabinPressure: 14.7,
  cabinTemp: 72,
  co2Level: 0.04,
  radiation: 0.3,
  crewStatus: "nominal",
  batteryLevel: 100,
  solarArrayStatus: "deployed",
  commSignalStrength: 100,
  gForce: 0
};

function formatTime(date: Date): string {
  return date.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

function formatMET(seconds: number): string {
  const totalMs = Math.floor(seconds * 1000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = Math.floor((totalMs % 1000) / 10); // Convert to centiseconds (hundredths of a second)
  return `T+${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

function interpolateTelemetry(missionTimeSeconds: number): Telemetry {
  const t = Math.max(0, missionTimeSeconds);

  if (t < 8) {
    const progress = t / 8;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: progress * 100,
      velocity: progress * 28000,
      gForce: 4 * Math.sin(progress * Math.PI)
    };
  }

  if (t < 60) {
    const progress = (t - 8) / 52;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: 100 + progress * 400,
      velocity: 28000 - progress * 5000,
      gForce: 4 * Math.max(0, 1 - progress * 2)
    };
  }

  if (t < 2940) {
    const progress = (t - 60) / 2880;
    const orbitAltitude = 500 + progress * 1700;
    const orbitVelocity = 23000 - progress * 3000;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: orbitAltitude,
      velocity: orbitVelocity,
      distanceFromEarth: 2250 + progress * 6750,
      gForce: 0
    };
  }

  if (t < 10200) {
    const progress = (t - 2940) / 7260;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: 2200,
      velocity: 20000,
      distanceFromEarth: 9000 + progress * 320000,
      distanceFromMoon: 384400 - progress * 230000,
      fuelPercent: 100 - progress * 15,
      gForce: 0
    };
  }

  if (t < 86400) {
    const progress = (t - 10200) / 76200;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: 0,
      velocity: 0,
      distanceFromEarth: 320000 + progress * 20000,
      distanceFromMoon: 154400 - progress * 10000,
      fuelPercent: 85 - progress * 10,
      gForce: 0
    };
  }

  if (t < 172800) {
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: 0,
      velocity: 0,
      distanceFromEarth: 340000,
      distanceFromMoon: 144400,
      fuelPercent: 75,
      gForce: 0
    };
  }

  if (t < 210000) {
    const progress = (t - 172800) / 37200;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: 0,
      velocity: 0,
      distanceFromEarth: 340000 - progress * 320000,
      distanceFromMoon: 144400 + progress * 240000,
      fuelPercent: 75 - progress * 15,
      gForce: 0
    };
  }

  if (t < 216000) {
    const progress = (t - 210000) / 6000;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: 400 - progress * 400,
      velocity: progress * 25000,
      distanceFromEarth: 20000 - progress * 20000,
      distanceFromMoon: 384400,
      fuelPercent: 60,
      gForce: 0
    };
  }

  if (t < 219000) {
    const progress = (t - 216000) / 3000;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: 400000 - progress * 400000,
      velocity: 25000,
      distanceFromEarth: 0,
      distanceFromMoon: 384400,
      fuelPercent: 60,
      gForce: 0
    };
  }

  if (t < 219600) {
    const progress = (t - 219000) / 600;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: 0,
      velocity: 25000 * (1 - progress * 0.98),
      distanceFromEarth: 0,
      distanceFromMoon: 384400,
      fuelPercent: 60,
      gForce: 6 * progress
    };
  }

  const progress = (t - 219600) / 600;
  return {
    ...INITIAL_TELEMETRY,
    time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
    missionElapsedTime: formatMET(t),
    altitude: 0,
    velocity: 500 * (1 - progress * 0.96),
    distanceFromEarth: 0,
    distanceFromMoon: 384400,
    fuelPercent: 60,
    gForce: 6 * Math.max(0, 1 - progress)
  };
}

function getMissionPhase(t: number): MissionPhase {
  if (t < 0) return "prelaunch";
  if (t < 8) return "launch_sequence";
  if (t < 60) return "ascent";
  if (t < 2940) return "initial_orbit";
  if (t < 10200) return "high_earth_orbit";
  if (t < 10200) return "proximity_ops";
  if (t < 10200) return "translunar_injection";
  if (t < 172800) return "outbound_transit";
  if (t < 210000) return "lunar_flyby";
  if (t < 216000) return "return_transit";
  if (t < 219000) return "crew_module_separation";
  if (t < 219600) return "reentry";
  if (t < 220000) return "parachute_deploy";
  return "splashdown";
}

function getPhaseName(phase: MissionPhase): string {
  const names: Record<MissionPhase, string> = {
    prelaunch: "PRELAUNCH COUNTDOWN",
    launch_sequence: "LAUNCH SEQUENCE",
    ascent: "ASCENT",
    initial_orbit: "INITIAL ORBIT",
    high_earth_orbit: "HIGH EARTH ORBIT",
    proximity_ops: "PROXIMITY OPERATIONS",
    translunar_injection: "TRANSLUNAR INJECTION",
    outbound_transit: "OUTBOUND TRANSIT",
    lunar_flyby: "LUNAR FLYBY",
    return_transit: "RETURN TRANSIT",
    crew_module_separation: "CREW MODULE SEPARATION",
    reentry: "EARTH REENTRY",
    parachute_deploy: "PARACHUTE DEPLOY",
    splashdown: "MISSION SUCCESS"
  };
  return names[phase];
}

function getPhaseColor(phase: MissionPhase): string {
  const colors: Record<MissionPhase, string> = {
    prelaunch: "bg-yellow-600",
    launch_sequence: "bg-orange-600",
    ascent: "bg-orange-500",
    initial_orbit: "bg-blue-600",
    high_earth_orbit: "bg-blue-500",
    proximity_ops: "bg-cyan-600",
    translunar_injection: "bg-green-600",
    outbound_transit: "bg-green-500",
    lunar_flyby: "bg-emerald-500",
    return_transit: "bg-teal-500",
    crew_module_separation: "bg-amber-600",
    reentry: "bg-red-600",
    parachute_deploy: "bg-red-500",
    splashdown: "bg-green-600"
  };
  return colors[phase];
}

export default function ArtemisIIControl() {
  const [gameStarted, setGameStarted] = useState(false);
  const [missionTime, setMissionTime] = useState(-600.0); // 10 minutes prelaunch countdown
  const [telemetry, setTelemetry] = useState<Telemetry>(INITIAL_TELEMETRY);
  const [currentPhase, setCurrentPhase] = useState<MissionPhase>("prelaunch");
  const [events, setEvents] = useState<MissionEvent[]>(MISSION_EVENTS);
  const [commLog, setCommLog] = useState<CommMessage[]>([]);
  const [pendingApproval, setPendingApproval] = useState<string | null>(null);
  const [showMissionBriefing, setShowMissionBriefing] = useState(true);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<MissionEvent | null>(null);

  function getPhasePhase(t: number): MissionPhase {
    if (t < 0) return "prelaunch";
    if (t < 8) return "launch_sequence";
    if (t < 60) return "ascent";
    if (t < 2940) return "initial_orbit";
    if (t < 10200) return "high_earth_orbit";
    if (t >= 10200 && t < 10300) return "proximity_ops";
    if (t >= 10300 && t < 172800) return "translunar_injection";
    if (t >= 172800 && t < 210000) return "outbound_transit";
    if (t >= 210000 && t < 216000) return "lunar_flyby";
    if (t >= 216000 && t < 219000) return "return_transit";
    if (t >= 219000 && t < 219600) return "crew_module_separation";
    if (t >= 219600 && t < 220000) return "reentry";
    if (t >= 220000 && t < 221000) return "parachute_deploy";
    return "splashdown";
  }

  const crew: CrewMember[] = [
    { id: "cdr", name: "Reid Wiseman", role: "Commander", position: "Forward", status: "active", heartRate: 72 },
    { id: "plt", name: "Victor Glover", role: "Pilot", position: "Mid Deck", status: "active", heartRate: 68 },
    { id: "ms1", name: "Christina Koch", role: "Mission Specialist", position: "Mid Deck", status: "active", heartRate: 65 },
    { id: "ms2", name: "Jeremy Hansen", role: "Mission Specialist", position: "Mid Deck", status: "active", heartRate: 70 }
  ];

  const missionTimeRef = useRef(missionTime);
  
  useEffect(() => {
    missionTimeRef.current = missionTime;
  }, [missionTime]);

  const addCommMessage = useCallback((from: CommMessage["from"], message: string, type: CommMessage["type"] = "info") => {
    const newMsg: CommMessage = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      time: formatMET(missionTimeRef.current),
      from,
      message,
      type
    };
    setCommLog(prev => [...prev.slice(-49), newMsg]);
  }, []);

  const approveBurn = useCallback((eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, status: "completed", approved: true, outcome: "success" as const } : e
    ));
    setPendingApproval(null);
    addCommMessage("CAPCOM", `Copy. Burn approved. We are go for ${events.find(e => e.id === eventId)?.title}.`, "info");
  }, [events, addCommMessage]);

  const startMission = useCallback(() => {
    setGameStarted(true);
    setShowMissionBriefing(false);
    addCommMessage("SYSTEM", "Artemis II Mission Control online. All stations report ready.", "system");
    addCommMessage("SYSTEM", "Crew ingress complete. Hatch secured.", "system");
  }, [addCommMessage]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setMissionTime(prev => {
        const newTime = prev + (gameSpeed * 0.1); // Add fractional seconds based on speed

        if (newTime >= 0 && prev < 0) {
          addCommMessage("CAPCOM", "All stations, we have liftoff at 6:35 PM EDT! Godspeed, Artemis II crew.", "info");
        }

        if (newTime >= 8 && prev < 8) {
          addCommMessage("CDR", "Copy, Houston. Main engines cut off confirmed. We're on orbit.", "crew_report");
          addCommMessage("CAPCOM", "Copy, Integrity. Congratulations on a beautiful ascent, crew.", "info");
        }

        if (newTime >= 2940 && prev < 2940) {
          addCommMessage("CAPCOM", "Orion, Houston. All systems nominal. You are go for high Earth orbit burn.", "info");
        }

        if (newTime >= 10200 && prev < 10200) {
          addCommMessage("CAPCOM", "Orion, Houston. TLI prep complete. We are tracking for burn approval at T+25:14.", "info");
        }

        if (newTime >= 10200 && newTime < 10210) {
          setPendingApproval("tli");
          addCommMessage("CAPCOM", "Orion, Houston. Requesting TLI burn approval. All systems are go.", "approval_request");
        }

        if (newTime >= 172800 && prev < 172800) {
          addCommMessage("SYSTEM", "Lunar sphere of influence entry. Moon's gravity now dominant.", "system");
        }

        if (newTime >= 210000 && prev < 210000) {
          addCommMessage("SYSTEM", "Lunar flyby complete. Returning to Earth. Distance record confirmed.", "system");
        }

        if (newTime >= 219000 && prev < 219000) {
          addCommMessage("CAPCOM", "Orion, Houston. We are go for service module separation.", "info");
        }

        if (newTime >= 219600 && prev < 219600) {
          addCommMessage("CDR", "Copy, Houston. All hands, brace for reentry.", "crew_report");
        }

        if (newTime >= 220000) {
          addCommMessage("SYSTEM", "SPLASHDOWN CONFIRMED. Welcome home, Artemis II.", "system");
          addCommMessage("CAPCOM", "Orion, Houston. Congratulations, crew. You have made history. Recovery teams inbound.", "info");
        }

        setTelemetry(interpolateTelemetry(newTime));
        setCurrentPhase(getPhasePhase(newTime));

        setEvents(events => events.map(e => {
          if (e.status === "pending_approval" && e.id !== pendingApproval) return e;
          return e;
        }));

        return newTime;
      });
    }, 100); // Back to 100ms for smoother millisecond updates

    return () => clearInterval(interval);
  }, [gameStarted, gameSpeed, addCommMessage, pendingApproval]);

  if (showMissionBriefing) {
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
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">CDR Reid Wiseman</span>
                    <span>Commander</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">CPT Victor Glover</span>
                    <span>Pilot</span>
                  </div>
                  <div className="flex justify justify-between">
                    <span className="font-semibold text-white">MS1 Christina Koch</span>
                    <span>Mission Specialist</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">MS2 Jeremy Hansen</span>
                    <span>Mission Specialist (CSA)</span>
                  </div>
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
                  <div className="w-4 h-4 rounded-full bg-orange-500 mx-auto mb-2"></div>
                  <p className="font-semibold">LAUNCH</p>
                  <p className="text-neutral-400">T+0 to T+8</p>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto mb-2"></div>
                  <p className="font-semibold">HIGH EARTH ORBIT</p>
                  <p className="text-neutral-400">T+1 to T+8 hrs</p>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-2"></div>
                  <p className="font-semibold">TRANSLUNAR</p>
                  <p className="text-neutral-400">T+25 hrs</p>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 mx-auto mb-2"></div>
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
              onClick={startMission}
              className="px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xl font-bold rounded transition-colors"
            >
              BEGIN MISSION
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="bg-neutral-900 border-b border-cyan-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-bold tracking-wider text-cyan-400">ARTEMIS II</h1>
              <p className="text-xs text-neutral-400">MISSION CONTROL CONSOLE</p>
            </div>
            <div className={`px-4 py-1 rounded ${getPhaseColor(currentPhase)}`}>
              <p className="text-sm font-bold">{getPhaseName(currentPhase)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs text-neutral-400">MISSION ELAPSED TIME</p>
              <p className="text-2xl font-mono font-bold text-cyan-400">
                {missionTime < 0 ? `T-${formatMET(Math.abs(missionTime)).replace("T+", "")}` : formatMET(missionTime)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-400">MISSION TIME</p>
              <p className="text-sm font-mono text-neutral-300">{telemetry.time}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">SPEED:</span>
            <button
              onClick={() => setGameSpeed(1)}
              className={`px-2 py-1 text-xs rounded ${gameSpeed === 1 ? "bg-cyan-600" : "bg-neutral-700"}`}
            >
              1x
            </button>
            <button
              onClick={() => setGameSpeed(5)}
              className={`px-2 py-1 text-xs rounded ${gameSpeed === 5 ? "bg-cyan-600" : "bg-neutral-700"}`}
            >
              5x
            </button>
            <button
              onClick={() => setGameSpeed(10)}
              className={`px-2 py-1 text-xs rounded ${gameSpeed === 10 ? "bg-cyan-600" : "bg-neutral-700"}`}
            >
              10x
            </button>
            <button
              onClick={() => setGameSpeed(60)}
              className={`px-2 py-1 text-xs rounded ${gameSpeed === 60 ? "bg-cyan-600" : "bg-neutral-700"}`}
            >
              60x
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-neutral-400">|</span>
            <span className="text-green-400">● NOMINAL</span>
            <span className="text-amber-400">● CAUTION</span>
            <span className="text-red-400">● CRITICAL</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-1 p-1 h-[calc(100vh-100px)]">
        <div className="col-span-3 bg-neutral-900 rounded p-2 overflow-auto">
          <div className="bg-neutral-800 rounded p-2 mb-2">
            <h3 className="text-xs font-bold text-cyan-400 mb-2">PRIMARY TELEMETRY</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">ALTITUDE:</span>
                <span className="font-mono text-cyan-300">{telemetry.altitude.toFixed(0)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">VELOCITY:</span>
                <span className="font-mono text-cyan-300">{telemetry.velocity.toFixed(0)} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">G-FORCE:</span>
                <span className={`font-mono ${telemetry.gForce > 4 ? "text-red-400" : "text-cyan-300"}`}>
                  {telemetry.gForce.toFixed(2)} G
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-2 mb-2">
            <h3 className="text-xs font-bold text-cyan-400 mb-2">DISTANCE</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">FROM EARTH:</span>
                <span className="font-mono text-cyan-300">{telemetry.distanceFromEarth.toFixed(0)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">FROM MOON:</span>
                <span className="font-mono text-cyan-300">{telemetry.distanceFromMoon.toFixed(0)} km</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-2 mb-2">
            <h3 className="text-xs font-bold text-cyan-400 mb-2">SPACECRAFT STATUS</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">FUEL:</span>
                <span className={`font-mono ${telemetry.fuelPercent < 30 ? "text-amber-400" : "text-cyan-300"}`}>
                  {telemetry.fuelPercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">POWER:</span>
                <span className={`font-mono ${telemetry.powerLevel < 50 ? "text-amber-400" : "text-cyan-300"}`}>
                  {telemetry.powerLevel.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">BATTERY:</span>
                <span className="font-mono text-cyan-300">{telemetry.batteryLevel.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">SOLAR ARRAY:</span>
                <span className={`font-mono ${telemetry.solarArrayStatus === "deployed" ? "text-green-400" : "text-amber-400"}`}>
                  {telemetry.solarArrayStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-2 mb-2">
            <h3 className="text-xs font-bold text-cyan-400 mb-2">CABIN ENVIRONMENT</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">PRESSURE:</span>
                <span className="font-mono text-cyan-300">{telemetry.cabinPressure.toFixed(1)} psia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">TEMPERATURE:</span>
                <span className="font-mono text-cyan-300">{telemetry.cabinTemp.toFixed(0)}°F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">CO2:</span>
                <span className="font-mono text-cyan-300">{telemetry.co2Level.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">RADIATION:</span>
                <span className={`font-mono ${telemetry.radiation > 1 ? "text-amber-400" : "text-cyan-300"}`}>
                  {telemetry.radiation.toFixed(1)} mrem/h
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-2">
            <h3 className="text-xs font-bold text-cyan-400 mb-2">COMMUNICATIONS</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">SIGNAL:</span>
                <span className={`font-mono ${telemetry.commSignalStrength < 50 ? "text-amber-400" : "text-green-400"}`}>
                  {telemetry.commSignalStrength.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">DSN:</span>
                <span className="font-mono text-green-400">LOCKED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 bg-neutral-900 rounded p-2 overflow-auto">
          <div className="bg-neutral-800 rounded p-3 mb-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-cyan-400">MISSION TIMELINE</h3>
              <span className="text-xs text-neutral-400">
                {events.filter(e => e.status === "completed").length}/{events.length} EVENTS
              </span>
            </div>
            <div className="space-y-1">
              {events.map(event => (
                <div key={event.id} className="space-y-1">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full text-left p-2 rounded text-xs transition-colors ${
                      event.status === "completed"
                        ? "bg-green-900/50 border border-green-800"
                        : event.status === "current"
                        ? "bg-cyan-900/50 border border-cyan-600"
                        : event.status === "pending_approval"
                        ? "bg-amber-900/50 border border-amber-600"
                        : "bg-neutral-800 border border-neutral-700"
                    } ${event.playerAction ? "border-l-4 border-l-amber-400" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-bold ${event.status === "completed" ? "text-green-400" : event.status === "current" ? "text-cyan-400" : event.status === "pending_approval" ? "text-amber-400" : "text-neutral-300"}`}>
                        {event.title}
                      </span>
                      <span className="text-neutral-500 font-mono">{event.met}</span>
                    </div>
                    <p className="text-neutral-500 mt-1 line-clamp-1">{event.description.slice(0, 60)}...</p>
                  </button>
                  {event.status === "pending_approval" && event.playerAction && (
                    <div className="flex gap-2 px-2">
                      <button
                        onClick={() => approveBurn(event.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-bold"
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => { addCommMessage("CAPCOM", `Hold on ${event.title}. Standby for further review.`, "alert"); setEvents(prev => prev.map(e => e.id === event.id ? {...e, status: "upcoming"} : e)); setPendingApproval(null); }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold"
                      >
                        HOLD
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-3">
            <h3 className="text-sm font-bold text-cyan-400 mb-2">SELECTED EVENT DETAIL</h3>
            {selectedEvent ? (
              <div className="text-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-cyan-300">{selectedEvent.title}</span>
                  <span className="text-neutral-500 font-mono">{selectedEvent.met}</span>
                </div>
                <p className="text-neutral-400 mb-2">{selectedEvent.description}</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    selectedEvent.type === "burn" ? "bg-orange-900/50 text-orange-400" :
                    selectedEvent.type === "milestone" ? "bg-green-900/50 text-green-400" :
                    selectedEvent.type === "crew" ? "bg-blue-900/50 text-blue-400" :
                    "bg-neutral-700 text-neutral-300"
                  }`}>
                    {selectedEvent.type.toUpperCase()}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    selectedEvent.status === "completed" ? "bg-green-900/50 text-green-400" :
                    selectedEvent.status === "current" ? "bg-cyan-900/50 text-cyan-400" :
                    selectedEvent.status === "pending_approval" ? "bg-amber-900/50 text-amber-400" :
                    "bg-neutral-700 text-neutral-400"
                  }`}>
                    {selectedEvent.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                {selectedEvent.playerAction && selectedEvent.status !== "completed" && (
                  <div className="mt-3 p-2 bg-amber-900/30 border border-amber-600 rounded">
                    <p className="text-amber-400 font-bold mb-1">ACTION REQUIRED</p>
                    <p className="text-amber-200/80">
                      This event requires Flight Director approval before proceeding.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-neutral-500 text-xs">Select an event from the timeline to view details.</p>
            )}
          </div>
        </div>

        <div className="col-span-4 bg-neutral-900 rounded p-2 overflow-auto">
          <div className="bg-neutral-800 rounded p-2 mb-2">
            <h3 className="text-xs font-bold text-cyan-400 mb-2">COMMUNICATIONS LOG</h3>
            <div className="h-48 overflow-auto text-xs space-y-1">
              {commLog.length === 0 ? (
                <p className="text-neutral-500">No communications yet.</p>
              ) : (
                commLog.map(msg => (
                  <div key={msg.id} className={`p-1 rounded ${
                    msg.type === "alert" ? "bg-red-900/50" :
                    msg.type === "approval_request" ? "bg-amber-900/50" :
                    msg.type === "crew_report" ? "bg-blue-900/50" :
                    msg.type === "system" ? "bg-neutral-700" :
                    "bg-neutral-800"
                  }`}>
                    <span className="text-neutral-500 font-mono">{msg.time}</span>
                    <span className={`mx-1 font-bold ${
                      msg.from === "CAPCOM" ? "text-green-400" :
                      msg.from === "CDR" ? "text-cyan-400" :
                      msg.from === "PLT" ? "text-blue-400" :
                      msg.from === "MS1" ? "text-purple-400" :
                      msg.from === "MS2" ? "text-pink-400" :
                      "text-neutral-400"
                    }`}>[{msg.from}]</span>
                    <span className="text-neutral-300">{msg.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-2 mb-2">
            <h3 className="text-xs font-bold text-cyan-400 mb-2">CREW STATUS</h3>
            <div className="space-y-2">
              {crew.map(member => (
                <div key={member.id} className="flex items-center justify-between text-xs p-1 bg-neutral-700 rounded">
                  <div>
                    <span className="font-bold text-white">{member.name}</span>
                    <span className="text-neutral-400 ml-2">{member.role}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      member.status === "active" ? "bg-green-900/50 text-green-400" :
                      member.status === "rest" ? "bg-blue-900/50 text-blue-400" :
                      member.status === "exercise" ? "bg-amber-900/50 text-amber-400" :
                      "bg-neutral-600 text-neutral-300"
                    }`}>
                      {member.status.toUpperCase()}
                    </span>
                    <span className="text-neutral-400 ml-2">{member.heartRate} BPM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-2">
            <h3 className="text-xs font-bold text-cyan-400 mb-2">ORBITAL VIEW</h3>
            <div className="relative h-48 bg-neutral-900 rounded overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {telemetry.distanceFromEarth > 300000 ? (
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-400 mx-auto mb-2"></div>
                    <p className="text-xs text-cyan-400">APPROACHING</p>
                    <p className="text-xs text-neutral-400">MOON</p>
                  </div>
                ) : telemetry.distanceFromEarth > 10000 ? (
                  <div className="text-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto mb-1"></div>
                    <p className="text-xs text-cyan-400">TRANSIT</p>
                  </div>
                ) : telemetry.distanceFromEarth > 1000 ? (
                  <div className="text-center">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mx-auto"></div>
                    <p className="text-xs text-cyan-400">ORBIT</p>
                  </div>
                ) : telemetry.altitude > 100 ? (
                  <div className="text-center">
                    <div className="w-1 h-1 rounded-full bg-green-400 mx-auto"></div>
                    <p className="text-xs text-green-400">ASCENT</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-amber-400">PRELAUNCH</p>
                  </div>
                )}
              </div>
              
              <div className="absolute top-2 left-2 text-xs">
                <p className="text-neutral-400">EARTH</p>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              
              {telemetry.distanceFromEarth > 200000 && (
                <div className="absolute top-2 right-2 text-xs">
                  <p className="text-neutral-400">MOON</p>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div>
                </div>
              )}
              
              <div className="absolute bottom-2 left-2 right-2">
                <div className="h-1 bg-neutral-700 rounded">
                  <div 
                    className="h-1 bg-cyan-500 rounded transition-all"
                    style={{ width: `${Math.min(100, (telemetry.distanceFromEarth / 400000) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {telemetry.distanceFromEarth > 300000 ? "LUNAR TRANSIT" : 
                   telemetry.distanceFromEarth > 10000 ? "DEEP SPACE" :
                   telemetry.distanceFromEarth > 1000 ? "HIGH EARTH ORBIT" :
                   telemetry.altitude > 50 ? "LOW EARTH ORBIT" : "GROUND"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-neutral-900 border-t border-cyan-900 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>NASA MISSION CONTROL - JOHNSON SPACE CENTER</span>
          <span>ARTEMIS II MISSION - ORION &quot;INTEGRITY&quot;</span>
          <span>FLIGHT DIRECTOR CONSOLE v1.0</span>
        </div>
      </footer>
    </div>
  );
}
