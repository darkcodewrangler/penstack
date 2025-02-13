import AuthorPage from "@/src/app/components/pages/AuthorPage";

export default function MainAuthorPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  //   const { data: userPosts, isLoading: isUserPostsLoading } = useUserPosts(
  //     username
  //   );

  return (
    <>
      <AuthorPage username={username} />
    </>
  );
}
