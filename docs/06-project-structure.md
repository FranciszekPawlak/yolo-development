# Project Structure

This document outlines the organization of the Newsletter Agent system within the turborepo monorepo structure.

## Overall Structure

The project follows a monorepo approach using Turborepo, with a clear separation between apps and packages:

```
yolo-development/
├── apps/
│   └── newsletter-api/           # Main Express API application
├── packages/
│   ├── database/                 # Database models and repositories
│   ├── scraper/                  # Web scraping functionality
│   ├── summarizer/               # OpenAI integration for summarization
│   ├── queue/                    # Queue management utilities
│   ├── email/                    # Email templating and delivery
│   └── shared/                   # Shared types and utilities
└── docs/                         # Project documentation
```

## Detailed Structure

### Apps Directory

#### newsletter-api

```
newsletter-api/
├── src/
│   ├── api/                      # API route handlers
│   │   ├── sources.ts            # Source management endpoints
│   │   ├── articles.ts           # Article management endpoints
│   │   ├── summaries.ts          # Summary management endpoints
│   │   ├── newsletters.ts        # Newsletter management endpoints
│   │   ├── subscribers.ts        # Subscriber management endpoints
│   │   └── webhooks.ts           # Webhook handlers
│   ├── cron/                     # Vercel cron job handlers
│   │   ├── trigger-scraping.ts   # Triggers article scraping
│   │   ├── trigger-summarization.ts # Triggers article summarization
│   │   ├── trigger-newsletter.ts # Triggers newsletter generation
│   │   └── trigger-delivery.ts   # Triggers newsletter delivery
│   ├── workers/                  # Queue worker implementations
│   │   ├── scraper-worker.ts     # Processes scraping jobs
│   │   ├── summarizer-worker.ts  # Processes summarization jobs
│   │   ├── newsletter-worker.ts  # Processes newsletter generation jobs
│   │   └── delivery-worker.ts    # Processes newsletter delivery jobs
│   ├── middleware/               # Express middleware
│   │   ├── auth.ts               # Authentication middleware
│   │   ├── error-handler.ts      # Error handling middleware
│   │   └── validation.ts         # Request validation middleware
│   ├── config/                   # Configuration
│   │   ├── environment.ts        # Environment variable handling
│   │   └── settings.ts           # Application settings
│   ├── app.ts                    # Express application setup
│   └── index.ts                  # Application entry point
├── vercel.json                   # Vercel configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Package dependencies
```

### Packages Directory

#### database

```
database/
├── src/
│   ├── models/                   # Database models
│   │   ├── source.ts             # Source model
│   │   ├── article.ts            # Article model
│   │   ├── summary.ts            # Summary model
│   │   ├── newsletter.ts         # Newsletter model
│   │   └── subscriber.ts         # Subscriber model
│   ├── repositories/             # Repository implementations
│   │   ├── source-repository.ts  # Source repository
│   │   ├── article-repository.ts # Article repository
│   │   ├── summary-repository.ts # Summary repository
│   │   ├── newsletter-repository.ts # Newsletter repository
│   │   └── subscriber-repository.ts # Subscriber repository
│   ├── migrations/               # Database migrations
│   ├── schemas/                  # Database schema definitions
│   ├── supabase.ts               # Supabase client configuration
│   └── index.ts                  # Package entry point
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Package dependencies
```

#### scraper

```
scraper/
├── src/
│   ├── services/                 # Scraping services
│   │   ├── playwright-service.ts # Playwright browser automation
│   │   ├── selector-service.ts   # CSS selector management
│   │   └── content-sanitizer.ts  # Content cleaning and formatting
│   ├── strategies/               # Scraping strategies
│   │   ├── browser-strategy.ts   # Playwright-based scraping
│   │   ├── rss-strategy.ts       # RSS feed scraping
│   │   └── api-strategy.ts       # API-based scraping
│   ├── utils/                    # Utility functions
│   │   ├── url-helper.ts         # URL manipulation utilities
│   │   └── duplicate-detector.ts # Content duplication detection
│   ├── article-scraper.ts        # Main scraper implementation
│   └── index.ts                  # Package entry point
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Package dependencies
```

#### summarizer

```
summarizer/
├── src/
│   ├── services/                 # Summarization services
│   │   ├── openai-service.ts     # OpenAI API integration
│   │   └── prompt-templates.ts   # Prompt template management
│   ├── utils/                    # Utility functions
│   │   ├── token-counter.ts      # Token counting utilities
│   │   └── text-processor.ts     # Text processing utilities
│   ├── article-summarizer.ts     # Main summarizer implementation
│   └── index.ts                  # Package entry point
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Package dependencies
```

