# Data Flow

This document describes the key data flows within the Newsletter Agent system.

## Core Process Flows

The system has four primary data flows:

1. **Article Scraping Flow**: Extracting articles from configured sources
2. **Article Summarization Flow**: Creating AI summaries of articles
3. **Newsletter Generation Flow**: Creating newsletters from summaries
4. **Newsletter Delivery Flow**: Sending newsletters to subscribers

## 1. Article Scraping Flow

![Article Scraping Flow](./images/article-scraping-flow.png)

### Sequence Diagram

```
┌──────────┐      ┌─────────────────┐       ┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│Vercel Cron│      │ScrapingScheduler│       │ScraperQueue │       │ArticleScraper│       │  Database   │
└─────┬────┘      └────────┬────────┘       └──────┬──────┘       └──────┬───────┘       └──────┬──────┘
      │                    │                       │                      │                      │
      │ Trigger            │                       │                      │                      │
      │ Daily Scraping     │                       │                      │                      │
      │────────────────────>                       │                      │                      │
      │                    │                       │                      │                      │
      │                    │ Get Active Sources    │                      │                      │
      │                    │─────────────────────────────────────────────────────────────────────>
      │                    │                       │                      │                      │
      │                    │                       │                      │                      │
      │                    │ Return Sources        │                      │                      │
      │                    │<─────────────────────────────────────────────────────────────────────
      │                    │                       │                      │                      │
      │                    │ For each source       │                      │                      │
      │                    │───┐                   │                      │                      │
      │                    │   │                   │                      │                      │
      │                    │<──┘                   │                      │                      │
      │                    │                       │                      │                      │
      │                    │ Enqueue Scraping Job  │                      │                      │
      │                    │──────────────────────>│                      │                      │
      │                    │                       │                      │                      │
      │                    │                       │ Process Job          │                      │
      │                    │                       │──────────────────────>                      │
      │                    │                       │                      │                      │
      │                    │                       │                      │ Scrape Latest Article│
      │                    │                       │                      │                      │
      │                    │                       │                      │──┐                   │
      │                    │                       │                      │  │                   │
      │                    │                       │                      │<─┘                   │
      │                    │                       │                      │                      │
      │                    │                       │                      │ Check if Article     │
      │                    │                       │                      │ Already Exists       │
      │                    │                       │                      │─────────────────────>│
      │                    │                       │                      │                      │
      │                    │                       │                      │ Return Result        │
      │                    │                       │                      │<─────────────────────│
      │                    │                       │                      │                      │
      │                    │                       │                      │ If new, save Article │
      │                    │                       │                      │─────────────────────>│
      │                    │                       │                      │                      │
      │                    │                       │                      │ Update Source        │
      │                    │                       │                      │ LastScraped          │
      │                    │                       │                      │─────────────────────>│
      │                    │                       │                      │                      │
      │                    │                       │ Job Complete         │                      │
      │                    │                       │<──────────────────────                      │
      │                    │                       │                      │                      │
┌─────┴────┐      ┌────────┴────────┐       ┌──────┴──────┐       ┌──────┴───────┐       ┌──────┴──────┐
│Vercel Cron│      │ScrapingScheduler│       │ScraperQueue │       │ArticleScraper│       │  Database   │
└──────────┘      └─────────────────┘       └─────────────┘       └──────────────┘       └─────────────┘
```

### Process Steps

1. **Trigger**: Vercel cron job triggers the scraping process daily
2. **Source Selection**: System retrieves all active sources from the database
3. **Job Enqueueing**: For each source, a scraping job is added to the queue
4. **Job Processing**: Queue worker picks up the job and initiates scraping
5. **Content Scraping**: Playwright extracts content from the source
6. **Duplication Check**: System checks if the article is already in the database
7. **Storage**: New article is stored in the database if it doesn't exist
8. **Source Update**: Source's last scraped timestamp is updated

## 2. Article Summarization Flow

![Article Summarization Flow](./images/article-summarization-flow.png)

### Sequence Diagram

