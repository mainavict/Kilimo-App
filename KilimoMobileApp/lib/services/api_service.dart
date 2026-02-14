import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'https://kilimo-app-nine.vercel.app/api';
  
  // Headers for API requests
  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
  };
  
  // Headers with authentication
  static Future<Map<String, String>> get authHeaders async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // Token management
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }

  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }

  // API Response wrapper
  static Map<String, dynamic> handleResponse(http.Response response) {
    final Map<String, dynamic> data = jsonDecode(response.body);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    } else {
      throw ApiException(
        data['message'] ?? 'An error occurred',
        response.statusCode,
      );
    }
  }

  // Register user
  static Future<Map<String, dynamic>> register({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: headers,
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    return handleResponse(response);
  }

  // Login user
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: headers,
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    return handleResponse(response);
  }

  // Verify OTP
  static Future<Map<String, dynamic>> verifyOTP({
    required String userId,
    required String otp,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/otp/verify'),
      headers: headers,
      body: jsonEncode({
        'userId': userId,
        'otp': otp,
      }),
    );

    final data = handleResponse(response);
    
    // Save the JWT token after successful OTP verification
    if (data['success'] == true && data['data']['token'] != null) {
      await saveToken(data['data']['token']);
    }
    
    return data;
  }

  // Submit contact form
  static Future<Map<String, dynamic>> submitForm({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required String message,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/form/submit'),
      headers: await authHeaders,
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'phone': phone,
        'message': message,
      }),
    );

    return handleResponse(response);
  }

  // Get user's form submissions
  static Future<Map<String, dynamic>> getSubmissions() async {
    final response = await http.get(
      Uri.parse('$baseUrl/form/submissions'),
      headers: await authHeaders,
    );

    return handleResponse(response);
  }

  // Forgot password
  static Future<Map<String, dynamic>> forgotPassword({
    required String email,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/forgot-password'),
      headers: headers,
      body: jsonEncode({
        'email': email,
      }),
    );

    return handleResponse(response);
  }
}

// Custom exception for API errors
class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException(this.message, this.statusCode);

  @override
  String toString() => message;
}