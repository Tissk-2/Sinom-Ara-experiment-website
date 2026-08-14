import type React from "react";

type MotionProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "motion-hover": MotionProps & {
        scale?: string;
        y?: string;
        bounce?: string;
        duration?: string;
      };
      "motion-press": MotionProps & {
        scale?: string;
        duration?: string;
        disabled?: boolean;
      };
    }
  }
}

export {};
