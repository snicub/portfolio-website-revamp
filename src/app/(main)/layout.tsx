import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Next's scroll-restoration anchors to the first element of the segment
          and skips it if it is fixed or sticky — which the bar itself is. This
          static, zero-height wrapper gives it something at the top of the flow
          to scroll to, without changing where the bar paints. */}
      <div className="chrome-anchor">
        <Navbar />
      </div>
      {children}
    </>
  );
}
