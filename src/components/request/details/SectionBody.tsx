import { Children, isValidElement, PropsWithChildren } from "react";
import RequestDetailsSectionItem from "./SectionItem";

export default function RequestDetailsSectionBody(props: PropsWithChildren) {
  const { children } = props;
  const items = Children.toArray(children).map((child) => {
    if (isValidElement(child) && child.type === RequestDetailsSectionItem) {
      return child;
    }
  });

  return <div className="flex flex-col">{items}</div>;
}
