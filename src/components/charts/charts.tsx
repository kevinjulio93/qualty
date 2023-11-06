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
            <div ref={chartRef} />
        </>
    );
}

export default Charts;