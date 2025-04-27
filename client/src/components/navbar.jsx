/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FaBars, FaCircleInfo, FaRegBell } from "react-icons/fa6";
import { Link, NavLink,Form } from "react-router-dom";
import { url } from "../utils/serverUrl";
import { io } from 'socket.io-client'

const socket = io(url)

export default function Navbar({ user }) {
  // check for browser support
  const [pushFeature, setPushFeature] = useState(true)
  const [notifications, setNotifications] = useState([])
  // Array removing dupplicate elements from notifications array
  const sorted = Array.from(
   new Set(notifications.map((e) => JSON.stringify(e)))
 ).map((e) => JSON.parse(e))
  useEffect(() => {
    socket.on("new notification", (notification) => {
      setNotifications((prev) => [notification, ...prev])
    })
    if (!('serviceWorker' in navigator)) {
      setPushFeature(false)
      // Service Worker isn't supported on this browser, disable or hide UI.
      return
    }

    if (!('PushManager' in window)) {
      setPushFeature(false)
      // Push isn't supported on this browser, disable or hide UI.
      return
    }

    
  }, [socket])


  // Notification functions 

  // VAPID Converter
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  //ask for permission
  const  askPermission = async () => {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result)
      })

      if (permissionResult) {
        permissionResult.then(resolve, reject)
      }
    }).then(async function (permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error("We weren't granted permission.")
      } else {
        const registration = await subscribeUserToPush()
        // send the path to the user
        try {
          const req = await fetch(url + `/users/notifUrl/${user._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({notifUrl: registration }),
            credentials: 'include',
            mode:'cors'
          })
          const response = await req.json()
          if (response.msg) console.log(response.msg)
          return
        } catch (error) {
          console.log(error.message);
        }
      }
    })
  }

  // register a service worker
  const subscribeUserToPush = async () => {
    return navigator.serviceWorker
      .register('./service-worker.js')
      .then(function (registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BLuwbJ_AHHFO9Tkvy2S4ArxPDhGBvj_1MPnwEKBocyk8FusiCVtVnxBdAChf5ogcYQ99G8MQQzSKY66JP7o6VUk'
          ),
        }
        if(registration.installing) {
        console.log('Service worker installing');
    } else if(registration.waiting) {
          console.log('Service worker installed');
        }
        if (registration.active) {
           return registration.pushManager.subscribe(subscribeOptions)
        }

       
      })
      .then(function (pushSubscription) {
        console.log(
          'Received PushSubscription: ',
          JSON.stringify(pushSubscription)
        )
        return pushSubscription
      })
  }
  
    return (
      <>
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown z-50">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <FaBars className="w-5 h-5" />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive
                        ? ' bg-primary text-base-100'
                        : isPending
                        ? ' bg-secondary'
                        : ''
                    }
                    to="/"
                  >
                    Accueil
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive
                        ? ' bg-primary text-base-100'
                        : isPending
                        ? ' bg-secondary'
                        : ''
                    }
                    to="/land"
                  >
                    Terrain
                  </NavLink>
                </li>
               
                <li>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive
                        ? ' bg-primary text-base-100'
                        : isPending
                        ? ' bg-secondary'
                        : ''
                    }
                    to="/project"
                  >
                    Projet
                  </NavLink>
                </li>
                <li>
                  {user ? (
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive
                          ? ' bg-primary text-base-100'
                          : isPending
                          ? ' bg-secondary'
                          : ''
                      }
                      to="/admin"
                    >
                      Admin
                    </NavLink>
                  ) : (
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive
                          ? ' bg-primary text-base-100'
                          : isPending
                          ? ' bg-secondary'
                          : ''
                      }
                      to="/login"
                    >
                      Se Connecter
                    </NavLink>
                  )}
                </li>

                <li>
                  <details className="z-50">
                    <summary>Espace R&C</summary>
                    <ul className="bg-base-100 rounded-t-none p-2">
                      <li>
                        <NavLink
                          className={({ isActive, isPending }) =>
                            isActive
                              ? ' bg-primary text-base-100'
                              : isPending
                              ? ' bg-secondary'
                              : ''
                          }
                          to="/listings/list/Residence"
                        >
                          Residence
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className={({ isActive, isPending }) =>
                            isActive
                              ? ' bg-primary text-base-100'
                              : isPending
                              ? ' bg-secondary'
                              : ''
                          }
                          to="/listings/list/Commercial"
                        >
                          Commercial
                        </NavLink>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
            </div>
            <NavLink to={'/'} className="btn btn-ghost text-xl">
              <img src="/logo.png" alt="Logo" width={150} />
            </NavLink>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? ' bg-primary text-base-100'
                      : isPending
                      ? ' bg-secondary'
                      : ''
                  }
                  to="/"
                >
                  Accueil
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? ' bg-primary text-base-100'
                      : isPending
                      ? ' bg-secondary'
                      : ''
                  }
                  to="/land"
                >
                  Terrain
                </NavLink>
              </li>
             
              <li>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? ' bg-primary text-base-100'
                      : isPending
                      ? ' bg-secondary'
                      : ''
                  }
                  to="/project"
                >
                  Projet
                </NavLink>
              </li>
              <li>
                {user ? (
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive
                        ? ' bg-primary text-base-100'
                        : isPending
                        ? ' bg-secondary'
                        : ''
                    }
                    to={`/admin/profile/${user._id}`}
                  >
                    Admin
                  </NavLink>
                ) : (
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive
                        ? ' bg-primary text-base-100'
                        : isPending
                        ? ' bg-secondary'
                        : ''
                    }
                    to="/login"
                  >
                    Login
                  </NavLink>
                )}
              </li>

              <li>
                <details className="z-50">
                  <summary>Espace R&C</summary>
                  <ul className="bg-base-100 rounded-t-none p-2">
                    <li>
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isActive
                            ? ' bg-primary text-base-100'
                            : isPending
                            ? ' bg-secondary'
                            : ''
                        }
                        to="/listings/list/Residence"
                      >
                        Residence
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isActive
                            ? ' bg-primary text-base-100'
                            : isPending
                            ? ' bg-secondary'
                            : ''
                        }
                        to="/listings/list/Commercial"
                      >
                        Commercial
                      </NavLink>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            {user ? (
              <>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src={
                          user.picture
                            ? url + '/' + user.picture
                            : 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                        }
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <NavLink
                        to={`/admin/profile/${user._id}`}
                        className={({ isActive, isPending }) =>
                          isActive
                            ? ' bg-primary text-base-100'
                            : isPending
                            ? ' bg-secondary'
                            : ''
                        }
                      >
                        Profil
                      </NavLink>
                    </li>

                    <li>
                      <Form method="post" action="/logout">
                        <button type="submit" className="btn btn-danger">
                          Logout
                        </button>
                      </Form>
                    </li>
                  </ul>
                </div>

                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle"
                  >
                    <div className="indicator">
                      <FaRegBell className="w-5 h-5" />
                      <span className="badge badge-sm indicator-item">
                        {sorted.length}
                      </span>
                    </div>
                  </div>
                  <div
                    tabIndex={0}
                    className="card card-compact dropdown-content bg-base-100 z-50 mt-3 w-96 shadow"
                  >
                    <div className="card-body">
                      <span className="text-lg font-bold">
                        {sorted.length} Notifications
                      </span>
                      {sorted.length > 0
                        ? sorted.map((item) => (
                            <div
                              key={item._id}
                              role="alert"
                              className="alert shadow-lg"
                            >
                              <FaCircleInfo className="text-info" />
                              <div>
                                <h3 className="font-bold"> {item.title} </h3>
                                <div className="text-xs">{item.content}</div>
                              </div>
                              <Link to={item.action} className="btn btn-sm">
                                See
                              </Link>
                            </div>
                          ))
                        : ''}
                    </div>
                    <div className="card-actions">
                      {user.notifUrl ? (
                        ''
                      ) : (
                        <button
                          onClick={askPermission}
                          className="btn btn-primary btn-block"
                          disabled={!pushFeature}
                        >
                          Enable Notifications
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </>
    )
}