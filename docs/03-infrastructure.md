# Infrastructure Design

This document outlines the technical infrastructure for implementing the Newsletter Agent system.

## Technology Stack

### Core Technologies

- **Node.js**: Runtime environment for JavaScript execution
- **Express.js**: Web server framework for handling API requests
- **TypeScript**: For type-safe code development
- **Turborepo**: Monorepo structure for managing packages and apps

### External Services

- **Supabase**: PostgreSQL database with built-in authentication and APIs
- **Upstash Queue**: Distributed message queue for handling background jobs
- **Vercel**: Hosting platform with serverless functions and cron jobs
- **OpenAI API**: For generating article summaries
- **Brevo (formerly Sendinblue)**: Email delivery service
- **Playwright**: Headless browser automation for web scraping

## Infrastructure Components

### Database Design (Supabase)

The Supabase PostgreSQL database will contain tables corresponding to our domain entities:

1. **sources**: Stores information about content sources
2. **scraping_jobs**: Tracks scraping job status and results
3. **articles**: Stores scraped article content
4. **summaries**: Stores AI-generated summaries
5. **summarization_jobs**: Tracks summarization job status
6. **newsletters**: Stores newsletter content and metadata
7. **newsletter_templates**: Stores email templates
8. **subscribers**: Stores subscriber information
9. **delivery_jobs**: Tracks newsletter delivery status

### Queue Design (Upstash)

Upstash Queue will be used to manage asynchronous tasks:

1. **article-scraping-queue**: Handles scraping tasks for individual sources
2. **article-summarization-queue**: Processes article summarization requests
3. **newsletter-generation-queue**: Handles newsletter creation
4. **newsletter-delivery-queue**: Manages email delivery tasks

### Vercel Cron Jobs

Cron jobs will be configured in Vercel to trigger various processes:

1. **trigger-source-scraping**: Daily job to trigger article scraping from configured sources
2. **trigger-summarization**: Daily job to summarize any unsummarized articles
3. **trigger-newsletter-generation**: Weekly job to create newsletters
4. **trigger-newsletter-delivery**: Weekly job to send newsletters

### API Endpoints

The Express server will expose these endpoints:

1. **Sources Management**:
   - `GET /api/sources`: List all sources
   - `POST /api/sources`: Add a new source
   - `PUT /api/sources/:id`: Update source configuration
   - `DELETE /api/sources/:id`: Delete a source

2. **Article Management**:
   - `GET /api/articles`: List articles with filtering
   - `GET /api/articles/:id`: Get article details
   - `DELETE /api/articles/:id`: Delete an article

3. **Summary Management**:
   - `GET /api/summaries`: List summaries
   - `GET /api/summaries/:id`: Get summary details
   - `PUT /api/summaries/:id`: Update/edit a summary

4. **Newsletter Management**:
   - `GET /api/newsletters`: List newsletters
   - `GET /api/newsletters/:id`: Get newsletter details
   - `POST /api/newsletters`: Create a newsletter manually
   - `PUT /api/newsletters/:id`: Update a newsletter
   - `POST /api/newsletters/:id/send`: Send a newsletter manually

5. **Subscriber Management**:
   - `GET /api/subscribers`: List subscribers
   - `POST /api/subscribers`: Add a subscriber
   - `DELETE /api/subscribers/:id`: Remove a subscriber
   - `PUT /api/subscribers/:id`: Update subscriber details

6. **Webhooks**:
   - `POST /api/webhooks/unsubscribe`: Handle unsubscribe requests

### Turborepo Package Structure

The system will be organized into packages following the turborepo structure:

1. **apps/newsletter-api**: Main Express application with API endpoints
2. **packages/database**: Database models and repositories
3. **packages/scraper**: Web scraping functionality using Playwright
4. **packages/summarizer**: OpenAI integration for article summarization
5. **packages/queue**: Queue management utilities
6. **packages/email**: Email templating and delivery services
7. **packages/shared**: Shared types, utilities, and interfaces

## Configuration Management

Configuration will be managed through environment variables:

1. **Database Configuration**:
   - `SUPABASE_URL`: Supabase project URL
   - `SUPABASE_KEY`: Supabase API key

2. **Queue Configuration**:
   - `UPSTASH_REDIS_REST_URL`: Upstash Redis URL
   - `UPSTASH_REDIS_REST_TOKEN`: Upstash authentication token

3. **OpenAI Configuration**:
   - `OPENAI_API_KEY`: API key for OpenAI
   - `OPENAI_MODEL`: Model to use for summarization (e.g., gpt-4-turbo)

4. **Brevo Configuration**:
   - `BREVO_API_KEY`: API key for Brevo
   - `BREVO_SENDER_EMAIL`: Sender email address
   - `BREVO_SENDER_NAME`: Sender display name

## Deployment Architecture

The system will be deployed on Vercel with the following components:

1. **API Server**: Deployed as a serverless function
2. **Cron Jobs**: Configured in Vercel for periodic execution
3. **Queue Workers**: Deployed as serverless functions that process queue messages
4. **Database**: Hosted on Supabase

## Security Considerations

1. **Authentication**: API endpoints will be secured using Supabase authentication
2. **API Keys**: All service API keys will be stored as encrypted environment variables
3. **Rate Limiting**: Implemented for API endpoints to prevent abuse
4. **Data Validation**: All inputs will be validated before processing
5. **Content Security**: Scraped content will be sanitized before storage

## Monitoring and Logging

1. **Error Tracking**: Capture and log all errors
2. **Queue Monitoring**: Track job processing status and failures
3. **Performance Metrics**: Monitor API response times and resource usage
4. **Job History**: Maintain history of all jobs for audit purposes 