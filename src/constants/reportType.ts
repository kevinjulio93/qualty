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
}

export const reportType = [
    {
        text: 'Acta de entrega',
        key: REPORT_TYPE.DELIVERY_ACT
    },
    {
        text: 'Asistencia a evento',
        key: REPORT_TYPE.EVENT_ASSISTANCE
    }
];