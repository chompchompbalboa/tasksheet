import axios from '@/api/axios'

export const storeFileToS3 = async (fileToStore: File) => {
    const response = await axios.post('/vapor/signed-storage-url', {
        'content_type': fileToStore.type,
    })

    await axios.put(response.data.url, fileToStore, {
        headers: response.data.headers,
      /*
        onUploadProgress: (progressEvent) => {
            options.progress(progressEvent.loaded / progressEvent.total);
        }
        */
    })
    
    return response.data as IS3PresignedUrlData
}

export interface IS3PresignedUrlData {
  bucket: string
  headers: any
  key: string
  url: string
  uuid: string
}