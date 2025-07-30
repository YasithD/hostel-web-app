type RequestDetailsSectionItemProps = {
  title: string;
  value: string;
};

export default function RequestDetailsSectionItem(props: RequestDetailsSectionItemProps) {
  const { title, value } = props;

  return (
    <div className="flex gap-2 border-t py-4">
      <h3 className="text-sm text-muted-foreground font-medium w-[400px]">{title}</h3>
      <p className="text-sm">{value}</p>
    </div>
  );
}
