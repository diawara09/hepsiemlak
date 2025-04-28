/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  FaClock,
  FaLocationDot,
  FaMapLocation,
  FaMapPin,
  FaPencil,
  FaPhone,
  FaUser,
  FaWhatsapp,
  FaX,
} from "react-icons/fa6";
import { url } from "../utils/serverUrl";
import { Link, Form, useFetcher } from "react-router-dom";
export default function ProjectCard({ listing, user }) {
  const fetcher = useFetcher();
  const project = listing;
  //console.log(listing);
  return (
    <div className="flex bg-white max-w-96 shadow-md m-2 flex-col intersect:motion-preset-slide-up motion-delay-[2s]">
      <div className="flex relative w-full">
        <Link to={`/projects/single/${listing._id}`}>
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
                  action={`/admin/projects/delete/${listing._id}`}
                >
                  <button className="btn btn-xs bg-red-500">
                    {" "}
                    {fetcher.state === "idle" ? (
                      <FaX />
                    ) : (
                      <span className="loading loading-spinner loading-md"></span>
                    )}{" "}
                  </button>
                </fetcher.Form>
                <Link
                  className="btn btn-xs btn-warning"
                  to={`/admin/projects/edit/${listing._id}`}
                >
                  <FaPencil />
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
                  <FaWhatsapp />
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
                <FaWhatsapp />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-5">
              <h2 className="card-title text-lg">{listing.name}</h2>
              <span className="flex my-2 flex-row">
                <FaLocationDot className="h-4 m-1" />
                {listing.location.country}, {listing.location.city},
                {listing.location.district}; {listing.area.gross} m²
              </span>
              <span className="uppercase"> Projet </span>
              <hr className="w-full my-2"/>
              <div className="flex justify-between items-center">
              <span className="flex my-2 flex-row">
                  <FaUser className="mx-2"/> {listing.owner.name}
              </span>
              <span>{listing.updatedAt.split('T')[0]}</span>
              </div>
             
      
            </div>
    </div>
  );
}
