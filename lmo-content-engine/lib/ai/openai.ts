/**
 * OpenAI API Client
 * Used for content generation and fact-checking
 */

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIClient {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured');
    }
  }

  async chat(
    messages: OpenAIMessage[],
    model: string = 'gpt-4-turbo-preview'
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  /**
   * Generate a short answer (80 words)
   */
  async generateShortDraft(
    question: string,
    context?: string
  ): Promise<{
    content: string;
    wordCount: number;
    citations: string[];
  }> {
    const prompt = `Write a concise, accurate answer to this question in approximately 80 words:

Question: ${question}

${context ? `Context: ${context}` : ''}

Requirements:
- Be clear and direct
- Use simple language
- Provide specific details
- Cite sources if mentioning specific facts
- Optimize for featured snippets

Write in markdown format with proper formatting.`;

    const response = await this.chat([
      {
        role: 'system',
        content: 'You are an expert content writer specializing in concise, SEO-optimized answers.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const wordCount = response.split(/\s+/).length;
    const citations = this.extractCitations(response);

    return {
      content: response,
      wordCount,
      citations,
    };
  }

  /**
   * Generate a long answer (250+ words)
   */
  async generateLongDraft(
    question: string,
    context?: string
  ): Promise<{
    content: string;
    wordCount: number;
    citations: string[];
  }> {
    const prompt = `Write a comprehensive, detailed answer to this question in 250-400 words:

Question: ${question}

${context ? `Context: ${context}` : ''}

Requirements:
- Cover the topic thoroughly
- Include relevant examples
- Use clear headings and structure
- Cite authoritative sources
- Make it engaging and readable
- Optimize for search engines

Write in markdown format with proper formatting including headings, lists, and emphasis where appropriate.`;

    const response = await this.chat([
      {
        role: 'system',
        content: 'You are an expert content writer specializing in comprehensive, SEO-optimized articles.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const wordCount = response.split(/\s+/).length;
    const citations = this.extractCitations(response);

    return {
      content: response,
      wordCount,
      citations,
    };
  }

  /**
   * Fact-check a piece of content
   */
  async factCheck(
    content: string,
    question: string
  ): Promise<{
    overallScore: number;
    confidence: 'high' | 'medium' | 'low';
    claims: Array<{
      claim: string;
      verification: 'verified' | 'unverified' | 'disputed';
      confidence: number;
      explanation: string;
    }>;
    issues: Array<{
      type: 'factual_error' | 'missing_context' | 'outdated' | 'unsupported';
      severity: 'critical' | 'warning' | 'info';
      description: string;
      suggestedFix?: string;
    }>;
  }> {
    const prompt = `Fact-check this content that answers the question: "${question}"

Content:
${content}

Analyze the content and:
1. Identify all factual claims
2. Verify each claim's accuracy
3. Note any missing context or caveats
4. Flag potential issues or errors
5. Provide an overall accuracy score (0-1)

Return as JSON:
{
  "overallScore": 0.85,
  "confidence": "high",
  "claims": [
    {
      "claim": "specific claim from content",
      "verification": "verified",
      "confidence": 0.9,
      "explanation": "why this is verified"
    }
  ],
  "issues": [
    {
      "type": "missing_context",
      "severity": "warning",
      "description": "description of issue",
      "suggestedFix": "how to fix it"
    }
  ]
}`;

    const response = await this.chat([
      {
        role: 'system',
        content: 'You are an expert fact-checker with deep knowledge across many domains. Be thorough and objective.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse fact-check response');
    }
  }

  /**
   * Extract citations from markdown content
   */
  private extractCitations(content: string): string[] {
    const citations: string[] = [];

    // Extract URLs
    const urlMatches = content.match(/https?:\/\/[^\s)]+/g);
    if (urlMatches) {
      citations.push(...urlMatches);
    }

    // Extract bracketed references [1], [2], etc.
    const refMatches = content.match(/\[\d+\]/g);
    if (refMatches) {
      citations.push(...refMatches);
    }

    return Array.from(new Set(citations)); // Remove duplicates
  }
}

// Export singleton instance
export const openai = new OpenAIClient();
