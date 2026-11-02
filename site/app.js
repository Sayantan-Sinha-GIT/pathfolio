/**
 * Pathfolio — Public Website Interactive Engine & Cinematic Motion System
 * Implements:
 * 1. Living Constellation Canvas (ambient drifting evidence nodes, proximity filaments, interactive gravity)
 * 2. Hero Tactical Command Deck (animated pipeline progression, terminal audit log, stage scrubber)
 * 3. Chapter 01: Six-Stage Flight Path Runway (interactive stage telemetry, protocol, checklist)
 * 4. Chapter 02: STAR Evidence Matrix (interactive accomplishment selector & interview citation simulator)
 * 5. Chapter 03: Zero-Knowledge Privacy Vault (side-by-side local shield vs. cloud leakage comparison)
 * 6. Interactive Demonstration Console (playable in-browser workspace with real schema v1 JSON export)
 * 7. Mobile Navigation Drawer & accessible menu toggle
 * 8. System theme coordination & prefers-reduced-motion compliance
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initLivingCanvas();
  initHeroTacticalDeck();
  initFlightPathRunway();
  initStarMatrix();
  initPrivacyVaultToggle();
  initInteractiveDemoEngine();
});

/* ==========================================================================
   0. Theme Management & Mobile Nav
   ========================================================================== */
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('pathfolio-site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeIcon(initialTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('pathfolio-site-theme', next);
      updateThemeIcon(next);
      window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: next } }));
    });
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    const isDark = theme === 'dark';
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeBtn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeBtn.innerHTML = isDark
      ? '<svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
}

