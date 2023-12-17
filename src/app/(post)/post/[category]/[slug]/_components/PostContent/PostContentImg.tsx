import Image, { StaticImageData } from 'next/image';
import {
  postContentImage,
  postContentImageBox,
  postContentImageDescription,
  postContentImageWrapper,
} from './PostContentImg.css';
import { useEffect, useState } from 'react';

interface Props {
  image: StaticImageData;
  alt: string;
}

const PostContentImg = ({ image, alt }: Props) => {
  const [width, setWidth] = useState('0px');

  useEffect(() => {
    const computeImageWidth = () => {
      const isMobile = 900 > window.innerWidth;
      const computedWidth = isMobile ? '100%' : image.width > 900 ? '900px' : `${image.width}px`;
      setWidth(computedWidth);
    };

    computeImageWidth();

    window.addEventListener('resize', () => {
      computeImageWidth();
    });

    return () => {
      window.removeEventListener('resize', () => {
        computeImageWidth();
      });
    };
  }, []);

  return (
    <figure className={postContentImageWrapper}>
      <div
        className={postContentImageBox}
        style={{
          width,
          aspectRatio: image.width / image.height,
        }}
      >
        {image.src.includes('.gif') ? (
          <Image
            className={postContentImage}
            src={image}
            alt={alt}
            placeholder="blur"
            blurDataURL={image.src}
            fill
            loading="lazy"
            sizes="100%"
          />
        ) : (
          <Image
            className={postContentImage}
            src={image}
            alt={alt}
            placeholder="blur"
            fill
            loading="lazy"
            sizes="100%"
          />
        )}
      </div>
      {alt && <figcaption className={postContentImageDescription}>{alt}</figcaption>}
    </figure>
  );
};

export default PostContentImg;
