"use client";

import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { isCuid } from "@paralleldrive/cuid2";

export default function BreadcrumbView() {
  const pathname = usePathname();
  const pathItems = pathname.split("/").filter((item) => item !== "");
  const modifiedPathItems = pathItems.map((item) => {
    if (item === "dashboard") {
      return "Home";
    }

    if (isCuid(item)) {
      return "Request";
    }
    return item
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {modifiedPathItems.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              {index !== modifiedPathItems.length - 1 ? (
                <BreadcrumbLink href={`/${pathItems.slice(0, index + 1).join("/")}`}>{item}</BreadcrumbLink>
              ) : (
                item
              )}
            </BreadcrumbItem>
            {index !== pathItems.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
