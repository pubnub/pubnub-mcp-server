#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join as pathJoin } from 'path';
import fs from 'fs';
import { HtmlToMarkdown } from './lib/html-to-markdown.js';
import { parse } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function downloadAllDocs() {
    console.log('Starting PubNub SDK documentation download...');
    console.log(`Languages: ${languages.length}`);
    console.log(`API References: ${apiReferences.length}`);
    console.log(`Total URLs to download: ${languages.length * (1 + apiReferences.length)}`);
    console.log('');

    let totalSuccess = 0;
    let totalErrors = 0;
    const errors = [];

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
                fs.writeFileSync(overviewPath, overviewContent, 'utf8');
                console.log(`    ✅ Saved: ${overviewFilename}`);
                totalSuccess++;
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
                    
                    fs.writeFileSync(apiRefPath, apiRefContent, 'utf8');
                    console.log(`    ✅ Saved: ${apiRefFilename}`);
                    totalSuccess++;
                }
            } catch (err) {
                const errorMsg = `Error processing ${apiRefURL}: ${err.message}`;
                console.log(`    ❌ Failed: ${errorMsg}`);
                errors.push({ url: apiRefURL, error: errorMsg });
                totalErrors++;
            }

            // Small delay between API reference requests
            await delay(200);
        }

        // Longer delay between languages to be respectful to the server
        await delay(500);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 DOWNLOAD SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful downloads: ${totalSuccess}`);
    console.log(`❌ Failed downloads: ${totalErrors}`);
    console.log(`📁 Files saved to: ${sdkDocsDir}`);

    if (errors.length > 0) {
        console.log('\n🔍 ERROR DETAILS:');
        errors.forEach((error, index) => {
            console.log(`${index + 1}. ${error.url}`);
            console.log(`   ${error.error}`);
        });
    }

    console.log('\n✨ Download process completed!');
}

// Run the download if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    downloadAllDocs().catch(err => {
        console.error('Fatal error during download:', err);
        process.exit(1);
    });
}

export { downloadAllDocs, loadArticle };