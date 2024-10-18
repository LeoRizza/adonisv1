import { test } from '@japa/runner'

test.group('user', () => {
  test('usuarios consultados', async ({ client }) => {
    const response = await client.post("/user").json({
      title: "test title",
      body: "body",
    });

    response.assertStatus(200);

  });
});