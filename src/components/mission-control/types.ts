export interface Telemetry {
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

  // Enhanced telemetry parameters
  // Attitude & Orientation
  pitch: number;        // degrees
  yaw: number;         // degrees
  roll: number;        // degrees

  // Propellant Systems
  mainEngineFuel: number;  // kg
  rcsFuel: number;         // kg
  oxidizerLevel: number;   // percent

  // Thermal Systems
  avionicsTemp: number;    // °F
  batteryTemp: number;     // °F
  exteriorTemp: number;    // °F

  // Orbital Parameters
  orbitalInclination: number;  // degrees
  eccentricity: number;        // dimensionless
  apoapsis: number;           // km
  periapsis: number;          // km

  // Communication Details
  downlinkRate: number;      // Mbps
  uplinkRate: number;        // Mbps
  signalQuality: number;     // percent

  // Power Systems
  solarCurrent: number;      // Amperes
  batteryChargeRate: number; // Ah
}

export interface MissionEvent {
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

export interface CommMessage {
  id: string;
  time: string;
  from: "CAPCOM" | "CDR" | "PLT" | "MS1" | "MS2" | "SYSTEM";
  message: string;
  type: "info" | "alert" | "approval_request" | "crew_report" | "system";
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  position: string;
  status: "rest" | "active" | "exercise" | "sleep";
  heartRate: number;
}

export type MissionPhase =
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

export const MISSION_START_DATE = new Date("2026-04-01T22:35:00Z");

export function formatTime(date: Date): string {
  return date.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

export function formatMET(seconds: number): string {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const totalMs = Math.floor(absSeconds * 1000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = Math.floor((totalMs % 1000) / 10);
  const sign = isNegative ? "-" : "+";
  return `T${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

export function interpolateTelemetry(missionTimeSeconds: number): Telemetry {
  const t = Math.max(0, missionTimeSeconds);

  if (t < 8) {
    const progress = t / 8;
    return {
      ...INITIAL_TELEMETRY,
      time: formatTime(new Date(MISSION_START_DATE.getTime() + t * 1000)),
      missionElapsedTime: formatMET(t),
      altitude: progress * 100,
      velocity: progress * 28000,
      gForce: 4 * Math.sin(progress * Math.PI),
      pitch: progress * 2,  // Slight pitch during launch
      yaw: 0,
      roll: 0,
      mainEngineFuel: INITIAL_TELEMETRY.mainEngineFuel - (progress * 2000), // Burning fuel
      avionicsTemp: INITIAL_TELEMETRY.avionicsTemp + (progress * 10), // Heating up
      exteriorTemp: INITIAL_TELEMETRY.exteriorTemp + (progress * 200), // Aerodynamic heating
      downlinkRate: progress * 50, // Building signal
      uplinkRate: progress * 10,
      signalQuality: progress * 100,
      solarCurrent: progress * 2
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
      gForce: 4 * Math.max(0, 1 - progress * 2),
      pitch: 2 + progress * 1,  // Adjusting attitude
      yaw: progress * 0.5,
      roll: 0,
      mainEngineFuel: INITIAL_TELEMETRY.mainEngineFuel - 2000 - (progress * 3000),
      rcsFuel: INITIAL_TELEMETRY.rcsFuel - (progress * 50),
      avionicsTemp: INITIAL_TELEMETRY.avionicsTemp + 10 + (progress * 5),
      exteriorTemp: INITIAL_TELEMETRY.exteriorTemp + 200 + (progress * 100),
      downlinkRate: 50 + progress * 100,
      uplinkRate: 10 + progress * 20,
      signalQuality: 100 - progress * 10, // Some degradation during ascent
      solarCurrent: 2 + progress * 3
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
      gForce: 0,
      pitch: 0,
      yaw: progress * 360,  // Orbital rotation
      roll: 0,
      mainEngineFuel: INITIAL_TELEMETRY.mainEngineFuel - 5000,
      rcsFuel: INITIAL_TELEMETRY.rcsFuel - 50 - (progress * 100),
      avionicsTemp: INITIAL_TELEMETRY.avionicsTemp + 5,
      exteriorTemp: -100 + progress * 50, // Varying with orbital position
      orbitalInclination: 28.5,
      eccentricity: 0.001 + progress * 0.0005,
      apoapsis: orbitAltitude + 50,
      periapsis: orbitAltitude - 50,
      downlinkRate: 150 + progress * 50,
      uplinkRate: 30 + progress * 10,
      signalQuality: 95 + progress * 4,
      solarCurrent: 5 + Math.sin(progress * Math.PI * 2) * 2, // Varying with orbital position
      batteryChargeRate: Math.sin(progress * Math.PI * 2) > 0 ? 2 : -1
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
      gForce: 0,
      pitch: 0,
      yaw: progress * 180,  // Attitude control during transit
      roll: progress * 90,
      mainEngineFuel: INITIAL_TELEMETRY.mainEngineFuel - 5000 - (progress * 5000),
      rcsFuel: INITIAL_TELEMETRY.rcsFuel - 150 - (progress * 200),
      oxidizerLevel: 100 - progress * 20,
      avionicsTemp: INITIAL_TELEMETRY.avionicsTemp + 2,
      exteriorTemp: -250 + progress * 100, // Warming as approaching Moon
      orbitalInclination: 28.5,
      eccentricity: 0.985,  // Highly eccentric translunar trajectory
      apoapsis: 384400,     // Lunar distance
      periapsis: 2200,      // Earth perigee
      downlinkRate: 100 + progress * 200,  // Improving as distance increases
      uplinkRate: 25 + progress * 50,
      signalQuality: 80 - progress * 30,  // Degrading with distance
      solarCurrent: 8 + Math.sin(progress * Math.PI * 4) * 3,
      batteryChargeRate: 1.5
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
      gForce: 0,
      pitch: progress * 10,   // Small attitude adjustments
      yaw: progress * 45,
      roll: progress * 20,
      mainEngineFuel: INITIAL_TELEMETRY.mainEngineFuel - 10000,
      rcsFuel: INITIAL_TELEMETRY.rcsFuel - 350 - (progress * 100),
      oxidizerLevel: 80 - progress * 15,
      avionicsTemp: INITIAL_TELEMETRY.avionicsTemp + 1,
      exteriorTemp: -150 + progress * 50,
      orbitalInclination: 0,  // Free return trajectory
      eccentricity: 0.966,    // Lunar trajectory
      downlinkRate: 300 - progress * 100,  // Degrading as round Moon
      uplinkRate: 75 - progress * 25,
      signalQuality: 50 - progress * 40,   // Lunar occultation effects
      solarCurrent: 10 + Math.sin(progress * Math.PI * 8) * 4,
      batteryChargeRate: 1.2
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
  gForce: 0,

  // Enhanced telemetry parameters
  pitch: 0,
  yaw: 0,
  roll: 0,
  mainEngineFuel: 25000,  // kg
  rcsFuel: 860,           // kg
  oxidizerLevel: 100,     // percent
  avionicsTemp: 68,       // °F
  batteryTemp: 72,        // °F
  exteriorTemp: -250,     // °F
  orbitalInclination: 28.5,  // degrees
  eccentricity: 0.0001,      // dimensionless
  apoapsis: 0,            // km
  periapsis: 0,           // km
  downlinkRate: 0,        // Mbps
  uplinkRate: 0,          // Mbps
  signalQuality: 0,       // percent
  solarCurrent: 0,        // Amperes
  batteryChargeRate: 0    // Ah
};

export function getMissionPhase(t: number): MissionPhase {
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

export function getPhaseName(phase: MissionPhase): string {
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

export function getPhaseColor(phase: MissionPhase): string {
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