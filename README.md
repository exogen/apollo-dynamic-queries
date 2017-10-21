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

## Motivation

I want the GraphQL queries being made to be dynamically defined by what
components actually get rendered in the component tree. Relay and Apollo are
designed for making static queries.

Here’s an example of what I mean:

```jsx
<Artist mbid="5b11f4ce-a62d-471e-81fc-a69a8278c7da">
  <header>
    <Artist.Name />
    <Artist.Disambiguation />
  </header>
</Artist>
```

I want the Artist component to define a base GraphQL query, but the fields
needed by child components (in this case `name` and `disambiguation`) **only
get added to the query if those components are actually rendered**. If you were
to remove the child from the code above, the field should not be requested –
without Artist needing to know about all the components from which to add
fragments ahead of time. It is completely dynamic.

## How it works

1. The [withQuery][] HOC creates a component that will make a query. In the HOC
   configuration, the component can define some `objects`. These objects will
   (1) provide fragment extension points within the query and (2) be resolved
   into values that will be passed as props to the component. The component also
   configures a query and variables. See the [Artist][] component. (Note that
   adding Name and Disambiguation onto Artist as properties is just to make
   using them easier, it doesn’t inform the HOC or query in any way.)
2. The [withData][] HOC creates a component that can receive objects from an
   ancestor query as props and optionally extend its objects with fragments.
   (Fragments don’t have to use the full GraphQL fragment syntax, they can just
   be a list of fields – they’ll just be dumbly injected into the query using
   string interpolation.) When a component wrapped with `withData` is mounting,
   it uses `context` to add its fragments to the ancestor’s objects and
   subscribe to changes. That way, if the component is never rendered, the
   fragments it adds will never be part of the query! See [Name][] and
   [Disambiguation][].
3. Nested queries should work just fine as long as they choose different object
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
