import { Children, isValidElement, PropsWithChildren, ReactElement } from "react";
import RequestDetailsSectionTitle from "./SectionTitle";
import RequestDetailsSectionBody from "./SectionBody";

export default function RequestDetailsSection(props: PropsWithChildren) {
  const { children } = props;
  const title = Children.toArray(children).find(
    (child): child is ReactElement => isValidElement(child) && child.type === RequestDetailsSectionTitle
  );
  const body = Children.toArray(children).find(
    (child): child is ReactElement => isValidElement(child) && child.type === RequestDetailsSectionBody
  );

  return (
    <div className="flex flex-col gap-4">
      {title}
      {body}
    </div>
  );
}
