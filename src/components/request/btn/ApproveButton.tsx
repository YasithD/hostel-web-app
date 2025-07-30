"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import type { ButtonProps } from "../../ui/button";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import Dialog from "../../Dialog";
import HostelAllocationView from "../../Hostel/HostelAllocationView";
import { cn } from "@/lib/utils";

type ButtonVariant = ButtonProps["variant"];

type RequestApproveButtonProps = {
  variant?: ButtonVariant;
  requestId: string;
  btnClassName?: string;
  dialogClassName?: string;
};

export default function RequestApproveButton(props: RequestApproveButtonProps) {
  const { variant, requestId, btnClassName, dialogClassName } = props;
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const router = useRouter();

  const handleApprove = async () => {
    await axiosInstance.put(`/api/requests/${requestId}`, { status: "approved" });
    router.push("/admin-dashboard");
  };

  const openDialog = () => {
    setShowDialog(true);
  };

  return (
    <>
      <Button variant={variant} className={btnClassName} onClick={openDialog}>
        Approve Request
      </Button>
      <Dialog
        className="hidden md:block"
        dialogClassName={cn("hidden md:block", dialogClassName)}
        show={showDialog}
        setShow={setShowDialog}
      >
        <HostelAllocationView requestId={requestId} />
      </Dialog>
    </>
  );
}