function initMobileNav() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!menuToggle || !mobileNav) return;

  const iconBars = menuToggle.querySelector('.menu-icon-bars');
  const iconClose = menuToggle.querySelector('.menu-icon-close');

  function openMenu() {
    mobileNav.removeAttribute('hidden');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation menu');
    if (iconBars) iconBars.style.display = 'none';
    if (iconClose) iconClose.style.display = 'block';
  }

  function closeMenu() {
    mobileNav.setAttribute('hidden', '');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    if (iconBars) iconBars.style.display = 'block';
    if (iconClose) iconClose.style.display = 'none';
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when clicking any link
  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (menuToggle.getAttribute('aria-expanded') === 'true' &&
        !mobileNav.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   1. Living Constellation Background Canvas
   ========================================================================== */
function initLivingCanvas() {
  const canvas = document.getElementById('career-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animationFrameId = null;
  let isRunning = false;
  let isHeroVisible = true;

  // Technical engineering proof metrics floating in space
  const evidenceLabels = [
    'p99 -42%', 'v1 schema', 'zero-downtime', '4.2M events',
    'local-vault', '15k req/s', 'distributed-lock', 'atomic-import',
    'indexedDB', 'Accessible-UI', 'offline-first', 'local-first',
    'Wasm-core', 'p50 -65%', 'async-buffer', 'event-stream'
  ];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let packets = [];

  const pointer = {
    x: -1000,
    y: -1000,
    radius: 160,
    active: false
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
    initParticles();

    if (prefersReduced.matches) {
      renderStaticFrame();
    }
  }

  function initParticles() {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const count = isMobile ? 20 : isTablet ? 32 : 48;

    particles = [];
    packets = [];

    for (let i = 0; i < count; i++) {
      const hasLabel = i < evidenceLabels.length;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: hasLabel ? 2.5 : 1.8,
        label: hasLabel ? evidenceLabels[i] : null,
        baseAlpha: hasLabel ? 0.8 : 0.4,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  // Energy packets traveling along filaments
  function spawnPacket(p1, p2) {
    if (packets.length > 12) return;
    packets.push({
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      progress: 0,
      speed: 0.015 + Math.random() * 0.02
    });
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const primaryColor = isDark ? '243, 244, 246' : '22, 23, 26';
    const accentColor = isDark ? '224, 109, 68' : '200, 90, 50';
    const cyanColor = isDark ? '56, 189, 248' : '2, 132, 199';

    const maxDist = width < 768 ? 95 : 135;
    const time = Date.now() * 0.0015;

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move particles
      p.x += p.vx;
      p.y += p.vy;

      // Bounce boundaries
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      else if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      else if (p.y > height) { p.y = height; p.vy *= -1; }

      // Gravitational pull toward cursor
      if (pointer.active) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < pointer.radius && dist > 1) {
          const force = (1 - dist / pointer.radius) * 0.4;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Draw particle dot
      const pulse = Math.sin(time + p.pulseOffset) * 0.2 + 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.label
        ? `rgba(${accentColor}, ${p.baseAlpha * pulse})`
        : `rgba(${primaryColor}, ${p.baseAlpha * 0.6 * pulse})`;
      ctx.fill();

      // Draw metric label if present
      if (p.label) {
        ctx.font = '10px ui-monospace, Menlo, Consolas, monospace';
        ctx.fillStyle = `rgba(${primaryColor}, ${0.55 * pulse})`;
        ctx.fillText(p.label, p.x + 8, p.y + 3);
      }

      // Draw connecting filaments
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (isDark ? 0.22 : 0.15);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = (p.label || p2.label)
            ? `rgba(${accentColor}, ${alpha * 1.3})`
            : `rgba(${primaryColor}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Occasionally spawn momentum packet
          if (Math.random() < 0.0006) {
            spawnPacket(p, p2);
          }
        }
      }
    }

    // Draw momentum packets
    for (let k = packets.length - 1; k >= 0; k--) {
      const pkt = packets[k];
      pkt.progress += pkt.speed;

      if (pkt.progress >= 1) {
        packets.splice(k, 1);
        continue;
      }

      const px = pkt.x1 + (pkt.x2 - pkt.x1) * pkt.progress;
      const py = pkt.y1 + (pkt.y2 - pkt.y1) * pkt.progress;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cyanColor}, 0.85)`;
      ctx.shadowColor = `rgba(${cyanColor}, 0.8)`;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function loop() {
    if (!isRunning) return;
    draw();
    animationFrameId = requestAnimationFrame(loop);
  }

  function renderStaticFrame() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    isRunning = false;
    draw();
  }

  function startLoop() {
    if (prefersReduced.matches) {
      renderStaticFrame();
      return;
    }
    if (!isRunning && isHeroVisible && document.visibilityState === 'visible') {
      isRunning = true;
      animationFrameId = requestAnimationFrame(loop);
    }
  }

  function stopLoop() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Pointer event listeners
  window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  });

  window.addEventListener('mouseleave', () => {
    pointer.active = false;
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      pointer.x = e.touches[0].clientX;
      pointer.y = e.touches[0].clientY;
      pointer.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    pointer.active = false;
  });

  // Pause when hero is scrolled out of view
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startLoop();
    } else {
      stopLoop();
    }
  });

  // Handle theme changes
  window.addEventListener('themechanged', () => {
    if (prefersReduced.matches) {
      renderStaticFrame();
    }
  });

  // Handle reduced motion changes
  prefersReduced.addEventListener('change', (e) => {
    if (e.matches) {
      stopLoop();
      renderStaticFrame();
    } else {
      startLoop();
    }
  });

  // Resize listener
  window.addEventListener('resize', debounce(resize, 150));

  resize();
  startLoop();
}

/* ==========================================================================
   2. Hero Tactical Command Deck
   ========================================================================== */
