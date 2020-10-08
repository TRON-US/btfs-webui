import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'

function makeBread (root) {
  if (root.endsWith('/')) {
    root = root.substring(0, root.length - 1)
  }

  const parts = root.split('/').map(part => {
    return {
      name: part,
      path: part
    }
  })

  for (let i = 1; i < parts.length; i++) {
    const name = parts[i].name

    parts[i] = {
      name: name,
      path: parts[i - 1].path + '/' + parts[i].path
    }

    if (name.length >= 30) {
      parts[i].realName = name
      parts[i].name = `${name.substring(0, 4)}...${name.substring(name.length - 4, name.length)}`
    }
  }

  parts.shift()
  parts[0].disabled = true

  parts[parts.length - 1].last = true
  return parts
}

class Breadcrumbs extends React.Component {
  state = {
    overflows: false
  }

  componentDidUpdate (_, prevState) {
    const a = this.anchors
    const overflows = a ? (a.offsetHeight < a.scrollHeight || a.offsetWidth < a.scrollWidth) : false

    if (prevState.overflows !== overflows) {
      this.setState({ overflows })
    }
  }

  render () {
    const { t, tReady, path, onClick, className = '', ...props } = this.props

    const cls = `Breadcrumbs flex items-center sans-serif overflow-hidden ${className}`
    const bread = makeBread(path)
    const root = bread[0]

    if (root.name === 'files' || root.name === 'pins') {
      bread.shift()
    }

    const res = bread.map((link, index) => ([
      <span key={`${index}link`} className='dib pv1 pr1' style={{ direction: 'ltr' }}>
        { link.disabled
          ? <span title={link.realName} className='gray'>{link.name}</span>
          /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
          : <a title={link.realName} className={`pointer navy ${link.last ? 'b' : ''}`} onClick={() => onClick(link.path)}>
            {link.name}
          </a>
        }
      </span>,
      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
      <a key={`${index}divider`} className='dib pr1 pv1 mid-gray v-top'>/</a>
    ]))

    if (res.length === 0) {
      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
      res.push(<a key='root-divider' className='dib pv1 mid-gray v-top'>/</a>)
    }

    res.reverse()

    return (
      <nav aria-label={t('breadcrumbs')} className={cls} {...props}>
        { (root.name === 'files' || root.name === 'pins') &&
        /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
        <a key={`${root.name}-label`}
          title={root.realName}
          onClick={() => onClick(root.path)}
          className='f7 pointer pa1 bg-navy br2 mr2 white'>
          {t(root.name)}
        </a>
        }

        <div className='nowrap overflow-hidden relative' ref={(el) => { this.anchors = el }} style={{ direction: 'rtl' }}>
          <div className={`absolute left-0 top-0 h-100 w1 ${this.state.overflows ? '' : 'dn'}`} style={{ background: 'linear-gradient(to right, #ffffff 0%, transparent 100%)' }} />
          {res}
        </div>
      </nav>
    )
  }
}

Breadcrumbs.propTypes = {
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired
}

export default withTranslation('files')(Breadcrumbs)
