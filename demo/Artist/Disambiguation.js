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
    // Can also be an array.
    artist: 'disambiguation'
  }
})
