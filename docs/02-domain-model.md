# Domain Model

This document outlines the core domain model for the Newsletter Agent system following Domain-Driven Design principles.

## Bounded Contexts

The system is divided into four primary bounded contexts:

1. **Article Scraping Context**
2. **Content Processing Context**
3. **Newsletter Generation Context**
4. **Delivery Context**

## Core Entities and Aggregates

### Article Scraping Context

#### Source (Aggregate Root)
- `id`: Unique identifier
- `name`: Human-readable name
- `url`: Base URL of the source
- `selectors`: JSON object with CSS selectors for scraping
- `scrapingStrategy`: Enum defining how to scrape (PLAYWRIGHT, RSS, API)
- `lastScraped`: Timestamp of last successful scrape
- `active`: Boolean flag to enable/disable scraping

#### ScrapingJob
- `id`: Unique identifier
- `sourceId`: Reference to Source
- `status`: PENDING, IN_PROGRESS, COMPLETED, FAILED
- `createdAt`: Timestamp when job was created
- `completedAt`: Timestamp when job was completed
- `error`: Error details if failed

### Content Processing Context

#### Article (Aggregate Root)
- `id`: Unique identifier
- `sourceId`: Reference to Source
- `url`: Original URL of the article
- `title`: Article title
- `content`: Full article content
- `author`: Article author (if available)
- `publishedAt`: Publication date
- `scrapedAt`: Timestamp when article was scraped
- `hash`: Content hash to identify duplicates

#### Summary
- `id`: Unique identifier
- `articleId`: Reference to Article
- `content`: AI-generated summary
- `generatedAt`: Timestamp when summary was created
- `tokens`: Number of tokens used for generation
- `usedInNewsletter`: Boolean flag if used in newsletter
- `model`: AI model used for summarization

#### SummarizationJob
- `id`: Unique identifier
- `articleId`: Reference to Article
- `status`: PENDING, IN_PROGRESS, COMPLETED, FAILED
- `createdAt`: Timestamp when job was created
- `completedAt`: Timestamp when job was completed
- `error`: Error details if failed

### Newsletter Generation Context

#### Newsletter (Aggregate Root)
- `id`: Unique identifier
- `title`: Newsletter title
- `introduction`: Introduction text
- `summaryIds`: Array of Summary IDs included
- `status`: DRAFT, READY, SENT
- `createdAt`: Timestamp when newsletter was created
- `sentAt`: Timestamp when newsletter was sent
- `recipientCount`: Number of recipients

#### NewsletterTemplate
- `id`: Unique identifier
- `name`: Template name
- `htmlTemplate`: HTML template with placeholders
- `active`: Boolean flag to indicate active template

### Delivery Context

#### Subscriber (Aggregate Root)
- `id`: Unique identifier
- `email`: Subscriber email
- `name`: Subscriber name
- `status`: ACTIVE, UNSUBSCRIBED
- `subscribedAt`: Timestamp when subscribed
- `unsubscribedAt`: Timestamp when unsubscribed
- `preferences`: JSON object with subscriber preferences

#### DeliveryJob
- `id`: Unique identifier
- `newsletterId`: Reference to Newsletter
- `status`: PENDING, IN_PROGRESS, COMPLETED, FAILED
- `createdAt`: Timestamp when job was created
- `completedAt`: Timestamp when job was completed
- `error`: Error details if failed

## Value Objects

### ArticleMetadata
- `title`: Article title
- `author`: Article author
- `publishedDate`: Publication date
- `tags`: Array of tags

### ScrapeResult
- `url`: Article URL
- `title`: Article title
- `content`: Article content
- `metadata`: ArticleMetadata
- `timestamp`: Scraping timestamp

### SummaryRequest
- `articleId`: Article ID to summarize
- `maxLength`: Maximum summary length
- `style`: Summarization style (TECHNICAL, CASUAL, etc.)

## Domain Services

### ArticleScraper
- `scrapeSource(sourceId)`: Scrapes latest articles from the source
- `detectNewContent(sourceId, url)`: Checks if article is new

### Summarizer
- `summarizeArticle(articleId)`: Creates summary using OpenAI
- `optimizeSummary(summaryId)`: Refines existing summary

### NewsletterGenerator
- `createNewsletter()`: Generates newsletter from recent summaries
- `formatNewsletter(newsletterId)`: Formats newsletter for sending

### DeliveryService
- `sendNewsletter(newsletterId)`: Sends newsletter to subscribers
- `trackDelivery(deliveryJobId)`: Tracks delivery status

## Repositories

### SourceRepository
- `findAll()`: Returns all sources
- `findActive()`: Returns active sources
- `findById(id)`: Returns source by ID
- `save(source)`: Saves source

### ArticleRepository
- `findById(id)`: Returns article by ID
- `findByUrl(url)`: Returns article by URL
- `findWithoutSummary()`: Returns articles without summaries
- `save(article)`: Saves article

### SummaryRepository
- `findByArticleId(articleId)`: Returns summary for article
- `findUnusedInNewsletter()`: Returns summaries not used in newsletters
- `save(summary)`: Saves summary

### NewsletterRepository
- `findLatest()`: Returns latest newsletter
- `findById(id)`: Returns newsletter by ID
- `save(newsletter)`: Saves newsletter

### SubscriberRepository
- `findActive()`: Returns active subscribers
- `findById(id)`: Returns subscriber by ID
- `save(subscriber)`: Saves subscriber 