import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function MultiSelect({ data, selectedItems, handleInputChange, name, open, sx, MenuProps }) {
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    if (selectedItems) {
      setSelectedValues(selectedItems);
    }
  }, [selectedItems]);

  useEffect(() => {
    if (!open) {
      setSelectedValues([]);
    }
  }, [open, selectedItems]);

  const handleSelectionChange = (event, selectedOptions) => {
    const selectedIds = selectedOptions.map((option) => option._id);
    setSelectedValues(selectedOptions);
    handleInputChange(name, selectedIds);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Autocomplete
        multiple
        name={name}
        size='small'
        options={data}
        getOptionLabel={(option) => option?.name}
        onChange={handleSelectionChange}
        clearOnEscape={true}
        value={selectedValues}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={name}
            placeholder={"Search " + name}
            fullWidth
          />
        )}
        ListboxProps={{
          style: {
            maxHeight: MenuProps?.PaperProps?.style?.maxHeight || '40vh',
          },
        }}
        PopperProps={{
          ...MenuProps,
          style: {
            width: 'calc(100% - 32px)', // Account for modal padding
          },
        }}
        fullWidth
      />
    </Box>
  );
}