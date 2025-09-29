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
  height = "h-20 sm:h-32 md:h-40 lg:h-48 xl:h-56",
  textColor = "text-white",
  overlayColor = "bg-black bg-opacity-20",
  backgroundPosition = "",
  breadcrumbsClassName = "text-xs sm:text-sm md:text-base lg:text-lg",
  breadcrumbItemTextClassName = "text-white text-xs sm:text-sm md:text-base lg:text-lg font-medium",
  backgroundSize = "cover"
}) => {
  return (
    <div
      className={`relative ${height} flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 md:px-8 mt-16 sm:mt-20 md:mt-0 lg:mt-0`}
      style={{
        backgroundImage: `url(${pagesBanner})`,
        backgroundPosition: backgroundPosition,
        backgroundSize: backgroundSize
      }}
    >
      {/* Dark overlay */}
      <div className={`absolute inset-0 ${overlayColor}`}></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-2 sm:px-4 pb-8 sm:pb-10 md:pb-12 pt-2 sm:pt-3 md:pt-4">
        <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 md:space-y-3 max-w-4xl mx-auto text-center">
          {/* Title */}
          <h1 className={`text-center font-procSans tracking-wide leading-tight px-2 ${textColor} 
            text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl
            max-w-full break-words`}>
            {title}
          </h1>

          {/* Title Image */}
          <div className="flex justify-center w-full mt-1 sm:mt-2">
            <img
              loading="lazy"
              src={titleImage}
              alt={title}
              className="w-16 h-auto sm:w-20 md:w-24 lg:w-28 xl:w-32 object-contain transition-all duration-300 filter brightness-0 invert"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumbs - Positioned at bottom with proper containment */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className={`absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4 lg:bottom-6 lg:left-6 z-20 max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-2rem)] ${breadcrumbsClassName}`}>
          <ol className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center text-white">
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className={`hover:text-opacity-80 transition-colors duration-200 decoration-1 underline-offset-2 ${breadcrumbItemTextClassName} break-words`}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className={`${breadcrumbItemTextClassName} break-words`}>{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="ml-1 sm:ml-2 text-current text-white opacity-60">/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Decorative corner elements - Hidden on very small screens */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 opacity-30 hidden sm:block">
        <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-current"></div>
      </div>
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 opacity-30 hidden sm:block">
        <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-current"></div>
      </div>
      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4 opacity-30 hidden sm:block">
        <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-current"></div>
      </div>
      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 opacity-30 hidden sm:block">
        <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-current"></div>
      </div>
    </div>
  );
};

export default BackgroundTitle;
