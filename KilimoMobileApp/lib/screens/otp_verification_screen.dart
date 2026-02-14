import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fluttertoast/fluttertoast.dart';
import '../services/api_service.dart';
import 'dashboard_screen.dart';
import 'dart:async';

class OTPVerificationScreen extends StatefulWidget {
  final String email;
  final String userId;
  final bool isFromRegister;
  
  const OTPVerificationScreen({
    super.key,
    required this.email,
    required this.userId,
    this.isFromRegister = false,
  });

  @override
  State<OTPVerificationScreen> createState() => _OTPVerificationScreenState();
}

class _OTPVerificationScreenState extends State<OTPVerificationScreen> {
  List<TextEditingController> otpControllers = List.generate(6, (index) => TextEditingController());
  List<FocusNode> focusNodes = List.generate(6, (index) => FocusNode());
  int _resendTimer = 168; // 02:48 = 168 seconds
  Timer? _timer;
  bool _isLoading = false;
  
  @override
  void initState() {
    super.initState();
    startResendTimer();
  }
  
  void startResendTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendTimer > 0) {
        setState(() {
          _resendTimer--;
        });
      } else {
        timer.cancel();
      }
    });
  }
  
  String formatTime(int seconds) {
    int minutes = seconds ~/ 60;
    int remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }
  
  @override
  void dispose() {
    for (var controller in otpControllers) {
      controller.dispose();
    }
    for (var node in focusNodes) {
      node.dispose();
    }
    _timer?.cancel();
    super.dispose();
  }
  
  void _onNumberTap(String number) {
    // Find the first empty field
    for (int i = 0; i < otpControllers.length; i++) {
      if (otpControllers[i].text.isEmpty) {
        setState(() {
          otpControllers[i].text = number;
        });
        // Move to next field if not the last one
        if (i < otpControllers.length - 1) {
          focusNodes[i + 1].requestFocus();
        }
        break;
      }
    }
  }
  
  void _onBackspace() {
    // Find the last filled field and clear it
    for (int i = otpControllers.length - 1; i >= 0; i--) {
      if (otpControllers[i].text.isNotEmpty) {
        setState(() {
          otpControllers[i].text = '';
        });
        focusNodes[i].requestFocus();
        break;
      }
    }
  }
  
  bool _isOTPComplete() {
    return otpControllers.every((controller) => controller.text.isNotEmpty);
  }
  
  String _getOTPCode() {
    return otpControllers.map((controller) => controller.text).join();
  }

  Future<void> _verifyOTP() async {
    if (!_isOTPComplete()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.verifyOTP(
        userId: widget.userId,
        otp: _getOTPCode(),
      );

      if (response['success'] == true) {
        Fluttertoast.showToast(
          msg: widget.isFromRegister 
              ? "Account verified successfully! Welcome to Kilimo."
              : "Login successful! Welcome back.",
          backgroundColor: const Color(0xFF00D563),
          textColor: Colors.white,
        );

        // Navigate to dashboard
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const DashboardScreen()),
          (route) => false,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: e.toString(),
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Builder(
          builder: (BuildContext context) {
            return IconButton(
              icon: const Icon(
                Icons.menu,
                color: Colors.black,
                size: 28,
              ),
              onPressed: () => Scaffold.of(context).openDrawer(),
            );
          },
        ),
        actions: [
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(
              Icons.arrow_back_ios_new,
              color: Colors.black,
              size: 22,
            ),
          ),
        ],
      ),
      drawer: Drawer(
        backgroundColor: Colors.white,
        child: Column(
          children: [
            // Drawer Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF00D563), Color(0xFF00B050)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CircleAvatar(
                    radius: 35,
                    backgroundColor: Colors.white,
                    child: Icon(
                      Icons.person,
                      color: Color(0xFF00D563),
                      size: 35,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Welcome!',
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    widget.email,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.9),
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            
            // Menu Items
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(
                        Icons.person_outline,
                        color: Color(0xFF00D563),
                        size: 24,
                      ),
                      title: Text(
                        'Profile',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.black87,
                        ),
                      ),
                      onTap: () {
                        Navigator.pop(context);
                        // Navigate to profile screen
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Profile feature coming soon!'),
                            backgroundColor: Color(0xFF00D563),
                          ),
                        );
                      },
                    ),
                    
                    ListTile(
                      leading: const Icon(
                        Icons.settings_outlined,
                        color: Color(0xFF00D563),
                        size: 24,
                      ),
                      title: Text(
                        'Settings',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.black87,
                        ),
                      ),
                      onTap: () {
                        Navigator.pop(context);
                        // Navigate to settings
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Settings feature coming soon!'),
                            backgroundColor: Color(0xFF00D563),
                          ),
                        );
                      },
                    ),
                    
                    ListTile(
                      leading: const Icon(
                        Icons.help_outline,
                        color: Color(0xFF00D563),
                        size: 24,
                      ),
                      title: Text(
                        'Help & Support',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.black87,
                        ),
                      ),
                      onTap: () {
                        Navigator.pop(context);
                        // Navigate to help
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Help feature coming soon!'),
                            backgroundColor: Color(0xFF00D563),
                          ),
                        );
                      },
                    ),
                    
                    const Spacer(),
                    
                    // Logout Button
                    Container(
                      margin: const EdgeInsets.all(20),
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () async {
                          // Clear any stored tokens and navigate back
                          await ApiService.removeToken();
                          Navigator.of(context).pushNamedAndRemoveUntil(
                            '/',
                            (route) => false,
                          );
                        },
                        icon: const Icon(Icons.logout, size: 20),
                        label: Text(
                          'Logout',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(28.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 20),
                
                // Title Section
                Column(
                  children: [
                    Text(
                      'Email Verification',
                      style: GoogleFonts.inter(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    RichText(
                      textAlign: TextAlign.center,
                      text: TextSpan(
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: Colors.grey[600],
                          height: 1.5,
                        ),
                        children: [
                          const TextSpan(text: "Enter the 6-digit code sent to\n"),
                          TextSpan(
                            text: widget.email,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF00D563),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 50),
                
                // OTP Input Fields - Centered and Neater
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: List.generate(6, (index) {
                      return Container(
                        width: 48,
                        height: 58,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(
                            color: otpControllers[index].text.isNotEmpty 
                                ? const Color(0xFF00D563) 
                                : Colors.grey[300]!,
                            width: 2,
                          ),
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: [
                            BoxShadow(
                              color: otpControllers[index].text.isNotEmpty
                                  ? const Color(0xFF00D563).withOpacity(0.1)
                                  : Colors.grey.withOpacity(0.05),
                              spreadRadius: 0,
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: TextField(
                          controller: otpControllers[index],
                          focusNode: focusNodes[index],
                          textAlign: TextAlign.center,
                          readOnly: true,
                          style: GoogleFonts.inter(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: otpControllers[index].text.isNotEmpty 
                                ? const Color(0xFF00D563)
                                : Colors.grey[400],
                          ),
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            counterText: '',
                          ),
                        ),
                      );
                    }),
                  ),
                ),
                
                const SizedBox(height: 40),
                
                // Resend Code Section - Neater Design
                Column(
                  children: [
                    Text(
                      "Didn't receive the code?",
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        color: Colors.grey[600],
                      ),
                    ),
                    
                    const SizedBox(height: 8),
                    
                    GestureDetector(
                      onTap: _resendTimer == 0 ? () {
                        setState(() {
                          _resendTimer = 168;
                        });
                        startResendTimer();
                      } : null,
                      child: Text(
                        _resendTimer > 0 
                            ? 'Resend in ${formatTime(_resendTimer)}'
                            : 'Resend Code',
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          color: const Color(0xFF00D563),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 50),
                
                // Verify Button - Enhanced Design
                Container(
                  width: double.infinity,
                  height: 54,
                  decoration: BoxDecoration(
                    boxShadow: _isOTPComplete() ? [
                      BoxShadow(
                        color: const Color(0xFF00D563).withOpacity(0.3),
                        spreadRadius: 0,
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ] : [],
                  ),
                  child: ElevatedButton(
                    onPressed: _isOTPComplete() && !_isLoading ? _verifyOTP : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isOTPComplete() && !_isLoading
                          ? const Color(0xFF00D563)
                          : Colors.grey[300],
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : Text(
                            'Verify & Continue',
                            style: GoogleFonts.inter(
                              fontSize: 17,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ),
                
                const SizedBox(height: 45),
                
                // Number Pad - Cleaner Layout
                Container(
                  padding: const EdgeInsets.all(20),
                  margin: const EdgeInsets.symmetric(horizontal: 10),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: Colors.grey[200]!,
                      width: 1,
                    ),
                  ),
                  child: Column(
                    children: [
                      // Row 1-3
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildNumberKey('1'),
                          _buildNumberKey('2'),
                          _buildNumberKey('3'),
                        ],
                      ),
                      const SizedBox(height: 25),
                      
                      // Row 4-6
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildNumberKey('4'),
                          _buildNumberKey('5'),
                          _buildNumberKey('6'),
                        ],
                      ),
                      const SizedBox(height: 25),
                      
                      // Row 7-9
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildNumberKey('7'),
                          _buildNumberKey('8'),
                          _buildNumberKey('9'),
                        ],
                      ),
                      const SizedBox(height: 25),
                      
                      // Row 0 and backspace
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          const SizedBox(width: 65),
                          _buildNumberKey('0'),
                          _buildBackspaceKey(),
                        ],
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildNumberKey(String number) {
    return GestureDetector(
      onTap: () => _onNumberTap(number),
      child: Container(
        width: 60,
        height: 60,
        decoration: const BoxDecoration(
          color: Colors.transparent,
        ),
        child: Center(
          child: Text(
            number,
            style: GoogleFonts.inter(
              fontSize: 24,
              fontWeight: FontWeight.w500,
              color: Colors.black,
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildBackspaceKey() {
    return GestureDetector(
      onTap: _onBackspace,
      child: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Center(
          child: Icon(
            Icons.backspace_outlined,
            color: Colors.white,
            size: 22,
          ),
        ),
      ),
    );
  }
}