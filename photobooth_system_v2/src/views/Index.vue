<template>
  <!-- Page Hero -->
  <section class="page-hero">
    <div class="container position-relative" style="z-index:1;">
      <p class="section-label afu"><i class="bi bi-camera-fill me-2"></i>Live Capture Studio</p>
      <h1 class="section-title afu-1">Capture Your <span>Moment</span></h1>
      <div class="section-divider afu-1"></div>
      <p style="color:var(--text-muted);max-width:480px;font-size:.95rem;" class="afu-2">
        Access your webcam, snap a photo, and save it to the gallery — instantly.
      </p>
    </div>
  </section>

  <section class="section-pad">
    <div class="container">
      <!-- Alerts -->
      <div v-if="successMsg" class="sc-success d-flex align-items-center gap-2 mb-4 afu">
        <i class="bi bi-check-circle-fill fs-5"></i>
        <span>{{ successMsg }}</span>
        <button class="btn-close ms-auto" style="filter:invert(1)" @click="successMsg=''"></button>
      </div>
      <div v-if="errorMsg" class="sc-error d-flex align-items-center gap-2 mb-4 afu">
        <i class="bi bi-exclamation-triangle-fill fs-5"></i>
        <span>{{ errorMsg }}</span>
        <button class="btn-close ms-auto" style="filter:invert(1)" @click="errorMsg=''"></button>
      </div>

      <div class="row g-4 justify-content-center">
        <!-- Camera Panel -->
        <div class="col-lg-7">
          <div class="camera-card">
            <!-- Viewport -->
            <div class="camera-viewport">
              <!-- Live video -->
              <video ref="videoEl" autoplay playsinline muted :class="{ 'd-none': capturedDataUrl }"></video>

              <!-- Captured canvas (shown after capture) -->
              <canvas ref="canvasEl" :class="{ 'd-none': !capturedDataUrl }"></canvas>

              <!-- Countdown -->
              <div v-if="countdown > 0" class="countdown-display">{{ countdown }}</div>

              <!-- Idle overlay -->
              <div v-if="!streaming && !capturedDataUrl" class="cam-overlay">
                <i class="bi bi-camera-video-off" style="font-size:4rem;color:rgba(255,255,255,.25);"></i>
                <p style="color:rgba(255,255,255,.45);font-size:.9rem;margin:0;">Camera not started</p>
                <button class="btn-accent mt-2 px-4" @click="startCamera">
                  <i class="bi bi-play-fill me-2"></i>Start Camera
                </button>
              </div>
            </div>

            <!-- Controls Strip -->
            <div class="cam-controls">
              <!-- Left: camera actions -->
              <div class="d-flex gap-2 flex-wrap">
                <button v-if="!streaming && !capturedDataUrl" class="ctrl-btn" @click="startCamera">
                  <i class="bi bi-play-fill me-1"></i>Start
                </button>
                <button v-if="streaming" class="ctrl-btn" @click="stopCamera">
                  <i class="bi bi-stop-fill me-1"></i>Stop
                </button>
                <button v-if="streaming && hasMultipleCams" class="ctrl-btn" @click="switchCamera" :disabled="switching">
                  <i class="bi bi-arrow-repeat me-1"></i>{{ switching ? '...' : 'Flip' }}
                </button>
                <button v-if="capturedDataUrl" class="ctrl-btn" @click="retake">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Retake
                </button>
              </div>

              <!-- Center: capture button -->
              <div class="d-flex align-items-center justify-content-center" style="flex:1;">
                <div v-if="streaming && !capturedDataUrl" class="capture-ring" @click="triggerCapture" :style="countdown > 0 ? 'opacity:.5;cursor:default' : ''">
                  <div class="capture-btn"><i class="bi bi-camera-fill"></i></div>
                </div>
              </div>

              <!-- Right: timer -->
              <div class="d-flex align-items-center gap-1" v-if="streaming && !capturedDataUrl">
                <span style="font-size:.75rem;color:var(--text-muted);">Timer:</span>
                <button v-for="t in [0,3,5,10]" :key="t" class="ctrl-btn" :class="{ active: timerSec===t }" @click="timerSec=t" style="padding:.25rem .55rem;min-width:32px;">
                  {{ t }}s
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload / Preview Panel -->
        <div class="col-lg-5 d-flex flex-column gap-4">
          <!-- Live info -->
          <div v-if="streaming && !capturedDataUrl" class="sc-card p-4 afu">
            <h6 class="text-accent mb-3"><i class="bi bi-info-circle me-2"></i>Camera Info</h6>
            <div class="d-flex flex-column gap-2" style="font-size:.85rem;color:var(--text-muted);">
              <div><i class="bi bi-camera me-2 text-accent"></i>{{ currentFacingMode === 'user' ? 'Front Camera' : 'Back Camera' }}</div>
              <div v-if="hasMultipleCams"><i class="bi bi-arrow-repeat me-2 text-accent"></i>Multiple cameras available — tap Flip to switch</div>
              <div><i class="bi bi-clock me-2 text-accent"></i>Timer set to {{ timerSec }}s countdown</div>
            </div>
            <div class="mt-3 p-3 rounded-3" style="background:rgba(245,166,35,.06);border:1px dashed rgba(245,166,35,.2);text-align:center;font-size:.85rem;color:var(--text-muted);">
              <i class="bi bi-camera-fill d-block mb-1 text-accent" style="font-size:2rem;"></i>
              Click the capture button to take a photo
            </div>
          </div>

          <!-- Upload form (shown after capture) -->
          <div v-if="capturedDataUrl" class="sc-card p-4 afu">
            <h6 class="text-accent mb-3"><i class="bi bi-upload me-2"></i>Save to Gallery</h6>

            <!-- Preview thumbnail -->
            <div class="rounded-3 overflow-hidden mb-3" style="aspect-ratio:4/3;">
              <img :src="capturedDataUrl" class="preview-img" alt="Captured snapshot" />
            </div>

            <!-- Form -->
            <form class="sc-form" @submit.prevent="uploadImage">
              <div class="mb-3">
                <label class="form-label">Your Name</label>
                <div class="input-group">
                  <span class="input-group-text" style="background:rgba(255,255,255,.05);border-color:var(--border);">
                    <i class="bi bi-person text-accent"></i>
                  </span>
                  <input v-model="userName" type="text" class="form-control" placeholder="Enter your name" maxlength="50" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Photo Title</label>
                <input v-model="photoTitle" type="text" class="form-control" placeholder="e.g. Smile Selfie" maxlength="60" />
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn-accent flex-grow-1" :disabled="uploading">
                  <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-cloud-upload me-2"></i>
                  {{ uploading ? 'Saving...' : 'Save to Gallery' }}
                </button>
                <button type="button" class="btn-ghost" @click="downloadCaptured" title="Download">
                  <i class="bi bi-download"></i>
                </button>
              </div>
            </form>
          </div>

          <!-- Tips -->
          <div class="sc-card p-4">
            <h6 class="text-accent mb-3"><i class="bi bi-lightbulb me-2"></i>Tips</h6>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.5rem;">
              <li v-for="tip in tips" :key="tip" style="display:flex;gap:.5rem;font-size:.82rem;color:var(--text-muted);">
                <i class="bi bi-check-circle-fill text-accent mt-1" style="flex-shrink:0;font-size:.75rem;"></i>{{ tip }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api.js'

const router = useRouter()

// ── Refs ──
const videoEl = ref(null)
const canvasEl = ref(null)
const streaming = ref(false)
const capturedDataUrl = ref('')
const uploading = ref(false)
const switching = ref(false)
const countdown = ref(0)
const timerSec = ref(3)
const userName = ref('')
const photoTitle = ref('My Capture')
const currentFacingMode = ref('user')
const hasMultipleCams = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

let stream = null
let countdownTimer = null

const tips = [
  'Allow camera permissions when the browser asks.',
  'Use front camera for selfies, back for wider shots.',
  'Set a 3–5s timer for hands-free captures.',
  'Enter your name before saving to identify photos.',
  'Download captures before navigating away.',
]

// ── Camera ──
async function startCamera(facingMode = 'user') {
  errorMsg.value = ''
  currentFacingMode.value = facingMode
  try {
    if (stream) stream.getTracks().forEach(t => t.stop())
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    })
    videoEl.value.srcObject = stream
    streaming.value = true
    capturedDataUrl.value = ''

    // Check for multiple cameras
    const devices = await navigator.mediaDevices.enumerateDevices()
    hasMultipleCams.value = devices.filter(d => d.kind === 'videoinput').length > 1
  } catch (err) {
    errorMsg.value = `Camera error: ${err.message}. Ensure camera permissions are granted.`
  }
}

