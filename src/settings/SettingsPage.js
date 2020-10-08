import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'redux-bundler-react'
import { withTranslation, Trans } from 'react-i18next'
import ReactJoyride from 'react-joyride'
// Tour
import { settingsTour } from '../lib/tours'
import withTour from '../components/tour/withTour'
import { getJoyrideLocales } from '../helpers/i8n'
// Components
import Tick from '../icons/GlyphSmallTick'
import Box from '../components/box/Box'
import Button from '../components/button/Button'
import LanguageSelector from '../components/language-selector/LanguageSelector'
// import AnalyticsToggle from '../components/analytics-toggle/AnalyticsToggle'
import JsonEditor from './editor/JsonEditor'
import Experiments from '../components/experiments/ExperimentsPanel'
import Title from './Title'

const PAUSE_AFTER_SAVE_MS = 3000

export const SettingsPage = ({
  t, tReady, isIpfsConnected,
  isConfigBlocked, isLoading, isSaving,
  hasSaveFailed, hasSaveSucceded, hasErrors, hasLocalChanges, hasExternalChanges,
  config, onChange, onReset, onSave, editorKey, analyticsEnabled, doToggleAnalytics,
  toursEnabled, handleJoyrideCallback
}) => (
  <div data-id='SettingsPage' className='mw9 center'>
    <Helmet>
      <title>{t('title')} - BTFS</title>
    </Helmet>

    <Box className='mb3 pa4'>
      <div className='mb4 joyride-settings-language'>
        <Title>{t('language')}</Title>
        <LanguageSelector t={t} />
      </div>

      <div className='joyride-settings-analytics'>
        <Title>{t('analytics')}</Title>
        <AnalyticsToggle t={t} doToggleAnalytics={doToggleAnalytics} analyticsEnabled={analyticsEnabled} />
      </div>
    </Box>

    <Experiments t={t} />

    <Box className='mb3 pa4 joyride-settings-config'>
      <Title>{t('config')}</Title>
      <div className='flex pb3'>
        <div className='flex-auto'>
          <div className='mw7'>
            <SettingsInfo
              t={t}
              tReady={tReady}
              config={config}
              isIpfsConnected={isIpfsConnected}
              isConfigBlocked={isConfigBlocked}
              isLoading={isLoading}
              hasExternalChanges={hasExternalChanges}
              hasSaveFailed={hasSaveFailed}
              hasSaveSucceded={hasSaveSucceded} />
          </div>
        </div>
        { config ? (
          <div className='flex flex-column justify-center flex-row-l items-center-l'>
            <Button
              minWidth={100}
              height={40}
              bg='bg-charcoal'
              disabled={isSaving || (!hasLocalChanges && !hasExternalChanges)}
              onClick={onReset}>
              {t('reset')}
            </Button>
            <SaveButton
              t={t}
              tReady={tReady}
              hasErrors={hasErrors}
              hasSaveFailed={hasSaveFailed}
              hasSaveSucceded={hasSaveSucceded}
              hasLocalChanges={hasLocalChanges}
              hasExternalChanges={hasExternalChanges}
              isSaving={isSaving}
              onClick={onSave} />
          </div>
        ) : null }
      </div>
      { config ? (
        <JsonEditor
          value={config}
          onChange={onChange}
          readOnly={isSaving}
          key={editorKey} />
      ) : null }
    </Box>

    <ReactJoyride
      run={toursEnabled}
      steps={settingsTour.getSteps({ t, Trans })}
      styles={settingsTour.styles}
      callback={handleJoyrideCallback}
      continuous
      scrollToFirstStep
      locale={getJoyrideLocales(t)}
      showProgress />
  </div>
)

const SaveButton = ({ t, hasErrors, hasSaveFailed, hasSaveSucceded, isSaving, hasLocalChanges, hasExternalChanges, onClick }) => {
  const bg = hasSaveSucceded ? 'bg-green' : 'bg-teal'
  return (
    <Button
      minWidth={100}
      height={40}
      className='mt2 mt0-l ml2-l'
      bg={bg}
      disabled={!hasLocalChanges || hasErrors}
      danger={hasSaveFailed || hasExternalChanges}
      onClick={onClick}>
      { hasSaveSucceded && !hasSaveFailed ? (
        <Tick height={16} className='fill-snow' style={{ transform: 'scale(3)' }} />
      ) : (
        isSaving ? t('saving') : t('save')
      )}
    </Button>
  )
}

