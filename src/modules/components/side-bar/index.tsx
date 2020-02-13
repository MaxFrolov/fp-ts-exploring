import * as React from 'react'
// libs
import throttle from 'lodash/throttle'
import findLast from 'lodash/findLast'
import capitalize from 'lodash/capitalize'
import isNumber from 'lodash/isNumber'
// views
import { SidebarContainer, SidebarLinkH, SidebarSubTitle, SidebarLinkC } from './views'

// local variables
const OFFSET_TOP = 10

const elementIDs = [
  'function',
  'option',
  'either',
  'array',
  'task',
  'taskEither',
  'eq',
  'ord',
  'semigroup',
  'validation',
  'functor',
  'monad',
  'monoid',
  'foldable',
  'traversable',
  'apply',
  'reader',
  'record'
]

const links = elementIDs.map(i => ({
  name: capitalize(i),
  id: `#${i}`
}))

const SideBar = () => {
  // state
  const [activeLink, setStateActiveLink] = React.useState<string>('#function')

  const setActiveLink = () => {
    // eslint-disable-next-line no-restricted-globals
    setStateActiveLink(location.hash)
  }

  const setActiveLinkHash = (hash: string) => () => {
    setStateActiveLink(hash)
  }

  const handleSpy = () => {
    const elementsData = elementIDs
      .map(i => {
        const elem = document.getElementById(i)
        const position = elem && elem.offsetTop

        if (!isNumber(position)) {
          return null
        }

        return { offsetTop: position, id: elem && elem.id }
      })
      .filter(i => !!i) as { offsetTop: number; id: string; }[]

    const activeEl = findLast(elementsData, d => window.scrollY + OFFSET_TOP >= d.offsetTop)
    const activeElId = activeEl && `#${activeEl.id}`

    if (Boolean(activeEl) && Boolean(activeElId) && activeElId !== activeLink) {
      setStateActiveLink(activeElId as string)
    }
  }

  // ref
  const handleSpyRef = React.useRef(throttle(handleSpy, 3000))

  React.useEffect(() => {
    const spyFn = handleSpyRef.current

    window.addEventListener('hashchange', setActiveLink, false)
    window.addEventListener('scroll', spyFn, false)

    return () => {
      window.removeEventListener('hashchange', setActiveLink, false)
      window.removeEventListener('scroll', spyFn, false)
    }
  }, [])

  const isLinkActive = (id: string) => activeLink === id

  return (
    <SidebarContainer>
      <SidebarSubTitle>Useful links</SidebarSubTitle>
      <SidebarLinkC to='/diagrams'>
        Diagrams
      </SidebarLinkC>
      <SidebarLinkC to='/training'>
        Training
      </SidebarLinkC>
      <SidebarLinkC to='/example'>
        Example
      </SidebarLinkC>
      <SidebarSubTitle>Modules</SidebarSubTitle>
      {links.map(({ name, id }) => (
        <SidebarLinkH to={`/${id}`} onClick={setActiveLinkHash(id)} key={id} isActive={isLinkActive(id)}>
          {name}
        </SidebarLinkH>
      ))}
    </SidebarContainer>
  )
}

export { SideBar }
