"use client"

import { useCallback, useRef } from "react"

type Sting = 'hit' | 'critical' | 'victory' | 'defeat'

function getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    try {
        return new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch {
        return null
    }
}

function playTone(
    ctx: AudioContext,
    frequency: number,
    duration: number,
    startTime: number,
    type: OscillatorType = 'sine',
    gainPeak = 0.4
) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, startTime)
    gain.gain.setValueAtTime(gainPeak, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.start(startTime)
    osc.stop(startTime + duration)
}

function playHit(ctx: AudioContext) {
    playTone(ctx, 440, 0.1, ctx.currentTime, 'square', 0.3)
}

function playCritical(ctx: AudioContext) {
    const t = ctx.currentTime
    playTone(ctx, 880, 0.12, t, 'square', 0.35)
    playTone(ctx, 1100, 0.1, t + 0.08, 'square', 0.25)
}

function playVictory(ctx: AudioContext) {
    const freqs = [523, 659, 784]
    freqs.forEach((f, i) => {
        playTone(ctx, f, 0.18, ctx.currentTime + i * 0.14, 'sine', 0.35)
    })
}

function playDefeat(ctx: AudioContext) {
    const freqs = [400, 300, 200]
    freqs.forEach((f, i) => {
        playTone(ctx, f, 0.22, ctx.currentTime + i * 0.18, 'sawtooth', 0.3)
    })
}

export function useSoundStings() {
    // Lazily create (and reuse) an AudioContext across calls
    const ctxRef = useRef<AudioContext | null>(null)

    const getCtx = useCallback((): AudioContext | null => {
        if (!ctxRef.current) {
            ctxRef.current = getAudioContext()
        }
        if (ctxRef.current?.state === 'suspended') {
            ctxRef.current.resume().catch(() => { })
        }
        return ctxRef.current
    }, [])

    const play = useCallback((sting: Sting) => {
        const ctx = getCtx()
        if (!ctx) return

        // Mobile vibration on criticals
        if (sting === 'critical' && navigator.vibrate) {
            navigator.vibrate([60, 30, 60])
        }

        switch (sting) {
            case 'hit': playHit(ctx); break
            case 'critical': playCritical(ctx); break
            case 'victory': playVictory(ctx); break
            case 'defeat': playDefeat(ctx); break
        }
    }, [getCtx])

    return { play }
}
