import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Error from '../Errors/Error';

export default function MultiSelectTextInput({ label, options, value, onChange, errors }) {
    const allOptions = [
        { value: 'select_all', label: 'Select All' },
        ...(options || [])
    ];

    const allSelected = options?.length > 0 &&
        options?.every(option => (value || [])?.includes(option?.value));

    const selectedOptions = allOptions?.filter(option =>
        (value || [])?.includes(option?.value)
    );

    const handleChange = (event, newOptions, reason, details) => {
        const selectAllOption = newOptions.find(opt => opt.value === 'select_all');
        const previouslyHadSelectAll = allSelected;

        if (selectAllOption && !previouslyHadSelectAll) {
            const allValues = options?.map(option => option?.value) || [];
            onChange(allValues);
        }
        else if (details?.option?.value === 'select_all' && previouslyHadSelectAll) {
            onChange([]);
        }
        else {
            const newValues = newOptions
                ?.filter(option => option.value !== 'select_all')
                ?.map(option => option?.value) || [];
            onChange(newValues);
        }
    };

    const displaySelectedOptions = selectedOptions;

    return (
        <div className=''>
            <Autocomplete
                multiple
                options={allOptions}
                disableCloseOnSelect
                value={displaySelectedOptions}
                onChange={handleChange}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                renderOption={(props, option, { selected }) => {
                    const isSelected = option.value === 'select_all'
                        ? allSelected
                        : selected;

                    return (
                        <li
                            {...props}
                            className={`px-4 py-2 bg-white text-sm font-tbLex transition-all duration-150 tracking-tight hover:bg-slate-50 ${isSelected ? 'text-primary font-medium bg-blue-50' : 'text-slate-500'
                                } ${option.value === 'select_all' ? 'border-b border-slate-200 font-semibold' : ''}`}
                        >
                            {option?.label}
                        </li>
                    );
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f1f5f9',
                        '& fieldset': {
                            color: 'red',
                            border: '1.5px solid #f1f5f9',
                            borderColor: errors ? '#ef4444' : '#f1f5f9',
                        },
                        '&:hover fieldset': {
                            border: '1.5px solid #f1f5f9',
                            borderColor: errors ? '#ef4444' : '#f1f5f9',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#fff',
                        },
                    },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={label}
                        className='[&>div]:!rounded-lg [&>div]:hover:!border-primary [&>div]:!py-[8px] [&>div]:!border-slate-300 [&>label]:!text-base [&>label]:!font-tbLex [&>label]:!text-slate-400 [&>label]:!px-2'
                    />
                )}
            />
            {errors && (
                <Error
                    message={
                        errors?.message ||
                        `${label.replace(/\b(enter|your)\b/gi, "").trim()} is required`
                    }
                />
            )}
        </div>
    );
}
