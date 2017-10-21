# apollo-dynamic-queries

:warning: This project is highly experimental, unstable, and probably performs terribly!

## Setup

```console
$ git clone git@github.com:exogen/apollo-dynamic-queries.git
$ cd apollo-dynamic-queries
$ yarn
```

Run the demo:

```console
yarn run start
```

Open [http://localhost:8080/][dev server].


## How it works

1. The [DynamicQueryProvider][] sets up a context object to store stuff on and
   adds an Apollo client instance to it. We could just use ApolloProvider and
   access its client, this part isn’t really important.
2. The [withQuery][] HOC creates a component that will make a query. In the HOC
   configuration, the component can define some `objects`. These objects will
   (1) provide fragment extension points within the query and (2) be resolved
   into values that will be passed as props to the component. The component also
   configures a query and variables. See the [Artist][] component. (Note that
   adding Name and Disambiguation onto Artist as properties is just to make
   using them easier, it doesn’t inform the HOC or query in any way.)
3. The [withData][] HOC creates a component that can receive objects from an
   ancestor query as props and optionally extend its objects with fragments.
   (Fragments don’t have to use the full GraphQL fragment syntax, they can just
   be a list of fields – they’ll just be dumbly injected into the query using
   string interpolation. When a component wrapped with `withData` is mounting,
   it uses `context` to add its fragments to the ancestor’s objects and
   subscribe to changes. That way, if the component is never rendered, the
   fragments it adds will never be part of the query! See [Name][] and
   [Disambiguation][].
4. Nested queries should work just fine as long as they choose different object
   names. Components wrapped with `withData` should be able to access objects
   from multiple different ancestor queries. Nested objects using the same name
   as an ancestor should just mask the ancestor’s object within that subtree.

[DynamicQueryProvider]: src/DynamicQueryProvider.js
[withData]: src/withData.js
[withQuery]: src/withQuery.js
[dev server]: http://localhost:8080/
[Artist]: demo/Artist/index.js
[Name]: demo/Artist/Name.js
[Disambiguation]: demo/Artist/Disambiguation.js
