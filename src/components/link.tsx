import NextLink from "next/link";
import type { ComponentProps } from "react";

// Evita carregar antecipadamente todo o catálogo e os formulários em conexões móveis.
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
