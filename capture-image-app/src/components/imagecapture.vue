<script setup>
import { ref, onBeforeUnmount } from "vue";

const video = ref(null);
const canvas = ref(null);

const cameraActive = ref(false);
const showTemplateModal = ref(false);
const captured = ref(false);
const image = ref(null);

let stream = null;

//Multiple Image Handler
const props = defineProps({
  imageList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["remove", "add", "clear"]);

// Start camera
const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });

    video.value.srcObject = stream;
    cameraActive.value = true;
  } catch (err) {
    alert("Camera access denied or unavailable");
    console.error(err);
  }
};

//Close Camera
const closeCamera = async () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  if (video.value) {
    video.value.srcObject = null;
  }

  cameraActive.value = false;

  //Cleat all images in parent
  emit("clear");
};

// Capture image
const captureImage = () => {
  const ctx = canvas.value.getContext("2d");

  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;

  ctx.drawImage(video.value, 0, 0);

  image.value = canvas.value.toDataURL("image/png");
  captured.value = true;
};

// Save image to list (MULTIPLE)
const saveImage = () => {
  emit("add", image.value); // send to parent
  captured.value = false;
  image.value = null;
};

// Retake photo
const retake = () => {
  captured.value = false;
  image.value = null;
};

//Film Strip Logic
const applyFilmStrip = async () => {
  const maxImages = props.imageList.length;

  for (let i = 0; i < maxImages; i++) {
    const styledImages = await createFilmStrip(props.imageList[i]);
    props.imageList[i] = styledImages;
  }
};

//Film Strip Template Using Canvass
// const createFilmStrip = (imgsrc) => {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.src = imgsrc;

//     img.onload = () => {
//       const padding = 40; // top & bottom film border
//       const holeSize = 10;

//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       canvas.width = img.width;
//       canvas.height = img.height + padding * 2;

//       //Background (black film)
//       ctx.fillStyle = "black";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       //Draw image in center
//       ctx.drawImage(img, 0, padding, img.width, img.height);

//       //draw sprocket holes (left & right)
//       ctx.fillStyle = "white";

//       for (let y = 10; y < canvas.height; y += 25) {
//         ctx.fillRect(5, y, holeSize, holeSize);
//         ctx.fillRect(canvas.width - 15, y, holeSize, holeSize);
//       }

//       resolve(canvas.toDataURL("image/png"));
//     };
//   });
// };

// Stop camera when leaving page
onBeforeUnmount(() => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
});
</script>

<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5 class="mb-3">📸 Capture Image</h5>

            <!-- Camera Preview -->
            <video
              ref="video"
              autoplay
              playsinline
              class="mb-3 w-100 rounded"
              v-show="!captured"
            ></video>

            <!-- Hidden Canvas -->
            <canvas ref="canvas" class="d-none"></canvas>

            <!-- Captured Image -->
            <img :src="image" class="w-100 rounded mb-3" v-if="captured" />

            <div class="d-grid gap-2">
              <button
                class="btn btn-primary"
                @click="startCamera"
                v-if="!cameraActive"
              >
                Open Camera
              </button>

              <button
                class="btn btn-success"
                @click="captureImage"
                v-if="cameraActive && !captured"
              >
                Capture
              </button>

              <button
                class="btn btn-danger"
                @click="closeCamera"
                v-if="cameraActive && !captured"
              >
                Close
              </button>

              <button
                class="btn btn-warning"
                @click="saveImage"
                v-if="captured"
              >
                Save
              </button>

              <button class="btn btn-secondary" @click="retake" v-if="captured">
                Retake
              </button>

              <!-- Button trigger modal -->
              <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#imageList"
                v-if="cameraActive && !captured"
              >
                Check Captured Images
              </button>

              <button
                type="button"
                class="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target="#"
                v-if="cameraActive && !captured"
              >
                Choose Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="imageList"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Modal title
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Handle Images -->
            <div class="row mt-3">
              <div v-for="(img, index) in imageList" :key="index">
                <div class="card mb-4" style="width: 18rem">
                  <img :src="img" alt="..." class="card-img-top" />
                  <div class="card-body p-2 text-center">
                    <button
                      class="btn btn-sm btn-danger"
                      @click="emit('remove', index)"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>

            <button type="button" class="btn btn-primary">Save Images</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Selecting Template-->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
