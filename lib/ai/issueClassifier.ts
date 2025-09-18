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
  private categoryKeywords: Record<string, string[]> = {
    'water_supply': [
      'water', 'pipe', 'leak', 'burst', 'pressure', 'supply', 'tap', 'valve', 'sewage',
      'drainage', 'flood', 'overflow', 'blockage', 'contamination', 'quality'
    ],
    'road_maintenance': [
      'road', 'pothole', 'crack', 'asphalt', 'traffic', 'signal', 'sign', 'marking',
      'bridge', 'sidewalk', 'pavement', 'construction', 'barrier', 'speed bump'
    ],
    'waste_management': [
      'garbage', 'trash', 'waste', 'bin', 'collection', 'disposal', 'recycling',
      'dump', 'smell', 'overflow', 'pickup', 'sanitation', 'litter'
    ],
    'public_safety': [
      'safety', 'crime', 'theft', 'violence', 'emergency', 'fire', 'accident',
      'security', 'police', 'ambulance', 'danger', 'hazard', 'vandalism'
    ],
    'electrical_issues': [
      'electricity', 'power', 'outage', 'blackout', 'wire', 'pole', 'transformer',
      'streetlight', 'cable', 'voltage', 'short circuit', 'sparking'
    ],
    'public_health': [
      'health', 'disease', 'epidemic', 'vaccination', 'hospital', 'clinic',
      'medicine', 'doctor', 'sanitation', 'hygiene', 'pest', 'mosquito'
    ],
    'environment': [
      'pollution', 'air quality', 'noise', 'tree', 'park', 'green', 'environment',
      'carbon', 'emission', 'toxic', 'chemical', 'wildlife'
    ]
  }

  private priorityKeywords: Record<string, string[]> = {
    'critical': [
      'emergency', 'urgent', 'immediate', 'danger', 'life threatening', 'fire',
      'explosion', 'major leak', 'collapse', 'accident', 'injury', 'death'
    ],
    'high': [
      'serious', 'major', 'significant', 'important', 'affecting many',
      'main road', 'hospital', 'school', 'public building'
    ],
    'medium': [
      'moderate', 'noticeable', 'concerning', 'needs attention',
      'residential area', 'local', 'community'
    ],
    'low': [
      'minor', 'small', 'cosmetic', 'aesthetic', 'improvement',
      'suggestion', 'enhancement'
    ]
  }

  private departmentMapping: Record<string, string> = {
    'water_supply': 'Water & Sewerage Department',
    'road_maintenance': 'Public Works Department',
    'waste_management': 'Sanitation Department',
    'public_safety': 'Police & Emergency Services',
    'electrical_issues': 'Electrical Department',
    'public_health': 'Health Department',
    'environment': 'Environment Department'
  }

  private resolutionTimeEstimates: Record<string, Record<string, string>> = {
    'critical': {
      'water_supply': '2-4 hours',
      'road_maintenance': '4-8 hours',
      'waste_management': '1-2 hours',
      'public_safety': 'Immediate',
      'electrical_issues': '2-6 hours',
      'public_health': 'Immediate',
      'environment': '1-3 days'
    },
    'high': {
      'water_supply': '1-2 days',
      'road_maintenance': '2-5 days',
      'waste_management': '4-8 hours',
      'public_safety': '2-4 hours',
      'electrical_issues': '1-2 days',
      'public_health': '1-2 days',
      'environment': '3-7 days'
    },
    'medium': {
      'water_supply': '3-7 days',
      'road_maintenance': '1-2 weeks',
      'waste_management': '1-2 days',
      'public_safety': '1-3 days',
      'electrical_issues': '3-7 days',
      'public_health': '3-7 days',
      'environment': '1-2 weeks'
    },
    'low': {
      'water_supply': '1-2 weeks',
      'road_maintenance': '2-4 weeks',
      'waste_management': '3-7 days',
      'public_safety': '1-2 weeks',
      'electrical_issues': '1-2 weeks',
      'public_health': '1-2 weeks',
      'environment': '2-4 weeks'
    }
  }

  async classifyIssue(input: ClassificationInput): Promise<IssueClassification> {
    const text = `${input.title} ${input.description}`.toLowerCase()
    
    // Category Classification
    const category = this.classifyCategory(text)
    
    // Priority Classification
    const priority = this.classifyPriority(text, input)
    
    // Sentiment Analysis
    const sentiment = this.analyzeSentiment(text)
    
    // Extract Keywords
    const keywords = this.extractKeywords(text)
    
    // Calculate Confidence
    const confidence = this.calculateConfidence(text, category, priority)
    
    // Calculate Urgency Score
    const urgencyScore = this.calculateUrgencyScore(priority, sentiment, input)
    
    return {
      category,
      priority,
      confidence,
      suggestedDepartment: this.departmentMapping[category] || 'General Administration',
      estimatedResolutionTime: this.resolutionTimeEstimates[priority]?.[category] || '1-2 weeks',
      keywords,
      sentiment,
      urgencyScore
    }
  }

  private classifyCategory(text: string): string {
    let bestCategory = 'other'
    let maxScore = 0

    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        const matches = text.match(regex)
        return acc + (matches ? matches.length : 0)
      }, 0)

      if (score > maxScore) {
        maxScore = score
        bestCategory = category
      }
    }

    return bestCategory
  }

  private classifyPriority(text: string, input: ClassificationInput): 'low' | 'medium' | 'high' | 'critical' {
    let priorityScores = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }

    // Keyword-based scoring
    for (const [priority, keywords] of Object.entries(this.priorityKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        const matches = text.match(regex)
        return acc + (matches ? matches.length : 0)
      }, 0)
      priorityScores[priority as keyof typeof priorityScores] = score
    }

    // Time-based urgency (night time issues might be more urgent)
    if (input.timeOfDay) {
      const hour = parseInt(input.timeOfDay.split(':')[0])
      if (hour >= 22 || hour <= 6) {
        priorityScores.high += 1
      }
    }

    // Weather-based urgency
    if (input.weatherConditions?.includes('storm') || input.weatherConditions?.includes('heavy rain')) {
      priorityScores.high += 1
    }

    // Reporter history (frequent reporters might indicate genuine issues)
    if (input.reporterHistory && input.reporterHistory > 5) {
      priorityScores.medium += 1
    }

    // Find highest scoring priority
    const maxScore = Math.max(...Object.values(priorityScores))
    if (maxScore === 0) return 'medium' // Default priority

    const highestPriority = Object.entries(priorityScores).find(([_, score]) => score === maxScore)?.[0]
    return (highestPriority as 'low' | 'medium' | 'high' | 'critical') || 'medium'
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'thank', 'appreciate', 'helpful', 'quick', 'efficient']
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disgusting', 'angry', 'frustrated', 'disappointed', 'urgent', 'emergency']

    const positiveScore = positiveWords.reduce((acc, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      return acc + (text.match(regex)?.length || 0)
    }, 0)

    const negativeScore = negativeWords.reduce((acc, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      return acc + (text.match(regex)?.length || 0)
    }, 0)

    if (negativeScore > positiveScore) return 'negative'
    if (positiveScore > negativeScore) return 'positive'
    return 'neutral'
  }

  private extractKeywords(text: string): string[] {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))

    // Count word frequency
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    // Return top 5 most frequent words
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word)
  }

  private calculateConfidence(text: string, category: string, priority: string): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence based on keyword matches
    const categoryKeywords = this.categoryKeywords[category] || []
    const keywordMatches = categoryKeywords.reduce((acc, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      return acc + (text.match(regex)?.length || 0)
    }, 0)

    confidence += Math.min(keywordMatches * 0.1, 0.4)

    // Increase confidence based on text length (more detailed descriptions are more reliable)
    if (text.length > 100) confidence += 0.1
    if (text.length > 200) confidence += 0.1

    return Math.min(confidence, 1.0)
  }

  private calculateUrgencyScore(
    priority: string, 
    sentiment: string, 
    input: ClassificationInput
  ): number {
    let score = 0

    // Base score from priority
    const priorityScores = { critical: 100, high: 75, medium: 50, low: 25 }
    score += priorityScores[priority as keyof typeof priorityScores] || 50

    // Sentiment adjustment
    if (sentiment === 'negative') score += 10
    if (sentiment === 'positive') score -= 5

    // Time-based adjustment
    if (input.timeOfDay) {
      const hour = parseInt(input.timeOfDay.split(':')[0])
      if (hour >= 22 || hour <= 6) score += 15 // Night time urgency
      if (hour >= 9 && hour <= 17) score += 5 // Business hours
    }

    // Location-based adjustment (if it's a critical infrastructure)
    if (input.location?.toLowerCase().includes('hospital')) score += 20
    if (input.location?.toLowerCase().includes('school')) score += 15
    if (input.location?.toLowerCase().includes('main road')) score += 10

    return Math.min(Math.max(score, 0), 100)
  }

  // Batch classification for multiple issues
  async classifyBatch(inputs: ClassificationInput[]): Promise<IssueClassification[]> {
    return Promise.all(inputs.map(input => this.classifyIssue(input)))
  }

  // Get classification statistics
  getClassificationStats(classifications: IssueClassification[]) {
    const stats = {
      totalIssues: classifications.length,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      bySentiment: {} as Record<string, number>,
      averageConfidence: 0,
      averageUrgencyScore: 0
    }

    classifications.forEach(classification => {
      // Category stats
      stats.byCategory[classification.category] = (stats.byCategory[classification.category] || 0) + 1
      
      // Priority stats
      stats.byPriority[classification.priority] = (stats.byPriority[classification.priority] || 0) + 1
      
      // Sentiment stats
      stats.bySentiment[classification.sentiment] = (stats.bySentiment[classification.sentiment] || 0) + 1
    })

    // Calculate averages
    stats.averageConfidence = classifications.reduce((sum, c) => sum + c.confidence, 0) / classifications.length
    stats.averageUrgencyScore = classifications.reduce((sum, c) => sum + c.urgencyScore, 0) / classifications.length

    return stats
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
      // Return default classification on error
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
