import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'

export const AnalyticsPage = ({ t }) => (
  <div data-id='AnalyticsPage' className='mw9 center'>
    <Helmet>
      <title>{t('title')} | BTFS</title>
    </Helmet>
  </div>
)

export default withTranslation('settings')(AnalyticsPage)
