import { promiseTimeout } from '../utils'
import { describe, expect, it, vi } from 'vitest'
import { useThrottle, createFilterWrapper, throttle } from './throttle'

describe('useThrottle', () => {
  it('should be defined', () => {
    expect(useThrottle).toBeDefined()
  })

  it('should work', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottle(callback, ms)
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    await promiseTimeout(ms + 10)
    run()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should work with trailing', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottle(callback, ms, true)
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    await promiseTimeout(ms + 10)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should work with leading', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottle(callback, ms, false, false)
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    await promiseTimeout(ms + 10)
    run()
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(2)
    await promiseTimeout(ms + 20)
    run()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should throttle', () => {
    vi.useFakeTimers()

    const throttledFilterSpy = vi.fn()
    const filter = createFilterWrapper(throttle(1000), throttledFilterSpy)
    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)

    vi.runAllTimers()

    expect(throttledFilterSpy).toHaveBeenCalledTimes(2)
  })

  it.only('should throttle evenly', () => {
    vi.useFakeTimers()
    const throttledFilterSpy = vi.fn()

    const filter = createFilterWrapper(throttle(1000), throttledFilterSpy)

    setTimeout(() => filter(1), 500) // leading 觸發
    setTimeout(() => filter(2), 1000) // trailing 觸發
    setTimeout(() => filter(3), 2000) // trailing 觸發

    vi.runAllTimers()

    expect(throttledFilterSpy).toHaveBeenCalledTimes(3)
    expect(throttledFilterSpy).toHaveBeenCalledWith(1)
    expect(throttledFilterSpy).toHaveBeenCalledWith(2)
    expect(throttledFilterSpy).toHaveBeenCalledWith(3)
  })
})
