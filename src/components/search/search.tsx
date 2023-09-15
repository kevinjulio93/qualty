import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import getFormData from "../../helpers/getFormData";

const Search = ({ label, buttonText, searchFunction }: any) => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data: any = getFormData(e.target);
    if (!data["search-data"].trim()) return;
    searchFunction(data["search-data"]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={{ xs: "column", md: "row" }}>
        <TextField
          fullWidth
          label={label}
          variant="outlined"
          name="search-data"
        />
        <Button type="submit" variant="text" className="btn-create">
          {buttonText}
        </Button>
      </Stack>
    </form>
  );
};

export default Search;
