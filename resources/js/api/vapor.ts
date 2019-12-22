import axios from '@/api/axios'

export const storeFileToS3 = async (
  fileToStore: File, 
  onUploadPrepared: (...args: any) => void, 
  onUploadProgress: (nextUploadProgress: number) => void
) => {
  const response = await axios.post('/vapor/signed-storage-url', 
    { 'content_type': fileToStore.type },
  )

  onUploadPrepared()

  await axios.put(response.data.url, fileToStore, {
    headers: response.data.headers,
    onUploadProgress: (progressEvent) => onUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
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