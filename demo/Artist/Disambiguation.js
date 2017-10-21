import React from 'react'
import { withData } from '../../src'

export function Disambiguation ({ className, artist }) {
  if (!artist) {
    return null
  }
  return <p className={className}>{artist.disambiguation}</p>
}

export default withData(Disambiguation, {
  fragments: {
    // Define what we need to add onto the `artist` object.
    // This can also be an array.
    artist: 'disambiguation'
  }
  // If we don't want to add any fragments, or want to retrieve additional
  // ancestor objects beyond what we're extending, we could define a `props`
  // option here with a list of objects to receive as props.
})