```
┌──────────┐      ┌───────────────────┐    ┌──────────────────┐    ┌───────────────┐    ┌───────────┐    ┌─────────────┐
│Vercel Cron│      │SummarizationScheduler│    │SummarizerQueue   │    │ArticleSummarizer│    │OpenAI API │    │  Database   │
└─────┬────┘      └──────────┬─────────┘    └────────┬─────────┘    └─────────┬─────┘    └─────┬─────┘    └──────┬──────┘
      │                      │                       │                        │                 │                 │
      │ Trigger              │                       │                        │                 │                 │
      │ Summarization        │                       │                        │                 │                 │
      │──────────────────────>                       │                        │                 │                 │
      │                      │                       │                        │                 │                 │
      │                      │ Get Unsummarized      │                        │                 │                 │
      │                      │ Articles              │                        │                 │                 │
      │                      │───────────────────────────────────────────────────────────────────────────────────>
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │                 │                 │
      │                      │ Return Articles       │                        │                 │                 │
      │                      │<───────────────────────────────────────────────────────────────────────────────────
      │                      │                       │                        │                 │                 │
      │                      │ For each article      │                        │                 │                 │
      │                      │───┐                   │                        │                 │                 │
      │                      │   │                   │                        │                 │                 │
      │                      │<──┘                   │                        │                 │                 │
      │                      │                       │                        │                 │                 │
      │                      │ Enqueue               │                        │                 │                 │
      │                      │ Summarization Job     │                        │                 │                 │
      │                      │──────────────────────>│                        │                 │                 │
      │                      │                       │                        │                 │                 │
      │                      │                       │ Process Job            │                 │                 │
      │                      │                       │────────────────────────>                 │                 │
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │ Get Article     │                 │
      │                      │                       │                        │ Content         │                 │
      │                      │                       │                        │────────────────────────────────────>
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │ Return Article  │                 │
      │                      │                       │                        │<────────────────────────────────────
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │ Prepare Prompt  │                 │
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │─┐               │                 │
      │                      │                       │                        │ │               │                 │
      │                      │                       │                        │<┘               │                 │
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │ Request Summary │                 │
      │                      │                       │                        │────────────────>│                 │
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │ Return Summary  │                 │
      │                      │                       │                        │<────────────────│                 │
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │ Save Summary    │                 │
      │                      │                       │                        │────────────────────────────────────>
      │                      │                       │                        │                 │                 │
      │                      │                       │                        │ Update Article  │                 │
      │                      │                       │                        │ Status          │                 │
      │                      │                       │                        │────────────────────────────────────>
      │                      │                       │                        │                 │                 │
      │                      │                       │ Job Complete           │                 │                 │
      │                      │                       │<────────────────────────                 │                 │
      │                      │                       │                        │                 │                 │
┌─────┴────┐      ┌──────────┴─────────┐    ┌────────┴─────────┐    ┌─────────┴─────┐    ┌─────┴─────┐    ┌──────┴──────┐
│Vercel Cron│      │SummarizationScheduler│    │SummarizerQueue   │    │ArticleSummarizer│    │OpenAI API │    │  Database   │
└──────────┘      └───────────────────┘    └──────────────────┘    └───────────────┘    └───────────┘    └─────────────┘
```

### Process Steps

1. **Trigger**: Vercel cron job triggers the summarization process daily
2. **Article Selection**: System retrieves all articles without summaries
3. **Job Enqueueing**: For each article, a summarization job is added to the queue
4. **Job Processing**: Queue worker picks up the job and initiates summarization
5. **Article Retrieval**: System retrieves the article content from the database
6. **Prompt Preparation**: A prompt is prepared for the OpenAI API
7. **AI Processing**: OpenAI API generates a summary of the article
8. **Storage**: Summary is stored in the database and linked to the article

## 3. Newsletter Generation Flow

![Newsletter Generation Flow](./images/newsletter-generation-flow.png)

### Sequence Diagram

