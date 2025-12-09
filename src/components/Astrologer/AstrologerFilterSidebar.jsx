import React from 'react';
import SearchBar from '../Products/SearchBar';
import PriceRangeSlider from '../Products/PriceRangeSlider';

const AstrologerFilterSidebar = ({
    search,
    setSearch,
    languages = [],
    selectedLanguages = [],
    toggleLanguage,
    categories = [],
    selectedCategories = [],
    toggleCategory,
    experience = [],
    selectedExperience = [],
    toggleExperience,
    price,
    setPrice,
    minPrice = 0,
    maxPrice = 5000,
    resetFilters,
    isLoading = false,
}) => {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

    return (
        <div className="bg-white rounded-xl shadow-md ring-1 ring-slate-200 overflow-hidden">
            {/* Mobile filter header */}
            <button
                type="button"
                className="lg:hidden w-full px-4 py-3 bg-gray-50 text-left font-medium text-gray-700 flex items-center justify-between"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
                <span>Filters</span>
                <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block p-4`}>
                {/* Search */}
                <div className="mb-6">
                    <h4 className="text-slate-800 font-semibold mb-2">Search</h4>
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search astrologers..."
                    />
                </div>

                {/* Languages */}
                <div className="mb-6">
                    <h4 className="text-slate-800 font-semibold mb-2">Languages</h4>
                    <div className="mt-3">
                        <ul className="space-y-3">
                            {languages.map((language) => {
                                const isChecked = selectedLanguages.includes(language);
                                return (
                                    <li key={language} className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => toggleLanguage(language)}
                                            className="flex items-center gap-3 w-full group"
                                            aria-label={`Filter by ${language}`}
                                        >
                                            <span className={`flex-shrink-0 w-5 h-5 border-2 rounded ${isChecked
                                                ? 'bg-orange-500 border-orange-500 flex items-center justify-center'
                                                : 'border-gray-300'
                                                } transition-colors`}>
                                                {isChecked && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        className="w-3 h-3 text-white"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className="text-slate-700 text-base transition-colors">
                                                {language}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="text-slate-800 font-semibold mb-2">
                        Price <span className="font-bold text-slate-900 ml-2">
                            {price[0].toLocaleString()}₹ - {price[1].toLocaleString()}₹
                        </span>
                    </h4>
                    <div className="mt-3">
                        <PriceRangeSlider
                            min={minPrice}
                            max={maxPrice}
                            value={price}
                            onChange={(newPrice) => setPrice(newPrice)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                    <h4 className="text-slate-800 font-semibold mb-2">Skills</h4>
                    <div className="mt-3">
                        <ul className="space-y-3">
                            {categories.map((category) => {
                                const isChecked = selectedCategories.includes(category);
                                return (
                                    <li key={category} className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => toggleCategory(category)}
                                            className="flex items-center gap-3 w-full group"
                                            aria-label={`Filter by ${category}`}
                                        >
                                            <span className={`flex-shrink-0 w-5 h-5 border-2 rounded ${isChecked
                                                ? 'bg-orange-500 border-orange-500 flex items-center justify-center'
                                                : 'border-gray-300'
                                                } transition-colors`}>
                                                {isChecked && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        className="w-3 h-3 text-white"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className="text-slate-700 text-base transition-colors">
                                                {category}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Experience */}
                <div className="mb-6">
                    <h4 className="text-slate-800 font-semibold mb-2">Experience</h4>
                    <div className="mt-3">
                        <ul className="space-y-3">
                            {experience.map((exp) => {
                                const isChecked = selectedExperience.includes(exp);
                                return (
                                    <li key={exp} className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => toggleExperience(exp)}
                                            className="flex items-center gap-3 w-full group"
                                            aria-label={`Filter by ${exp}`}
                                        >
                                            <span className={`flex-shrink-0 w-5 h-5 border-2 rounded ${isChecked
                                                ? 'bg-orange-500 border-orange-500 flex items-center justify-center'
                                                : 'border-gray-300'
                                                } transition-colors`}>
                                                {isChecked && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        className="w-3 h-3 text-white"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className="text-slate-700 text-base transition-colors">
                                                {exp}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setIsMobileFiltersOpen(false)}
                        disabled={isLoading}
                        className="flex-1 rounded-[0.2rem] bg-button-gradient-orange text-white py-2 px-4 text-sm sm:text-base font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        Filter
                    </button>
                    <button
                        onClick={resetFilters}
                        disabled={isLoading}
                        className="flex-1 rounded-[0.2rem] border border-slate-300 text-slate-600 py-2 px-4 text-sm sm:text-base font-medium bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AstrologerFilterSidebar);