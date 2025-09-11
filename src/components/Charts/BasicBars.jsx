import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars(data) {
    if (!data || !Array.isArray(data.data)) {
        return <div>Loading chart data...</div>;
    }

    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const counts = allMonths?.map(month => {
        const monthData = data?.data?.find(item => item?.month === month);
        return monthData ? monthData?.count : 0;
    });

    return (
        <div className="py-4 bg-white rounded-2xl w-full">
            <BarChart
                xAxis={[{
                    data: allMonths,
                    scaleType: 'band',
                }]}
                series={[{
                    data: counts,
                    color: '#2563eb',
                    label: 'Applications Per Month',
                }]}
                borderRadius={8}
                height={350}
            />
        </div>
    );
}
