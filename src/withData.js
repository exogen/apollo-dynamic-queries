import React from 'react'
import PropTypes from 'prop-types'
import getDisplayName from './getDisplayName'

export default function withData (Component, options) {
  const {
    // A mapping of object names to query fragments to add to those objects.
    fragments = {},
    // A list of the object names that will be passed as props. Defaults to the
    // same objects that appear in `fragments`. TODO: Allow this to be an
    // object that maps prop names to transform functions?
    props = null
  } = options

  return class WithData extends React.Component {
    static displayName = `WithData(${getDisplayName(Component)})`

    static contextTypes = {
      apolloDynamicQueries: PropTypes.object
    }

    subscriptions = {}

    // Will store object values.
    state = {}

    componentWillMount () {
      const defaultProps = []
      Object.keys(fragments).forEach(key => {
        let value = fragments[key]
        if (Array.isArray(value)) {
          value = value.join('\n')
        }
        this.context.apolloDynamicQueries.objects[key].addFragment(value)
        defaultProps.push(key)
      })
      const finalProps = props || defaultProps
      finalProps.forEach(key => {
        const subscription = value => this.setState({ [key]: value })
        this.subscriptions[key] = subscription
        this.context.apolloDynamicQueries.objects[key].subscribe(subscription)
      })
    }

    componentWillUnmount () {
      Object.keys(this.subscriptions).forEach(key => {
        const subscription = this.subscriptions[key]
        this.context.apolloDynamicQueries.objects[key].unsubscribe(subscription)
        // TODO: Also remove the fragments? Not sure.
      })
    }

    render () {
      return <Component {...this.props} {...this.state} />
    }
  }
}
