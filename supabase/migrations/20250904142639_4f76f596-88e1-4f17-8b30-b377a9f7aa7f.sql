-- Add some realistic seed data for tools
INSERT INTO tools (title, description, url, launch_date, is_paid, logo_url, upvotes_count, user_id) VALUES
(
  'CloudFlow AI',
  'Transform your workflow with AI-powered automation that learns and adapts to your team''s needs. Streamline repetitive tasks and boost productivity.',
  'https://cloudflow-ai.com',
  '2025-08-15',
  false,
  NULL,
  42,
  NULL
),
(
  'DesignSpark Pro',
  'Create stunning visuals with our advanced design toolkit. Perfect for teams and solo creators who want professional results without the complexity.',
  'https://designspark.pro',
  '2025-08-22',
  true,
  NULL,
  38,
  NULL
),
(
  'DataSync Hub',
  'Seamlessly connect all your data sources with our powerful integration platform. Real-time syncing across 200+ popular business applications.',
  'https://datasync-hub.io',
  '2025-09-08',
  false,
  NULL,
  29,
  NULL
),
(
  'CodeMentor AI',
  'Get instant code reviews and suggestions from our advanced AI programming assistant. Supports 20+ languages with context-aware recommendations.',
  'https://codementor-ai.dev',
  '2025-09-05',
  true,
  NULL,
  56,
  NULL
),
(
  'TaskForge',
  'The ultimate project management tool that adapts to your workflow. Built for remote teams with powerful collaboration features and time tracking.',
  'https://taskforge.app',
  '2025-08-28',
  true,
  NULL,
  73,
  NULL
);