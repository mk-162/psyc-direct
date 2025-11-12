/**
 * Perplexity API Client
 * Used for website research and topic discovery
 */

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
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

export class PerplexityClient {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PERPLEXITY_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Perplexity API key not configured');
    }
  }

  async chat(
    messages: PerplexityMessage[],
    model: string = 'sonar-pro'
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Perplexity API key not configured');
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
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${error}`);
    }

    const data: PerplexityResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  /**
   * Research a website and return topic suggestions
   */
  async researchWebsite(websiteUrl: string): Promise<{
    categories: Array<{
      title: string;
      description: string;
      confidence: number;
    }>;
  }> {
    const prompt = `Analyze the website at ${websiteUrl} and identify the top 5-10 content categories that would be valuable for creating a comprehensive Q&A knowledge base. For each category:

1. Provide a clear, concise title
2. Write a 1-2 sentence description
3. Rate confidence (0-1) that this topic is relevant to the site

Focus on topics that:
- Are central to the website's purpose
- Would benefit from detailed Q&A content
- Are relevant for search engines and AI assistants
- Have enough depth for multiple sub-topics

Return the response as a JSON array with this structure:
{
  "categories": [
    {
      "title": "Category Name",
      "description": "Brief description",
      "confidence": 0.95
    }
  ]
}`;

    const response = await this.chat([
      {
        role: 'system',
        content: 'You are an expert content strategist and SEO specialist.',
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
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse Perplexity response');
    }
  }

  /**
   * Generate subcategories for a given category
   */
  async generateSubcategories(
    categoryTitle: string,
    categoryDescription: string,
    websiteUrl: string
  ): Promise<{
    subcategories: Array<{
      title: string;
      description: string;
      confidence: number;
    }>;
  }> {
    const prompt = `For the topic "${categoryTitle}" (${categoryDescription}) on the website ${websiteUrl}, generate 3-7 relevant subcategories that would work well for detailed Q&A content.

Each subcategory should:
- Be specific and focused
- Have clear boundaries
- Support multiple questions
- Be relevant to the main category

Return as JSON:
{
  "subcategories": [
    {
      "title": "Subcategory Name",
      "description": "Brief description",
      "confidence": 0.90
    }
  ]
}`;

    const response = await this.chat([
      {
        role: 'system',
        content: 'You are an expert content strategist.',
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
      throw new Error('Failed to parse subcategories response');
    }
  }

  /**
   * Generate questions for a subcategory
   */
  async generateQuestions(
    subcategoryTitle: string,
    subcategoryDescription: string,
    websiteUrl: string
  ): Promise<{
    questions: Array<{
      question: string;
      searchIntent: 'informational' | 'navigational' | 'transactional';
      keywords: string[];
    }>;
  }> {
    const prompt = `For the topic "${subcategoryTitle}" (${subcategoryDescription}) related to ${websiteUrl}, generate 10-15 high-quality questions that would be valuable for a Q&A knowledge base.

Questions should:
- Be clear and specific
- Match common search queries
- Cover different aspects of the topic
- Be answerable with detailed content

For each question, identify:
- The question text
- Search intent (informational, navigational, or transactional)
- 3-5 relevant keywords

Return as JSON:
{
  "questions": [
    {
      "question": "What is...",
      "searchIntent": "informational",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}`;

    const response = await this.chat([
      {
        role: 'system',
        content: 'You are an expert in SEO and content strategy.',
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
      throw new Error('Failed to parse questions response');
    }
  }
}

// Export singleton instance
export const perplexity = new PerplexityClient();
