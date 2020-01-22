//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { IFolderPermission } from '@/state/folder/types'

import { updateFolderPermission } from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesPermissionsPermissionRoles = ({
  activeRole,
  folderPermissionId
}: IFoldersPropertiesPermissionsPermissionRoles) => {  

  // Refs
  const container = useRef(null)

  // Redux
  const dispatch = useDispatch()

  // State
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  // Effects
  useEffect(() => {
    if(isDropdownVisible) {
      addEventListener('mousedown', closeDropdownOnClickOutside)
    }
    else {
      removeEventListener('mousedown', closeDropdownOnClickOutside)
    }
    return () => removeEventListener('mousedown', closeDropdownOnClickOutside)
  })

  // Close Dropdown On Click Outside
  const closeDropdownOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  // Roles
  const roles = {
    OWNER: "Owner",
    ADMINISTRATOR: "Administrator",
    USER: "User"
  }

  return (
    <Container
      ref={container}
      isDropdownVisible={isDropdownVisible}>
      <CurrentRole
        onClick={() => setIsDropdownVisible(true)}>
        {roles[activeRole]}
      </CurrentRole>
      <Dropdown
        isDropdownVisible={isDropdownVisible}>
        {Object.keys(roles).map((role: IFolderPermission['role']) => (
          <Role
            key={role}
            isActive={role === activeRole}
            onClick={() => {
              dispatch(updateFolderPermission(folderPermissionId, { role: role }))
              setIsDropdownVisible(false)
            }}>
            {roles[role]}
          </Role>
        ))}
      </Dropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersPropertiesPermissionsPermissionRoles {
  activeRole: IFolderPermission['role']
  folderPermissionId: IFolderPermission['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  z-index: ${ ({ isDropdownVisible }: IContainer ) => isDropdownVisible ? '1' : '0' };
`
interface IContainer {
  isDropdownVisible: boolean
}

const CurrentRole = styled.div`
  cursor: pointer;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  &:hover {
    background-color: rgb(240, 240, 240);
  }
`

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: IDropdown ) => isDropdownVisible ? 'block' : 'none' };
  position: absolute;
  right: 0;
  background-color: white;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
`
interface IDropdown {
  isDropdownVisible: boolean
}

const Role = styled.div`
  cursor: default;
  width: 100%;
  padding: 0.2rem 0.375rem;
  background-color: ${ ({ isActive }: IRole ) => isActive ? 'rgb(240, 240, 240)' : 'transparent'};
  &:hover {
    background-color: rgb(240, 240, 240);
  }
`
interface IRole {
  isActive: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersPropertiesPermissionsPermissionRoles
