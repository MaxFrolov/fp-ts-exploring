import * as React from 'react'
// libs
import styled from 'styled-components'
// components
import { NavLink } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

export const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #282a36;
  border-right: 1px solid #525869;
  padding: 10px 0;
  box-shadow: 0 0 0.5rem #282a36;
  width: 135px;
  overflow-y: auto;
`

export const SidebarLinkC = styled(({ isActive, ...rest}) => <NavLink {...rest} />)`
  display: block;
  text-decoration: none;
  color: #8896b9;
  padding: 7px 20px;
  transition: 0.3s ease-in-out;
  font-size: 18px;
  
  &.active {
    color: #ced7ef;
  }

  &:hover {
    color: #a8b6d8;
  }
`

export const SidebarLinkH = styled(({ isActive, ...rest}) => <HashLink {...rest} />)<{ isActive?: boolean }>`
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

export const SidebarSubTitle = styled.span`
  display: block;
  color: #ced7ef;
  font-weight: bold;
  font-size: 16px;
  padding: 7px 10px;
`
