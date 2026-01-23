import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '../contexts/AuthContext'
import MyAvatar from './Avatar'
import './component.css'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CustomMenu({ item, subMenu, user, HandleCurrPage }) {
  const { logoutUser } = useAuth();

  const getMenuItemsClassName = (itemName) => {
    return itemName === "Logout" || itemName === "Profile" ? 'absolute right-0 z-10 mt-2 min-w-60 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none' : 'absolute left-0 z-10 mt-2 min-w-60 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none';
  };

  return (
    <Menu as="div" className="relative ml-3 hover:bg-[var(--secondary-color)] rounded-md hover:text-white">
      <div>
        <Menu.Button className="relative flex">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          {user !== undefined ?
            <div className='rounded-full bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
              {user?.profileImage?.length ?
                <img
                  className="h-12 w-12 rounded-full"
                  src={user?.profileImage}
                /> : <MyAvatar name1={user.firstName} name2={user.lastName} />}
            </div> :
            <div className={classNames('navItem',item.current?'active':'')}>
              {item?.name}
            </div>
          }
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={getMenuItemsClassName(subMenu.find(subItem => subItem.name === "Logout" || subItem.name === "Profile")?.name)}>
          {subMenu?.map(item => {
            return item.name === "Logout" ? <Menu.Item className="hover:bg-[var(--secondary-color)]"  key={item.name}>
              {({ active }) => (
                <div
                  onClick={logoutUser}
                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-900')}
                >
                  {item.name}
                </div>
              )}
            </Menu.Item> :
              <Menu.Item key={item.name} className="hover:bg-[var(--secondary-color)]">
                {({ active }) => (
                  <div
                    onClick={() => HandleCurrPage(item)}
                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-900')}
                  >
                    {item.name}
                  </div>
                )}
              </Menu.Item>
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
