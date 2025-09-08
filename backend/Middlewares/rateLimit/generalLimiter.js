import { RateLimiterMemory } from 'rate-limiter-flexible'

export const generalLimiter = new RateLimiterMemory({
    points: 100,
    duration: 15 * 60,
    blockDuration: 5 * 60
})