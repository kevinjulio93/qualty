import { useEffect, useState } from "react";
import { getAllActivities } from "../../services/activities.service";
import { Autocomplete, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import { getUserList } from "../../services/user.service";
import ClearIcon from "@mui/icons-material/Clear";
import Search from "../../components/search/search";


function Assistance () {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getActivities();
        getUsers();
    }, [])

    
    const getActivities = async () => {
        setIsLoading(true);
        try {
            const response = await getAllActivities();
            if (response.status === 200) {
                const dataList = response.result.data.map((item) => item.name);
                setActivities(dataList);
            }
        } catch (error) {
          console.error(error);
        }
        setIsLoading(false);
    }

    const getUsers = async () => {
        try {
          const response = await getUserList();
          const userList = response.result.data;
          setUsers(userList);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteAction = (user) => {
        console.log(user);
    };

    return isLoading ? (
        <LoadingComponent></LoadingComponent>
      ) : (
        <>
            <section className='beneficiaries-container'>
                <header className="beneficiaries-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Asistencia a talleres</Typography>
                        <span className="page-subtitle">Generar asistencia de beneficiarios a los talleres.</span>
                    </div>
                </header>

                <Paper elevation={1} className="beneficiaries-container__form-section">
                    <Autocomplete
                        freeSolo
                        disablePortal
                        id="combo-box-demo"
                        options={activities}
                        sx={{ width: 500 }}
                        renderInput={(params) => <TextField {...params} label="Taller" />}
                    />
                    <Search
                        label="Buscar beneficiario"
                        buttonText="Buscar"
                        searchFunction={(data: any) => {
                            alert(data);
                        }}
                    />
                    <Table>
                        <TableRow header>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        </TableRow>
                        {users.length > 0 &&
                        users.map((user: any, index) => {
                            return (
                            <TableRow key={index}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role.role}</TableCell>
                                <TableCell>
                                <Stack className="actions-cell" direction="row" spacing={2}>
                                    <ClearIcon
                                    className="action-item-icon action-item-icon-delete"
                                    onClick={() => handleDeleteAction(user)}
                                    ></ClearIcon>
                                </Stack>
                                </TableCell>
                            </TableRow>
                            );
                        })}
                    </Table>
                </Paper>
            </section>
        </>
    );
}

export default Assistance;