type StudentCardProps = {
  image: string;
  name: string;
  description: string;
}
export function StudentCard({ image, name, description }: StudentCardProps) {
  return (
    <div className="w-full bg-gray-50 rounded-lg shadow-lg overflow-hidden p-8">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <img className="w-32 h-32 rounded-full mx-auto" src={image} alt="Juan Perez"/>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}