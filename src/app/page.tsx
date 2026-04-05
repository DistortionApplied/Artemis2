"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { MissionBriefing, MissionControl, MISSION_EVENTS, CREW_MEMBERS } from "../components/mission-control";
import { interpolateTelemetry, formatMET, getMissionPhase, CommMessage } from "../components/mission-control/types";

export default function ArtemisIIControl() {
  // All state and logic back in main component - exactly like original working version
  const [gameStarted, setGameStarted] = useState(false);
  const [missionTime, setMissionTime] = useState(-600.0); // 10 minutes prelaunch countdown

  const [events, setEvents] = useState(MISSION_EVENTS);
  const [commLog, setCommLog] = useState<CommMessage[]>([]);
  const [pendingApproval, setPendingApproval] = useState<string | null>(null);

  const addMessage = useCallback((from: CommMessage["from"], message: string, type: CommMessage["type"] = "info") => {
    const newMessage: CommMessage = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      time: formatMET(missionTime),
      from,
      message,
      type
    };
    setCommLog(prev => [...prev.slice(-49), newMessage]);
  }, [missionTime]);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showMissionBriefing, setShowMissionBriefing] = useState(true);

  // Refs to track which messages have been sent to avoid duplicates
  const launchMessageSent = useRef(false);
  const mecoMessageSent = useRef(false);
  const tliPrepMessageSent = useRef(false);
  const tliRequestMessageSent = useRef(false);

  // High-performance timer using requestAnimationFrame
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const updateTimer = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      // Update at ~60fps (every ~16.67ms) for smooth animation
      if (deltaTime >= 16.67) {
        setMissionTime(prev => {
          const newTime = prev + (gameSpeed * deltaTime / 1000); // Convert to seconds

          // Handle mission events only when game is started
          if (gameStarted) {
            if (newTime >= 0 && prev < 0 && !launchMessageSent.current) {
              addMessage("CAPCOM", "All stations, we have liftoff at 6:35 PM EDT! Godspeed, Artemis II crew.", "info");
              launchMessageSent.current = true;
            }

            if (newTime >= 8 && prev < 8 && !mecoMessageSent.current) {
              addMessage("CDR", "Copy, Houston. Main engines cut off confirmed. We're on orbit.", "crew_report");
              addMessage("CAPCOM", "Copy, Integrity. Congratulations on a beautiful ascent, crew.", "info");
              mecoMessageSent.current = true;
            }

            if (newTime >= 10200 && prev < 10200 && !tliPrepMessageSent.current) {
              setPendingApproval("tli");
              addMessage("CAPCOM", "Orion, Houston. TLI prep complete. We are tracking for burn approval at T+25:14.", "info");
              tliPrepMessageSent.current = true;
            }

            if (newTime >= 10200 && newTime < 10210 && pendingApproval === "tli" && !tliRequestMessageSent.current) {
              addMessage("CAPCOM", "Orion, Houston. Requesting TLI burn approval. All systems are go.", "approval_request");
              tliRequestMessageSent.current = true;
            }
          }

          return newTime;
        });
        lastTime = currentTime;
      }

      // Continue the animation loop if game is active or in countdown
      if (gameStarted || missionTime < 0) {
        animationId = requestAnimationFrame(updateTimer);
      }
    };

    // Start the animation loop
    animationId = requestAnimationFrame(updateTimer);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameSpeed, gameStarted, missionTime]);

  // Memoized telemetry calculation for better performance
  const telemetry = useMemo(() => interpolateTelemetry(missionTime), [missionTime]);
  const currentPhase = useMemo(() => getMissionPhase(missionTime), [missionTime]);

  // Mission events are handled in the timer callback to avoid useEffect setState issues

  const startMission = useCallback(() => {
    setGameStarted(true);
    setShowMissionBriefing(false);
    addMessage("SYSTEM", "Artemis II Mission Control online. All stations report ready.", "system");
    addMessage("SYSTEM", "Crew ingress complete. Hatch secured.", "system");
  }, [addMessage]);

  const approveBurn = useCallback((eventId: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, status: "completed", approved: true, outcome: "success" } : e
    ));
    setPendingApproval(null);
    addMessage("CAPCOM", `Copy. Burn approved. We are go for ${events.find(e => e.id === eventId)?.title}.`, "info");
  }, [events, addMessage]);

  const holdBurn = useCallback((eventId: string, eventTitle: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? {...e, status: "upcoming"} : e));
    setPendingApproval(null);
    addMessage("CAPCOM", `Hold on ${eventTitle}. Standby for further review.`, "alert");
  }, [addMessage]);

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