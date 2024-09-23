import { Card, Typography } from "antd";
const { Text } = Typography;
const { Meta } = Card;

function CharacterCard({ character }) {
	const { name, species, status, gender, created, image } = character;
	const formattedDate = new Date(created).toLocaleDateString();

	return (
		<Card
			cover={<img alt={name} src={image} />}
		>
			<Meta
				title={name}
				description={
					<>
						<Text>Species: {species}</Text><br/>
						<Text>Status: {status}</Text><br/>
						<Text>Gender: {gender}</Text><br/>
						<Text>Created: {formattedDate}</Text><br/>
					</>
				}
			/>
		</Card>
	);
}

export default CharacterCard;