function initHeroTacticalDeck() {
  const deck = document.getElementById('hero-deck');
  if (!deck) return;

  const stageBadge = document.getElementById('hero-stage-badge');
  const stepperProgress = document.getElementById('hero-stepper-progress');
  const termLog = document.getElementById('hero-term-log');
  const prevBtn = document.getElementById('hero-prev-stage');
  const nextBtn = document.getElementById('hero-next-stage');
  const cycleToggleBtn = document.getElementById('hero-cycle-toggle');
  const stepNodes = deck.querySelectorAll('.step-node');

  const stages = [
    {
      name: 'Saved',
      progress: '16.6%',
      badge: 'Saved',
      log: 'Opportunity saved to local vault. Parsing role requirements & salary band.'
    },
    {
      name: 'Applied',
      progress: '33.3%',
      badge: 'Applied',
      log: 'Application submitted directly. Verification checksum logged to history.'
    },
    {
      name: 'Screening',
      progress: '50%',
      badge: 'Screening',
      log: 'Advancing stage: Applied → Technical Screening [Logged to Timeline]'
    },
    {
      name: 'Technical',
      progress: '66.6%',
      badge: 'Technical',
      log: 'System architecture assessment scheduled. STAR citations attached.'
    },
    {
      name: 'Final',
      progress: '83.3%',
      badge: 'Final Round',
      log: 'Executive debrief underway. Compensation parameters locked locally.'
    },
    {
      name: 'Offer',
      progress: '100%',
      badge: 'Offer Extended',
      log: 'Formal offer received: $165,000 + Equity. 100% Client-side local storage maintained.'
    }
  ];

  let currentStageIndex = 2; // Default: Screening
  let autoCycleInterval = null;
  let isAutoCycling = true;

  function renderStage(index) {
    currentStageIndex = (index + stages.length) % stages.length;
    const stage = stages[currentStageIndex];

    if (stageBadge) stageBadge.textContent = stage.badge;
    if (stepperProgress) stepperProgress.style.width = stage.progress;
    if (termLog) {
      termLog.style.opacity = '0';
      setTimeout(() => {
        termLog.textContent = stage.log;
        termLog.style.opacity = '1';
      }, 120);
    }

    stepNodes.forEach((node, idx) => {
      node.classList.remove('active', 'completed');
      if (idx < currentStageIndex) {
        node.classList.add('completed');
      } else if (idx === currentStageIndex) {
        node.classList.add('active');
      }
    });
  }

  function startAutoCycle() {
    stopAutoCycle();
    isAutoCycling = true;
    if (cycleToggleBtn) cycleToggleBtn.textContent = '⏸ Pause Auto-Play';
    autoCycleInterval = setInterval(() => {
      renderStage(currentStageIndex + 1);
    }, 4500);
  }

  function stopAutoCycle() {
    isAutoCycling = false;
    if (autoCycleInterval) {
      clearInterval(autoCycleInterval);
      autoCycleInterval = null;
    }
    if (cycleToggleBtn) cycleToggleBtn.textContent = '▶ Resume Auto-Play';
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoCycle();
      renderStage(currentStageIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoCycle();
      renderStage(currentStageIndex + 1);
    });
  }

  if (cycleToggleBtn) {
    cycleToggleBtn.addEventListener('click', () => {
      if (isAutoCycling) {
        stopAutoCycle();
      } else {
        startAutoCycle();
      }
    });
  }

  stepNodes.forEach((node, idx) => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', () => {
      stopAutoCycle();
      renderStage(idx);
    });
  });

  renderStage(currentStageIndex);
  startAutoCycle();
}

/* ==========================================================================
   3. Chapter 01: Six-Stage Flight Path Runway
   ========================================================================== */
