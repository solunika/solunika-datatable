import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import localeEs from "date-fns/locale/es";

export default ({ onChange, onBlur, name, label, ...props }) => {
    const [value, setValue] = React.useState(new Date(props.value));

    React.useEffect(() => console.log("VALUE => ", props.value), [value])
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeEs}>
            <DatePicker
                label={label}
                mask="__/__/____"
                value={value}
                name={name}
                onChange={(newDate) => {
                    setValue(newDate)
                    onChange({ target: { name, value: newDate.toISOString() } })
                }}
                onBlur={onBlur}
                renderInput={(params) => <TextField {...params} onChange={() => {
                    onChange(value.toISOString())
                }} />}
            />
        </LocalizationProvider>
    );
}