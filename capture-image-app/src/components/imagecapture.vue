<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import { Modal } from "bootstrap";

const templateImage = new URL("../imagetemplates/strip2.png", import.meta.url)
  .href;

const video = ref(null);
const canvas = ref(null);
const selectedTemplate = ref(null);
const image = ref(null);
const submitModalRef = ref(null);
const finalImageRef = ref(null);
const finalImageData = ref(null);
const savingImage = ref(false);
const filenameInput = ref("");
const finalFilenameRef = ref(null);
let stream = null;

const cameraActive = ref(false);
const showTemplateModal = ref(false);
const captured = ref(false);
const loading = ref(false);

// Toast notification system
const toastMessage = ref("");
const toastType = ref("info");
const showToast = ref(false);

const showNotification = (message, type = "info", duration = 3000) => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  if (duration > 0) {
    setTimeout(() => {
      showToast.value = false;
    }, duration);
  }
};

let modalInstance = null;
let finalImageModalInstance = null;

//Multiple Image Handler
const props = defineProps({
  imageList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["remove", "add", "clear", "save-image"]);

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
    showNotification("Camera access denied or unavailable", "error");
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
  // const TARGET_WIDTH = 350;
  // const TARGET_HEIGHT = 280; // 3:4 vertical photo style

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
  showNotification("Image saved to list", "success");
};

// Retake photo
const retake = () => {
  captured.value = false;
  image.value = null;
};

const checkCapturedImage = () => {
  if (props.imageList.length === 0) {
    showNotification("No images found", "warning");
    return;
  }
  const modal = new Modal(document.getElementById("imageList"));
  modal.show();
};

const checkTemplate = (templatePath) => {
  selectedTemplate.value = templatePath;
  showTemplateModal.value = false;

  const modal = new Modal(document.getElementById("templateList"));
  modal.show();
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    if (!props.imageList || props.imageList.length === 0) {
      showNotification("No images found", "warning");
      loading.value = false;
      return;
    }

    // Wrap the entire image generation in a promise
    await new Promise((resolve, reject) => {
      const canvas = finalCanvas.value;
      const ctx = canvas.getContext("2d");

      //final strip size
      const TEMPLATE_WIDTH = 1024;
      const TEMPLATE_HEIGHT = 1536;
      const photoImages = props.imageList;
      canvas.width = TEMPLATE_WIDTH;
      canvas.height = TEMPLATE_HEIGHT;

      //Load template background
      const template = new Image();
      template.crossOrigin = "anonymous"; // Handle CORS if template is from a different origin

      template.onload = async () => {
        try {
          ctx.drawImage(template, 0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);

          //Photo Settings
          const photoWidth = 375;
          const photoHeight = 347;
          const startX = (TEMPLATE_WIDTH - photoWidth) / 2;
          const startY = 20;
          const spacing = 40;

          for (let i = 0; i < photoImages.length && i < 4; i++) {
            if (!photoImages[i]) break;

            const img = new Image();
            img.src = photoImages[i];

            await new Promise((resolveImg) => {
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
                resolveImg();
              };
              img.onerror = () => {
                console.error(`Failed to load image ${i}`);
                resolveImg();
              };
            });
          }

          //Convert to Image
          const finalImage = canvas.toDataURL("image/png");
          finalImageData.value = finalImage; // Store in ref
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      template.onerror = () => {
        showNotification(
          "Template image failed to load. Check file path.",
          "error",
        );
        reject(new Error("Template image failed to load. Check file path."));
      };
      template.src = selectedTemplate.value || templateImage; // Set template source after defining onload and onerror
    });

    // Remove all backdrops and modal-open class
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";

    // Hide and dispose of the modal
    if (modalInstance) {
      modalInstance.hide();
    }

    // Show final image modal
    setTimeout(() => {
      if (!finalImageModalInstance) {
        finalImageModalInstance = new Modal(
          document.getElementById("finalImageModal"),
          { backdrop: false },
        );
      }
      finalImageModalInstance.show();
    }, 100);
  } catch (error) {
    console.error(error);
    showNotification("Error: " + error.message, "error");
  } finally {
    loading.value = false;
  }
};

//Film Strip Template Using Canvas
const finalCanvas = ref(null);

// const generateFinalImage = async () => {
//   if (!props.imageList || props.imageList.length === 0) {
//     showNotification("No images found", "warning");
//     return;
//   }

//   const canvas = finalCanvas.value;
//   const ctx = canvas.getContext("2d");

//   //final strip size
//   const TEMPLATE_WIDTH = 1024;
//   const TEMPLATE_HEIGHT = 1536;
//   const photoImages = props.imageList;
//   canvas.width = TEMPLATE_WIDTH;

