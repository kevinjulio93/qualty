import { Card, CardContent, CardHeader, Paper, Stack, Typography } from "@mui/material";
import TouchAppIcon from '@mui/icons-material/TouchApp';
import RepartitionIcon from '@mui/icons-material/Repartition';
import Charts from "../../components/charts/charts";
import { EChartsOption } from 'echarts';


function Stats() {
    const pieOptions: EChartsOption = {
        title: {},
        tooltip: {
          trigger: 'item'
        },
        legend: {
            orient: "horizontal",
            left: "left",
            type: "scroll",
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 40, name: 'Sillas de ruedas' },
              { value: 72, name: 'Bastones' },
              { value: 91, name: 'Caminadoras' },
              { value: 238, name: 'Lentes' },
              { value: 174, name: 'Antiescaras' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      const barOptions: EChartsOption = {
        xAxis: {
          type: 'category',
          data: ['Fisioterapia', 'Psicología', 'Nutrición', 'Anamnesis']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [
                {
                    value: 23,
                    itemStyle: {
                      color: '#7193c9'
                    }
                },
                {
                    value: 41,
                    itemStyle: {
                      color: '#7193c9'
                    }
                },
                {
                    value: 73,
                    itemStyle: {
                      color: '#80cc66'
                    }
                },
                {
                    value: 28,
                    itemStyle: {
                      color: '#a13f6b'
                    }
                }
            ],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };

    return (
        <>
            <section className='activities-container'>
                <header className="activities-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Evento Cúcuta - Comuna 10.</Typography>
                        <span className="page-subtitle">Estadísticas generales del evento de entrega.</span>
                    </div>
                </header>
                <Paper elevation={1} className="activities-container__form-section">
                    <Stack direction="column" spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <Card sx={{ width: 300 }}>
                            <CardHeader
                                subheader="Número de asistentes"
                             />
                            <CardContent>
                                <Stack direction="row" spacing={2}>
                                    <TouchAppIcon color="secondary" sx={{fontSize: 50}}></TouchAppIcon>
                                    <Typography variant="h3" color="primary">1.294</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card sx={{ width: 300 }}>
                            <CardHeader
                                subheader="Entregas realizadas"
                             />
                            <CardContent>
                                <Stack direction="row" spacing={2}>
                                    <RepartitionIcon color="secondary" sx={{fontSize: 50}}></RepartitionIcon>
                                    <Typography variant="h3" color="primary">735</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Card sx={{ width: 500 }}>
                            <CardHeader
                                subheader="Artículos entregados"
                             />
                            <CardContent>
                                <Charts options={pieOptions}></Charts>
                            </CardContent>
                        </Card>
                        <Card sx={{ width: 500 }}>
                            <CardHeader
                                subheader="Valoraciones"
                             />
                            <CardContent>
                                <Charts options={barOptions}></Charts>
                            </CardContent>
                        </Card>
                    </Stack>
                    </Stack>
                </Paper>
            </section>
        </>
    );
}

export default Stats;