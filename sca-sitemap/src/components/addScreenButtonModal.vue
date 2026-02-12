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
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#addScreen"
  >
    Add Screen
  </button>

  <!-- Add Screen Modal -->
  <div
    class="modal fade"
    id="addScreen"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <form @submit.prevent="submitForm">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Add Screen
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Alpha</label
              >
              <input
                v-model="form.alpha"
                type="text"
                class="form-control"
                id="exampleFormControlInput1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Screen Number</label
              >
              <input
                v-model.number="form.screen_number"
                type="number"
                class="form-control"
                id="exampleFormControlInput1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Screen Type</label
              >
              <input
                v-model="form.screen_type"
                type="text"
                class="form-control"
                id="exampleFormControlInput1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Screen Description</label
              >
              <input
                v-model="form.screen_description"
                type="text"
                class="form-control"
                id="exampleFormControlInput1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >File Label</label
              >
              <input
                v-model="form.file_label"
                type="text"
                class="form-control"
                id="exampleFormControlInput1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Screen Label</label
              >
              <input
                v-model="form.screen_label"
                type="text"
                class="form-control"
                id="exampleFormControlInput1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Notes</label
              >
              <textarea
                v-model="form.notes"
                type="text"
                class="form-control"
                id="exampleFormControlInput1"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Sitemap</label
              >
              <textarea
                v-model="form.sitemap"
                type="text"
                class="form-control"
                id="exampleFormControlInput1"
              ></textarea>
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
            <button type="submit" class="btn btn-success">Add Screen</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
