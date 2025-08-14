import 'package:flutter/material.dart';
import '../services/form_service.dart';
import '../models/form_model.dart';
import 'upload_form_screen.dart';
import 'forms_list_screen.dart';
import '../services/auth_service.dart';
// Removed: navigation handled via AppDrawer
import 'package:google_fonts/google_fonts.dart';
import '../widgets/app_drawer.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _initializeAndRefresh();
  }

  Future<void> _initializeAndRefresh() async {
    await FormService.initialize();
    setState(() {});
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_initialized) {
      // Refresh forms when returning to HomeScreen
      FormService.refreshForms().then((_) => setState(() {}));
    } else {
      _initialized = true;
    }
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
            Container(
              width:30,
              height:30,
              child: Image.network(
                'https://uyqcdcmilljgxeczrahf.supabase.co/storage/v1/object/public/documents//logo.png',
                fit: BoxFit.contain,
                )
            ),
            SizedBox(width: 12),
            Text('Forms Manager', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: Color(0xFF222B45), fontSize: 22)),
          ],
        ),
        centerTitle: false,
        actions: [
          Container(
            margin: EdgeInsets.only(right: 16),
            child: CircleAvatar(
              backgroundColor: Color(0xFFEDF1F7),
              child: Icon(Icons.person, color: Color(0xFF1565C0)),
            ),
          ),
        ],
      ),
      drawer: const AppDrawer(selected: DrawerPage.dashboard),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: horizontalPadding, vertical: verticalPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildWelcomeSection(isWide: isWide),
            SizedBox(height: isWide ? 40 : 24),
            _buildStatsSection(isWide: isWide, isTablet: isTablet),
            SizedBox(height: isWide ? 40 : 24),
            _buildQuickActionsSection(isWide: isWide),
            SizedBox(height: isWide ? 40 : 24),
            _buildRecentFormsSection(isWide: isWide),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeSection({bool isWide = false}) {
    return Padding(
      padding: EdgeInsets.only(bottom: isWide ? 24 : 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Welcome back,',
            style: GoogleFonts.inter(fontSize: isWide ? 22 : 18, color: Color(0xFF8F9BB3)),
          ),
          SizedBox(height: 4),
          Text(
            AuthService.getUserDisplayName(),
            style: GoogleFonts.inter(fontSize: isWide ? 32 : 24, fontWeight: FontWeight.bold, color: Color(0xFF222B45)),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsSection({bool isWide = false, bool isTablet = false}) {
    final totalForms = FormService.forms.length;
    final efdForms = FormService.getFormsByType(FormType.efd).length;
    final retirementForms = FormService.getFormsByType(FormType.retirement).length;
    final children = [
      _buildStatCard('Total Forms', totalForms.toString(), Icons.description, Color(0xFF1565C0), isWide: isWide),
      _buildStatCard('EFD Forms', efdForms.toString(), Icons.receipt, Color(0xFF00B383), isWide: isWide),
      _buildStatCard('Retirement Forms', retirementForms.toString(), Icons.work_off, Color(0xFFFFAA00), isWide: isWide),
    ];
    if (isWide) {
      return Row(
        children: children.map((c) => Expanded(child: c)).toList(),
      );
    } else if (isTablet) {
      return Wrap(
        spacing: 16,
        runSpacing: 16,
        children: children,
      );
    } else {
      return Column(
        children: children,
      );
    }
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color, {bool isWide = false}) {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 1.5,
      child: Padding(
        padding: EdgeInsets.symmetric(vertical: isWide ? 32 : 20, horizontal: isWide ? 32 : 20),
        child: Row(
          children: [
            Container(
              decoration: BoxDecoration(
                color: color.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              padding: EdgeInsets.all(12),
              child: Icon(icon, size: isWide ? 36 : 28, color: color),
            ),
            SizedBox(width: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(value, style: GoogleFonts.inter(fontSize: isWide ? 28 : 22, fontWeight: FontWeight.bold, color: color)),
                SizedBox(height: 2),
                Text(title, style: GoogleFonts.inter(fontSize: isWide ? 16 : 13, color: Color(0xFF8F9BB3))),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionsSection({bool isWide = false}) {
    final isMobile = MediaQuery.of(context).size.width < 600;
    return Padding(
      padding: EdgeInsets.only(bottom: isWide ? 24 : 16),
      child: isMobile ? Column(
        children: [
          _buildActionCard(
            'Upload New Form',
             isMobile ? '':'Add EFD or Retirement forms',
            Icons.upload_file,
            Color(0xFF1565C0),
            () async {
              await Navigator.push(context, MaterialPageRoute(builder: (context) => UploadFormScreen()));
              await FormService.refreshForms();
              setState(() {});
            },
          ),
          const SizedBox(height: 16),
          _buildActionCard(
            'View All Forms',
            isMobile ? '':'Browse and manage forms',
            Icons.list,
            Color(0xFF00B383),
            () async {
              await Navigator.push(context, MaterialPageRoute(builder: (context) => FormsListScreen()));
              setState(() {});
            },
          ),
        ],
      ) :Row(
        children: [
          Expanded(
            child: _buildActionCard(
              'Upload New Form',
              'Add EFD or Retirement forms',
              Icons.upload_file,
              Color(0xFF1565C0),
              () async {
                await Navigator.push(context, MaterialPageRoute(builder: (context) => UploadFormScreen()));
                await FormService.refreshForms();
                setState(() {});
              },
            ),
          ),
          SizedBox(width: 24),
          Expanded(
            child: _buildActionCard(
              'View All Forms',
              'Browse and manage forms',
              Icons.list,
              Color(0xFF00B383),
              () async {
                await Navigator.push(context, MaterialPageRoute(builder: (context) => FormsListScreen()));
                setState(() {});
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(String title, String subtitle, IconData icon, Color color, VoidCallback onTap) {
   final isMobile = MediaQuery.of(context).size.width < 600;
   return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 1.5,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: 28, horizontal: 20),
          child: Row(
            children: [
              Container(
                decoration: BoxDecoration(
                  color: color.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: EdgeInsets.all(12),
                child: Icon(icon, size: 32, color: color),
              ),
              SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF222B45))),
                    SizedBox(height: 4),
                    Text(subtitle, style: GoogleFonts.inter(fontSize: 13, color: Color(0xFF8F9BB3))) 
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentFormsSection({bool isWide = false}) {
    final recentForms = FormService.forms.take(5).toList();
    return Padding(
      padding: EdgeInsets.only(bottom: isWide ? 24 : 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Recent Forms', style: GoogleFonts.inter(fontSize: isWide ? 22 : 18, fontWeight: FontWeight.bold, color: Color(0xFF222B45))),
              TextButton(
                onPressed: () async {
                  await Navigator.push(context, MaterialPageRoute(builder: (context) => FormsListScreen()));
                  setState(() {});
                },
                child: Text('View All', style: GoogleFonts.inter(fontWeight: FontWeight.w500)),
              ),
            ],
          ),
          SizedBox(height: 16),
          if (recentForms.isEmpty)
            Card(
              color: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 1.5,
              child: Padding(
                padding: EdgeInsets.all(isWide ? 60 : 40),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.description, size: isWide ? 96 : 64, color: Colors.grey[300]),
                      SizedBox(height: 16),
                      Text('No forms uploaded yet', style: GoogleFonts.inter(fontSize: isWide ? 18 : 15, color: Color(0xFF8F9BB3))),
                    ],
                  ),
                ),
              ),
            )
          else
            Wrap(
              spacing: 24,
              runSpacing: 24,
              children: recentForms.map((form) => _buildFormListItem(form, isWide: isWide)).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildFormListItem(FormDocument form, {bool isWide = false}) {
    return SizedBox(
      width: isWide ? 340 : double.infinity,
      child: Card(
        color: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 1.5,
        child: ListTile(
          contentPadding: EdgeInsets.symmetric(vertical: 20, horizontal: 20),
          leading: CircleAvatar(
            backgroundColor: form.type == FormType.efd ? Color(0xFF00B383) : Color(0xFFFFAA00),
            child: Icon(
              form.type == FormType.efd ? Icons.receipt : Icons.work_off,
              color: Colors.white,
            ),
          ),
          title: Text(form.name, style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: isWide ? 17 : 15, color: Color(0xFF222B45))),
          subtitle: Text('${form.formTypeString} • ${_formatDate(form.dateUploaded)}', style: GoogleFonts.inter(fontSize: isWide ? 14 : 12, color: Color(0xFF8F9BB3))),
          trailing: Icon(Icons.arrow_forward_ios, size: 16, color: Color(0xFF8F9BB3)),
          onTap: () {},
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  // Drawer is now provided by AppDrawer

  // Settings/help/logout handled by AppDrawer
}
