"use client";

import { useState, useEffect, useCallback } from "react";
import { MissionBriefing, MissionControl, MISSION_EVENTS, CREW_MEMBERS } from "../components/mission-control";
import { interpolateTelemetry, formatMET, getMissionPhase, CommMessage } from "../components/mission-control/types";

export default function ArtemisIIControl() {
  // All state and logic back in main component - exactly like original working version
  const [gameStarted, setGameStarted] = useState(false);
  const [missionTime, setMissionTime] = useState(-600.0); // 10 minutes prelaunch countdown
  const [telemetry, setTelemetry] = useState(() => interpolateTelemetry(-600.0));
  const [currentPhase, setCurrentPhase] = useState(() => getMissionPhase(-600.0));
  const [events, setEvents] = useState(MISSION_EVENTS);
  const [commLog, setCommLog] = useState<CommMessage[]>([]);
  const [pendingApproval, setPendingApproval] = useState<string | null>(null);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showMissionBriefing, setShowMissionBriefing] = useState(true);

  // Timer logic - exactly like original working version
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime(prev => {
        const newTime = prev + (gameSpeed * 0.1);

        // Update telemetry and phase
        setTelemetry(interpolateTelemetry(newTime));
        setCurrentPhase(getMissionPhase(newTime));

        // Mission events only after launch
        if (gameStarted) {
          // Launch events
          if (newTime >= 0 && prev < 0) {
            setCommLog(prev => [...prev.slice(-49), {
              id: `comm_${Date.now()}_launch`,
              time: formatMET(newTime),
              from: "CAPCOM",
              message: "All stations, we have liftoff at 6:35 PM EDT! Godspeed, Artemis II crew.",
              type: "info"
            }]);
          }

          if (newTime >= 8 && prev < 8) {
            setCommLog(prev => [...prev.slice(-49), {
              id: `comm_${Date.now()}_orbit`,
              time: formatMET(newTime),
              from: "CDR",
              message: "Copy, Houston. Main engines cut off confirmed. We're on orbit.",
              type: "crew_report"
            }, {
              id: `comm_${Date.now()}_congrats`,
              time: formatMET(newTime),
              from: "CAPCOM",
              message: "Copy, Integrity. Congratulations on a beautiful ascent, crew.",
              type: "info"
            }]);
          }

          // TLI burn approval
          if (newTime >= 10200 && newTime < 10210) {
            setPendingApproval("tli");
            setCommLog(prev => [...prev.slice(-49), {
              id: `comm_${Date.now()}_tli_request`,
              time: formatMET(newTime),
              from: "CAPCOM",
              message: "Orion, Houston. Requesting TLI burn approval. All systems are go.",
              type: "approval_request"
            }]);
          }
        }

        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameStarted, gameSpeed]);

  const startMission = useCallback(() => {
    setGameStarted(true);
    setShowMissionBriefing(false);
    setCommLog(prev => [...prev.slice(-49), {
      id: `comm_${Date.now()}_ready`,
      time: formatMET(missionTime),
      from: "SYSTEM",
      message: "Artemis II Mission Control online. All stations report ready.",
      type: "system"
    }, {
      id: `comm_${Date.now()}_hatch`,
      time: formatMET(missionTime),
      from: "SYSTEM",
      message: "Crew ingress complete. Hatch secured.",
      type: "system"
    }]);
  }, [missionTime]);

  const approveBurn = useCallback((eventId: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, status: "completed", approved: true, outcome: "success" } : e
    ));
    setPendingApproval(null);
    setCommLog(prev => [...prev.slice(-49), {
      id: `comm_${Date.now()}_approved`,
      time: formatMET(missionTime),
      from: "CAPCOM",
      message: `Copy. Burn approved. We are go for ${events.find(e => e.id === eventId)?.title}.`,
      type: "info"
    }]);
  }, [missionTime, events]);

  const holdBurn = useCallback((eventId: string, eventTitle: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? {...e, status: "upcoming"} : e));
    setPendingApproval(null);
    setCommLog(prev => [...prev.slice(-49), {
      id: `comm_${Date.now()}_hold`,
      time: formatMET(missionTime),
      from: "CAPCOM",
      message: `Hold on ${eventTitle}. Standby for further review.`,
      type: "alert"
    }]);
  }, [missionTime]);

  if (showMissionBriefing) {
    return <MissionBriefing onStartMission={startMission} />;
  }

  return (
    <MissionControl
      missionTime={missionTime}
      telemetry={telemetry}
      currentPhase={currentPhase}
      events={events}
      commLog={commLog}
      gameSpeed={gameSpeed}
      selectedEvent={selectedEvent}
      onGameSpeedChange={setGameSpeed}
      onEventSelect={setSelectedEvent}
      onBurnApprove={approveBurn}
      onBurnHold={holdBurn}
      formatTime={formatMET}
    />
  );
}