# React HTML Elements

This codebase is designed to demonstrate how React can be incorporated into an
outdated framework like AngularJS. It's a great way to gradually migrate an
application because new features can be created in React and whenever updates to
existing logic are required, legacy components can be replaced with React ones.
This is preferable to a full scale rewrite for applications where doing so would
be time consuming and likely to cause regressions.

While this example is within an AngularJS application, the Vite TypeScript React
code creates HTML elements which could be interpolated into most any ecosystem.
There are a few parts of it which are customized for AngularJS but they could be
adjusted quite easily to match the syntax of any legacy application's stack.

This repo is a clone of an application which takes the developer through the
process of building a web application using AngularJS. The full tutorial can be
found at https://docs.angularjs.org/tutorial.

## Commit Breakdown

1. [git clone https://github.com/angular/angular-phonecat.git](https://github.com/maxmonis/react-html-elements/commit/eb58fc65278bcdac17e74cb91ecb6b343ca00d4c)

- create a local copy of the AngularJS codebase (you can skip this step if you
  already have an app which you want to modify)

2. [Update lockfile by starting app](https://github.com/maxmonis/react-html-elements/commit/c439f1457be25df6ba9013386c46dbd340af827f)

- start the app locally, thereby automatically updating the lockfile (again, you
  may be able to skip this step)

3. [npm create vite@latest react-app -- --template react-ts](https://github.com/maxmonis/react-html-elements/commit/6ce24b25d8c77c2f80f2dfc70251de7f8807e717)

- create a new React app in the root directory (as with step 1, the name of this
  commit is the CLI command)

4. [Install react dependencies, remove unnecessary files](https://github.com/maxmonis/react-html-elements/commit/f36ecf1e8897b97aa92552c2b4886b753ba28b3f)

- cd into the new React app and install dependencies, generating a new
  `package-lock.json`
- remove several files which are not needed for this example

5. [Begin work on interop logic](https://github.com/maxmonis/react-html-elements/commit/befa9e5e2617dabf54a23e8e6b4d95475260f1bb)

- update the root `index.html` to include a link to the React app's compiled CSS
  and a script to load its compiled JS
- update the root `package.json` to run a new script which compiles and stores
  the React app's output in the gitignored `lib` directory any time the app is
  started in either development or production
- update `react-app/vite.config.js` to ensure the outputted JS and CSS are not
  hashed
- add `react-app/interop/ReactElement.ts` to define custom HTML elements which
  can be used to render React components within the AngularJS app
- add `react-app/interop/defineElements.ts` to create custom HTML elements
  during the build process and register them for use within the AngularJS app
- update `react-app/main.tsx` to define the custom HTML elements whenever the
  AngularJS app is bootstrapped in either development or production

6. [Create InternalLink component](https://github.com/maxmonis/react-html-elements/commit/2cb7102f50484aa90f9111cdfc4441b8cb23134f)

- create a simple React component called `InternalLink.tsx`
- add the new component to an existing AngularJS page

By completing steps 5 and 6 we've achieved the basic ability to embed React
components within an AngularJS application. We can also cd into the React app
and start it alone in development while creating/updating components. However,
we have no way of passing data between the two apps.

7. [Allow passing props from angular to react](https://github.com/maxmonis/react-html-elements/commit/52d3e1b9d97655484606c586883fcddbbb799f8d)

- update the interop files to allow passing props from AngularJS to React (they
  start as stringified kebab-case HTML attributes within AngularJS templates and
  are parsed to camelCase props before being passed to React components)

8. [Add props to InternalLink](https://github.com/maxmonis/react-html-elements/commit/260101c3426cb11d4eebd061eab1d48173d131a0)

- add optional props to the internal link component

We now can pass data from AngularJS to React. However, if we're passing in a
dynamic value using AngularJS's `{{}}` syntax, the initial digest cycle will
pass in the variable name instead of the value. We need to prevent React from
rendering until the digest cycle is complete and the value is available.

9. [Add dynamic prop logic](https://github.com/maxmonis/react-html-elements/commit/d192bc5099be07f7f48088d73684713328a4a1ee)

- update ReactElement to prevent rendering until the digest cycle is complete,
  and to re-render the component if the element's attributes change (using
  MutationObserver)

10. [Create PokemonPage component](https://github.com/maxmonis/react-html-elements/commit/63d030d81f11544f6e98f918b4ef3e93bb4bcd7c)

- create a new React component called `PokemonPage.tsx` which will be used to
  display a random Pokemon loaded by AngularJS and passed in as a prop, at which
  time the React app will also make an API request to fetch another random
  Pokemon (we can observe the network to ensure that only the correct two
  requests are made - if not for the `hasPendingDigestCycle` logic we added in
  step 9 the React app would have made its request twice, once for the AngularJS
  digest cycle where the stringified variable name was passed in, and once for
  the cycle where the actual value was passed in)
- update the root `app.config.js` to include the new page

We've now solved the dynamic data problem, but we have no way of sending data
from React to AngularJS.

11. [Add event emitting logic](https://github.com/maxmonis/react-html-elements/commit/8165a8bc97765575195f62d7c054cab74d5bf1a4)

- update the pokemon route's controller to include a new event listener which
  reloads the page when a specific custom event is fired
- update our React pokemon page to include a button which emits this event when
  clicked

We're now able to embed React components within an AngularJS app and pass data
back and forth as needed. Interoperability between the two frameworks has been
achieved!

12. [Add styles to page](https://github.com/maxmonis/react-html-elements/commit/3b32ebf855a5bad71ba78fb2c13080d6f15c470d)

- add a CSS module to style the pokemon page

## Next Steps

I highly recommend incorporating `@tanstack/react-query` into your React app, as
it will make the process of fetching and caching data much easier. Just make
sure that all your hooks import and use the same query client instance.

Be aware that the AngularJS app's global styles will be applied to the embedded
React app (and vice versa). If you'd like to prevent this, you can attach a
shadow DOM to your embedded React app or use a scoped approach like CSS Modules
(which I used in step 12) or Sass Partials.

## Summary

This example embeds React components within an AngularJS app, but ultimately the
React app can be embedded anywhere HTML is supported (though you may need to
tweak it a bit). Similarly, you may need to make modifications to the AngularJS
code to match your exact use case (for example, if you're using a tool like
Gulp).

I hope this example is helpful. My motivation in creating it was to help
developers faced with the daunting task I tackled professionally in 2021 -
modernizing an AngularJS app. You can find an accompanying article at
[https://maxmonis.com/blog/react-html-elements/](https://maxmonis.com/blog/react-html-elements/),
along with other technical writing which you may find useful.