//   canvas.height = TEMPLATE_HEIGHT;

//   //Load template background
//   const templateImg = new Image();
//   templateImg.src = "@/imagetemplates/strip2.png"; //(1026 x 1536)

//   templateImg.onload = async () => {
//     ctx.drawImage(templateImg, 0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);

//     //Photo Settings
//     const photoWidth = 375;
//     const photoHeight = 347;
//     const startX = (TEMPLATE_WIDTH - photoWidth) / 2;
//     const startY = 20;
//     const spacing = 40;

//     for (let i = 0; i < photoImages.length && i < 4; i++) {
//       if (!photoImages[i]) break;

//       const img = new Image();
//       img.src = photoImages[i];

//       await new Promise((resolve) => {
//         img.onload = () => {
//           //CENTER CROP
//           const imgSize = Math.min(img.width, img.height);
//           const sx = (img.width - imgSize) / 2;
//           const sy = (img.height - imgSize) / 2;

//           ctx.drawImage(
//             img,
//             sx,
//             sy,
//             imgSize,
//             imgSize,
//             startX,
//             startY + i * (photoHeight + spacing),
//             photoWidth,
//             photoHeight,
//           );
//           resolve();
//         };
//       });
//     }

//     console.log("My Image:", canvas.toDataURL("image/png"));

//     //Convert to Image
//     // const finalImage = canvas.toDataURL("image/png");

//     //Auto Download
//     // const link = document.createElement("a");
//     // link.href = finalImage;
//     // link.download = "testing-image.png";
//     // link.click();
//   };

//   templateImg.onerror = () => {
//     showNotification(
//       "Template image failed to load. Check file path.",
//       "error",
//     );
//   };
// };

const saveImageToDatabase = () => {
  if (!finalImageData.value) {
    showNotification("No image to save", "warning");
    return;
  }

  const rawName = (filenameInput.value || "").trim();
  if (!rawName) {
    showNotification("Please enter a filename before saving.", "warning");
    return;
  }

  const sanitizeFilename = (name) => {
    // replace spaces with dashes, remove unsafe chars, limit length
    let n = name.replace(/\s+/g, "-");
    n = n.replace(/[^a-zA-Z0-9_\-\.]/g, "");
    if (!/\.(png|jpg|jpeg)$/i.test(n)) n = n + ".png";
    return n.slice(0, 200);
  };

  const filename = sanitizeFilename(rawName);

  savingImage.value = true;

  // Emit the image data and filename to parent component
  emit("save-image", finalImageData.value, filename);

  // Close modal after a short delay to allow parent to process
  setTimeout(() => {
    if (finalImageModalInstance) {
      finalImageModalInstance.hide();
    }
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    finalImageData.value = null;
    filenameInput.value = "";
    savingImage.value = false;
  }, 500);
};

onMounted(() => {
  if (submitModalRef.value) {
    modalInstance = new Modal(submitModalRef.value, { backdrop: false });
  }
  if (finalImageRef.value) {
    finalImageModalInstance = new Modal(finalImageRef.value, {
      backdrop: false,
    });
  }
  // focus filename input when final image modal is shown
  if (finalImageRef.value) {
    finalImageRef.value.addEventListener("shown.bs.modal", () => {
      setTimeout(() => {
        try {
          if (finalFilenameRef.value && finalFilenameRef.value.focus) {
            finalFilenameRef.value.focus();
          }
        } catch (e) {
          // ignore
        }
      }, 120);
    });
  }
});

