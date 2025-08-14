import 'dart:html' as html;

class AuthService {
  static const String _storageKey = 'logistics_auth';
  static bool _isLoggedIn = false;
  static String? _currentUser;

  // Hardcoded credentials for now
  static const Map<String, String> _credentials = {
    'admin@logistics.com': 'admin123',
    'manager@logistics.com': 'manager123',
    'user@logistics.com': 'user123',
  };

  static bool get isLoggedIn => _isLoggedIn;
  static String? get currentUser => _currentUser;

  static void initialize() {
    final savedUser = html.window.localStorage[_storageKey];
    if (savedUser != null && _credentials.containsKey(savedUser)) {
      _isLoggedIn = true;
      _currentUser = savedUser;
    } else {
      _isLoggedIn = false;
      _currentUser = null;
    }
  }

  static bool login(String email, String password) {
    if (_credentials.containsKey(email) && _credentials[email] == password) {
      _isLoggedIn = true;
      _currentUser = email;
      html.window.localStorage[_storageKey] = email;
      return true;
    }
    return false;
  }

  static void logout() {
    _isLoggedIn = false;
    _currentUser = null;
    html.window.localStorage.remove(_storageKey);
  }

  static String getUserDisplayName() {
    if (_currentUser == null) return 'Unknown User';
    switch (_currentUser) {
      case 'admin@logistics.com':
        return 'Admin User';
      case 'manager@logistics.com':
        return 'Manager User';
      case 'user@logistics.com':
        return 'Regular User';
      default:
        return _currentUser!.split('@')[0];
    }
  }
}
