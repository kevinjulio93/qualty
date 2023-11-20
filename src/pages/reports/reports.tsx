import { useEffect, useState } from "react";
import {
    Avatar,
    List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import SaveCancelControls from "../../components/saveActionComponent/saveCancelControls";
import { REPORT_TYPE, reportType } from "../../constants/reportType";
import SelectDropdown from "../../components/select";
import { getAllEvents } from "../../services/events.service";
import Search from "../../components/search/search";
import { getBeneficiariesList } from "../../services/beneficiaries.service";
import "./reports.scss";
import { isEmpty } from "../../helpers/isEmpty";
import { getPdfDeliveryBeneficiarie } from "../../services/delivery.service";
import { getExcelActivityAssistance, getExcelBeneficiaryList, getExcelEventAssistance } from "../../services/reports.service";
import { reportFileType } from "../../constants/reportFileType";
import { getAllActivities } from "../../services/activities.service";

function Reports() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [eventList, setEventList] = useState(null);
    const [activities, setActivities] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [selectedBen, setSelectedBen] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [fileType, setFileType] = useState(reportFileType.PDF);
    const [disableFileType, setDisableFileType] = useState(false);

    useEffect(() => {
        if(selectedReport) {
            switch(selectedReport) {
                case REPORT_TYPE.DELIVERY_ACT: {
                    setFileType(reportFileType.PDF);
                    setDisableFileType(true);
                    getEvents();
                    getBeneficiaries();
                    break;
                }
                case REPORT_TYPE.EVENT_ASSISTANCE: {
                    setFileType(reportFileType.EXCEL);
                    setDisableFileType(true);
                    getEvents();
                    break;
                }
                case REPORT_TYPE.ACTIVITY_ASSISTANCE: {
                    setFileType(reportFileType.EXCEL);
                    setDisableFileType(true);
                    getActivitiesList();
                    break;
                }
                case REPORT_TYPE.BENEFICIARY_LIST:
                case REPORT_TYPE.WITHOUT_SUPPORTS: {
                    setFileType(reportFileType.EXCEL);
                    setDisableFileType(true);
                    break;
                }
                default: break;
            }
        }
    }, [selectedReport]);

    //Resources requests
    const getEvents = async() => {
        try {
          const responseEvents = await getAllEvents();
          const events = responseEvents.result.data.data;
          setEventList(events);
        } catch (error) {
          console.error(error);
        }
    }

    const getBeneficiaries = async () => {
        try {
          const { result } = await getBeneficiariesList("",1, 4);
          const { data: benfsList } = result;
          setBeneficiaries(benfsList);
        } catch (error) {
          console.error(error);
        }
    };

    const getActivitiesList = async () => {
        try {
          const response = await getAllActivities("", 1, 100);
          if (response.status === 200) {
            const { data: dataList } = response.result;
            setActivities(dataList);
          }
        } catch (error) {
          console.error(error);
        }
    }

    //General methods
    const generateReport = () => {
        const reportMethod = REPORT_DICTIONARY[selectedReport];
        reportMethod();
    }

    const onSelectType = (value) => {
        clearProperties();
        setSelectedReport(value.key);
    }

    const handleSelectedBend = (ben, index) => {
        setSelectedIndex(index);
        setSelectedBen(ben._id);
    }

    const clearProperties = () => {
        setSelectedBen(null);
        setSelectedEvent(null);
        setSelectedIndex(null);
        setSelectedActivity(null);
    }

    const disabledReportButton = () => {
        switch(selectedReport) {
            case REPORT_TYPE.DELIVERY_ACT: {
                return isEmpty(selectedEvent) || isEmpty(selectedBen);
            }
            case REPORT_TYPE.EVENT_ASSISTANCE: {
                return isEmpty(selectedEvent);
            }
            case REPORT_TYPE.ACTIVITY_ASSISTANCE: {
                return isEmpty(selectedActivity);
            }
            case REPORT_TYPE.WITHOUT_SUPPORTS:
            case REPORT_TYPE.BENEFICIARY_LIST: {
                return false;
            }
        }
    }

    const generateEventActPDF = async() => {
        await getPdfDeliveryBeneficiarie(selectedEvent, selectedBen);
    }

    const generateExcelEventAssistance = async() => {
        await getExcelEventAssistance(selectedEvent);
    }

    const generateExcelActivityAssistance = async() => {
        await getExcelActivityAssistance(selectedActivity);
    }

    const generateExcelBeneficiaryList = async() => {
        await getExcelBeneficiaryList(REPORT_TYPE.BENEFICIARY_LIST);
    }

    const generateExcelBeneficiaryWithoutSupports = async() => {
        await getExcelBeneficiaryList(REPORT_TYPE.WITHOUT_SUPPORTS);
    }

    const REPORT_DICTIONARY = {
        [REPORT_TYPE.DELIVERY_ACT]: generateEventActPDF,
        [REPORT_TYPE.EVENT_ASSISTANCE]: generateExcelEventAssistance,
        [REPORT_TYPE.ACTIVITY_ASSISTANCE]: generateExcelActivityAssistance,
        [REPORT_TYPE.BENEFICIARY_LIST]: generateExcelBeneficiaryList,
        //[REPORT_TYPE.WITHOUT_SUPPORTS]: generateExcelBeneficiaryWithoutSupports,
    };

    //Layouts renders
    const renderEventInput = () => {
        return (
            <form className="activities-container__form-section__assitants__form-2">
                <div className="activities-container__form-section__assitants__form-2__field">
                <SelectDropdown
                    selectValue={selectedEvent}
                    label="Evento"
                    options={eventList || []}
                    keyLabel="name"
                    keyValue="_id"
                    targetKey="_id"
                    handleValue={(value) => setSelectedEvent(value._id)}
                />
              </div>
            </form>
        );
    }

    const renderActivityInput = () => {
        return (
            <form className="activities-container__form-section__assitants__form-2">
                <div className="activities-container__form-section__assitants__form-2__field">
                <SelectDropdown
                    selectValue={selectedActivity}
                    label="Actividad"
                    options={activities || []}
                    keyLabel="name"
                    keyValue="_id"
                    targetKey="_id"
                    handleValue={(value) => setSelectedActivity(value._id)}
                />
              </div>
            </form>
        );
    }

    const renderDeliveryAct = () => {
        return (
            <>
                {renderEventInput()}
                {renderBeneficiarySection()}
            </>
        );
    }

    const renderEventAssistance = () => {
        return (
            <>
              {renderEventInput()}
            </>
        );
    }

    const renderActivityAssistance = () => {
        return (
            <>
              {renderActivityInput()}
            </>
        );
    }

    const renderBeneficiarySection = () => {
        return (
            <>
                {renderBeneficiarySearch()}
                {beneficiaries.length > 0 && renderBenList()}
            </>
        )
    }

    const renderBenList = () => {
        return (
            <List className="beneficiaries-list" sx={{ width: '100%', maxHeight: 250, bgcolor: 'background.paper' }}>
              {beneficiaries.length > 0 && beneficiaries.map((ben, index) => {
                const labelId = `checkbox-list-secondary-label-${ben._id}`;
                return (
                  <ListItem
                    key={ben._id}
                    disablePadding
                  >
                    <ListItemButton
                        selected={selectedIndex === index}
                        onClick={() => handleSelectedBend(ben, index)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={`Avatar n°${ben.identification}`}
                          src={`${ben.photo_url}`}
                        />
                      </ListItemAvatar>
                      <ListItemText id={labelId} primary={`${ben.first_name} ${ben.first_last_name}`} />
                      <ListItemText id={labelId} primary={`${ben.identification}`} />
                      <ListItemText id={labelId} primary={`${ben.association?.name || "N/A"}`} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
        );
    }

    const renderBeneficiarySearch = () => {
        return (
            <>
                <Search
                    label="Buscar beneficiario"
                    width={"100%"}
                    searchFunction={async (value: string) => {
                    try {
                        const { result } = await getBeneficiariesList(value, 1, 4);
                        const { data } = result;
                        setBeneficiaries(data);
                    } catch (err) {
                        console.error(err);
                    }
                    }}
                    voidInputFunction={getBeneficiaries}
                />
            </>
        );
    }

  return (
    <>
      <section className="assistance-container">
        <header className="assistance-container__actions">
          <div className="content-page-title">
            <Typography variant="h5" className="page-header">
              Generar reportes
            </Typography>
            <span className="page-subtitle">
              Podrás generar diferentes reportes de la información registrada en el sistema.
            </span>
          </div>
        </header>

        <Paper elevation={1} className="assistance-container__form-section">
          <Stack direction="row" spacing={4}>
            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                <SelectDropdown
                    selectValue={selectedReport}
                    label="Tipo de reporte"
                    options={reportType || []}
                    keyLabel="text"
                    keyValue="key"
                    targetKey="key"
                    handleValue={(value) => onSelectType(value)}
                />
            </div>
            <ToggleButtonGroup
                value={fileType}
                exclusive
                onChange={(e, value) => setFileType(value)}
                aria-label="text alignment"
                disabled={disableFileType}
                >
                    <ToggleButton value={reportFileType.PDF} aria-label="left aligned">
                        {reportFileType.PDF}
                    </ToggleButton>
                    <ToggleButton value={reportFileType.EXCEL} aria-label="centered">
                        {reportFileType.EXCEL}
                    </ToggleButton>
                </ToggleButtonGroup>
          </Stack>
          <div className="activities-container__form-section__assitants">
            {selectedReport === REPORT_TYPE.DELIVERY_ACT && renderDeliveryAct()}
            {selectedReport === REPORT_TYPE.EVENT_ASSISTANCE && renderEventAssistance()}
            {selectedReport === REPORT_TYPE.ACTIVITY_ASSISTANCE && renderActivityAssistance()}
          </div>
        </Paper>
      </section>
      <SaveCancelControls
        saveText="Generar reporte"
        disabled={disabledReportButton()}
        handleSave={() => generateReport() }
      />
    </>
  );
}

export default Reports;