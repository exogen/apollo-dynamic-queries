import React from 'react'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { DynamicQueryProvider } from '../src'
import Artist from './Artist'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://graphbrainz.herokuapp.com/' }),
  cache: new InMemoryCache()
})

export default function App () {
  return (
    <div>
      <DynamicQueryProvider client={client}>
        <Artist mbid='5b11f4ce-a62d-471e-81fc-a69a8278c7da'>
          <header>
            <Artist.Name />
            <Artist.Disambiguation />
          </header>
        </Artist>
      </DynamicQueryProvider>
    </div>
  )
}
