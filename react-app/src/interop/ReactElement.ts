import { createRoot } from 'react-dom/client'

export class ReactElement extends HTMLElement {
  private mutationObserver: MutationObserver

  constructor(
    private createElement: (props: Record<string, unknown>) => JSX.Element,
  ) {
    super()
    // Re-render the component if the element's attributes change
    this.mutationObserver = new MutationObserver(() => {
      this.unmount()
      this.render()
    })
    this.mutationObserver.observe(this, { attributes: true })
  }

  // Native HTMLElement lifecycle method which runs on init
  connectedCallback() {
    this.render()
  }

  // Native HTMLElement lifecycle method which runs on destroy
  disconnectedCallback() {
    this.unmount()
    this.mutationObserver.disconnect()
  }

  private unmount() {
    createRoot(this).unmount()
  }

  private render() {
    // Prevent render if digest cycles are pending, ensuring we
    // don't unnecessarily re-render the component (it's especially
    // important if the component will fetch data on initialization)
    if (this.hasPendingDigestCycle()) return
    createRoot(this).render(this.createElement(this.getProps()))
  }

  private hasPendingDigestCycle() {
    // If an attribute value starts with `{{` it's an expression
    // which Angular will evaluate in a subsequent digest cycle
    return [...this.attributes].some(a => a.value.startsWith('{{'))
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
