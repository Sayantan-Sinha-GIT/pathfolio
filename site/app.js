/**
 * Pathfolio — Kinetic Career Dossier & Sovereign Milestone Engine
 * Unified Client Controller for Marketing Site, Guide & Privacy Pages
 */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    let animationFrameId = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Architectural Milestone Rails across Viewport
    const rails = [
      { yRatio: 0.08, speed: 0.16, pips: [0.12, 0.62], label: '01 // APPLIED_VELOCITY' },
      { yRatio: 0.28, speed: 0.22, pips: [0.35, 0.85], label: '02 // SCREENING_RUNWAY' },
      { yRatio: 0.52, speed: 0.18, pips: [0.18, 0.58], label: '03 // ARCHITECTURE_LOOP' },
      { yRatio: 0.74, speed: 0.24, pips: [0.28, 0.76], label: '04 // EXECUTIVE_OFFER' },
      { yRatio: 0.92, speed: 0.16, pips: [0.42, 0.90], label: '05 // FINAL_CLOSING' }
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
      ctx.strokeStyle = isDark ? 'rgba(180, 196, 190, 0.14)' : 'rgba(20, 24, 22, 0.08)';
      ctx.lineWidth = 1;

      rails.forEach((rail) => {
        const y = Math.round(height * rail.yRatio);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        for (let tx = 40; tx < width; tx += 120) {
          ctx.beginPath();
          ctx.moveTo(tx, y - 4);
          ctx.lineTo(tx, y + 4);
          ctx.stroke();
        }
      });
    }

    let lastTime = performance.now();

    function render(currentTime) {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.clearRect(0, 0, width, height);

      const railLineColor = isDark ? 'rgba(180, 196, 190, 0.12)' : 'rgba(20, 24, 22, 0.08)';
      const beadHalo = isDark ? 'rgba(212, 175, 55, 0.28)' : 'rgba(184, 115, 51, 0.22)';
      const beadCore = isDark ? '#D4AF37' : '#B87333';
      const labelColor = isDark ? 'rgba(180, 196, 190, 0.45)' : 'rgba(20, 24, 22, 0.38)';

      rails.forEach((rail) => {
        const y = Math.round(height * rail.yRatio);

        // Dual Hairline Architectural Guide Rails
        ctx.strokeStyle = railLineColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.moveTo(0, y - 2);
        ctx.lineTo(width, y - 2);
        ctx.moveTo(0, y + 2);
        ctx.lineTo(width, y + 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vertical Caliper Ticks
        for (let tx = 60; tx < width; tx += 160) {
          ctx.strokeStyle = railLineColor;
          ctx.beginPath();
          ctx.moveTo(tx, y - 6);
          ctx.lineTo(tx, y + 6);
          ctx.stroke();
        }

        // Monospace Milestone Caliper Tag safely docked at left architectural margin ruler
        // Preserves the drafting aesthetic without sweeping moving text tags across foreground copy
        if (width >= 1024) {
          ctx.font = '500 9px "JetBrains Mono", monospace';
          ctx.fillStyle = labelColor;
          ctx.fillText(rail.label, 24, y - 6);
        }

        // Active Kinetic Milestone Transport Packets
        rail.pips.forEach((pos, pIdx) => {
          rail.pips[pIdx] = (pos + rail.speed * dt) % 1.0;
          const px = rail.pips[pIdx] * width;

          // Luminous Tracer Tail
          const trailLength = 110;
          const grad = ctx.createLinearGradient(px - trailLength, y, px, y);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(0.65, isDark ? 'rgba(45, 212, 191, 0.12)' : 'rgba(15, 77, 63, 0.10)');
          grad.addColorStop(1, isDark ? 'rgba(212, 175, 55, 0.65)' : 'rgba(184, 115, 51, 0.60)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(px - trailLength, y);
          ctx.lineTo(px, y);
          ctx.stroke();

          // Outer Illuminated Glow Halo
          ctx.fillStyle = beadHalo;
          ctx.beginPath();
          ctx.arc(px, y, 7, 0, Math.PI * 2);
          ctx.fill();

          // Inner Solid Brass Bead Core
          ctx.fillStyle = beadCore;
          ctx.beginPath();
          ctx.arc(px, y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      animationFrameId = requestAnimationFrame(render);
    }

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
    const heroDossier = document.getElementById('hero-dossier-card');
    if (!heroDossier) return;

    const stages = [
      {
        name: 'Saved',
        fillWidth: '10%',
        color: 'var(--stage-saved)',
        bg: 'var(--stage-saved-bg)',
        nextAction: 'Research team stack & request referral',
        log: 'Stage: Saved [Opportunity logged in discovery queue]'
      },
      {
        name: 'Applied',
        fillWidth: '28%',
        color: 'var(--stage-applied)',
        bg: 'var(--stage-applied-bg)',
        nextAction: 'Application submitted via portal; follow up Nov 2',
        log: 'Stage: Applied [Application submitted with referral]'
      },
      {
        name: 'Screening',
        fillWidth: '48%',
        color: 'var(--stage-screening)',
        bg: 'var(--stage-screening-bg)',
        nextAction: 'Recruiter Chat with Engineering Lead (Oct 28)',
        log: 'Stage: Screening [Initial technical sizing passed]'
      },
      {
        name: 'Interview',
        fillWidth: '68%',
        color: 'var(--stage-interview)',
        bg: 'var(--stage-interview-bg)',
        nextAction: 'Systems Architecture Loop & Live Coding (Nov 5)',
        log: 'Stage: Technical Interview [Saved to local Activity History]'
      },
      {
        name: 'Offer',
        fillWidth: '88%',
        color: 'var(--stage-offer)',
        bg: 'var(--stage-offer-bg)',
        nextAction: 'Evaluate equity package & negotiate base by Nov 12',
        log: 'Stage: Offer Extended [Written offer details recorded]'
      },
      {
        name: 'Rejected',
        fillWidth: '100%',
        color: 'var(--stage-concluded)',
        bg: 'var(--stage-concluded-bg)',
        nextAction: 'Application concluded; debrief lessons saved',
        log: 'Stage: Rejected [Concluded application debrief saved]'
      }
    ];

    const candidates = [
      {
        company: 'STRIPE // INFRASTRUCTURE',
        role: 'Staff Distributed Systems Engineer',
        stageIndex: 3,
        location: '📍 San Francisco / Remote',
        comp: '💼 $210k - $240k + Equity',
        next: '📅 Next: Architecture Loop (Nov 5)',
        evidenceTitle: 'High-Throughput Ingestion Engine Optimization',
        evidenceResult: '"Engineered distributed Kafka event pipeline handling 22,000 req/s with under 18ms p99 latency during peak load, cutting cluster hosting costs by 32%."'
      },
      {
        company: 'FIGMA // RENDERING ENGINE',
        role: 'Principal Graphics Runtime Architect',
        stageIndex: 2,
        location: '📍 San Francisco / Hybrid',
        comp: '💼 $230k - $260k + Equity',
        next: '📅 Next: Graphics Pipeline Deep Dive (Nov 8)',
        evidenceTitle: 'Zero-Copy Canvas Serialization Layer',
        evidenceResult: '"Designed Wasm memory-mapped scene serialization reducing large document import latency from 3.8s to 420ms across complex vector files."'
      },
      {
        company: 'DATADOG // METRICS PLATFORM',
        role: 'Senior Core Telemetry Engineer',
        stageIndex: 4,
        location: '📍 New York / Remote',
        comp: '💼 $200k - $230k + Equity',
        next: '📅 Next: Offer Review & Package Decision (Nov 10)',
        evidenceTitle: 'Adaptive Metric Aggregator Kernel',
        evidenceResult: '"Implemented lock-free ring buffer aggregation processing 850k datapoints/sec per core with zero thread contention under heavy burst traffic."'
      }
    ];

    let currentCandidateIndex = 0;
    let currentStageIndex = 3;

    const compEl = document.getElementById('dossier-company');
    const roleEl = document.getElementById('dossier-role');
    const stagePillEl = document.getElementById('dossier-stage-pill');
    const railFillEl = document.getElementById('dossier-rail-fill');
    const nextActionEl = document.getElementById('dossier-next-action');
    const evTitleEl = document.getElementById('dossier-evidence-title');
    const evResultEl = document.getElementById('dossier-evidence-result');
    const auditLogEl = document.getElementById('dossier-audit-log');
    const stations = heroDossier.querySelectorAll('.station-item');

    // Staged entrance choreography: animate rail fill from 0% to stage value over 1.2s
    if (!isReducedMotion && railFillEl) {
      railFillEl.style.width = '0%';
      railFillEl.style.transition = 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        railFillEl.style.width = stages[currentStageIndex].fillWidth;
      }, 180);
    } else if (railFillEl) {
      railFillEl.style.width = stages[currentStageIndex].fillWidth;
    }

    const colWrapper = document.getElementById('hero-dossier-col-wrapper');
    if (colWrapper) {
      setTimeout(() => {
        colWrapper.classList.remove('animating');
      }, 1300);
    }

    const btnPrev = document.getElementById('btn-prev-stage');
    const btnNext = document.getElementById('btn-next-stage');
    const btnCycle = document.getElementById('btn-cycle-candidate');

    function updateDossierUI() {
      const stage = stages[currentStageIndex];
      const cand = candidates[currentCandidateIndex];

      if (compEl) compEl.textContent = cand.company;
      if (roleEl) roleEl.textContent = cand.role;
      if (nextActionEl) nextActionEl.textContent = cand.next;
      if (evTitleEl) evTitleEl.textContent = cand.evidenceTitle;
      if (evResultEl) evResultEl.textContent = cand.evidenceResult;

      if (stagePillEl) {
        stagePillEl.textContent = 'Stage: ' + stage.name;
        stagePillEl.style.color = stage.color;
        stagePillEl.style.backgroundColor = stage.bg;
      }

      if (railFillEl) {
        railFillEl.style.width = stage.fillWidth;
      }

      if (auditLogEl) {
        auditLogEl.textContent = stage.log;
      }

      stations.forEach((stn, idx) => {
        stn.classList.remove('completed', 'active');
        stn.setAttribute('aria-selected', 'false');
        if (idx < currentStageIndex) {
          stn.classList.add('completed');
        } else if (idx === currentStageIndex) {
          stn.classList.add('active');
          stn.setAttribute('aria-selected', 'true');
        }
      });

      if (btnPrev) btnPrev.disabled = currentStageIndex <= 0;
      if (btnNext) btnNext.disabled = currentStageIndex >= stages.length - 1;
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentStageIndex > 0) {
          currentStageIndex--;
          updateDossierUI();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentStageIndex < stages.length - 1) {
          currentStageIndex++;
          updateDossierUI();
        }
      });
    }

    if (btnCycle) {
      btnCycle.addEventListener('click', () => {
        currentCandidateIndex = (currentCandidateIndex + 1) % candidates.length;
        currentStageIndex = candidates[currentCandidateIndex].stageIndex;
        updateDossierUI();
      });
    }

    stations.forEach((stn) => {
      stn.addEventListener('click', () => {
        const targetStage = parseInt(stn.getAttribute('data-stage'), 10);
        if (!isNaN(targetStage)) {
          currentStageIndex = targetStage;
          updateDossierUI();
        }
      });
    });

    // Dossier Tabs
    const tabs = heroDossier.querySelectorAll('.dossier-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    updateDossierUI();
  }

  // ---------------------------------------------------------------------------
  // 5. STAR Evidence Matrix (Filter Tabs, Stage Citation Linking & Simulation)
  // ---------------------------------------------------------------------------
  let currentActiveDomain = 'systems';
  let evidenceDataGlobal = null;

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
        summary: 'Use during systems architecture and concurrency rounds to demonstrate measured performance engineering under real production load.',
        stageLinks: [
          'Linked: <strong>SITUATION</strong> → Incident Record #804 (1,800ms tail latency spike under load)',
          'Linked: <strong>TASK</strong> → Service Level Objective: 20k events/sec with sub-50ms p99',
          'Linked: <strong>ACTION</strong> → Go memory-mapped buffer pooling & Kafka partition re-indexing',
          'Linked: <strong>RESULT</strong> → 22k events/sec verified @ 18ms p99; $14k/mo cloud savings'
        ]
      },
      perf: {
        situation: 'Core web portal experienced 4.2s First Contentful Paint and high layout thrashing across complex nested data tables on lower-tier laptops.',
        task: 'Optimize client runtime bundle size and render pipeline to achieve sub-1.2s FCP and 0 Cumulative Layout Shift.',
        action: 'Extracted critical CSS into inline style packets, virtualized table rows with intersection observers, and tree-shook 140kB of unreferenced vendor dependencies.',
        result: 'Reduced FCP to 820ms; increased client Core Web Vitals score from 58 to 99; reduced edge bandwidth consumption by 38%.',
        title: 'Zero-Jank Virtualized Render Engine',
        tags: 'TAGS: TypeScript, Tree-Shaking, Edge-CDN, WebVitals',
        summary: 'Highlight during frontend architecture and client performance loops to prove rigorous engineering discipline.',
        stageLinks: [
          'Linked: <strong>SITUATION</strong> → Core Web Vitals Audit (4.2s FCP, 0.42 CLS layout shift)',
          'Linked: <strong>TASK</strong> → Performance Target: sub-1.2s FCP, 0 CLS, 60fps frame rate',
          'Linked: <strong>ACTION</strong> → Virtualized DOM intersection observers & CSS inline packets',
          'Linked: <strong>RESULT</strong> → 820ms FCP, 99 Lighthouse performance score verified'
        ]
      },
      security: {
        situation: 'Previous team stored raw API client credentials directly in repository environment files, creating exposure risks during team onboarding.',
        task: 'Design an automated scoped credential rotation protocol with zero plaintext persistence in source control.',
        action: 'Implemented automated time-bound ephemeral token generation, short-lived session grants, and client-side secret rotation checks.',
        result: 'Eliminated static credential leaks; reduced credential provisioning latency by 80% with verified audit trail.',
        title: 'Scoped Credential Rotation Protocol',
        tags: 'TAGS: OAuth2, Ephemeral-Tokens, Least-Privilege, IAM',
        summary: 'Demonstrate during systems and security discussions your understanding of least privilege, token lifecycles, and credential hygiene.',
        stageLinks: [
          'Linked: <strong>SITUATION</strong> → Static credential exposure risk in git environment files',
          'Linked: <strong>TASK</strong> → Security Target: 0 plaintext tokens, automated short-lived leases',
          'Linked: <strong>ACTION</strong> → Time-bound ephemeral token rotation & scoped grant manager',
          'Linked: <strong>RESULT</strong> → 0 static credential leaks; 80% lower provisioning latency'
        ]
      },
      frontend: {
        situation: 'Application state occasionally lost unsaved candidate interview notes during intermittent network drops or abrupt browser tab closures.',
        task: 'Architect an offline-first client persistence engine with atomic snapshots and sub-millisecond local state synchronization.',
        action: 'Engineered single-snapshot atomic JSON commits via local storage with schema validation, transactional rollbacks on write failure, and optimistic UI updates.',
        result: 'Zero state loss across 10,000 simulated offline tests; instantaneous sub-5ms screen updates across mobile and desktop clients.',
        title: 'Offline-First Client Persistence Architecture',
        tags: 'TAGS: Local-First, State-Machine, JSON-Schema, Flutter-Web',
        summary: 'Cite during client architecture debriefs to show how offline-first resilience eliminates data loss and ensures snappy responsiveness.',
        stageLinks: [
          'Linked: <strong>SITUATION</strong> → Unsaved interview debrief lost during sudden tab closure',
          'Linked: <strong>TASK</strong> → Persistence Target: Zero data loss, sub-5ms atomic commits',
          'Linked: <strong>ACTION</strong> → Local single-snapshot JSON commits with transactional rollback',
          'Linked: <strong>RESULT</strong> → 0 data loss across 10,000 runs; sub-5ms screen updates'
        ]
      }
    };

    evidenceDataGlobal = evidenceData;

    const filterBtns = starSection.querySelectorAll('.matrix-filter-btn');
    const sitEl = document.getElementById('star-situation');
    const taskEl = document.getElementById('star-task');
    const actEl = document.getElementById('star-action');
    const resEl = document.getElementById('star-result');
    const citTitleEl = document.getElementById('citation-title');
    const citTagsEl = document.getElementById('citation-tags');
    const citSummaryEl = document.getElementById('citation-summary');
    const citLinkText = document.getElementById('citation-link-text');

    const btnSimulate = document.getElementById('btn-cite-simulation');
    const feedbackEl = document.getElementById('citation-feedback');

    function applyDomainData(domain) {
      currentActiveDomain = domain;
      const data = evidenceData[domain] || evidenceData.systems;

      if (sitEl) sitEl.textContent = data.situation;
      if (taskEl) taskEl.textContent = data.task;
      if (actEl) actEl.textContent = data.action;
      if (resEl) resEl.textContent = data.result;
      if (citTitleEl) citTitleEl.textContent = data.title;
      if (citTagsEl) citTagsEl.textContent = data.tags;
      if (citSummaryEl) citSummaryEl.textContent = data.summary;
      if (citLinkText && data.stageLinks) {
        citLinkText.innerHTML = data.stageLinks[0];
      }
      if (feedbackEl) feedbackEl.style.display = 'none';
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const domain = btn.getAttribute('data-domain');
        applyDomainData(domain);
      });
    });

    if (btnSimulate && feedbackEl) {
      btnSimulate.addEventListener('click', () => {
        btnSimulate.style.transform = 'scale(0.96)';
        setTimeout(() => {
          btnSimulate.style.transform = 'scale(1)';
        }, 120);
        feedbackEl.style.display = 'block';
        feedbackEl.textContent = '✓ Citation attached to active candidate briefing!';
        feedbackEl.style.opacity = '0';
        feedbackEl.style.transform = 'translateY(6px)';
        feedbackEl.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        requestAnimationFrame(() => {
          feedbackEl.style.opacity = '1';
          feedbackEl.style.transform = 'translateY(0)';
        });
      });
    }

    applyDomainData('systems');
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
          }
        ],
        evidence: [
          {
            id: 'ev-telemetry-01',
            title: 'High-Throughput Ingestion Engine Optimization',
            tags: ['Go', 'Kafka', 'Prometheus', 'Distributed-Storage'],
            result: 'Engineered distributed Kafka event pipeline handling 22k events/sec with 18ms p99 latency.'
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
  // 7. Scroll-Driven Narrative Chapters Controller (Core Cinematic Motion)
  // ---------------------------------------------------------------------------
  function initScrollNarrativeChapters() {
    if (isReducedMotion) {
      // In reduced motion, ensure all elements settle in full static readability
      const scrollBar = document.getElementById('pipeline-scroll-bar');
      const carriage = document.getElementById('pipeline-rail-carriage');
      const seal = document.getElementById('star-assembly-seal');
      const flap = document.getElementById('vault-envelope-flap');
      const waxSeal = document.getElementById('vault-wax-seal');
      const drawer = document.getElementById('vault-code-drawer');
      const heroDossier = document.getElementById('hero-dossier-card');
      const u1 = document.getElementById('hero-underlay-1');
      const u2 = document.getElementById('hero-underlay-2');
      const tab = document.getElementById('hero-dossier-tab');

      if (scrollBar) scrollBar.style.transform = 'scaleX(1)';
      if (carriage) carriage.style.transform = 'translateX(0px)';
      if (seal) { seal.style.transform = 'scale(1) rotate(0deg)'; seal.style.opacity = '1'; }
      if (flap) { flap.style.transform = 'none'; flap.style.opacity = '1'; }
      if (waxSeal) { waxSeal.style.transform = 'none'; waxSeal.style.opacity = '1'; }
      if (drawer) { drawer.style.transform = 'none'; drawer.style.opacity = '1'; }
      if (heroDossier) heroDossier.style.transform = 'none';
      if (u1) u1.style.transform = 'none';
      if (u2) u2.style.transform = 'none';
      if (tab) tab.style.transform = 'none';

      document.querySelectorAll(
        '.star-fragment, .vault-doc-sheet, .closing-dossier-leaf, .app-tour-card, .lit-word'
      ).forEach((el) => {
        el.style.transform = 'none';
        el.style.opacity = '1';
        if (el.classList.contains('lit-word')) el.classList.add('is-lit');
      });

      return;
    }

    const heroDossier = document.getElementById('hero-dossier-card');
    const heroUnderlay1 = document.getElementById('hero-underlay-1');
    const heroUnderlay2 = document.getElementById('hero-underlay-2');
    const heroFolderTab = document.getElementById('hero-dossier-tab');
    const draftingOverlay = document.getElementById('drafting-overlay');

    // Chapter 1 Elements
    const chapter1 = document.getElementById('milestones');
    const scrollBar = document.getElementById('pipeline-scroll-bar');
    const carriage = document.getElementById('pipeline-rail-carriage');
    const trackWrapper = document.getElementById('pipeline-rail-track-wrapper');
    const telemetryText = document.getElementById('pipeline-telemetry-text');
    const runwayCards = document.querySelectorAll('.pipeline-runway-card');

    // Chapter 2 Elements
    const chapter2 = document.getElementById('star-matrix');
    const starTrack = document.getElementById('star-scroll-track');
    const fragS = document.getElementById('star-frag-situation');
    const fragT = document.getElementById('star-frag-task');
    const fragA = document.getElementById('star-frag-action');
    const fragR = document.getElementById('star-frag-result');
    const assemblySeal = document.getElementById('star-assembly-seal');
    const citePill = document.getElementById('citation-stage-pill');
    const citeLinkText = document.getElementById('citation-link-text');
    const linkST = document.getElementById('link-s-t');
    const linkSA = document.getElementById('link-s-a');
    const linkTR = document.getElementById('link-t-r');
    const linkAR = document.getElementById('link-a-r');

    // Chapter 3 Elements
    const chapter3 = document.getElementById('privacy-vault');
    const flap = document.getElementById('vault-envelope-flap');
    const waxSeal = document.getElementById('vault-wax-seal');
    const codeDrawer = document.getElementById('vault-code-drawer');
    const docPipeline = document.getElementById('vault-doc-pipeline');
    const docEvidence = document.getElementById('vault-doc-evidence');
    const docNotes = document.getElementById('vault-doc-notes');
    const stepPills = document.querySelectorAll('.vault-step-pill');

    // Chapter 4 Elements
    const chapter4 = document.getElementById('app-tour');
    const desktopGalleryCard = document.querySelector('.app-tour-card.desktop-card');
    const mobileGalleryCard = document.querySelector('.app-tour-card.mobile-card');

    // Chapter 5 Elements
    const chapter5 = document.getElementById('closing-cta');
    const leafLeft = document.getElementById('closing-leaf-left');
    const leafRight = document.getElementById('closing-leaf-right');
    const litWords = document.querySelectorAll('.closing-monumental-title .lit-word');
    const ctaComposition = document.getElementById('closing-dossier-composition');

    const stageNames = [
      '01 // SAVED DISCOVERY',
      '02 // APPLIED TRACKING',
      '03 // SCREENING SIZING',
      '04 // TECHNICAL INTERVIEW',
      '05 // WRITTEN OFFER',
      '06 // ARCHIVAL DEBRIEF'
    ];

    const starStageLabels = [
      'STAGE 1/4 // SITUATION AUDIT',
      'STAGE 2/4 // TARGET SPECIFICATION',
      'STAGE 3/4 // ARCHITECTURAL EXECUTION',
      'STAGE 4/4 // QUANTIFIED IMPACT CITATION'
    ];

    let ticking = false;

    function getSectionProgress(el) {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight * 0.85;
      const total = rect.height + windowHeight * 0.5;
      const current = start - rect.top;
      return Math.max(0, Math.min(1, current / total));
    }

    function updateScrollAnimations() {
      const scrollY = window.scrollY;

      // 1. Hero 3D Perspective Parallax & Layered Dossier Spread
      if (heroDossier) {
        if (scrollY < window.innerHeight * 1.25) {
          const heroProgress = Math.min(1, Math.max(0, scrollY / (window.innerHeight * 0.75)));
          const rotY = -6 + heroProgress * 11;
          const rotX = 4 - heroProgress * 7;
          const transY = scrollY * 0.12;
          const scale = Math.max(0.92, 1 - heroProgress * 0.08);
          heroDossier.style.transform = `perspective(1200px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translateY(${transY.toFixed(1)}px) scale(${scale.toFixed(3)})`;

          if (heroUnderlay1) {
            const u1Rot = (-1.5 - heroProgress * 4.5).toFixed(2);
            const u1X = Math.round(-heroProgress * 30);
            const u1Y = Math.round(heroProgress * 14);
            heroUnderlay1.style.transform = `rotate(${u1Rot}deg) translate(${u1X}px, ${u1Y}px)`;
          }

          if (heroUnderlay2) {
            const u2Rot = (3 + heroProgress * 3.8).toFixed(2);
            const u2X = Math.round(heroProgress * 26);
            const u2Y = Math.round(heroProgress * 18);
            heroUnderlay2.style.transform = `rotate(${u2Rot}deg) translate(${u2X}px, ${u2Y}px)`;
          }

          if (heroFolderTab) {
            const tabY = Math.round(-heroProgress * 8);
            heroFolderTab.style.transform = `translateY(${tabY}px)`;
          }
        }
      }

      // Parallax Drafting Grid Overlay
      if (draftingOverlay) {
        draftingOverlay.style.transform = `translateY(${(scrollY * 0.1).toFixed(1)}px)`;
      }

      // Ensure Closing CTA and Footer columns reveal when scrolling near bottom of page
      if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - 250) {
        document.querySelectorAll('.motion-cta-card, .motion-footer-col, .motion-footer-grid, #closing-dossier-composition').forEach((el) => {
          el.classList.add('is-revealed');
        });
      }

      // 2. Chapter 1: The Six-Stage Career Pipeline Runway
      if (chapter1 && scrollBar && carriage && trackWrapper) {
        const p1 = getSectionProgress(chapter1);
        scrollBar.style.transform = `scaleX(${p1.toFixed(3)})`;

        const trackWidth = trackWrapper.clientWidth - 28;
        const carriageX = Math.round(p1 * trackWidth);
        carriage.style.transform = `translateX(${carriageX}px)`;

        const activeStage = Math.min(5, Math.floor(p1 * 6));
        runwayCards.forEach((card, idx) => {
          card.classList.remove('active', 'completed');
          if (idx < activeStage) {
            card.classList.add('completed');
          } else if (idx === activeStage) {
            card.classList.add('active');
          }
        });

        if (telemetryText) {
          telemetryText.textContent = `ACTIVE: ${stageNames[activeStage]}`;
        }
      }

      // 3. Chapter 2: The STAR Evidence Assembly Deck & Pinned Stage
      if (chapter2 && fragS && fragT && fragA && fragR && assemblySeal) {
        let p2;
        if (window.innerWidth >= 992 && starTrack) {
          const trackRect = starTrack.getBoundingClientRect();
          const scrollDist = trackRect.height - window.innerHeight;
          p2 = scrollDist > 0 ? Math.max(0, Math.min(1, -trackRect.top / scrollDist)) : 0;
        } else {
          p2 = getSectionProgress(chapter2);
        }

        const assembleFactor = Math.max(0, Math.min(1, (p2 - 0.15) / 0.65));
        const invertFactor = 1 - assembleFactor;

        // Situation Fragment
        const sX = Math.round(-85 * invertFactor);
        const sY = Math.round(35 * invertFactor);
        const sRot = (-7 * invertFactor).toFixed(1);
        const sOp = (0.50 + 0.50 * assembleFactor).toFixed(2);
        fragS.style.transform = `translate3d(${sX}px, ${sY}px, 0) rotate(${sRot}deg)`;
        fragS.style.opacity = sOp;

        // Task Fragment
        const tX = Math.round(85 * invertFactor);
        const tY = Math.round(30 * invertFactor);
        const tRot = (6 * invertFactor).toFixed(1);
        const tOp = (0.50 + 0.50 * assembleFactor).toFixed(2);
        fragT.style.transform = `translate3d(${tX}px, ${tY}px, 0) rotate(${tRot}deg)`;
        fragT.style.opacity = tOp;

        // Action Fragment
        const aX = Math.round(-75 * invertFactor);
        const aY = Math.round(-30 * invertFactor);
        const aRot = (5 * invertFactor).toFixed(1);
        const aOp = (0.50 + 0.50 * assembleFactor).toFixed(2);
        fragA.style.transform = `translate3d(${aX}px, ${aY}px, 0) rotate(${aRot}deg)`;
        fragA.style.opacity = aOp;

        // Result Fragment
        const rX = Math.round(80 * invertFactor);
        const rY = Math.round(-40 * invertFactor);
        const rRot = (-6 * invertFactor).toFixed(1);
        const rOp = (0.50 + 0.50 * assembleFactor).toFixed(2);
        fragR.style.transform = `translate3d(${rX}px, ${rY}px, 0) rotate(${rRot}deg)`;
        fragR.style.opacity = rOp;

        // Verification Seal Stamp
        const sealScale = (0.35 + 0.65 * assembleFactor).toFixed(2);
        const sealRot = Math.round(-35 * invertFactor);
        const sealOp = Math.max(0, (assembleFactor - 0.20) / 0.80).toFixed(2);
        assemblySeal.style.transform = `scale(${sealScale}) rotate(${sealRot}deg)`;
        assemblySeal.style.opacity = sealOp;

        // Dynamic SVG Line stroke-dashoffset
        const dashOffset = Math.round(100 * invertFactor);
        if (linkST) linkST.style.strokeDashoffset = dashOffset;
        if (linkSA) linkSA.style.strokeDashoffset = dashOffset;
        if (linkTR) linkTR.style.strokeDashoffset = dashOffset;
        if (linkAR) linkAR.style.strokeDashoffset = dashOffset;

        // Active Stage and Live Citation Link transition alongside scroll
        const activeStarIdx = Math.min(3, Math.floor(assembleFactor * 4));
        [fragS, fragT, fragA, fragR].forEach((frag, idx) => {
          if (frag) {
            if (idx === activeStarIdx) frag.classList.add('active');
            else frag.classList.remove('active');
          }
        });

        if (citePill) {
          citePill.textContent = starStageLabels[activeStarIdx];
        }

        if (citeLinkText && evidenceDataGlobal && evidenceDataGlobal[currentActiveDomain]) {
          const domainLinks = evidenceDataGlobal[currentActiveDomain].stageLinks;
          if (domainLinks && domainLinks[activeStarIdx]) {
            citeLinkText.innerHTML = domainLinks[activeStarIdx];
          }
        }
      }

      // 4. Chapter 3: Sovereign Dossier Vault & Dimensional Local Folding
      if (chapter3 && flap && waxSeal && codeDrawer) {
        const p3 = getSectionProgress(chapter3);
        const sealFactor = Math.max(0, Math.min(1, (p3 - 0.15) / 0.65));
        const invertSeal = 1 - sealFactor;

        // Collectable Document Sheets glide into the pocket
        const docFactor = Math.min(1, p3 / 0.45);
        const invertDoc = 1 - docFactor;
        if (docPipeline) {
          const d1Y = Math.round(-45 * invertDoc);
          const d1RotX = Math.round(10 * invertDoc);
          docPipeline.style.transform = `perspective(1000px) rotateX(${d1RotX}deg) translateY(${d1Y}px)`;
        }
        if (docEvidence) {
          const d2Y = Math.round(-25 * invertDoc);
          const d2RotX = Math.round(6 * invertDoc);
          docEvidence.style.transform = `perspective(1000px) rotateX(${d2RotX}deg) translateY(${d2Y}px)`;
        }
        if (docNotes) {
          docNotes.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
        }

        // Stepper pills coordination
        const activeStep = p3 < 0.35 ? 0 : (p3 < 0.70 ? 1 : 2);
        stepPills.forEach((pill, idx) => {
          if (idx === activeStep) pill.classList.add('active');
          else pill.classList.remove('active');
        });

        // Flap Folds Down: -75deg -> 0deg
        const flapRotX = Math.round(-75 * invertSeal);
        const flapOp = (0.7 + 0.3 * sealFactor).toFixed(2);
        flap.style.transform = `perspective(1000px) rotateX(${flapRotX}deg)`;
        flap.style.opacity = flapOp;

        // Wax Seal Stamps Down: translateY(-45px) -> 0px, scale(0.6) -> scale(1)
        const sealY = Math.round(-45 * invertSeal);
        const sealScale = (0.6 + 0.4 * sealFactor).toFixed(2);
        waxSeal.style.transform = `translateY(${sealY}px) scale(${sealScale})`;
        waxSeal.style.opacity = sealFactor.toFixed(2);

        // JSON Code Drawer / Manifest Slides Forward: translateY(35px) -> 0px
        const drawerY = Math.round(35 * invertSeal);
        const drawerOp = (0.35 + 0.65 * sealFactor).toFixed(2);
        codeDrawer.style.transform = `translateY(${drawerY}px)`;
        codeDrawer.style.opacity = drawerOp;
      }

      // 5. Chapter 4: Product Craft & App Tour Gallery (Parallax + Perspective)
      if (chapter4 && desktopGalleryCard && mobileGalleryCard && window.innerWidth >= 768) {
        const p4 = getSectionProgress(chapter4);
        const deskY = Math.round((p4 - 0.5) * -40);
        const deskRotY = (-4 + (p4 - 0.5) * 8).toFixed(2);
        const deskRotX = (2 - (p4 - 0.5) * 4).toFixed(2);
        desktopGalleryCard.style.transform = `perspective(1200px) rotateY(${deskRotY}deg) rotateX(${deskRotX}deg) translateY(${deskY}px)`;

        const mobY = Math.round((p4 - 0.5) * -75);
        const mobRotY = (4 - (p4 - 0.5) * 8).toFixed(2);
        const mobRotX = (2 + (p4 - 0.5) * 4).toFixed(2);
        mobileGalleryCard.style.transform = `perspective(1200px) rotateY(${mobRotY}deg) rotateX(${mobRotX}deg) translateY(${mobY}px)`;
      }

      // 6. Section 05: Closing Sovereign Command CTA (Scroll-Lit Typography & 3D Dossier Leaves)
      if (chapter5) {
        const p5 = getSectionProgress(chapter5);

        // Word-by-word scroll lighting for monumental headline
        if (litWords && litWords.length > 0) {
          const litThreshold = Math.max(0, Math.min(1, (p5 - 0.10) / 0.65));
          const wordsToLight = Math.floor(litThreshold * litWords.length);
          litWords.forEach((word, idx) => {
            if (idx <= wordsToLight && p5 > 0.08) {
              word.classList.add('is-lit');
            } else {
              word.classList.remove('is-lit');
            }
          });
        }

        // 3D Dossier Spread Leaves Settling onto Carrier Deck
        const leafFactor = Math.min(1, Math.max(0, (p5 - 0.15) / 0.65));
        const invertLeaf = 1 - leafFactor;
        if (leafLeft) {
          const rotY = (-12 * invertLeaf).toFixed(1);
          const rotX = (4 * invertLeaf).toFixed(1);
          leafLeft.style.transform = `perspective(1400px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
        }
        if (leafRight) {
          const rotY = (12 * invertLeaf).toFixed(1);
          const rotX = (4 * invertLeaf).toFixed(1);
          leafRight.style.transform = `perspective(1400px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
        }

        if (ctaComposition && p5 > 0.08) {
          ctaComposition.classList.add('is-revealed');
        }
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial run to calculate starting positions
    updateScrollAnimations();
  }

  // ---------------------------------------------------------------------------
  // 8. Universal Motion Reveal Observer (Section Headers, Cards & Footers)
  // ---------------------------------------------------------------------------
  function initMotionRevealObserver() {
    const revealTargets = document.querySelectorAll(
      '.motion-header-group, .pipeline-runway-grid, .pipeline-runway-card, .matrix-filter-nav.motion-filter-group, ' +
      '.star-citation-panel.motion-citation-panel, .comparison-box.motion-compare-box, ' +
      '.app-tour-card.motion-gallery-card, .cta-card.motion-cta-card, .footer-grid.motion-footer-grid, ' +
      '.motion-footer-col, .motion-reading-section, .motion-reading-card'
    );

    if (!revealTargets.length) return;

    if (isReducedMotion) {
      revealTargets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    // Immediately reveal elements already inside or above the viewport on initial load or midpage reload
    const windowH = window.innerHeight;
    revealTargets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowH * 0.98) {
        el.classList.add('is-revealed');
        el.querySelectorAll('.pipeline-runway-card, .motion-footer-col').forEach((child) => {
          child.classList.add('is-revealed');
        });
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            entry.target.querySelectorAll('.pipeline-runway-card, .motion-footer-col').forEach((child) => {
              child.classList.add('is-revealed');
            });
          }
        });
      },
      {
        rootMargin: '50px 0px 50px 0px',
        threshold: 0.05
      }
    );

    revealTargets.forEach((el) => observer.observe(el));

    // Handle hash jumps so jumping to anchors immediately reveals target section
    function checkHashTarget() {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const headers = target.querySelectorAll('.motion-header-group, .is-revealed');
          headers.forEach((h) => h.classList.add('is-revealed'));
          target.querySelectorAll('.motion-card, .motion-compare-box, .motion-gallery-card').forEach((c) => {
            c.classList.add('is-revealed');
          });
        }
      }
    }

    window.addEventListener('hashchange', checkHashTarget, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // 9. Active Nav Link Intersection Observer
  // ---------------------------------------------------------------------------
  function initNavObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav .nav-link[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // ---------------------------------------------------------------------------
  // 10. Initialization Lifecycle
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initDossierCanvas();

    // Activate progressive enhancement motion classes if reduced motion is not requested
    if (!isReducedMotion) {
      document.documentElement.classList.add('js-motion-active');
    }

    initHeroDossier();
    initStarMatrix();
    initJsonDownload();
    initScrollNarrativeChapters();
    initMotionRevealObserver();
    initNavObserver();
  });
})();
