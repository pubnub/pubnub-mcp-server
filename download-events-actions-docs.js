#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join as pathJoin } from 'path';
import fs from 'fs';
import { HtmlToMarkdown } from './lib/html-to-markdown.js';
import { parse } from 'node-html-parser';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is required');
    process.exit(1);
}

const MODEL = 'gpt-5';

// Function to load article content from URL (same logic as download-sdk-docs.js)
async function loadArticle(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return `Error fetching ${url}: ${response.status} ${response.statusText}`;
        }

        const html = await response.text();
        const root = parse(html);
        const article = root.querySelector('article');
        const converter = new HtmlToMarkdown();
        return converter.turndown(article?.innerHTML || '');
    } catch (err) {
        return `Error fetching ${url}: ${err.message}`;
    }
}

// Function to add delay between requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to summarize and condense content using OpenAI GPT-5
async function condenseContent(content) {
    try {
        console.log(`    🤖 Condensing with ${MODEL}...`);
        
        const chatPrompt = `Please condense this PubNub Events & Actions documentation by removing repetitive details while preserving all essential information. Focus on:

1. Keep all code examples and configuration details
2. Remove redundant explanations and verbose descriptions
3. Maintain the structure and all technical specifications
4. Preserve method signatures, parameters, and setup instructions
5. Keep troubleshooting and important notes
6. Maintain markdown formatting

Documentation content:
${content}`;

        // Use chat completions for GPT-5
        const response = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a technical documentation expert. Your task is to condense PubNub Events & Actions documentation while preserving all code blocks, configuration details, and essential technical information. Remove repetitive explanations but keep all critical setup and usage information."
                },
                {
                    role: "user",
                    content: chatPrompt
                }
            ],
        });
        
        console.log(`    🤖 GPT-5 response received`);
        console.log(`    📏 Response: ${response.choices[0]}`);
        const condensedText = response.choices[0].message.content;
        if (!condensedText || condensedText.trim().length === 0) {
            console.log(`    ⚠️  GPT-5 returned empty response, using original content`);
            return content;
        }
        console.log(`    ✅ Content condensed successfully`);
        return condensedText;
    } catch (error) {
        console.log(`    ⚠️  AI condensation failed: ${error.message}`);
        console.log(`    📄 Using original content`);
        return content; // Fallback to original content
    }
}

// Load URLs from events_and_actions_urls.txt
function loadUrls() {
    const urlsFilePath = pathJoin(__dirname, 'events_and_actions_urls.txt');
    
    if (!fs.existsSync(urlsFilePath)) {
        console.error('❌ Error: events_and_actions_urls.txt file not found');
        process.exit(1);
    }
    
    const urlsContent = fs.readFileSync(urlsFilePath, 'utf8');
    const urls = urlsContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.startsWith('https://'));
    
    return urls;
}

async function processEventsActions() {
    console.log('Starting PubNub Events & Actions documentation processing...');
    console.log(`Model: ${MODEL}`);
    
    // Load URLs from file
    const urls = loadUrls();
    console.log(`Found ${urls.length} URLs to process`);
    
    let allContent = [];
    let successfulRequests = 0;
    let failedRequests = 0;
    
    // Process each URL
    for (const url of urls) {
        console.log(`\n📄 Processing: ${url}`);
        
        try {
            const content = await loadArticle(url);
            
            if (content.startsWith('Error fetching')) {
                console.log(`    ❌ Failed: ${content}`);
                failedRequests++;
            } else {
                console.log(`    ✅ Content retrieved successfully`);
                allContent.push({
                    url,
                    content
                });
                successfulRequests++;
            }
        } catch (err) {
            console.log(`    ❌ Error processing ${url}: ${err.message}`);
            failedRequests++;
        }
        
        // Add delay between requests
        await delay(1000);
    }
    
    console.log(`\n📊 Content retrieval complete:`);
    console.log(`✅ Successful: ${successfulRequests}`);
    console.log(`❌ Failed: ${failedRequests}`);
    
    // Combine all content
    console.log(`\n🔄 Combining and condensing content...`);
    
    let combinedContent = '# PubNub Events & Actions Guide\n\n';
    combinedContent += 'This guide covers PubNub Events & Actions functionality, compiled from official documentation.\n\n';
    
    // Add each section
    for (const { url, content } of allContent) {
        const sectionTitle = url.split('/').pop().replace(/-/g, ' ').replace(/&/g, 'and');
        combinedContent += `## ${sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1)}\n\n`;
        combinedContent += `*Source: ${url}*\n\n`;
        combinedContent += content;
        combinedContent += '\n\n---\n\n';
    }
    
    // Condense the combined content
    const condensedContent = await condenseContent(combinedContent);
    
    // Ensure resources directory exists
    const resourcesDir = pathJoin(__dirname, 'resources');
    if (!fs.existsSync(resourcesDir)) {
        fs.mkdirSync(resourcesDir, { recursive: true });
    }
    
    // Save to file
    const outputPath = pathJoin(resourcesDir, 'how_to_use_pubnub_events_and_actions.md');
    fs.writeFileSync(outputPath, condensedContent, 'utf8');
    
    console.log(`\n✅ Documentation saved to: ${outputPath}`);
    console.log(`📏 Final size: ${Math.round(Buffer.byteLength(condensedContent, 'utf8') / 1024)}KB`);
    console.log('\n✨ Process completed successfully!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    processEventsActions().catch(err => {
        console.error('Fatal error during processing:', err);
        process.exit(1);
    });
}

export { processEventsActions, loadArticle };
