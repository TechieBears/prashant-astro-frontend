import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Error from '../Errors/Error';

export default function MultiSelectTextInput({ label, options, value, onChange, errors }) {
    const selectedOptions = options.filter(option =>
        (value || []).includes(option.value)
    );

    return (
        <div className=''>
            <Autocomplete
                multiple
                options={options}
                disableCloseOnSelect
                value={selectedOptions}
                onChange={(event, newOptions) => {
                    const newValues = newOptions.map(option => option.value);
                    onChange(newValues);
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option, { selected }) => {
                    return (
                        <li {...props} className={`px-2 bg-white text-sm font-tbLex text-slate-500 transition-all duration-150 tracking-tight`}>
                            <Checkbox
                                checked={selected}
                            />
                            {option.label}
                        </li>
                    );
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                            color: 'red',
                            border: '1.5px solid #cbd5e1',
                            borderColor: errors ? '#ef4444' : '#cbd5e1',
                        },
                        '&:hover fieldset': {
                            border: '1.5px solid #cbd5e1',
                            borderColor: errors ? '#ef4444' : '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#007bff',
                        },
                    },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        className='[&>div]:!rounded-lg [&>div]:hover:!border-primary [&>div]:!py-[8px] [&>div]:!border-slate-300 [&>label]:!text-base [&>label]:!font-tbLex [&>label]:!text-slate-400 [&>label]:!px-2'
                    />
                )}
            />
            {errors && (
                <Error
                    message={
                        errors.message ||
                        `${label.replace(/\b(enter|your)\b/gi, "").trim()} is required`
                    }
                />
            )}
        </div>
    );
}
