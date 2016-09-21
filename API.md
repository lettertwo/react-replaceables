# API

All members of this API are exported at the top level, as well as individually, from their own modules, i.e.,

```javascript
import {replaceable} from 'react-replaceables';
```

Or:

```javascript
import replaceable from 'react-replaceables/replaceable';
```

## classes

### `Replacement`

```jsx
<Replacement {...props} />
```

A Component that provides its props in context for injection into `replaceble` descendants.

All of the props given to a `Replacement` Component are expected to be names of `replaceable` Components mapped to their replacements.

Descendants will find the injected components on `this.context.replacementComponents`.

When a `Replacement` prop name matches a `replaceable` descendant name, the value of the prop will be rendered instead of the original `replaceable`.  

## factories

### `createReplacement()`

```javascript
createReplacement(displayNameOrOptions: string | object, defaultProps?: object): Replacement
```

Create a new `Replacement` Component with default props.

`createReplacement` can be called with a string `displayName`, which will become the display name of the returned Replacement Component. The `displayName` argument may also be omitted.

As with the pre-defined `Replacement` Component, all of the props are expected to be names of `replaceable` Components mapped to their replacements.

`createReplacement` is useful for defining sets of replacement Components (think themes or skins).

## higher-order components

### `replaceable()`

```javascript
replaceable(nameOrComponent?: string | Component, Component?: Component): Component | (Component: Component) => Component
```

Given a `Component` and an (optional) `name`, returns a higher-order Component that will render a different Component mapped to `name` on `this.context. replacementComponents` (typically provided by a `Replacement` ancestor with a prop `name`).

If the `name` string is omitted, the wrapped `Component` must have a name (`Component.name` or `Component.displayName`). This is so the `name` (or Component name) can be used as a prop name on a parent `Replacement` component.

There are multiple ways to call `replaceable`, and multiple return values:

- With a string `name` and a `Component`, returning a higher-order Component

  ```javascript
  replaceable('ReplaceMe', () => {});
  ```

- With a string `name`, returning a curried function that takes a Component and returns a higher-order Component

  ```javascript
  replaceable('ReplaceMe')(() => {});

  // or as a decorator
  @replaceable('ReplaceMe')
  class extends React.Component {}
  ```

- With a `Component`, returning a higher-order Component

  ```javascript
  // as a higher-order Component factory
  replaceable(function ReplaceMe() {});

  // or as a decorator
  @replaceable
  class ReplaceMe extends React.Component {}
  ```

- With no arguments, returning a curried function that takes a Component and returns a higher-order Component

  ```javascript
  replaceable()(function ReplaceMe() {});

  // or as a decorator
  @replaceable()
  class extends React.Component {}
  ```

### `bindDefaultProps()`

```javascript
bindDefaultProps(props: object): Component
```

Given a `props` object, returns a React Component that applies those props to a component provided by `context.replacedComponent`.

`bindDefaultProps` is useful for providing different sets of props to select nodes of a deeply nested Component tree. this is a close to 'classic' dependency injection injection as this library gets, though it  is probably not a very good general purpose DI solution, as Compenents must be 'opted in' to injection via a `replaceable` wrapper. It is, however, a good fit for matching themes to themeable Components.
