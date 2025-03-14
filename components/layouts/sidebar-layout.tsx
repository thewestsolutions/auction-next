interface Props {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function SidebarLayout({ children, sidebar }: Props) {
  return (
    <div className="flex gap-8">
      <div className="w-64">{sidebar}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
