# Application Services

This document outlines the key application services in the Newsletter Agent system, following the principles of Domain-Driven Design.

## Service Layer Organization

The application services represent the primary use cases of the system and orchestrate the interactions between domain entities and infrastructure components. They implement the business workflows and coordinate between multiple bounded contexts.

## Core Application Services

### SourceManagementService

**Responsibility**: Manages content sources for scraping.

**Key Functions**:
- `addSource(sourceData)`: Registers a new content source for scraping
- `updateSource(id, sourceData)`: Updates source configuration
- `deactivateSource(id)`: Temporarily disables scraping for a source
- `reactivateSource(id)`: Re-enables scraping for a source
- `testSourceConfig(sourceData)`: Tests scraper configuration without saving
- `getSourceStats(id)`: Returns statistics about a source's articles

**Dependencies**:
- SourceRepository
- ScraperService (for testing configurations)

### ScraperSchedulingService

**Responsibility**: Schedules and coordinates hourly article scraping jobs.

**Key Functions**:
- `scheduleSourceScraping(sourceId)`: Schedules scraping for a specific source
- `scheduleHourlyScraping()`: Schedules scraping for all active sources every hour
- `rescheduleFailedJobs()`: Reschedules jobs that previously failed
- `checkJobStatus(jobId)`: Returns the status of a specific scraping job

**Dependencies**:
- SourceRepository
- ScrapingJobRepository
- QueueService

### ArticleScraperService

**Responsibility**: Handles checking and scraping of article content.

**Key Functions**:
- `checkLatestArticle(sourceId)`: Checks the blog homepage for the latest article
- `scrapeArticleContent(sourceId, url)`: Retrieves the full content of a specific article URL
- `isArticleInDatabase(url)`: Checks if an article URL already exists in the database
- `sanitizeContent(rawContent)`: Cleans scraped content for storage

**Dependencies**:
- SourceRepository
- ArticleRepository
- PlaywrightService
- ContentSanitizerService

### SummarizationSchedulingService

**Responsibility**: Manages scheduling of article summarization jobs.

**Key Functions**:
- `scheduleArticleSummarization(articleId)`: Schedules summarization for an article
- `scheduleUnsummarizedArticles()`: Finds and schedules all articles without summaries
- `prioritizeArticles(criteria)`: Adjusts priority for summarization queue
- `checkSummarizationStatus(jobId)`: Checks status of a summarization job

**Dependencies**:
- ArticleRepository
- SummaryRepository
- SummarizationJobRepository
- QueueService

### ArticleSummarizerService

**Responsibility**: Creates AI-generated summaries of articles.

**Key Functions**:
- `summarizeArticle(articleId)`: Generates summary for an article
- `optimizePromptForArticle(article)`: Creates optimized prompt for OpenAI
- `processAIResponse(response)`: Processes and formats AI response
- `trackTokenUsage(request, response)`: Tracks token usage for cost monitoring

**Dependencies**:
- ArticleRepository
- SummaryRepository
- OpenAIService
- PromptTemplateService

### NewsletterGenerationService

**Responsibility**: Creates newsletters from article summaries.

**Key Functions**:
- `generateNewsletter()`: Creates a new newsletter from recent summaries
- `selectSummariesForNewsletter(criteria)`: Selects appropriate summaries
- `createNewsletterStructure(summaries)`: Organizes summaries into a coherent structure
- `generateIntroduction(topics)`: Creates personalized introduction

**Dependencies**:
- SummaryRepository
- NewsletterRepository
- NewsletterTemplateRepository
- OpenAIService (for introduction generation)

### NewsletterDeliveryService

**Responsibility**: Handles the delivery of newsletters to subscribers.

**Key Functions**:
- `scheduleNewsletterDelivery(newsletterId)`: Schedules newsletter for delivery
- `sendToSubscribers(newsletterId, subscriberIds)`: Sends to specific subscribers
- `trackDeliveryStatus(deliveryJobId)`: Tracks status of delivery
- `handleDeliveryFailures(failures)`: Manages failed delivery attempts

**Dependencies**:
- NewsletterRepository
- SubscriberRepository
- DeliveryJobRepository
- BrevoService
- QueueService

### SubscriberManagementService

**Responsibility**: Manages newsletter subscribers.

**Key Functions**:
- `addSubscriber(subscriberData)`: Registers a new subscriber
- `updateSubscriber(id, subscriberData)`: Updates subscriber information
- `unsubscribe(id)`: Processes unsubscribe requests
- `getSubscriberStats()`: Returns subscriber statistics
- `importSubscribers(source)`: Bulk imports subscribers

**Dependencies**:
- SubscriberRepository
- BrevoService (for synchronization)

## Infrastructure Services

### QueueService

**Responsibility**: Manages interaction with Upstash Queue.

