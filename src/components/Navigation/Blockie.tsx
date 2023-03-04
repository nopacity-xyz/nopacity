import makeBlockie from 'ethereum-blockies-base64'
import Image from 'next/image'

interface Props {
  address: string
}

export default function Blockie({ address }: Props) {
  return (
    <div style={{ height: '40px' }}>
      <Image
        style={{ height: '100%', borderRadius: '5px' }}
        src={makeBlockie(address)}
        alt="Profile Icon"
      />
    </div>
  )
}
