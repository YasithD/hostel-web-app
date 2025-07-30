import { PropsWithChildren } from "react";

export default function RequestDetailsSectionTitle(props: PropsWithChildren) {
  const { children } = props;

  return <h2 className="text-lg font-bold text-primary">{children}</h2>;
}
