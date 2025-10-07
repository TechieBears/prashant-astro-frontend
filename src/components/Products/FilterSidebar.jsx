import React from 'react';
import SearchBar from './SearchBar';
import PriceRangeSlider from './PriceRangeSlider';
import CategoryFilter from './CategoryFilter';
import SubcategoryFilter from './SubcategoryFilter';

const FilterSidebar = ({
    search,
    setSearch,
    categories = [],
    subcategories = [],
    selectedCategories = [],
    selectedSubcategories = [],
    toggleCategory,
    toggleSubcategory,
    price,
    setPrice,
    minPrice = 0,
    maxPrice = 100000,
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
                        placeholder="Search products..."
                    />
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
                    <h4 className="text-slate-800 font-semibold mb-2">Categories</h4>
                    <div className="mt-3">
                        {isLoading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-6 bg-gray-200 animate-pulse rounded"></div>
                                ))}
                            </div>
                        ) : categories.length > 0 ? (
                            <CategoryFilter
                                categories={categories}
                                selectedCategories={selectedCategories}
                                onToggleCategory={toggleCategory}
                            />
                        ) : (
                            <p className="text-sm text-gray-500">No categories available</p>
                        )}
                    </div>
                </div>

                {/* Subcategories */}
                {selectedCategories.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-slate-800 font-semibold mb-2">Subcategories</h4>
                        <div className="mt-3">
                            {isLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-6 bg-gray-200 animate-pulse rounded"></div>
                                    ))}
                                </div>
                            ) : subcategories.length > 0 ? (
                                <SubcategoryFilter
                                    subcategories={subcategories.filter(sub =>
                                        selectedCategories.includes(sub.categoryId)
                                    )}
                                    selectedSubcategories={selectedSubcategories}
                                    onToggleSubcategory={toggleSubcategory}
                                />
                            ) : (
                                <p className="text-sm text-gray-500">No subcategories available</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setIsMobileFiltersOpen(false)}
                        disabled={isLoading}
                        className="flex-1 rounded-[0.2rem] bg-gray-800 text-white py-2 px-4 text-sm sm:text-base font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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

export default React.memo(FilterSidebar);