async function switchCamera() {
  switching.value = true
  const next = currentFacingMode.value === 'user' ? 'environment' : 'user'
  await startCamera(next)
  switching.value = false
}

function stopCamera() {
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null }
  streaming.value = false
  countdown.value = 0
  clearInterval(countdownTimer)
}

// ── Capture ──
function triggerCapture() {
  if (countdown.value > 0) return
  if (timerSec.value === 0) { takePhoto(); return }
  countdown.value = timerSec.value
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) { clearInterval(countdownTimer); takePhoto() }
  }, 1000)
}

function takePhoto() {
  const video = videoEl.value
  const canvas = canvasEl.value
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  // Mirror if front camera
  if (currentFacingMode.value === 'user') {
    ctx.save(); ctx.scale(-1, 1); ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); ctx.restore()
  } else {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }
  capturedDataUrl.value = canvas.toDataURL('image/jpeg', 0.92)
  stopCamera()
}

function retake() {
  capturedDataUrl.value = ''
  countdown.value = 0
  startCamera(currentFacingMode.value)
}

// ── Upload ──
async function uploadImage() {
  if (!capturedDataUrl.value) return
  uploading.value = true
  errorMsg.value = ''
  try {
    const blob = await (await fetch(capturedDataUrl.value)).blob()
    const result = await api.uploadImage(blob, userName.value || 'Anonymous', photoTitle.value || 'My Capture')
    successMsg.value = `✓ Photo saved! (${result.image.filename.slice(0, 16)}…) — View it in the Gallery.`
    capturedDataUrl.value = ''
    setTimeout(() => router.push('/gallery'), 1800)
  } catch (err) {
    errorMsg.value = `Upload failed: ${err.message}`
  } finally {
    uploading.value = false
  }
}

// ── Download ──
function downloadCaptured() {
  if (!capturedDataUrl.value) return
  const a = document.createElement('a')
  a.download = `snapcapture-${Date.now()}.jpg`
  a.href = capturedDataUrl.value
  a.click()
}

onBeforeUnmount(() => stopCamera())
</script>
