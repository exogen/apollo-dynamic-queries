import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { withQuery } from '../../src'
import Name from './Name'
import Disambiguation from './Disambiguation'

Artist.propTypes = {
  mbid: PropTypes.string.isRequired
}

export function Artist ({ className, loading, error, artist, children }) {
  return (
    <div className={className}>
      {loading ? <p>Loading…</p> : null}
      {error ? (
        <dl>
          <dt>Error:</dt>
          <dd>{error.message}</dd>
        </dl>
      ) : null}
      {children}
    </div>
  )
}

const ArtistWithQuery = withQuery(Artist, {
  objects: {
    artist: data => data.lookup.artist
  },
  query: fragments => gql`
    query Artist($mbid: MBID!) {
      lookup {
        artist(mbid: $mbid) {
          # FIXME: This field is just here so that there is at least one field,
          # in case there are no fragments...
          mbid
          ${fragments.artist}
        }
      }
    }
  `,
  variables: props => ({ mbid: props.mbid })
})
ArtistWithQuery.Name = Name
ArtistWithQuery.Disambiguation = Disambiguation

export default ArtistWithQuery
