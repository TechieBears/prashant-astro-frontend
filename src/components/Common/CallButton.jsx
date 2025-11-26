const CallButton = ({ 
    status = 'Online', 
    rate, 
    onClick, 
    disabled = false,
    className = '',
    children,
    allowClickWhenBusy = false
}) => {
    const buttonColors = {
        'Online': 'bg-button-vertical-gradient-orange text-white hover:opacity-90',
        'Busy': 'bg-gradient-to-b from-gray-300 to-gray-500 text-white cursor-pointer',
        'Call Requested': 'bg-gradient-to-b from-gray-300 to-gray-500 text-white cursor-not-allowed'
    };

    const isDisabled = disabled || (status === 'Busy' && !allowClickWhenBusy) || status === 'Call Requested';

    const getButtonText = () => {
        if (status === 'Call Requested') return 'Call Requested';
        return children || (
            <>
                <span className="font-normal">{rate}</span> <span className="font-bold">Call Now</span>
            </>
        );
    };

    return (
        <button
            className={`w-full py-2.5 px-4 rounded-lg font-normal text-sm transition-all ${buttonColors[status]} ${className}`}
            disabled={isDisabled}
            onClick={onClick}
        >
            {getButtonText()}
        </button>
    );
};

export default CallButton;