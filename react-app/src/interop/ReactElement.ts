import { createRoot } from 'react-dom/client'

export class ReactElement extends HTMLElement {
  constructor(
    private createElement: (props: Record<string, unknown>) => JSX.Element,
  ) {
    super()
  }

  // Native HTMLElement lifecycle method which runs on init
  connectedCallback() {
    this.render()
  }

  // Native HTMLElement lifecycle method which runs on destroy
  disconnectedCallback() {
    this.unmount()
  }

  private unmount() {
    createRoot(this).unmount()
  }

  private render() {
    createRoot(this).render(this.createElement(this.getProps()))
  }

  // Converts stringified kebab-case HTML attributes to parsed camelCase props
  private getProps() {
    return [...this.attributes].reduce<Record<string, unknown>>(
      (props, { name, value }) => {
        props[ReactElement.kebabToCamel(name)] = ReactElement.parseValue(value)
        return props
      },
      {},
    )
  }

  private static kebabToCamel(name: string) {
    return name
      .split('-')
      .map((word, i) => (i ? this.capitalize(word) : word))
      .join('')
  }

  private static parseValue(value: string): unknown {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  private static capitalize(word: string) {
    return word[0].toUpperCase() + word.slice(1)
  }
}
