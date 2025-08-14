import 'dart:typed_data';

import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/form_model.dart';

class SupabaseService {
  static SupabaseClient get client => Supabase.instance.client;
  
  static Future<void> initialize() async {
    await Supabase.initialize(
      url: 'https://uyqcdcmilljgxeczrahf.supabase.co', 
      
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cWNkY21pbGxqZ3hlY3pyYWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjY2ODQsImV4cCI6MjA2ODUwMjY4NH0.o5QVKzPU1Tvf_VlsVAVS3B5VrYs5PV9CRvoMDkArIAs',
    );
    print('✅ Supabase initialized successfully');
  }

  // Upload file to Supabase Storage
  // Returns the storage object path (not public URL). Use getPublicUrlForStoragePath to build a URL.
  static Future<String?> uploadFile(String fileName, List<int> fileBytes) async {
    try {
      // Create unique file path with timestamp (no 'documents/' prefix)
      final String filePath = '${DateTime.now().millisecondsSinceEpoch}_$fileName';
      
      print('📤 Uploading file: $fileName to $filePath');
      
      // Upload file to storage
      await client.storage
          .from('documents')
          .uploadBinary(filePath, fileBytes as Uint8List);
      
      // Log public URL for debugging
      final String publicUrl = client.storage.from('documents').getPublicUrl(filePath);
      print('✅ File uploaded successfully: $publicUrl');
      // Return storage path so DB can store the object key
      return filePath;
    } catch (e) {
      print('❌ File upload failed: $e');
      rethrow;
    }
  }

  // Build a public URL for a storage object path in the 'documents' bucket
  static String getPublicUrlForStoragePath(String storagePath) {
    return client.storage.from('documents').getPublicUrl(storagePath);
  }

  // Try to find an object in the 'documents' bucket that matches a legacy filename.
  // Returns the object's storage path (name) if found, else null.
  static Future<String?> findStorageObjectPathByFilename(String fileName) async {
    try {
      // List root (Supabase Storage API for Flutter doesn't expose search params universally)
      final List<FileObject> result = await client.storage.from('documents').list(path: '');
      for (final obj in result) {
        final name = obj.name;
        if (name == fileName || name.toLowerCase().endsWith('_${fileName.toLowerCase()}')) {
          return name;
        }
      }
      return null;
    } catch (e) {
      print('❌ Error listing storage objects: $e');
      return null;
    }
  }

  // Update a form's file_path in the database to the provided storage path
  static Future<bool> updateFormFilePath(String id, String storagePath) async {
    try {
      await client.from('form_documents').update({'file_path': storagePath}).eq('id', id);
      // Also refresh local cache if in memory
      try {
        // ignore: avoid_dynamic_calls
        // Best effort; actual cache refresh happens via FormService.refreshForms when needed
      } catch (_) {}
      return true;
    } catch (e) {
      print('❌ Failed to update file_path for $id: $e');
      return false;
    }
  }

  // Insert form document into database
  static Future<bool> insertFormDocument(FormDocument document) async {
    try {
      print('💾 Saving document to database: ${document.name}');
      
      final data = {
        'id': document.id,
        'name': document.name,
        'type': document.type.toString().split('.').last, // 'efd' or 'retirement'
        'date_created': document.dateCreated.toIso8601String(),
        'date_uploaded': document.dateUploaded.toIso8601String(),
        'file_name': document.fileName,
        'file_path': document.filePath,
        'file_size': document.fileSize,
        'uploaded_by': document.uploadedBy,
      };
      
      await client.from('form_documents').insert(data);
      print('✅ Document saved to database successfully');
      return true;
    } catch (e) {
      print('❌ Database insert failed: $e');
      rethrow;
    }
  }

