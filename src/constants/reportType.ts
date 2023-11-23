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
    WORKSHOPS_SUMMARY = 'WORKSHOPS_SUMMARY'
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
        key: REPORT_TYPE.RATINGS_SUMMARY
    },
    {
        text: 'Consolidado de talleres',
        key: REPORT_TYPE.WORKSHOPS_SUMMARY
    },
    {
        text: 'Consolidado de beneficiario',
        key: REPORT_TYPE.BENEFICIARY_SUMMARY
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