#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join as pathJoin } from 'path';
import fs from 'fs';
import { HtmlToMarkdown } from './lib/html-to-markdown.js';
import { parse } from 'node-html-parser';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const modelFlag = args.find(arg => arg.startsWith('--model='));
const MODEL = modelFlag ? modelFlag.split('=')[1] : 'o3-pro-2025-06-10';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is required');
    process.exit(1);
}

// Configuration matching the main index.js file
const languages = [
    'javascript', 'python', 'java', 'go', 'ruby',
    'swift', 'objective-c', 'c-sharp', 'php', 'dart',
    'rust', 'unity', 'kotlin', 'unreal',
];

const apiReferences = [
    'configuration',
    'publish-and-subscribe',
    'presence',
    'access-manager',
    'channel-groups',
    'storage-and-playback',
    'mobile-push',
    'objects',
    'files',
    'message-actions',
    'misc',
    // Note: 'functions' is excluded as it's already a local file
];

// Ensure sdk_docs directory exists
const sdkDocsDir = pathJoin(__dirname, 'resources', 'sdk_docs');
if (!fs.existsSync(sdkDocsDir)) {
    fs.mkdirSync(sdkDocsDir, { recursive: true });
}

// Replicate the exact loadArticle function from index.js
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

// Function to sanitize filenames
function sanitizeFilename(str) {
    return str.replace(/[^a-z0-9-]/gi, '_');
}

// Function to add delay between requests to avoid rate limiting
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to get file size in bytes
function getFileSizeInBytes(content) {
    return Buffer.byteLength(content, 'utf8');
}

// Function to format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${Math.round(bytes / (1024 * 1024))}MB`;
}

// Function to summarize content using OpenAI
async function summarizeContent(content, language, section) {
    try {
        console.log(`    🤖 Summarizing with ${MODEL}...`);
        
        const chatPrompt = `Summarize this PubNub SDK documentation for ${language} (${section} section) while preserving ALL code blocks and critical technical information. Remove redundant explanations but keep essential configuration details, method signatures, parameters, and examples. Maintain the markdown formatting and structure.

Documentation content:
${content}`;

        const completionPrompt = `Summarize this PubNub SDK documentation for ${language} (${section} section) while preserving ALL code blocks and critical technical information. Remove redundant explanations but keep essential configuration details, method signatures, parameters, and examples. Maintain the markdown formatting and structure.

Documentation content:
${content}

Summarized version:`;

        // Check if it's an o3 model that uses the responses endpoint
        if (MODEL.includes('o3')) {
            try {
                console.log(`    🔄 Using o3 responses endpoint...`);
                const response = await openai.responses.create({
                    model: MODEL,
                    input: [
                        {
                            type: "message",
                            role: "user",
                            content: `You are a technical documentation expert. Your task is to condense PubNub SDK documentation while preserving all code blocks, method signatures, parameters, and critical technical details. Remove redundant explanations and keep only essential information.

${chatPrompt}`
                        }
                    ],
                    text: {
                        format: {
                            type: "text"
                        }
                    },
                    reasoning: {
                        effort: "medium",
                        summary: "auto"
                    },
                    tools: [],
                    store: true
                });
                console.log(`    ✅ O3 responses successful`);
                
                // The O3 API returns text content in response.output_text
                if (response.output_text) {
                    return response.output_text;
                } else {
                    console.log(`    ⚠️  No output_text found, falling back to original content`);
                    return content;
                }
            } catch (o3Error) {
                console.log(`    ⚠️  O3 responses failed: ${o3Error.message}`);
                
                // Try with GPT-4 as fallback
                try {
                    console.log(`    🔄 Trying fallback model: gpt-4...`);
                    const response = await openai.chat.completions.create({
                        model: 'gpt-4',
                        messages: [
                            {
                                role: "system",
                                content: "You are a technical documentation expert. Your task is to condense PubNub SDK documentation while preserving all code blocks, method signatures, parameters, and critical technical details. Remove redundant explanations and keep only essential information."
                            },
                            {
                                role: "user",
                                content: chatPrompt
                            }
                        ],
                        max_tokens: 4000,
                        temperature: 0.1
                    });
                    console.log(`    ✅ GPT-4 fallback successful`);
                    return response.choices[0].message.content;
                } catch (fallbackError) {
                    console.log(`    ⚠️  GPT-4 fallback also failed: ${fallbackError.message}`);
                    throw new Error(`O3 and GPT-4 failed. O3: ${o3Error.message}, GPT-4: ${fallbackError.message}`);
                }
            }
        } else {
            // Try chat completions for non-o3 models
            try {
                console.log(`    🔄 Using chat completions endpoint...`);
                const response = await openai.chat.completions.create({
                    model: MODEL,
                    messages: [
                        {
                            role: "system",
                            content: "You are a technical documentation expert. Your task is to condense PubNub SDK documentation while preserving all code blocks, method signatures, parameters, and critical technical details. Remove redundant explanations and keep only essential information."
                        },
                        {
                            role: "user",
                            content: chatPrompt
                        }
                    ],
                    max_tokens: 4000,
                    temperature: 0.1
                });
                console.log(`    ✅ Chat completions successful`);
                return response.choices[0].message.content;
            } catch (chatError) {
                console.log(`    ⚠️  Chat completions failed: ${chatError.message}`);
                
                // Try completions endpoint as fallback for older models
                try {
                    console.log(`    🔄 Trying completions endpoint...`);
                    const response = await openai.completions.create({
                        model: MODEL,
                        prompt: completionPrompt,
                        max_tokens: 4000,
                        temperature: 0.1,
                        stop: null
                    });
                    console.log(`    ✅ Completions successful`);
                    return response.choices[0].text;
                } catch (completionError) {
                    console.log(`    ⚠️  Completions also failed: ${completionError.message}`);
                    throw new Error(`All endpoints failed. Chat: ${chatError.message}, Completions: ${completionError.message}`);
                }
            }
        }
    } catch (error) {
        console.log(`    ⚠️  AI summarization failed: ${error.message}`);
        console.log(`    📄 Falling back to original content`);
        return content; // Fallback to original content
    }
}

