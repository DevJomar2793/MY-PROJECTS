"use client";

import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import type { Screen } from "../page";

export default function DeleteButton({
  item,
  onDelete,
}: {
  item: Screen;
  onDelete: (id: number) => Promise<void>;
}) {
  const handleDelete = () => {
    Swal.fire({
      title: "Delete Product",
      text: `Are you sure you want to delete screen ${item.screen_label}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#e2e8f0",
      cancelButtonText: "<span style='color: #475569'>Cancel</span>",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await onDelete(item.id);
          Swal.fire({
            title: "Deleted!",
            text: "Screen has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#3b82f6",
            timer: 3000,
            timerProgressBar: true,
          });
        } catch {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete screen. Is the backend running?",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    });
  };

  return (
    <button
      type="button"
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete"
      onClick={handleDelete}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
