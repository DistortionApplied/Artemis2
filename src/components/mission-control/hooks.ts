"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MissionEvent, CommMessage, Telemetry, MissionPhase, interpolateTelemetry, getMissionPhase, formatMET } from "./types";
import { MISSION_EVENTS } from "./data";

export function useMissionState() {
  const [gameStarted, setGameStarted] = useState(false);
  const [missionTime, setMissionTime] = useState(-600.0); // 10 minutes prelaunch countdown
  const [telemetry, setTelemetry] = useState<Telemetry>(interpolateTelemetry(-600.0));
  const [currentPhase, setCurrentPhase] = useState<MissionPhase>("prelaunch");
  const [events, setEvents] = useState<MissionEvent[]>(MISSION_EVENTS);
  const [commLog, setCommLog] = useState<CommMessage[]>([]);
  const [pendingApproval, setPendingApproval] = useState<string | null>(null);
  const [showMissionBriefing, setShowMissionBriefing] = useState(true);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<MissionEvent | null>(null);

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

  const holdBurn = useCallback((eventId: string, eventTitle: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? {...e, status: "upcoming"} : e));
    setPendingApproval(null);
    addCommMessage("CAPCOM", `Hold on ${eventTitle}. Standby for further review.`, "alert");
  }, [addCommMessage]);

  const startMission = useCallback(() => {
    setGameStarted(true);
    setShowMissionBriefing(false);
    addCommMessage("SYSTEM", "Artemis II Mission Control online. All stations report ready.", "system");
    addCommMessage("SYSTEM", "Crew ingress complete. Hatch secured.", "system");
  }, [addCommMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime(prev => {
        const newTime = prev + (gameSpeed * 0.1); // Add fractional seconds based on speed

        // Only add messages and update events if mission has started
        if (gameStarted) {
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

          setEvents(events => events.map(e => {
            if (e.status === "pending_approval" && e.id !== pendingApproval) return e;
            return e;
          }));
        }

        setTelemetry(interpolateTelemetry(newTime));
        setCurrentPhase(getMissionPhase(newTime));

        return newTime;
      });
    }, 100); // Back to 100ms for smoother millisecond updates

    return () => clearInterval(interval);
  }, [gameStarted, gameSpeed]); // Remove unstable dependencies

  return {
    gameStarted,
    missionTime,
    telemetry,
    currentPhase,
    events,
    commLog,
    pendingApproval,
    showMissionBriefing,
    gameSpeed,
    selectedEvent,
    setEvents,
    setPendingApproval,
    setGameSpeed,
    setSelectedEvent,
    approveBurn,
    holdBurn,
    startMission
  };
}