async function downloadAllDocs() {
    console.log('Starting PubNub SDK documentation download with AI summarization...');
    console.log(`Model: ${MODEL}`);
    console.log(`Languages: ${languages.length}`);
    console.log(`API References: ${apiReferences.length}`);
    console.log(`Total URLs to download: ${languages.length * (1 + apiReferences.length)}`);
    console.log('');

    let totalSuccess = 0;
    let totalErrors = 0;
    let totalArticlesProcessed = 0;
    let totalOriginalSize = 0;
    let totalFinalSize = 0;
    const errors = [];
    const sizeStats = [];

    for (const language of languages) {
        console.log(`\n📚 Processing language: ${language}`);
        
        // Download SDK overview
        console.log(`  📖 Downloading overview...`);
        const sdkURL = `https://www.pubnub.com/docs/sdks/${language}`;
        const overviewFilename = `${sanitizeFilename(language)}_overview.md`;
        const overviewPath = pathJoin(sdkDocsDir, overviewFilename);
        
        try {
            const overviewContent = await loadArticle(sdkURL);
            if (overviewContent.startsWith('Error fetching')) {
                console.log(`    ❌ Failed: ${overviewContent}`);
                errors.push({ url: sdkURL, error: overviewContent });
                totalErrors++;
            } else {
                const originalSize = getFileSizeInBytes(overviewContent);
                console.log(`    📏 Original size: ${formatFileSize(originalSize)}`);
                
                // Summarize content with AI
                const summarizedContent = await summarizeContent(overviewContent, language, 'overview');
                const finalSize = getFileSizeInBytes(summarizedContent);
                
                console.log(`    📏 Final size: ${formatFileSize(finalSize)}`);
                const compressionRatio = ((originalSize - finalSize) / originalSize * 100).toFixed(1);
                console.log(`    📊 Compression: ${compressionRatio}%`);
                
                fs.writeFileSync(overviewPath, summarizedContent, 'utf8');
                console.log(`    ✅ Saved: ${overviewFilename}`);
                
                totalSuccess++;
                totalArticlesProcessed++;
                totalOriginalSize += originalSize;
                totalFinalSize += finalSize;
                sizeStats.push({
                    file: overviewFilename,
                    originalSize,
                    finalSize,
                    compressionRatio: parseFloat(compressionRatio)
                });
            }
        } catch (err) {
            const errorMsg = `Error processing ${sdkURL}: ${err.message}`;
            console.log(`    ❌ Failed: ${errorMsg}`);
            errors.push({ url: sdkURL, error: errorMsg });
            totalErrors++;
        }

        // Small delay to avoid overwhelming the server
        await delay(200);

        // Download API references
        for (const apiRef of apiReferences) {
            console.log(`  📄 Downloading ${apiRef}...`);
            const apiRefURL = `https://www.pubnub.com/docs/sdks/${language}/api-reference/${apiRef}`;
            const apiRefFilename = `${sanitizeFilename(language)}_${sanitizeFilename(apiRef)}.md`;
            const apiRefPath = pathJoin(sdkDocsDir, apiRefFilename);
            
            try {
                let apiRefContent = await loadArticle(apiRefURL);
                
                if (apiRefContent.startsWith('Error fetching')) {
                    console.log(`    ❌ Failed: ${apiRefContent}`);
                    errors.push({ url: apiRefURL, error: apiRefContent });
                    totalErrors++;
                } else {
                    // Apply the same "(old)" section removal logic as in index.js
                    const lines = apiRefContent.split('\n');
                    const oldIndex = lines.findIndex((line) => /^##\s.*\(old\)/i.test(line));
                    if (oldIndex !== -1) {
                        apiRefContent = lines.slice(0, oldIndex).join('\n');
                    }
                    
                    const originalSize = getFileSizeInBytes(apiRefContent);
                    console.log(`    📏 Original size: ${formatFileSize(originalSize)}`);
                    
                    // Summarize content with AI
                    const summarizedContent = await summarizeContent(apiRefContent, language, apiRef);
                    const finalSize = getFileSizeInBytes(summarizedContent);
                    
                    console.log(`    📏 Final size: ${formatFileSize(finalSize)}`);
                    const compressionRatio = ((originalSize - finalSize) / originalSize * 100).toFixed(1);
                    console.log(`    📊 Compression: ${compressionRatio}%`);
                    
                    fs.writeFileSync(apiRefPath, summarizedContent, 'utf8');
                    console.log(`    ✅ Saved: ${apiRefFilename}`);
                    
                    totalSuccess++;
                    totalArticlesProcessed++;
                    totalOriginalSize += originalSize;
                    totalFinalSize += finalSize;
                    sizeStats.push({
                        file: apiRefFilename,
                        originalSize,
                        finalSize,
                        compressionRatio: parseFloat(compressionRatio)
                    });
                }
            } catch (err) {
                const errorMsg = `Error processing ${apiRefURL}: ${err.message}`;
                console.log(`    ❌ Failed: ${errorMsg}`);
                errors.push({ url: apiRefURL, error: errorMsg });
                totalErrors++;
            }

            // Small delay between API reference requests
            await delay(500); // Increased delay for AI processing
        }

        // Longer delay between languages to be respectful to the server
        await delay(500);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 DOWNLOAD & SUMMARIZATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful downloads: ${totalSuccess}`);
    console.log(`❌ Failed downloads: ${totalErrors}`);
    console.log(`📄 Articles processed: ${totalArticlesProcessed}`);
    console.log(`📁 Files saved to: ${sdkDocsDir}`);
    
    // Size statistics
    const overallCompressionRatio = ((totalOriginalSize - totalFinalSize) / totalOriginalSize * 100).toFixed(1);
    console.log('\n📏 SIZE STATISTICS:');
    console.log(`   Original total size: ${formatFileSize(totalOriginalSize)}`);
    console.log(`   Final total size: ${formatFileSize(totalFinalSize)}`);
    console.log(`   Overall compression: ${overallCompressionRatio}%`);
    console.log(`   Space saved: ${formatFileSize(totalOriginalSize - totalFinalSize)}`);

    // Top compression ratios
    if (sizeStats.length > 0) {
        const topCompressions = sizeStats
            .sort((a, b) => b.compressionRatio - a.compressionRatio)
            .slice(0, 5);
        
        console.log('\n🏆 TOP COMPRESSION RATIOS:');
        topCompressions.forEach((stat, index) => {
            console.log(`   ${index + 1}. ${stat.file}: ${stat.compressionRatio}% (${formatFileSize(stat.originalSize)} → ${formatFileSize(stat.finalSize)})`);
        });
    }

    if (errors.length > 0) {
        console.log('\n🔍 ERROR DETAILS:');
        errors.forEach((error, index) => {
            console.log(`${index + 1}. ${error.url}`);
            console.log(`   ${error.error}`);
        });
    }

    console.log('\n✨ Download and summarization process completed!');
}

// Run the download if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    downloadAllDocs().catch(err => {
        console.error('Fatal error during download:', err);
        process.exit(1);
    });
}

export { downloadAllDocs, loadArticle };