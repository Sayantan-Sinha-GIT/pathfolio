import '../models/opportunity.dart';
import '../models/stage.dart';
import '../models/task_item.dart';
import '../models/timeline_entry.dart';
import '../models/evidence_item.dart';

class DemoDataFactory {
  static const String demoFlagKey = 'is_demo_workspace_active';

  static List<EvidenceItem> createDemoEvidence(DateTime now) {
    return [
      EvidenceItem(
        id: 'demo-ev-1',
        title: 'Distributed Telemetry Pipeline',
        skillTags: ['Go', 'Kafka', 'Docker', 'Prometheus'],
        conciseResult: 'Processed 15,000 events/sec with <20ms p99 latency during peak campus traffic.',
        sourceUrl: 'https://github.com/example/telemetry-pipeline',
        createdAt: now.subtract(const Duration(days: 30)),
      ),
      EvidenceItem(
        id: 'demo-ev-2',
        title: 'Developer Productivity CLI for Git Worktrees',
        skillTags: ['Rust', 'Shell', 'Systems', 'Git'],
        conciseResult: 'Engineered lightweight CLI that reduced repo context switching time from 4 mins to 8 secs.',
        sourceUrl: 'https://github.com/example/worktree-cli',
        createdAt: now.subtract(const Duration(days: 20)),
      ),
      EvidenceItem(
        id: 'demo-ev-3',
        title: 'Low-latency Real-time Canvas Rendering Engine',
        skillTags: ['Flutter', 'Dart', 'CustomPainter', 'WebGL'],
        conciseResult: 'Delivered smooth 60 FPS interactive visual charts with 0 layout jank on low-end devices.',
        sourceUrl: 'https://github.com/example/canvas-render',
        createdAt: now.subtract(const Duration(days: 15)),
      ),
    ];
  }

  static List<Opportunity> createDemoOpportunities(DateTime now) {
    return [
      Opportunity(
        id: 'demo-opp-1',
        company: 'Stripe',
        role: 'Junior Infrastructure Engineer',
        stage: JobStage.interview,
        location: 'Seattle, WA (Hybrid)',
        salaryNote: '\$135,000 base + equity',
        sourceUrl: 'https://stripe.com/jobs/junior-infra',
        applicationDate: now.subtract(const Duration(days: 14)),
        nextActionDate: now.add(const Duration(days: 1)),
        privateNotes: 'Completed screening round with engineering manager. Technical system design and coding loop scheduled for tomorrow.',
        isArchived: false,
        attachedEvidenceIds: ['demo-ev-1', 'demo-ev-2'],
        createdAt: now.subtract(const Duration(days: 14)),
        updatedAt: now.subtract(const Duration(days: 1)),
      ),
      Opportunity(
        id: 'demo-opp-2',
        company: 'Figma',
        role: 'Associate Systems Engineer',
        stage: JobStage.screening,
        location: 'San Francisco, CA (Remote)',
        salaryNote: '\$125,000 - \$140,000',
        sourceUrl: 'https://figma.com/careers/associate-engineer',
        applicationDate: now.subtract(const Duration(days: 8)),
        nextActionDate: now.add(const Duration(days: 3)),
        privateNotes: 'Recruiter reached out via referral. Quick 30-min introductory video screen set for Thursday morning.',
        isArchived: false,
        attachedEvidenceIds: ['demo-ev-3'],
        createdAt: now.subtract(const Duration(days: 8)),
        updatedAt: now.subtract(const Duration(days: 2)),
      ),
      Opportunity(
        id: 'demo-opp-3',
        company: 'Linear',
        role: 'Product Engineer Intern',
        stage: JobStage.applied,
        location: 'Remote',
        salaryNote: '\$55 / hr + stipend',
        sourceUrl: 'https://linear.app/careers/product-intern',
        applicationDate: now.subtract(const Duration(days: 4)),
        nextActionDate: now.add(const Duration(days: 5)),
        privateNotes: 'Submitted tailored cover letter highlighting attention to keyboard shortcuts and micro-interactions.',
        isArchived: false,
        attachedEvidenceIds: ['demo-ev-2', 'demo-ev-3'],
        createdAt: now.subtract(const Duration(days: 4)),
        updatedAt: now.subtract(const Duration(days: 4)),
      ),
      Opportunity(
        id: 'demo-opp-4',
        company: 'Cloudflare',
        role: 'Graduate Systems Engineer',
        stage: JobStage.offer,
        location: 'Austin, TX (On-site)',
        salaryNote: '\$130,000 base + \$20,000 RSUs',
        sourceUrl: 'https://cloudflare.com/careers/grad-systems',
        applicationDate: now.subtract(const Duration(days: 28)),
        nextActionDate: now.add(const Duration(days: 2)),
        privateNotes: 'Written offer received! Reviewing health benefits and relocation assistance package before decision deadline.',
        isArchived: false,
        attachedEvidenceIds: ['demo-ev-1'],
        createdAt: now.subtract(const Duration(days: 28)),
        updatedAt: now.subtract(const Duration(hours: 5)),
      ),
      Opportunity(
        id: 'demo-opp-5',
        company: 'Datadog',
        role: 'Early Career SRE',
        stage: JobStage.saved,
        location: 'New York, NY (Hybrid)',
        salaryNote: '\$120,000 - \$130,000',
        sourceUrl: 'https://datadog.com/careers/sre',
        applicationDate: null,
        nextActionDate: now.subtract(const Duration(days: 1)), // Overdue follow-up
        privateNotes: 'Drafting targeted technical summary emphasizing distributed tracing and Kafka telemetry experience.',
        isArchived: false,
        attachedEvidenceIds: ['demo-ev-1'],
        createdAt: now.subtract(const Duration(days: 6)),
        updatedAt: now.subtract(const Duration(days: 3)),
      ),
    ];
  }

