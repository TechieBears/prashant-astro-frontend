import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export default function SimpleGallery(props) {
    const rightArrowSVGString = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"></path></svg>';
    const leftArrowSVGString = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"></path></svg>';
    useEffect(() => {
        let lightbox = new PhotoSwipeLightbox({
            gallery: '#' + props.galleryID,
            children: 'a',
            pswpModule: () => import('photoswipe'),
            zoom: false,
            counter: false,
            arrowPrevSVG: leftArrowSVGString,
            arrowNextSVG: rightArrowSVGString,
        });
        lightbox.init();

        return () => {
            lightbox.destroy();
            lightbox = null;
        };
    }, []);

    return (
        <div className="flex flex-wrap" id={props.galleryID}>
            {props.images.map((image, index) => (
                <a
                    href={image.URL}
                    data-pswp-width={image.width}
                    data-pswp-height={image.height}
                    key={props.galleryID + '-' + index}
                    target="_blank"
                    style={{ objectFit: 'contain' }}
                    rel="noreferrer"
                    className={props.images.length > 3 ? index == 0 || index == 3 ? 'w-full' : 'w-1/2' : 'w-full'}
                >
                    <img loading="lazy" src={image.URL} alt={`image-${index}`} className='w-full h-full p-1 rounded-md object-contain' />
                </a>
            ))}
        </div>
    );
}
