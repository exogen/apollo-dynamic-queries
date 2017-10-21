import React from 'react'
import { createNetworkInterface, ApolloClient, ApolloProvider } from 'react-apollo'
import Artist from './Artist'

const networkInterface = createNetworkInterface({
  uri: 'https://graphbrainz.herokuapp.com/'
})

const client = new ApolloClient({ networkInterface })

export default function App () {
  return (
    <ApolloProvider client={client}>
      <div>
        <Artist mbid='5b11f4ce-a62d-471e-81fc-a69a8278c7da'>
          <header>
            <Artist.Name />
            <Artist.Disambiguation />
          </header>
          <small>This artist query should request both the name and disambiguation fields.</small>
        </Artist>
        <Artist mbid='fca827f9-7bf0-41c2-9f87-d2af0caa20a3'>
          <Artist.Name />
          <small>This artist query should only request the name!</small>
        </Artist>
        <Artist mbid='c8da2e40-bd28-4d4e-813a-bd2f51958ba8'>
          <Artist.Disambiguation />
          <small>This artist query should only request the disambiguation!</small>
        </Artist>
      </div>
    </ApolloProvider>
  )
}
