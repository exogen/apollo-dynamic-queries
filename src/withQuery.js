import React from 'react'
import PropTypes from 'prop-types'
import getDisplayName from './getDisplayName'

export default function withQuery (Component, options) {
  // The objects defined in the query. Each object can be passed to descendants
  // as a prop using `withData()`.
  const objectDefinitions = options.objects || {}

  return class WithQuery extends React.Component {
    static displayName = `WithData(${getDisplayName(Component)})`

    // Being wrapped in another component that makes a query is fine...
    static contextTypes = {
      graphql: PropTypes.object
    }

    static childContextTypes = {
      graphql: PropTypes.object
    }

    fragments = Object.keys(objectDefinitions).reduce((fragments, key) => {
      fragments[key] = []
      return fragments
    }, {})

    subscriptions = Object.keys(
      objectDefinitions
    ).reduce((subscriptions, key) => {
      subscriptions[key] = []
      return subscriptions
    }, {})

    state = {
      loading: false,
      error: null,
      data: null,
      objects: {}
    }

    buildQuery () {
      if (typeof options.query === 'function') {
        const fragments = Object.keys(
          this.fragments
        ).reduce((fragments, key) => {
          fragments[key] = this.fragments[key].join('\n')
          return fragments
        }, {})
        return options.query(fragments)
      }
      return options.query
    }

    buildVariables () {
      if (typeof options.variables === 'function') {
        return options.variables(this.props)
      }
      return options.variables
    }

    buildObjects (result) {
      return Object.keys(objectDefinitions).reduce((output, key) => {
        output[key] = objectDefinitions[key](result.data)
        return output
      }, {})
    }

    fetchQuery () {
      const query = this.buildQuery()
      const variables = this.buildVariables()
      this.setState({ loading: true, error: null })
      return this.context.graphql.client
        .query({ query, variables })
        .then(result => {
          const objects = this.buildObjects(result)
          this.setState({ loading: result.loading, data: result.data, objects })
        })
        .catch(err => {
          this.setState({ loading: false, error: err })
        })
    }

    getChildContext () {
      const objects = Object.keys(objectDefinitions).reduce((objects, key) => {
        objects[key] = {
          addFragment: fragment => this.fragments[key].push(fragment),
          subscribe: callback => this.subscriptions[key].push(callback),
          unsubscribe: callback => {
            // Modify the subscriptions array in-place.
            const index = this.subscriptions[key].indexOf(callback)
            if (index !== -1) {
              this.subscriptions[key].splice(index, 1)
            }
          }
        }
        return objects
      }, {})
      return {
        graphql: {
          ...this.context.graphql,
          // Holds each object that can be extended via fragments and subscribed
          // to.
          objects: {
            ...this.context.graphql.objects,
            ...objects
          }
        }
      }
    }

    componentDidMount () {
      this.fetchQuery()
    }

    componentWillUpdate (nextProps, nextState) {
      if (this.state.objects !== nextState.objects) {
        Object.keys(nextState.objects).forEach(key => {
          const value = nextState.objects[key]
          this.subscriptions[key].forEach(callback => callback(value))
        })
      }
    }

    render () {
      return (
        <Component
          {...this.props}
          {...this.state.objects}
          loading={this.state.loading}
          error={this.state.error}
        />
      )
    }
  }
}
