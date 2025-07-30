"use client";

import { Button } from "../../ui/button";
import type { ButtonProps } from "../../ui/button";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";

type ButtonVariant = ButtonProps["variant"];

type RequestRejectButtonProps = {
  variant?: ButtonVariant;
  requestId: string;
  className?: string;
};

export default function RequestRejectButton(props: RequestRejectButtonProps) {
  const { variant, requestId, className } = props;

  const router = useRouter();

  const handleReject = async () => {
    await axiosInstance.put(`/api/requests/${requestId}`, { status: "rejected" });
    router.push("/admin-dashboard");
  };

  return (
    <Button variant={variant} className={className} onClick={handleReject}>
      Reject Request
    </Button>
  );
}
