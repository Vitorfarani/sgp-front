import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HC_BR } from '@/utils/helpers/HighChartLangPt';
import HighchartsExporting from 'highcharts/modules/exporting'
import HighChartDrilldown from 'highcharts/modules/drilldown';
import HighChartThemeSandSignika from 'highcharts/themes/brand-light';
import HighChartThemeDarkUnica from 'highcharts/themes/brand-dark';
import { useTheme } from '@/utils/context/ThemeProvider copy';

HighchartsExporting(Highcharts)
HighChartDrilldown(Highcharts)


const CoreChart = ({ options }) => {
  const { colorModeSelected } = useTheme();

  const defaultOptions = {
    exporting: {
      enabled: true,
    },
   
    lang: HC_BR,
    credits: {
      enabled: false,
    },
  };

  useEffect(() => {
    if (colorModeSelected === "dark") {
      HighChartThemeDarkUnica(Highcharts)
    } else {
      HighChartThemeSandSignika(Highcharts)
    }
    Highcharts.setOptions({
      ...defaultOptions,
      ...options,
    })
  }, [options]);

  return (
    <HighchartsReact highcharts={Highcharts} options={{
      chart: {
        backgroundColor: 'transparent',
      },
      ...options
    }} />
  );
};

export default CoreChart;
