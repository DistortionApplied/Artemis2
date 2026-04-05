

----------------------------------------------------
prompt
----------------------------------------------------`

Build an Artemis 2 Mission Control Console Simulator game. It should be accurate to the actual Artemis 2 mission as far as flight path, flight plan and milestones, from prelaunch to splashdown. It should have a professional aesthetic, detailed and accurate telemetry, clear communication to the player what is going on and what the expectations of them are.



🔧 Performance & Technical Issues


1. Component Size & Complexity

    - The main component is over 1200 lines - break it into smaller, focused components

2. Timing & Performance

    - The 100ms interval updating multiple states is inefficient - use requestAnimationFrame for smoother updates
    - Implement proper cleanup to prevent memory leaks

3. 🎮 Gameplay & User Experience

    - Player Agency & Interaction
        - Add more decision points beyond burn approvals (crew health decisions, trajectory adjustments)
        - Implement failure states and consequences for poor decisions
        - Add emergency scenarios (radiation events, system failures, crew medical issues)
        - Include crew communication and morale management
    - Visual Feedback & Polish
    - Add loading states and progress indicators
    - Implement sound effects for critical events and communications
    - Add animated transitions and visual effects for mission milestones
    - Improve orbital visualization with actual orbital paths and lunar surface details 
    
4. Accessibility & Usability

    - Implement tooltips and help system
    - Add mission progress saving/loading
    - Include tutorial mode for new players

5. 📊 Data & Content

    - Mission Accuracy & Depth
    - Add more detailed telemetry parameters (attitude, propellant levels, thermal data)
    - Include historical Apollo mission comparisons
    
6. Content Expansion

    - Add mission phases with different challenges and objectives
    - Include educational content about Artemis program and spaceflight
    - Implement mission branching based on player decisions

1.0 Initial improvements and revisions
    - refactored page.tsx
    - dealt with refactor fuck ups
    X clock is fucked
    X visually awful
    