  // Get all form documents from database
    static Future<List<FormDocument>> getFormDocuments() async {
    try {
      print('📋 Fetching all documents from database...');
      
      final response = await client
          .from('form_documents')
          .select()
          .order('date_uploaded', ascending: false);
      
      print('🔍 Raw response type: ${response.runtimeType}');
      print('🔍 Raw response: $response');
      
      // The response should be a List, but let's handle it properly
      final List<dynamic> dataList = response as List<dynamic>;
      
      if (dataList.isEmpty) {
        print('📋 No documents found in database (empty table)');
        return [];
      }
      
      final documents = <FormDocument>[];
      
      for (var doc in dataList) {
        try {
          final document = FormDocument(
            id: doc['id']?.toString() ?? '',
            name: doc['name']?.toString() ?? 'Unknown',
            type: doc['type'] == 'efd' ? FormType.efd : FormType.retirement,
            dateCreated: doc['date_created'] != null ? DateTime.parse(doc['date_created'].toString()) : DateTime.now(),
            dateUploaded: doc['date_uploaded'] != null ? DateTime.parse(doc['date_uploaded'].toString()) : DateTime.now(),
            fileName: doc['file_name']?.toString() ?? 'unknown.pdf',
            filePath: doc['file_path']?.toString() ?? '',
            fileSize: doc['file_size'] != null ? int.tryParse(doc['file_size'].toString()) ?? 0 : 0,
            uploadedBy: doc['uploaded_by']?.toString() ?? 'Unknown',
          );
          documents.add(document);
        } catch (e) {
          print('⚠️ Error parsing document: $e');
          print('⚠️ Document data: $doc');
          // Try to add a minimal document if possible
          try {
            final fallbackDoc = FormDocument(
              id: doc['id']?.toString() ?? '',
              name: doc['name']?.toString() ?? 'Unknown',
              type: FormType.efd,
              dateCreated: DateTime.now(),
              dateUploaded: DateTime.now(),
              fileName: 'unknown.pdf',
              filePath: '',
              fileSize: 0,
              uploadedBy: 'Unknown',
            );
            documents.add(fallbackDoc);
            print('⚠️ Added fallback document for row with missing fields.');
          } catch (e2) {
            print('❌ Could not add even fallback document: $e2');
          }
        }
      }
      
      print('✅ Successfully parsed ${documents.length} documents from database');
      return documents;
    } catch (e) {
      print('❌ Failed to fetch documents: $e');
      print('❌ Error type: ${e.runtimeType}');
      return [];
    }
  }

  // static Future<List<FormDocument>> getFormDocuments() async {
  //   try {
  //     print('📋 Fetching all documents from database...');
      
  //     final response = await client
  //         .from('form_documents')
  //         .select()
  //         .order('date_uploaded', ascending: false);
      
  //     final documents = (response as List).map((doc) => FormDocument(
  //       id: doc['id'],
  //       name: doc['name'],
  //       type: doc['type'] == 'efd' ? FormType.efd : FormType.retirement,
  //       dateCreated: DateTime.parse(doc['date_created']),
  //       dateUploaded: DateTime.parse(doc['date_uploaded']),
  //       fileName: doc['file_name'],
  //       filePath: doc['file_path'],
  //       fileSize: doc['file_size'],
  //       uploadedBy: doc['uploaded_by'],
  //     )).toList();
      
  //     print('✅ Fetched ${documents.length} documents from database');
  //     return documents;
  //   } catch (e) {
  //     print('❌ Failed to fetch documents: $e');
  //     return [];
  //   }
  // }

  // Helper: Get a single form document by ID
  static Future<FormDocument?> getFormDocumentById(String id) async {
    try {
      final response = await client
          .from('form_documents')
          .select()
          .eq('id', id)
          .single();
      // response is non-null map when successful
      return FormDocument(
        id: response['id']?.toString() ?? '',
        name: response['name']?.toString() ?? 'Unknown',
        type: response['type'] == 'efd' ? FormType.efd : FormType.retirement,
        dateCreated: response['date_created'] != null ? DateTime.parse(response['date_created'].toString()) : DateTime.now(),
        dateUploaded: response['date_uploaded'] != null ? DateTime.parse(response['date_uploaded'].toString()) : DateTime.now(),
        fileName: response['file_name']?.toString() ?? 'unknown.pdf',
        filePath: response['file_path']?.toString() ?? '',
        fileSize: response['file_size'] != null ? int.tryParse(response['file_size'].toString()) ?? 0 : 0,
        uploadedBy: response['uploaded_by']?.toString() ?? 'Unknown',
      );
    } catch (e) {
      print('❌ Failed to fetch document by ID: $e');
      return null;
    }
  }

