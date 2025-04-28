//import { useEffect } from "react"
import {  useSearchParams } from "react-router-dom"
import { url } from "../../utils/serverUrl"
//import ListingCard2 from '../../components/listings/listingCard'
//import { userContext } from '../../utils/contexts'
import InfiniteEntity from "../../components/infiniteEntity"
import ListingCard2 from "../../components/listings/listingCard2"
//import toast, {Toaster} from 'react-hot-toast'
//import listing from "../../../../server/models/listings/listing.mjs"

export default function ListingFilter() {
    const [searchParams] = useSearchParams()
     const type = searchParams.get('type')
     const adType = searchParams.get('adType')
     const country = searchParams.get('country')
    const price = searchParams.get('price')
    console.log(type);
    
    return (
      <div className="w-full">
        <InfiniteEntity
          loaderRoute={`/loaders/listingFilterLoader?type=${type}&price=${price}&adType=${adType}&country=${country}`}
          UnitEntity={ListingCard2}
          fetchMoreURL={
            url +
            `/listings/filter?type=${type}&price=${price}&adType=${adType}&country=${country}`
          }
        />
      </div>
    )
}