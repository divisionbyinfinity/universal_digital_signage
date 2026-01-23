import { TextField } from "@mui/material"
export default function ({name,value,label,handleChange}){
    return (
        <TextField
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <input
            name={name}
              type="color"
              value={value}
              onChange={handleChange}
              className="w-7 h-7"
            />
          ),
        }}
      />
    )
}