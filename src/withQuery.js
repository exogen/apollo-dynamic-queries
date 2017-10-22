import React from 'react'
import PropTypes from 'prop-types'
import { withApollo } from 'react-apollo'
import getDisplayName from './getDisplayName'
import QueryObject from './QueryObject'

/**
 * Make a GraphQL query after mounting that will include the fragments that any
 * descendant components have added.
 *
 * @param {Function} Component - The component to enhance.
 * @param {Object} options - The enhanced component configuration.
 * @param {Object} options.objects - A mapping of object names to their resolver
 * functions, which will receive the `data` value from the resolved query and
 * should return the object's value.
 * @param {Function} options.query - A function that will be called with the
 * finalized fragments added by any descendants and should return the resulting
 * GraphQL query.
 * @param {Function} [options.variables] - A function that will receive the
 * props passed to this component and should return the variables to include in
 * the GraphQL query.
 * @param {Function} [options.props] - A function to transform the default props
 * into the desired props that `withQuery` will send to the wrapped component.
 */
export default function withQuery (Component, options) {
  const objectDefinitions = options.objects || {}

  class WithQuery extends React.Component {
    static displayName = `WithData(${getDisplayName(Component)})`

    static propTypes = {
      client: PropTypes.object
    }

    // Being wrapped in another component that makes a query is fine...
    static contextTypes = {
      apolloDynamicQueries: PropTypes.object
    }

    static childContextTypes = {
      apolloDynamicQueries: PropTypes.object
    }

    objects = new Map(Object.keys(objectDefinitions).map(name => {
      const object = new QueryObject(objectDefinitions[name])
      return [name, object]
    }))

    state = {
      loading: false,
      error: null,
      data: null,
      objects: {}
    }

    buildQuery () {
      if (typeof options.query === 'function') {
        const fragments = {}
        this.objects.forEach((object, name) => {
          fragments[name] = object.fragmentString()
        })
        return options.query(fragments, this.props)
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
      const objects = {}
      this.objects.forEach((object, name) => {
        objects[name] = object.resolve(result.data)
      })
      return objects
    }

    fetchQuery () {
      const query = this.buildQuery()
      const variables = this.buildVariables()
      this.setState({
        loading: true,
        error: null
      })
      return this.props.client
        .query({ query, variables })
        .then(result => {
          this.setState({
            loading: result.loading,
            error: null,
            data: result.data,
            objects: this.buildObjects(result)
          })
        })
        .catch(err => {
          this.setState({
            loading: false,
            error: err
          })
        })
    }

    getChildContext () {
      const existingContext = this.context.apolloDynamicQueries || {}
      const existingObjects = existingContext.objects || []
      return {
        apolloDynamicQueries: {
          ...existingContext,
          // Merge the `QueryObject` instances of ancestors and this component.
          objects: new Map([
            ...existingObjects,
            ...this.objects
          ])
        }
      }
    }

    componentDidMount () {
      this.fetchQuery()
    }

    componentWillUpdate (nextProps, nextState) {
      if (this.state.objects !== nextState.objects) {
        Object.keys(nextState.objects).forEach(name => {
          const object = this.objects.get(name)
          const value = nextState.objects[name]
          object.notifySubscribers(value)
        })
      }
    }

    render () {
      const { client, ...rest } = this.props
      const data = {
        ...this.state.objects,
        loading: this.state.loading,
        error: this.state.error
      }
      let props = { ...rest, data }
      if (options.props) {
        props = options.props(props)
      }
      return (
        <Component {...props} />
      )
    }
  }

  return withApollo(WithQuery)
}
