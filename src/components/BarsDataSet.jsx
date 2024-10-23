import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BarsDataSet({ uData = [], pData = [], vData = [], xLabels = [] }) {
    return (
      <BarChart
        width={750}
        height={300}
        series={[
          { data: pData, label: 'Requests', id: 'pvId' },
          { data: uData, label: 'Validations', id: 'uvId' },
          /* { data: vData, label: 'Verifications', id: 'vvId' }, */
        ]}
        xAxis={[{ data: xLabels, scaleType: 'band' }]}
      />
    );
}
  
