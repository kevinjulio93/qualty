import { Grid, Typography } from "@mui/material";

function Stats() {

    return (
        <>
            <section className='activities-container'>
                <header className="activities-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Estadísticas</Typography>
                        <span className="page-subtitle">Estadísticas generales del evento de entregas.</span>
                    </div>
                </header>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </section>
        </>
    );
}

export default Stats;