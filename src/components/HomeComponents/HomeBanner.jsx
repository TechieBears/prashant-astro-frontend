import { formBtn1 } from '../../utils/CustomClass'
import image2 from '../../assets/arrow.gif'
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/all';

const HomeBanner = ({ image, title, description, button, background, onClick }) => {

    useGSAP(() => {
        let split = SplitText.create(".split", { type: "words" });

        const tl = gsap.timeline({
            defaults: {
                duration: 1,
                ease: "power1.inOut",
            },
        });

        tl.from(split.words, {
            y: 100,
            autoAlpha: 0,
            stagger: 0.05
        })

        tl.from(".discrption", {
            y: 100,
            opacity: 0,
        })

        tl.from(".btn", {
            y: 100,
            opacity: 0,
        })
    }, [])

    return (
        <section className='relative flex h-screen items-center justify-center  overflow-hidden' >
            {background && <div className='absolute inset-0 z-10 h-full w-full overflow-hidden bg-gradient-to-t from-transparent from-30% to-black ' />}
            <img src={image} alt="Home Banner" className='w-full h-full object-cover' />
            {/* <video src="https://pikaso.cdnpk.net/public/media/banners/google_veo3_banner.mp4" class="relative w-full size-full object-cover" loop autoPlay playsInline muted>
            </video>
            <div class="absolute inset-0 z-0 bg-black/50"></div> */}
            <div className='absolute inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex justify-center items-center flex-col space-y-3 container mx-auto z-40 px-4 md:px-8 ' >
                <h1 className='split text-2xl md:text-4xl lg:text-6xl pb-2  font-tbLex font-bold text-neutral-50 overflow-hidden' >{title}</h1>
                <p className='discrption text-xs md:text-base font-tbPop font-normal text-white max-w-4xl !mb-5 overflow-hidden' >{description}</p>
                {button && <button className={`btn ${formBtn1}`} onClick={onClick} >Register to join</button>}
            </div>
            {background && <div className='absolute inset-0 z-40 h-full w-full overflow-hidden bg-gradient-to-b from-transparent from-10% via-transparent via-70% to-white to-90% pointer-events-none' />}
            {button && <div className='absolute  bottom-10 left-1/2 transform -translate-x-1/2 z-40 ' >
                <img loading="lazy" src={image2} alt="Home Banner" className='w-16 h-16 object-cover' />
            </div>}

        </section>
    )
}

export default HomeBanner