```
┌──────────┐     ┌───────────────────┐     ┌───────────────┐     ┌─────────────┐     ┌───────────┐     ┌─────────────┐
│Vercel Cron│     │NewsletterScheduler │     │NewsletterQueue│     │NewsletterGen │     │OpenAI API │     │  Database   │
└─────┬────┘     └─────────┬─────────┘     └───────┬───────┘     └──────┬──────┘     └─────┬─────┘     └──────┬──────┘
      │                    │                       │                     │                  │                  │
      │ Trigger            │                       │                     │                  │                  │
      │ Weekly Newsletter  │                       │                     │                  │                  │
      │────────────────────>                       │                     │                  │                  │
      │                    │                       │                     │                  │                  │
      │                    │ Check Last Newsletter │                     │                  │                  │
      │                    │──────────────────────────────────────────────────────────────────────────────────>
      │                    │                       │                     │                  │                  │
      │                    │ Return Info           │                     │                  │                  │
      │                    │<──────────────────────────────────────────────────────────────────────────────────
      │                    │                       │                     │                  │                  │
      │                    │ Get Unused Summaries  │                     │                  │                  │
      │                    │──────────────────────────────────────────────────────────────────────────────────>
      │                    │                       │                     │                  │                  │
      │                    │ Return Summaries      │                     │                  │                  │
      │                    │<──────────────────────────────────────────────────────────────────────────────────
      │                    │                       │                     │                  │                  │
      │                    │ If enough summaries   │                     │                  │                  │
      │                    │ enqueue newsletter job│                     │                  │                  │
      │                    │──────────────────────>│                     │                  │                  │
      │                    │                       │                     │                  │                  │
      │                    │                       │ Process Job         │                  │                  │
      │                    │                       │─────────────────────>                  │                  │
      │                    │                       │                     │                  │                  │
      │                    │                       │                     │ Get Newsletter   │                  │
      │                    │                       │                     │ Template         │                  │
      │                    │                       │                     │─────────────────────────────────────>
      │                    │                       │                     │                  │                  │
      │                    │                       │                     │ Return Template  │                  │
      │                    │                       │                     │<─────────────────────────────────────
      │                    │                       │                     │                  │                  │
      │                    │                       │                     │ Generate Intro   │                  │
      │                    │                       │                     │─────────────────>│                  │
      │                    │                       │                     │                  │                  │
      │                    │                       │                     │ Return Intro     │                  │
      │                    │                       │                     │<─────────────────│                  │
      │                    │                       │                     │                  │                  │
      │                    │                       │                     │ Format Newsletter│                  │
      │                    │                       │                     │                  │                  │
      │                    │                       │                     │──┐               │                  │
      │                    │                       │                     │  │               │                  │
      │                    │                       │                     │<─┘               │                  │
      │                    │                       │                     │                  │                  │
      │                    │                       │                     │ Save Newsletter  │                  │
      │                    │                       │                     │─────────────────────────────────────>
      │                    │                       │                     │                  │                  │
      │                    │                       │                     │ Update Summaries │                  │
      │                    │                       │                     │ as Used          │                  │
      │                    │                       │                     │─────────────────────────────────────>
      │                    │                       │                     │                  │                  │
      │                    │                       │ Job Complete        │                  │                  │
      │                    │                       │<─────────────────────                  │                  │
      │                    │                       │                     │                  │                  │
┌─────┴────┐     ┌─────────┴─────────┐     ┌───────┴───────┐     ┌──────┴──────┐     ┌─────┴─────┐     ┌──────┴──────┐
│Vercel Cron│     │NewsletterScheduler │     │NewsletterQueue│     │NewsletterGen │     │OpenAI API │     │  Database   │
└──────────┘     └───────────────────┘     └───────────────┘     └─────────────┘     └───────────┘     └─────────────┘
```

### Process Steps

1. **Trigger**: Vercel cron job triggers the newsletter generation process weekly
2. **Newsletter Check**: System checks when the last newsletter was sent
3. **Summary Selection**: System retrieves unused summaries from the database
4. **Job Enqueueing**: If enough summaries are available, a newsletter generation job is added to the queue
5. **Job Processing**: Queue worker picks up the job and initiates newsletter generation
6. **Template Retrieval**: System retrieves the newsletter template
7. **Introduction Generation**: OpenAI API generates a personalized introduction
8. **Newsletter Formatting**: Summaries are organized into a coherent newsletter
9. **Storage**: Newsletter is stored in the database
10. **Summary Update**: Used summaries are marked as included in a newsletter

## 4. Newsletter Delivery Flow

![Newsletter Delivery Flow](./images/newsletter-delivery-flow.png)

### Sequence Diagram