**Key Functions**:
- `enqueue(queueName, jobData)`: Adds a job to a queue
- `processQueue(queueName, handler)`: Processes jobs in a queue
- `cancelJob(queueName, jobId)`: Cancels a pending job
- `getJobStatus(queueName, jobId)`: Returns job status

**Dependencies**:
- Upstash Queue SDK

### OpenAIService

**Responsibility**: Handles communication with OpenAI API.

**Key Functions**:
- `generateCompletion(prompt, options)`: Sends request to OpenAI
- `calculateTokens(text)`: Estimates token usage
- `handleRateLimiting()`: Manages API rate limits
- `retryWithBackoff(fn, attempts)`: Implements retry logic

**Dependencies**:
- Axios or Fetch for HTTP requests

### PlaywrightService

**Responsibility**: Manages browser automation for scraping.

**Key Functions**:
- `initBrowser()`: Initializes headless browser
- `navigateToPage(url)`: Navigates to a specific URL
- `extractContent(selectors)`: Extracts content using CSS selectors
- `handleDynamicContent(url, waitCriteria)`: Handles JavaScript-rendered content

**Dependencies**:
- Playwright library

### BrevoService

**Responsibility**: Manages email delivery through Brevo.

**Key Functions**:
- `sendEmail(recipientData, templateId, params)`: Sends a single email
- `sendBatchEmails(recipients, templateId, params)`: Sends batch emails
- `createContact(contactData)`: Creates a contact in Brevo
- `updateContact(id, contactData)`: Updates a contact
- `getEmailStats(emailId)`: Gets email delivery statistics

**Dependencies**:
- Brevo SDK or API

### SupabaseService

**Responsibility**: Handles database operations.

**Key Functions**:
- `executeQuery(query, params)`: Executes a database query
- `transaction(operations)`: Performs operations in a transaction
- `handleConnection()`: Manages database connection
- `migrateSchema(version)`: Handles schema migrations

**Dependencies**:
- Supabase SDK

## Cross-Cutting Services

### LoggingService

**Responsibility**: Centralized logging for the application.

**Key Functions**:
- `logInfo(message, context)`: Logs informational messages
- `logError(error, context)`: Logs errors with context
- `logWarning(message, context)`: Logs warnings
- `logPerformance(operation, duration)`: Logs performance metrics

### MonitoringService

**Responsibility**: Application monitoring and alerting.

**Key Functions**:
- `trackEvent(eventName, properties)`: Tracks application events
- `recordMetric(metricName, value)`: Records application metrics
- `createAlert(condition, message)`: Sets up alerting
- `healthCheck()`: Performs system health check

### ConfigurationService

**Responsibility**: Manages application configuration.

**Key Functions**:
- `getConfig(key)`: Retrieves configuration value
- `setConfig(key, value)`: Updates configuration
- `loadConfigFromEnvironment()`: Loads config from environment variables
- `validateConfig()`: Validates configuration values

## Service Interactions

The following diagram illustrates how these services interact in key workflows:

```
Article Scraping Workflow:
┌────────────────────┐    ┌──────────────────────┐    ┌───────────────────┐
│ScraperSchedulingService│─┬─►│ArticleScraperService│─┬─►│SupabaseService│
└────────────────────┘  │ └──────────────────────┘  │ └───────────────────┘
                        │                           │
                        │ ┌──────────────────────┐  │
                        └─►│PlaywrightService    │──┘
                          └──────────────────────┘

Summarization Workflow:
┌─────────────────────────────┐    ┌─────────────────────┐    ┌───────────────┐
│SummarizationSchedulingService│─┬─►│ArticleSummarizerService│─┬─►│OpenAIService│
└─────────────────────────────┘  │ └─────────────────────┘  │ └───────────────┘
                                 │                          │
                                 │ ┌───────────────────┐    │
                                 └─►│QueueService      │────┘
                                   └───────────────────┘

Newsletter Generation Workflow:
┌────────────────────────────┐    ┌────────────────────────┐    ┌───────────────────┐
│NewsletterGenerationService │─┬─►│NewsletterDeliveryService│─┬─►│BrevoService    │
└────────────────────────────┘  │ └────────────────────────┘  │ └───────────────────┘
                                │                             │
                                │ ┌───────────────────┐       │
                                └─►│QueueService     │───────┘
                                  └───────────────────┘
```

## Error Handling Strategy

Each service implements consistent error handling:

1. **Domain Errors**: Specific errors related to business logic violations
2. **Infrastructure Errors**: Errors from external services (API, DB)
3. **Validation Errors**: Input validation failures
4. **Unexpected Errors**: Unforeseen exceptions

Errors are logged centrally and propagated appropriately, with retries implemented for transient failures.

## Transaction Management

For operations that span multiple repositories:

1. Database operations are wrapped in transactions where appropriate
2. Distributed transactions are managed through compensating actions
3. Idempotent operations are used to support retries 