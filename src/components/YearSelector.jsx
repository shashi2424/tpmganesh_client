import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const YearSelector = ({ years, selectedYear, onChange }) => (
  <FormControl fullWidth sx={{ maxWidth: 200, mb: 3 }}>
    <InputLabel id="year-select-label">Year</InputLabel>
    <Select
      labelId="year-select-label"
      value={selectedYear}
      label="Year"
      onChange={e => onChange(e.target.value)}
    >
      {years.map(year => (
        <MenuItem key={year} value={year}>{year}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default YearSelector; 