```
┌──────────┐     ┌──────────────────┐     ┌─────────────┐     ┌────────────────┐     ┌────────────┐     ┌─────────────┐
│Vercel Cron│     │DeliveryScheduler │     │DeliveryQueue│     │DeliveryService │     │Brevo API   │     │  Database   │
└─────┬────┘     └────────┬─────────┘     └──────┬──────┘     └───────┬────────┘     └─────┬──────┘     └──────┬──────┘
      │                   │                      │                     │                    │                   │
      │ Trigger           │                      │                     │                    │                   │
      │ Newsletter        │                      │                     │                    │                   │
      │ Delivery          │                      │                     │                    │                   │
      │───────────────────>                      │                     │                    │                   │
      │                   │                      │                     │                    │                   │
      │                   │ Get Ready            │                     │                    │                   │
      │                   │ Newsletters          │                     │                    │                   │
      │                   │────────────────────────────────────────────────────────────────────────────────────>
      │                   │                      │                     │                    │                   │
      │                   │ Return Newsletters   │                     │                    │                   │
      │                   │<────────────────────────────────────────────────────────────────────────────────────
      │                   │                      │                     │                    │                   │
      │                   │ For each newsletter  │                     │                    │                   │
      │                   │───┐                  │                     │                    │                   │
      │                   │   │                  │                     │                    │                   │
      │                   │<──┘                  │                     │                    │                   │
      │                   │                      │                     │                    │                   │
      │                   │ Get Active           │                     │                    │                   │
      │                   │ Subscribers          │                     │                    │                   │
      │                   │────────────────────────────────────────────────────────────────────────────────────>
      │                   │                      │                     │                    │                   │
      │                   │ Return Subscribers   │                     │                    │                   │
      │                   │<────────────────────────────────────────────────────────────────────────────────────
      │                   │                      │                     │                    │                   │
      │                   │ Enqueue Delivery Job │                     │                    │                   │
      │                   │─────────────────────>│                     │                    │                   │
      │                   │                      │                     │                    │                   │
      │                   │                      │ Process Job         │                    │                   │
      │                   │                      │────────────────────>│                    │                   │
      │                   │                      │                     │                    │                   │
      │                   │                      │                     │ Get Newsletter     │                   │
      │                   │                      │                     │ Content            │                   │
      │                   │                      │                     │────────────────────────────────────────>
      │                   │                      │                     │                    │                   │
      │                   │                      │                     │ Return Content     │                   │
      │                   │                      │                     │<────────────────────────────────────────
      │                   │                      │                     │                    │                   │
      │                   │                      │                     │ Batch Subscribers  │                   │
      │                   │                      │                     │                    │                   │
      │                   │                      │                     │─┐                  │                   │
      │                   │                      │                     │ │                  │                   │
      │                   │                      │                     │<┘                  │                   │
      │                   │                      │                     │                    │                   │
      │                   │                      │                     │ Send Email         │                   │
      │                   │                      │                     │───────────────────>│                   │
      │                   │                      │                     │                    │                   │
      │                   │                      │                     │ Return Status      │                   │
      │                   │                      │                     │<───────────────────│                   │
      │                   │                      │                     │                    │                   │
      │                   │                      │                     │ Update Newsletter  │                   │
      │                   │                      │                     │ Status             │                   │
      │                   │                      │                     │────────────────────────────────────────>
      │                   │                      │                     │                    │                   │
      │                   │                      │ Job Complete        │                    │                   │
      │                   │                      │<────────────────────│                    │                   │
      │                   │                      │                     │                    │                   │
┌─────┴────┐     ┌────────┴─────────┐     ┌──────┴──────┐     ┌───────┴────────┐     ┌─────┴──────┐     ┌──────┴──────┐
│Vercel Cron│     │DeliveryScheduler │     │DeliveryQueue│     │DeliveryService │     │Brevo API   │     │  Database   │
└──────────┘     └──────────────────┘     └─────────────┘     └────────────────┘     └────────────┘     └─────────────┘
```

### Process Steps

1. **Trigger**: Vercel cron job triggers the newsletter delivery process
2. **Newsletter Selection**: System retrieves newsletters ready for delivery
3. **Subscriber Retrieval**: System retrieves active subscribers
4. **Job Enqueueing**: A delivery job is added to the queue
5. **Job Processing**: Queue worker picks up the job and initiates delivery
6. **Newsletter Retrieval**: System retrieves the newsletter content
7. **Subscriber Batching**: Subscribers are organized into batches for efficient delivery
8. **Email Sending**: Brevo API sends the newsletter to each batch of subscribers
9. **Status Update**: Newsletter status is updated to "SENT" in the database

## Data Storage

For each flow, data is persisted in the Supabase database:

- **Scraping Flow**: Source metadata and article content are stored
- **Summarization Flow**: AI-generated summaries are stored with metadata
- **Newsletter Generation Flow**: Complete newsletters are stored with references to included summaries
- **Delivery Flow**: Delivery status and statistics are stored

## Error Handling Flows

Each process includes error handling:

1. **Retry Logic**: Failed operations are retried with exponential backoff
2. **Error Logging**: All errors are logged for monitoring
3. **Status Tracking**: Job status is tracked for visibility
4. **Alerting**: Critical failures trigger alerts

## Monitoring Data Flow

The system maintains monitoring data:

1. **Performance Metrics**: Processing time for each operation
2. **Job Completion Rates**: Success and failure rates for jobs
3. **Content Statistics**: Number of articles, summaries, and newsletters
4. **Error Rates**: Frequency of different error types 