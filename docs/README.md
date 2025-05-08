# Newsletter Agent Documentation

## Overview

This documentation describes the Newsletter Agent system, which automatically scrapes industry articles, creates AI-generated summaries, and sends newsletters to subscribers.

## Table of Contents

1. [System Overview](./01-system-overview.md)
2. [Domain Model](./02-domain-model.md)
3. [Infrastructure Design](./03-infrastructure.md)
4. [Implementation Plan](./04-implementation-plan.md)
5. [Application Services](./05-application-services.md)
6. [Project Structure](./06-project-structure.md)
7. [Data Flow](./07-data-flow.md)

## Key Diagrams

The following diagrams are available in the `images` directory:

- [System Architecture](./images/system-architecture.png)
- [Article Scraping Flow](./images/article-scraping-flow.png)
- [Article Summarization Flow](./images/article-summarization-flow.png)
- [Newsletter Generation Flow](./images/newsletter-generation-flow.png)
- [Newsletter Delivery Flow](./images/newsletter-delivery-flow.png)
- [Overall Data Flow](./images/data-flow-diagram.png)

## Technologies

The Newsletter Agent system is built using the following technologies:

- **Node.js & Express.js**: For the API server
- **TypeScript**: For type-safe development
- **Supabase**: For database storage
- **Upstash Queue**: For handling background jobs
- **Vercel**: For hosting and cron jobs
- **OpenAI API**: For generating article summaries
- **Playwright**: For web scraping
- **Brevo**: For email delivery
- **Turborepo**: For monorepo management

## Getting Started

To start implementing the system, follow the [Implementation Plan](./04-implementation-plan.md), which provides a step-by-step guide to building the Newsletter Agent system.

## Design Principles

The system follows Domain-Driven Design principles:

- Clear separation of bounded contexts
- Rich domain model
- Encapsulated business logic
- Repository pattern for data access
- Application services for orchestration
- Infrastructure services for external systems

## Contributing

When contributing to this project, please follow the established patterns and conventions outlined in these documents. 