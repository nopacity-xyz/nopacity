import NavBar from '@/components/Navigation/NavBar'

export default function Group({
  params
}: {
  params: { groupAddress: string }
}) {
  return (
    <>
      <NavBar />
      {/* <h1>{groupAddress}</h1> */}
      <h1>My Group lol</h1>
    </>
  )
}
