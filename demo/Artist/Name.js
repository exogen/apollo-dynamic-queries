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
    // Can also be an array.
    artist: 'name'
  }
})