// Stop camera when leaving page
onBeforeUnmount(() => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
});
</script>
<template>
  <div class="capture-root container py-3">
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex align-items-start gap-3 flex-column flex-md-row">
          <div class="media-col flex-fill">
            <h5 class="mb-2">Capture</h5>

            <div
              class="preview rounded overflow-hidden bg-dark position-relative"
              aria-live="polite"
            >
              <video
                ref="video"
                autoplay
                playsinline
                class="w-100 h-100 object-fit-cover"
                v-show="!captured"
                aria-label="Live camera preview"
              ></video>

              <img
                v-if="captured"
                :src="image"
                class="w-100 h-100 object-fit-contain"
                alt="Captured photo preview"
              />
            </div>

            <canvas ref="canvas" class="d-none" aria-hidden="true"></canvas>

            <div
              class="mt-3 d-flex gap-2 flex-wrap controls"
              role="toolbar"
              aria-label="Capture controls"
            >
              <button
                class="btn btn-outline-primary"
                @click="startCamera"
                v-if="!cameraActive"
                aria-label="Open camera"
              >
                Open Camera
              </button>

              <button
                class="btn btn-success"
                @click="captureImage"
                v-if="cameraActive && !captured"
                aria-label="Take photo"
              >
                Capture
              </button>

              <button
                class="btn btn-warning"
                @click="saveImage"
                v-if="captured"
                aria-label="Save captured photo"
              >
                Save
              </button>

              <button
                class="btn btn-secondary"
                @click="retake"
                v-if="captured"
                aria-label="Retake photo"
              >
                Retake
              </button>

              <button
                class="btn btn-danger ms-auto"
                @click="closeCamera"
                v-if="cameraActive"
                aria-label="Close camera"
              >
                Close
              </button>
            </div>
          </div>

          <div class="thumbs-col" aria-label="Captured thumbnails">
            <h6 class="mb-2">Thumbnails</h6>
            <div class="thumb-strip d-flex gap-2" role="list">
              <div
                v-for="(img, idx) in props.imageList"
                :key="idx"
                class="thumb-item"
                role="listitem"
              >
                <button
                  class="thumb-btn"
                  @click="emit('remove', idx)"
                  aria-label="Remove image"
                >
                  ×
                </button>
                <img
                  :src="img"
                  :alt="`Thumbnail ${idx + 1}`"
                  class="thumb-img"
                />
              </div>
              <div
                v-if="props.imageList.length === 0"
                class="empty-thumb text-muted small"
              >
                No images yet
              </div>
            </div>

            <div class="mt-3">
              <button
                class="btn btn-outline-primary w-100"
                @click="checkCapturedImage"
                :disabled="props.imageList.length === 0"
              >
                View Image List
              </button>

              <button
                class="btn btn-primary w-100 mt-2"
                @click="checkTemplate"
                :disabled="props.imageList.length === 0"
              >
                Check Template
              </button>
            </div>
          </div>
        </div>

        <div class="mt-3 text-end apply-row">
          <button
            class="btn btn-primary apply-btn"
            @click="
              () => {
                if (!modalInstance)
                  modalInstance = new Modal(submitModalRef.value, {
                    backdrop: false,
                  });
                modalInstance.show();
              }
            "
            :disabled="loading || props.imageList.length === 0"
            aria-label="Apply template and generate"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>

    <router-link>Go To Dashboard -></router-link>>

    <canvas ref="finalCanvas" style="display: none" aria-hidden="true"></canvas>

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
              <div v-for="(img, index) in props.imageList" :key="index">
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
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Selecting Template-->
    <div
      class="modal fade"
      id="templateList"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Template</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <img :src="templateImage" @click="checkTemplate(templateImage)" />
            <!-- <img
              src="/src/imagetemplates/strip2.png"
              @click="selectedTemplate('/templates/strip1.png')"
            /> -->
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <!-- <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#spinnerLoading"
            >
              Apply Template
            </button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Spinner Loading Modal-->
    <div
      class="modal fade"
      id="spinnerLoading"
      tabindex="-1"
      ref="submitModalRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Message</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <p>Apply Template on your image?</p>
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-primary"
              @click="handleSubmit"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>

              {{ loading ? "Processing..." : "Yes" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Final Image Modal-->
    <div
      class="modal fade"
      id="finalImageModal"
      tabindex="-1"
      ref="finalImageRef"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Your Photo Strip</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body text-center">
            <div class="mb-3 text-start">
              <label for="finalFilename" class="form-label">Filename</label>
              <input
                id="finalFilename"
                ref="finalFilenameRef"
                v-model="filenameInput"
                class="form-control"
                placeholder="my-photo-strip.png"
                aria-label="Filename for final image"
              />
            </div>

            <img
              v-if="finalImageData"
              :src="finalImageData"
              class="img-fluid rounded"
              alt="Final photo strip"
            />
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="saveImageToDatabase"
              :disabled="savingImage"
            >
              <span
                v-if="savingImage"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ savingImage ? "Saving..." : "Save" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="showToast"
      class="position-fixed top-0 start-50 translate-middle-x p-3"
      style="z-index: 9999; margin-top: 20px"
    >
      <div
        :class="[
          'alert alert-dismissible fade show',
          toastType === 'error'
            ? 'alert-danger'
            : toastType === 'warning'
              ? 'alert-warning'
              : toastType === 'success'
                ? 'alert-success'
                : 'alert-info',
        ]"
        role="alert"
      >
        <span>{{ toastMessage }}</span>
        <button
          type="button"
          class="btn-close"
          @click="showToast = false"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>
