export const enum REPORT_TYPE {
    EVENT_ASSISTANCE = 'EVENT_ASSISTANCE',
    DELIVERY_ACT = 'DELIVERY_ACT',
    ACTIVITY_ASSISTANCE = 'ACTIVITY_ASSISTANCE',
    WORKSHOPS_LIST = 'WORKSHOPS_LIST',
    RATINGS_LIST = 'RATINGS_LIST',
    DELIVERY_LIST = 'DELIVERY_LIST',
    ACTIVITY_LIST = 'ACTIVITY_LIST',
    WORKSHOP_DETAIL = 'WORKSHOP_DETAIL',
    RATINGS_DETAIL = 'RATINGS_DETAIL',
    EVENT_ASSISTANCE_BY_ASSOCIATION = 'EVENT_ASSISTANCE_BY_ASSOCIATION',
    ACTIVITY_ASSISTANCE_BY_ASSOCIATION = 'ACTIVITY_ASSISTANCE_BY_ASSOCIATION',
    BENEFICIARY_LIST = 'BENEFICIARY_LIST',
    WITHOUT_SUPPORTS = 'WITHOUT_SUPPORTS',
    BENEFICIARY_SUMMARY = 'BENEFICIARY_SUMMARY',
    RATINGS_SUMMARY = 'RATINGS_SUMMARY',
    GENERAL_RATINGS_SUMMARY = 'GENERAL_RATINGS_SUMMARY',
    WORKSHOPS_SUMMARY = 'WORKSHOPS_SUMMARY',
    GENERAL_WORKSHOPS_SUMMARY = 'GENERAL_WORKSHOPS_SUMMARY',
    EVENT_SUMMARY = 'EVENT_SUMMARY',
    EVENT_ASSISTANCE_DIFF = 'EVENT_ASSISTANCE_DIFF',
    BENEFICIARIES_BY_USER = "BENEFICIARIES_BY_USER",
    ACTIVITIES_LIST = "ACTIVITIES_LIST",
    EVENT_DELIVERIES = "EVENT_DELIVERIES",
    ITEM_DELIVERED = "ITEM_DELIVERED",
}

export const reportType = [
    {
        text: 'Acta de entrega',
        key: REPORT_TYPE.DELIVERY_ACT
    },
    {
        text: 'Asistencia a evento',
        key: REPORT_TYPE.EVENT_ASSISTANCE
    },
    {
        text: 'Asistencia a actividad',
        key: REPORT_TYPE.ACTIVITY_ASSISTANCE
    },
    {
        text: 'Listado de beneficiarios',
        key: REPORT_TYPE.BENEFICIARY_LIST
    },
    {
        text: 'Beneficiarios sin soportes',
        key: REPORT_TYPE.WITHOUT_SUPPORTS
    },

    {
        text: 'Consolidado de valoraciones',
        key: REPORT_TYPE.GENERAL_RATINGS_SUMMARY
    },
    {
        text: 'Consolidado de talleres',
        key: REPORT_TYPE.GENERAL_WORKSHOPS_SUMMARY
    },
    {
        text: 'Consolidado de beneficiario',
        key: REPORT_TYPE.BENEFICIARY_SUMMARY
    },
    {
        text: 'Consolidado de evento',
        key: REPORT_TYPE.EVENT_SUMMARY
    },
    {
        text: 'Actividad contra Eventos',
        key: REPORT_TYPE.EVENT_ASSISTANCE_DIFF
    },
    {
        text: 'Registros por usuario',
        key: REPORT_TYPE.BENEFICIARIES_BY_USER
    },
    {
        text: 'Listado de actividades',
        key: REPORT_TYPE.ACTIVITIES_LIST
    },
    {
        text: 'Diferencia Asistencia - Entregas',
        key: REPORT_TYPE.EVENT_DELIVERIES
    },
    {
        text: 'Entregas por artículos',
        key: REPORT_TYPE.ITEM_DELIVERED
    }
];

export const promotorReports = [
    {
        text: 'Consolidado de beneficiario',
        key: REPORT_TYPE.BENEFICIARY_SUMMARY
    }
];

export const profesionalReports = [
    {
        text: 'Consolidado de valoraciones',
        key: REPORT_TYPE.RATINGS_SUMMARY
    },
    {
        text: 'Consolidado de talleres',
        key: REPORT_TYPE.WORKSHOPS_SUMMARY
    }
];