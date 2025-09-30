const ClickableContact = ({ type, value, className = '', hoverColor = 'hover:text-white' }) => {
    const typeMap = {
        email: `mailto:${value}`,
        phone: `https://wa.me/${value.replace(/[^0-9]/g, '')}`,
        whatsapp: `https://wa.me/${value.replace(/[^0-9]/g, '')}`
    };

    const href = typeMap[type?.toLowerCase()];
    if (!href) return <span className={className}>{value}</span>;

    const isEmail = type?.toLowerCase() === 'email';
    const linkProps = isEmail ? {} : { target: "_blank", rel: "noopener noreferrer" };

    return (
        <a href={href} className={`${className} ${hoverColor} transition-colors cursor-pointer`} {...linkProps}>
            {value}
        </a>
    );
};

export default ClickableContact;