  static List<TaskItem> createDemoTasks(DateTime now) {
    return [
      TaskItem(
        id: 'demo-task-1',
        opportunityId: 'demo-opp-1',
        title: 'Review distributed rate-limiting design pattern',
        dueDate: now.add(const Duration(days: 1)),
        isCompleted: false,
        createdAt: now.subtract(const Duration(days: 3)),
      ),
      TaskItem(
        id: 'demo-task-2',
        opportunityId: 'demo-opp-1',
        title: 'Send post-screening thank-you note to recruiter',
        dueDate: now.subtract(const Duration(days: 2)),
        isCompleted: true,
        completedAt: now.subtract(const Duration(days: 2)),
        createdAt: now.subtract(const Duration(days: 4)),
      ),
      TaskItem(
        id: 'demo-task-3',
        opportunityId: 'demo-opp-2',
        title: 'Research Figma WebGL canvas architecture notes',
        dueDate: now.add(const Duration(days: 2)),
        isCompleted: false,
        createdAt: now.subtract(const Duration(days: 2)),
      ),
      TaskItem(
        id: 'demo-task-4',
        opportunityId: 'demo-opp-4',
        title: 'Confirm formal acceptance or counter-offer deadline',
        dueDate: now.add(const Duration(days: 2)),
        isCompleted: false,
        createdAt: now.subtract(const Duration(days: 1)),
      ),
      TaskItem(
        id: 'demo-task-5',
        opportunityId: 'demo-opp-5',
        title: 'Submit application with updated resume PDF',
        dueDate: now.subtract(const Duration(days: 1)), // Overdue
        isCompleted: false,
        createdAt: now.subtract(const Duration(days: 4)),
      ),
    ];
  }

  static List<TimelineEntry> createDemoTimeline(DateTime now) {
    return [
      TimelineEntry(
        id: 'demo-time-1',
        opportunityId: 'demo-opp-4',
        timestamp: now.subtract(const Duration(hours: 5)),
        actionType: 'stage_change',
        description: 'Advanced stage to Offer after final technical rounds.',
        fromStage: 'interview',
        toStage: 'offer',
      ),
      TimelineEntry(
        id: 'demo-time-2',
        opportunityId: 'demo-opp-1',
        timestamp: now.subtract(const Duration(days: 1)),
        actionType: 'stage_change',
        description: 'Passed recruiter screen and moved to Interview.',
        fromStage: 'screening',
        toStage: 'interview',
      ),
      TimelineEntry(
        id: 'demo-time-3',
        opportunityId: 'demo-opp-1',
        timestamp: now.subtract(const Duration(days: 2)),
        actionType: 'task_completed',
        description: 'Completed task: Send post-screening thank-you note to recruiter',
      ),
      TimelineEntry(
        id: 'demo-time-4',
        opportunityId: 'demo-opp-3',
        timestamp: now.subtract(const Duration(days: 4)),
        actionType: 'created',
        description: 'Application submitted for Product Engineer Intern.',
        toStage: 'applied',
      ),
    ];
  }
}

