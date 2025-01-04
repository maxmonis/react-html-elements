import { createElement } from 'react'
import { ReactElement } from './ReactElement'
import { InternalLink } from '../components/InternalLink'

// Add components here to expose them to the Angular app,
// ensuring each includes a unique kebab-case tag
const elements: Array<React.ElementType & { tag: string }> = [InternalLink]

export function defineElements() {
  for (const element of elements)
    customElements.define(
      element.tag,
      class extends ReactElement {
        constructor() {
          super(() => createElement(element))
        }
      },
    )
}
