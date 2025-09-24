import { RateLimiterMemory } from 'rate-limiter-flexible'

export const authLimiter = new RateLimiterMemory({
    points: 5,
    duration: 15 * 60,
    blockDuration: 15 * 60,
})