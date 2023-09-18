import { useState } from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const Search = ({ label, searchFunction, voidInputFunction, width = 500}: any) => {
  const [inputValue, setInputValue] = useState("");
  let data: string = "";

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    searchFunction(inputValue);
  };

  const handleInputChange = (e: any) => {
    data = e.target.value;
    setInputValue(data);
    if (data) return;
    if (voidInputFunction) voidInputFunction();
  };

  const handleButtonClick = () => {
    setInputValue("");
    voidInputFunction();
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: width }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={label}
        inputProps={{ "aria-label": label }}
        name="search-data"
        onChange={handleInputChange}
        value={inputValue}
      />
      {!!inputValue && (
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="clear"
          onClick={handleButtonClick}
        >
          <ClearIcon />
        </IconButton>
      )}
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default Search;
