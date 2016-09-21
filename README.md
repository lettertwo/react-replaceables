# Replaceables

React Components for building and applying uniform replacement of deeply nested Components.

Don't theme your components, replace them!

Check out the [API docs](API.md)!

## using replaceables, you can:

### skin your UI:

```javascript
/**
 * A boring old regular button.
 */
const Button = replaceable('Button', React.DOM.button);

/**
 * A Cool button.
 */
class CoolButton extends React.Component {
  render() {
    return <button style={{}} />;
  }
}


/**
 * A REALLY cool button.
 */
class ReallyCoolButton extends React.Component {
  render() {
    return <button style={{}} />;
  }
}


class App extends React.Component {
  state = {Skin: null}
  handleApply = () => {
    this.setState({Skin: this.select.value});
  }
  render() {
    return (
      <Replacement Button={this.state.Skin}>
        <select ref={el => this.select = el}>
          <option value={null}>(no skin)</option>
          <option value={CoolButton}>Cool</option>
          <option value={ReallyCoolButton}>Really Cool</option>
        </select>
        <Button onClick={this.handleApply}>Apply Skin</Button>
      </Replacement>
    )
  }
}

```

### or just theme it:

```javascript

@replaceable
class Button extends React.Component {
  static propTypes = {color: React.PropTypes.string};
  render() {
    return <button style={{background: this.props.color}} />;
  }
}

class App extends React.Component {
  state = {color: null}
  handleApply = () => {
    this.setState({color: this.select.value});
  }
  render() {
    return (
      <Replacement Button={bindDefaultProps({color: this.state.color})}>
        <select ref={el => this.select = el}>
          <option value={null}>(default)</option>
          <option value="red">red</option>
          <option value="blue">blue</option>
        </select>
        <Button onClick={this.handleApply}>Change Color</Button>
      </Replacement>
    )
  }
}

```

## FAQ (preemptive)

### how is this different from [other](https://github.com/azazdeaz/react-theme) [theming](https://github.com/markdalgleish/react-themeable) or [skinning](https://github.com/mindfront/react-skin) solutions for React?

### Why replace entire components? Why not just inject props (styles, etc)?

### isn't this just dependency injection?

### how is this different from other [DI](https://github.com/janjakubnanista/react-di) solutions for React?
