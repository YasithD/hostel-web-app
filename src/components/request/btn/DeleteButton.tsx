"use client";

import { Button } from "../../ui/button";
import type { ButtonProps } from "../../ui/button";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

type ButtonVariant = ButtonProps["variant"];

type RequestDeleteButtonProps = {
  variant?: ButtonVariant;
  requestId: string;
  className?: string;
};

export default function RequestDeleteButton(props: RequestDeleteButtonProps) {
  const { variant, requestId, className } = props;

  const { getToken } = useAuth();
  const router = useRouter();

  const handleDelete = async () => {
    const token = await getToken();
    await axiosInstance.delete(`/api/v1/requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push("/dashboard/view-requests");
  };

  return (
    <Button variant={variant} className={className} onClick={handleDelete}>
      Delete Request
    </Button>
  );
}
