import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/auth_service.dart';
import '../services/form_service.dart';
import '../models/form_model.dart';
import '../screens/home_screen.dart';
import '../screens/forms_list_screen.dart';
import '../screens/upload_form_screen.dart';
import '../screens/login_screen.dart';

enum DrawerPage { dashboard, upload, forms }

class AppDrawer extends StatelessWidget {
  final DrawerPage selected;
  const AppDrawer({super.key, required this.selected});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          _buildHeader(),
          Expanded(child: _buildNavItems(context)),
          _buildLogout(context),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      height: 180,
      decoration: const BoxDecoration(
        color: Colors.white,
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              const CircleAvatar(
                radius: 32,
                backgroundColor: Color(0xFFEDF1F7),
                child: Icon(Icons.person, size: 36, color: Color(0xFF1565C0)),
              ),
              const SizedBox(width: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    AuthService.getUserDisplayName(),
                    style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 18, color: const Color(0xFF222B45)),
                  ),
                  Text(
                    AuthService.currentUser ?? '',
                    style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF8F9BB3)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItems(BuildContext context) {
    final isForms = selected == DrawerPage.forms;
    final isUpload = selected == DrawerPage.upload;
    final isDashboard = selected == DrawerPage.dashboard;

    return ListView(
      padding: EdgeInsets.zero,
      children: [
        _tile(
          context,
          icon: Icons.dashboard,
          label: 'Dashboard',
          selected: isDashboard,
          onTap: () {
            Navigator.pop(context);
            if (!isDashboard) {
              Navigator.push(context, MaterialPageRoute(builder: (_) => HomeScreen()));
            }
          },
        ),
        _tile(
          context,
          icon: Icons.upload_file,
          label: 'Upload Form',
          selected: isUpload,
          onTap: () {
            Navigator.pop(context);
            if (!isUpload) {
              Navigator.push(context, MaterialPageRoute(builder: (_) => UploadFormScreen()));
            }
          },
        ),
        _tile(
          context,
          icon: Icons.list,
          label: 'View All Forms',
          selected: isForms,
          onTap: () {
            Navigator.pop(context);
            if (!isForms) {
              Navigator.push(context, MaterialPageRoute(builder: (_) => FormsListScreen()));
            }
          },
        ),
        const Divider(),
        // Quick counts (non-selecting)
        _miniTile(
          icon: Icons.receipt,
          color: const Color(0xFF00B383),
          label: 'EFD Forms',
          value: FormService.getCountByType(FormType.efd).toString(),
          onTap: () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => FormsListScreen()));
          },
        ),
        _miniTile(
          icon: Icons.work_off,
          color: const Color(0xFFFFAA00),
          label: 'Retirement Forms',
          value: FormService.getCountByType(FormType.retirement).toString(),
          onTap: () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => FormsListScreen()));
          },
        ),
        const Divider(),
        _tile(
          context,
          icon: Icons.settings,
          label: 'Settings',
          onTap: () => _showSettings(context),
        ),
        _tile(
          context,
          icon: Icons.help_outline,
          label: 'Help & Support',
          onTap: () => _showHelp(context),
        ),
      ],
    );
  }

  Widget _tile(BuildContext context, {required IconData icon, required String label, bool selected = false, VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: selected ? const Color(0xFF1565C0) : const Color(0xFF8F9BB3)),
      title: Text(label, style: GoogleFonts.inter(fontWeight: selected ? FontWeight.bold : FontWeight.normal, color: selected ? const Color(0xFF1565C0) : const Color(0xFF222B45))),
      selected: selected,
      selectedTileColor: const Color(0xFFE3F0FF),
      onTap: onTap,
    );
  }

  Widget _miniTile({required IconData icon, required Color color, required String label, required String value, VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: color),
      title: Text(label),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(color: color.withOpacity(0.12), borderRadius: BorderRadius.circular(12)),
        child: Text(value, style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: color)),
      ),
      onTap: onTap,
    );
  }

  Widget _buildLogout(BuildContext context) {
    return Container(
      color: Colors.white,
      child: ListTile(
        leading: const Icon(Icons.logout, color: Colors.red),
        title: Text('Logout', style: GoogleFonts.inter(color: Colors.red, fontWeight: FontWeight.bold)),
        onTap: () {
          Navigator.pop(context);
          AuthService.logout();
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (_) => LoginScreen()),
            (route) => false,
          );
        },
      ),
    );
  }

  void _showSettings(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Settings'),
        content: const Text('Settings content goes here.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close')),
        ],
      ),
    );
  }

  void _showHelp(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Help & Support'),
        content: const Text('Help & Support content goes here.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close')),
        ],
      ),
    );
  }
}


