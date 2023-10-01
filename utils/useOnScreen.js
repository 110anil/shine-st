import {useEffect, useMemo} from "react";

const observerMap = new WeakMap()
export const createObserver = (options) => {
    const old = observerMap.get(options)
    if (old) {
        return old
    }
    const elements = new WeakMap()
    const callback = (entries) => {
        entries.forEach(entry => {
            const cb = elements.get(entry.target)
            if (cb) {
                cb(entry)
            }
        })
    }
    let observer = new IntersectionObserver(callback, options)
    const observe = (element, cb) => {
        elements.set(element, cb)
        observer.observe(element)
    }
    const unobserve = (element) => {
        elements.delete(element)
        observer.unobserve(element)
    }
    const obj = {observe, unobserve}
    observerMap.set(options, obj)
    return obj
}

export const useOnScreen = (ref, options, cb) => {
    const {observe, unobserve} = useMemo(() => {
        if (typeof window !== 'undefined' && options) {
            return createObserver(options)
        }
        return {}
    }, [typeof options])

    useEffect(() => {
        if (ref.current) {
            observe && observe(ref.current, e => cb(e, options))
        }
        return () => ref.current && unobserve && unobserve(ref.current)
    }, [ref.current])

}

