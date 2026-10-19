import type { Course } from '@/types';

export const previewUser = {
  id: 'preview-user-001',
  name: 'Alex Morgan',
  email: 'alex.morgan@cmha-learning.com',
  role: 'Learning & Development Lead',
  initials: 'AM',
};

export const previewInstructors = {
  priya: {
    name: 'Dr. Priya Sharma',
    title: 'Senior Security Analyst',
    avatar:
      'https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
  marcus: {
    name: 'Marcus Chen',
    title: 'Privacy & Compliance Director',
    avatar:
      'https://images.pexels.com/photos/6148101/pexels-photo-6148101.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
  lila: {
    name: 'Lila Okonkwo',
    title: 'Workplace Safety Officer',
    avatar:
      'https://images.pexels.com/photos/5905830/pexels-photo-5905830.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
  david: {
    name: 'David Reyes',
    title: 'Leadership Coach',
    avatar:
      'https://images.pexels.com/photos/6148101/pexels-photo-6148101.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
  ana: {
    name: 'Dr. Ana Petrova',
    title: 'Data Science Lead',
    avatar:
      'https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
  sophie: {
    name: 'Sophie Laurent',
    title: 'Senior Project Manager, PMP',
    avatar:
      'https://images.pexels.com/photos/5905830/pexels-photo-5905830.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
  raj: {
    name: 'Raj Patel',
    title: 'Digital Strategy Principal',
    avatar:
      'https://images.pexels.com/photos/6148101/pexels-photo-6148101.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
  noah: {
    name: 'Dr. Noah Bennett',
    title: 'AI Research Scientist',
    avatar:
      'https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
};

export const sampleCourses: Course[] = [
  {
    id: 'c1',
    slug: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    description:
      'Build a working understanding of modern threats and the everyday habits that keep your organization safe.',
    longDescription:
      'A practical introduction to cybersecurity for non-technical staff. You will learn how common attacks work, how to recognize them, and the concrete steps that dramatically reduce risk across email, devices, and cloud tools. No prior technical knowledge required.',
    category: 'Cybersecurity',
    thumbnail:
      'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    instructor: previewInstructors.priya,
    difficulty: 'Beginner',
    duration: '2h 15m',
    featured: true,
    objectives: [
      'Identify the most common categories of cyber threats facing modern workplaces.',
      'Recognize phishing and social engineering attempts before they cause harm.',
      'Apply password, multi-factor authentication, and device best practices.',
      'Follow a clear incident response process when something goes wrong.',
    ],
    lessons: [
      {
        id: 'c1-l1',
        slug: 'the-threat-landscape',
        title: 'The Modern Threat Landscape',
        duration: '25 min',
        summary:
          'Understand who attacks organizations, why, and the most common entry points.',
        content: [
          {
            type: 'paragraph',
            text: 'Cybersecurity is no longer the sole concern of the IT department. Every employee is part of the defense perimeter. This lesson introduces the threat landscape you operate in every day.',
          },
          {
            type: 'heading',
            text: 'Who is behind most attacks?',
          },
          {
            type: 'paragraph',
            text: 'Attacks are typically carried out by one of four groups: opportunistic criminals seeking financial gain, organized ransomware groups, state-sponsored actors pursuing strategic advantage, and insiders acting carelessly or maliciously.',
          },
          {
            type: 'list',
            items: [
              'Opportunistic criminals using automated tooling at scale.',
              'Ransomware operators that encrypt data and demand payment.',
              'State-sponsored groups targeting strategic sectors.',
              'Insiders who mishandle data, intentionally or by accident.',
            ],
          },
          {
            type: 'callout',
            tone: 'info',
            text: 'The vast majority of successful breaches begin with a phishing email or a reused password — not a sophisticated exploit.',
          },
          {
            type: 'heading',
            text: 'Common entry points',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Email inboxes — phishing and malicious attachments.',
              'Credentials — weak, leaked, or reused passwords.',
              'Unmanaged devices accessing corporate resources.',
              'Public cloud storage exposed without access controls.',
            ],
          },
          {
            type: 'video',
            title: 'Anatomy of a phishing email',
            duration: '6:12',
          },
          {
            type: 'quote',
            text: 'Security is a process, not a product. The strongest firewall cannot protect an organization from a single careless click.',
          },
        ],
      },
      {
        id: 'c1-l2',
        slug: 'phishing-and-social-engineering',
        title: 'Recognizing Phishing & Social Engineering',
        duration: '30 min',
        summary:
          'Learn the red flags that reveal phishing emails, smishing texts, and pretexting calls.',
        content: [
          {
            type: 'paragraph',
            text: 'Social engineering manipulates people rather than systems. Because it exploits trust and urgency, technical controls alone cannot stop it. Your judgment is the primary defense.',
          },
          {
            type: 'heading',
            text: 'Red flags to watch for',
          },
          {
            type: 'list',
            items: [
              'Unexpected urgency or threats of account closure.',
              'Sender addresses that almost — but not quite — match a real domain.',
              'Requests for credentials, payment, or sensitive data.',
              'Links that resolve to unfamiliar domains when hovered.',
              'Attachments you were not expecting, especially .zip or .iso files.',
            ],
          },
          {
            type: 'callout',
            tone: 'warning',
            text: 'If a message creates strong pressure to act immediately, treat that pressure itself as a red flag. Legitimate internal requests can wait for verification.',
          },
          {
            type: 'heading',
            text: 'What to do when unsure',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Do not click links or open attachments.',
              'Verify the request through a separate, trusted channel.',
              'Report the message to your security team.',
              'Delete the message once reported.',
            ],
          },
        ],
      },
      {
        id: 'c1-l3',
        slug: 'protecting-your-accounts',
        title: 'Protecting Your Accounts & Devices',
        duration: '35 min',
        summary:
          'Put password managers, MFA, and device hygiene into practice with a simple checklist.',
        content: [
          {
            type: 'paragraph',
            text: 'A small number of habits account for most of your personal protection. This lesson turns those habits into a concrete checklist.',
          },
          {
            type: 'heading',
            text: 'The three-account baseline',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Use a password manager for every work and personal account.',
              'Enable multi-factor authentication on all accounts that support it.',
              'Keep devices patched and disk encryption enabled.',
            ],
          },
          {
            type: 'callout',
            tone: 'success',
            text: 'With these three controls in place, you block the overwhelming majority of automated attacks without any specialized knowledge.',
          },
          {
            type: 'link',
            label: 'Set up your password manager (internal guide)',
            href: '/learn/cybersecurity-fundamentals/protecting-your-accounts',
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    slug: 'data-privacy-essentials',
    title: 'Data Privacy Essentials',
    description:
      'Understand personal data, the rights of the people behind it, and your responsibilities when handling it.',
    longDescription:
      'A clear, practical introduction to data privacy for anyone who works with customer, employee, or partner information. Covers the core principles behind GDPR and similar regimes, with examples drawn from everyday workplace scenarios.',
    category: 'Data Privacy',
    thumbnail:
      'https://images.pexels.com/photos/4973899/pexels-photo-4973899.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    instructor: previewInstructors.marcus,
    difficulty: 'Beginner',
    duration: '1h 50m',
    featured: true,
    objectives: [
      'Define personal and sensitive personal data with workplace examples.',
      'Explain the core principles of data minimization and purpose limitation.',
      'Apply the rights of data subjects in everyday requests.',
      'Recognize when to escalate a privacy concern to the DPO.',
    ],
    lessons: [
      {
        id: 'c2-l1',
        slug: 'what-counts-as-personal-data',
        title: 'What Counts as Personal Data?',
        duration: '22 min',
        summary: 'A practical taxonomy of personal and sensitive personal data.',
        content: [
          {
            type: 'paragraph',
            text: 'Personal data is any information that relates to an identified or identifiable person. The definition is broad on purpose, because identity can be pieced together from surprising combinations.',
          },
          {
            type: 'heading',
            text: 'Categories you handle every day',
          },
          {
            type: 'list',
            items: [
              'Direct identifiers — name, email, phone number, employee ID.',
              'Indirect identifiers — IP address, device ID, location data.',
              'Sensitive data — health, biometrics, union membership, and similar.',
            ],
          },
          {
            type: 'callout',
            tone: 'warning',
            text: 'A spreadsheet that joins a postcode with a job title may be enough to identify someone. Treat combinations with the same care as obvious identifiers.',
          },
        ],
      },
      {
        id: 'c2-l2',
        slug: 'data-subject-rights',
        title: 'Data Subject Rights in Practice',
        duration: '28 min',
        summary: 'How to recognize and route access, correction, and deletion requests.',
        content: [
          {
            type: 'paragraph',
            text: 'Individuals have rights over their data. Most of these rights arrive as ordinary emails or calls, which is why every employee needs to recognize them.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Right to access — request a copy of their data.',
              'Right to rectification — correct inaccurate data.',
              'Right to erasure — delete data where legally required.',
              'Right to object — stop certain processing.',
            ],
          },
          {
            type: 'callout',
            tone: 'info',
            text: 'Privacy requests usually have a legal deadline. When in doubt, forward to the privacy team the same day rather than waiting.',
          },
        ],
      },
      {
        id: 'c2-l3',
        slug: 'data-minimization-in-practice',
        title: 'Data Minimization in Practice',
        duration: '24 min',
        summary: 'Collect only what you need, keep it only as long as required.',
        content: [
          {
            type: 'paragraph',
            text: 'Minimization is the most practical principle in privacy. If you do not collect data, you cannot leak it.',
          },
          {
            type: 'heading',
            text: 'Three questions before collecting data',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Is this data necessary for the stated purpose?',
              'Can the purpose be achieved with less identifiable data?',
              'Do we have a defined retention period?',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'c3',
    slug: 'workplace-health-and-safety',
    title: 'Workplace Health and Safety',
    description:
      'The core responsibilities and everyday practices that keep you and your colleagues safe at work.',
    longDescription:
      'A foundational health and safety course covering hazard recognition, reporting, ergonomics, and emergency response. Designed for all employees regardless of role or location.',
    category: 'Health & Safety',
    thumbnail:
      'https://images.pexels.com/photos/38070/pexels-photo-38070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    instructor: previewInstructors.lila,
    difficulty: 'Beginner',
    duration: '1h 40m',
    objectives: [
      'Recognize common workplace hazards across office and field environments.',
      'Follow the correct incident reporting procedure.',
      'Apply ergonomic principles to your own workspace.',
      'Respond appropriately during an emergency evacuation.',
    ],
    lessons: [
      {
        id: 'c3-l1',
        slug: 'hazard-recognition',
        title: 'Recognizing Hazards Around You',
        duration: '20 min',
        summary: 'Learn to spot hazards before they become incidents.',
        content: [
          {
            type: 'paragraph',
            text: 'A hazard is anything with the potential to cause harm. Most workplace incidents involve hazards that were visible but not acted on.',
          },
          {
            type: 'list',
            items: [
              'Physical — slips, trips, falls, moving equipment.',
              'Ergonomic — repetitive strain, poor posture.',
              'Psychosocial — workload, harassment, fatigue.',
              'Environmental — air quality, noise, temperature.',
            ],
          },
        ],
      },
      {
        id: 'c3-l2',
        slug: 'reporting-and-response',
        title: 'Reporting Incidents Correctly',
        duration: '25 min',
        summary: 'When and how to report incidents, near misses, and hazards.',
        content: [
          {
            type: 'callout',
            tone: 'warning',
            text: 'Near misses are free lessons. Reporting a near miss prevents the next incident from happening — treat them as seriously as actual incidents.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Make the area safe and attend to any injured person.',
              'Notify your supervisor immediately.',
              'Complete the incident report within 24 hours.',
              'Cooperate with the follow-up investigation.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'c4',
    slug: 'leadership-and-communication',
    title: 'Leadership and Communication',
    description:
      'Develop the core communication and leadership habits that help teams do their best work.',
    longDescription:
      'A practical leadership course for new and aspiring managers. Focuses on the everyday conversations — feedback, delegation, one-on-ones — that determine whether a team thrives.',
    category: 'Leadership',
    thumbnail:
      'https://images.pexels.com/photos/7433930/pexels-photo-7433930.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    instructor: previewInstructors.david,
    difficulty: 'Intermediate',
    duration: '3h 05m',
    featured: true,
    objectives: [
      'Structure clear, specific feedback that people can act on.',
      'Delegate effectively while maintaining accountability.',
      'Run one-on-ones that build trust and surface problems early.',
      'Adapt communication style to different team members.',
    ],
    lessons: [
      {
        id: 'c4-l1',
        slug: 'feedback-that-lands',
        title: 'Feedback That Lands',
        duration: '35 min',
        summary: 'A simple structure for giving feedback people can actually use.',
        content: [
          {
            type: 'paragraph',
            text: 'Feedback is the single highest-leverage tool a manager has. Most feedback fails not because of the content, but because of how it is delivered.',
          },
          {
            type: 'heading',
            text: 'The Situation–Behavior–Impact model',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Situation — when and where it happened.',
              'Behavior — what you specifically observed.',
              'Impact — what effect it had on you, the team, or the work.',
            ],
          },
          {
            type: 'callout',
            tone: 'success',
            text: 'Specificity is kindness. Vague feedback leaves people guessing; specific feedback gives them something to build on.',
          },
        ],
      },
      {
        id: 'c4-l2',
        slug: 'delegation-with-trust',
        title: 'Delegation With Trust',
        duration: '40 min',
        summary: 'Hand off work without losing accountability or morale.',
        content: [
          {
            type: 'paragraph',
            text: 'Delegation is not abdication. The goal is to transfer responsibility for execution while keeping clarity on outcomes.',
          },
          {
            type: 'list',
            items: [
              'Define the outcome, not the method.',
              'Confirm the person has the authority they need.',
              'Agree on check-in cadence up front.',
              'Make it safe to surface problems early.',
            ],
          },
        ],
      },
      {
        id: 'c4-l3',
        slug: 'one-on-ones-that-work',
        title: 'One-on-Ones That Work',
        duration: '30 min',
        summary: 'Use the weekly one-on-one to build trust and catch issues early.',
        content: [
          {
            type: 'callout',
            tone: 'info',
            text: 'The one-on-one is the team member\u2019s meeting, not yours. Let them set most of the agenda.',
          },
          {
            type: 'quote',
            text: 'The team member\u2019s mood, blockers, and growth are the agenda. Your updates can wait for other channels.',
          },
        ],
      },
    ],
  },
  {
    id: 'c5',
    slug: 'data-analysis-fundamentals',
    title: 'Data Analysis Fundamentals',
    description:
      'Move from spreadsheets to insight with a clear, repeatable analysis workflow.',
    longDescription:
      'An accessible introduction to working with data: framing questions, cleaning data, exploring distributions, and communicating findings. Uses spreadsheet-style examples throughout — no programming required.',
    category: 'Data & Analytics',
    thumbnail:
      'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    instructor: previewInstructors.ana,
    difficulty: 'Beginner',
    duration: '2h 30m',
    objectives: [
      'Frame analysis questions that map to real decisions.',
      'Clean and shape a dataset for exploration.',
      'Choose the right chart for the question you are asking.',
      'Communicate findings clearly to non-technical stakeholders.',
    ],
    lessons: [
      {
        id: 'c5-l1',
        slug: 'framing-the-question',
        title: 'Framing the Right Question',
        duration: '25 min',
        summary: 'Most analysis fails at the question stage. Get this right first.',
        content: [
          {
            type: 'paragraph',
            text: 'Before touching any data, write down the decision your analysis is meant to inform. If you cannot name a decision, you do not yet have a question.',
          },
          {
            type: 'list',
            items: [
              'Who will act on this analysis?',
              'What decision are they trying to make?',
              'What would change their mind?',
            ],
          },
        ],
      },
      {
        id: 'c5-l2',
        slug: 'cleaning-and-shaping',
        title: 'Cleaning and Shaping Data',
        duration: '35 min',
        summary: 'Practical techniques for turning messy data into analysis-ready data.',
        content: [
          {
            type: 'callout',
            tone: 'warning',
            text: 'Never analyze a dataset you have not profiled. A few minutes of summary statistics surfaces most problems before they propagate.',
          },
        ],
      },
      {
        id: 'c5-l3',
        slug: 'choosing-the-right-chart',
        title: 'Choosing the Right Chart',
        duration: '28 min',
        summary: 'Match the chart type to the question, not to what looks impressive.',
        content: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Comparison — bar charts.',
              'Trend over time — line charts.',
              'Composition — stacked bar or area.',
              'Distribution — histograms or box plots.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'c6',
    slug: 'project-management-essentials',
    title: 'Project Management Essentials',
    description:
      'Plan, track, and deliver projects with a lightweight framework that scales from small to large.',
    longDescription:
      'A practical introduction to project management that covers scope, scheduling, risk, and stakeholder communication. Frameworks covered at a conceptual level: agile, waterfall, and hybrid.',
    category: 'Project Management',
    thumbnail:
      'https://images.pexels.com/photos/1181311/pexels-photo-1181311.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    instructor: previewInstructors.sophie,
    difficulty: 'Intermediate',
    duration: '2h 45m',
    objectives: [
      'Define clear project scope and success criteria.',
      'Build a realistic schedule with dependencies.',
      'Identify and track risks throughout delivery.',
      'Communicate status effectively to stakeholders.',
    ],
    lessons: [
      {
        id: 'c6-l1',
        slug: 'scope-and-success',
        title: 'Scope and Success Criteria',
        duration: '30 min',
        summary: 'A project without a written scope will drift. Learn to anchor delivery.',
        content: [
          {
            type: 'paragraph',
            text: 'Scope is the contract between the project and the organization. Write it down, share it, and refer back to it whenever priorities shift.',
          },
        ],
      },
      {
        id: 'c6-l2',
        slug: 'scheduling-and-dependencies',
        title: 'Scheduling and Dependencies',
        duration: '35 min',
        summary: 'Turn a list of tasks into a realistic schedule.',
        content: [
          {
            type: 'callout',
            tone: 'info',
            text: 'The critical path is the longest chain of dependent tasks. Protect it, and the project stays on track.',
          },
        ],
      },
    ],
  },
  {
    id: 'c7',
    slug: 'digital-transformation',
    title: 'Digital Transformation',
    description:
      'Understand what real digital transformation means and how to contribute to it responsibly.',
    longDescription:
      'A strategic overview of digital transformation for leaders and individual contributors. Focuses on the organizational and cultural dimensions, not just the technology.',
    category: 'Digital Strategy',
    thumbnail:
      'https://images.pexels.com/photos/39853023/pexels-photo-39853023.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    instructor: previewInstructors.raj,
    difficulty: 'Advanced',
    duration: '3h 20m',
    objectives: [
      'Distinguish digital transformation from technology adoption.',
      'Identify the cultural conditions that determine success.',
      'Evaluate transformation opportunities against business value.',
      'Recognize common failure patterns and how to avoid them.',
    ],
    lessons: [
      {
        id: 'c7-l1',
        slug: 'beyond-the-technology',
        title: 'Beyond the Technology',
        duration: '35 min',
        summary: 'Why most transformation efforts fail, and what the successful ones do differently.',
        content: [
          {
            type: 'quote',
            text: 'Culture eats strategy for breakfast. In transformation, culture eats technology too.',
          },
        ],
      },
      {
        id: 'c7-l2',
        slug: 'a-framework-for-change',
        title: 'A Framework for Responsible Change',
        duration: '40 min',
        summary: 'A lightweight framework for evaluating and sequencing transformation work.',
        content: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Identify the business problem, not the technology.',
              'Map the current state honestly.',
              'Define the smallest valuable step.',
              'Measure, learn, and expand.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'c8',
    slug: 'introduction-to-artificial-intelligence',
    title: 'Introduction to Artificial Intelligence',
    description:
      'A clear-eyed introduction to AI for professionals who want to understand what it can and cannot do.',
    longDescription:
      'A non-technical introduction to artificial intelligence and machine learning. Covers what these technologies actually do, where they fail, and how to evaluate AI claims critically.',
    category: 'Artificial Intelligence',
    thumbnail:
      'https://images.pexels.com/photos/17483871/pexels-photo-17483871.png?auto=compress&cs=tinysrgb&h=650&w=940',
    instructor: previewInstructors.noah,
    difficulty: 'Beginner',
    duration: '2h 10m',
    featured: true,
    objectives: [
      'Explain in plain language what machine learning actually does.',
      'Recognize the limits and failure modes of current AI systems.',
      'Evaluate AI vendor claims with informed skepticism.',
      'Identify responsible uses of AI in your own work.',
    ],
    lessons: [
      {
        id: 'c8-l1',
        slug: 'what-ai-actually-does',
        title: 'What AI Actually Does',
        duration: '30 min',
        summary: 'A plain-language explanation of machine learning, without the hype.',
        content: [
          {
            type: 'paragraph',
            text: 'Machine learning systems find patterns in historical data and use those patterns to make predictions about new data. That is the whole story. Everything else is detail.',
          },
          {
            type: 'callout',
            tone: 'info',
            text: 'An AI system cannot be smarter than the data it was trained on. If the data is biased, limited, or wrong, the system will be too.',
          },
        ],
      },
      {
        id: 'c8-l2',
        slug: 'limits-and-failure-modes',
        title: 'Limits and Failure Modes',
        duration: '28 min',
        summary: 'Where today\u2019s AI fails, and why that matters for your decisions.',
        content: [
          {
            type: 'list',
            items: [
              'Confidently wrong outputs that read as plausible.',
              'Brittleness — small input changes cause large output changes.',
              'Inability to say \u201cI don\u2019t know.\u201d',
              'Training data that goes stale or is later restricted.',
            ],
          },
        ],
      },
      {
        id: 'c8-l3',
        slug: 'using-ai-responsibly',
        title: 'Using AI Responsibly at Work',
        duration: '22 min',
        summary: 'Practical guidance for bringing AI into your own workflow.',
        content: [
          {
            type: 'callout',
            tone: 'success',
            text: 'Treat AI output as a first draft, never a final answer. The human review step is where the value lives.',
          },
        ],
      },
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return sampleCourses.find((c) => c.slug === slug);
}

export function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string
): { course: Course; lessonIndex: number } | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  const lessonIndex = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (lessonIndex < 0) return undefined;
  return { course, lessonIndex };
}
