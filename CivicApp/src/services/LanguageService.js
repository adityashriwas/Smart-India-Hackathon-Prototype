import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

const resources = {
  en: {
    translation: {
      // Common
      'continue': 'Continue',
      'submit': 'Submit',
      'cancel': 'Cancel',
      'save': 'Save',
      'edit': 'Edit',
      'delete': 'Delete',
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      
      // Onboarding
      'app_title': 'Sudhaar Setu',
      'app_subtitle': 'Report • Track • Resolve',
      'get_started': 'Get Started',
      
      // Authentication
      'citizen_login': 'Citizen Login',
      'create_account': 'Create Account',
      'phone_number': 'Phone Number',
      'password': 'Password',
      'full_name': 'Full Name',
      'email_address': 'Email Address',
      'address': 'Address',
      'city': 'City',
      'login': 'Login',
      'signup': 'Sign Up',
      'logout': 'Logout',
      'already_have_account': 'Already have an account? Login',
      'dont_have_account': "Don't have an account? Sign Up",
      
      // Report Screen
      'report_issue': 'Report an Issue',
      'title': 'Title',
      'description': 'Description',
      'category': 'Category',
      'capture_photo': 'Capture Photo',
      'retake_photo': 'Retake Photo',
      'get_location': 'Get Location',
      'location_captured': 'Location Captured ✓',
      'submit_report': 'Submit Report',
      'voice_input': 'Voice Input',
      'stop_recording': 'Stop Recording',
      
      // Categories
      'pothole': 'Pothole',
      'streetlight': 'Streetlight',
      'garbage': 'Garbage Collection',
      'water': 'Water Supply',
      'drainage': 'Drainage',
      'road': 'Road Maintenance',
      'other': 'Other',
      
      // Map Screen
      'nearby_reports': 'Nearby Reports',
      'loading_reports': 'Loading reports...',
      
      // Status Screen
      'my_reports': 'My Reports',
      'no_reports': 'No Reports Yet',
      'start_reporting': 'Start by reporting an issue in the Report tab',
      'assigned_to': 'Assigned to',
      'reported_on': 'Reported on',
      
      // Profile Screen
      'profile': 'Profile',
      'personal_information': 'Personal Information',
      'edit_profile': 'Edit Profile',
      'logout_confirm': 'Are you sure you want to logout?',
      
      // Status Labels
      'pending': 'PENDING',
      'in_progress': 'IN PROGRESS',
      'resolved': 'RESOLVED',
      'assigned': 'ASSIGNED'
    }
  },
  hi: {
    translation: {
      // Common
      'continue': 'जारी रखें',
      'submit': 'जमा करें',
      'cancel': 'रद्द करें',
      'save': 'सेव करें',
      'edit': 'संपादित करें',
      'delete': 'हटाएं',
      'loading': 'लोड हो रहा है...',
      'error': 'त्रुटि',
      'success': 'सफलता',
      
      // Onboarding
      'app_title': 'झारखंड नागरिक सेवाएं',
      'app_subtitle': 'रिपोर्ट • ट्रैक • समाधान',
      'get_started': 'शुरू करें',
      
      // Authentication
      'citizen_login': 'नागरिक लॉगिन',
      'create_account': 'खाता बनाएं',
      'phone_number': 'फोन नंबर',
      'password': 'पासवर्ड',
      'full_name': 'पूरा नाम',
      'email_address': 'ईमेल पता',
      'address': 'पता',
      'city': 'शहर',
      'login': 'लॉगिन',
      'signup': 'साइन अप',
      'logout': 'लॉगआउट',
      'already_have_account': 'पहले से खाता है? लॉगिन करें',
      'dont_have_account': 'खाता नहीं है? साइन अप करें',
      
      // Report Screen
      'report_issue': 'समस्या की रिपोर्ट करें',
      'title': 'शीर्षक',
      'description': 'विवरण',
      'category': 'श्रेणी',
      'capture_photo': 'फोटो लें',
      'retake_photo': 'फिर से फोटो लें',
      'get_location': 'स्थान प्राप्त करें',
      'location_captured': 'स्थान कैप्चर किया गया ✓',
      'submit_report': 'रिपोर्ट जमा करें',
      'voice_input': 'आवाज इनपुट',
      'stop_recording': 'रिकॉर्डिंग बंद करें',
      
      // Categories
      'pothole': 'गड्ढा',
      'streetlight': 'स्ट्रीट लाइट',
      'garbage': 'कचरा संग्रह',
      'water': 'पानी की आपूर्ति',
      'drainage': 'जल निकासी',
      'road': 'सड़क रखरखाव',
      'other': 'अन्य',
      
      // Map Screen
      'nearby_reports': 'आस-पास की रिपोर्ट्स',
      'loading_reports': 'रिपोर्ट्स लोड हो रही हैं...',
      
      // Status Screen
      'my_reports': 'मेरी रिपोर्ट्स',
      'no_reports': 'अभी तक कोई रिपोर्ट नहीं',
      'start_reporting': 'रिपोर्ट टैब में जाकर समस्या की रिपोर्ट करें',
      'assigned_to': 'सौंपा गया',
      'reported_on': 'रिपोर्ट की तारीख',
      
      // Profile Screen
      'profile': 'प्रोफाइल',
      'personal_information': 'व्यक्तिगत जानकारी',
      'edit_profile': 'प्रोफाइल संपादित करें',
      'logout_confirm': 'क्या आप वाकई लॉगआउट करना चाहते हैं?',
      
      // Status Labels
      'pending': 'लंबित',
      'in_progress': 'प्रगति में',
      'resolved': 'हल हो गया',
      'assigned': 'सौंपा गया'
    }
  }
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    const locales = RNLocalize.getLocales();
    const bestLanguage = locales[0]?.languageCode || 'en';
    callback(bestLanguage);
  },
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
