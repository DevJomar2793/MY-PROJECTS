<script setup>
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="input-group search-input-group">
    <span class="input-group-text bg-white border-end-0" style="border-color: #e2e8f0;">
      <i class="bi bi-search text-muted"></i>
    </span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="form-control border-start-0"
      type="search"
      placeholder="Search screens..."
      aria-label="Search"
      style="border-color: #e2e8f0;"
    />
    <button class="btn btn-accent" type="button">
      Search
    </button>
  </div>
</template>
