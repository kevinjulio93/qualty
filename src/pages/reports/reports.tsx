import { useEffect, useState } from "react";
import {
    Avatar,
    FormControl,
    InputLabel,
    List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import SaveCancelControls from "../../components/saveActionComponent/saveCancelControls";
import { REPORT_TYPE, profesionalReports, promotorReports, reportType } from "../../constants/reportType";
import SelectDropdown from "../../components/select";
import { getAllEvents, getPdfEventAssistance, getPdfEventSummary } from "../../services/events.service";
import Search from "../../components/search/search";
import { getBeneficiariesList, getPdfListBeneficiarie } from "../../services/beneficiaries.service";
import "./reports.scss";
import { isEmpty } from "../../helpers/isEmpty";
import { getPdfDeliveryBeneficiarie } from "../../services/delivery.service";
import { getExcelActivityAssistance, getExcelActivityList, getExcelBeneficiaryList, getExcelEventActivityDiff, getExcelEventAssistance, getExcelEventDeliveries, getExcelItemDelivered } from "../../services/reports.service";
import { reportFileType } from "../../constants/reportFileType";
import { getAllActivities, getPdfAssistanceActivity } from "../../services/activities.service";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { getFilePdfRatings } from "../../services/rating.service";
import { workshops } from "../../constants/workshops";
import { getWorkshopListPdf } from "../../services/workshop.service";
import { getUserList } from "../../services/user.service";
import { getAllItems } from "../../services/inventory.service";

function Reports() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [eventList, setEventList] = useState(null);
    const [activities, setActivities] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [selectedBen, setSelectedBen] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [fileType, setFileType] = useState(reportFileType.PDF);
    const [disableFileType, setDisableFileType] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedWork, setSelectedWork] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [benInfo, setBenInfo] = useState(null);
    const loggedUser = useSelector((state: RootState) => state.auth.user);
    const userRol = loggedUser.role.role;

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
                    setFileType(reportFileType.PDF);
                    getEvents();
                    break;
                }
                case REPORT_TYPE.ACTIVITY_ASSISTANCE: {
                    setFileType(reportFileType.PDF);
                    getActivitiesList();
                    break;
                }
                case REPORT_TYPE.ACTIVITIES_LIST:
                case REPORT_TYPE.BENEFICIARY_LIST:
                case REPORT_TYPE.WITHOUT_SUPPORTS: {
                    setFileType(reportFileType.EXCEL);
                    setDisableFileType(true);
                    break;
                }
                case REPORT_TYPE.RATINGS_SUMMARY:
                case REPORT_TYPE.GENERAL_RATINGS_SUMMARY:
                case REPORT_TYPE.WORKSHOPS_SUMMARY:
                case REPORT_TYPE.GENERAL_WORKSHOPS_SUMMARY:
                case REPORT_TYPE.BENEFICIARY_SUMMARY: {
                    setFileType(reportFileType.PDF);
                    setDisableFileType(true);
                    break;
                }
                case REPORT_TYPE.EVENT_SUMMARY: {
                    setFileType(reportFileType.PDF);
                    setDisableFileType(true);
                    getEvents();
                    break;
                }
                case REPORT_TYPE.EVENT_ASSISTANCE_DIFF: {
                    setFileType(reportFileType.EXCEL);
                    setDisableFileType(true);
                    getEvents();
                    getActivitiesList();
                    break;
                }
                case REPORT_TYPE.BENEFICIARIES_BY_USER: {
                    setFileType(reportFileType.PDF);
                    setDisableFileType(true);
                    getUsersList();
                    break;
                }
                case REPORT_TYPE.EVENT_DELIVERIES: {
                    setFileType(reportFileType.EXCEL);
                    getEvents();
                    break;
                }
                case REPORT_TYPE.ITEM_DELIVERED: {
                    setFileType(reportFileType.EXCEL);
                    getItemList();
                    break;
                }
                default: break;
            }
        }
    }, [selectedReport]);

    //Resources requests
    const getEvents = async() => {
        try {
          const responseEvents = await getAllEvents(null, 1, 1000);
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
          const response = await getAllActivities("", 1, 1000);
          if (response.status === 200) {
            const { data: dataList } = response.result;
            setActivities(dataList);
          }
        } catch (error) {
          console.error(error);
        }
    }

    const getUsersList = async () => {
        try {
          const response = await getUserList("", 1, 1000);
          if (response.status === 200) {
            const { data: dataList } = response.result;
            setUsersList(dataList);
          }
        } catch (error) {
          console.error(error);
        }
    }

    const getItemList = async () => {
        try {
          const response = await getAllItems("", 1, 1000);
          if (response.status === 200) {
            const { data: dataList } = response.result.data;
            setItemList(dataList);
          }
        } catch (error) {
          console.error(error);
        }
    }

    //General methods
    const getReportsByRole = () => {
        switch(userRol) {
            case 'Promotor': {
                return promotorReports;
            }
            case 'Especialista':
            case 'Profesionales': {
                return profesionalReports;
            }
            case 'Auditor':
            case 'Super Admin': {
                return reportType;
            }
            default: return promotorReports;
        }
    }
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
        setBenInfo(ben);
        setSelectedBen(ben._id);
    }

    const clearProperties = () => {
        setSelectedBen(null);
        setSelectedEvent(null);
        setSelectedIndex(null);
        setStartDate(null);
        setEndDate(null);
        setSelectedRating(null);
        setSelectedWork(null);
        setSelectedActivity(null);
        setSelectedUser(null);
    }

    const disabledReportButton = () => {
        switch(selectedReport) {
            case REPORT_TYPE.DELIVERY_ACT: {
                return isEmpty(selectedEvent) || isEmpty(selectedBen);
            }
            case REPORT_TYPE.EVENT_DELIVERIES:
            case REPORT_TYPE.EVENT_SUMMARY:
            case REPORT_TYPE.EVENT_ASSISTANCE: {
                return isEmpty(selectedEvent);
            }
            case REPORT_TYPE.ACTIVITY_ASSISTANCE: {
                return isEmpty(selectedActivity);
            }
            case REPORT_TYPE.WITHOUT_SUPPORTS: {
                    return false;
            }
            case REPORT_TYPE.GENERAL_RATINGS_SUMMARY:
            case REPORT_TYPE.RATINGS_SUMMARY: {
                return isEmpty(startDate) || isEmpty(endDate) || isEmpty(selectedRating);
            }
            case REPORT_TYPE.ACTIVITIES_LIST:
            case REPORT_TYPE.BENEFICIARY_LIST:
            case REPORT_TYPE.BENEFICIARY_SUMMARY: {
                return isEmpty(startDate) || isEmpty(endDate);
            }
            case REPORT_TYPE.GENERAL_WORKSHOPS_SUMMARY:
            case REPORT_TYPE.WORKSHOPS_SUMMARY: {
                return isEmpty(startDate) || isEmpty(endDate);
            }
            case REPORT_TYPE.EVENT_ASSISTANCE_DIFF: {
                return isEmpty(selectedActivity) || isEmpty(selectedEvent);
            }
            case REPORT_TYPE.ITEM_DELIVERED: {
                return isEmpty(selectedItem);
            }
        }
    }

    const generateEventActPDF = async() => {
        await getPdfDeliveryBeneficiarie(selectedEvent, benInfo);
    }

    const generateExcelEventAssistance = async() => {
        await getExcelEventAssistance(selectedEvent);
    }

    const generatePDFEventAssistance = async() => {
        await getPdfEventAssistance(selectedEvent);
    }

    const generateExcelActivityAssistance = async() => {
        await getExcelActivityAssistance(selectedActivity);
    }

    const generatePDFActivityAssistance = async() => {
        await getPdfAssistanceActivity(selectedActivity);
    }

    const generateExcelBeneficiaryList = async() => {
        const config = { startDate: dayjs(startDate), endDate: dayjs(endDate)};
        await getExcelBeneficiaryList(REPORT_TYPE.BENEFICIARY_LIST, config);
    }

    const generateExcelBeneficiaryWithoutSupports = async() => {
        const config = { startDate: dayjs(startDate), endDate: dayjs(endDate)};
        await getExcelBeneficiaryList(REPORT_TYPE.WITHOUT_SUPPORTS, config);
    }

    const generateBeneficiarySummaryPDF = async() => {
        const config = { startDate: dayjs(startDate), endDate: dayjs(endDate), userId: selectedUser };
        await getPdfListBeneficiarie(config);
    }

    const generateRatingsSummaryPDF = async() => {
        const config = { startDate: dayjs(startDate), endDate: dayjs(endDate), valueTypeRating: selectedRating };
        await getFilePdfRatings(config, selectedReport);
    }

    const generateWorkshopsSummaryPDF = async() => {
        const config = { startDate: dayjs(startDate), endDate: dayjs(endDate), typeWorkShop: selectedWork };
        await getWorkshopListPdf(config, selectedReport);
    }

    const generateEventSummaryPDF = async() => {
        await getPdfEventSummary(selectedEvent);
    }

    const generateExcelEventActivityDiff = async() => {
        await getExcelEventActivityDiff(selectedActivity, selectedEvent);
    }

    const generateExcelActivityList = async() => {
        await getExcelActivityList(dayjs(startDate), dayjs(endDate));
    }

    const generateExcelEventDeliveries = async() => {
        await getExcelEventDeliveries(selectedEvent);
    }

    const generateExcelItemDelivered = async() => {
        await getExcelItemDelivered(selectedItem);
    }

    const REPORT_DICTIONARY = {
        [REPORT_TYPE.DELIVERY_ACT]: generateEventActPDF,
        [REPORT_TYPE.EVENT_ASSISTANCE]: fileType === reportFileType.EXCEL ? generateExcelEventAssistance : generatePDFEventAssistance,
        [REPORT_TYPE.ACTIVITY_ASSISTANCE]: fileType === reportFileType.EXCEL ? generateExcelActivityAssistance : generatePDFActivityAssistance,
        [REPORT_TYPE.BENEFICIARY_LIST]: generateExcelBeneficiaryList,
        [REPORT_TYPE.WITHOUT_SUPPORTS]: generateExcelBeneficiaryWithoutSupports,
        [REPORT_TYPE.BENEFICIARY_SUMMARY]: generateBeneficiarySummaryPDF,
        [REPORT_TYPE.RATINGS_SUMMARY]: generateRatingsSummaryPDF,
        [REPORT_TYPE.GENERAL_RATINGS_SUMMARY]: generateRatingsSummaryPDF,
        [REPORT_TYPE.WORKSHOPS_SUMMARY]: generateWorkshopsSummaryPDF,
        [REPORT_TYPE.GENERAL_WORKSHOPS_SUMMARY]: generateWorkshopsSummaryPDF,
        [REPORT_TYPE.EVENT_SUMMARY]: generateEventSummaryPDF,
        [REPORT_TYPE.EVENT_ASSISTANCE_DIFF]: generateExcelEventActivityDiff,
        [REPORT_TYPE.BENEFICIARIES_BY_USER]: generateBeneficiarySummaryPDF,
        [REPORT_TYPE.ACTIVITIES_LIST]: generateExcelActivityList,
        [REPORT_TYPE.EVENT_DELIVERIES]: generateExcelEventDeliveries,
        [REPORT_TYPE.ITEM_DELIVERED]: generateExcelItemDelivered,
    };

    //Reports layout renders

    const renderEventActivityDiff = () => {
        return (
            <>
                {renderEventInput()}
                {renderActivityInput()}
            </>
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

    const renderBeneficiarySummary = () => {
        return (
            <>
              {renderDateRange()}
            </>
        );
    }

    const renderRatingsSummary = () => {
        return (
            <>
              {renderRatingInput()}
              {renderDateRange()}
            </>
        );
    }

    const renderWorkshopsSummary = () => {
        return (
            <>
              {renderDateRange()}
            </>
        );
    }

    const renderGeneralWorkshopsSummary = () => {
        return (
            <>
              {renderDateRange()}
              {renderWorkshopInput()}
            </>
        );
    }

    const renderBeneficiariesByUser = () => {
        return (
            <>
              {renderDateRange()}
              {renderUserInput()}
            </>
        );
    }

    const renderActivityList = () => {
        return (
            <>
              {renderDateRange()}
            </>
        );
    }

    const renderItemDelivered = () => {
        return (
            <>
              {renderItemInput()}
            </>
        );
    }

    //Generic input renders
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

    const renderUserInput = () => {
        return (
            <form className="activities-container__form-section__assitants__form-2">
                <div className="activities-container__form-section__assitants__form-2__field">
                <SelectDropdown
                    selectValue={selectedUser}
                    label="Usuario"
                    options={usersList || []}
                    keyLabel="name"
                    keyValue="_id"
                    targetKey="_id"
                    handleValue={(value) => setSelectedUser(value._id)}
                />
              </div>
            </form>
        );
    }

    const renderWorkshopInput = () => {
        return (
            <FormControl sx={{width: '100%', marginTop: '20px'}}>
              <InputLabel id="demo-simple-select-label">Taller</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Taller a realizar"
                value={selectedWork}
                onChange={(e) => setSelectedWork(e.target?.value)}
              >
                {workshops.map((item, index) => {
                  return (
                    <MenuItem
                  key={"taller_no_" + index}
                  value={item}
                >
                  {item}
                </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
        );
    }

    const renderRatingInput = () => {
        return (
            <FormControl sx={{width: '100%', marginTop: '20px'}}>
                <InputLabel id="demo-simple-select-label">Valoración</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Valoración a realizar"
                    onChange={(e) => setSelectedRating(e?.target?.value)}
                    value={selectedRating}
                >
                    {}
                    <MenuItem key={"fisio"} value="Fisioterapia">
                        Fisioterapia
                    </MenuItem>
                    <MenuItem key={"psico"} value="Psicología">
                        Psicología
                    </MenuItem>
                    <MenuItem key={"opto"} value="Optometría">
                        Optometría
                    </MenuItem>
                    <MenuItem key={"odonto"} value="Odontología">
                        Odontología
                    </MenuItem>
                    <MenuItem key={"fono"} value="Fonoaudiología">
                        Fonoaudiología
                    </MenuItem>
                    <MenuItem key={"anam"} value="Anamnesis">
                        Anamnesis
                    </MenuItem>
                </Select>
            </FormControl>
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

    const renderBeneficiarySection = () => {
        return (
            <>
                {renderBeneficiarySearch()}
                {beneficiaries.length > 0 && renderBenList()}
            </>
        )
    }

    const renderDateRange = () => {
        return (
            <>
                <Stack direction={"row"} spacing={4} className="date-range-section">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        onChange={(newDate: Dayjs) => setStartDate(newDate.format())}
                        value={ startDate ? dayjs(startDate) : null}
                        label="Fecha inicial"
                    />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        onChange={(newDate: Dayjs) => setEndDate(newDate.format())}
                        value={ endDate ? dayjs(endDate) : null}
                        label="Fecha final"
                    />
                    </LocalizationProvider>
                </Stack>
            </>
        );
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

    const renderItemInput = () => {
        return (
            <form className="activities-container__form-section__assitants__form-2">
                <div className="activities-container__form-section__assitants__form-2__field">
                <SelectDropdown
                    selectValue={selectedItem}
                    label="Artículo"
                    options={itemList || []}
                    keyLabel="name"
                    keyValue="_id"
                    targetKey="_id"
                    handleValue={(value) => setSelectedItem(value._id)}
                />
              </div>
            </form>
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
                    options={getReportsByRole() || []}
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
            {selectedReport === REPORT_TYPE.BENEFICIARY_SUMMARY && renderBeneficiarySummary()}
            {selectedReport === REPORT_TYPE.BENEFICIARY_LIST && renderBeneficiarySummary()}
            {selectedReport === REPORT_TYPE.RATINGS_SUMMARY && renderRatingsSummary()}
            {selectedReport === REPORT_TYPE.GENERAL_RATINGS_SUMMARY && renderRatingsSummary()}
            {selectedReport === REPORT_TYPE.WORKSHOPS_SUMMARY && renderWorkshopsSummary()}
            {selectedReport === REPORT_TYPE.GENERAL_WORKSHOPS_SUMMARY && renderGeneralWorkshopsSummary()}
            {selectedReport === REPORT_TYPE.EVENT_SUMMARY && renderEventAssistance()}
            {selectedReport === REPORT_TYPE.EVENT_ASSISTANCE_DIFF && renderEventActivityDiff()}
            {selectedReport === REPORT_TYPE.BENEFICIARIES_BY_USER && renderBeneficiariesByUser()}
            {selectedReport === REPORT_TYPE.ACTIVITIES_LIST && renderActivityList()}
            {selectedReport === REPORT_TYPE.EVENT_DELIVERIES && renderEventAssistance()}
            {selectedReport === REPORT_TYPE.ITEM_DELIVERED && renderItemDelivered()}
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