"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { throttle } from "lodash";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { ACCOUNT_ACTIVATION_STATUS } from "@/types/db";

type ActionConditionalProps =
  | {
      enableActions: boolean;
      userId: string;
    }
  | {
      enableActions?: never;
      userId?: never;
    };

type StatusProps = ActionConditionalProps & {
  status: "pending" | "approved" | "rejected" | "active" | "inactive";
};

export default function Status({ status, enableActions: enablePopup = false, userId }: StatusProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const updatePosition = throttle(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.top + rect.height,
        left: rect.left,
      });
    }
  }, 10);

  useEffect(() => {
    // Position polling to detect any position changes
    let lastPosition = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
    let animationFrameId: number;

    const checkPositionChange = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const currentPosition = {
        top: rect.top,
        bottom: window.innerHeight - rect.bottom,
        left: rect.left,
        right: window.innerWidth - rect.left,
        width: rect.width,
        height: rect.height,
      };

      // Check if position or size has changed
      if (
        currentPosition.top !== lastPosition.top ||
        currentPosition.bottom !== lastPosition.bottom ||
        currentPosition.left !== lastPosition.left ||
        currentPosition.right !== lastPosition.right ||
        currentPosition.width !== lastPosition.width ||
        currentPosition.height !== lastPosition.height
      ) {
        updatePosition();
        lastPosition = currentPosition;
      }

      // Continue polling
      animationFrameId = requestAnimationFrame(checkPositionChange);
    };

    // Start position polling
    animationFrameId = requestAnimationFrame(checkPositionChange);

    return () => {
      // Clean up
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;
      if (isPopupOpen && !targetEl.closest("[id^='status']")) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isPopupOpen]);

  const onActivate = async () => {
    await axiosInstance.put(`/api/users/${userId}`, {
      action: ACCOUNT_ACTIVATION_STATUS.ACTIVE,
    });
    setIsPopupOpen(false);
  };

  const onCancel = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "px-2 py-1 rounded-md text-center text-foreground-muted select-none",
          status === "pending" && "bg-warning",
          status === "approved" && "bg-success",
          status === "rejected" && "bg-danger",
          status === "active" && "bg-success",
          status === "inactive" && "bg-danger",
          enablePopup && "cursor-pointer relative"
        )}
        {...(enablePopup && { onClick: () => setIsPopupOpen(!isPopupOpen) })}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
      {enablePopup &&
        isPopupOpen &&
        status === "pending" &&
        createPortal(
          <div id="status-popup" className="fixed p-2 bg-background rounded-md shadow-md" style={popupPosition}>
            <p className="text-sm text-muted w-40">Do you wish to activate this account?</p>
            <div className="flex justify-end gap-2 mt-2">
              <div title="Cancel">
                <X
                  className="cursor-pointer p-1 rounded-full border border-secondary hover:bg-secondary hover:stroke-secondary-foreground"
                  size={24}
                  onClick={onCancel}
                />
              </div>
              <div title="Activate">
                <Check
                  className="cursor-pointer p-1 rounded-full border border-primary hover:bg-primary hover:stroke-primary-foreground"
                  size={24}
                  color="#6a1d19"
                  onClick={onActivate}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
