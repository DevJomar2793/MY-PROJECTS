<script setup>
import { ref, computed } from "vue";
import Swal from 'sweetalert2';

// props and emits
const props = defineProps({
  pages: {
    type: Array,
    required: true,
  },
  searchQuery: {
    type: String,
    default: "",
  },
});

// Sorting state
const sortKey = ref("id");
const sortOrder = ref("desc");

function toggleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
}

function sortIcon(key) {
  if (sortKey.value !== key) return "bi-arrow-down-up";
  return sortOrder.value === "asc" ? "bi-sort-up" : "bi-sort-down";
}

const sortedPages = computed(() => {
  let result = [...props.pages];

  if (props.searchQuery) {
    const q = props.searchQuery.toLowerCase();
    result = result.filter((page) => {
      return (
        String(page.id || "").toLowerCase().includes(q) ||
        String(page.alpha || "").toLowerCase().includes(q) ||
        String(page.screen_number || "").toLowerCase().includes(q) ||
        String(page.file_label || "").toLowerCase().includes(q) ||
        String(page.screen_description || "").toLowerCase().includes(q) ||
        formatDate(page.created_at).toLowerCase().includes(q)
      );
    });
  }

  const key = sortKey.value;
  const order = sortOrder.value === "asc" ? 1 : -1;
  return result.sort((a, b) => {
    const aVal = a[key] ?? "";
    const bVal = b[key] ?? "";
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * order;
    }
    return String(aVal).localeCompare(String(bVal)) * order;
  });
});

const emit = defineEmits(["updatePage"]);

// Detail view state
const viewPage = ref(null);

