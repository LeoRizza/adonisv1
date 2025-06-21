import { test } from '@japa/runner'

test.group('User', () => {
  test('example test', async ({ assert }) => {
    assert.isTrue(true)
  })
})