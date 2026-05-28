
/// <summary>
/// Standardized API response format for success, failure, and error cases.
/// </summary>
class ApiResponse {
  static success(data, message = 'Success') {
    return { success: true, message, data };
  }
  static failure(message = 'Failure', data = null) {
    return { success: false, message, data };
  }
  static error(message = 'Error', code = 400, data = null) {
    return { success: false, message, code, data };
  }
}
module.exports = ApiResponse;
