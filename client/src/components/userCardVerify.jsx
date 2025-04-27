/* eslint-disable react/prop-types */
import { useFetcher } from "react-router-dom"
import { url } from "../utils/serverUrl"
import toast, { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { FaCheck, FaLink, FaX } from "react-icons/fa6"
export default function UserCardVerify({ listing }) {
    const fetcher = useFetcher()
    useEffect(() => {
      const toastOptions = { duration: 5000 }
      fetcher.data
        ? fetcher.data.msg
          ? toast.success(fetcher.data.msg, toastOptions)
          : toast.error(fetcher.data.error, toastOptions)
        : ''
    })
    const user = listing
    return (
      <>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl intersect:motion-preset-slide-up motion-delay-[1s]">
          <div className="avatar">
            <div className="w-24 rounded-full mx-auto my-3">
              <img
                src={
                  user.picture
                    ? url + '/' + user.picture
                    : 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                }
              />
            </div>
          </div>
          <fetcher.Form
            method="post"
            encType="multipart/form-data"
                    className="card-body"
                    action={`/admin/verifySubmit/${user._id}`}
                >
                    <Toaster/>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                defaultValue={user.email || ''}
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input input-bordered"
                defaultValue={user.fullName || ''}
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">Phone Number</label>
              <input
                type="text"
                placeholder="+223 43 34 34 34 33"
                className="input input-bordered"
                defaultValue={user.phone || ''}
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">Documents</label>
              <ul className="menu bg-base-200 rounded-box w-56">
                {user.documents.map((item) => (
                  <li key={item}>
                    <a className="btn btn-primary" target="_blank" href={url + '/' + item}>
                      <FaLink />
                    </a>
                  </li>
                ))}
              </ul>
             
            </div>
            <div className="form-control">
              <label className="label">Message</label>
              <textarea
                name="adminMsg"
                className="textarea textarea-bordered"
                placeholder="Votre message"
              ></textarea>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">
                  <FaCheck /> Yes
                </span>
                <input
                  type="radio"
                  name="isVerified"
                  value={true}
                  className="radio checked:bg-red-500"
                  defaultChecked
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">
                  <FaX /> No
                </span>
                <input
                  type="radio"
                  value={false}
                  name="isVerified"
                  className="radio checked:bg-blue-500"
                  defaultChecked
                />
              </label>
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary">
                {fetcher.state === 'idle' ? (
                  'update'
                ) : (
                  <span className="loading loading-spinner"></span>
                )}
              </button>
            </div>
          </fetcher.Form>
        </div>
      </>
    )
    
}