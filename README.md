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

Relay and Apollo are designed for making static queries. I do not want that. I
want the GraphQL queries being made to be dynamically defined by what components
actually get rendered in the component tree. 

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

1. The [withQuery][] HOC creates a component that will make a query. When
   configuring the HOC, the component can define some `objects` – these are the
   values that descendant components are allowed to extend (via fragments) and
   receive (via props). If the query is like a template, then its “objects” are
   the template blocks that can be filled in by descendants. The component also
   configures a `query` and `variables`. See the [Artist][] component. (Note that
   adding Name and Disambiguation onto Artist as properties is just to make using
   them easier, it doesn’t inform the HOC or query in any way.)
2. The [withData][] HOC creates a component that can receive objects from one or
   more ancestor queries in its `data` prop, and optionally extend them with
   fragments. (Fragments don’t have to use the full GraphQL fragment syntax,
   they can just be a list of fields – they’ll just be dumbly injected into the
   query using string interpolation.) When a component wrapped with `withData`
   is mounting, it uses `context` to add its fragments to the ancestor’s objects
   and subscribe to changes. That way, if the component is never rendered, its
   fragments will never be part of the query! See [Name][] and [Disambiguation][].
3. Nested queries should work just fine – components wrapped with `withData`
   should be able to access objects from multiple different ancestor queries. If
   a nested query defines any objects of the same name, they will just mask
   the ancestor’s object within that component subtree.
4. No intelligent merging or conflict resolution is done on the added fragments
   at the moment. That is on the to-do list.

[DynamicQueryProvider]: src/DynamicQueryProvider.js
[withData]: src/withData.js
[withQuery]: src/withQuery.js
[dev server]: http://localhost:8080/
[Artist]: demo/Artist/index.js
[Name]: demo/Artist/Name.js
[Disambiguation]: demo/Artist/Disambiguation.js
