import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:typed_data';
import 'dart:html' as html;
import '../models/form_model.dart';
import '../services/form_service.dart';
import '../services/auth_service.dart';
import '../services/supabase_service.dart';
// Removed: auth navigation done by AppDrawer
import 'package:uuid/uuid.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/app_drawer.dart';

class UploadFormScreen extends StatefulWidget {
  @override
  _UploadFormScreenState createState() => _UploadFormScreenState();
}

class _SelectedFile {
  final String id;
  final String name;
  final int size;
  final html.File file;
  _SelectedFile({required this.id, required this.name, required this.size, required this.file});
}

class _UploadFormScreenState extends State<UploadFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _idController = TextEditingController();
  final _uploadedByController = TextEditingController();
  
  FormType _selectedType = FormType.efd;
  DateTime _selectedDate = DateTime.now();
  List<_SelectedFile> _selectedFiles = [];
  bool _isUploading = false;

  @override
  void initState() {
    super.initState();
    _uploadedByController.text = AuthService.getUserDisplayName();
    _idController.text = _generateFormId();
  }

  String _generateFormId() {
    // You can use a UUID or a timestamp for uniqueness
    // return DateTime.now().millisecondsSinceEpoch.toString();
    return const Uuid().v4();
  }

  void _resetFormFields() {
    _nameController.clear();
    _idController.text = _generateFormId();
    _uploadedByController.text = AuthService.getUserDisplayName();
    _selectedType = FormType.efd;
    _selectedDate = DateTime.now();
    _selectedFiles = [];
  }

  @override
  Widget build(BuildContext context) {
    final isWide = MediaQuery.of(context).size.width > 900;
    final isTablet = MediaQuery.of(context).size.width > 600 && MediaQuery.of(context).size.width <= 900;
    final horizontalPadding = isWide ? 80.0 : isTablet ? 32.0 : 12.0;
    final verticalPadding = isWide ? 40.0 : isTablet ? 24.0 : 12.0;
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Row(
          children: [
            Icon(Icons.upload_file, color: Color(0xFF1565C0), size: 28),
            SizedBox(width: 12),
            Text('Upload Form', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: Color(0xFF222B45), fontSize: 22)),
          ],
        ),
        centerTitle: false,
      ),
      drawer: const AppDrawer(selected: DrawerPage.upload),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: horizontalPadding, vertical: verticalPadding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeaderSection(isWide: isWide),
              SizedBox(height: isWide ? 40 : 24),
              _buildFormFields(isWide: isWide),
              SizedBox(height: isWide ? 40 : 24),
              _buildFileUploadSection(isWide: isWide),
              SizedBox(height: isWide ? 40 : 24),
              _buildSubmitButton(isWide: isWide),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderSection({bool isWide = false}) {
    return Padding(
      padding: EdgeInsets.only(bottom: isWide ? 24 : 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Upload New Form', style: GoogleFonts.inter(fontSize: isWide ? 28 : 22, fontWeight: FontWeight.bold, color: Color(0xFF222B45))),
          SizedBox(height: 8),
          Text('Fill in the details and upload your EFD or Retirement form to Supabase', style: GoogleFonts.inter(fontSize: isWide ? 16 : 13, color: Color(0xFF8F9BB3))),
        ],
      ),
    );
  }

  Widget _buildFormFields({bool isWide = false}) {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 1.5,
      margin: EdgeInsets.only(bottom: isWide ? 24 : 16),
      child: Padding(
        padding: EdgeInsets.all(isWide ? 40 : 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Form Details', style: GoogleFonts.inter(fontSize: isWide ? 22 : 18, fontWeight: FontWeight.bold, color: Color(0xFF222B45))),
            SizedBox(height: isWide ? 32 : 20),
            TextFormField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Form Name',
                hintText: 'Enter a descriptive name for the form',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                prefixIcon: Icon(Icons.title),
              ),
              validator: (value) => value == null || value.isEmpty ? 'Please enter a form name' : null,
            ),
            SizedBox(height: isWide ? 24 : 16),
            TextFormField(
              controller: _idController,
              decoration: InputDecoration(
                labelText: 'Form ID',
                hintText: 'Auto-generated',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                prefixIcon: Icon(Icons.tag),
              ),
              readOnly: true,
            ),
            SizedBox(height: isWide ? 24 : 16),
            TextFormField(
              controller: _uploadedByController,
              decoration: InputDecoration(
                labelText: 'Uploaded By',
                hintText: 'Auto-filled',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                prefixIcon: Icon(Icons.person),
              ),
              readOnly: true,
            ),
            SizedBox(height: isWide ? 24 : 16),
            DropdownButtonFormField<FormType>(
              value: _selectedType,
              decoration: InputDecoration(
                labelText: 'Form Type',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                prefixIcon: Icon(Icons.category),
              ),
              items: FormType.values.map((type) {
                return DropdownMenuItem(
                  value: type,
                  child: Row(
                    children: [
                      Icon(
                        type == FormType.efd ? Icons.receipt : Icons.work_off,
                        color: type == FormType.efd ? Color(0xFF00B383) : Color(0xFFFFAA00),
                        size: 20,
                      ),
                      SizedBox(width: 8),
                      Text(type == FormType.efd ? 'EFD Form' : 'Retirement Form'),
                    ],
                  ),
                );
              }).toList(),
              onChanged: (value) => setState(() => _selectedType = value!),
            ),
            SizedBox(height: isWide ? 24 : 16),
            InkWell(
              onTap: () => _selectDate(context),
              child: InputDecorator(
                decoration: InputDecoration(
                  labelText: 'Date Created',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  prefixIcon: Icon(Icons.calendar_today),
                ),
                child: Text('${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFileUploadSection({bool isWide = false}) {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 1.5,
      margin: EdgeInsets.only(bottom: isWide ? 24 : 16),
      child: Padding(
        padding: EdgeInsets.all(isWide ? 40 : 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text('File Upload', style: GoogleFonts.inter(fontSize: isWide ? 22 : 18, fontWeight: FontWeight.bold, color: Color(0xFF222B45))),
                SizedBox(width: 8),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Color(0xFF00B383).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Icon(Icons.cloud_upload, size: 16, color: Color(0xFF00B383)),
                      // SizedBox(width: 4),
                      // Text('Supabase Storage', style: GoogleFonts.inter(fontSize: 12, color: Color(0xFF00B383), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: isWide ? 32 : 20),
            Container(
              width: double.infinity,
              height: isWide ? 260 : 200,
              decoration: BoxDecoration(
                border: Border.all(
                  color: _selectedFiles.isNotEmpty ? Color(0xFF00B383) : Colors.grey[300]!,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(12),
                color: _selectedFiles.isNotEmpty ? Color(0xFF00B383).withOpacity(0.08) : Colors.grey[50],
              ),
              child: InkWell(
                onTap: _pickFiles,
                borderRadius: BorderRadius.circular(12),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      _selectedFiles.isNotEmpty ? Icons.check_circle : Icons.cloud_upload,
                      size: isWide ? 96 : 64,
                      color: _selectedFiles.isNotEmpty ? Color(0xFF00B383) : Colors.grey[400],
                    ),
                    SizedBox(height: 16),
                    Text(
                      _selectedFiles.isNotEmpty ? 'Files Selected' : 'Click to upload files',
                      style: GoogleFonts.inter(
                        fontSize: isWide ? 22 : 18,
                        fontWeight: FontWeight.bold,
                        color: _selectedFiles.isNotEmpty ? Color(0xFF00B383) : Color(0xFF8F9BB3),
                      ),
                    ),
                    SizedBox(height: 8),
                    if (_selectedFiles.isNotEmpty)
                      Expanded(
                        child: Container(
                          decoration: BoxDecoration(
                            color: Color(0xFFF1F6FB),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          padding: EdgeInsets.symmetric(vertical: 8, horizontal: 8),
                          child: ListView.separated(
                            shrinkWrap: true,
                            itemCount: _selectedFiles.length,
                            separatorBuilder: (context, index) => Divider(height: 16, color: Color(0xFFE3F0FF)),
                            itemBuilder: (context, index) {
                              final file = _selectedFiles[index];
                              final ext = file.name.split('.').last.toLowerCase();
                              IconData icon;
                              Color iconColor;
                              if (["pdf"].contains(ext)) {
                                icon = Icons.picture_as_pdf;
                                iconColor = Color(0xFFD32F2F);
                              } else if (["doc", "docx"].contains(ext)) {
                                icon = Icons.description;
                                iconColor = Color(0xFF1976D2);
                              } else if (["jpg", "jpeg", "png"].contains(ext)) {
                                icon = Icons.image;
                                iconColor = Color(0xFF388E3C);
                              } else {
                                icon = Icons.insert_drive_file;
                                iconColor = Color(0xFF8F9BB3);
                              }
                              return Card(
                                elevation: 0,
                                color: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8), side: BorderSide(color: Color(0xFFE3F0FF))),
                                child: ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor: iconColor.withOpacity(0.12),
                                    child: Icon(icon, color: iconColor, size: 24),
                                  ),
                                  title: Text(file.name, style: GoogleFonts.inter(fontSize: isWide ? 16 : 14, fontWeight: FontWeight.w600, color: Color(0xFF222B45))),
                                  subtitle: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('${(file.size / 1024).toStringAsFixed(1)} KB', style: GoogleFonts.inter(fontSize: isWide ? 14 : 12, color: Color(0xFF8F9BB3))),
                                      SizedBox(height: 2),
                                      Row(
                                        children: [
                                          Text('ID: ', style: GoogleFonts.inter(fontSize: 11, color: Color(0xFF8F9BB3))),
                                          Flexible(
                                            child: Text(file.id, style: GoogleFonts.inter(fontSize: 11, color: Color(0xFF1565C0)), overflow: TextOverflow.ellipsis),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  trailing: Tooltip(
                                    message: 'Remove file',
                                    child: IconButton(
                                      icon: Icon(Icons.close, color: Colors.red),
                                      onPressed: () {
                                        setState(() {
                                          _selectedFiles.removeAt(index);
                                        });
                                      },
                                    ),
                                  ),
                                  contentPadding: EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                                ),
                              );
                            },
                          ),
                        ),
                      )
                    else
                      Text(
                        'Supported formats: PDF, DOC, DOCX, JPG, PNG\nYou can select multiple files.',
                        style: GoogleFonts.inter(fontSize: isWide ? 14 : 12, color: Color(0xFF8F9BB3)),
                        textAlign: TextAlign.center,
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmitButton({bool isWide = false}) {
    return SizedBox(
      width: double.infinity,
      height: isWide ? 64 : 56,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Color(0xFF1565C0),
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: GoogleFonts.inter(fontWeight: FontWeight.w600),
        ),
        onPressed: _isUploading || _selectedFiles.isEmpty ? null : _submitForm,
        child: _isUploading
            ? Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(Colors.white))),
                  SizedBox(width: 16),
                  Text('Uploading...'),
                ],
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.cloud_upload),
                  SizedBox(width: 12),
                  Text('Upload'),
                ],
              ),
      ),
    );
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  void _pickFiles() {
    final html.FileUploadInputElement uploadInput = html.FileUploadInputElement();
    uploadInput.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    uploadInput.multiple = true;
    uploadInput.click();

    uploadInput.onChange.listen((e) {
      final files = uploadInput.files;
      if (files != null && files.isNotEmpty) {
        setState(() {
          for (final file in files) {
            // Prevent duplicates by name and size
            if (!_selectedFiles.any((f) => f.name == file.name && f.size == file.size)) {
              _selectedFiles.add(_SelectedFile(
                id: const Uuid().v4(),
                name: file.name,
                size: file.size,
                file: file,
              ));
            }
          }
        });
      }
    });
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate() && _selectedFiles.isNotEmpty) {
      setState(() {
        _isUploading = true;
      });

      bool allSuccess = true;
      for (final file in _selectedFiles) {
        // Read file bytes (web only)
        final reader = html.FileReader();
        final completer = Completer<Uint8List>();
        reader.readAsArrayBuffer(file.file);
        reader.onLoadEnd.listen((_) {
          final data = reader.result as Uint8List;
          completer.complete(data);
        });
        final data = await completer.future;

        // Upload to storage and get storage path
        final storagePath = await SupabaseService.uploadFile(file.name, data);
        if (storagePath == null) {
          allSuccess = false;
          continue;
        }
        // Store the storage object path in DB; we can compute public URL when downloading
        final form = FormDocument(
          id: file.id,
          name: _nameController.text,
          type: _selectedType,
          dateCreated: _selectedDate,
          dateUploaded: DateTime.now(),
          fileName: file.name,
          filePath: storagePath,
          fileSize: file.size,
          uploadedBy: _uploadedByController.text,
        );
        final success = await FormService.addForm(form);
        if (!success) allSuccess = false;
      }

      setState(() {
        _isUploading = false;
      });

      if (allSuccess) {
        // Refresh the forms list before returning to home
        await FormService.refreshForms();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('✅ All forms uploaded successfully!'),
                      Text('Check your Supabase dashboard to see the data', style: TextStyle(fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 4),
          ),
        );
        Navigator.pop(context);
        _resetFormFields(); // Reset form fields after successful upload
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to upload one or more forms.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  // Logout handled by AppDrawer

  // Drawer now provided by AppDrawer

  // Settings/help provided by AppDrawer

  @override
  void dispose() {
    _nameController.dispose();
    _idController.dispose();
    _uploadedByController.dispose();
    super.dispose();
  }
}
