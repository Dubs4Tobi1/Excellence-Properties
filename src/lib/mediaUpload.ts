import { Upload } from 'tus-js-client'
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseClient'

export const mediaBucket = import.meta.env.VITE_PROPERTY_MEDIA_BUCKET || 'property-images'
export const maxMediaBytes = 50 * 1024 * 1024

export function validateMedia(file: File, kind: 'image' | 'video') {
  const allowed = kind === 'video' ? ['video/mp4', 'video/webm'] : ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) throw new Error(`${file.name}: choose ${kind === 'video' ? 'an MP4 or WebM video' : 'a JPG, PNG or WebP photo'}.`)
  if (!file.size || file.size > maxMediaBytes) throw new Error(`${file.name}: files must be between 1 byte and 50 MB. Your storage bucket may have a lower limit.`)
}

export async function uploadMedia(file: File, path: string, onProgress: (value: number) => void) {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  if (!session) throw new Error('Please sign in before uploading a property.')
  if (file.size <= 6 * 1024 * 1024) {
    const { error } = await supabase.storage.from(mediaBucket).upload(path, file, { contentType: file.type, upsert: false })
    if (error) throw error
    onProgress(100)
  } else {
    const url = new URL(SUPABASE_URL)
    url.pathname = '/storage/v1/upload/resumable'
    if (url.hostname.endsWith('.supabase.co')) url.hostname = url.hostname.replace('.supabase.co', '.storage.supabase.co')
    await new Promise<void>((resolve, reject) => {
      const upload = new Upload(file, {
        endpoint: url.toString(),
        headers: { authorization: `Bearer ${session.access_token}`, apikey: SUPABASE_ANON_KEY, 'x-upsert': 'false' },
        retryDelays: [0, 1000, 3000, 5000, 10000],
        chunkSize: 6 * 1024 * 1024,
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: { bucketName: mediaBucket, objectName: path, contentType: file.type, cacheControl: '3600' },
        onProgress: (sent, total) => onProgress(Math.round(sent / total * 100)),
        onError: reject,
        onSuccess: () => resolve(),
      })
      upload.start()
    })
  }
  return supabase.storage.from(mediaBucket).getPublicUrl(path).data.publicUrl
}
