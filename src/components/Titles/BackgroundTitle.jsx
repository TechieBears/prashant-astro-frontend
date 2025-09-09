import React from 'react';
import titleImage from "../../assets/titleImage.png";

const BackgroundTitle = ({
  title = "About Us",
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About Me", href: "/about" }
  ],
  backgroundImage = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  height = "h-64",
  textColor = "text-white",
  overlayColor = "bg-black bg-opacity-60"
}) => {
  return (
    <div
      className={`relative ${height} flex items-center justify-center bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {/* Dark overlay */}
      <div className={`absolute inset-0 ${overlayColor}`}></div>

      {/* Content */}
      <div className={`relative z-10 text-center ${textColor}`}>
        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-3xl font-procSans mb-4 tracking-wide">
          {title}
        </h1>

        <img
          loading="lazy"
          src={titleImage}
          alt={title}
          width={180}
          className={`object-contain transition-all duration-300 filter brightness-0 invert`}
        />
      </div>

      {/* Breadcrumbs (Positioned at the bottom-left corner) */}
      <nav className="absolute bottom-4 left-4 text-sm md:text-base opacity-90">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center text-white">
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-opacity-80 text-white text-xs transition-colors duration-200 decoration-1 underline-offset-2"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-white text-xs">{crumb.label}</span>
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
