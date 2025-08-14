import '../models/form_model.dart';
import 'supabase_service.dart';

class FormService {
  static List<FormDocument> _forms = [];

  static List<FormDocument> get forms => List.unmodifiable(_forms);

  // Initialize and load data from Supabase
  static Future<void> initialize() async {
    print('🚀 Initializing FormService...');
    await refreshForms();
  }

  // Add new form to database and local cache
  static Future<bool> addForm(FormDocument form) async {
    try {
      print('➕ Adding new form: ${form.name}');
      
      // Save to Supabase database
      final success = await SupabaseService.insertFormDocument(form);
      
      if (success) {
        // Add to local cache
        _forms.insert(0, form);
        print('✅ Form added successfully to both database and local cache');
        return true;
      }
      return false;
    } catch (e) {
      print('❌ Error adding form: $e');
      return false;
    }
  }

  // Remove form from database and local cache
  static Future<bool> removeForm(String id) async {
    try {
      print('🗑️ Removing form: $id');
      
      // Delete from Supabase database
      final success = await SupabaseService.deleteFormDocument(id);
      
      if (success) {
        // Remove from local cache
        _forms.removeWhere((form) => form.id == id);
        print('✅ Form removed successfully from both database and local cache');
        return true;
      }
      return false;
    } catch (e) {
      print('❌ Error removing form: $e');
      return false;
    }
  }

  // Search forms (uses database search)
  static Future<List<FormDocument>> searchForms(String query) async {
    if (query.isEmpty) return _forms;
    
    try {
      return await SupabaseService.searchFormDocuments(query);
    } catch (e) {
      print('❌ Search error, falling back to local search: $e');
      // Fallback to local search if database search fails
      return _forms.where((form) {
        return form.name.toLowerCase().contains(query.toLowerCase()) ||
               form.id.toLowerCase().contains(query.toLowerCase()) ||
               form.fileName.toLowerCase().contains(query.toLowerCase());
      }).toList();
    }
  }

  // Get forms by type from local cache
  static List<FormDocument> getFormsByType(FormType type) {
    return _forms.where((form) => form.type == type).toList();
  }

  // Get forms by type from database
  static Future<List<FormDocument>> getFormsByTypeAsync(FormType type) async {
    try {
      return await SupabaseService.getFormDocumentsByType(type);
    } catch (e) {
      print('❌ Error getting forms by type from database: $e');
      return getFormsByType(type); // Fallback to local cache
    }
  }

  // Refresh all forms from database
  static Future<void> refreshForms() async {
    try {
      print('🔄 Refreshing forms from database...');
      _forms = await SupabaseService.getFormDocuments();
      print('✅ Forms refreshed successfully. Total: ${_forms.length}');
    } catch (e) {
      print('❌ Error refreshing forms: $e');
      _forms = []; // Clear cache if refresh fails
    }
  }

  // Get recent forms (last 5)
  static List<FormDocument> getRecentForms() {
    return _forms.take(5).toList();
  }

  // Get total count
  static int getTotalCount() {
    return _forms.length;
  }

  // Get count by type
  static int getCountByType(FormType type) {
    return _forms.where((form) => form.type == type).length;
  }
}
