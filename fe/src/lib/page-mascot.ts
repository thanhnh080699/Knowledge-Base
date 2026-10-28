// Adapted from page-mascot by Kamran Ahmed (MIT).
// Source and license: public/mascots/LICENSE.page-mascot.txt.
// Shared between the React page and its standalone preview.
export function mountPageMascot(button: HTMLButtonElement) {
  const direction = button.querySelector<HTMLElement>("[data-mascot-directions]")
  const reaction = button.querySelector<HTMLElement>("[data-mascot-reactions]")
  const sprite = button.querySelector<HTMLElement>("[data-mascot-sprite]")
  const root = button.closest("main")
  if (!direction || !reaction || !sprite) return () => {}
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
  const clockwise = [5, 8, 7, 6, 3, 0, 1, 2]
  let sector = -1
  let visible = true
  let pointer: { x: number; y: number } | undefined
  let timer: number | undefined
  let payoffTimer: number | undefined
  let frame = 0
  let clicks = 0
  let animation: Animation | undefined
  const reactionCell = button.dataset.mascotReactionCell
  const enabled = () => !reduced.matches && root?.dataset.storyMotion !== "paused" && !document.hidden && visible
  const cell = (layer: HTMLElement, index: number) => {
    layer.style.backgroundPosition = `${index % 3 * 50}% ${Math.floor(index / 3) * 50}%`
  }
  const reset = () => {
    cell(direction, 4)
    direction.style.opacity = "1"
    reaction.style.opacity = "0"
    sector = -1
    window.clearTimeout(timer)
    window.clearTimeout(payoffTimer)
    animation?.cancel()
  }
  const aim = () => {
    frame = 0
    if (!pointer || !fine.matches || !enabled()) return
    const box = button.getBoundingClientRect()
    const dx = pointer.x - box.left - box.width / 2
    const dy = pointer.y - box.top - box.height / 2
    if (Math.hypot(dx, dy) < 70) { cell(direction, 4); sector = -1; return }
    const angle = Math.atan2(dy, dx)
    const size = Math.PI / 4
    if (sector !== -1 && Math.abs(Math.atan2(Math.sin(angle - sector * size), Math.cos(angle - sector * size))) < size / 2 + .12) return
    sector = (Math.round(angle / size) + 8) % 8
    cell(direction, clockwise[sector])
  }
  const schedule = () => { if (!frame && enabled()) frame = window.requestAnimationFrame(aim) }
  const move = (event: PointerEvent) => { pointer = { x: event.clientX, y: event.clientY }; schedule() }
  const boop = () => {
    reset()
    if (!enabled()) return
    cell(reaction, reactionCell === undefined ? 0 : Number(reactionCell))
    direction.style.opacity = "0"
    reaction.style.opacity = "1"
    if (reactionCell === undefined) payoffTimer = window.setTimeout(() => cell(reaction, [1, 2, 8][clicks++ % 3]), 120)
    timer = window.setTimeout(reset, 600)
    animation = sprite.animate?.([
      { transform: "scale(1)" },
      { transform: "scale(1.07, .9)", offset: .2 },
      { transform: "scale(.97, 1.04)", offset: .5 },
      { transform: "scale(1)" },
    ], { duration: 420, easing: "ease-out" })
  }
  const sync = () => { if (!enabled()) reset(); else schedule() }
  const leave = () => { pointer = undefined; reset() }
  window.addEventListener("pointermove", move, { passive: true })
  window.addEventListener("scroll", schedule, { passive: true })
  document.addEventListener("pointerleave", leave)
  document.addEventListener("visibilitychange", sync)
  reduced.addEventListener("change", sync)
  fine.addEventListener("change", sync)
  button.addEventListener("click", boop)
  const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false
    sync()
  })
  observer?.observe(button)
  const motionObserver = typeof MutationObserver === "undefined" ? undefined : new MutationObserver(sync)
  if (root) motionObserver?.observe(root, { attributes: true, attributeFilter: ["data-story-motion"] })
  return () => {
    reset()
    window.cancelAnimationFrame(frame)
    observer?.disconnect()
    motionObserver?.disconnect()
    window.removeEventListener("pointermove", move)
    window.removeEventListener("scroll", schedule)
    document.removeEventListener("pointerleave", leave)
    document.removeEventListener("visibilitychange", sync)
    reduced.removeEventListener("change", sync)
    fine.removeEventListener("change", sync)
    button.removeEventListener("click", boop)
  }
}
