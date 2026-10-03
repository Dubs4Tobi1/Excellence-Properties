import { beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ session: vi.fn(), upload: vi.fn(), tus: vi.fn() }))
vi.mock('../src/lib/supabaseClient', () => ({
  SUPABASE_URL: 'https://example.supabase.co', SUPABASE_ANON_KEY: 'publishable-test-key',
  supabase: { auth: { getSession: mocks.session }, storage: { from: () => ({ upload: mocks.upload, getPublicUrl: (path: string) => ({ data: { publicUrl: `https://example.com/${path}` } }) }) } }
}))
vi.mock('tus-js-client', () => ({ Upload: class {
  constructor(_file: unknown, private options: any) { mocks.tus(options) }
  start() { this.options.onProgress(6, 10); this.options.onSuccess() }
} }))
import { uploadMedia, validateMedia } from '../src/lib/mediaUpload'
const file = (size: number, type = 'video/mp4') => ({ name: 'tour.mp4', size, type }) as File
beforeEach(() => {
  vi.clearAllMocks()
  mocks.session.mockResolvedValue({ data: { session: { access_token: 'session-test-token' } }, error: null })
  mocks.upload.mockResolvedValue({ error: null })
})
describe('media publishing', () => {
  it('rejects empty, oversized and unsupported videos before upload', () => {
    expect(() => validateMedia(file(0), 'video')).toThrow()
    expect(() => validateMedia(file(51 * 1024 * 1024), 'video')).toThrow()
    expect(() => validateMedia(file(100, 'video/quicktime'), 'video')).toThrow()
    expect(() => validateMedia(file(100), 'video')).not.toThrow()
  })
  it('requires an authenticated session', async () => {
    mocks.session.mockResolvedValue({ data: { session: null }, error: null })
    await expect(uploadMedia(file(100), 'properties/test/tour.mp4', vi.fn())).rejects.toThrow('sign in')
    expect(mocks.upload).not.toHaveBeenCalled()
    expect(mocks.tus).not.toHaveBeenCalled()
  })
  it('propagates storage failures instead of returning a false success', async () => {
    const error = new Error('Bucket not found')
    mocks.upload.mockResolvedValue({ error })
    await expect(uploadMedia(file(100), 'properties/test/tour.mp4', vi.fn())).rejects.toThrow('Bucket not found')
  })
  it('uploads small files and reports completion', async () => {
    const progress = vi.fn()
    await expect(uploadMedia(file(100), 'properties/test/tour.mp4', progress)).resolves.toBe('https://example.com/properties/test/tour.mp4')
    expect(progress).toHaveBeenCalledWith(100)
    expect(mocks.tus).not.toHaveBeenCalled()
  })
  it('uses authenticated resumable chunks with retries for files above 6 MB', async () => {
    const progress = vi.fn()
    await uploadMedia(file(7 * 1024 * 1024), 'properties/test/tour.mp4', progress)
    const options = mocks.tus.mock.calls[0][0]
    expect(options.endpoint).toBe('https://example.storage.supabase.co/storage/v1/upload/resumable')
    expect(options.chunkSize).toBe(6 * 1024 * 1024)
    expect(options.headers.authorization).toBe('Bearer session-test-token')
    expect(options.headers['x-upsert']).toBe('false')
    expect(options.retryDelays.length).toBeGreaterThan(1)
    expect(progress).toHaveBeenCalledWith(60)
    expect(mocks.upload).not.toHaveBeenCalled()
  })
})
