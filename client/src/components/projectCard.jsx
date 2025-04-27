/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  FaClock,
  FaLocationDot,
  FaMapLocation,
  FaMapPin,
  FaPhone,
  FaWhatsapp,
} from 'react-icons/fa6'
import { url } from '../utils/serverUrl'
import { Link, Form, useFetcher } from 'react-router-dom'
export default function ProjectCard({ listing, user }) {
  const fetcher = useFetcher()
  const project = listing
  //console.log(listing);
  return (
    <div className="card max-w-96 bg-base-100 shadow-xl m-5 intersect:motion-preset-slide-up motion-delay-[2s]">
      <figure>
        {' '}
        <Link to={`/project/single/${project._id}`}>
          <img
            src={
              url + '/' + project.images[0] ||
              'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp'
            }
            className="max-h-96"
            alt="listing"
          />{' '}
        </Link>
      </figure>

      <div className="card-body">
        <div className="flex flex-row justify-between w-full">
          <h2 className="card-title text-xl">{project.area} m²</h2>
        </div>
        <p className="text-sm m-0">
          <span className="flex my-2 flex-row">
            <FaLocationDot className="h-4 m-1" />
            {project.location.country}, {project.location.city},
            {project.location.district},{project.location.street},
            {project.location.door}
          </span>

          {project.updatedAt ? project.updatedAt.split('T')[0] : '2024-01-02'}
        </p>

        <div className="card-actions my-3 justify-end">
          {user && user.isAdmin ? (
            <>
              {' '}
              <fetcher.Form
                method="post"
                action={`/admin/projects/delete/${project._id}`}
              >
                <button className="btn bg-red-500">
                  {' '}
                  {fetcher.state === 'idle' ? (
                    'Delete'
                  ) : (
                    <span className="loading loading-spinner loading-md"></span>
                  )}{' '}
                </button>
              </fetcher.Form>
              <Link
                className="btn btn-warning"
                to={`/admin/projects/edit/${project._id}`}
              >
                Edit
              </Link>
            </>
          ) : (
            ''
          )}
          {project.owner.phone ? (
            <>
              <a
                href={`https://wa.me/${project.owner.phone || 22300000000}`}
                className="btn bg-green-600"
              >
                <FaWhatsapp /> Message
              </a>
              <a
                href={`tel:${project.owner.phone || 22300000000}`}
                className="btn btn-primary"
              >
                <FaPhone className="h-5 w-5" /> Appeler
              </a>
            </>
          ) : (
            <a href={`https://wa.me/22300000000`} className="btn bg-green-600">
              <FaWhatsapp /> Message
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
