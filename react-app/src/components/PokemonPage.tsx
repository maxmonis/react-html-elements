import { useEffect, useState } from 'react'
import { InternalLink } from './InternalLink'

export function PokemonPage({ angularPokemon }: { angularPokemon?: Pokemon }) {
  return (
    <div>
      <InternalLink text="Return Home" />
      <h1>Pokemon</h1>
      <p>
        This is a contrived example of how you can load data asynchronously in
        the Angular and React apps. Both requests include one second of
        artificial latency to make it easier to see what's going on.
      </p>
      <p>
        This first pokemon is loaded by the Angular app and passed in as a prop:
      </p>
      <p>{angularPokemon?.name ?? 'Angular request is loading...'}</p>
      <p>
        And this second one is loaded by the React app, but only after the
        Angular app has finished loading:
      </p>
      {angularPokemon ? (
        <ReactPokemon />
      ) : (
        <p>Waiting for Angular to finish loading...</p>
      )}
      <p>
        This button demonstrates how events can be sent from the React app to
        the Angular one:
      </p>
      <button
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent('pokemon-event', { detail: 'reload' }),
          )
        }}
      >
        Reload
      </button>
    </div>
  )
}

PokemonPage.tag = 'pokemon-page'

function ReactPokemon() {
  const [pokemon, setPokemon] = useState<Pokemon>()
  useEffect(() => {
    fetchPokemon().then(setPokemon)
  }, [])
  return <p>{pokemon?.name ?? 'React request is loading...'}</p>
}

async function fetchPokemon(): Promise<Pokemon> {
  await new Promise(resolve => {
    setTimeout(resolve, 1000)
  })
  return fetch(
    `https://pokeapi.co/api/v2/pokemon/${Math.ceil(Math.random() * 150)}`,
  ).then(res => res.json())
}

interface Pokemon {
  name: string
}