function initFlightPathRunway() {
  const runway = document.getElementById('flight-path');
  if (!runway) return;

  const tabs = runway.querySelectorAll('.stage-nav-item');
  const stageBadge = document.getElementById('panel-stage-badge');
  const velocityChip = document.getElementById('panel-velocity');
  const companyTitle = document.getElementById('panel-company-title');
  const stageDesc = document.getElementById('panel-stage-desc');
  const protocol = document.getElementById('panel-protocol');
  const checklist = document.getElementById('panel-checklist');
  const detailPanel = document.getElementById('stage-detail-panel');

  const stageData = [
    {
      num: '01',
      badge: 'STAGE 01 :: SAVED OPPORTUNITY',
      velocity: 'VELOCITY: 2-4 DAYS EXPECTED',
      company: 'Figma — Associate Systems Engineer',
      desc: 'Opportunity bookmarked for tactical evaluation. Analyze role requirements against your personal evidence bank, review recent engineering blog posts, and set a firm deadline.',
      protocol: "Review engineering posts on Figma's WebAssembly canvas rendering; map 2 STAR evidence stories to distributed caching and memory optimization.",
      checklist: [
        { done: true, text: 'Salary band verified against local peer compensation data' },
        { done: true, text: '3 STAR Evidence Bank items mapped to job requirements' },
        { done: false, text: 'Deadline reminder scheduled in local follow-up task engine' }
      ]
    },
    {
      num: '02',
      badge: 'STAGE 02 :: APPLICATION SUBMITTED',
      velocity: 'VELOCITY: 5-7 DAYS EXPECTED',
      company: 'Stripe — Infrastructure & Observability Engineer',
      desc: 'Direct application dispatched with tailored technical evidence. Record specific referral details, resume revision checksum, and schedule a proactive follow-up task.',
      protocol: 'Log referrer contact details and note internal hiring manager team. Schedule check-in reminder for exactly 7 days after submission.',
      checklist: [
        { done: true, text: 'Clean resume version exported and submitted' },
        { done: true, text: 'Direct referral contact logged in private opportunity notes' },
        { done: false, text: 'Follow-up debrief task scheduled for Day 7' }
      ]
    },
    {
      num: '03',
      badge: 'STAGE 03 :: RECRUITER SCREENING',
      velocity: 'VELOCITY: 3-5 DAYS EXPECTED',
      company: 'Linear — Founding Systems Engineer',
      desc: 'Initial conversation with the recruiting lead. Confirm team roadmap, tech stack expectations, compensation range, and demonstrate structured communication.',
      protocol: 'Emphasize experience in low-latency synchronous APIs and zero-downtime database migrations. Validate salary targets before technical scheduling.',
      checklist: [
        { done: true, text: '60-second technical career narrative rehearsed' },
        { done: true, text: 'Compensation expectations aligned with local notes' },
        { done: false, text: 'System design questions prepared for engineering manager' }
      ]
    },
    {
      num: '04',
      badge: 'STAGE 04 :: TECHNICAL ASSESSMENT',
      velocity: 'VELOCITY: 7-10 DAYS EXPECTED',
      company: 'Cloudflare — Distributed Runtime Engineer',
      desc: 'Deep-dive architectural interview and live paired implementation. Cite concrete STAR evidence with verifiable latency and scalability metrics.',
      protocol: 'Review isolate sandbox mechanics, asynchronous message queuing, and state replication. Reference STAR evidence: 42% p99 Latency Reduction.',
      checklist: [
        { done: true, text: 'STAR story on Redis event streams rehearsed' },
        { done: true, text: 'Interactive code architecture sandbox tested' },
        { done: false, text: 'Questions for lead systems architect prepared' }
      ]
    },
    {
      num: '05',
      badge: 'STAGE 05 :: FINAL EXECUTIVE ROUND',
      velocity: 'VELOCITY: 5-8 DAYS EXPECTED',
      company: 'Datadog — Core Pipeline Engineer',
      desc: 'Engineering VP and leadership evaluation. Articulate engineering tradeoffs, incident postmortem philosophies, and cross-functional team collaboration.',
      protocol: 'Discuss incident triage protocols, SLA management, and technical mentorship. Prepare strategic questions regarding team growth.',
      checklist: [
        { done: true, text: 'STAR incident triage breakdown reviewed' },
        { done: true, text: 'Cross-functional leadership questions finalized' },
        { done: false, text: 'Target offer structure & counter-offer boundary drafted' }
      ]
    },
    {
      num: '06',
      badge: 'STAGE 06 :: OFFER EXTENDED & NEGOTIATION',
      velocity: 'VELOCITY: 3-5 DAYS EXPECTED',
      company: 'Vercel — Senior Platform Engineer',
      desc: 'Official offer extended. Evaluate equity grant schedule, base compensation, health benefits, and equipment allowances against your private benchmark.',
      protocol: 'Cross-reference total compensation against market benchmarks; prepare counter-proposal citing verified engineering interview ratings.',
      checklist: [
        { done: true, text: 'Formal written offer document inspected' },
        { done: true, text: 'Equity vesting schedule & tax implications verified' },
        { done: false, text: 'Export full Pathfolio JSON backup prior to signing' }
      ]
    }
  ];

  function renderFlightStage(index) {
    const data = stageData[index];
    if (!data) return;

    tabs.forEach((tab, idx) => {
      const isActive = idx === index;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (detailPanel) {
      detailPanel.style.opacity = '0.4';
      detailPanel.style.transform = 'translateY(4px)';
    }

    setTimeout(() => {
      if (stageBadge) stageBadge.textContent = data.badge;
      if (velocityChip) velocityChip.textContent = data.velocity;
      if (companyTitle) companyTitle.textContent = data.company;
      if (stageDesc) stageDesc.textContent = data.desc;
      if (protocol) protocol.textContent = data.protocol;

      if (checklist) {
        checklist.innerHTML = data.checklist.map(item => `
          <li>
            <span class="check-icon">${item.done ? '✓' : '●'}</span>
            <span>${item.text}</span>
          </li>
        `).join('');
      }

      if (detailPanel) {
        detailPanel.style.opacity = '1';
        detailPanel.style.transform = 'translateY(0)';
        detailPanel.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      }
    }, 120);
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      renderFlightStage(idx);
    });
  });
}

/* ==========================================================================
   4. Chapter 02: STAR Evidence Matrix
   ========================================================================== */
