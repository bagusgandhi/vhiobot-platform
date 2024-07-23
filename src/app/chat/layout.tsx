import { Metadata } from "next";

export function metadata(): Metadata {
    return {
        title: "Your Conversation",
        description: "All your conversation with vhiobot",
    };
}

function Layout({ children }: { children: React.ReactNode }) {
    return (
      <>
            {children}
      </>
    );
}

export default Layout;
