import React from 'react'
import PropTypes from 'prop-types'
import getDisplayName from './getDisplayName'

/**
 * Receive object values from one or more ancestor component's query, and
 * optionally extend them with fragments. The component will receive each
 * object's latest value in the `data` prop.
 *
 * @param {Function} Component - The component to enhance.
 * @param {Object} options - The enhanced component configuration.
 * @param {Array} [options.objects] - The names of the objects to receive.
 * @param {Object} [options.fragments] - A mapping of object names to fragment
 * strings or lists of fragment strings with which to extend each object.
 * @param {Function} [options.props] - A function to transform the default props
 * into the desired props that `withData` will send to the wrapped component.
 */
export default function withData (Component, options = {}) {
  return class WithData extends React.Component {
    static displayName = `WithData(${getDisplayName(Component)})`

    static contextTypes = {
      apolloDynamicQueries: PropTypes.object
    }

    // Save subscriptions so we can unsubscribe later if necessary.
    subscriptions = []

    // Each object and its latest value will be stored as a key in `state`.
    state = {}

    componentWillMount () {
      const extendedObjects = []
      if (options.fragments) {
        Object.keys(options.fragments).forEach(name => {
          const object = this.context.apolloDynamicQueries.objects.get(name)
          object.addFragments(options.fragments[name])
          extendedObjects.push(name)
        })
      }
      const objects = options.objects || extendedObjects
      objects.forEach(name => {
        const object = this.context.apolloDynamicQueries.objects.get(name)
        const callback = value => this.setState({ [name]: value })
        object.subscribe(callback)
        this.subscriptions.push([name, callback])
      })
    }

    componentWillUnmount () {
      // TODO: Also remove the fragments? Not sure.
      this.subscriptions.forEach(([name, callback]) => {
        const object = this.context.apolloDynamicQueries.objects.get(name)
        object.unsubscribe(callback)
      })
    }

    render () {
      let props = {
        ...this.props,
        data: { ...this.state }
      }
      if (options.props) {
        props = options.props(props)
      }
      return <Component {...props} />
    }
  }
}
