import Image from "next/image"
import { FC } from 'react'

interface GalleryProps {
  photos: string[] | undefined
}


const Gallery:FC<GalleryProps> = ({photos}) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Galería</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos?.map((src, index) => (
          <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="hover:scale-110 transition-transform duration-300"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery