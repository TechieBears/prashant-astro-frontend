import swastikaGif from '../../assets/loader/swastika.gif';

const Preloaders = () => {
    return (
        <main className="flex justify-center items-center h-screen flex-col space-y-6 bg-slate1 ">
            <img
                src={swastikaGif}
                alt="Loading..."
                className="w-32 h-32"
            />
            <h3 className="text-lg font-normal font-tbLex text-slate-500 lg:pt-5">Loading, Please wait...</h3>
        </main>
    );
};

export default Preloaders;
