import React from 'react';
import titleImage from "../../assets/titleImage.png";
import pagesBanner from "../../assets/user/home/pages_banner.jpg";

const BackgroundTitle = ({
  title = "About Us",
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About Me", href: "/about" }
  ],
  backgroundImage = pagesBanner,
  height = "h-48 md:h-64 lg:h-72",
  textColor = "text-white",
  overlayColor = "bg-black bg-opacity-60",
  backgroundPosition = "",
  breadcrumbsClassName = "text-base md:text-lg lg:text-xl",
  breadcrumbItemTextClassName = "text-white text-base md:text-lg lg:text-xl font-medium",
  backgroundSize = "cover"
}) => {
  return (
    <div
      className={`relative ${height} flex items-center justify-center bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: backgroundPosition,
        backgroundSize: backgroundSize
      }}
    >
      {/* Dark overlay */}
      <div className={`absolute top-0 left-0 right-0 bottom-0 ${overlayColor}`}></div>

      {/* Content */}
      <div className={`relative z-10 w-full text-center ${textColor}`}>
        <div className="flex flex-col items-center justify-center h-full">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-procSans mb-4 tracking-wide">
            {title}
          </h1>

          <div className="flex justify-center w-full">
            <img
              loading="lazy"
              src={titleImage}
              alt={title}
              width={180}
              className="object-contain transition-all duration-300 filter brightness-0 invert"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumbs (Positioned at the bottom-left corner) */}
      <nav className={`absolute bottom-4 left-4 md:left-20 opacity-90 ${breadcrumbsClassName}`}>
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center text-white">
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className={`hover:text-opacity-80 transition-colors duration-200 decoration-1 underline-offset-2 ${breadcrumbItemTextClassName}`}
                >
                  {crumb.label}
                </a>
              ) : (
                <span className={`${breadcrumbItemTextClassName}`}>{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="ml-3  text-current text-white opacity-60">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 opacity-30">
        <div className="w-8 h-8 border-t-2 border-l-2 border-current"></div>
      </div>
      <div className="absolute top-4 right-4 opacity-30">
        <div className="w-8 h-8 border-t-2 border-r-2 border-current"></div>
      </div>
      <div className="absolute bottom-4 left-4 opacity-30">
        <div className="w-8 h-8 border-b-2 border-l-2 border-current"></div>
      </div>
      <div className="absolute bottom-4 right-4 opacity-30">
        <div className="w-8 h-8 border-b-2 border-r-2 border-current"></div>
      </div>
    </div>
  );
};

export default BackgroundTitle;
