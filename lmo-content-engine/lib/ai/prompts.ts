/**
 * AI Prompt Templates
 * Centralized prompt management for consistency
 */

export const prompts = {
  /**
   * Website research prompts
   */
  research: {
    websiteAnalysis: (url: string) => `
Analyze the website at ${url} and provide a comprehensive content strategy report.

Focus on:
1. Primary topics and themes
2. Target audience
3. Content gaps
4. Keyword opportunities
5. Content organization structure

Be specific and actionable.
    `.trim(),

    categoryDiscovery: (url: string, targetCount: number = 8) => `
Analyze ${url} and identify exactly ${targetCount} distinct content categories that would be valuable for a Q&A knowledge base.

Each category should:
- Be central to the website's purpose
- Have enough depth for 5+ subcategories
- Be searchable and SEO-valuable
- Be distinct from other categories

Return as JSON with title, description, and confidence (0-1).
    `.trim(),
  },

  /**
   * Category expansion prompts
   */
  categories: {
    generateSubcategories: (
      categoryTitle: string,
      categoryDescription: string,
      context: string
    ) => `
For the category "${categoryTitle}":
${categoryDescription}

Context: ${context}

Generate 5-7 specific subcategories that:
- Break down the main category logically
- Each support 10-20 questions
- Are specific enough to be useful
- Cover the category comprehensively

Return as JSON with title, description, confidence.
    `.trim(),
  },

  /**
   * Question generation prompts
   */
  questions: {
    generate: (
      subcategoryTitle: string,
      subcategoryDescription: string,
      context: string
    ) => `
Generate 12-15 high-quality questions for:
Topic: ${subcategoryTitle}
Description: ${subcategoryDescription}
Context: ${context}

Questions should:
- Match real search queries
- Be specific and answerable
- Vary in complexity
- Cover different aspects
- Include "what", "how", "why", "when" variations

Return as JSON with question, searchIntent, and keywords[].
    `.trim(),
  },

  /**
   * Content generation prompts
   */
  content: {
    shortAnswer: (question: string, keywords: string[], context?: string) => `
Write a concise, accurate answer (approximately 80 words) to:

Question: ${question}
Target Keywords: ${keywords.join(', ')}
${context ? `\nContext: ${context}` : ''}

Requirements:
- Exactly 80 words (+/- 10)
- Clear and direct
- Include primary keyword naturally
- Format for featured snippet
- Use markdown formatting

Focus on being helpful and accurate.
    `.trim(),

    longAnswer: (question: string, keywords: string[], context?: string) => `
Write a comprehensive answer (300-400 words) to:

Question: ${question}
Target Keywords: ${keywords.join(', ')}
${context ? `\nContext: ${context}` : ''}

Requirements:
- 300-400 words
- Use clear headings (##, ###)
- Include relevant examples
- Add lists or bullets where helpful
- Naturally incorporate keywords
- Markdown formatting
- Engaging and thorough

Make it the best answer on the internet for this question.
    `.trim(),
  },

  /**
   * Fact-checking prompts
   */
  factCheck: {
    verify: (content: string, question: string) => `
Fact-check this content that answers: "${question}"

Content:
---
${content}
---

Perform a thorough fact-check:
1. List all factual claims
2. Verify accuracy of each claim
3. Identify missing context or caveats
4. Note any potential errors
5. Check for outdated information
6. Assign confidence score (0-1)

Return as JSON with overallScore, confidence level, claims[], and issues[].
    `.trim(),

    crossReference: (claim: string, sources: string[]) => `
Verify this claim against authoritative sources:

Claim: "${claim}"

Known sources:
${sources.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Determine if the claim is:
- Verified (supported by sources)
- Unverified (no clear evidence)
- Disputed (contradicted by sources)

Provide confidence score and explanation.
    `.trim(),
  },

  /**
   * Quality assessment prompts
   */
  quality: {
    assess: (content: string, question: string) => `
Assess the quality of this content:

Question: ${question}
Content:
---
${content}
---

Rate on:
1. Accuracy (0-1)
2. Completeness (0-1)
3. Clarity (0-1)
4. SEO optimization (0-1)
5. Engagement (0-1)

Return as JSON with individual scores and overall quality score.
    `.trim(),

    readability: (content: string) => `
Analyze the readability of this content:

${content}

Provide:
- Flesch Reading Ease score
- Grade level
- Sentence complexity
- Vocabulary difficulty
- Suggestions for improvement

Return as JSON.
    `.trim(),
  },

  /**
   * System prompts for different roles
   */
  system: {
    contentStrategist: 'You are an expert content strategist with deep knowledge of SEO, user intent, and information architecture. Provide actionable, specific recommendations.',

    contentWriter: 'You are a professional content writer specializing in clear, engaging, SEO-optimized content. Write naturally while incorporating best practices.',

    factChecker: 'You are a meticulous fact-checker with expertise across multiple domains. Be thorough, objective, and cite sources when possible.',

    seoExpert: 'You are an SEO expert who understands search intent, keyword optimization, and content structure. Provide data-driven recommendations.',
  },
};

/**
 * Helper to format prompts with consistent structure
 */
export function formatPrompt(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7
): {
  messages: Array<{ role: 'system' | 'user'; content: string }>;
  temperature: number;
} {
  return {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
  };
}

/**
 * Extract JSON from AI response that might include markdown formatting
 */
export function extractJSON(response: string): any {
  // Remove markdown code blocks
  let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  // Try direct parsing first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to find JSON object in the text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to extract JSON from response');
  }
}
