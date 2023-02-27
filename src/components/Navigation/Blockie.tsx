import makeBlockie from 'ethereum-blockies-base64'

interface Props {
	address: string
}

export default function Blockie({ address }: Props) {
	return (
		<div style={{ height: '40px' }}>
			<img style={{ height: '100%', borderRadius: '5px' }} src={makeBlockie(address)} />
		</div>
	)
}
