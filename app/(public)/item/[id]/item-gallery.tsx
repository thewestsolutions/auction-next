"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ItemGalleryProps {
  images: string[];
  title: string;
}

export default function ItemGallery({ images, title }: ItemGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex gap-4">
      <div className="flex w-16 flex-col gap-4">
        {images.map((image, index) => (
          <Image
            src={image}
            alt={title}
            className={cn(
              "h-auto w-full cursor-pointer rounded-md transition-all duration-300 select-none",
              activeImage === image && "border-primary border-2"
            )}
            width={62}
            height={62}
            key={index}
            onClick={() => setActiveImage(image)}
          />
        ))}
      </div>

      <div className="relative h-96 w-full bg-gray-100">
        <Image src={activeImage} alt={title} className="h-auto w-full" fill objectFit="contain" />
      </div>
    </div>
  );
}
