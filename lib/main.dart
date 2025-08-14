import 'package:flutter/material.dart';
import 'package:logistics_forms_manager/screens/login_screen.dart';
import 'services/supabase_service.dart';
import 'services/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SupabaseService.initialize();
  AuthService.initialize();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Logistics Forms Manager',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Color(0xFFF5F5F5),
      ),
      home: LoginScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
