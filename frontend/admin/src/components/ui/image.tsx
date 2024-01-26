import React from "react";
import ImageNext from "next/image";

export const Image = ({
  alt,
  src,
  className,
}: {
  className?: string;
  alt: string;
  src: string;
}) => {
  return (
    <ImageNext
      width={0}
      height={0}
      priority
      sizes="100vw"
      alt={alt}
      src={src}
      {...(className && { className })}
    />
  );
};
