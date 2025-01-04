export function InternalLink({ route = 'phones', text = 'Return Home' }) {
  return <a href={'#!/' + route}>{text}</a>
}

InternalLink.tag = 'internal-link'
