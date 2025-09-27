import TextRecognition from '@react-native-ml-kit/text-recognition';

class MLService {
  // ML-powered category prediction based on title and description
  predictCategory = (title, description) => {
    const text = `${title} ${description}`.toLowerCase();
    
    // Simple keyword-based ML categorization
    const categories = {
      pothole: ['pothole', 'hole', 'crack', 'road damage', 'street damage', 'pavement'],
      streetlight: ['light', 'lamp', 'bulb', 'dark', 'illumination', 'street light'],
      garbage: ['garbage', 'trash', 'waste', 'litter', 'dump', 'dirty', 'smell'],
      water: ['water', 'pipe', 'leak', 'supply', 'tap', 'drainage', 'flood'],
      drainage: ['drain', 'sewer', 'overflow', 'block', 'clog', 'water logging'],
      road: ['road', 'street', 'path', 'construction', 'repair', 'maintenance']
    };

    let maxScore = 0;
    let predictedCategory = 'other';

    Object.entries(categories).forEach(([category, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (text.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        predictedCategory = category;
      }
    });

    return {
      category: predictedCategory,
      confidence: Math.min(maxScore * 0.2, 1.0), // Normalize confidence
      suggestions: this.getCategorySuggestions(predictedCategory)
    };
  };

  // Get smart suggestions based on category
  getCategorySuggestions = (category) => {
    const suggestions = {
      pothole: [
        'Specify the size (small/medium/large)',
        'Mention if it affects traffic',
        'Note the exact location on the road'
      ],
      streetlight: [
        'Is the entire light not working or just dim?',
        'Mention the pole number if visible',
        'Note if it affects safety'
      ],
      garbage: [
        'Specify the type of waste',
        'Mention if it\'s a recurring issue',
        'Note any health hazards'
      ],
      water: [
        'Is it a supply issue or leakage?',
        'Mention affected households',
        'Note the severity level'
      ],
      drainage: [
        'Specify if it causes flooding',
        'Mention the area affected',
        'Note any blockage details'
      ],
      road: [
        'Specify the type of damage',
        'Mention if it affects vehicles',
        'Note the urgency level'
      ]
    };

    return suggestions[category] || ['Provide clear details about the issue'];
  };

  // Analyze image for automatic issue detection
  analyzeImage = async (imageUri) => {
    try {
      // Extract text from image using ML Kit
      const result = await TextRecognition.recognize(imageUri);
      
      // Analyze extracted text for keywords
      const extractedText = result.text.toLowerCase();
      const categoryPrediction = this.predictCategory('', extractedText);

      // Simple image analysis based on text content
      const analysis = {
        hasText: result.blocks.length > 0,
        extractedText: result.text,
        suggestedCategory: categoryPrediction.category,
        confidence: categoryPrediction.confidence,
        detectedIssues: this.detectIssuesFromText(extractedText)
      };

      return analysis;
    } catch (error) {
      console.log('Image analysis error:', error);
      return {
        hasText: false,
        extractedText: '',
        suggestedCategory: 'other',
        confidence: 0,
        detectedIssues: []
      };
    }
  };

  // Detect specific issues from extracted text
  detectIssuesFromText = (text) => {
    const issues = [];
    
    if (text.includes('danger') || text.includes('caution')) {
      issues.push('Safety hazard detected');
    }
    
    if (text.includes('no entry') || text.includes('closed')) {
      issues.push('Access restriction detected');
    }
    
    if (text.includes('water') || text.includes('flood')) {
      issues.push('Water-related issue detected');
    }

    return issues;
  };

  // Smart location suggestions based on common civic issues
  getLocationSuggestions = (latitude, longitude) => {
    // Mock implementation - in real app, this would use ML models
    // trained on historical data to predict common issues in specific areas
    
    const suggestions = [
      'This area commonly reports streetlight issues',
      'Pothole reports are frequent in this locality',
      'Water supply issues reported recently nearby'
    ];

    return suggestions.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  // Priority scoring based on ML analysis
  calculatePriority = (category, description, location) => {
    let priority = 1; // Default low priority

    // Category-based priority
    const highPriorityCategories = ['water', 'drainage'];
    const mediumPriorityCategories = ['streetlight', 'road'];
    
    if (highPriorityCategories.includes(category)) {
      priority = 3;
    } else if (mediumPriorityCategories.includes(category)) {
      priority = 2;
    }

    // Keyword-based priority boost
    const urgentKeywords = ['emergency', 'danger', 'urgent', 'immediate', 'safety'];
    const descriptionLower = description.toLowerCase();
    
    if (urgentKeywords.some(keyword => descriptionLower.includes(keyword))) {
      priority = Math.min(priority + 1, 3);
    }

    return {
      score: priority,
      level: priority === 3 ? 'High' : priority === 2 ? 'Medium' : 'Low',
      reasoning: this.getPriorityReasoning(priority, category)
    };
  };

  getPriorityReasoning = (priority, category) => {
    const reasons = {
      3: `High priority due to ${category} category affecting public safety/health`,
      2: `Medium priority - ${category} issues typically require timely attention`,
      1: `Standard priority - routine ${category} maintenance issue`
    };

    return reasons[priority] || 'Priority calculated based on issue analysis';
  };
}

export default new MLService();
