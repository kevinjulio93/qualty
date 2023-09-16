import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import getFormData from "../../helpers/getFormData";

const Search = ({ label, searchFunction }: any) => {
  const handleSubmit = (e: any) => {
    console.log(e);
    e.preventDefault();
    const data: any = getFormData(e.target);
    if (!data["search-data"].trim()) return;
    searchFunction(data["search-data"]);
  };

  return (
    <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={label}
            inputProps={{ 'aria-label': label }}
            name="search-data"
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
    </Paper>
  );
};

export default Search;
