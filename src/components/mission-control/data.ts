import { MissionEvent, CrewMember } from "./types";

export const MISSION_EVENTS: MissionEvent[] = [
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

export const CREW_MEMBERS: CrewMember[] = [
  { id: "cdr", name: "Reid Wiseman", role: "Commander", position: "Forward", status: "active", heartRate: 72 },
  { id: "plt", name: "Victor Glover", role: "Pilot", position: "Mid Deck", status: "active", heartRate: 68 },
  { id: "ms1", name: "Christina Koch", role: "Mission Specialist", position: "Mid Deck", status: "active", heartRate: 65 },
  { id: "ms2", name: "Jeremy Hansen", role: "Mission Specialist", position: "Mid Deck", status: "active", heartRate: 70 }
];