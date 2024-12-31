import { useEffect,useContext } from 'react'
import { useForm } from 'react-hook-form'
import { stepContext } from '../../../../utils/contexts'
import { useNavigate, Link, useOutletContext } from 'react-router-dom'

export default function ResidenceStep2() {
  const navigate = useNavigate()
  
  const child = useOutletContext()[0]
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

    const { step, setStep } = useContext(stepContext)
    console.log(step);

  const onSubmit = (data) => {
    sessionStorage.setItem('step-2', JSON.stringify(data))
      setStep(3)
      navigate('/admin/listing/residence/3')
  }
    useEffect(() => {
      setStep(2)
    })
    const step2 = JSON.parse(sessionStorage.getItem('step-2')) || false
    
    console.log(step2);
  console.log(watch('area')) // watch input value by passing the name of it
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col mx-auto w-80"
    >
      {/* register your input into the hook by invoking the "register" function */}

      {/* include validation with required or other standard HTML validation rules */}
      <div className="form-control m-1">
        <label className="label">
          <span className="label-text">Area(m²)*</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          defaultValue={step2 ? step2.area : ''}
          {...register('area', {
            required: true,
            pattern: /^[0-9]+\/[0-9]+$/i,
          })}
        />
        {/* errors will return when field validation fails  */}
        {errors.area && (
          <span className="text-red-600">
            This field is need to be between 30 and Infinity
          </span>
        )}
      </div>
      <div className="form-control m-1">
        <label className="label">
          <span className="label-text">Type*</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          defaultValue={step2 ? step2.adType : ''}
          {...register('adType', { required: true })}
        >
          <option value="">Chosissez...</option>
          <option value="For Rent">For Rent</option>
          <option value="For Sale">For Sale</option>
        </select>

        {/* errors will return when field validation fails  */}
        {errors.adType && (
          <span className="text-red-600">This field is required</span>
        )}
      </div>
      <div className="form-control m-1">
        <label className="label">
          <span className="label-text">Categorie*</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          defaultValue={step2 ? step2.category : ''}
          {...register('category', { required: true })}
        >
          {' '}
          {child === 'Residence' ? (
            <>
              <option value="Maison">Maison</option>
              <option value="Appartement">Appartement</option>
            </>
          ) : (
            <>
              <option value="Bureau">Bureau</option>
              <option value="Magasin">Magasin</option>
            </>
          )}
        </select>

        {/* errors will return when field validation fails  */}
        {errors.category && (
          <span className="text-red-600">This field is required</span>
        )}
      </div>
      <div className="form-control m-1">
        <label className="label">
          <span className="label-text">Price*</span>
        </label>
        <input
          type="number"
          className="input input-bordered"
          defaultValue={step2 ? step2.price : ''}
          {...register('price', { required: true, min: 2000 })}
        />
        {/* errors will return when field validation fails  */}
        {errors.price && (
          <span className="text-red-600">
            This field is need to be between 2000 and Infinity
          </span>
        )}
      </div>

      <div className="form-control mt-6 flex  flex-row justify-between">
        <Link to={'/admin/listing/residence/'} className="btn btn-primary">
          Back
        </Link>
        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </div>
    </form>
  )
}
