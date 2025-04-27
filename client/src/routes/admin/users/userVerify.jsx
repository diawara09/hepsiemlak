import { useFetcher } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { url } from '../../../utils/serverUrl'
export async function action({ params,request }) {
  const formData = await request.formData()
  const { id } = params
  const token = localStorage.getItem('token')
  const fetchHeader = token
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    : {
        'Content-Type': 'application/json',
      }
  try {
    const req = await fetch(url + `/users/verifySubmit/${id}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: fetchHeader,
      credentials: 'include',
      body: formData,
    })
    const response = await req.json()
    return response
  } catch (error) {
    return { error: error.message }
  }
}
export default function UserVerify() {
  const fetcher = useFetcher()

  useEffect(() => {
    const toastOptions = { duration: 5000 }
    fetcher.data
      ? fetcher.data.msg
        ? toast.success(fetcher.data.msg, toastOptions)
        : toast.error(fetcher.data.error, toastOptions)
      : ''
  })
  return (
    <fetcher.Form
      method="post"
      encType="multipart/form-data"
      className="flex flex-col mx-auto w-full"
    >
      <Toaster />
      <div className="form-control m-1">
        <label className="label">
          <span className="label-text">Type de Compte*</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          name="userType"
          required
        >
          <option value="Banque">Banque</option>
          <option value="Agence Immobiliere">Agence Immobiliere</option>
          <option value="Architecte">Architecte</option>
        </select>
      </div>

      <div className="form-control m-1">
        <label className="label">
          <span className="label-text">Documents*</span>
        </label>
        <input
          required
          type="file"
          className="file-input file-input-bordered"
          name="documents"
          multiple
        />
      </div>
      <div className="form-control mt-6 flex  flex-row justify-between">
        <button type="submit" className="btn btn-primary">
          {fetcher.state === 'idle' ? (
            'Creer'
          ) : (
            <span className="loading loading-spinner"></span>
          )}
        </button>
      </div>
    </fetcher.Form>
  )
}
