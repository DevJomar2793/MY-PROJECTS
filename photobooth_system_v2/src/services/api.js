/**
 * api.js – Axios-based API service for SnapCapture backend
 * Base URL is auto-proxied by Vite → http://localhost:8000
 */

const BASE = '/api'

async function request(method, url, body = null, isFormData = false) {
  const opts = { method }
  if (body) {
    opts.body = isFormData ? body : JSON.stringify(body)
    if (!isFormData) opts.headers = { 'Content-Type': 'application/json' }
  }
  const res = await fetch(BASE + url, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || 'Request failed')
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  /** Upload a captured image blob */
  uploadImage(blob, user = 'Anonymous', originalName = 'capture') {
    const formData = new FormData()
    formData.append('file', blob, `${originalName}.jpg`)
    formData.append('user', user)
    formData.append('original_name', originalName)
    return request('POST', '/images/upload', formData, true)
  },

  /** List all images */
  listImages() {
    return request('GET', '/images')
  },

  /** Delete an image by ID */
  deleteImage(id) {
    return request('DELETE', `/images/${id}`)
  },

  /** Download URL (link) */
  downloadUrl(id) {
    return `/api/images/${id}/download`
  },

  /** Full URL for serving an image */
  imageUrl(filename) {
    return `/uploads/images/${filename}`
  },
}
