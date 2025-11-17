import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  name: string;
  websiteUrl: string;
  domain: string;
  status: 'initializing' | 'researching' | 'active' | 'completed' | 'error';

  // Ownership
  ownerId: string;
  editorIds: string[];

  // Research metadata
  researchJobId?: string;
  categoryTreeGenerated: boolean;

  // Statistics (denormalized)
  stats: {
    totalCategories: number;
    totalSubcategories: number;
    totalQuestions: number;
    questionsGenerated: number;
    questionsAccepted: number;
    questionsRejected: number;
    averageConfidence: number;
  };

  // Settings
  settings: {
    targetAudience?: string;
    brandVoice: 'professional' | 'casual' | 'technical' | 'friendly';
    contentDepth: 'concise' | 'detailed' | 'comprehensive';
    factCheckThreshold: number; // 0-1
    autoGenerateQuestions: boolean;
    contentFocus?: 'informational' | 'sales' | 'educational' | 'promotional';
    salesPitchPrompt?: string;
  };

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActivityAt: Timestamp;
  deletedAt?: Timestamp;
}

export interface Category {
  id: string;
  projectId: string;
  title: string;
  description: string;
  slug: string;
  order: number;
  level: 0;
  parentId: null;

  // Generation metadata
  generatedBy: 'perplexity' | 'manual';
  perplexityPrompt?: string;
  confidence: number; // 0-1

  // Expansion state
  isExpanded: boolean;
  hasSubcategories: boolean;
  subcategoryCount: number;

  // Statistics
  stats: {
    totalQuestions: number;
    questionsGenerated: number;
    questionsAccepted: number;
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface Subcategory {
  id: string;
  projectId: string;
  categoryId: string;
  title: string;
  description: string;
  slug: string;
  order: number;
  level: 1;
  parentId: string; // categoryId

  generatedBy: 'perplexity' | 'manual';
  perplexityPrompt?: string;
  confidence: number;

  isExpanded: boolean;
  hasQuestions: boolean;
  questionCount: number;

  stats: {
    totalQuestions: number;
    questionsGenerated: number;
    questionsAccepted: number;
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface Question {
  id: string;
  projectId: string;
  categoryId: string;
  subcategoryId: string;

  question: string;
  questionSlug: string;

  searchIntent: 'informational' | 'navigational' | 'transactional';
  targetKeywords: string[];
  relatedTerms: string[];

  generatedBy: 'perplexity' | 'manual';
  perplexityPrompt?: string;
  perplexityResearchId?: string;

  status: 'pending' | 'generating' | 'ready_for_review' | 'accepted' | 'rejected';

  currentDraftId?: string;
  draftCount: number;
  hasShortDraft: boolean;
  hasLongDraft: boolean;

  factCheckStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  factCheckJobId?: string;
  factCheckScore?: number; // 0-1
  factCheckIssues?: string[];

  reviewedBy?: string;
  reviewedAt?: Timestamp;
  reviewNotes?: string;

  // Publication status (separate from review workflow)
  publicationStatus?: 'draft' | 'published' | 'archived';
  publishedAt?: Timestamp;
  archivedAt?: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  order: number;
}

export interface Draft {
  id: string;
  questionId: string;
  projectId: string;

  type: 'short' | 'long';

  content: string; // Markdown
  htmlContent?: string; // Cached
  wordCount: number;

  generatedBy: 'gpt4' | 'manual';
  model?: string;
  prompt?: string;
  temperature?: number;

  citations: Array<{
    text: string;
    url: string;
    source: string;
    relevance: number;
  }>;

  qualityScore?: number;
  readabilityScore?: number;
  seoScore?: number;

  version: number;
  parentDraftId?: string;
  isDraft: boolean;

  status: 'draft' | 'accepted' | 'rejected';

  // Publication status (separate from review workflow)
  publicationStatus?: 'draft' | 'published' | 'archived';
  publishedAt?: Timestamp;
  archivedAt?: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  acceptedBy?: string;
  acceptedAt?: Timestamp;
}

export interface FactCheck {
  id: string;
  questionId: string;
  draftId: string;
  projectId: string;

  overallScore: number; // 0-1
  confidence: 'high' | 'medium' | 'low';

  claims: Array<{
    claim: string;
    verification: 'verified' | 'unverified' | 'disputed';
    sources: string[];
    confidence: number;
    explanation: string;
  }>;

  issues: Array<{
    type: 'factual_error' | 'missing_context' | 'outdated' | 'unsupported';
    severity: 'critical' | 'warning' | 'info';
    location: string;
    description: string;
    suggestedFix?: string;
  }>;

  sourcesChecked: number;
  sourcesVerified: number;
  externalSources: string[];

  jobId: string;
  model: string;
  processingTime: number;

  status: 'completed' | 'failed' | 'partial';
  errorMessage?: string;

  createdAt: Timestamp;
  completedAt?: Timestamp;
}

export interface Job {
  id: string;
  type:
    | 'research_site'
    | 'generate_categories'
    | 'generate_subcategories'
    | 'generate_questions'
    | 'generate_draft'
    | 'fact_check';
  idempotencyKey: string;

  projectId: string;
  entityId?: string;
  parentJobId?: string;

  params: Record<string, any>;

  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100

  attempts: number;
  maxAttempts: number;
  nextRetryAt?: Timestamp;
  backoffMultiplier: number;

  result?: Record<string, any>;
  error?: {
    message: string;
    code: string;
    stack?: string;
    timestamp: Timestamp;
  };

  startedAt?: Timestamp;
  completedAt?: Timestamp;
  processingTime?: number;
  workerId?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt: Timestamp;
}

// ============================================================================
// SUBSCRIPTION & BILLING
// ============================================================================

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface Subscription {
  tier: SubscriptionTier;
  generationsThisMonth: number;
  generationsLimit: number; // 10 (free), 100 (pro), -1 (enterprise = unlimited)
  periodStart: Timestamp;
  periodEnd: Timestamp;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
}

export interface GenerationHistoryEntry {
  timestamp: Timestamp;
  type: 'category' | 'subcategory' | 'question' | 'draft';
  count: number;
  jobId?: string;
}

export interface Customer {
  id: string; // Firebase Auth UID
  email: string;
  displayName?: string;

  // Subscription & limits
  subscription: Subscription;

  // Usage tracking
  usage: {
    questionsThisMonth: number;
    questionsTotal: number;
    lastQuestionAt?: Timestamp;
    billingCycleStart: Timestamp;
  };

  // Generation history for analytics
  generationHistory: GenerationHistoryEntry[];

  // Subscription info (synced by Stripe extension)
  stripeCustomerId?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection names
export const COLLECTIONS = {
  PROJECTS: 'projects',
  CATEGORIES: 'categories',
  SUBCATEGORIES: 'subcategories',
  QUESTIONS: 'questions',
  DRAFTS: 'drafts',
  FACT_CHECKS: 'fact_checks',
  JOBS: 'jobs',
  CUSTOMERS: 'customers',
  PRODUCTS: 'products',
} as const;
