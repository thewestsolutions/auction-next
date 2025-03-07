import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white sticky top-0 z-10 w-full px-4 py-2">
        <Image
          src="https://placehold.co/300x150.png"
          alt="logo"
          className="h-10"
          width={150}
          height={300}
        />
      </header>

      <main className="flex-grow p-4">{children}</main>

      <footer className="mt-auto p-4">
        <div className="flex justify-between">
          <p>Footer</p>
          <p>Footer</p>
        </div>
      </footer>
    </div>
  );
}