import 'dart:convert';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';

import '../models/backup_data.dart';

/// Uses the native document picker on Android and browser downloads on web.
/// No server, broad storage permission, or device-specific path is involved.
class BackupFileService {
  const BackupFileService();

  Future<bool> save(String json) async {
    final date = DateTime.now().toIso8601String().substring(0, 10);
    final result = await FilePicker.saveFile(
      dialogTitle: 'Save Pathfolio backup',
      fileName: 'pathfolio-backup-$date.json',
      bytes: Uint8List.fromList(utf8.encode(json)),
    );
    return result != null;
  }

  Future<String?> pick() async {
    final file = await FilePicker.pickFile(
      dialogTitle: 'Open Pathfolio backup',
      type: FileType.custom,
      allowedExtensions: ['json'],
    );
    if (file == null) return null;
    final size = file.lengthSync() ?? await file.length();
    if (size != null && size > BackupData.maxFileSizeBytes) {
      throw const FormatException('Backup file exceeds the 10 MB limit.');
    }
    // Stream with a hard cap even when a document provider reports no size.
    final bytes = BytesBuilder(copy: false);
    await for (final chunk in file.readAsByteStream()) {
      if (bytes.length + chunk.length > BackupData.maxFileSizeBytes) {
        throw const FormatException('Backup file exceeds the 10 MB limit.');
      }
      bytes.add(chunk);
    }
    return decode(bytes.takeBytes());
  }

  static String decode(Uint8List bytes) {
    if (bytes.length > BackupData.maxFileSizeBytes) {
      throw const FormatException('Backup file exceeds the 10 MB limit.');
    }
    return utf8.decode(bytes).replaceFirst(RegExp('^\uFEFF'), '');
  }
}
