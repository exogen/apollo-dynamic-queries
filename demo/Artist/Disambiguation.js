import React from 'react'
import { withData } from '../../src'

export function Disambiguation ({ className, data }) {
  if (!data.artist) {
    return null
  }
  return <p className={className}>{data.artist.disambiguation}</p>
}

export default withData(Disambiguation, {
  // By default, we'll receive any object in `data` that we extend in
  // `fragments`. But if we want to receive additional objects, or don't want
  // to add any fragments, we could define an `objects` array here.
  fragments: {
    // Define what we need to add onto the `artist` object.
    // This can also be an array.
    artist: 'disambiguation'
  }
})
