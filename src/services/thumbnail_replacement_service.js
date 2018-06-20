const { API } = require('../api');
const { LogService } = require('./log_service');
const axios = require('axios');

class ThumbnailReplacementService {
  static replaceThumbnailFor(assetItemID, file) {
    // Fetch delegate token from runner
    return API.replaceThumbnail(assetItemID, file.fileName)
      .then((response) => {
        LogService.debug(`[${this.name}] Delegate token recieved`, response);
        const token = response.data.token;
        const mcsId = response.data.mcs_id;
        // Upload the image to MCS
        return this._uploadImageToMCS(mcsId, token, file.fileObj);
      })
      .then((mcsResponse) => {
        let thumbnail = mcsResponse.data.thumbnails.find(t => t.type === 'small');
        return {
          id: assetItemID,
          thumbnail_url: thumbnail.location
        };
      });
  }

  static _uploadImageToMCS(mcsId, token, file) {
    const data = new FormData();
    data.append('file', file);

    return axios.request({
      url: `https://io.cimediacloud.com/assets/${mcsId}/coverelement/upload`,
      method: 'post',
      data: data,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      onUploadProgress: (evt) => { LogService.debug(`[${this.name}] Upload Progress`, evt); }
    });
  }
}

module.exports = { ThumbnailReplacementService };
