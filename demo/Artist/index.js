import React from 'react'
import PropTypes from 'prop-types'
import { gql } from 'react-apollo'
import { withQuery } from '../../src'
import Name from './Name'
import Disambiguation from './Disambiguation'

Artist.propTypes = {
  mbid: PropTypes.string.isRequired
}

export function Artist ({ className, loading, error, mbid, artist, children }) {
  return (
    <div className={className || 'Artist'}>
      <small>MBID: <code>{mbid}</code></small>
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
    // This will create a fragment extension point called `artist` and also
    // add a prop called `artist` with the return value of this function when
    // the query is resolved.
    artist: data => data.lookup.artist
  },
  // Because we defined an `artist` object above, the `fragments` argument to
  // this function will have an `artist` string, which will be the joined
  // fragments that any descendants added!
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
