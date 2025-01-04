import { createRoot } from 'react-dom/client'

export class ReactElement extends HTMLElement {
  constructor(private createElement: () => JSX.Element) {
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
    createRoot(this).render(this.createElement())
  }
}
