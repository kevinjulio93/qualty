export const enum REPORT_TYPE {
    EVENT_ASSISTANCE = 'EVENT_ASSISTANCE',
    DELIVERY_ACT = 'DELIVERY_ACT'
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