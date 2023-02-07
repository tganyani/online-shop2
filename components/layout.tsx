import type { ReactNode } from "react";

import NavBar from "./navbar";
import Footer from "./footer";

type LayoutProps = { children?: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
