export async function POST(request: Request) {
  const { category, slug } = await request.json();

  await fetch(
    `https://blog-server.un-defined.dev/posts/${category}/${slug}/view`,
    {
      method: "POST",
    },
  );

  return Response.json({ message: "success" });
}
