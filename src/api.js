import { UploadClient } from './api/upload_client';

class API {
  static upload(objects, options) {
    return UploadClient.post(objects, options);
  }
}

export { API };
export default API;
