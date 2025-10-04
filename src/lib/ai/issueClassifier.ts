// AI-Powered Issue Classification System
export interface IssueClassification {
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  suggestedDepartment: string
  estimatedResolutionTime: string
  keywords: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  urgencyScore: number
}

export interface ClassificationInput {
  title: string
  description: string
  location?: string
  images?: File[]
  reporterHistory?: number
  timeOfDay?: string
  weatherConditions?: string
}

// Mock AI Classification Engine (In production, this would connect to actual ML models)
export class AIIssueClassifier {
  // Example keyword mappings for each priority level
  private priorityKeywords: Record<'critical' | 'high' | 'medium' | 'low', string[]> = {
    critical: ['urgent', 'immediate', 'emergency', 'danger', 'life-threatening'],
    high: ['important', 'asap', 'major', 'severe', 'significant'],
    medium: ['moderate', 'normal', 'average', 'routine'],
    low: ['minor', 'low', 'trivial', 'optional']
  }

  private classifyPriority(
    text: string,
    input: ClassificationInput
  ): 'low' | 'medium' | 'high' | 'critical' {
    const priorityScores: Record<'critical' | 'high' | 'medium' | 'low', number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }

    for (const [priority, keywords] of Object.entries(this.priorityKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        const matches = text.match(regex)
        return acc + (matches ? matches.length : 0)
      }, 0)
      priorityScores[priority as keyof typeof priorityScores] = score
    }

    if (input.timeOfDay) {
      const hour = parseInt(input.timeOfDay.split(':')[0])
      if (hour >= 22 || hour <= 6) {
        priorityScores.high += 1
      }
    }

    if (input.weatherConditions?.includes('storm') || input.weatherConditions?.includes('heavy rain')) {
      priorityScores.high += 1
    }

    if (input.reporterHistory && input.reporterHistory > 5) {
      priorityScores.medium += 1
    }

    const maxScore = Math.max(...Object.values(priorityScores))
    if (maxScore === 0) return 'medium'

    const highestPriority = Object.entries(priorityScores).find(([_, score]) => score === maxScore)?.[0]
    return (highestPriority as 'low' | 'medium' | 'high' | 'critical') || 'medium'
  }

  // classifyIssue, analyzeSentiment, extractKeywords, calculateConfidence, calculateUrgencyScore

  public async classifyIssue(input: ClassificationInput): Promise<IssueClassification> {
    const text = `${input.title} ${input.description}`.toLowerCase();

    // Priority
    const priority = this.classifyPriority(text, input);

    // Sentiment
    const sentiment = this.analyzeSentiment(text);

    // Keywords
    const keywords = this.extractKeywords(text);

    // Confidence
    const confidence = this.calculateConfidence(text, priority, keywords);

    // Urgency Score
    const urgencyScore = this.calculateUrgencyScore(priority, sentiment);

    // Category (simple example)
    const category = this.classifyCategory(text);

    // Suggested Department (simple example)
    const suggestedDepartment = this.suggestDepartment(category);

    // Estimated Resolution Time (simple example)
    const estimatedResolutionTime = this.estimateResolutionTime(priority);

    return {
      category,
      priority,
      confidence,
      suggestedDepartment,
      estimatedResolutionTime,
      keywords,
      sentiment,
      urgencyScore
    };
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    if (text.includes('not happy') || text.includes('angry') || text.includes('bad')) return 'negative';
    if (text.includes('good') || text.includes('satisfied') || text.includes('happy')) return 'positive';
    return 'neutral';
  }

  private extractKeywords(text: string): string[] {
    const words = text.match(/\b\w+\b/g) || [];
    const stopwords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'of', 'to', 'in'];
    return Array.from(new Set(words.filter(w => !stopwords.includes(w))));
  }

  private calculateConfidence(
    text: string,
    priority: 'low' | 'medium' | 'high' | 'critical',
    keywords: string[]
  ): number {
    let score = 0.5;
    if (priority === 'critical' || priority === 'high') score += 0.2;
    if (keywords.length > 5) score += 0.1;
    return Math.min(1, score);
  }

  private calculateUrgencyScore(
    priority: 'low' | 'medium' | 'high' | 'critical',
    sentiment: 'positive' | 'neutral' | 'negative'
  ): number {
    let score = 50;
    if (priority === 'critical') score = 100;
    else if (priority === 'high') score = 80;
    else if (priority === 'medium') score = 60;
    else score = 30;
    if (sentiment === 'negative') score += 10;
    return Math.min(100, score);
  }

  private classifyCategory(text: string): string {
    if (text.includes('water')) return 'Water Supply';
    if (text.includes('road')) return 'Road Maintenance';
    if (text.includes('electricity')) return 'Electricity';
    if (text.includes('garbage')) return 'Sanitation';
    return 'Other';
  }

  private suggestDepartment(category: string): string {
    switch (category) {
      case 'Water Supply': return 'Water Department';
      case 'Road Maintenance': return 'Public Works';
      case 'Electricity': return 'Electricity Board';
      case 'Sanitation': return 'Sanitation Department';
      default: return 'General Administration';
    }
  }

  private estimateResolutionTime(priority: 'low' | 'medium' | 'high' | 'critical'): string {
    switch (priority) {
      case 'critical': return 'Within 24 hours';
      case 'high': return '2-3 days';
      case 'medium': return '3-5 days';
      case 'low': return '1-2 weeks';
      default: return '1-2 weeks';
    }
  }

}

// Export singleton instance
export const aiClassifier = new AIIssueClassifier()

// React hook for using AI classification
export function useAIClassification() {
  const classifyIssue = async (input: ClassificationInput) => {
    try {
      return await aiClassifier.classifyIssue(input)
    } catch (error) {
      console.error('AI Classification error:', error)
      return {
        category: 'other',
        priority: 'medium' as const,
        confidence: 0.5,
        suggestedDepartment: 'General Administration',
        estimatedResolutionTime: '1-2 weeks',
        keywords: [],
        sentiment: 'neutral' as const,
        urgencyScore: 50
      }
    }
  }

  return { classifyIssue }
}
