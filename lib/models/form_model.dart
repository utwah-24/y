enum FormType { efd, retirement }

class FormDocument {
  final String id;
  final String name;
  final FormType type;
  final DateTime dateCreated;
  final DateTime dateUploaded;
  final String fileName;
  final String filePath;
  final int fileSize;
  final String uploadedBy;

  FormDocument({
    required this.id,
    required this.name,
    required this.type,
    required this.dateCreated,
    required this.dateUploaded,
    required this.fileName,
    required this.filePath,
    required this.fileSize,
    required this.uploadedBy,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type.toString(),
      'dateCreated': dateCreated.toIso8601String(),
      'dateUploaded': dateUploaded.toIso8601String(),
      'fileName': fileName,
      'filePath': filePath,
      'fileSize': fileSize,
      'uploadedBy': uploadedBy,
    };
  }

  factory FormDocument.fromJson(Map<String, dynamic> json) {
    return FormDocument(
      id: json['id'],
      name: json['name'],
      type: FormType.values.firstWhere(
        (e) => e.toString() == json['type'],
      ),
      dateCreated: DateTime.parse(json['dateCreated']),
      dateUploaded: DateTime.parse(json['dateUploaded']),
      fileName: json['fileName'],
      filePath: json['filePath'],
      fileSize: json['fileSize'],
      uploadedBy: json['uploadedBy'],
    );
  }

  String get formTypeString {
    switch (type) {
      case FormType.efd:
        return 'EFD Form';
      case FormType.retirement:
        return 'Retirement Form';
    }
  }
}
