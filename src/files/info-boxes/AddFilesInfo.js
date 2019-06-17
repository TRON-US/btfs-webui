import React from 'react'
import { connect } from 'redux-bundler-react'
import { translate, Trans } from 'react-i18next'
import Box from '../../components/box/Box'

const AddFilesInfo = () => (
  <div className='mv4 tc navy f5' >
    <Box style={{ background: 'rgba(105, 196, 205, 0.1)' }}>
      <Trans i18nKey='addFilesInfo'>
        <p className='ma0'>Add files to your local BTFS node by clicking the <strong>Add to BTFS</strong> button above.</p>
      </Trans>
    </Box>
  </div>
)

export default connect(translate('files')(AddFilesInfo))
