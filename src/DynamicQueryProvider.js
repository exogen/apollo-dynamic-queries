import React from 'react'
import PropTypes from 'prop-types'

export default class DynamicQueryProvider extends React.Component {
  static propTypes = {
    client: PropTypes.object.isRequired
  }

  static childContextTypes = {
    graphql: PropTypes.object
  }

  getChildContext () {
    return {
      graphql: {
        client: this.props.client
      }
    }
  }

  render () {
    return this.props.children
  }
}
