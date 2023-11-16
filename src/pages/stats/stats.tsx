import { Card, CardContent, CardHeader, Paper, Stack, Typography } from "@mui/material";
import TouchAppIcon from '@mui/icons-material/TouchApp';
import RepartitionIcon from '@mui/icons-material/Repartition';
import Charts from "../../components/charts/charts";
import { EChartsOption } from 'echarts';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventStats } from "../../services/events.service";
import SyncIcon from '@mui/icons-material/Sync';


function Stats() {
  const { eventId } = useParams();
  const [eventStats, setEventStats] = useState(null);
  const [mappedITems, setMappedItems] = useState(null);
  const [pieOptions, setPieOptions] = useState(null);
  const [forceRender, setForceRender] = useState(+new Date());

  /*
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
  */

  useEffect(() => {
    getStats();
  }, []);

  useEffect(() => {
    if (mappedITems && mappedITems.length > 0) createPie();
  }, [mappedITems]);

  const getStats = async() => {
    const { result } = await getEventStats(eventId);
    setEventStats(result.data);
    const mapped = [];
    result?.data?.deliveredItems?.forEach(item => {
      if (!item?.itemDetails.isDefault) {
        mapped.push({
          name: item?.itemDetails?.name,
          value: item.totalAmount
        });
      }
    });
    setMappedItems(mapped);
  }

  const createPie = () => {
    const defaultPie: EChartsOption = {
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
          name: 'Articulos entregados',
          type: 'pie',
          radius: '50%',
          data: mappedITems,
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
    setPieOptions(defaultPie);
  }

    return (
        <>
            <section className='activities-container'>
                <header className="activities-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">{eventStats?.event.name || 'Entrega'} 
                        <SyncIcon
                          onClick={() => {
                            getStats();
                            setForceRender(+new Date());
                          }
                          }
                          className="action-item-icon action-item-icon-edit"
                        ></SyncIcon>
                        </Typography>
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
                                    <Typography variant="h3" color="primary">{eventStats?.numberOfAttendees || 0}</Typography>
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
                                    <Typography variant="h3" color="primary">{eventStats?.numberOfDelivery || 0}</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                    {pieOptions && <Stack direction="row" spacing={2}>
                        <Card sx={{ width: 500 }}>
                            <CardHeader
                                subheader="Artículos entregados"
                             />
                            <CardContent>
                                <Charts options={pieOptions}></Charts>
                            </CardContent>
                        </Card>
                        </Stack>}
                    </Stack>
                </Paper>
            </section>
        </>
    );
}

export default Stats;