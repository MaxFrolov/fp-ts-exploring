import * as React from 'react'
// libs
import styled from 'styled-components'

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #282a36;
  border-right: 1px solid #525869;
  padding: 10px 0;
  box-shadow: 0 0 0.5rem #282a36;
`

const SidebarLink = styled.a<{ isActive: boolean }>`
  display: block;
  text-decoration: none;
  color: ${({ isActive }) => isActive ? '#ced7ef' : '#8896b9'};
  padding: 7px 20px;
  transition: 0.3s ease-in-out;
  font-size: calc(10px + 2vmin);
  
  &:hover {
    color: #a8b6d8
  }
`

const links = [
  { name: 'Function', id: '#function' },
  { name: 'Option', id: '#option' },
  { name: 'Either', id: '#either' },
  { name: 'Array', id: '#array' },
  { name: 'Task', id: '#task' },
  { name: 'TaskEither', id: '#taskEither' },
  { name: 'Eq', id: '#eq' },
  { name: 'Ord', id: '#ord' },
  { name: 'Semigroup', id: '#semigroup' },
  { name: 'Validation', id: '#validation' },
  { name: 'Functor', id: '#functor' },
  { name: 'Monad', id: '#monad' }
]

const SideBar = () => {
  const [activeLink, setStateActiveLink] = React.useState<string>('')

  const setActiveLink = () => {
    // eslint-disable-next-line no-restricted-globals
    setStateActiveLink(location.hash)
  }

  React.useEffect(() => {
    window.addEventListener("hashchange", setActiveLink, false)

    // eslint-disable-next-line no-restricted-globals
    if (Boolean(location.hash)) {
      setActiveLink()
    } else {
      window.location.hash = '#function'
    }

    return () => {
      window.removeEventListener("hashchange", setActiveLink, false)
    }
  }, [])

  const isLinkActive = (id) => activeLink === id

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
