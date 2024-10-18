import { Chip } from "@nextui-org/react";
import React from "react";

export default function StatusChip({ status, variant = "flat" }) {
  return (
    <Chip
      size="sm"
      variant={variant}
      className="capitalize"
      color={
        status === "active" ||
        status === "approved" ||
        status === "paid" ||
        status === "completed" ||
        status === "success" ||
        status === "closed"
          ? "success"
          : status === "unpaid" ||
            status === "cancelled" ||
            status === "rejected" ||
            status === "failed" ||
            status === "expired" ||
            status === "high" ||
            status == "suspended"
          ? "danger"
          : status === "pending" ||
            status === "processing" ||
            status === "pending payment" ||
            status === "pending approval" ||
            status === "medium"
          ? "warning"
          : status === "pending" || status == "in progress"
          ? "primary"
          : "default"
      }
    >
      {status}
    </Chip>
  );
}
