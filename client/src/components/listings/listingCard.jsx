/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { FaClock, FaLocationDot, FaMapLocation, FaMapPin, FaPhone, FaWhatsapp } from 'react-icons/fa6'
import {url} from '../../utils/serverUrl'
import { Link, Form, useFetcher } from 'react-router-dom'
export default function ListingCard({ listing, user }) {
  const fetcher = useFetcher() 
  //console.log(listing);
    return (
      <div className="card max-w-96 bg-base-100 shadow-xl m-5 intersect:motion-preset-slide-up motion-delay-[2s]">
        <figure>
          {' '}
          <Link to={`/listings/single/${listing._id}`}>
            <img
              src={
                url + '/' + listing.images[0] ||
                'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp'
              }
              className="max-h-96"
              alt="listing"
            />{' '}
          </Link>
        </figure>

        <div className="card-body">
          <div className="flex flex-row justify-between w-full">
            <h2 className="card-title text-xl">{listing.price} Franc CFA</h2>
          </div>
          <p className="text-sm m-0">
            <div className="badge badge-outline m-1"> {listing.adType}</div>
            <div className="badge badge-outline m-1">
              {' '}
              {listing.area.gross} m²
            </div>
            <div className="badge badge-outline m-1">
              {' '}
              {listing.age} years old
            </div>

            <span className="flex my-2 flex-row">
              <FaLocationDot className="h-4 m-1" />
              {listing.location.country}, {listing.location.city},
              {listing.location.district},{listing.location.street},
              {listing.location.door}
            </span>

            {listing.updatedAt.split('T')[0]}
          </p>

          <div className="card-actions my-3 justify-end">
            {user && user.isAdmin ? (
              <>
                {' '}
                <fetcher.Form
                  method="post"
                  action={`/listings/delete/${listing._id}`}
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
                  to={`/admin/listing/edit/${listing._id}`}
                >
                  Edit
                </Link>
              </>
            ) : (
              ''
            )}
            {listing.owner.phone ? (
              <>
                <a
                  href={`https://wa.me/${listing.owner.phone || 22300000000}`}
                  className="btn bg-green-600"
                >
                  <FaWhatsapp /> Message
                </a>
                <a
                  href={`tel:${listing.owner.phone || 22300000000}`}
                  className="btn btn-primary"
                >
                  <FaPhone className="h-5 w-5" /> Appeler
                </a>
              </>
            ) : (
              <a
                href={`https://wa.me/22300000000`}
                className="btn bg-green-600"
              >
                <FaWhatsapp /> Message
              </a>
            )}
          </div>
        </div>
      </div>
    )
}