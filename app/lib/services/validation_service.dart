class ValidationService {
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required.';
    }
    return null;
  }

  static String? validateUrl(String? value) {
    if (value == null || value.trim().isEmpty) {
      return null; // optional
    }
    final trimmed = value.trim();
    final uri = Uri.tryParse(trimmed);
    if (uri == null || !uri.hasScheme || !['http', 'https'].contains(uri.scheme.toLowerCase())) {
      return 'Enter a valid URL starting with http:// or https://';
    }
    if (uri.host.isEmpty || !uri.host.contains('.')) {
      return 'Enter a valid domain name (e.g. https://company.com/job)';
    }
    return null;
  }

  static bool isValidUrl(String? value) {
    return validateUrl(value) == null;
  }

  static String sanitizeText(String input) {
    // Sanitize any potential script tags or control characters
    return input.replaceAll(RegExp(r'[\x00-\x08\x0B\x0C\x0E-\x1F]'), '');
  }
}

