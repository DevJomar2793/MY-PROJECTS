<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit", "closeModal"]);

const form = ref({
  alpha: "",
  screen_number: null,
  screen_type: "",
  screen_decription: "",
  file_label: "",
  screen_label: "",
  notes: "",
  sitemap: "",
});

function submitForm() {
  emit("submit", { ...form.value });
}
</script>

<template>
  <!-- Button trigger modal -->
  <button
    type="button"
    class="btn btn-accent d-flex align-items-center gap-2"
    data-bs-toggle="modal"
    data-bs-target="#addScreen"
  >
    <i class="bi bi-plus-lg"></i>
    Add Screen
  </button>

  <!-- Add Screen Modal -->
  <div
    class="modal fade"
    id="addScreen"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="addScreenLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <form @submit.prevent="submitForm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addScreenLabel">
              <i class="bi bi-plus-circle me-2"></i>Add Screen
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    v-model="form.alpha"
                    type="text"
                    class="form-control"
                    id="addAlpha"
                    placeholder="Alpha"
                  />
                  <label for="addAlpha">Alpha</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    v-model.number="form.screen_number"
                    type="number"
                    class="form-control"
                    id="addScreenNumber"
                    placeholder="Screen Number"
                  />
                  <label for="addScreenNumber">Screen Number</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <input
                    v-model="form.screen_type"
                    type="text"
                    class="form-control"
                    id="addScreenType"
                    placeholder="Screen Type"
                  />
                  <label for="addScreenType">Screen Type</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <input
                    v-model="form.screen_description"
                    type="text"
                    class="form-control"
                    id="addScreenDesc"
                    placeholder="Screen Description"
                  />
                  <label for="addScreenDesc">Screen Description</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    v-model="form.file_label"
                    type="text"
                    class="form-control"
                    id="addFileLabel"
                    placeholder="File Label"
                  />
                  <label for="addFileLabel">File Label</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    v-model="form.screen_label"
                    type="text"
                    class="form-control"
                    id="addScreenLabel2"
                    placeholder="Screen Label"
                  />
                  <label for="addScreenLabel2">Screen Label</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <textarea
                    v-model="form.notes"
                    class="form-control"
                    id="addNotes"
                    placeholder="Notes"
                    style="height: 80px"
                  ></textarea>
                  <label for="addNotes">Notes</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <textarea
                    v-model="form.sitemap"
                    class="form-control"
                    id="addSitemap"
                    placeholder="Sitemap"
                    style="height: 80px"
                  ></textarea>
                  <label for="addSitemap">Sitemap</label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-accent">
              <i class="bi bi-plus-lg me-1"></i> Add Screen
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
