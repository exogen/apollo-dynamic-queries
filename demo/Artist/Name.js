import React from 'react'
import { withData } from '../../src'

export function Name ({ className, artist }) {
  if (!artist) {
    return null
  }
  return <h1 className={className}>{artist.name}</h1>
}

export default withData(Name, {
  fragments: {
    // Define what we need to add onto the `artist` object.
    // This can also be an array.
    artist: 'name'
  }
  // If we don't want to add any fragments, or want to retrieve additional
  // ancestor objects beyond what we're extending, we could define a `props`
  // option here with a list of objects to receive as props.
})