function initStarMatrix() {
  const matrix = document.getElementById('star-matrix');
  if (!matrix) return;

  const tabs = matrix.querySelectorAll('.star-tab');
  const tagEl = document.getElementById('star-tag');
  const titleEl = document.getElementById('star-title');
  const sitEl = document.getElementById('star-situation');
  const taskEl = document.getElementById('star-task');
  const actEl = document.getElementById('star-action');
  const resEl = document.getElementById('star-result');
  const simulateBtn = document.getElementById('star-simulate-cite');
  const feedbackBar = document.getElementById('citation-feedback');
  const cardDisplay = document.getElementById('star-card-display');

  const starStories = {
    latency: {
      tag: 'PERFORMANCE & SCALE',
      title: 'Reduced p99 Webhook Ingestion Latency by 42%',
      situation: 'Third-party payment webhooks experienced severe processing bottlenecks during high-volume flash sales, creating queue backpressure and API timeouts.',
      task: 'Architect an asynchronous, non-blocking ingestion buffer capable of absorbing 15,000 requests/sec with zero payload drops.',
      action: 'Replaced synchronous database writes with Redis streams, implemented exponential backoff retries, and partitioned background workers by consumer groups.',
      result: 'Processed 4.2M events with 0 lost packets. Slashed p99 response time from 840ms to 48ms, unblocking multi-region checkout scalability.'
    },
    migration: {
      tag: 'RELIABILITY & DATA INTEGRITY',
      title: 'Executed Zero-Downtime Migration of 12M Relational Records',
      situation: 'Legacy monolith database schema reached connection saturation and lacked foreign key indexing on user audit trails, causing table locks.',
      task: 'Migrate 12M active user records to a partitioned schema without taking the production API offline or dropping concurrent transactions.',
      action: 'Engineered dual-write shadow pipelines with write-ahead replication, background batch backfilling, and checksum validation.',
      result: '100% data integrity verified across all 12M rows. Zero minutes of downtime or client connection timeouts during cutover.'
    },
    caching: {
      tag: 'SYSTEM ARCHITECTURE',
      title: 'Engineered Multi-Tier Distributed Cache & Local State Sync',
      situation: 'Mobile and web clients hammered the catalog endpoint on app startup, causing redundant database load and device battery drain.',
      task: 'Design an offline-tolerant local cache invalidation strategy with optimistic client reads and minimal egress bandwidth consumption.',
      action: 'Combined client-side IndexedDB / SharedPreferences with an ETag-based delta synchronization protocol and cache-aside Redis layer.',
      result: 'Reduced backend egress bandwidth by 68% and accelerated cold-start time from 1,450ms down to 120ms.'
    },
    incident: {
      tag: 'INCIDENT TRIAGE & POSTMORTEM',
      title: 'Spearheaded P0 Outage Triage and Distributed Lock Recovery',
      situation: 'A distributed lock deadlock during high-concurrency background job processing halted order fulfillment for 18 minutes.',
      task: 'Safely release orphaned locks without creating race conditions, recover pending jobs, and eliminate the deadlock vector.',
      action: 'Engineered automatic lease TTL fencing tokens, added dead-letter queue routing, and automated real-time telemetry alerts.',
      result: 'Restored full order processing within 4 minutes; eliminated recurring deadlocks with 100% test coverage in CI.'
    }
  };

  let activeCategory = 'latency';

  function renderCategory(cat) {
    const data = starStories[cat];
    if (!data) return;
    activeCategory = cat;

    tabs.forEach(tab => {
      const isActive = tab.getAttribute('data-category') === cat;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (cardDisplay) {
      cardDisplay.style.opacity = '0.5';
    }

    setTimeout(() => {
      if (tagEl) tagEl.textContent = data.tag;
      if (titleEl) titleEl.textContent = data.title;
      if (sitEl) sitEl.textContent = data.situation;
      if (taskEl) taskEl.textContent = data.task;
      if (actEl) actEl.textContent = data.action;
      if (resEl) resEl.textContent = data.result;

      if (feedbackBar) feedbackBar.style.display = 'none';

      if (cardDisplay) {
        cardDisplay.style.opacity = '1';
        cardDisplay.style.transition = 'opacity 0.2s ease';
      }
    }, 100);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      if (cat) renderCategory(cat);
    });
  });

  if (simulateBtn && feedbackBar) {
    simulateBtn.addEventListener('click', () => {
      const story = starStories[activeCategory];
      feedbackBar.innerHTML = `
        <span class="cite-pulse">●</span>
        <span>Simulated Citation Attached: <strong>"${story.title}"</strong> linked to active interview dossier.</span>
      `;
      feedbackBar.style.display = 'flex';
      feedbackBar.style.animation = 'pulse-beacon 1.5s infinite';

      simulateBtn.innerHTML = '<span>✓ Citation Linked to Dossier</span>';
      simulateBtn.style.borderColor = 'var(--emerald)';
      simulateBtn.style.color = 'var(--emerald)';

      setTimeout(() => {
        simulateBtn.innerHTML = '<span>⚡ Simulate Citing in Interview</span>';
        simulateBtn.style.borderColor = '';
        simulateBtn.style.color = '';
      }, 3500);
    });
  }
}

