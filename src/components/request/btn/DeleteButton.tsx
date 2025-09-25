"use client";

import { Button } from "../../ui/button";
import type { ButtonProps } from "../../ui/button";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";

type ButtonVariant = ButtonProps["variant"];

type RequestDeleteButtonProps = {
  variant?: ButtonVariant;
  requestId: string;
  className?: string;
};

export default function RequestDeleteButton(props: RequestDeleteButtonProps) {
  const { variant, requestId, className } = props;

  const router = useRouter();

  const handleDelete = async () => {
    await axiosInstance.delete(`/api/v1/requests/${requestId}`);
    router.push("/dashboard/view-requests");
  };

  return (
    <Button variant={variant} className={className} onClick={handleDelete}>
      Delete Request
    </Button>
  );
}
