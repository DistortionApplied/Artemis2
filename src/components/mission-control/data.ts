import { MissionEvent, CrewMember } from "./types";

export const MISSION_EVENTS: MissionEvent[] = [
  {
    id: "launch",
    time: "April 1, 2026 - 6:35 PM EDT",
    met: "T+00:00:00",
    title: "LAUNCH - Artemis II Liftoff",
    description: "SLS clears tower. Four RS-25 engines and twin SRBs ignite. Crew experiences 4G during ascent.",
    type: "milestone",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "roll_pitch",
    time: "T+00:00:07",
    met: "T+00:00:07",
    title: "Roll/Pitch Maneuver",
    description: "Roll and pitch maneuver to align trajectory.",
    type: "milestone",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "max_speed",
    time: "T+00:00:56",
    met: "T+00:00:56",
    title: "Maximum Speed",
    description: "Maximum speed achieved while still within the atmosphere.",
    type: "milestone",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "maxq",
    time: "T+00:01:12",
    met: "T+00:01:12",
    title: "Maximum Dynamic Pressure (Max-Q)",
    description: "Rocket passes through max-Q. Structural loads peak.",
    type: "milestone",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "boost_sep",
    time: "T+00:02:09",
    met: "T+00:02:09",
    title: "Solid Rocket Booster Separation",
    description: "Twin solid rocket boosters separate. Components will land in Atlantic Ocean.",
    type: "milestone",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "las_jettison",
    time: "T+00:03:13",
    met: "T+00:03:13",
    title: "Launch Abort System Jettison",
    description: "Launch abort system jettisoned.",
    type: "systems",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "meco",
    time: "T+00:08:02",
    met: "T+00:08:02",
    title: "Core Stage Main Engine Cutoff (MECO)",
    description: "Core stage main engines shut down. Orion and ICPS in initial elliptical orbit.",
    type: "milestone",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "core_sep",
    time: "T+00:08:14",
    met: "T+00:08:14",
    title: "Core Stage Separation",
    description: "Core stage separation from ICPS.",
    type: "milestone",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "solar_deploy",
    time: "T+00:08:20",
    met: "T+00:08:20",
    title: "Solar Array Deployment",
    description: "All four Orion solar array wings fully deployed. Spacecraft now self-sustaining.",
    type: "systems",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "perigee_raise",
    time: "Day 2",
    met: "T+24:00:00",
    title: "Perigee Raise Burn",
    description: "ICPS performs burn to raise perigee and stabilize orbit.",
    type: "burn",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "high_orbit",
    time: "T+1:47:57",
    met: "T+1:47:57",
    title: "Apogee Raise Burn - High Earth Orbit",
    description: "15-minute ICPS burn places Orion in high Earth orbit (70,000 km apogee).",
    type: "burn",
    status: "upcoming",
    outcome: "success"
  },
  {
    id: "prox_ops",
    time: "T+3:24:15",
    met: "T+3:24:15",
    title: "Proximity Operations (Prox Ops)",
    description: "CDR Victor Glover takes manual control of Orion for proximity operations demonstration around ICPS.",
    type: "crew",
    status: "upcoming",
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
    time: "T+4:10:51",
    met: "T+4:10:51",
    title: "TRANSLUNAR INJECTION (TLI)",
    description: "European Service Module main engine fires for 5 minutes 51 seconds. Delta-V: 1,272 fps. Commits to free-return trajectory.",
    type: "burn",
    status: "upcoming",
    playerAction: true
  },
  {
    id: "outbound_tc1",
    time: "T+48:00",
    met: "T+48:00",
    title: "Outbound Trajectory Correction 1",
    description: "First of three outbound trajectory correction burns. Jeremy Hansen prepares spacecraft.",
    type: "burn",
    status: "upcoming",
    playerAction: true
  },
  {
    id: "outbound_tc2",
    time: "T+72:00",
    met: "T+72:00",
    title: "Outbound Trajectory Correction 2",
    description: "Second trajectory correction burn to refine lunar approach.",
    type: "burn",
    status: "upcoming",
    playerAction: true
  },
  {
    id: "suit_demo",
    time: "Day 5",
    met: "T+96:00",
    title: "Orion Crew Survival System Suit Demo",
    description: "Crew tests suit pressurization, mobility, eating/drinking while suited.",
    type: "crew",
    status: "upcoming"
  },
  {
    id: "outbound_tc3",
    time: "T+108:00",
    met: "T+108:00",
    title: "Outbound Trajectory Correction 3",
    description: "Final outbound trajectory correction before lunar flyby.",
    type: "burn",
    status: "upcoming",
    playerAction: true
  },
  {
    id: "lunar_flyby",
    time: "Day 6 - April 7",
    met: "T+142:00",
    title: "LUNAR FLYBY - Closest Approach",
    description: "Orion passes within 4,000-6,000 miles of lunar surface. Crew surpasses Apollo 13 distance record (248,655 miles). Communications blackout ~41 minutes behind Moon.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "return_tc1",
    time: "T+144:00",
    met: "T+144:00",
    title: "Return Trajectory Correction 1",
    description: "First of three return trajectory correction burns.",
    type: "burn",
    status: "upcoming",
    playerAction: true
  },
  {
    id: "radiation_shelter",
    time: "Day 8",
    met: "T+168:00",
    title: "Radiation Shelter Demonstration",
    description: "Crew tests emergency radiation shelter setup for solar particle events.",
    type: "crew",
    status: "upcoming"
  },
  {
    id: "manual_pilot_demo",
    time: "Day 8",
    met: "T+172:00",
    title: "Manual Piloting Demonstration",
    description: "Crew practices manual control modes for future mission proficiency.",
    type: "crew",
    status: "upcoming"
  },
  {
    id: "return_tc2",
    time: "T+192:00",
    met: "T+192:00",
    title: "Return Trajectory Correction 2",
    description: "Second return trajectory correction burn.",
    type: "burn",
    status: "upcoming",
    playerAction: true
  },
  {
    id: "entry_prep",
    time: "Day 10",
    met: "T+216:00",
    title: "Entry Preparation",
    description: "Crew restores cabin, reinstalls seats, dons suits for reentry.",
    type: "systems",
    status: "upcoming"
  },
  {
    id: "service_module_sep",
    time: "Day 10",
    met: "T+223:00",
    title: "Service Module Separation",
    description: "European Service Module separates. Crew module oriented for reentry.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "reentry",
    time: "Day 10",
    met: "T+223:20",
    title: "EARTH REENTRY",
    description: "Crew module enters atmosphere at 25,000 mph. Peak heating 3,000°F. Plasma blackout ~4 minutes.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "drogue_deploy",
    time: "Day 10",
    met: "T+223:35",
    title: "Drogue Parachute Deployment",
    description: "Two 23-foot drogues deploy at 25,000 ft. Slows capsule to 307 mph.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "main_deploy",
    time: "Day 10",
    met: "T+223:40",
    title: "Main Parachute Deployment",
    description: "Three 116-foot main parachutes deploy at 9,500 ft.",
    type: "milestone",
    status: "upcoming"
  },
  {
    id: "splashdown",
    time: "Day 10 - April 11",
    met: "T+224:00",
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