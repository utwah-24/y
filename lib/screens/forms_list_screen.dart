import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:typed_data';
import 'dart:async';
import '../services/supabase_service.dart';
import '../models/form_model.dart';
import '../services/form_service.dart';
// Drawer handles auth actions; remove local imports
import 'package:google_fonts/google_fonts.dart';
import '../widgets/app_drawer.dart';

class FormsListScreen extends StatefulWidget {
  @override
  _FormsListScreenState createState() => _FormsListScreenState();
}

class _FormsListScreenState extends State<FormsListScreen> {
  final _searchController = TextEditingController();
  List<FormDocument> _filteredForms = [];
  FormType? _selectedTypeFilter;
  String _sortBy = 'dateUploaded';
  bool _sortAscending = false;
  
  // Multi-select state
  bool _selectionMode = false;
  Set<String> _selectedFormIds = {};

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_filterForms);
    _filterForms();
  }

  void _filterForms() async {
    String query = _searchController.text;
    List<FormDocument> forms = await FormService.searchForms(query);

    if (_selectedTypeFilter != null) {
      forms = forms.where((form) => form.type == _selectedTypeFilter).toList();
    }

    setState(() {
      _filteredForms = forms;
      _sortForms();
    });
  }

  void _sortForms() {
    _filteredForms.sort((a, b) {
      int comparison = 0;
      switch (_sortBy) {
        case 'name':
          comparison = a.name.compareTo(b.name);
          break;
        case 'dateCreated':
          comparison = a.dateCreated.compareTo(b.dateCreated);
          break;
        case 'dateUploaded':
          comparison = a.dateUploaded.compareTo(b.dateUploaded);
          break;
        case 'id':
          comparison = a.id.compareTo(b.id);
          break;
      }
      return _sortAscending ? comparison : -comparison;
    });
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
        title: 
            // Icon(Icons.list, color: Color(0xFF1565C0), size: 28),
            Text('All Forms', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: Color(0xFF222B45), fontSize: 22)),
        
        centerTitle: false,
        
      ),
      drawer: const AppDrawer(selected: DrawerPage.forms),
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: horizontalPadding, vertical: verticalPadding),
        child: Column(
          children: [
            _buildSearchAndFilter(isWide: isWide),
            _buildStatsBar(isWide: isWide),
            Expanded(child: _buildFormsList(isWide: isWide)),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchAndFilter({bool isWide = false}) {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 1.5,
      margin: EdgeInsets.only(bottom: isWide ? 24 : 16),
      child: Padding(
        padding: EdgeInsets.all(isWide ? 32 : 20),
        child: Column(
          children: [
            TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search forms by name, ID, or filename...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Colors.grey[50],
              ),
            ),
            SizedBox(height: 12),
            LayoutBuilder(
              builder: (context, constraints) {
                final isMobile = constraints.maxWidth < 500;

                final dropdown = DropdownButtonFormField<FormType?>(
                  value: _selectedTypeFilter,
                  decoration: InputDecoration(
                    labelText: 'Filter by Type',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: const [
                    DropdownMenuItem<FormType?>(value: null, child: Text('All Types')),
                    DropdownMenuItem<FormType?>(value: FormType.efd, child: Text('EFD Forms')),
                    DropdownMenuItem<FormType?>(value: FormType.retirement, child: Text('Retirement Forms')),
                  ],
                  onChanged: (value) {
                    setState(() {
                      _selectedTypeFilter = value;
                    });
                    _filterForms();
                  },
                );

                final clearButton = SizedBox(
                  width: isMobile ? double.infinity : null,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        _searchController.clear();
                        _selectedTypeFilter = null;
                      });
                      _filterForms();
                    },
                    icon: const Icon(Icons.clear),
                    label: const Text('Clear'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[600],
                      padding: EdgeInsets.symmetric(vertical: isMobile ? 14 : 10, horizontal: 12),
                    ),
                  ),
                );

                if (isMobile) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      dropdown,
                      const SizedBox(height: 12),
                      clearButton,
                    ],
                  );
                }
                return Row(
                  children: [
                    Expanded(child: dropdown),
                    const SizedBox(width: 12),
                    clearButton,
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsBar({bool isWide = false}) {
    return Padding(
      padding: EdgeInsets.only(bottom: isWide ? 24 : 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            '${_filteredForms.length} forms found',
            style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: Color(0xFF1565C0), fontSize: isWide ? 18 : 15),
          ),
          LayoutBuilder(
            builder: (context, constraints) {
              final isMobile = MediaQuery.of(context).size.width < 600;
              if (!_selectionMode) {
                if (isMobile) {
                  return Row(
                    children: [
                      IconButton(
                        tooltip: 'Select',
                        icon: const Icon(Icons.checklist),
                        onPressed: () {
                          setState(() {
                            _selectionMode = true;
                            _selectedFormIds.clear();
                          });
                        },
                      ),
                    ],
                  );
                }
                return Row(
                  children: [
                    Text(
                      'Sorted by ${_sortBy} (${_sortAscending ? 'Ascending' : 'Descending'})',
                      style: GoogleFonts.inter(fontSize: isWide ? 14 : 12, color: Color(0xFF8F9BB3)),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton.icon(
                      onPressed: () {
                        setState(() {
                          _selectionMode = true;
                          _selectedFormIds.clear();
                        });
                      },
                      icon: const Icon(Icons.checklist),
                      label: const Text('Select'),
                    ),
                  ],
                );
              }

              // Selection mode
              if (isMobile) {
                return Row(
                  children: [
                    Text(
                      '${_selectedFormIds.length} selected',
                      style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF1565C0), fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 6),
                    IconButton(
                      tooltip: 'Retrieve Selected',
                      icon: const Icon(Icons.download),
                      onPressed: _selectedFormIds.isEmpty ? null : _retrieveSelectedForms,
                      color: const Color(0xFF00B383),
                    ),
                    IconButton(
                      tooltip: 'Delete Selected',
                      icon: const Icon(Icons.delete),
                      onPressed: _selectedFormIds.isEmpty ? null : _deleteSelectedForms,
                      color: const Color(0xFFEF4444),
                    ),
                    IconButton(
                      tooltip: 'Cancel',
                      icon: const Icon(Icons.close),
                      onPressed: () {
                        setState(() {
                          _selectionMode = false;
                          _selectedFormIds.clear();
                        });
                      },
                    ),
                  ],
                );
              }

              return Row(
                children: [
                  Text(
                    '${_selectedFormIds.length} selected',
                    style: GoogleFonts.inter(fontSize: isWide ? 14 : 12, color: const Color(0xFF1565C0), fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(width: 12),
                  OutlinedButton.icon(
                    onPressed: _selectedFormIds.isEmpty ? null : _retrieveSelectedForms,
                    icon: const Icon(Icons.download),
                    label: const Text('Retrieve Selected'),
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton.icon(
                    onPressed: _selectedFormIds.isEmpty ? null : _deleteSelectedForms,
                    icon: const Icon(Icons.delete),
                    label: const Text('Delete Selected'),
                    style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFFEF4444)),
                  ),
                  const SizedBox(width: 8),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _selectionMode = false;
                        _selectedFormIds.clear();
                      });
                    },
                    child: const Text('Cancel'),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFormsList({bool isWide = false}) {
    if (_filteredForms.isEmpty) {
      return Center(
        child: Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 1.5,
          child: Padding(
            padding: EdgeInsets.all(isWide ? 60 : 40),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.search_off, size: isWide ? 96 : 64, color: Colors.grey[300]),
                SizedBox(height: 16),
                Text('No forms found', style: GoogleFonts.inter(fontSize: isWide ? 18 : 15, color: Color(0xFF8F9BB3))),
                SizedBox(height: 8),
                Text('Try adjusting your search or filters', style: GoogleFonts.inter(fontSize: isWide ? 14 : 12, color: Color(0xFF8F9BB3))),
              ],
            ),
          ),
        ),
      );
    }
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;

    if (isMobile) {
      // Mobile-friendly card list
      return ListView.separated(
        itemCount: _filteredForms.length,
        separatorBuilder: (_, __) => const SizedBox(height: 8),
        itemBuilder: (context, index) {
          final form = _filteredForms[index];
          return _buildMobileFormTile(form, index);
        },
      );
    }

    // Desktop/tablet table
    return Column(
      children: [
        // Table header
        Container(
          color: Color(0xFFF1F6FB),
          padding: EdgeInsets.symmetric(vertical: 12, horizontal: 8),
          child: Row(
            children: [
              if (_selectionMode)
                SizedBox(
                  width: 36,
                  child: Checkbox(
                    value: _selectedFormIds.length == _filteredForms.length && _filteredForms.isNotEmpty,
                    tristate: false,
                    onChanged: (checked) {
                      _toggleSelectAllVisible(checked == true);
                    },
                  ),
                ),
              Expanded(flex: 1, child: Text('S/N', style: GoogleFonts.inter(fontWeight: FontWeight.bold))),
              Expanded(flex: 3, child: Text('Details', style: GoogleFonts.inter(fontWeight: FontWeight.bold))),
              Expanded(flex: 2, child: Text('Created At', style: GoogleFonts.inter(fontWeight: FontWeight.bold))),
              Expanded(flex: 2, child: Text('Uploaded At', style: GoogleFonts.inter(fontWeight: FontWeight.bold))),
              Expanded(flex: 3, child: Text('Uploaded By', style: GoogleFonts.inter(fontWeight: FontWeight.bold))),
              Expanded(flex: 3, child: Text('Actions', style: GoogleFonts.inter(fontWeight: FontWeight.bold))),
            ],
          ),
        ),
        Divider(height: 1, thickness: 1),
        Expanded(
          child: ListView.builder(
            itemCount: _filteredForms.length,
            itemBuilder: (context, index) {
              final form = _filteredForms[index];
              final displayName = (form.name.trim().isEmpty) ? form.fileName : form.name;
              final icon = form.type == FormType.efd ? Icons.receipt : Icons.work_off;
              final iconColor = form.type == FormType.efd ? Color(0xFF4ADE80) : Color(0xFFFFAA00);
              return Container(
                padding: EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: Color(0xFFF1F6FB), width: 1)),
                  color: index % 2 == 0 ? Colors.white : Color(0xFFF9FAFB),
                ),
                child: Row(
                  children: [
                    if (_selectionMode)
                      SizedBox(
                        width: 36,
                        child: Checkbox(
                          value: _selectedFormIds.contains(form.id),
                          onChanged: (_) => _toggleSelectForm(form.id),
                        ),
                      ),
                    Expanded(flex: 1, child: Text('${index + 1}', style: GoogleFonts.inter())),
                    Expanded(
                      flex: 3,
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundColor: iconColor.withOpacity(0.15),
                            child: Icon(icon, color: iconColor, size: 18),
                          ),
                          SizedBox(width: 8),
                          Flexible(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(displayName, style: GoogleFonts.inter(fontWeight: FontWeight.w600), overflow: TextOverflow.ellipsis),
                                Text(form.type == FormType.efd ? 'EFD Form' : 'Retirement Form', style: GoogleFonts.inter(fontSize: 12, color: iconColor, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Expanded(flex: 2, child: Text(_formatDate(form.dateCreated), style: GoogleFonts.inter())),
                    Expanded(flex: 2, child: Text(_formatDate(form.dateUploaded), style: GoogleFonts.inter())),
                    Expanded(flex: 3, child: Text(form.uploadedBy, style: GoogleFonts.inter(), overflow: TextOverflow.ellipsis)),
                    Expanded(
                      flex: 3,
                      child: Row(
                        children: [
                          IconButton(
                            icon: Icon(Icons.visibility, color: Color(0xFF2563EB)),
                            tooltip: 'View',
                            onPressed: () => _showFormDetails(form),
                          ),
                          IconButton(
                            icon: Icon(Icons.download, color: Color(0xFF00B383)),
                            tooltip: 'Download',
                            onPressed: () => _downloadForm(form),
                          ),
                          IconButton(
                            icon: Icon(Icons.delete, color: Color(0xFFEF4444)),
                            tooltip: 'Delete',
                            onPressed: () => _deleteForm(form),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildMobileFormTile(FormDocument form, int index) {
    final icon = form.type == FormType.efd ? Icons.receipt : Icons.work_off;
    final iconColor = form.type == FormType.efd ? const Color(0xFF4ADE80) : const Color(0xFFFFAA00);
    final displayName = (form.name.trim().isEmpty) ? form.fileName : form.name;
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      elevation: 1.5,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                if (_selectionMode)
                  Checkbox(
                    value: _selectedFormIds.contains(form.id),
                    onChanged: (_) => _toggleSelectForm(form.id),
                  ),
                CircleAvatar(
                  radius: 16,
                  backgroundColor: iconColor.withOpacity(0.15),
                  child: Icon(icon, color: iconColor, size: 18),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(displayName, style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
                      Text(form.type == FormType.efd ? 'EFD Form' : 'Retirement Form', style: GoogleFonts.inter(fontSize: 12, color: iconColor, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.visibility, color: Color(0xFF2563EB)),
                  onPressed: () => _showFormDetails(form),
                  tooltip: 'View',
                ),
                IconButton(
                  icon: const Icon(Icons.download, color: Color(0xFF00B383)),
                  onPressed: () => _downloadForm(form),
                  tooltip: 'Download',
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Color(0xFFEF4444)),
                  onPressed: () => _deleteForm(form),
                  tooltip: 'Delete',
                ),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 14, color: Color(0xFF8F9BB3)),
                const SizedBox(width: 4),
                Text(_formatDate(form.dateCreated), style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF8F9BB3))),
                const SizedBox(width: 10),
                const Icon(Icons.upload, size: 14, color: Color(0xFF8F9BB3)),
                const SizedBox(width: 4),
                Text(_formatDate(form.dateUploaded), style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF8F9BB3))),
                const SizedBox(width: 10),
                const Icon(Icons.person, size: 14, color: Color(0xFF8F9BB3)),
                const SizedBox(width: 4),
                Expanded(child: Text(form.uploadedBy, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF8F9BB3)), overflow: TextOverflow.ellipsis)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Removed unused card layout

  // Removed unused info item

  // Removed unused sort options sheet

  // Sorting is handled programmatically; no external sheet used anymore

  void _toggleSelectForm(String id) {
                  setState(() {
      if (_selectedFormIds.contains(id)) {
        _selectedFormIds.remove(id);
      } else {
        _selectedFormIds.add(id);
      }
    });
  }
  Future<void> _retrieveSelectedForms() async {
    if (_selectedFormIds.isEmpty) return;
    final selected = _filteredForms.where((f) => _selectedFormIds.contains(f.id)).toList();
    int started = 0;
    int failed = 0;
    for (final form in selected) {
      final url = await _getDownloadUrl(form, allowRepair: false);
      if (url == null) {
        failed++;
        continue;
      }
      final uri = Uri.parse(url);
      final base = uri.toString();
      final sep = base.contains('?') ? '&' : '?';
      final downloadUrl = Uri.parse('$base${sep}download=${Uri.encodeComponent(form.fileName)}');
      try {
        if (kIsWeb) {
          final anchor = html.AnchorElement(href: downloadUrl.toString())
            ..download = form.fileName
            ..target = '_blank';
          anchor.click();
        } else {
          await launchUrl(downloadUrl, mode: LaunchMode.externalApplication);
        }
        started++;
        // Small delay to avoid popup blockers/dom throttling
        await Future.delayed(const Duration(milliseconds: 150));
      } catch (_) {
        failed++;
      }
    }
    if (!mounted) return;
    if (failed > 0 && started == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not download ${failed} selected ${failed == 1 ? 'file' : 'files'}'), backgroundColor: Colors.orange),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Downloading $started ${started == 1 ? 'file' : 'files'} ${failed > 0 ? '($failed failed)' : ''}')), 
      );
    }
  }


  void _toggleSelectAllVisible(bool selectAll) {
    setState(() {
      if (selectAll) {
        _selectedFormIds = _filteredForms.map((f) => f.id).toSet();
      } else {
        _selectedFormIds.clear();
      }
    });
  }

  // Removed unused clear selection helper

  // No bulk delete of all filtered per user request; only selected

  void _showFormDetails(FormDocument form) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(form.name),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildDetailRow('ID', form.id),
              _buildDetailRow('Type', form.formTypeString),
              _buildDetailRow('File Name', form.fileName),
              _buildDetailRow('File Size', '${(form.fileSize / 1024).toStringAsFixed(1)} KB'),
              _buildDetailRow('Uploaded By', form.uploadedBy),
              _buildDetailRow('Date Created', _formatDate(form.dateCreated)),
              _buildDetailRow('Date Uploaded', _formatDate(form.dateUploaded)),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Close'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  void _deleteForm(FormDocument form) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Delete Form'),
        content: Text('Are you sure you want to delete "${form.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (confirmed != true) return;

    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Center(child: CircularProgressIndicator()),
    );

    bool success = false;
    try {
      success = await FormService.removeForm(form.id);
    } finally {
      if (mounted && Navigator.canPop(context)) {
        Navigator.pop(context); // Remove loading dialog
      }
    }

    if (!mounted) return;

    if (success) {
      setState(() {
        _filteredForms.removeWhere((f) => f.id == form.id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Form deleted successfully'), backgroundColor: Colors.red),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete form. Please try again.'), backgroundColor: Colors.orange),
      );
    }
  }

  void _deleteSelectedForms() async {
    if (_selectedFormIds.isEmpty) return;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Delete Selected Forms'),
        content: Text('Are you sure you want to delete the selected forms?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (confirmed != true) return;

    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Center(child: CircularProgressIndicator()),
    );

    bool allSuccess = true;
    for (final id in _selectedFormIds) {
      try {
        final success = await FormService.removeForm(id);
        if (!success) allSuccess = false;
      } catch (_) {
        allSuccess = false;
      }
    }
    if (mounted && Navigator.canPop(context)) {
      Navigator.pop(context); // Remove loading dialog
    }

    if (!mounted) return;

    setState(() {
      _filteredForms.removeWhere((f) => _selectedFormIds.contains(f.id));
      _selectedFormIds.clear();
      _selectionMode = false;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(allSuccess ? 'Selected forms deleted successfully' : 'Some forms could not be deleted'),
        backgroundColor: allSuccess ? Colors.red : Colors.orange,
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  Future<void> _downloadForm(FormDocument form) async {
    String urlString = await _getDownloadUrl(form, allowRepair: true) ?? '';
    if (urlString.isEmpty) {
      // Offer to repair by re-uploading the missing file now
      if (!kIsWeb) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('File missing for ${form.fileName}. Please re-upload on web.'), backgroundColor: Colors.orange),
        );
        return;
      }
      final shouldRepair = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('File Missing'),
          content: Text('The file for "${form.fileName}" is missing in storage. Select the file to attach it now and download?'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
            TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Select File')),
          ],
        ),
      );
      if (shouldRepair != true) return;
      final repairedUrl = await _repairMissingFileAndGetUrl(form);
      if (repairedUrl == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Repair failed or file not selected'), backgroundColor: Colors.orange),
        );
        return;
      }
      urlString = repairedUrl;
    }
    Uri? uri;
    try {
      uri = Uri.parse(urlString);
    } catch (_) {
      uri = null;
    }
    if (uri == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Invalid file URL'), backgroundColor: Colors.orange),
      );
      return;
    }
    try {
      // Force download filename via query param (Supabase accepts download=)
      final base = uri.toString();
      final sep = base.contains('?') ? '&' : '?';
      final downloadUrl = Uri.parse('$base${sep}download=${Uri.encodeComponent(form.fileName)}');
      if (kIsWeb) {
        final anchor = html.AnchorElement(href: downloadUrl.toString())
          ..download = form.fileName
          ..target = '_blank';
        anchor.click();
        return;
      }
      final can = await canLaunchUrl(downloadUrl);
      if (!can) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cannot open download URL'), backgroundColor: Colors.orange),
        );
        return;
      }
      await launchUrl(downloadUrl, mode: LaunchMode.externalApplication);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to launch URL: $e'), backgroundColor: Colors.orange),
      );
    }
  }
  Future<String?> _getDownloadUrl(FormDocument form, {required bool allowRepair}) async {
    final storagePath = form.filePath.trim();
    if (storagePath.isEmpty) {
      if (!allowRepair) return null;
      // Attempt legacy recovery: try to find by fileName in storage
      final recovered = await SupabaseService.findStorageObjectPathByFilename(form.fileName);
      if (recovered != null) {
        await SupabaseService.updateFormFilePath(form.id, recovered);
        return SupabaseService.getPublicUrlForStoragePath(recovered);
      }
      // Optionally prompt for repair upload only in the direct download flow
      if (allowRepair) {
        final repairedUrl = await _repairMissingFileAndGetUrl(form);
        return repairedUrl;
      }
      return null;
    }
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      return storagePath;
    }
    return SupabaseService.getPublicUrlForStoragePath(storagePath);
  }

  Future<String?> _repairMissingFileAndGetUrl(FormDocument form) async {
    try {
      // Web file picker
      final input = html.FileUploadInputElement();
      input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
      input.click();
      final completer = Completer<html.File?>();
      input.onChange.listen((_) {
        final files = input.files;
        completer.complete(files != null && files.isNotEmpty ? files.first : null);
      });
      final picked = await completer.future;
      if (picked == null) return null;

      // Read bytes
      final reader = html.FileReader();
      final bytesCompleter = Completer<Uint8List>();
      reader.readAsArrayBuffer(picked);
      reader.onLoadEnd.listen((_) {
        bytesCompleter.complete(reader.result as Uint8List);
      });
      final bytes = await bytesCompleter.future;

      // Upload to storage
      final storagePath = await SupabaseService.uploadFile(picked.name, bytes);
      if (storagePath == null) return null;

      // Update DB file_path and local list
      await SupabaseService.updateFormFilePath(form.id, storagePath);
      setState(() {
        final i = _filteredForms.indexWhere((f) => f.id == form.id);
        if (i != -1) {
          _filteredForms[i] = FormDocument(
            id: form.id,
            name: form.name,
            type: form.type,
            dateCreated: form.dateCreated,
            dateUploaded: DateTime.now(),
            fileName: picked.name,
            filePath: storagePath,
            fileSize: picked.size,
            uploadedBy: form.uploadedBy,
          );
        }
      });

      // Build and return public URL
      return SupabaseService.getPublicUrlForStoragePath(storagePath);
    } catch (_) {
      return null;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // Drawer actions handled globally by AppDrawer

}
