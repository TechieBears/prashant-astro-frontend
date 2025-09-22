import React from "react";
import PropTypes from "prop-types";
import titleImage from "../../assets/titleImage.png";

const SectionHeader = ({
  prefix,
  highlight,
  suffix,
  prefixClass = "",
  highlightClass = "",
  suffixClass = "",
  white = false,
  image = titleImage,
  imageAlt = "Section Header",
  prefixColor = "text-black",
  highlightColor = "bg-text-gradient-orange bg-clip-text text-transparent",
  showImage = true,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 px-2 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-center">
        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-procSans ${prefixColor} ${prefixClass}`}
        >
          {prefix}
        </h2>
        {highlight && (
          <h2 className={`text-xl sm:text-2xl md:text-3xl font-procSans ${highlightColor} ${highlightClass}`}>
            {highlight}
          </h2>
        )}

        {suffix && (
          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-procSans ${prefixColor} ${suffixClass}`}
          >
            {suffix}
          </h2>
        )}
      </div>

      {/* Title Image */}
      {showImage && (
        <img
          loading="lazy"
          src={image}
          alt={imageAlt}
          width={150}
          className={`object-contain transition-all duration-300 ${white ? "filter brightness-0 invert" : ""
            }`}
        />
      )}
    </div >
  );
};

SectionHeader.propTypes = {
  prefix: PropTypes.string.isRequired,
  highlight: PropTypes.string.isRequired,
  suffix: PropTypes.string,
  white: PropTypes.bool,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  prefixColor: PropTypes.string,
  highlightColor: PropTypes.string,
  showImage: PropTypes.bool,

  prefixClass: PropTypes.string,
  highlightClass: PropTypes.string,
  suffixClass: PropTypes.string,
};

export default SectionHeader;