  // Delete form document and its file in storage
  static Future<bool> deleteFormDocument(String id) async {
    try {
      print('🗑️ Deleting document: $id');
      // Fetch the document to get file_path
      final doc = await getFormDocumentById(id);
      if (doc != null && doc.filePath.isNotEmpty) {
        // Delete file from storage
        final res = await client.storage.from('documents').remove([doc.filePath]);
        print('🗑️ File deleted from storage: ${doc.filePath}, result: $res');
      } else {
        print('⚠️ No file path found for document $id, skipping storage delete.');
      }
      // Delete from database
      await client.from('form_documents').delete().eq('id', id);
      print('✅ Document deleted successfully');
      return true;
    } catch (e) {
      print('❌ Delete failed: $e');
      return false;
    }
  }

  // Search form documents
    // Search form documents
  static Future<List<FormDocument>> searchFormDocuments(String query) async {
    try {
      print('🔍 Searching documents for: $query');
      
      final response = await client
          .from('form_documents')
          .select()
          .or('name.ilike.%$query%,id.ilike.%$query%,file_name.ilike.%$query%')
          .order('date_uploaded', ascending: false);
      
      final List<dynamic> dataList = response as List<dynamic>;
      
      final documents = <FormDocument>[];
      
      for (var doc in dataList) {
        try {
          final document = FormDocument(
            id: doc['id']?.toString() ?? '',
            name: doc['name']?.toString() ?? 'Unknown',
            type: doc['type'] == 'efd' ? FormType.efd : FormType.retirement,
            dateCreated: DateTime.parse(doc['date_created'] ?? DateTime.now().toIso8601String()),
            dateUploaded: DateTime.parse(doc['date_uploaded'] ?? DateTime.now().toIso8601String()),
            fileName: doc['file_name']?.toString() ?? 'unknown.pdf',
            filePath: doc['file_path']?.toString() ?? '',
            fileSize: doc['file_size'] ?? 0,
            uploadedBy: doc['uploaded_by']?.toString() ?? 'Unknown',
          );
          documents.add(document);
        } catch (e) {
          print('⚠️ Error parsing document: $e');
        }
      }
      
      print('✅ Found ${documents.length} documents matching "$query"');
      return documents;
    } catch (e) {
      print('❌ Search failed: $e');
      return [];
    }
  }

  // Get documents by type
  static Future<List<FormDocument>> getFormDocumentsByType(FormType type) async {
    try {
      final typeString = type.toString().split('.').last;
      print('📊 Fetching $typeString documents...');
      
      final response = await client
          .from('form_documents')
          .select()
          .eq('type', typeString)
          .order('date_uploaded', ascending: false);
      
      final List<dynamic> dataList = response as List<dynamic>;
      
      final documents = <FormDocument>[];
      
      for (var doc in dataList) {
        try {
          final document = FormDocument(
            id: doc['id']?.toString() ?? '',
            name: doc['name']?.toString() ?? 'Unknown',
            type: doc['type'] == 'efd' ? FormType.efd : FormType.retirement,
            dateCreated: DateTime.parse(doc['date_created'] ?? DateTime.now().toIso8601String()),
            dateUploaded: DateTime.parse(doc['date_uploaded'] ?? DateTime.now().toIso8601String()),
            fileName: doc['file_name']?.toString() ?? 'unknown.pdf',
            filePath: doc['file_path']?.toString() ?? '',
            fileSize: doc['file_size'] ?? 0,
            uploadedBy: doc['uploaded_by']?.toString() ?? 'Unknown',
          );
          documents.add(document);
        } catch (e) {
          print('⚠️ Error parsing document: $e');
        }
      }
      
      print('✅ Fetched ${documents.length} $typeString documents');
      return documents;
    } catch (e) {
      print('❌ Failed to fetch documents by type: $e');
      return [];
    }
  }
}
