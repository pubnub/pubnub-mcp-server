/**
 * Lightweight HTML to Markdown converter
 * Handles basic HTML elements commonly found in documentation
 */

export class HtmlToMarkdown {
  constructor() {
    // Basic HTML entities that need to be decoded
    this.entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&mdash;': '—',
      '&ndash;': '–',
      '&hellip;': '…',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
    };
  }

  /**
   * Convert HTML string or DOM element to Markdown
   * @param {string|Element} input - HTML string or DOM element
   * @returns {string} Markdown output
   */
  turndown(input) {
    if (typeof input === 'string') {
      // If it's a string, we need to parse it first
      // For now, we'll work with the string directly
      return this.convertHtmlString(input);
    } else if (input && typeof input === 'object') {
      // If it's a DOM element, get its HTML
      return this.convertHtmlString(input.innerHTML || input.toString());
    }
    return '';
  }

  /**
   * Convert HTML string to Markdown
   * @param {string} html - HTML string
   * @returns {string} Markdown output
   */
  convertHtmlString(html) {
    if (!html) return '';

    let markdown = html;

    // Remove script and style tags with their content
    markdown = markdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    markdown = markdown.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Convert headings
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n');

    // Convert links
    markdown = markdown.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Convert emphasis
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Convert code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    
    // Convert pre/code blocks
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, code) => {
      return '\n```\n' + this.decodeEntities(code) + '\n```\n';
    });
    
    // Convert pre blocks without code
    markdown = markdown.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (match, content) => {
      return '\n```\n' + this.decodeEntities(content) + '\n```\n';
    });

    // Convert lists
    // Unordered lists
    markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
      return '\n' + content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
    });

    // Ordered lists
    let olCounter = 0;
    markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
      olCounter = 0;
      return '\n' + content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        olCounter++;
        return `${olCounter}. $1\n`;
      }) + '\n';
    });

    // Convert blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
      return '\n' + content.trim().split('\n').map(line => '> ' + line).join('\n') + '\n';
    });

    // Convert paragraphs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');

    // Convert line breaks
    markdown = markdown.replace(/<br[^>]*>/gi, '  \n');

    // Convert horizontal rules
    markdown = markdown.replace(/<hr[^>]*>/gi, '\n---\n');

    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    markdown = this.decodeEntities(markdown);

    // Clean up extra newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    
    // Trim whitespace
    markdown = markdown.trim();

    return markdown;
  }

  /**
   * Decode HTML entities
   * @param {string} text - Text with HTML entities
   * @returns {string} Decoded text
   */
  decodeEntities(text) {
    // Decode named entities
    Object.entries(this.entities).forEach(([entity, char]) => {
      text = text.replace(new RegExp(entity, 'g'), char);
    });

    // Decode numeric entities
    text = text.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });

    // Decode hex entities
    text = text.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    return text;
  }
}

// Export a default instance for compatibility with TurndownService
export default HtmlToMarkdown;