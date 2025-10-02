import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  Platform,
  Vibration,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
// import react-native-vector-icons
import {launchCamera, launchImageLibrary, MediaType} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';
import OfflineMapDisplay from '../components/OfflineMapDisplay';
import AIPhotoAnalyzer from '../services/AIPhotoAnalyzer';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Professional category configuration - text-only design
const categoryConfig = {
  pothole: { priority: 'high', department: 'PWD', color: '#dc2626' },
  streetlight: { priority: 'medium', department: 'Electricity', color: '#f59e0b' },
  garbage: { priority: 'medium', department: 'Sanitation', color: '#10b981' },
  water: { priority: 'high', department: 'Water Supply', color: '#3b82f6' },
  traffic: { priority: 'medium', department: 'Traffic Police', color: '#ef4444' },
  noise: { priority: 'low', department: 'Environment', color: '#8b5cf6' },
  others: { priority: 'medium', department: 'General', color: '#6b7280' }
};

const { width, height } = Dimensions.get('window');

export default function ReportScreen({ navigation }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [voiceResults, setVoiceResults] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  
  // Advanced Category Selector States
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [selectedCategoryDetails, setSelectedCategoryDetails] = useState(null);
  const [categoryHistory, setCategoryHistory] = useState([]);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  
  // Smart Auto-Completion States
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [descriptionSuggestions, setDescriptionSuggestions] = useState([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [autoCompleteHistory, setAutoCompleteHistory] = useState([]);
  const [contextualSuggestions, setContextualSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Progressive Form Disclosure States
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [stepValidation, setStepValidation] = useState({});
  const [showStepGuide, setShowStepGuide] = useState(true);
  const [stepProgress, setStepProgress] = useState(0);
  const [isStepTransitioning, setIsStepTransitioning] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const cameraButtonScale = useRef(new Animated.Value(1)).current;
  const voiceButtonScale = useRef(new Animated.Value(1)).current;

  const categories = [
    { 
      label: 'सड़क में गड्ढा / Pothole', 
      value: 'pothole', 
      keywords: ['road', 'street', 'crack', 'hole', 'सड़क', 'गड्ढा', 'रास्ता'],
      description: 'Road surface damage, cracks, or holes affecting vehicle movement',
      estimatedTime: '3-7 days',
      ...categoryConfig.pothole
    },
    { 
      label: 'स्ट्रीट लाइट / Street Light', 
      value: 'streetlight', 
      keywords: ['light', 'lamp', 'electricity', 'dark', 'बत्ती', 'रोशनी', 'लाइट'],
      description: 'Non-functional or damaged street lighting systems',
      estimatedTime: '1-3 days',
      ...categoryConfig.streetlight
    },
    { 
      label: 'कचरा / Garbage', 
      value: 'garbage', 
      keywords: ['waste', 'trash', 'dirty', 'smell', 'कचरा', 'गंदगी', 'सफाई'],
      description: 'Waste management, garbage collection, or cleanliness issues',
      estimatedTime: '1-2 days',
      ...categoryConfig.garbage
    },
    { 
      label: 'जल समस्या / Water Issue', 
      value: 'water', 
      keywords: ['water', 'pipe', 'leak', 'supply', 'पानी', 'नल', 'टंकी'],
      description: 'Water supply problems, leakage, or quality issues',
      estimatedTime: '2-5 days',
      ...categoryConfig.water
    },
    { 
      label: 'यातायात / Traffic', 
      value: 'traffic', 
      keywords: ['traffic', 'signal', 'jam', 'vehicle', 'यातायात', 'ट्रैफिक', 'सिग्नल'],
      description: 'Traffic management, signal issues, or road safety concerns',
      estimatedTime: '1-4 days',
      ...categoryConfig.traffic
    },
    { 
      label: 'शोर / Noise Pollution', 
      value: 'noise', 
      keywords: ['noise', 'sound', 'loud', 'pollution', 'शोर', 'आवाज़', 'प्रदूषण'],
      description: 'Excessive noise levels affecting quality of life',
      estimatedTime: '2-7 days',
      ...categoryConfig.noise
    },
    { 
      label: 'अन्य / Others', 
      value: 'others', 
      keywords: ['other', 'general', 'misc', 'अन्य', 'दूसरा', 'सामान्य'],
      description: 'General civic issues not covered in specific categories',
      estimatedTime: '3-10 days',
      ...categoryConfig.others
    }
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    updateProgress();
    checkNetworkStatus();
    setupVoiceListeners();
    loadAutoSavedData(); // Restore any previously saved data
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, []);

  useEffect(() => {
    updateProgress();
  }, [title, description, category, image, location]);

  // Smart category filtering and suggestions
  useEffect(() => {
    filterCategories();
    generateSmartSuggestions();
  }, [categorySearchQuery, title, description]);

  useEffect(() => {
    loadCategoryHistory();
    loadAutoCompleteHistory();
    const selectedCat = categories.find(cat => cat.value === category);
    setSelectedCategoryDetails(selectedCat);
  }, [category]);

  // Smart suggestions based on input changes
  useEffect(() => {
    const titleTimer = setTimeout(() => {
      generateTitleSuggestions(title);
    }, 500);
    
    return () => clearTimeout(titleTimer);
  }, [title, contextualSuggestions]);

  useEffect(() => {
    const descTimer = setTimeout(() => {
      generateDescriptionSuggestions(description);
    }, 600);
    
    return () => clearTimeout(descTimer);
  }, [description, contextualSuggestions]);

  useEffect(() => {
    const addressTimer = setTimeout(() => {
      generateAddressSuggestions(currentAddress);
    }, 400);
    
    return () => clearTimeout(addressTimer);
  }, [currentAddress]);

  // Progressive Form Step Management - Moved after function definitions

  // Trigger auto-save when form data changes
  useEffect(() => {
    if (title || description) {
      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Set new timer to auto-save after 3 seconds of inactivity
      const timer = setTimeout(() => {
        autoSaveFormData();
      }, 3000);
      
      setAutoSaveTimer(timer);
    }
  }, [title, description, category]);

  // Advanced Category Functions
  const filterCategories = () => {
    if (!categorySearchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const query = categorySearchQuery.toLowerCase();
    const filtered = categories.filter(cat => {
      const labelMatch = cat.label.toLowerCase().includes(query);
      const keywordMatch = cat.keywords.some(keyword => 
        keyword.toLowerCase().includes(query)
      );
      const descriptionMatch = cat.description.toLowerCase().includes(query);
      return labelMatch || keywordMatch || descriptionMatch;
    });

    // Sort by relevance
    filtered.sort((a, b) => {
      const aScore = calculateRelevanceScore(a, query);
      const bScore = calculateRelevanceScore(b, query);
      return bScore - aScore;
    });

    setFilteredCategories(filtered);
  };

  const calculateRelevanceScore = (category, query) => {
    let score = 0;
    
    // Exact label match gets highest score
    if (category.label.toLowerCase().includes(query)) score += 10;
    
    // Keyword matches
    category.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(query)) score += 5;
      if (keyword.toLowerCase() === query) score += 8;
    });
    
    // Description match
    if (category.description.toLowerCase().includes(query)) score += 3;
    
    // Priority boost for high priority categories
    if (category.priority === 'high') score += 2;
    
    return score;
  };

  const generateSmartSuggestions = () => {
    const suggestions = [];
    const combinedText = `${title} ${description}`.toLowerCase();
    
    if (combinedText.trim()) {
      categories.forEach(cat => {
        const matchCount = cat.keywords.filter(keyword => 
          combinedText.includes(keyword.toLowerCase())
        ).length;
        
        if (matchCount > 0) {
          suggestions.push({
            ...cat,
            matchScore: matchCount,
            confidence: Math.min(matchCount * 0.3, 0.9)
          });
        }
      });
      
      // Sort by match score and limit to top 3
      suggestions.sort((a, b) => b.matchScore - a.matchScore);
      setSmartSuggestions(suggestions.slice(0, 3));
    } else {
      setSmartSuggestions([]);
    }
  };

  const loadCategoryHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('categoryHistory');
      if (history) {
        setCategoryHistory(JSON.parse(history));
      }
    } catch (error) {
      console.log('Category history load error:', error);
    }
  };

  const saveCategoryToHistory = async (categoryValue) => {
    try {
      const newHistory = [categoryValue, ...categoryHistory.filter(c => c !== categoryValue)].slice(0, 5);
      setCategoryHistory(newHistory);
      await AsyncStorage.setItem('categoryHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.log('Category history save error:', error);
    }
  };

  const selectCategory = (categoryValue) => {
    setCategory(categoryValue);
    saveCategoryToHistory(categoryValue);
    setShowCategoryDropdown(false);
    setCategorySearchQuery('');
    Vibration.vibrate(30);
    
    const selectedCat = categories.find(cat => cat.value === categoryValue);
    if (selectedCat) {
      // Generate contextual suggestions based on selected category
      generateContextualSuggestions(selectedCat);
      
      Alert.alert(
        '✅ श्रेणी चुनी गई / Category Selected',
        `${selectedCat.label}\n\nविभाग: ${selectedCat.department}\nअनुमानित समय: ${selectedCat.estimatedTime}\n\n${selectedCat.description}`,
        [{ text: 'ठीक है / OK', style: 'default' }]
      );
    }
  };

  // Smart Auto-Completion Functions
  const generateContextualSuggestions = (selectedCategory) => {
    const suggestions = {
      pothole: {
        titles: [
          'सड़क में बड़ा गड्ढा / Large pothole on road',
          'मुख्य सड़क पर गड्ढे / Potholes on main road',
          'गली में गहरा गड्ढा / Deep pothole in lane',
          'सड़क की खराब स्थिति / Poor road condition'
        ],
        descriptions: [
          'यहाँ एक बड़ा गड्ढा है जो वाहनों के लिए खतरनाक है',
          'बारिश के बाद यह गड्ढा और भी गहरा हो गया है',
          'इस गड्ढे के कारण दुर्घटनाएं हो सकती हैं',
          'कृपया इस सड़क की मरम्मत करवाएं'
        ]
      },
      streetlight: {
        titles: [
          'स्ट्रीट लाइट काम नहीं कर रही / Street light not working',
          'रात में अंधेरा / Dark at night',
          'बिजली की समस्या / Electricity problem',
          'लाइट का बल्ब फ्यूज / Light bulb fused'
        ],
        descriptions: [
          'यह स्ट्रीट लाइट कई दिनों से बंद है',
          'रात में यहाँ बहुत अंधेरा रहता है',
          'सुरक्षा की दृष्टि से यह खतरनाक है',
          'कृपया जल्दी मरम्मत करवाएं'
        ]
      },
      garbage: {
        titles: [
          'कचरा नहीं उठाया गया / Garbage not collected',
          'गंदगी फैली हुई / Dirt spread around',
          'कूड़ेदान भरा हुआ / Dustbin overflowing',
          'सफाई की समस्या / Cleanliness issue'
        ],
        descriptions: [
          'यहाँ कई दिनों से कचरा पड़ा हुआ है',
          'बदबू और मक्खियों की समस्या है',
          'स्वास्थ्य के लिए हानिकारक है',
          'तुरंत सफाई की आवश्यकता है'
        ]
      },
      water: {
        titles: [
          'पानी की सप्लाई बंद / Water supply stopped',
          'नल में पानी नहीं आ रहा / No water in tap',
          'पाइप लीक हो रहा / Pipe leaking',
          'पानी की कमी / Water shortage'
        ],
        descriptions: [
          'कई दिनों से पानी नहीं आ रहा है',
          'पाइप में लीकेज की समस्या है',
          'पानी की गुणवत्ता खराब है',
          'तुरंत समाधान की आवश्यकता है'
        ]
      },
      traffic: {
        titles: [
          'ट्रैफिक सिग्नल खराब / Traffic signal broken',
          'जाम की समस्या / Traffic jam problem',
          'सड़क पर अव्यवस्था / Road disorder',
          'पार्किंग की समस्या / Parking issue'
        ],
        descriptions: [
          'ट्रैफिक सिग्नल काम नहीं कर रहा',
          'यहाँ हमेशा जाम लगता रहता है',
          'गलत पार्किंग से परेशानी है',
          'ट्रैफिक पुलिस की जरूरत है'
        ]
      },
      noise: {
        titles: [
          'तेज आवाज की समस्या / Loud noise problem',
          'शोर प्रदूषण / Noise pollution',
          'रात में परेशानी / Night disturbance',
          'अनावश्यक शोर / Unnecessary noise'
        ],
        descriptions: [
          'यहाँ दिन-रात तेज आवाज आती है',
          'नींद में खलल पड़ता है',
          'बच्चों की पढ़ाई में समस्या है',
          'शांति की आवश्यकता है'
        ]
      },
      others: {
        titles: [
          'सामान्य समस्या / General issue',
          'अन्य शिकायत / Other complaint',
          'विविध समस्या / Miscellaneous problem',
          'सुधार की आवश्यकता / Need improvement'
        ],
        descriptions: [
          'यह एक सामान्य नागरिक समस्या है',
          'कृपया इस पर ध्यान दें',
          'समुदाय की भलाई के लिए आवश्यक है',
          'सुधार की अपेक्षा है'
        ]
      }
    };

    const categorySuggestions = suggestions[selectedCategory.value] || suggestions.others;
    setContextualSuggestions(categorySuggestions);
  };

  const generateTitleSuggestions = (inputText) => {
    if (!inputText || inputText.length < 2) {
      setTitleSuggestions([]);
      setShowTitleSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    
    // Combine contextual suggestions with general suggestions
    const generalSuggestions = [
      'सड़क की समस्या / Road problem',
      'बिजली की खराबी / Electricity issue',
      'पानी की कमी / Water shortage',
      'सफाई की समस्या / Cleanliness issue',
      'ट्रैफिक की परेशानी / Traffic trouble',
      'शोर की समस्या / Noise problem',
      'सुरक्षा की चिंता / Security concern',
      'रखरखाव की जरूरत / Maintenance needed'
    ];

    const contextualTitles = contextualSuggestions.titles || [];
    const allSuggestions = [...contextualTitles, ...generalSuggestions];
    
    const filtered = allSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(inputText.toLowerCase()) ||
      inputText.toLowerCase().split(' ').some(word => 
        suggestion.toLowerCase().includes(word)
      )
    ).slice(0, 5);

    setTimeout(() => {
      setTitleSuggestions(filtered);
      setShowTitleSuggestions(filtered.length > 0);
      setIsLoadingSuggestions(false);
    }, 300);
  };

  const generateDescriptionSuggestions = (inputText) => {
    if (!inputText || inputText.length < 3) {
      setDescriptionSuggestions([]);
      setShowDescriptionSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    
    const generalDescriptions = [
      'यह समस्या कई दिनों से है और इसका तुरंत समाधान चाहिए',
      'कृपया इस पर जल्दी कार्रवाई करें क्योंकि यह दैनिक जीवन को प्रभावित कर रहा है',
      'यह समुदाय के लिए परेशानी का कारण बन रहा है',
      'सुरक्षा की दृष्टि से यह खतरनाक है',
      'बच्चों और बुजुर्गों के लिए यह समस्याजनक है',
      'मौसम के कारण यह समस्या और भी बढ़ गई है',
      'पहले भी यहाँ ऐसी समस्या हो चुकी है',
      'तत्काल ध्यान देने की आवश्यकता है'
    ];

    const contextualDescriptions = contextualSuggestions.descriptions || [];
    const allSuggestions = [...contextualDescriptions, ...generalDescriptions];
    
    const filtered = allSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(inputText.toLowerCase()) ||
      inputText.toLowerCase().split(' ').some(word => 
        suggestion.toLowerCase().includes(word)
      )
    ).slice(0, 4);

    setTimeout(() => {
      setDescriptionSuggestions(filtered);
      setShowDescriptionSuggestions(filtered.length > 0);
      setIsLoadingSuggestions(false);
    }, 400);
  };

  const generateAddressSuggestions = async (inputText) => {
    if (!inputText || inputText.length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    // Mock address suggestions for Jharkhand
    const jharkhandAddresses = [
      'मुख्य बाजार, रांची / Main Bazaar, Ranchi',
      'स्टेशन रोड, धनबाद / Station Road, Dhanbad',
      'सिविल लाइन्स, जमशेदपुर / Civil Lines, Jamshedpur',
      'कैंट एरिया, हजारीबाग / Cantt Area, Hazaribagh',
      'बस स्टैंड के पास, बोकारो / Near Bus Stand, Bokaro',
      'रेलवे स्टेशन रोड, देवघर / Railway Station Road, Deoghar',
      'मार्केट कॉम्प्लेक्स, गिरिडीह / Market Complex, Giridih',
      'अस्पताल रोड, पलामू / Hospital Road, Palamu'
    ];

    const filtered = jharkhandAddresses.filter(address => 
      address.toLowerCase().includes(inputText.toLowerCase())
    ).slice(0, 5);

    setAddressSuggestions(filtered);
    setShowAddressSuggestions(filtered.length > 0);
  };

  const saveToAutoCompleteHistory = async (type, text) => {
    try {
      const historyKey = `autoComplete_${type}`;
      const existingHistory = await AsyncStorage.getItem(historyKey);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      const newHistory = [text, ...history.filter(item => item !== text)].slice(0, 10);
      await AsyncStorage.setItem(historyKey, JSON.stringify(newHistory));
      
      setAutoCompleteHistory(prev => ({ ...prev, [type]: newHistory }));
    } catch (error) {
      console.log('Auto-complete history save error:', error);
    }
  };

  const loadAutoCompleteHistory = async () => {
    try {
      const titleHistory = await AsyncStorage.getItem('autoComplete_title');
      const descHistory = await AsyncStorage.getItem('autoComplete_description');
      
      setAutoCompleteHistory({
        title: titleHistory ? JSON.parse(titleHistory) : [],
        description: descHistory ? JSON.parse(descHistory) : []
      });
    } catch (error) {
      console.log('Auto-complete history load error:', error);
    }
  };

  const applySuggestion = (type, suggestion) => {
    Vibration.vibrate(25);
    
    if (type === 'title') {
      setTitle(suggestion);
      setShowTitleSuggestions(false);
      saveToAutoCompleteHistory('title', suggestion);
    } else if (type === 'description') {
      setDescription(prev => prev + (prev ? ' ' : '') + suggestion);
      setShowDescriptionSuggestions(false);
      saveToAutoCompleteHistory('description', suggestion);
    } else if (type === 'address') {
      setCurrentAddress(suggestion);
      setShowAddressSuggestions(false);
    }
  };

  // Progressive Form Steps Configuration
  const formSteps = [
    {
      id: 1,
      title: 'श्रेणी चुनें / Select Category',
      description: 'अपनी समस्या की श्रेणी चुनें / Choose your issue category',
      icon: '📋',
      fields: ['category'],
      validation: () => category !== '',
      guidance: 'सबसे उपयुक्त श्रेणी चुनें जो आपकी समस्या का वर्णन करती है / Select the most appropriate category that describes your issue'
    },
    {
      id: 2,
      title: 'शीर्षक लिखें / Write Title',
      description: 'समस्या का संक्षिप्त शीर्षक दें / Provide a brief title for the issue',
      icon: '✏️',
      fields: ['title'],
      validation: () => title.length >= 10,
      guidance: 'कम से कम 10 अक्षरों का स्पष्ट और संक्षिप्त शीर्षक लिखें / Write a clear and concise title of at least 10 characters'
    },
    {
      id: 3,
      title: 'विवरण दें / Add Description',
      description: 'समस्या का विस्तृत विवरण दें / Provide detailed description of the issue',
      icon: '📝',
      fields: ['description'],
      validation: () => description.length >= 20,
      guidance: 'समस्या के बारे में विस्तार से बताएं - क्या हुआ, कब हुआ, और यह कैसे प्रभावित करता है / Describe the issue in detail - what happened, when it happened, and how it affects you'
    },
    {
      id: 4,
      title: 'फोटो जोड़ें / Add Photo',
      description: 'समस्या की फोटो अपलोड करें / Upload a photo of the issue',
      icon: '📸',
      fields: ['image'],
      validation: () => image !== null,
      guidance: 'स्पष्ट फोटो लें जो समस्या को अच्छी तरह दिखाती हो / Take a clear photo that shows the issue clearly'
    },
    {
      id: 5,
      title: 'स्थान सेट करें / Set Location',
      description: 'समस्या का स्थान निर्धारित करें / Determine the location of the issue',
      icon: '📍',
      fields: ['location'],
      validation: () => location !== null,
      guidance: 'सटीक स्थान प्रदान करें ताकि अधिकारी समस्या को आसानी से ढूंढ सकें / Provide accurate location so authorities can easily find the issue'
    }
  ];

  // Step Validation Functions
  const validateStep = (stepId) => {
    const step = formSteps.find(s => s.id === stepId);
    if (!step) return false;
    
    const isValid = step.validation();
    setStepValidation(prev => ({ ...prev, [stepId]: isValid }));
    
    if (isValid && !completedSteps.has(stepId)) {
      setCompletedSteps(prev => new Set([...prev, stepId]));
      Vibration.vibrate(50);
    }
    
    return isValid;
  };

  const canProceedToStep = (stepId) => {
    // Can always go to step 1
    if (stepId === 1) return true;
    
    // For other steps, previous step must be completed
    return completedSteps.has(stepId - 1);
  };

  const goToStep = (stepId) => {
    if (!canProceedToStep(stepId) || isStepTransitioning) return;
    
    setIsStepTransitioning(true);
    Vibration.vibrate(25);
    
    // Animate step transition
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setCurrentStep(stepId);
      setIsStepTransitioning(false);
    });
  };

  const nextStep = () => {
    const currentStepValid = validateStep(currentStep);
    if (currentStepValid && currentStep < formSteps.length) {
      goToStep(currentStep + 1);
    } else if (!currentStepValid) {
      Alert.alert(
        '⚠️ अधूरी जानकारी / Incomplete Information',
        `कृपया ${formSteps[currentStep - 1]?.title} पूरा करें / Please complete ${formSteps[currentStep - 1]?.title}`,
        [{ text: 'ठीक है / OK', style: 'default' }]
      );
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // Progressive Form Step Management - Simplified to prevent crashes
  useEffect(() => {
    // Simple progress tracking without complex validation
    const completedCount = completedSteps.size;
    const totalSteps = 5; // Fixed number to prevent errors
    const newProgress = completedCount / totalSteps;
    setStepProgress(newProgress);
    
    // Animate progress safely
    if (progressAnim) {
      Animated.timing(progressAnim, {
        toValue: newProgress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [completedSteps]);

  const updateProgress = () => {
    let progress = 0;
    if (title.length > 3) progress += 0.2;
    if (description.length > 10) progress += 0.2;
    if (category !== '') progress += 0.2;
    if (image) progress += 0.2;
    if (location) progress += 0.2;

    setFormProgress(progress);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const pickImage = () => {
    Alert.alert(
      'Select Photo',
      'Choose from where you want to select a photo',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };
    
    launchCamera(options, handleImageResponse);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };
    
    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = async (response) => {
    if (response.didCancel || response.error) return;
    if (response.assets && response.assets[0]) {
      const selectedImage = response.assets[0];
      setImage(selectedImage);
      
      // Start AI photo analysis
      await analyzePhotoWithAI(selectedImage.uri);
    }
  };

  // AI Photo Analysis Function
  const analyzePhotoWithAI = async (imageUri) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setAiSuggestions([]);
    
    try {
      console.log('🤖 Starting AI analysis for captured photo...');
      
      const analysis = await AIPhotoAnalyzer.analyzePhoto(imageUri);
      
      if (analysis) {
        setAiAnalysis(analysis);
        setAiSuggestions(analysis.suggestions || []);
        
        // Auto-suggest category if confidence is high
        if (analysis.suggestedCategory && analysis.confidence > 0.7) {
          setCategory(analysis.suggestedCategory);
          
          // Show success alert with AI suggestion
          Alert.alert(
            '🤖 AI Analysis Complete',
            `Detected: ${analysis.suggestedCategory} (${(analysis.confidence * 100).toFixed(1)}% confident)\n\nCategory has been automatically selected!`,
            [
              { text: 'Change Category', style: 'cancel' },
              { text: 'Keep Suggestion', style: 'default' }
            ]
          );
        } else if (analysis.suggestedCategory) {
          // Show suggestion alert for lower confidence
          Alert.alert(
            '🤖 AI Suggestion',
            `AI suggests: ${analysis.suggestedCategory} (${(analysis.confidence * 100).toFixed(1)}% confident)\n\nWould you like to use this category?`,
            [
              { text: 'No, Keep Current', style: 'cancel' },
              { 
                text: 'Yes, Use Suggestion', 
                style: 'default',
                onPress: () => setCategory(analysis.suggestedCategory)
              }
            ]
          );
        } else {
          // Show completion alert with detected objects
          Alert.alert(
            '🤖 AI Analysis Complete',
            analysis.detectedObjects.length > 0 
              ? `Detected: ${analysis.detectedObjects.map(obj => obj.name).join(', ')}\n\nPlease select the most appropriate category.`
              : 'Analysis complete. Please select the appropriate category for your report.',
            [{ text: 'OK', style: 'default' }]
          );
        }
      }
    } catch (error) {
      console.log('AI Analysis Error:', error);
      setAiSuggestions(['⚠️ AI analysis failed - please select category manually']);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Network connectivity check with auto-sync
  const checkNetworkStatus = async () => {
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected);
    });
    
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !isOnline;
      setIsOnline(state.isConnected);
      
      // Auto-sync when coming back online
      if (wasOffline && state.isConnected) {
        setTimeout(() => syncOfflineReports(), 2000); // Wait 2 seconds for stable connection
      }
    });
    
    return unsubscribe;
  };

  // Enhanced Voice functionality with better error handling
  const setupVoiceListeners = () => {
    Voice.onSpeechStart = () => {
      console.log('🎤 Voice recording started');
      setIsRecording(true);
    };
    Voice.onSpeechEnd = () => {
      console.log('🎤 Voice recording ended');
      setIsRecording(false);
    };
    Voice.onSpeechResults = (e) => {
      console.log('🎤 Voice results:', e);
      if (e.value && e.value.length > 0) {
        const spokenText = e.value[0];
        setDescription(prev => prev + (prev ? ' ' : '') + spokenText);
        setVoiceResults(e.value);
      }
    };
    Voice.onSpeechError = (e) => {
      console.log('🎤 Speech Error:', e);
      setIsRecording(false);
      // More user-friendly error handling - just show a simple message
      Alert.alert('Voice Recognition', 'Voice feature temporarily unavailable. You can still type your description.');
    };
  };

  const startVoiceRecording = async () => {
    try {
      setIsRecording(true);
      setVoiceResults([]);
      // Start pulse animation for voice button while recording
      animatePulse(voiceButtonScale);
      await Voice.start('en-US');
    } catch (error) {
      console.log('Voice start error:', error);
      setIsRecording(false);
      Alert.alert('Voice Error', 'Could not start voice recording');
    }
  };

  const stopVoiceRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.log('Voice stop error:', error);
      setIsRecording(false);
    }
  };

  const getLocation = () => {
    Geolocation.requestAuthorization('whenInUse').then((result) => {
      if (result === 'granted') {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            });
            setShowMap(true);
          },
          (error) => Alert.alert('Location Error', error.message),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    });
  };

  const submit = async () => {
    if (formProgress < 1) {
      Alert.alert('Incomplete Form', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const phone = await AsyncStorage.getItem('userPhone');
      const reportData = {
        id: Date.now().toString(),
        title,
        description,
        category,
        latitude: location.lat,
        longitude: location.lng,
        accuracy: location.accuracy,
        address: '',
        reporterPhone: phone,
        images: image ? [image.uri] : [],
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      if (isOnline) {
        // Submit online
        await api.post('/reports', reportData);
        Alert.alert('Success', '✅ Report submitted successfully!');
      } else {
        // Save offline
        await saveReportOffline(reportData);
        Alert.alert('Saved Offline', '📱 Report saved locally. Will sync when connected.');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('pothole');
      setImage(null);
      setLocation(null);
      setVoiceResults([]);

    } catch (error) {
      console.log('Submit error:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Offline storage functionality
  const saveReportOffline = async (reportData) => {
    try {
      const existingReports = await AsyncStorage.getItem('offlineReports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      reports.push(reportData);
      await AsyncStorage.setItem('offlineReports', JSON.stringify(reports));
      console.log('Report saved offline:', reportData.id);
    } catch (error) {
      console.log('Offline save error:', error);
      throw error;
    }
  };

  // Sync offline reports when online
  const syncOfflineReports = async () => {
    if (!isOnline) return;
    
    try {
      const offlineReports = await AsyncStorage.getItem('offlineReports');
      if (!offlineReports) return;
      
      const reports = JSON.parse(offlineReports);
      if (reports.length === 0) return;
      
      console.log(`Syncing ${reports.length} offline reports...`);
      const syncPromises = reports.map(report => 
        api.post('/reports', report).catch(err => console.log('Sync error:', err))
      );
      
      await Promise.allSettled(syncPromises);
      await AsyncStorage.removeItem('offlineReports');
      
      Alert.alert('Sync Complete', `📡 ${reports.length} offline reports synced successfully!`);
    } catch (error) {
      console.log('Sync error:', error);
    }
  };

  // Auto-save functionality to prevent data loss
  const loadAutoSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('autoSavedReportData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.category) setCategory(data.category);
        console.log('📱 Auto-saved data restored successfully!');
      }
    } catch (error) {
      console.log('Auto-save load error:', error);
    }
  };

  const autoSaveFormData = async () => {
    try {
      const formData = {
        title,
        description,
        category,
        timestamp: new Date().toISOString()
      };
      await AsyncStorage.setItem('autoSavedReportData', JSON.stringify(formData));
      console.log('📱 Form data auto-saved successfully!');
    } catch (error) {
      console.log('Auto-save error:', error);
    }
  };

  // Enhanced button animation functions
  const animateButtonPress = (animValue, callback) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const animatePulse = (animValue) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const renderAdvancedCategorySelector = () => (
    <View style={styles.advancedCategoryContainer}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryTitleSection}>
          <Text style={styles.categoryLabelPrimary}>🎯 समस्या की श्रेणी</Text>
          <Text style={styles.categoryLabelSecondary}>Advanced Issue Category Selection</Text>
        </View>
        <View style={styles.requiredIndicator}>
          <Text style={styles.requiredText}>*</Text>
        </View>
      </View>

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && (
        <View style={styles.smartSuggestionsContainer}>
          <Text style={styles.smartSuggestionsTitle}>🧠 स्मार्ट सुझाव / Smart Suggestions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {smartSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionChip,
                  { borderColor: suggestion.color }
                ]}
                onPress={() => selectCategory(suggestion.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionLabel}>{suggestion.label.split(' / ')[1]}</Text>
                <Text style={styles.suggestionConfidence}>
                  {Math.round(suggestion.confidence * 100)}% मैच
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Category History */}
      {categoryHistory.length > 0 && (
        <View style={styles.categoryHistoryContainer}>
          <Text style={styles.historyTitle}>📋 हाल ही में उपयोग / Recently Used</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categoryHistory.map((historyValue, index) => {
              const historyCat = categories.find(cat => cat.value === historyValue);
              if (!historyCat) return null;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.historyChip,
                    { borderColor: historyCat.color }
                  ]}
                  onPress={() => selectCategory(historyValue)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.historyLabel}>{historyCat.label.split(' / ')[1]}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Selected Category Display */}
      {selectedCategoryDetails && (
        <TouchableOpacity
          style={[
            styles.selectedCategoryDisplay,
            { borderColor: selectedCategoryDetails.color }
          ]}
          onPress={() => setShowCategoryDropdown(true)}
          activeOpacity={0.8}
        >
          <View style={styles.selectedCategoryContent}>
            <View style={styles.selectedCategoryLeft}>
              <Text style={styles.selectedCategoryTitle}>
                {selectedCategoryDetails.label}
              </Text>
              <Text style={styles.selectedCategoryDept}>
                विभाग: {selectedCategoryDetails.department} | समय: {selectedCategoryDetails.estimatedTime}
              </Text>
            </View>
            <View style={[
              styles.selectedCategoryBadge,
              { backgroundColor: selectedCategoryDetails.color }
            ]}>
              <Text style={styles.selectedCategoryBadgeText}>✓</Text>
            </View>
          </View>
          <Text style={styles.changeCategoryHint}>बदलने के लिए टैप करें / Tap to change</Text>
        </TouchableOpacity>
      )}

      {/* Change Category Button */}
      {!selectedCategoryDetails && (
        <TouchableOpacity
          style={styles.selectCategoryButton}
          onPress={() => setShowCategoryDropdown(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.selectCategoryIcon}>🎯</Text>
          <Text style={styles.selectCategoryText}>श्रेणी चुनें / Select Category</Text>
          <Text style={styles.selectCategoryArrow}>▼</Text>
        </TouchableOpacity>
      )}

      {/* Advanced Category Dropdown Modal */}
      <Modal
        visible={showCategoryDropdown}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryDropdown(false)}
      >
        <KeyboardAvoidingView 
          style={styles.categoryModalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.categoryModalContent}>
            {/* Modal Header */}
            <View style={styles.categoryModalHeader}>
              <Text style={styles.categoryModalTitle}>🎯 श्रेणी चुनें / Select Category</Text>
              <TouchableOpacity
                style={styles.categoryModalClose}
                onPress={() => setShowCategoryDropdown(false)}
              >
                <Text style={styles.categoryModalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.categorySearchContainer}>
              <Text style={styles.categorySearchIcon}>🔍</Text>
              <TextInput
                style={styles.categorySearchInput}
                placeholder="श्रेणी खोजें... / Search categories..."
                value={categorySearchQuery}
                onChangeText={setCategorySearchQuery}
                placeholderTextColor="#9ca3af"
                autoFocus={true}
              />
              {categorySearchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.categorySearchClear}
                  onPress={() => setCategorySearchQuery('')}
                >
                  <Text style={styles.categorySearchClearText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Category List */}
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              style={styles.categoryList}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryListItem,
                    { borderLeftColor: item.color },
                    category === item.value && styles.categoryListItemSelected
                  ]}
                  onPress={() => selectCategory(item.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryListContent}>
                    <View style={styles.categoryListLeft}>
                      <Text style={styles.categoryListTitle}>{item.label}</Text>
                      <Text style={styles.categoryListDescription}>{item.description}</Text>
                      <View style={styles.categoryListMeta}>
                        <View style={[
                          styles.categoryListPriority,
                          { backgroundColor: item.color }
                        ]}>
                          <Text style={styles.categoryListPriorityText}>
                            {item.priority.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.categoryListDepartment}>{item.department}</Text>
                        <Text style={styles.categoryListTime}>⏱️ {item.estimatedTime}</Text>
                      </View>
                    </View>
                    {category === item.value && (
                      <View style={[
                        styles.categoryListSelected,
                        { backgroundColor: item.color }
                      ]}>
                        <Text style={styles.categoryListSelectedText}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.categoryEmptyState}>
                  <Text style={styles.categoryEmptyIcon}>🔍</Text>
                  <Text style={styles.categoryEmptyTitle}>कोई श्रेणी नहीं मिली</Text>
                  <Text style={styles.categoryEmptySubtitle}>No categories found matching your search</Text>
                </View>
              )}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Compressed Professional Government Header */}
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />
      <View style={styles.compactHeader}>
        <LinearGradient
          colors={['#1e3a8a', '#3b82f6']}
          style={styles.headerGradient}
        >
          <View style={styles.compactHeaderContent}>
            <View style={styles.compactLogoSection}>
              <View style={styles.compactTitleSection}>
                <Text style={styles.compactMainTitle}>सुधार सेतु</Text>
                <Text style={styles.compactSubTitle}>Sudhaar Setu</Text>
              </View>
            </View>
            
            <View style={styles.compactHeaderActions}>
              <TouchableOpacity style={styles.compactNotificationButton}>
                <View style={styles.compactNotificationBadge}>
                  <Text style={styles.compactNotificationText}>3</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.compactReportsButton}
                onPress={() => {
                  Vibration.vibrate(30);
                  navigation?.navigate('NearbyReports');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.compactReportsText}>रिपोर्ट्स</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Compact Progress Bar */}
          <View style={styles.compactProgressSection}>
            <View style={styles.compactProgressContainer}>
              <Animated.View
                style={[
                  styles.compactProgressBar,
                  { width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })}
                ]}
              />
            </View>
            <Text style={styles.compactProgressText}>{Math.round(formProgress * 100)}% पूर्ण</Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progressive Form Step Header - Temporarily Disabled to Fix Black Screen */}
        {false && (
        <View style={styles.stepHeaderContainer}>
          <View style={styles.stepProgressContainer}>
            <View style={styles.stepProgressBar}>
              <Animated.View 
                style={[
                  styles.stepProgressFill,
                  { width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })}
                ]} 
              />
            </View>
            <Text style={styles.stepProgressText}>
              {completedSteps.size}/5 पूर्ण / Complete
            </Text>
          </View>
          
          <View style={styles.currentStepInfo}>
            <Text style={styles.currentStepIcon}>📋</Text>
            <View style={styles.currentStepText}>
              <Text style={styles.currentStepTitle}>Step {currentStep}</Text>
              <Text style={styles.currentStepDescription}>Complete this step</Text>
            </View>
          </View>
          
          {showStepGuide && (
            <View style={styles.stepGuidanceContainer}>
              <Text style={styles.stepGuidanceText}>
                💡 Complete the current step to proceed
              </Text>
              <TouchableOpacity 
                style={styles.hideGuideButton}
                onPress={() => setShowStepGuide(false)}
              >
                <Text style={styles.hideGuideText}>छुपाएं / Hide</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        )}

        {/* Step Navigation Pills - Temporarily Disabled */}
        {false && (
        <View style={styles.stepNavigationContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stepPillsContainer}
          >
            {[1,2,3,4,5].map((step, index) => (
              <TouchableOpacity
                key={step}
                style={[
                  styles.stepPill,
                  currentStep === step && styles.stepPillActive,
                  completedSteps.has(step) && styles.stepPillCompleted
                ]}
                onPress={() => setCurrentStep(step)}
                activeOpacity={0.7}
              >
                <Text style={styles.stepPillIcon}>📋</Text>
                <Text style={[
                  styles.stepPillText,
                  currentStep === step && styles.stepPillTextActive,
                  completedSteps.has(step) && styles.stepPillTextCompleted
                ]}>
                  {step}
                </Text>
                {completedSteps.has(step) && (
                  <Text style={styles.stepPillCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        )}

        {/* Offline Status Indicator */}
        {!isOnline && (
          <View style={styles.offlineIndicator}>
            <Text style={styles.offlineIcon}></Text>
            <Text style={styles.offlineText}>Offline - Reports will be saved locally</Text>
          </View>
        )}
        
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Title Input */}
          <View style={styles.professionalInputCard}>
            <View style={styles.inputHeader}>
              <View style={styles.inputTitleSection}>
                <Text style={styles.inputLabelPrimary}>समस्या का शीर्षक</Text>
                <Text style={styles.inputLabelSecondary}>Issue Title</Text>
              </View>
              <View style={styles.requiredIndicator}>
                <Text style={styles.requiredText}>*</Text>
              </View>
            </View>
            <View style={styles.inputWithSuggestions}>
              <TextInput
                style={styles.professionalTextInput}
                placeholder="समस्या का संक्षिप्त विवरण... / Brief description of the issue..."
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#6b7280"
                multiline={false}
                maxLength={100}
                onFocus={() => {
                  if (title.length >= 2) {
                    generateTitleSuggestions(title);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowTitleSuggestions(false), 200);
                }}
              />
              
              {/* Title Suggestions */}
              {showTitleSuggestions && (
                <View style={styles.suggestionsContainer}>
                  <View style={styles.suggestionsHeader}>
                    <Text style={styles.suggestionsTitle}>🤖 स्मार्ट सुझाव / Smart Suggestions</Text>
                    {isLoadingSuggestions && (
                      <Text style={styles.loadingIndicator}>⏳</Text>
                    )}
                  </View>
                  <ScrollView 
                    style={styles.suggestionsList}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    {titleSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => applySuggestion('title', suggestion)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                        <Text style={styles.suggestionAction}>टैप करें / Tap</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={styles.inputFooter}>
              <Text style={styles.characterCount}>{title.length}/100</Text>
              <View style={styles.inputValidation}>
                {title.length >= 10 ? (
                  <Text style={styles.validationSuccess}>✓</Text>
                ) : (
                  <Text style={styles.validationWarning}>!</Text>
                )}
              </View>
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.professionalInputCard}>
            <View style={styles.inputHeader}>
              <View style={styles.inputTitleSection}>
                <Text style={styles.inputLabelPrimary}>विस्तृत विवरण</Text>
                <Text style={styles.inputLabelSecondary}>Detailed Description</Text>
              </View>
              <View style={styles.requiredIndicator}>
                <Text style={styles.requiredText}>*</Text>
              </View>
            </View>
            <View style={styles.descriptionContainer}>
              <View style={styles.inputWithSuggestions}>
                <TextInput
                  style={[styles.professionalTextInput, styles.professionalTextArea]}
                  placeholder="समस्या के बारे में विस्तार से बताएं... / Provide detailed information about the issue..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9ca3af"
                  onFocus={() => {
                    if (description.length >= 3) {
                      generateDescriptionSuggestions(description);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowDescriptionSuggestions(false), 200);
                  }}
                />
                
                {/* Description Suggestions */}
                {showDescriptionSuggestions && (
                  <View style={styles.suggestionsContainer}>
                    <View style={styles.suggestionsHeader}>
                      <Text style={styles.suggestionsTitle}>💡 विवरण सुझाव / Description Suggestions</Text>
                      {isLoadingSuggestions && (
                        <Text style={styles.loadingIndicator}>⏳</Text>
                      )}
                    </View>
                    <ScrollView 
                      style={styles.suggestionsList}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                    >
                      {descriptionSuggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionItem}
                          onPress={() => applySuggestion('description', suggestion)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.suggestionText}>{suggestion}</Text>
                          <Text style={styles.suggestionAction}>जोड़ें / Add</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              
              {/* Voice Recording Button */}
              <Animated.View style={{ transform: [{ scale: voiceButtonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.voiceButton,
                    isRecording && styles.voiceButtonActive
                  ]}
                  onPress={() => animateButtonPress(voiceButtonScale, isRecording ? stopVoiceRecording : startVoiceRecording)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.voiceButtonText,
                    isRecording && styles.voiceButtonTextActive
                  ]}>
                    {isRecording ? '' : ''}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
            
            {/* Voice Recording Status */}
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <Text style={styles.recordingText}>🔊 Listening... Speak now!</Text>
              </View>
            )}
            
            {/* Voice Results Preview */}
            {voiceResults.length > 0 && !isRecording && (
              <View style={styles.voiceResultsContainer}>
                <Text style={styles.voiceResultsTitle}>Voice recognized:</Text>
                <Text style={styles.voiceResultsText}>"{voiceResults[0]}"</Text>
              </View>
            )}
          </View>

          {/* Advanced Category Selector */}
          {renderAdvancedCategorySelector()}

          {/* Professional Photo Evidence Section */}
          <View style={styles.professionalPhotoCard}>
            <View style={styles.photoHeader}>
              <View style={styles.photoTitleSection}>
                <Text style={styles.photoLabelPrimary}>फोटो साक्ष्य जोड़ें</Text>
                <Text style={styles.photoLabelSecondary}>Add Photo Evidence</Text>
              </View>
              <View style={styles.optionalIndicator}>
                <Text style={styles.optionalText}>Optional</Text>
              </View>
            </View>
            
            {/* Government Guidelines */}
            <View style={styles.photoGuidelines}>
              <Text style={styles.guidelinesText}>
                स्पष्ट फोटो लें जो समस्या को दिखाता हो / Take clear photos showing the issue
              </Text>
            </View>

            <Animated.View style={{ transform: [{ scale: cameraButtonScale }] }}>
              <TouchableOpacity 
                style={styles.professionalPhotoButton} 
                onPress={() => {
                  Vibration.vibrate(40);
                  animateButtonPress(cameraButtonScale, pickImage);
                }}
                activeOpacity={0.8}
              >
                {image ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: image.uri }} style={styles.professionalPhotoPreview} />
                    <View style={styles.photoOverlay}>
                      <Text style={styles.photoSuccessIcon}>✓</Text>
                      <Text style={styles.photoSuccessText}>फोटो जोड़ा गया / Photo Added</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.professionalPhotoPlaceholder}>
                    <View style={styles.cameraIconContainer}>
                      <Text style={styles.cameraPlaceholderIcon}>📷</Text>
                    </View>
                    <Text style={styles.photoPlaceholderTitle}>फोटो कैप्चर करें</Text>
                    <Text style={styles.photoPlaceholderSubtitle}>Tap to capture photo</Text>
                    <View style={styles.photoActions}>
                      <View style={styles.photoActionItem}>
                        <Text style={styles.photoActionText}>Camera</Text>
                      </View>
                      <View style={styles.photoActionDivider} />
                      <View style={styles.photoActionItem}>
                        <Text style={styles.photoActionText}>Gallery</Text>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            
            {image && (
              <View style={styles.photoActionButtons}>
                <TouchableOpacity 
                  style={styles.retakeButton} 
                  onPress={() => {
                    Vibration.vibrate(30);
                    pickImage();
                  }}
                >
                  <Text style={styles.retakeText}>बदलें / Change</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* AI Analysis Section */}
            {image && (
              <View style={styles.aiAnalysisSection}>
                {isAnalyzing ? (
                  <View style={styles.aiAnalyzingContainer}>
                    <View style={styles.aiLoadingHeader}>
                      <Text style={styles.aiLoadingIcon}></Text>
                      <Text style={styles.aiLoadingText}>AI Analyzing Photo...</Text>
                    </View>
                    <View style={styles.aiProgressBar}>
                      <Animated.View style={styles.aiProgressFill} />
                    </View>
                    <Text style={styles.aiLoadingSubtext}>
                      Detecting objects and suggesting category
                    </Text>
                  </View>
                ) : aiAnalysis && (
                  <View style={styles.aiResultsContainer}>
                    <View style={styles.aiResultsHeader}>
                      <Text style={styles.aiResultsIcon}></Text>
                      <Text style={styles.aiResultsTitle}>AI Analysis Complete</Text>
                    </View>
                    
                    {aiAnalysis.suggestedCategory && (
                      <View style={styles.aiSuggestionCard}>
                        <Text style={styles.aiSuggestionLabel}>Suggested Category:</Text>
                        <Text style={styles.aiSuggestionCategory}>
                          {categories.find(c => c.value === aiAnalysis.suggestedCategory)?.label || aiAnalysis.suggestedCategory}
                        </Text>
                        <Text style={styles.aiConfidence}>
                          Confidence: {(aiAnalysis.confidence * 100).toFixed(1)}%
                        </Text>
                        <TouchableOpacity 
                          style={styles.useSuggestionButton}
                          onPress={() => setCategory(aiAnalysis.suggestedCategory)}
                        >
                          <Text style={styles.useSuggestionText}>Use This Category</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {aiSuggestions.length > 0 && (
                      <View style={styles.aiSuggestionsContainer}>
                        <Text style={styles.aiSuggestionsTitle}> Smart Suggestions:</Text>
                        {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                          <View key={index} style={styles.aiSuggestionItem}>
                            <Text style={styles.aiSuggestionBullet}>•</Text>
                            <Text style={styles.aiSuggestionText}>{suggestion}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {aiAnalysis.detectedObjects.length > 0 && (
                      <View style={styles.aiObjectsContainer}>
                        <Text style={styles.aiObjectsTitle}> Detected Objects:</Text>
                        <View style={styles.aiObjectsList}>
                          {aiAnalysis.detectedObjects.slice(0, 4).map((object, index) => (
                            <View key={index} style={styles.aiObjectTag}>
                              <Text style={styles.aiObjectName}>{object.name}</Text>
                              <Text style={styles.aiObjectConfidence}>
                                {(object.confidence * 100).toFixed(0)}%
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Location Section */}
          <View style={styles.locationCard}>
            <Text style={styles.sectionTitle}> Location Details</Text>
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity 
                style={styles.locationButton} 
                onPress={() => animateButtonPress(buttonScaleAnim, getLocation)}
                activeOpacity={0.8}
              >
                <Text style={styles.locationButtonText}>
                  {location ? 'Location Captured' : ' Get Current Location'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {location && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>
                  Lat: {location.lat.toFixed(6)}
                </Text>
                <Text style={styles.locationText}>
                  Lng: {location.lng.toFixed(6)}
                </Text>
                <Text style={styles.accuracyText}>
                  Accuracy: ±{location.accuracy?.toFixed(0)}m
                </Text>
                
                {/* Smart Address Input */}
                <View style={styles.addressInputContainer}>
                  <Text style={styles.addressLabel}>📍 पता / Address (Optional)</Text>
                  <View style={styles.inputWithSuggestions}>
                    <TextInput
                      style={styles.addressInput}
                      placeholder="पूरा पता लिखें... / Enter full address..."
                      value={currentAddress}
                      onChangeText={setCurrentAddress}
                      placeholderTextColor="#9ca3af"
                      multiline={false}
                      onFocus={() => {
                        if (currentAddress.length >= 3) {
                          generateAddressSuggestions(currentAddress);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowAddressSuggestions(false), 200);
                      }}
                    />
                    
                    {/* Address Suggestions */}
                    {showAddressSuggestions && (
                      <View style={styles.addressSuggestionsContainer}>
                        <Text style={styles.addressSuggestionsTitle}>📍 पता सुझाव / Address Suggestions</Text>
                        <ScrollView 
                          style={styles.addressSuggestionsList}
                          showsVerticalScrollIndicator={false}
                          nestedScrollEnabled={true}
                        >
                          {addressSuggestions.map((suggestion, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.addressSuggestionItem}
                              onPress={() => applySuggestion('address', suggestion)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.addressSuggestionText}>{suggestion}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>
                
                <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                  <TouchableOpacity
                    style={styles.viewMapButton}
                    onPress={() => {
                      animateButtonPress(buttonScaleAnim, () => {
                        console.log('🗺️ Opening map modal...');
                        setShowMap(true);
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      style={styles.viewMapButtonGradient}
                    >
                      <Text style={styles.viewMapText}>View on Map</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
                
                {/* Additional Map Controls */}
                <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                  <TouchableOpacity
                    style={styles.selectLocationButton}
                    onPress={() => {
                      animateButtonPress(buttonScaleAnim, () => {
                        console.log('📍 Opening location selector...');
                        setShowMap(true);
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
                      style={styles.selectLocationButtonGradient}
                    >
                      <Text style={styles.selectLocationText}>Select Different Location</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </View>

          {/* Step Navigation Controls - Temporarily Disabled to Fix Black Screen */}
          {false && (
          <View style={styles.stepNavigationControls}>
            <TouchableOpacity
              style={[
                styles.stepNavButton,
                styles.stepNavButtonPrevious,
                currentStep === 1 && styles.stepNavButtonDisabled
              ]}
              onPress={previousStep}
              disabled={currentStep === 1 || isStepTransitioning}
              activeOpacity={0.7}
            >
              <Text style={styles.stepNavButtonIcon}>←</Text>
              <Text style={styles.stepNavButtonText}>पिछला / Previous</Text>
            </TouchableOpacity>

            <View style={styles.stepIndicator}>
              <Text style={styles.stepIndicatorText}>
                {currentStep} / 5
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.stepNavButton,
                styles.stepNavButtonNext,
                currentStep === 5 && styles.stepNavButtonSubmit
              ]}
              onPress={currentStep === 5 ? () => animateButtonPress(buttonScaleAnim, submit) : () => setCurrentStep(currentStep + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepNavButtonText}>
                {currentStep === 5 ? 'जमा करें / Submit' : 'अगला / Next'}
              </Text>
              <Text style={styles.stepNavButtonIcon}>
                {currentStep === 5 ? '✓' : '→'}
              </Text>
            </TouchableOpacity>
          </View>
          )}

          {/* Submit Button */}
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                formProgress < 1 && styles.submitButtonDisabled,
                isSubmitting && styles.submitButtonSubmitting
              ]}
              onPress={() => animateButtonPress(buttonScaleAnim, submit)}
              disabled={formProgress < 1 || isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Enhanced Map Modal with Real MapView */}
      <Modal visible={showMap} animationType="slide" transparent={false}>
        <View style={styles.mapModal}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Select Report Location</Text>
            <Text style={styles.mapSubtitle}>Tap on map to select location</Text>
            <TouchableOpacity 
              onPress={() => setShowMap(false)}
              style={styles.closeButtonContainer}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapView}
            initialRegion={{
              latitude: location?.latitude || 23.6345,
              longitude: location?.longitude || 85.3803,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(event) => {
              const coordinate = event.nativeEvent.coordinate;
              setLocation({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                accuracy: 10,
              });
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Report Location"
                description="Selected location for your complaint"
                pinColor="red"
              />
            )}
          </MapView>
            
            {/* Location Info Panel */}
            {location && (
              <View style={styles.locationInfoPanel}>
                <Text style={styles.locationInfoTitle}>Current Location</Text>
                <Text style={styles.locationCoordinates}>
                  Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                </Text>
                {location.accuracy && (
                  <Text style={styles.locationAccuracy}>
                    Accuracy: ±{location.accuracy.toFixed(0)}m
                  </Text>
                )}
                <Text style={styles.locationHint}>Drag the marker to adjust location</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.confirmLocationButton}
              onPress={() => setShowMap(false)}
            >
              <Text style={styles.confirmLocationText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Compact Professional Header Styles
  compactHeader: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 44 : 25,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  compactHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  compactLogoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactTitleSection: {
    flex: 1,
  },
  compactMainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 1,
  },
  compactSubTitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  compactHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactNotificationButton: {
    position: 'relative',
    padding: 6,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactNotificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactNotificationText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  compactReportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  compactReportsText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  compactProgressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactProgressContainer: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginRight: 12,
  },
  compactProgressBar: {
    height: 3,
    backgroundColor: '#fbbf24',
    borderRadius: 2,
  },
  compactProgressText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  professionalHeader: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  govLogo: {
    width: 45,
    height: 45,
    backgroundColor: '#1e40af',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  govIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  titleSection: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 10,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#6366f1',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22d3ee',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#e0e7ff',
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  photoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  photoButton: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  photoPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  photoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  photoText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  retakeButton: {
    marginTop: 12,
    alignSelf: 'center',
  },
  retakeText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  locationButton: {
    backgroundColor: '#22d3ee',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  viewMapButton: {
    alignSelf: 'stretch',
    borderRadius: 12,
    marginTop: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  viewMapButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  viewMapIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  viewMapText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  selectLocationButton: {
    alignSelf: 'stretch',
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectLocationButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  selectLocationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  selectLocationText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    elevation: 0,
  },
  submitButtonSubmitting: {
    backgroundColor: '#f59e0b',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 20,
    width: width - 40,
    maxHeight: height * 0.8,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  mapView: {
    height: 300,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    margin: 20,
    borderRadius: 12,
  },
  mapPlaceholderText: {
    fontSize: 64,
    marginBottom: 8,
  },
  mapPlaceholderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  locationInfoPanel: {
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    marginHorizontal: 20,
  },
  locationInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  locationCoordinates: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 4,
  },
  locationAccuracy: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 6,
  },
  locationHint: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  confirmLocationButton: {
    backgroundColor: '#10b981',
    margin: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmLocationText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Offline Status Styles
  offlineIndicator: {
    backgroundColor: '#fee2e2',
    borderColor: '#f87171',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  offlineText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  
  // Voice Input Styles
  descriptionContainer: {
    position: 'relative',
  },
  voiceButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  voiceButtonActive: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  voiceButtonText: {
    fontSize: 18,
  },
  voiceButtonTextActive: {
    fontSize: 16,
  },
  recordingIndicator: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  recordingText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  voiceResultsContainer: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  voiceResultsTitle: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  voiceResultsText: {
    color: '#0c4a6e',
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  // Smart Location Display Styles
  smartLocationDisplay: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  locationHeaderIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  accuracyBadge: {
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#059669',
  },
  coordinateDisplay: {
    marginBottom: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coordinateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    width: 80,
  },
  coordinateValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  adjustButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 6,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coordinateValue: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#111827',
    marginHorizontal: 12,
    minWidth: 100,
    textAlign: 'center',
  },
  locationActions: {
    marginBottom: 16,
  },
  refreshLocationButton: {
    backgroundColor: '#06b6d4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  refreshLocationText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  visualMapContainer: {
    alignItems: 'center',
  },
  visualMap: {
    width: 120,
    height: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#d1d5db',
    opacity: 0.3,
  },
  locationMarker: {
    position: 'absolute',
    zIndex: 10,
  },
  markerIcon: {
    fontSize: 24,
  },
  visualMapLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },

  // AI Analysis Component Styles
  aiAnalysisSection: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aiAnalyzingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  aiLoadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiLoadingIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  aiLoadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5',
  },
  aiProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  aiProgressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 2,
  },
  aiResultsContainer: {
    width: '100%',
  },
  aiResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiResultsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  aiResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  aiSuggestionCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  aiSuggestionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 4,
  },
  useSuggestionButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  useSuggestionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Reports Navigation Button Styles
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  reportsButton: {
    marginLeft: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reportsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  reportsButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  reportsButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Professional Header Styles
  govLogoGradient: {
    width: 42,
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  departmentText: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Professional Input Styles
  professionalInputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputTitleSection: {
    flex: 1,
    marginLeft: 12,
  },
  inputLabelPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  inputLabelSecondary: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  requiredIndicator: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  requiredText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionalIndicator: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  optionalText: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '500',
  },
  professionalTextInput: {
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  professionalTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  inputValidation: {
    marginLeft: 8,
  },
  validationSuccess: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  validationWarning: {
    color: '#f59e0b',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Professional Category Styles
  professionalCategoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitleSection: {
    flex: 1,
    marginLeft: 12,
  },
  categoryLabelPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  categoryLabelSecondary: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  professionalCategoryScroll: {
    marginHorizontal: -8,
  },
  categoryScrollContent: {
    paddingHorizontal: 8,
  },
  professionalCategoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    minHeight: 85,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  categoryLabelMain: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
  },
  categoryLabelSub: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  categoryMetadata: {
    alignItems: 'center',
    marginTop: 8,
  },
  priorityBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  departmentText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Professional Photo Styles
  professionalPhotoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoTitleSection: {
    flex: 1,
    marginLeft: 12,
  },
  photoLabelPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  photoLabelSecondary: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  photoGuidelines: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  guidelinesText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 16,
  },
  professionalPhotoButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  photoPreviewContainer: {
    position: 'relative',
  },
  professionalPhotoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  photoSuccessIcon: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  photoSuccessText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  cameraPlaceholderIcon: {
    fontSize: 48,
    color: '#6b7280',
  },
  professionalPhotoPlaceholder: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  cameraIconContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  photoPlaceholderSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  photoActionText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
    fontWeight: '500',
  },
  photoActionDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#d1d5db',
    marginHorizontal: 8,
  },
  photoActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  // Professional Bottom Taskbar Styles
  professionalBottomTaskbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  taskbarGradient: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  taskbarContent: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  taskbarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  taskbarItemActive: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  taskbarIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskbarIconActive: {
    backgroundColor: '#3b82f6',
  },
  taskbarLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 1,
  },
  taskbarLabelActive: {
    color: '#1e40af',
  },
  taskbarLabelEn: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  taskbarLabelEnActive: {
    color: '#3b82f6',
  },
  governmentFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  governmentFooterText: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 4,
    fontStyle: 'italic',
  },

  // Advanced Category Selector Styles
  advancedCategoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  // Smart Suggestions Styles
  smartSuggestionsContainer: {
    marginBottom: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  smartSuggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1.5,
    minWidth: 100,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  suggestionConfidence: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },

  // Category History Styles
  categoryHistoryContainer: {
    marginBottom: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  historyChip: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  historyLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },

  // Selected Category Display Styles
  selectedCategoryDisplay: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  selectedCategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectedCategoryLeft: {
    flex: 1,
  },
  selectedCategoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedCategoryDept: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedCategoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryBadgeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeCategoryHint: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Select Category Button Styles
  selectCategoryButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  selectCategoryIcon: {
    fontSize: 20,
  },
  selectCategoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  selectCategoryArrow: {
    fontSize: 16,
    color: '#6b7280',
  },

  // Category Modal Styles
  categoryModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  categoryModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  categoryModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  categoryModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryModalCloseText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: 'bold',
  },

  // Category Search Styles
  categorySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categorySearchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categorySearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  categorySearchClear: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  categorySearchClearText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'bold',
  },

  // Category List Styles
  categoryList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryListItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryListItemSelected: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  categoryListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryListLeft: {
    flex: 1,
  },
  categoryListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  categoryListDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  categoryListMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryListPriority: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    marginBottom: 4,
  },
  categoryListPriorityText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  categoryListDepartment: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
    marginRight: 8,
    marginBottom: 4,
  },
  categoryListTime: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 4,
  },
  categoryListSelected: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  categoryListSelectedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Empty State Styles
  categoryEmptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  categoryEmptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  categoryEmptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  categoryEmptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },

  // Smart Auto-Completion Styles
  inputWithSuggestions: {
    position: 'relative',
    zIndex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 4,
    maxHeight: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1000,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  loadingIndicator: {
    fontSize: 16,
    color: '#6b7280',
  },
  suggestionsList: {
    maxHeight: 150,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  suggestionAction: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 8,
  },

  // Address Input Styles
  addressInputContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  addressInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  addressSuggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 2,
    maxHeight: 150,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 999,
  },
  addressSuggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  addressSuggestionsList: {
    maxHeight: 120,
  },
  addressSuggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  addressSuggestionText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },

  // Progressive Form Disclosure Styles
  stepHeaderContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  stepProgressContainer: {
    marginBottom: 16,
  },
  stepProgressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  stepProgressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  stepProgressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  currentStepInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentStepIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  currentStepText: {
    flex: 1,
  },
  currentStepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  currentStepDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  stepGuidanceContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  stepGuidanceText: {
    fontSize: 14,
    color: '#0c4a6e',
    lineHeight: 20,
    marginBottom: 8,
  },
  hideGuideButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
  },
  hideGuideText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
  },

  // Step Navigation Pills
  stepNavigationContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  stepPillsContainer: {
    paddingHorizontal: 4,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: 60,
  },
  stepPillActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  stepPillCompleted: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  stepPillDisabled: {
    opacity: 0.5,
  },
  stepPillIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  stepPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  stepPillTextActive: {
    color: '#1d4ed8',
  },
  stepPillTextCompleted: {
    color: '#059669',
  },
  stepPillCheck: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 4,
    fontWeight: 'bold',
  },

  // Step Navigation Controls
  stepNavigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  stepNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  stepNavButtonPrevious: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepNavButtonNext: {
    backgroundColor: '#3b82f6',
  },
  stepNavButtonSubmit: {
    backgroundColor: '#10b981',
  },
  stepNavButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#f1f5f9',
  },
  stepNavButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 8,
  },
  stepNavButtonIcon: {
    fontSize: 16,
    color: '#6b7280',
  },
  stepIndicator: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  stepIndicatorText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
});
