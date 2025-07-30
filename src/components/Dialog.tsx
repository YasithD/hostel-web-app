import { cn } from "@/lib/utils";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  dialogClassName?: string;
  className?: string;
};

export default function Dialog(props: PropsWithChildren<DialogProps>) {
  const { show, setShow, children, dialogClassName, className } = props;

  useEffect(() => {
    setShow(show);
  }, [show]);

  const closeDialog = () => {
    setShow(false);
  };

  return (
    <>
      {show &&
        createPortal(
          <>
            <div className={cn("absolute inset-0 bg-black/50", dialogClassName)} onClick={closeDialog} />
            <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", className)}>
              {children}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
