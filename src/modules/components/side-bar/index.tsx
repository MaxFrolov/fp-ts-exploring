import * as React from 'react'
// libs
import styled from 'styled-components'
import throttle from 'lodash/throttle'
import findLast from 'lodash/findLast'
import capitalize from 'lodash/capitalize'

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #282a36;
  border-right: 1px solid #525869;
  padding: 10px 0;
  box-shadow: 0 0 0.5rem #282a36;
  width: 135px;
`

const SidebarLink = styled.a<{ isActive: boolean }>`
  display: block;
  text-decoration: none;
  color: ${({ isActive }) => (isActive ? '#ced7ef' : '#8896b9')};
  padding: 7px 20px;
  transition: 0.3s ease-in-out;
  font-size: 18px;

  &:hover {
    color: #a8b6d8;
  }
`

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
  'foldable',
  'traversable',
  'apply',
  'reader'
]

const links = elementIDs.map((i) => ({
  name: capitalize(i),
  id: `#${i}`
}))

const SideBar = () => {
  // state
  const [activeLink, setStateActiveLink] = React.useState<string>('')

  const setActiveLink = () => {
    // eslint-disable-next-line no-restricted-globals
    setStateActiveLink(location.hash)
  }

  const handleSpy = () => {
    const elementsData = elementIDs.map(i => {
      const elem = document.getElementById(i)
      const position = elem!.offsetTop

      return { offsetTop: position, id: elem!.id }
    })

    const activeEl = findLast(elementsData, d => window.scrollY >= d.offsetTop)
    const activeElId = activeEl && `#${activeEl.id}`

    if (Boolean(activeEl) && activeElId !== activeLink) {
      setStateActiveLink(activeElId as string)
    }
  }

  // ref
  const handleSpyRef = React.useRef(throttle(handleSpy, 3000))

  React.useEffect(() => {
    const spyFn = handleSpyRef.current

    window.addEventListener('hashchange', setActiveLink, false)
    window.addEventListener('scroll', spyFn, false)

    // eslint-disable-next-line no-restricted-globals
    if (Boolean(location.hash)) {
      setActiveLink()
    } else {
      window.location.hash = '#function'
    }

    return () => {
      window.removeEventListener('hashchange', setActiveLink, false)
      window.removeEventListener('scroll', spyFn, false)
    }
  }, [])

  const isLinkActive = (id: string) => activeLink === id

  return (
    <SidebarContainer>
      {links.map(({ name, id }) => (
        <SidebarLink href={id} key={id} isActive={isLinkActive(id)}>
          {name}
        </SidebarLink>
      ))}
    </SidebarContainer>
  )
}

export { SideBar }
