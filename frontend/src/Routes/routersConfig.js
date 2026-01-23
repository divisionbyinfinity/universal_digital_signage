import Home from '../pages/Home';
import UsersPage from '../pages/Users/users.js';
import Scheduler from '../pages/Scheduler/scheduler.js'
import Departments from '../pages/Department/departments.js';
import PlaylistCreate from '../pages/Playlists/newplaylistCreate.js';
import HostsPage from '../pages/Hosts/hosts.js';
import MediaLibrary from '../pages/MediaLibrary/MediaLibrary.js';
import Profile from '../pages/Users/profile.js';
import Media from '../pages/MediaLibrary/Media.js';
import PlaylistLibrary from '../pages/Playlists/PlaylistsLib.js';
import Groups from '../pages/Groups/groups.js'
import Help from '../pages/Help';
import CreateSchedule from '../pages/Scheduler/create.js'
import EditSchedule from '../pages/Scheduler/edit.js';
import ChannelsPage from '../pages/Channels/Channels.js';
import Kisok from '../pages/Playlists/Kisok.js';
import NotFound from '../components/feedback/notFound.js';
const commonRoutes = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/home',
    exact: true,
    component: Home,
  },
  {
    path: '/hosts',
    component: HostsPage,
  },
  {
    path: '/channels',
    component: ChannelsPage,
  },
  {
    path: '/groups',
    component: Groups,
  },
  {
    path: '/gallery',
    component: MediaLibrary,
    subRoutes: [
      {
        path: '/gallery/image/:imageId',
        component: Media,
      },
    ],
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/help',
    component: Help,
  },
  {
    path: '/playlist',
    component: PlaylistCreate,
    subRoutes: [
      {
        path: 'create/:id',
        component: PlaylistCreate,
      },  
      
      {
        path: 'slideedit/:id',
        component: PlaylistCreate,
      },
      {
        path:'kiosk/create',
        component: Kisok,
      },
      {
        path:'kiosk/edit/:id',
        component: Kisok,
      },
      {
        path:'kiosk/clone/:id',
        component: Kisok,
      },
      {
        path: 'viewandedit',
        component: PlaylistLibrary,
      },
      {
        path: 'edit/:Id',
        component: PlaylistCreate,
      },
      {
        path: 'clone/:cloneId',
        component: PlaylistCreate,
      },
      // Add more sub-routes as needed
    ],
  },
  {
    path: '/scheduler',
    component: Scheduler,
    subRoutes: [
      {
        path: 'create',
        component: CreateSchedule,
      },
      {
        path: 'viewandedit',
        component: Scheduler,
      },
      {
        path: 'edit/:Id',
        component: EditSchedule,
      }
    ],
  },
  // Add more top-level routes as needed
  {
    path:'/notFound',
    component:NotFound
  }
];

const adminRoutes = [
  {
    path:'/home',
    component: Home,

  },
  {
    path: '/admin/users',
    component: UsersPage,
  },
  {
    path: '/admin/departments',
    component: Departments,
  },

  // Add more top-level routes as needed
];
export { commonRoutes, adminRoutes };
