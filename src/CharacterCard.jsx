import { Card, Typography } from "antd";
const { Text } = Typography;
const { Meta } = Card;

function CharacterCard({ character }) {
	const { name, species, status, gender, created, image } = character;
	const formattedDate = new Date(created).toLocaleDateString();

	return (
		<Card>
			<Meta
				title={name}
				description={
					<>
						<Text strong>Species: {species}</Text><br/>
						<Text strong>Status: {status}</Text><br/>
						<Text strong>Gender: {gender}</Text><br/>
						<Text strong>Created: {formattedDate}</Text><br/>
					</>
				}
			/>
		</Card>
	);
}

export default CharacterCard;