import LayoutAdmin from "@/components/Admin/LayoutAdmin";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <LayoutAdmin >{children}</LayoutAdmin>
    </>
  );
}

export default Layout;
