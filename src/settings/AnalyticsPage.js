import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import Title from './Title'
import Box from '../components/box/Box'
// import AnalyticsToggle from '../components/analytics-toggle/AnalyticsToggle'

export const AnalyticsPage = ({ t }) => (
  <div data-id='AnalyticsPage' className='mw9 center'>
    <Helmet>
      <title>{t('title')} | BTFS</title>
    </Helmet>

    <Box>
      <Title>{t('analytics')}</Title>
      {/*<AnalyticsToggle t={t} open />*/}
    </Box>
  </div>
)

export default withTranslation('settings')(AnalyticsPage)
