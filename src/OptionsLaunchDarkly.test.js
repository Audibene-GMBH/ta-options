import theOptions from './OptionsLaunchDarkly'

const wait = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

describe('OptionsLaunchDarkly', () => {
  test('allFlags', async () => {
    await wait(500)
    if (!theOptions.allFlags) await wait(1000)
    expect(theOptions.allFlags).toBeDefined()
    expect(theOptions.allFlags).not.toEqual({})
  })
})
