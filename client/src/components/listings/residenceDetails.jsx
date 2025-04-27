/* eslint-disable react/prop-types */
//import Gallery from "../gallery";
import { url } from "../../utils/serverUrl"
import Gallery from "../gallery"
import {

  FaPhone,
  FaWhatsapp,
} from 'react-icons/fa6'

export default function ResidenceDetails({listing}) {

    const adresse = listing.location.country + "/" + listing.location.city + "/" + listing.location.district + "/" + listing.location.street + "/" + listing.location.door
    const images = listing.images.map(item => url + "/" + item)

    const finalForm = {
      'ID': listing._id,
      'Mis a jour le': listing.updatedAt.split("T")[0],
      'Surface(Total)': listing.area.gross,
      'Categorie': listing.category,
      'Type': listing.adType,
      'Surface(Net)': listing.area.net,
      'Nombre de Chambres': listing.details.numberOfRooms.rooms,
      'Nombres de Salons': listing.details.numberOfRooms.hall,
      'Nombre de Toilets': listing.details.numberOfToilets,
      'Chauffage': listing.details.heating.heatingType,
      'Carburant': listing.details.heating.fuel,
      'Etat du Batiment': listing.details.state,
      'Etages': listing.details.floor.total + '/' + listing.details.floor.specific,
      'Fournitures': listing.details.furnishing,
    }
    const detailsTitles = Object.keys(finalForm)
    return (
      <div className="p-5 lg:p-10">
        <h1 className="text-2xl font-extrabold m-5 intersect:motion-preset-slide-up motion-delay-[1s]"> {listing.title} </h1>
        <div className="flex flex-col lg:flex-row items-center lg:items-start intersect:motion-preset-slide-up motion-delay-[3s]">
          <div className="flex flex-col lg:flex-row lg:p-5">
            <div>
              <Gallery images={images} />
              <div className="join join-vertical w-full my-5">
                <div className="collapse collapse-arrow join-item border-base-300 border">
                  <input type="radio" name="my-accordion-4" defaultChecked />
                  <div className="collapse-title text-xl font-medium">
                   Description
                  </div>
                  <div className="collapse-content">
                    <p className="text-neutral"> {listing.description} </p>
                  </div>
                </div>
               
                
              </div>
            </div>

            <ul className="flex flex-col p-3 lg:w-1/3 ">
              <li className="text-primary text-xl font-bold">
                {' '}
                {listing.price} Franc CFA
              </li>
              <li className="text-sm my-3">{adresse}</li>
              {detailsTitles.map((item) => (
                <li
                  key={Math.random() * 10e9}
                  className="flex flex-row justify-between text-sm border-t-2 p-2 border-gray-500"
                >
                  {' '}
                  <span className="font-semibold">{item}</span>{' '}
                  <span className="text-secondary"> {finalForm[item]} </span>{' '}
                </li>
              ))}
            </ul>
          </div>
          <OwnerCard owner={listing.owner} />
        </div>
      </div>
    )
}

function OwnerCard({ owner }) {
    return (
      <div className="card bg-base-100 w-96 shadow-xl intersect:motion-preset-slide-up motion-delay-[3s]">
        <figure className="px-10 pt-10">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img
                src={
                  url + '/' + owner.picture ||
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                }
              />
            </div>
          </div>
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title"> {owner.name || 'John Doe'} </h2>

          <div className="card-actions">
            {owner.phone ? (
              <>
                <a
                  href={`https://wa.me/${owner.phone || 22300000000}`}
                  className="btn bg-green-600"
                >
                  <FaWhatsapp /> Message
                </a>
                <a
                  href={`tel:${owner.phone || 22300000000}`}
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