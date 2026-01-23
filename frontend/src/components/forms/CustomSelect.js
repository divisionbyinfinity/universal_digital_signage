import FormControl from "@mui/material/FormControl";
import { InputLabel, MenuItem, Select } from "@mui/material";

export default function CustomSelect({
  inputName,
  labelText,
  selectedValue,
  items,
  onChange,
  isDisabled = false,
  idKey = "_id",
  displayKey = "name",
  defaultCheckedValue,
}) {
  return (
    <FormControl fullWidth color="success" size="small" sx={{minWidth:200}}>
      <InputLabel shrink>{labelText}</InputLabel>
      <Select
        name={inputName}
        value={selectedValue}
        onChange={onChange}
        disabled={isDisabled}
        label={labelText}
        defaultChecked={defaultCheckedValue}
        sx={{
          minHeight: "40px",
          '& .MuiSelect-select': {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        {items?.map((item) => (
          <MenuItem key={item[idKey]} value={item[idKey]}>
            {item[displayKey]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
