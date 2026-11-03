/**
 * Pathfolio — Kinetic Career Dossier & Milestone Engine
 * Unified Client Controller for Marketing Site, Guide & Privacy Pages
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Theme Management (Sovereign Local Persistence)
  // ---------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'pathfolio-theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      });
    }

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer
  // ---------------------------------------------------------------------------
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close when clicking any drawer link
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeDrawer());
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    function openDrawer() {
      drawer.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Kinetic Milestone Ledger Canvas (Architectural Guide Rails)
  // ---------------------------------------------------------------------------
  function initDossierCanvas() {
    const canvas = document.getElementById('dossier-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Career Guide Rails (positioned outside headline text bounding boxes)
    const rails = [
      { yRatio: 0.04, speed: 0.35, pips: [0.15, 0.45, 0.75], label: 'STAGE_01 :: APPLIED_VELOCITY' },
      { yRatio: 0.48, speed: 0.45, pips: [0.25, 0.65], label: 'STAGE_02 :: SCREENING_THROUGHPUT' },
      { yRatio: 0.74, speed: 0.3, pips: [0.1, 0.5, 0.85], label: 'STAGE_03 :: INTERVIEW_MILESTONES' },
      { yRatio: 0.94, speed: 0.4, pips: [0.35, 0.8], label: 'STAGE_04 :: OFFER_EVALUATION' }
    ];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (isReducedMotion) {
        drawStaticGrid();
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    if (isReducedMotion) {
      drawStaticGrid();
      return;
    }

    function drawStaticGrid() {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(22, 23, 26, 0.04)';
      ctx.lineWidth = 1;

      // Draw horizontal static ledger lines
      rails.forEach((rail) => {
        const y = height * rail.yRatio;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      });
    }

    let lastTime = performance.now();

    function render(currentTime) {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.clearRect(0, 0, width, height);

      // Architectural line color
      const lineColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(22, 23, 26, 0.04)';
      const pipColor = isDark ? 'rgba(45, 212, 191, 0.6)' : 'rgba(19, 78, 67, 0.5)';
      const crossColor = isDark ? 'rgba(251, 191, 36, 0.35)' : 'rgba(184, 115, 51, 0.25)';

      // Render milestone guide rails
      rails.forEach((rail, idx) => {
        const y = Math.round(height * rail.yRatio);

        // Draw Guide Rail
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Advance and draw pips
        rail.pips.forEach((pos, pIdx) => {
          rail.pips[pIdx] = (pos + rail.speed * 0.05 * dt) % 1.0;
          const px = rail.pips[pIdx] * width;

          // Guard: never render decorative pips over hero text area
          if (y >= 60 && y <= 440 && px >= width * 0.04 && px <= width * 0.96) {
            return;
          }

          // Milestone Pip
          ctx.fillStyle = pipColor;
          ctx.beginPath();
          ctx.arc(px, y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Subtle coordinate tick mark
          ctx.strokeStyle = lineColor;
          ctx.beginPath();
          ctx.moveTo(px, y - 6);
          ctx.lineTo(px, y + 6);
          ctx.stroke();
        });

        // Architectural registration cross at rail edges
        const crossX = (width * (0.05 + idx * 0.25)) % width;
        if (y < 60 || y > 440 || crossX < width * 0.04 || crossX > width * 0.96) {
          ctx.strokeStyle = crossColor;
          ctx.beginPath();
          ctx.moveTo(crossX - 5, y);
          ctx.lineTo(crossX + 5, y);
          ctx.moveTo(crossX, y - 5);
          ctx.lineTo(crossX + 5, y);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    }

    // Visibility and Intersection observer pausing
    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });

    animationFrameId = requestAnimationFrame(render);
  }

  // ---------------------------------------------------------------------------
  // 4. Hero Milestone Scrubber & Interactive Dossier
  // ---------------------------------------------------------------------------
  function initHeroDossier() {
    const heroDossier = document.getElementById('hero-dossier');
    if (!heroDossier) return;

    const stages = [
      {
        name: 'Saved',
        fillWidth: '10%',
        color: 'var(--stage-saved)',
        bg: 'var(--stage-saved-bg)',
        nextAction: 'Research team stack & request referral',
        log: 'Stage updated: Saved [Opportunity logged in discovery queue]'
      },
      {
        name: 'Applied',
        fillWidth: '28%',
        color: 'var(--stage-applied)',
        bg: 'var(--stage-applied-bg)',
        nextAction: 'Application submitted via portal; follow up Nov 2',
        log: 'Stage updated: Applied [Application submitted with referral]'
      },
      {
        name: 'Screening',
        fillWidth: '48%',
        color: 'var(--stage-screening)',
        bg: 'var(--stage-screening-bg)',
        nextAction: 'Recruiter Chat with Engineering Lead (Oct 28)',
        log: 'Stage updated: Screening [Initial technical sizing passed]'
      },
      {
        name: 'Interview',
        fillWidth: '68%',
        color: 'var(--stage-interview)',
        bg: 'var(--stage-interview-bg)',
        nextAction: 'Systems Architecture Loop & Live Coding (Nov 5)',
        log: 'Stage updated: Technical Interview [Saved to local Activity History]'
      },
      {
        name: 'Offer',
        fillWidth: '88%',
        color: 'var(--stage-offer)',
        bg: 'var(--stage-offer-bg)',
        nextAction: 'Evaluate equity package & negotiate base by Nov 12',
        log: 'Stage updated: Offer Extended [Written offer details recorded]'
      },
      {
        name: 'Rejected',
        fillWidth: '100%',
        color: 'var(--stage-concluded)',
        bg: 'var(--stage-concluded-bg)',
        nextAction: 'Application concluded; debrief lessons saved',
        log: 'Stage updated: Rejected [Concluded application debrief saved]'
      }
    ];

    const candidateProfiles = [
      {
        company: 'STRIPE // INFRASTRUCTURE',
        role: 'Staff Distributed Systems Engineer',
        meta: ['📍 San Francisco / Remote', '💼 $210k - $240k + Equity', '📅 Next: Systems Architecture Loop (Nov 5)'],
        evidenceTitle: 'High-Throughput Ingestion Engine Optimization',
        evidenceResult: '"Engineered distributed Kafka event pipeline handling 22,000 req/s with under 18ms p99 latency during peak load, cutting cluster hosting costs by 32%."'
      },
      {
        company: 'FIGMA // CORE ENGINE',
        role: 'Senior C++ Graphics & Systems Architect',
        meta: ['📍 New York / Hybrid', '💼 $195k - $225k + Equity', '📅 Next: Canvas Performance Review'],
        evidenceTitle: 'Zero-Copy Canvas Serialization Layer',
        evidenceResult: '"Architected custom memory-mapped binary scene buffer reducing complex file load times from 3.8s to 420ms across large collaborative documents."'
      },
      {
        company: 'LINEAR // PLATFORM',
        role: 'Lead Cloud Reliability Engineer',
        meta: ['📍 Remote (US / EU)', '💼 $185k - $215k + Equity', '📅 Next: Distributed Consensus Deep Dive'],
        evidenceTitle: 'Zero-Downtime Database Migration Protocol',
        evidenceResult: '"Designed dual-write shadow verification system migrating 80M records with zero downtime and sub-millisecond rollback safety."'
      }
    ];

    let currentStageIndex = 3; // Start at Interview
    let currentProfileIndex = 0;

    const railFill = document.getElementById('dossier-rail-fill');
    const stations = heroDossier.querySelectorAll('.station-item');
    const stagePill = document.getElementById('dossier-stage-pill');
    const nextActionLabel = document.getElementById('dossier-next-action');
    const auditLog = document.getElementById('dossier-audit-log');
    const companyLabel = document.getElementById('dossier-company');
    const roleLabel = document.getElementById('dossier-role');
    const evidenceTitle = document.getElementById('dossier-evidence-title');
    const evidenceResult = document.getElementById('dossier-evidence-result');

    const btnPrev = document.getElementById('btn-prev-stage');
    const btnNext = document.getElementById('btn-next-stage');
    const btnCycleProfile = document.getElementById('btn-cycle-candidate');

    function updateDossierView() {
      const stage = stages[currentStageIndex];

      // Update Rail Fill Bar
      if (railFill) {
        railFill.style.width = stage.fillWidth;
      }

      // Update Station Node states
      stations.forEach((st, idx) => {
        st.classList.remove('completed', 'active');
        st.setAttribute('aria-selected', 'false');
        if (idx < currentStageIndex) {
          st.classList.add('completed');
        } else if (idx === currentStageIndex) {
          st.classList.add('active');
          st.setAttribute('aria-selected', 'true');
        }
      });

      // Update Stage Badge
      if (stagePill) {
        stagePill.textContent = 'Stage: ' + stage.name;
        stagePill.style.color = stage.color;
        stagePill.style.backgroundColor = stage.bg;
      }

      // Update Audit Log Line
      if (auditLog) {
        auditLog.textContent = stage.log;
      }

      // Update Prev / Next button states
      if (btnPrev) btnPrev.disabled = currentStageIndex === 0;
      if (btnNext) btnNext.disabled = currentStageIndex === stages.length - 1;
    }

    function updateProfileView() {
      const profile = candidateProfiles[currentProfileIndex];
      if (companyLabel) companyLabel.textContent = profile.company;
      if (roleLabel) roleLabel.textContent = profile.role;
      if (evidenceTitle) evidenceTitle.textContent = profile.evidenceTitle;
      if (evidenceResult) evidenceResult.textContent = profile.evidenceResult;
    }

    // Click station nodes
    stations.forEach((st) => {
      st.addEventListener('click', () => {
        const stageIdx = parseInt(st.getAttribute('data-stage'), 10);
        if (!isNaN(stageIdx)) {
          currentStageIndex = stageIdx;
          updateDossierView();
        }
      });
    });

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentStageIndex > 0) {
          currentStageIndex--;
          updateDossierView();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentStageIndex < stages.length - 1) {
          currentStageIndex++;
          updateDossierView();
        }
      });
    }

    if (btnCycleProfile) {
      btnCycleProfile.addEventListener('click', () => {
        currentProfileIndex = (currentProfileIndex + 1) % candidateProfiles.length;
        updateProfileView();
      });
    }

    updateDossierView();
  }

  // ---------------------------------------------------------------------------
  // 5. Chapter 2: STAR Evidence Matrix Controller
  // ---------------------------------------------------------------------------
  function initStarMatrix() {
    const starSection = document.getElementById('star-matrix');
    if (!starSection) return;

    const evidenceData = {
      systems: {
        situation: 'Legacy telemetry ingestion service suffered memory exhaustion and 1,800ms tail latency during peak registration spikes, causing dropped metrics and customer alerting delays.',
        task: 'Redesign the message ingestion pipeline to support 20,000+ events/sec with sub-50ms p99 latency without increasing server cluster budget.',
        action: 'Re-architected buffer pooling in Go, migrated unbounded channels to partitioned Kafka topics, and introduced memory-mapped batching with backpressure controls.',
        result: 'Processed 22,000 events/sec with 18ms p99 latency; reduced memory footprint by 45% and cloud infrastructure bill by $14,000/month.',
        title: 'Distributed Telemetry Engine',
        tags: 'TAGS: Go, Kafka, Prometheus, Zero-Allocation',
        summary: 'Use during systems architecture and concurrency rounds to demonstrate measured performance engineering under real production load.'
      },
      perf: {
        situation: 'Core web application bundle grew to 4.2MB, resulting in a 4.8s Time-to-Interactive on mobile devices and 22% bounce rate during onboarding.',
        task: 'Reduce initial JavaScript execution time to under 800ms and cut payload size by over 60% across mobile devices.',
        action: 'Executed automated AST route-splitting, replaced heavyweight libraries with zero-dependency native utilities, and configured brotli compression at edge CDNs.',
        result: 'Reduced compressed bundle to 380KB; cut mobile TTI to 640ms and boosted signup funnel completion by 18.5%.',
        title: 'Zero-Allocation Frontend Asset Pipeline',
        tags: 'TAGS: TypeScript, Tree-Shaking, Edge-CDN, WebVitals',
        summary: 'Highlight during frontend architecture and client performance loops to prove rigorous engineering discipline.'
      },
      security: {
        situation: 'Previous team stored raw API client credentials directly in repository environment files, creating exposure risks during team onboarding.',
        task: 'Design an automated scoped credential rotation protocol with zero plaintext persistence in source control.',
        action: 'Implemented automated time-bound ephemeral token generation, short-lived session grants, and client-side secret rotation checks.',
        result: 'Eliminated static credential leaks; reduced credential provisioning latency by 80% with verified audit trail.',
        title: 'Scoped Credential Rotation Protocol',
        tags: 'TAGS: OAuth2, Ephemeral-Tokens, Least-Privilege, IAM',
        summary: 'Demonstrate during systems and security discussions your understanding of least privilege, token lifecycles, and credential hygiene.'
      },
      frontend: {
        situation: 'Application state occasionally lost unsaved candidate interview notes during intermittent network drops or abrupt browser tab closures.',
        task: 'Architect an offline-first client persistence engine with atomic snapshots and sub-millisecond local state synchronization.',
        action: 'Engineered single-snapshot atomic JSON commits via local storage with schema validation, transactional rollbacks on write failure, and optimistic UI updates.',
        result: 'Zero state loss across 10,000 simulated offline tests; instantaneous sub-5ms screen updates across mobile and desktop clients.',
        title: 'Offline-First Client Persistence Architecture',
        tags: 'TAGS: Local-First, State-Machine, JSON-Schema, Flutter-Web',
        summary: 'Cite during client architecture debriefs to show how offline-first resilience eliminates data loss and ensures snappy responsiveness.'
      }
    };

    const filterBtns = starSection.querySelectorAll('.matrix-filter-btn');
    const sitEl = document.getElementById('star-situation');
    const taskEl = document.getElementById('star-task');
    const actEl = document.getElementById('star-action');
    const resEl = document.getElementById('star-result');
    const citTitleEl = document.getElementById('citation-title');
    const citTagsEl = document.getElementById('citation-tags');
    const citSummaryEl = document.getElementById('citation-summary');

    const btnSimulate = document.getElementById('btn-cite-simulation');
    const feedbackEl = document.getElementById('citation-feedback');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const domain = btn.getAttribute('data-domain');
        const data = evidenceData[domain] || evidenceData.systems;

        if (sitEl) sitEl.textContent = data.situation;
        if (taskEl) taskEl.textContent = data.task;
        if (actEl) actEl.textContent = data.action;
        if (resEl) resEl.textContent = data.result;
        if (citTitleEl) citTitleEl.textContent = data.title;
        if (citTagsEl) citTagsEl.textContent = data.tags;
        if (citSummaryEl) citSummaryEl.textContent = data.summary;

        if (feedbackEl) feedbackEl.style.display = 'none';
      });
    });

    if (btnSimulate && feedbackEl) {
      btnSimulate.addEventListener('click', () => {
        feedbackEl.style.display = 'block';
        feedbackEl.textContent = '✓ Citation attached to active candidate briefing!';
        setTimeout(() => {
          feedbackEl.style.opacity = '1';
        }, 10);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Schema v1 JSON Backup Generator & Download
  // ---------------------------------------------------------------------------
  function initJsonDownload() {
    const btn = document.getElementById('btn-download-sample-json');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const sampleBackup = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        appVersion: '1.0.1',
        opportunities: [
          {
            id: 'opp-stripe-001',
            company: 'Stripe',
            role: 'Staff Distributed Systems Engineer',
            stage: 'interview',
            salaryNote: '$210k - $240k + Equity',
            nextActionDate: new Date(Date.now() + 86400000 * 2).toISOString(),
            privateNotes: 'Technical loop with systems infrastructure team. Focus on high-throughput Kafka design.',
            timeline: [
              { id: 't-1', stage: 'saved', timestamp: new Date(Date.now() - 86400000 * 18).toISOString() },
              { id: 't-2', stage: 'applied', timestamp: new Date(Date.now() - 86400000 * 14).toISOString() },
              { id: 't-3', stage: 'screening', timestamp: new Date(Date.now() - 86400000 * 8).toISOString() },
              { id: 't-4', stage: 'interview', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() }
            ],
            evidenceIds: ['ev-telemetry-01']
          },
          {
            id: 'opp-figma-002',
            company: 'Figma',
            role: 'Senior Core Engine Architect',
            stage: 'screening',
            salaryNote: '$195k - $225k + Equity',
            nextActionDate: new Date(Date.now() + 86400000 * 4).toISOString(),
            privateNotes: 'Initial conversation with graphics runtime manager.',
            timeline: [
              { id: 't-5', stage: 'saved', timestamp: new Date(Date.now() - 86400000 * 6).toISOString() },
              { id: 't-6', stage: 'applied', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
              { id: 't-7', stage: 'screening', timestamp: new Date().toISOString() }
            ],
            evidenceIds: ['ev-canvas-02']
          }
        ],
        evidence: [
          {
            id: 'ev-telemetry-01',
            title: 'High-Throughput Ingestion Engine Optimization',
            tags: ['Go', 'Kafka', 'Prometheus', 'Distributed-Storage'],
            result: 'Engineered distributed Kafka event pipeline handling 22k events/sec with 18ms p99 latency.'
          },
          {
            id: 'ev-canvas-02',
            title: 'Zero-Copy Canvas Serialization Layer',
            tags: ['C++', 'Wasm', 'Graphics-Engine', 'SIMD'],
            result: 'Reduced complex design file load times from 3.8s to 420ms across large documents.'
          }
        ],
        tasks: [
          {
            id: 'tsk-001',
            opportunityId: 'opp-stripe-001',
            title: 'Review distributed consensus paper before loop',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            completed: false
          }
        ]
      };

      const blob = new Blob([JSON.stringify(sampleBackup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pathfolio-backup-v1-sample.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Initialization Lifecycle
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initDossierCanvas();
    initHeroDossier();
    initStarMatrix();
    initJsonDownload();
  });
})();
