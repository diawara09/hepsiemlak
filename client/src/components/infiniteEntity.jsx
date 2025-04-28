/* eslint-disable react/prop-types */
import { useEffect, useState, useContext} from 'react'
import { useFetcher } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { userContext } from '../utils/contexts'
//import { FaPlus } from 'react-icons/fa6'
//import { url } from '../../../utils/serverUrl'
//import PostCardAdmin from '../../../components/admin/postCardAdmin'
//import AnimatedLayout from '../../animation/animatedLayout'
//import ProductCard from '../../components/productCard'

export default function InfiniteEntity({
  loaderRoute,
  fetchMoreURL,
  UnitEntity,
}) {
  const user = useContext(userContext)
  const prevLoader = sessionStorage.getItem("prevLoader")
  const fetcher = useFetcher()
  const [items, setItems] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if ((!fetcher.data && fetcher.state === 'idle')) {
      fetcher.load(loaderRoute)
    }
    if (loaderRoute !== prevLoader) {
      fetcher.load(loaderRoute)
      sessionStorage.setItem("prevLoader", loaderRoute)
    }
    
    if (fetcher.data) setItems(fetcher.data)
    cursor ? fetchMoreData() : ''
  }, [cursor, fetcher.data, loaderRoute])

  const fetchMoreData = async () => {
    try {
      const response = await fetch(
        fetchMoreURL + `cursor=${cursor || ''}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      const moreItems = await response.json()
      console.log(moreItems)
      setItems((prevItems) => [...prevItems, ...moreItems])

      moreItems.length > 0 ? setHasMore(true) : setHasMore(false)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-full">
      {items.length > 0 ? (
        <InfiniteScroll
          className="w-full"
          dataLength={items.length || 0}
          next={() => setCursor(items[items.length - 1]._id)}
          hasMore={hasMore}
          loader={<span className="loading loading-spinner loading-lg"></span>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b className="text-white">Yay! Vous avez tous vu!</b>
            </p>
          }
        >
          <div className="flex flex-col flex-wrap lg:flex-row items-center w-full justify-center lg:justify-start lg:max-w-3/4">
            {items.map((item) => (
              <UnitEntity listing={item} user={user} key={item._id} />
            ))}
          </div>
        </InfiniteScroll>
      ): (
        <span className="loading loading-spinner loading-lg"></span>
      )}
    </div>
  )
}
