import { EChartsOption, init as initInstance } from 'echarts';
import { useEffect, useRef } from 'react';

interface IChartParams {
    options: EChartsOption;
}
function Charts (props: IChartParams) {
    const { options } = props;
    const chartRef = useRef(null);

    useEffect(() => {
        const myChart = initInstance(chartRef.current);
        myChart.setOption(options);
    
        return () => {
          myChart.dispose();
        };
    }, []);

    return (
        <>
            <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
        </>
    );
}

export default Charts;