// import { auth } from "@/auth";
// import { Text, Avatar, Group, Title, Box, Card } from "@mantine/core";

// export default async function UserInfo() {
//   const session = await auth();

//   return (
//     <Box maw={600} mx="auto" p="md">
//       <Title align="center" mb="md">
//         NextAuth v5 + Next 15
//       </Title>
//       <Card shadow="sm" padding="lg" radius="md" withBorder>
//         <Group position="center" spacing="sm">
//           {session?.user?.image && (
//             <Avatar
//               src={session.user.image}
//               alt={session.user.name ?? "Avatar"}
//               radius="xl"
//               size="lg"
//             />
//           )}
//           <div>
//             <Text size="lg" fw={500}>
//               User signed in with name: {session?.user?.name}
//             </Text>
//             <Text size="sm" c="dimmed">
//               User signed in with email: {session?.user?.email}
//             </Text>
//           </div>
//         </Group>
//       </Card>
//     </Box>
//   );
// }