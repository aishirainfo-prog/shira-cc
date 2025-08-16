export const metadata = {
  title: "SHIRA Command Center",
  description: "Pannello di controllo Shira",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ background: "#f3f5f7", margin: 0 }}>{children}</body>
    </html>
  );
}
