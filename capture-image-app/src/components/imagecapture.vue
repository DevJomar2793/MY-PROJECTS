<script setup>
import { ref, onBeforeUnmount } from "vue";
import { Modal } from "bootstrap";

const video = ref(null);
const canvas = ref(null);

const cameraActive = ref(false);
const showTemplateModal = ref(false);
const selectedTemplate = ref(null);
const captured = ref(false);
const image = ref(null);

let stream = null;

//Multiple Image Handler
const props = defineProps({
  imageList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["remove", "add", "clear"]);

// Start camera
const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1260 },
        height: { ideal: 960 }, // 4:3 ratio
      },
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
  const TARGET_WIDTH = 900;
  const TARGET_HEIGHT = 1200; // 3:4 vertical photo style

  canvas.value.width = TARGET_WIDTH;
  canvas.value.height = TARGET_HEIGHT;

  const videoWidth = video.value.videoWidth;
  const videoHeight = video.value.videoHeight;

  console.log("Captured width:", canvas.value.width);
  console.log("Captured height:", canvas.value.height);

  const size = Math.min(videoWidth, videoHeight);
  const sx = (videoWidth - size) / 2;
  const sy = (videoHeight - size) / 2;

  ctx.drawImage(
    video.value,
    sx,
    sy,
    size,
    size,
    0,
    0,
    TARGET_WIDTH,
    TARGET_HEIGHT,
  );

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

const checkCapturedImage = () => {
  if (props.imageList.length === 0) {
    alert("No Images Found");
    return;
  }
  const modal = new Modal(document.getElementById("imageList"));
  modal.show();
};

//Film Strip Template Using Canvas
const finalCanvas = ref(null);

const generateFinalImage = async () => {
  if (!props.imageList || props.imageList.length === 0) {
    alert("No Images Found");
    return;
  }

  const canvas = finalCanvas.value;
  const ctx = canvas.getContext("2d");

  //final strip size
  const TEMPLATE_WIDTH = 1024;
  const TEMPLATE_HEIGHT = 1536;
  const photoImages = props.imageList;
  canvas.width = TEMPLATE_WIDTH;

  canvas.height = TEMPLATE_HEIGHT;

  //Load template background
  const templateImg = new Image();
  templateImg.src = "/src/imagetemplates/strip2.png"; //(1026 x 1536)

  templateImg.onload = async () => {
    ctx.drawImage(templateImg, 0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);

    //Photo Settings
    const photoWidth = 800;
    const photoHeight = 200;
    const startX = (TEMPLATE_WIDTH - photoWidth) / 2;
    const startY = 120;
    const spacing = 80;

    for (let i = 0; i < photoImages.length && i < 4; i++) {
      if (!photoImages[i]) break;

      const img = new Image();
      img.src = photoImages[i];

      await new Promise((resolve) => {
        img.onload = () => {
          //CENTER CROP
          const imgSize = Math.min(img.width, img.height);
          const sx = (img.width - imgSize) / 2;
          const sy = (img.height - imgSize) / 2;

          ctx.drawImage(
            img,
            sx,
            sy,
            imgSize,
            imgSize,
            startX,
            startY + i * (photoHeight + spacing),
            photoWidth,
            photoHeight,
          );
          resolve();
        };
      });
    }

    //Convert to Image
    const finalImage = canvas.toDataURL("image/png");

    //Auto Download
    const link = document.createElement("a");
    link.href = finalImage;
    link.download = "testing-image.png";
    link.click();
  };

  templateImg.onerror = () => {
    alert("Template image failed to load. Check file path.");
  };
};

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
                @click="checkCapturedImage"
                v-if="cameraActive && !captured"
              >
                Check Captured Images
              </button>

              <button
                type="button"
                @click="generateFinalImage"
                class="btn btn-secondary"
                v-if="cameraActive && !captured"
              >
                Check With Film Strip
              </button>
              <button
                class="btn btn-danger"
                @click="closeCamera"
                v-if="cameraActive && !captured"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden Canvas -->
    <canvas ref="finalCanvas" style="display: none"></canvas>

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
              Image List
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
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Selecting Template-->
    <!-- <div
      class="modal fade"
      id="templateList"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Template List
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <img
              src="/src/imagetemplates/strip2.png"
              @click="selectTemplate('/templates/strip2.png')"
            />
            <img
              src="/src/imagetemplates/strip2.png"
              @click="selectTemplate('/templates/strip1.png')"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">
              Choose Template
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