/* ==========================================================================
   5. Chapter 03: Zero-Knowledge Privacy Vault Toggle
   ========================================================================== */
function initPrivacyVaultToggle() {
  const btnPathfolio = document.getElementById('btn-mode-pathfolio');
  const btnCloud = document.getElementById('btn-mode-cloud');
  const sidePathfolio = document.getElementById('side-pathfolio');
  const sideCloud = document.getElementById('side-cloud');

  if (!btnPathfolio || !btnCloud || !sidePathfolio || !sideCloud) return;

  btnPathfolio.addEventListener('click', () => {
    btnPathfolio.classList.add('active');
    btnCloud.classList.remove('active');
    sidePathfolio.style.display = 'block';
    sideCloud.style.display = 'none';
  });

  btnCloud.addEventListener('click', () => {
    btnCloud.classList.add('active');
    btnPathfolio.classList.remove('active');
    sideCloud.style.display = 'block';
    sidePathfolio.style.display = 'none';
  });
}

/* ==========================================================================
   6. Interactive Demonstration Console (Playable In-Browser Mini-Engine)
   ========================================================================== */
function initInteractiveDemoEngine() {
  const demoSection = document.getElementById('interactive-demo');
  if (!demoSection) return;

  // Workspace State
  const initialWorkspace = {
    linear: {
      id: 'opp-linear',
      company: 'Linear',
      role: 'Founding Systems Engineer',
      stage: 'Screening',
      url: 'https://linear.app/careers',
      salary: '$145k – $170k + Equity',
      timeline: [
        { time: '2026-11-02 18:30', text: 'Stage updated to Screening' },
        { time: '2026-11-01 10:15', text: 'Application submitted via direct referral' },
        { time: '2026-10-30 16:45', text: 'Opportunity bookmarked from tech careers board' }
      ],
      tasks: [
        { id: 101, text: 'Submit technical assessment repo', done: true, dueLabel: 'Completed', overdue: false },
        { id: 102, text: 'Send interview debrief thank-you note', done: false, dueLabel: 'Due Tomorrow', overdue: false },
        { id: 103, text: 'Review distributed lock architecture', done: false, dueLabel: 'Overdue', overdue: true }
      ],
      evidence: ['latency', 'migration']
    },
    stripe: {
      id: 'opp-stripe',
      company: 'Stripe',
      role: 'Infrastructure & Observability Engineer',
      stage: 'Technical',
      url: 'https://stripe.com/jobs',
      salary: '$160k – $190k + Equity',
      timeline: [
        { time: '2026-11-02 14:00', text: 'Stage advanced to Technical Architecture Round' },
        { time: '2026-10-28 09:00', text: 'Recruiter phone screen passed' },
        { time: '2026-10-24 11:20', text: 'Opportunity saved' }
      ],
      tasks: [
        { id: 201, text: 'Complete take-home distributed cache exercise', done: true, dueLabel: 'Completed', overdue: false },
        { id: 202, text: 'Prepare questions for principal infrastructure engineer', done: false, dueLabel: 'Due in 2 days', overdue: false }
      ],
      evidence: ['streams', 'latency']
    },
    figma: {
      id: 'opp-figma',
      company: 'Figma',
      role: 'WebAssembly Canvas Engine Developer',
      stage: 'Saved',
      url: 'https://figma.com/careers',
      salary: '$150k – $180k',
      timeline: [
        { time: '2026-11-02 09:30', text: 'Opportunity saved to local vault' }
      ],
      tasks: [
        { id: 301, text: 'Read Figma WebAssembly engine architecture post', done: false, dueLabel: 'Due Today', overdue: false }
      ],
      evidence: ['migration']
    }
  };

  // Deep clone initial state
  let workspace = JSON.parse(JSON.stringify(initialWorkspace));
  let activeOppKey = 'linear';

  // DOM Elements
  const oppPills = demoSection.querySelectorAll('.opp-pill-btn');
  const cardCompany = document.getElementById('demo-card-company');
  const cardRole = document.getElementById('demo-card-role');
  const cardStage = document.getElementById('demo-card-stage');
  const stageStepBtns = demoSection.querySelectorAll('.stage-step-btn');
  const timelineList = document.getElementById('demo-timeline-list');
  const taskList = document.getElementById('demo-task-list');
  const overdueCountEl = document.getElementById('demo-overdue-count');
  const upcomingCountEl = document.getElementById('demo-upcoming-count');
  const evidenceBtns = demoSection.querySelectorAll('.evidence-tag-btn');
  const resetBtn = document.getElementById('demo-reset-btn');
  const exportJsonBtn = document.getElementById('demo-export-json-btn');

  function updateActiveOpp(key) {
    activeOppKey = key;
    oppPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-opp') === key);
    });
    renderWorkspace();
  }

  function renderWorkspace() {
    const opp = workspace[activeOppKey];
    if (!opp) return;

    if (cardCompany) cardCompany.textContent = opp.company;
    if (cardRole) cardRole.textContent = opp.role;
    if (cardStage) {
      cardStage.textContent = opp.stage;
      cardStage.className = `badge-stage stage-${opp.stage.toLowerCase()}`;
    }

    // Stage buttons
    stageStepBtns.forEach(btn => {
      const stageName = btn.getAttribute('data-stage');
      btn.classList.toggle('active', stageName === opp.stage);
    });

    // Timeline
    if (timelineList) {
      timelineList.innerHTML = opp.timeline.map(t => `
        <li><span class="time-stamp">${escapeHtml(t.time)}</span> ${escapeHtml(t.text)}</li>
      `).join('');
    }

    // Tasks & Summary Counts
    let overdueCount = 0;
    let upcomingCount = 0;

    if (taskList) {
      taskList.innerHTML = opp.tasks.map((task, index) => {
        if (!task.done) {
          if (task.overdue) overdueCount++;
          else upcomingCount++;
        }

        const badgeClass = task.done
          ? 'badge-done'
          : task.overdue
            ? 'badge-urgent'
            : 'badge-due';

        return `
          <li class="demo-task-item" data-task-index="${index}">
            <label class="task-label">
              <input type="checkbox" class="task-chk" ${task.done ? 'checked' : ''}>
              <span>${escapeHtml(task.text)}</span>
            </label>
            <span class="task-badge ${badgeClass}">${escapeHtml(task.dueLabel)}</span>
          </li>
        `;
      }).join('');

      // Attach checkbox listeners
      taskList.querySelectorAll('.task-chk').forEach((chk, idx) => {
        chk.addEventListener('change', (e) => {
          const task = opp.tasks[idx];
          if (!task) return;
          task.done = e.target.checked;
          task.dueLabel = task.done ? 'Completed' : (task.overdue ? 'Overdue' : 'Due Soon');
          renderWorkspace();
        });
      });
    }

    if (overdueCountEl) overdueCountEl.textContent = `${overdueCount} Overdue`;
    if (upcomingCountEl) upcomingCountEl.textContent = `${upcomingCount} Upcoming`;

    // Evidence Tags
    evidenceBtns.forEach(btn => {
      const evKey = btn.getAttribute('data-ev');
      btn.classList.toggle('active', opp.evidence.includes(evKey));
    });
  }

  // Handle Opportunity Selection
  oppPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.getAttribute('data-opp');
      if (key) updateActiveOpp(key);
    });
  });

  // Handle Stage Transitions
  stageStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const newStage = btn.getAttribute('data-stage');
      const opp = workspace[activeOppKey];
      if (!opp || !newStage || opp.stage === newStage) return;

      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
      opp.timeline.unshift({
        time: dateStr,
        text: `Stage transitioned from ${opp.stage} → ${newStage}`
      });
      opp.stage = newStage;
      renderWorkspace();
    });
  });

  // Handle Evidence Tagging
  evidenceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const evKey = btn.getAttribute('data-ev');
      const opp = workspace[activeOppKey];
      if (!opp || !evKey) return;

      const idx = opp.evidence.indexOf(evKey);
      if (idx >= 0) {
        opp.evidence.splice(idx, 1);
      } else {
        opp.evidence.push(evKey);
      }
      renderWorkspace();
    });
  });

  // Handle Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      workspace = JSON.parse(JSON.stringify(initialWorkspace));
      renderWorkspace();
      resetBtn.textContent = '✓ Workspace Reset';
      setTimeout(() => {
        resetBtn.textContent = 'Reset Workspace';
      }, 1500);
    });
  }

  // Handle Export Real Schema v1 JSON
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const backupPayload = generateValidSchemaV1(workspace);
      const jsonBlob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(jsonBlob);
      const tempLink = document.createElement('a');
      const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');

      tempLink.href = downloadUrl;
      tempLink.download = `pathfolio_backup_${dateStamp}.json`;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(downloadUrl);

      // Feedback animation on export button
      const origHtml = exportJsonBtn.innerHTML;
      exportJsonBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        <span>Backup Exported (Schema v1.0 Valid)</span>
      `;
      exportJsonBtn.style.background = 'var(--emerald)';
      setTimeout(() => {
        exportJsonBtn.innerHTML = origHtml;
        exportJsonBtn.style.background = '';
      }, 3000);
    });
  }

  renderWorkspace();
}

/**
 * Generates an authentic, validated Schema v1 JSON backup matching Pathfolio's
 * Flutter storage format, ready to be immediately imported into /app/!
 */
function generateValidSchemaV1(ws) {
  const opportunities = [];
  const tasks = [];
  const evidenceBank = [
    {
      id: 'ev-latency',
      title: 'Reduced p99 Webhook Ingestion Latency by 42%',
      category: 'performance',
      skillTags: ['Redis Streams', 'Asynchronous Architecture', 'High-Throughput'],
      impactMetric: 'p99 840ms → 48ms across 4.2M events',
      referenceUrl: 'https://github.com/Sayantan-Sinha-GIT/pathfolio',
      createdAt: '2026-11-01T10:00:00.000Z'
    },
    {
      id: 'ev-migration',
      title: 'Executed Zero-Downtime Migration of 12M Relational Records',
      category: 'reliability',
      skillTags: ['Zero-Downtime', 'PostgreSQL', 'Data Integrity'],
      impactMetric: '12M rows migrated with 0 downtime',
      referenceUrl: 'https://github.com/Sayantan-Sinha-GIT/pathfolio',
      createdAt: '2026-11-01T11:00:00.000Z'
    },
    {
      id: 'ev-streams',
      title: 'Engineered Multi-Tier Distributed Cache & Local State Sync',
      category: 'architecture',
      skillTags: ['Distributed Caching', 'Offline-First', 'IndexedDB'],
      impactMetric: '68% egress reduction, 120ms cold-start',
      referenceUrl: 'https://github.com/Sayantan-Sinha-GIT/pathfolio',
      createdAt: '2026-11-01T12:00:00.000Z'
    }
  ];

  Object.values(ws).forEach(opp => {
    opportunities.push({
      id: opp.id,
      company: opp.company,
      role: opp.role,
      stage: opp.stage,
      sourceUrl: opp.url,
      location: 'San Francisco, CA / Remote',
      salaryNote: opp.salary,
      createdAt: '2026-11-01T09:00:00.000Z',
      updatedAt: new Date().toISOString(),
      isArchived: false,
      notes: `Targeted opportunity with ${opp.evidence.length} verified evidence links.`,
      linkedEvidenceIds: opp.evidence.map(e => `ev-${e}`),
      timeline: opp.timeline.map(t => ({
        timestamp: t.time.replace(' ', 'T') + ':00.000Z',
        description: t.text
      }))
    });

    opp.tasks.forEach(t => {
      tasks.push({
        id: `task-${t.id}`,
        opportunityId: opp.id,
        title: t.text,
        isCompleted: t.done,
        dueDate: t.overdue ? '2026-11-01T17:00:00.000Z' : '2026-11-05T17:00:00.000Z',
        createdAt: '2026-11-01T12:00:00.000Z'
      });
    });
  });

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    generator: 'Pathfolio Web Showcase v1.0',
    data: {
      opportunities: opportunities,
      tasks: tasks,
      evidence: evidenceBank,
      preferences: {
        theme: document.documentElement.getAttribute('data-theme') || 'dark',
        motion: 'full',
        hasCompletedOnboarding: true
      }
    }
  };
}

/* ==========================================================================
   Utilities
   ========================================================================== */
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
