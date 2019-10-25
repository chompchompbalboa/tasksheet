import axios from '@/api/axios'

export const storeToS3 = async (fileToStore: File) => {
    const response = await axios.post('/vapor/signed-storage-url', {
        'content_type': fileToStore.type,
    })
    console.log(response)
}