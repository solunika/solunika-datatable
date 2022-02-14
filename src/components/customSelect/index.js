import { FormControl, InputLabel, OutlinedInput, Select } from '@mui/material';
import * as React from 'react';

export default ({ label, children, className,
    name, value, onChange, onBlur, ...props }) => {
    const labelId = `customLabel-${label}`
    return (
        <FormControl>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                {...props}
                className={className}
                name={name}
                labelId={labelId}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                input={<OutlinedInput label={label} />}>
                {children}
            </Select>
        </FormControl>
    );
}