const SettingsInfo = ({ t, isIpfsConnected, isConfigBlocked, hasExternalChanges, hasSaveFailed, hasSaveSucceded, isLoading, config }) => {
  if (isConfigBlocked) {
    return (
      <p className='ma0 lh-copy charcoal f5 mw7'>
        {t('configApiNotAvailable')}
      </p>
    )
  } else if (!isIpfsConnected) {
    return (
      <p className='ma0 lh-copy charcoal f5 mw7'>
        {t('ipfsDaemonOffline')}
      </p>
    )
  } else if (!config) {
    return (
      <p className='ma0 lh-copy charcoal f5 mw7'>
        { isLoading ? t('fetchingSettings') : t('settingsUnavailable') }
      </p>
    )
  } else if (hasExternalChanges) {
    return (
      <p className='ma0 lh-copy red f5 mw7'>
        <Trans i18nKey='settingsHaveChanged'>
          The settings have changed, please click <strong>Reset</strong> to update the editor contents
        </Trans>
      </p>
    )
  } else if (hasSaveFailed) {
    return (
      <p className='ma0 lh-copy red fw6 f5 mw7'>
        {t('errorOccured')}
        <span className='db fw4 f6 charcoal-muted'>{t('checkConsole')}</span>
      </p>
    )
  } else if (hasSaveSucceded) {
    return (
      <p className='ma0 lh-copy green fw6 f5 mw7'>
        {t('changesSaved')}
        <span className='db fw4 f6 charcoal-muted'>{t('settingsWillBeUsedNextTime')}</span>
      </p>
    )
  }
  return (
    <p className='ma0 mr2 lh-copy charcoal f6'>
      {t('ipfsConfigDescription')} <a href='https://github.com/ipfs/go-ipfs/blob/master/docs/config.md' rel='noopener noreferrer' target='_blank' className='link blue'>{t('ipfsConfigHelp')}</a>
    </p>
  )
}

export class SettingsPageContainer extends React.Component {
  state = {
    // valid json?
    hasErrors: false,
    // we edited it
    hasLocalChanges: false,
    // something else edited it
    hasExternalChanges: false,
    // mutable copy of the config
    editableConfig: this.props.config,
    // reset the editor on reset
    editorKey: Date.now()
  }

  onChange = (value) => {
    this.setState({
      hasErrors: !this.isValidJson(value),
      hasLocalChanges: this.props.config !== value,
      editableConfig: value
    })
  }

  onReset = () => {
    this.setState({
      hasErrors: false,
      hasLocalChanges: false,
      hasExternalChanges: false,
      editableConfig: this.props.config,
      editorKey: Date.now()
    })
  }

  onSave = () => {
    this.props.doSaveConfig(this.state.editableConfig)
  }

  isValidJson (str) {
    try {
      JSON.parse(str)
      return true
    } catch (err) {
      return false
    }
  }

  isRecent (msSinceEpoch) {
    return msSinceEpoch > Date.now() - PAUSE_AFTER_SAVE_MS
  }

  componentDidUpdate (prevProps) {
    if (this.props.configSaveLastSuccess !== prevProps.configSaveLastSuccess) {
      setTimeout(() => this.onReset(), PAUSE_AFTER_SAVE_MS)
    }
    if (prevProps.config !== this.props.config) {
      // no previous config, or we just saved.
      if (!prevProps.config || this.isRecent(this.props.configSaveLastSuccess)) {
        return this.setState({
          editableConfig: this.props.config
        })
      }
      // uh oh... something else edited the config while we were looking at it.
      if (this.props.config !== this.state.editableConfig) {
        return this.setState({
          hasExternalChanges: true
        })
      }
    }
  }

  render () {
    const { t, tReady, isConfigBlocked, ipfsConnected, configIsLoading, configLastError, configIsSaving, configSaveLastSuccess, configSaveLastError, isIpfsDesktop, analyticsEnabled, doToggleAnalytics, toursEnabled, handleJoyrideCallback } = this.props
    const { hasErrors, hasLocalChanges, hasExternalChanges, editableConfig, editorKey } = this.state
    const hasSaveSucceded = this.isRecent(configSaveLastSuccess)
    const hasSaveFailed = this.isRecent(configSaveLastError)
    const isLoading = configIsLoading || (!editableConfig && !configLastError)
    return (
      <SettingsPage
        t={t}
        tReady={tReady}
        isIpfsConnected={ipfsConnected}
        isConfigBlocked={isConfigBlocked}
        isLoading={isLoading}
        isSaving={configIsSaving}
        hasSaveFailed={hasSaveFailed}
        hasSaveSucceded={hasSaveSucceded}
        hasErrors={hasErrors}
        hasLocalChanges={hasLocalChanges}
        hasExternalChanges={hasExternalChanges}
        config={editableConfig}
        editorKey={editorKey}
        onChange={this.onChange}
        onReset={this.onReset}
        onSave={this.onSave}
        isIpfsDesktop={isIpfsDesktop}
        analyticsEnabled={analyticsEnabled}
        doToggleAnalytics={doToggleAnalytics}
        toursEnabled={toursEnabled}
        handleJoyrideCallback={handleJoyrideCallback} />
    )
  }
}

export const TranslatedSettingsPage = withTranslation('settings')(SettingsPageContainer)

export default connect(
  'selectConfig',
  'selectIpfsConnected',
  'selectIsConfigBlocked',
  'selectConfigLastError',
  'selectConfigIsLoading',
  'selectConfigIsSaving',
  'selectConfigSaveLastSuccess',
  'selectConfigSaveLastError',
  'selectIsIpfsDesktop',
  'selectToursEnabled',
  'selectAnalyticsEnabled',
  'doToggleAnalytics',
  'doSaveConfig',
  withTour(TranslatedSettingsPage)
)
