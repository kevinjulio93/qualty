import { Card, CardContent, CardHeader, Paper, Stack, Typography } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Charts from "../../components/charts/charts";
import { EChartsOption } from 'echarts';
import { useEffect, useState } from "react";
import { getUserResume } from "../../services/beneficiaries.service";
import { isEmpty } from "../../helpers/isEmpty";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";


function Resume() {
    const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [myResume, setMyResume] = useState(null);
  const [activityBar, setActivityBar] = useState(null);


  useEffect(() => {
    getResume();
  }, []);

  useEffect(() => {
    if (!isEmpty(myResume)) {
        activityChart();
    }
  }, [myResume]);
  
  const generarColorAleatorio = () => {
    const rojo = Math.floor(Math.random() * 256);
    const verde = Math.floor(Math.random() * 256);
    const azul = Math.floor(Math.random() * 256);

    const colorHexadecimal = `#${convertirAHexadecimal(rojo)}${convertirAHexadecimal(verde)}${convertirAHexadecimal(azul)}`;

    return colorHexadecimal;
  }

  const convertirAHexadecimal = (valor: number) => {
    const hexadecimal = valor.toString(16);
    return (hexadecimal.length === 1) ? "0" + hexadecimal : hexadecimal;
  }

  const getResume = async() => {
    const { result } = await getUserResume();
    setMyResume(result.data);
  }

  const activityChart = () => {
    const categories = myResume?.activityRecords?.map(item => item?.activityInfo?.name || 'Sin actividad');
    const seriesData = myResume?.activityRecords?.map(item => {
        return {
            value: item.count,
            itemStyle: {
                color: generarColorAleatorio()
            }
        }
    });
    const barOptions: EChartsOption = {
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            rotate: 45,
            hideOverlap: true,
            interval: 0,
            overflow: "truncate",
            formatter: function (value) {
                return value.substring(0, 15) + '...';
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            tooltip: {
                show: true,
                confine: true,
                textStyle: {
                    fontSize: 12
                }
            }
          }
        ],
        grid: {
            bottom: '120px'
        },
        tooltip: {
            trigger: "item"
        }
    };
    setActivityBar(barOptions);
  }


    return (
        <>
            <section className='activities-container'>
                <header className="activities-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">{'Mi historial de registros - ' + loggedUser?.name} 
                        </Typography>
                        <span className="page-subtitle">Estadísticas generales de mi historial de registros.</span>
                    </div>
                </header>
                <Paper elevation={1} className="activities-container__form-section">
                    <Stack direction="column" spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <Card sx={{ width: 300 }}>
                            <CardHeader
                                subheader="Total beneficiarios registrados"
                             />
                            <CardContent>
                                <Stack direction="row" spacing={2}>
                                    <PersonAddIcon color="secondary" sx={{fontSize: 50}}></PersonAddIcon>
                                    <Typography variant="h3" color="primary">{myResume?.totalRecords || 0}</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card sx={{ width: 300 }}>
                            <CardHeader
                                subheader="Beneficiarios registrados hoy"
                             />
                            <CardContent>
                                <Stack direction="row" spacing={2}>
                                    <CalendarTodayIcon color="secondary" sx={{fontSize: 50}}></CalendarTodayIcon>
                                    <Typography variant="h3" color="primary">{myResume?.currentRecords || 0}</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                    {activityBar && <Stack direction="row" spacing={2}>
                        <Card sx={{ width: '100%' }}>
                            <CardHeader
                                subheader="Registros por actividad"
                             />
                            <CardContent>
                                <Charts options={activityBar}></Charts>
                            </CardContent>
                        </Card>
                        </Stack>}
                    </Stack>
                </Paper>
            </section>
        </>
    );
}

export default Resume;