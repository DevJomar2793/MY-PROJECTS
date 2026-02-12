<script setup>
import { ref, onMounted } from "vue";

// props and emits
defineProps({
  pages: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["updatePage"]);

//Local edit State
const selectedId = ref(null);

const form = ref({
  alpha: "",
  screen_number: null,
  screen_type: "",
  screen_description: "",
  file_label: "",
  screen_label: "",
  notes: "",
  sitemap: "",
});

//open edit modal
function openEdit(page) {
  selectedId.value = page.id;
  form.value = {
    alpha: page.alpha,
    screen_number: page.screen_number,
    screen_type: page.screen_type,
    screen_description: page.screen_description,
    file_label: page.file_label,
    screen_label: page.screen_label,
    notes: page.notes,
    sitemap: page.sitemap,
  };
}

//Update Data
async function updatePage() {
  const payload = {
    alpha: form.value.alpha ?? "",
    screen_number: form.value.screen_number ?? null,
    screen_type: form.value.screen_type ?? "",
    screen_description: form.value.screen_description ?? "",
    file_label: form.value.file_label ?? "",
    screen_label: form.value.screen_label ?? "",
    notes: form.value.notes ?? "",
    sitemap: form.value.sitemap ?? "",
  };

  const res = await fetch(
    `http://127.0.0.1:8000/api/v1/UpdateBuyerScreen/${selectedId.value}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    console.error(await res.json());
    return;
  }
  emit("updatePage");

  //close Modal
  document.getElementById("editModalClose").click();
}

// DateTime Function
function formatDate(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleString() : "N/A";
}
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header">Recent Added</div>
    <div class="card-body">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Alpha</th>
            <th>Screen Number</th>
            <th>File Label</th>
            <th>Screen Description</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="page in pages" :key="page.id">
            <td>{{ page.id }}</td>
            <td>{{ page.alpha }}</td>
            <td>{{ page.screen_number }}</td>
            <td>{{ page.file_label }}</td>
            <td>{{ page.screen_description }}</td>
            <td>{{ formatDate(page.created_at) }}</td>
            <td>
              <div class="d-flex justify-content-start gap-2">
                <button
                  @click="openEdit(page)"
                  type="button"
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#updateScreen"
                >
                  Edit
                </button>
                <button type="button" class="btn btn-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Edit Screen Modal -->
  <div
    class="modal fade"
    id="updateScreen"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <form>
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Update Screen
            </h1>
            <button
              id="editModalClose"
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
              id="editModalClose"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              @click.prevent="updatePage"
              type="button"
              class="btn btn-success"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