function openView(page) {
  viewPage.value = page;
}

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

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/v1/UpdateScreen/${selectedId.value}`,
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update data',
      });
      return;
    }
    
    emit("updatePage");

    //close Modal
    document.getElementById("editModalClose").click();
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Data updated successfully!',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while updating',
    });
  }
}

// Delete Data
async function deletePage(id) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/DeleteScreen/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Data has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
        emit("updatePage");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete data",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting",
      });
    }
  }
}

// DateTime Function
function formatDate(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleString() : "N/A";
}
</script>

<template>
  <div class="card data-card">
    <div class="card-header">
      <i class="bi bi-clock-history"></i>
      Recent Added
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <!-- <th class="sortable-th" @click="toggleSort('id')">
                ID <i class="bi" :class="sortIcon('id')"></i>
              </th> -->
              <th class="sortable-th" @click="toggleSort('screen_number')">
                Screen Number <i class="bi" :class="sortIcon('screen_number')"></i>
              </th>
              <th class="sortable-th" @click="toggleSort('alpha')">
                Screen Label <i class="bi" :class="sortIcon('alpha')"></i>
              </th>
              <th class="sortable-th" @click="toggleSort('file_label')">
                Screen Description <i class="bi" :class="sortIcon('file_label')"></i>
              </th>
              <th class="sortable-th" @click="toggleSort('screen_description')">
                File Label <i class="bi" :class="sortIcon('screen_description')"></i>
              </th>
              <th class="sortable-th" @click="toggleSort('created_at')">
                Created At <i class="bi" :class="sortIcon('created_at')"></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in sortedPages" :key="page.id">
              <!-- <td class="fw-semibold">#{{ page.id }}</td> -->
              <td>{{ page.screen_number }}</td>
              <td>
                <button
                  @click="openView(page)"
                  type="button"
                  class="btn btn-link p-0 text-decoration-none fw-semibold screen-label-link"
                  data-bs-toggle="modal"
                  data-bs-target="#viewScreen"
                >
                  <span class="badge-alpha">{{ page.screen_label || '—' }}</span>
                  <!-- <i class="bi bi-box-arrow-up-right ms-1 small"></i> -->
                </button>
              </td>
              
              <td>{{ page.screen_description }}</td>
              <td>{{ page.file_label }}</td>
              <td class="text-muted">{{ formatDate(page.created_at) }}</td>
              <td>
                <div class="d-flex gap-1">
                  <button
                    @click="openEdit(page)"
                    type="button"
                    class="btn btn-outline-primary btn-action"
                    data-bs-toggle="modal"
                    data-bs-target="#updateScreen"
                  >
                    <i class="bi bi-pencil-square"></i> Edit
                  </button>
                  <button @click="deletePage(page.id)" type="button" class="btn btn-outline-danger btn-action">
                    <i class="bi bi-trash"></i> Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="pages.length === 0">
              <td colspan="7" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                No screens found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Edit Screen Modal -->
  <div
    class="modal fade"
    id="updateScreen"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="editScreenLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <form @submit.prevent="updatePage">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editScreenLabel">
              <i class="bi bi-pencil-square me-2"></i>Update Screen
            </h5>
            <button
              id="editModalClose"
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
                    id="editAlpha"
                    placeholder="Alpha"
                  />
                  <label for="editAlpha">Alpha</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    v-model.number="form.screen_number"
                    type="number"
                    class="form-control"
                    id="editScreenNumber"
                    placeholder="Screen Number"
                  />
                  <label for="editScreenNumber">Screen Number</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <input
                    v-model="form.screen_type"
                    type="text"
                    class="form-control"
                    id="editScreenType"
                    placeholder="Screen Type"
                  />
                  <label for="editScreenType">Screen Type</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <input
                    v-model="form.screen_description"
                    type="text"
                    class="form-control"
                    id="editScreenDesc"
                    placeholder="Screen Description"
                  />
                  <label for="editScreenDesc">Screen Description</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    v-model="form.file_label"
                    type="text"
                    class="form-control"
                    id="editFileLabel"
                    placeholder="File Label"
                  />
                  <label for="editFileLabel">File Label</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    v-model="form.screen_label"
                    type="text"
                    class="form-control"
                    id="editScreenLabel2"
                    placeholder="Screen Label"
                  />
                  <label for="editScreenLabel2">Screen Label</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <textarea
                    v-model="form.notes"
                    class="form-control"
                    id="editNotes"
                    placeholder="Notes"
                    style="height: 80px"
                  ></textarea>
                  <label for="editNotes">Notes</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <textarea
                    v-model="form.sitemap"
                    class="form-control"
                    id="editSitemap"
                    placeholder="Sitemap"
                    style="height: 80px"
                  ></textarea>
                  <label for="editSitemap">Sitemap</label>
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
            <button
              type="submit"
              class="btn btn-accent"
            >
              <i class="bi bi-check-lg me-1"></i> Update
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <!-- View / Detail Screen Modal -->
  <div
    class="modal fade"
    id="viewScreen"
    tabindex="-1"
    aria-labelledby="viewScreenLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center gap-2" id="viewScreenLabel">
            <i class="bi bi-layout-text-window-reverse"></i>
            Screen Details
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="viewPage">
          <div class="row g-3">
            <!-- ID -->
            <!-- <div class="col-md-6">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-hash me-1"></i>ID</span>
                <span class="detail-value">#{{ viewPage.id }}</span>
              </div>
            </div> -->
            <!-- Alpha -->
            <div class="col-md-6">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-alphabet me-1"></i>Alpha</span>
                <span class="detail-value">{{ viewPage.alpha || '—' }}</span>
              </div>
            </div>
            <!-- Screen Number -->
            <div class="col-md-6">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-sort-numeric-down me-1"></i>Screen Number</span>
                <span class="detail-value">{{ viewPage.screen_number ?? '—' }}</span>
              </div>
            </div>
            <!-- Screen Type -->
            <div class="col-md-6">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-tag me-1"></i>Screen Type</span>
                <span class="detail-value">{{ viewPage.screen_type || '—' }}</span>
              </div>
            </div>
            <!-- Screen Label -->
            <div class="col-md-6">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-card-text me-1"></i>Screen Label</span>
                <span class="detail-value">{{ viewPage.screen_label || '—' }}</span>
              </div>
            </div>
            <!-- File Label -->
            <div class="col-md-6">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-file-earmark me-1"></i>File Label</span>
                <span class="detail-value">{{ viewPage.file_label || '—' }}</span>
              </div>
            </div>
            <!-- Screen Description -->
            <div class="col-12">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-text-paragraph me-1"></i>Screen Description</span>
                <span class="detail-value">{{ viewPage.screen_description || '—' }}</span>
              </div>
            </div>
            <!-- Notes -->
            <div class="col-12">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-journal-text me-1"></i>Notes</span>
                <span class="detail-value detail-multiline">{{ viewPage.notes || '—' }}</span>
              </div>
            </div>
            <!-- Sitemap -->
            <div class="col-12">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-diagram-3 me-1"></i>Sitemap</span>
                <span class="detail-value detail-multiline">{{ viewPage.sitemap || '—' }}</span>
              </div>
            </div>
            <!-- Created At -->
            <div class="col-12">
              <div class="detail-field">
                <span class="detail-label"><i class="bi bi-clock me-1"></i>Created At</span>
                <span class="detail-value text-muted">{{ formatDate(viewPage.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
          <button
            type="button"
            class="btn btn-accent"
            data-bs-dismiss="modal"
            @click="openEdit(viewPage)"
            data-bs-toggle="modal"
            data-bs-target="#updateScreen"
          >
            <i class="bi bi-pencil-square me-1"></i> Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen-label-link {
  cursor: pointer;
}
.screen-label-link:hover .badge-alpha {
  opacity: 0.8;
}
.detail-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  background: var(--bs-body-bg, #f8f9fa);
  border-radius: 8px;
  border: 1px solid var(--bs-border-color, #dee2e6);
}
.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--bs-secondary-color, #6c757d);
}
.detail-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--bs-body-color, #212529);
}
.detail-multiline {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
