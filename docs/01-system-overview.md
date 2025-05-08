# Newsletter Agent System - Overview

## Purpose

The Newsletter Agent is an automated system that periodically scrapes industry articles from various websites, summarizes them using AI, and sends newsletters to subscribers. It leverages asynchronous processing with queues to handle long-running tasks efficiently within the constraints of serverless environments.

## System Architecture

![System Architecture](./images/system-architecture.png)

The system follows Domain-Driven Design principles and is built on a modern tech stack:

- **Frontend**: Optional admin panel for monitoring (not covered in initial scope)
- **Backend**: Express.js server with Vercel Cron jobs
- **Database**: Supabase PostgreSQL
- **Queuing**: Upstash Queue for handling long-running tasks
- **Web Scraping**: Playwright for extracting article content
- **AI Processing**: OpenAI API for summarization
- **Email Delivery**: Brevo (formerly Sendinblue) for newsletter distribution

## Core Domains

The system is organized into the following domain contexts:

1. **Article Scraping Domain**: Responsible for extracting content from configured websites
2. **Content Processing Domain**: Handles article storage and AI-based summarization
3. **Newsletter Generation Domain**: Creates compelling newsletters from article summaries
4. **Delivery Domain**: Manages subscriber lists and email distribution

## Process Flow

1. Scheduled cron jobs trigger the scraping process hourly for each configured source
2. Article extraction tasks are queued in Upstash to bypass serverless execution limits
3. System checks if the latest article from each source is already stored in the database
4. For new articles, the full content is retrieved and stored in Supabase with metadata
5. Summarization jobs process articles without existing summaries
6. Newsletter generation combines recent summaries into a cohesive email
7. Delivery services send the newsletter to subscribers via Brevo

## Key Technical Challenges

- Managing execution time limits in serverless environments
- Ensuring idempotency in queue processing
- Handling website structure changes that affect scraping
- Optimizing OpenAI prompt design for high-quality summaries
- Coordinating multiple asynchronous processes

The system is designed to be resilient, with failure handling and retry mechanisms at each stage of the process. 