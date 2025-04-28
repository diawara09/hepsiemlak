/* eslint-disable react/prop-types */

import { useFetcher, Link } from "react-router-dom";
import { url } from "../../utils/serverUrl";
import {
  FaPencil,
  FaPhone,
  FaWhatsapp,
  FaX,
  FaLocationDot,
  
  FaUser,
} from "react-icons/fa6";
export default function ListingCard2({ listing, user }) {
  const fetcher = useFetcher();
  return (
    <div className="flex bg-white max-w-96 shadow-md m-2 flex-col">
      <div className="flex relative w-full">
        <Link to={`/listings/single/${listing._id}`}>
          <img
            src={
              url + "/" + listing.images[0] ||
              "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            }
            className="w-full"
            alt="listing"
          />{" "}
        </Link>
        <div className="flex w-full justify-between absolute bottom-0 backdrop-blur-md text-white p-1">
          <h2 className="card-title text-lg">{listing.price} Franc CFA</h2>
          <div className="flex">
            {user && (user.isAdmin || user.email === listing.owner.email) ? (
              <>
                {" "}
                <fetcher.Form
                  method="post"
                  action={`/listings/delete/${listing._id}`}
                >
                  <button className="btn btn-xs bg-red-500">
                    {" "}
                    {fetcher.state === "idle" ? (
                      <FaX  />
                    ) : (
                      <span className="loading loading-spinner loading-md"></span>
                    )}{" "}
                  </button>
                </fetcher.Form>
                <Link
                  className="btn btn-xs btn-warning"
                  to={`/admin/listing/edit/${listing._id}`}
                >
                  <FaPencil  />
                </Link>
              </>
            ) : (
              ""
            )}
            {listing.owner.phone ? (
              <>
                <a
                  href={`https://wa.me/${listing.owner.phone || 22300000000}`}
                  className="btn btn-xs"
                >
                  <FaWhatsapp  />
                </a>
                <a
                  href={`tel:${listing.owner.phone || 22300000000}`}
                  className="btn btn-xs"
                >
                  <FaPhone />
                </a>
              </>
            ) : (
              <a href={`https://wa.me/22300000000`} className="btn">
                <FaWhatsapp  />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-5">
        <h2 className="card-title text-lg">{listing.title}</h2>
        <span className="flex my-2 flex-row">
          <FaLocationDot className="h-4 m-1" />
          {listing.location.country}, {listing.location.city},
          {listing.location.district}; {listing.area.gross} m²
        </span>
        <span className="uppercase"> {listing.adType} </span>
        <hr className="w-full my-2"/>
        <div className="flex justify-between items-center">
        <span className="flex my-2 flex-row">
            <FaUser/> {listing.owner.name}
        </span>
        <span>{listing.updatedAt.split('T')[0]}</span>
        </div>
       

      </div>
    </div>
  );
}