#### queue

```
queue/
├── src/
│   ├── services/                 # Queue services
│   │   ├── upstash-service.ts    # Upstash queue integration
│   │   └── queue-manager.ts      # Queue management 
│   ├── consumers/                # Queue consumers
│   │   ├── scraping-consumer.ts  # Scraping job consumer
│   │   ├── summarization-consumer.ts # Summarization job consumer
│   │   ├── newsletter-consumer.ts # Newsletter job consumer
│   │   └── delivery-consumer.ts  # Delivery job consumer
│   ├── producers/                # Queue producers
│   │   ├── scraping-producer.ts  # Scraping job producer
│   │   ├── summarization-producer.ts # Summarization job producer
│   │   ├── newsletter-producer.ts # Newsletter job producer
│   │   └── delivery-producer.ts  # Delivery job producer
│   └── index.ts                  # Package entry point
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Package dependencies
```

#### email

```
email/
├── src/
│   ├── services/                 # Email services
│   │   ├── brevo-service.ts      # Brevo API integration
│   │   └── template-service.ts   # Email templating
│   ├── templates/                # Email templates
│   │   ├── newsletter-template.ts # Newsletter email template
│   │   └── welcome-template.ts   # Welcome email template
│   ├── utils/                    # Utility functions
│   │   ├── html-processor.ts     # HTML processing utilities
│   │   └── tracking-parser.ts    # Email tracking utilities
│   ├── newsletter-formatter.ts   # Newsletter formatting
│   └── index.ts                  # Package entry point
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Package dependencies
```

#### shared

```
shared/
├── src/
│   ├── types/                    # Shared TypeScript types
│   │   ├── article.ts            # Article related types
│   │   ├── source.ts             # Source related types
│   │   ├── summary.ts            # Summary related types
│   │   ├── newsletter.ts         # Newsletter related types
│   │   ├── subscriber.ts         # Subscriber related types
│   │   └── queue.ts              # Queue related types
│   ├── errors/                   # Error definitions
│   │   ├── domain-errors.ts      # Domain-specific errors
│   │   ├── infrastructure-errors.ts # Infrastructure errors
│   │   └── validation-errors.ts  # Validation errors
│   ├── utils/                    # Shared utilities
│   │   ├── logger.ts             # Logging utilities
│   │   ├── date-utils.ts         # Date handling utilities
│   │   └── validation.ts         # Data validation utilities
│   └── index.ts                  # Package entry point
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Package dependencies
```

## Documentation Directory

```
docs/
├── 01-system-overview.md         # System overview
├── 02-domain-model.md            # Domain model
├── 03-infrastructure.md          # Infrastructure design
├── 04-implementation-plan.md     # Implementation plan
├── 05-application-services.md    # Application services
├── 06-project-structure.md       # Project structure (this document)
├── 07-data-flow.md               # Data flow diagrams
└── images/                       # Images and diagrams
    ├── system-architecture.png   # System architecture diagram
    └── data-flow-diagram.png     # Data flow diagram
```

## Turborepo Configuration

The project uses Turborepo for managing the monorepo structure:

- `turbo.json`: Defines the task pipeline and dependencies
- `pnpm-workspace.yaml`: Configures workspace packages
- `package.json`: Root package configuration

## Dependencies Between Packages

The following diagram illustrates the dependencies between packages:

```
┌────────────────┐     ┌─────────────┐
│newsletter-api  │────►│  database   │
└────────────────┘     └──────┬──────┘
        │                     │
        │                     │
        ▼                     ▼
┌────────────────┐     ┌─────────────┐
│     queue      │────►│   shared    │
└────────────────┘     └─────────────┘
        ▲                     ▲
        │                     │
┌───────┴──────┐     ┌───────┴─────┐
│   scraper    │     │  summarizer │
└──────────────┘     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │    email    │
                     └─────────────┘
```

## Environment Configuration

Each package and app can have its own `.env` file with appropriate variables. An example `.env` file for the newsletter-api:

```
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key

# Queue
UPSTASH_REDIS_REST_URL=https://your-queue.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# OpenAI
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4-turbo

# Brevo
BREVO_API_KEY=your-brevo-key
BREVO_SENDER_EMAIL=newsletter@yourdomain.com
BREVO_SENDER_NAME=Industry Newsletter

# Application
APP_SECRET=your-app-secret
NODE_ENV=development
```

## Scripts and Commands

Common commands to run in the project:

```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev

# Build all packages and apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type checking
pnpm check-types
``` 