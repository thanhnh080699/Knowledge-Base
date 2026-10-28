import type { gsap as Gsap } from "gsap"
import type { ScrollTrigger as ScrollTriggerPlugin } from "gsap/ScrollTrigger"

// The same GSAP timeline runs in React and in the standalone preview.
export function mountStoryMotion(root: HTMLElement, gsap: typeof Gsap, ScrollTrigger: typeof ScrollTriggerPlugin) {
  const stage = root.querySelector<HTMLElement>("[data-story-workspace]")
  const scene = stage?.querySelector<HTMLElement>(".story-workspace-sticky")
  if (!stage || !scene) return () => {}
  const canvas = stage.querySelector<HTMLElement>(".workspace-canvas")
  const fitCanvas = () => {
    if (!canvas) return
    const mobile = window.matchMedia("(max-width: 699px)").matches
    const style = window.getComputedStyle(scene)
    const width = scene.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
    const height = scene.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
    canvas.style.setProperty("--workspace-fit", String(Math.max(.01, Math.min(width / (mobile ? 390 : 1400), height / (mobile ? 620 : 800)))))
  }
  fitCanvas()
  const resizeObserver = new ResizeObserver(fitCanvas)
  resizeObserver.observe(scene)
  window.addEventListener("resize", fitCanvas, { passive: true })
  gsap.registerPlugin(ScrollTrigger)
  const media = gsap.matchMedia()
  media.add({
    desktop: "(min-width: 700px)",
    mobile: "(max-width: 699px)",
    reduced: "(prefers-reduced-motion: reduce)",
  }, context => {
    const mobile = Boolean(context.conditions?.mobile)
    const reduced = Boolean(context.conditions?.reduced)
    root.dataset.storyMotion = reduced ? "paused" : "running"
    if (reduced) return
    const select = gsap.utils.selector(stage)
    const front = select(".workspace-paper-front")
    const back = select(".workspace-paper-back")
    const middle = select(".workspace-paper-middle")
    const note = select(".workspace-note")
    const editor = select(".workspace-editor")
    const utility = select(".workspace-utility")
    const ideas = select(".workspace-idea")
    gsap.set(editor, { autoAlpha: 0, y: 25 })
    gsap.set(utility, { autoAlpha: 0, x: mobile ? 60 : 170, rotation: 8 })
    gsap.set(ideas, { autoAlpha: 0, scale: .62, y: 100, rotation: -8 })
    gsap.set(select(".workspace-word-build, .workspace-word-explore"), { autoAlpha: 0, yPercent: 25 })
    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: stage, pin: scene, start: "top 64px",
        end: () => "+=" + Math.round(window.innerHeight * (mobile ? 1.05 : 1.35)),
        scrub: .65, anticipatePin: 1, invalidateOnRefresh: true,
      },
    })
    timeline
      .fromTo(front, { rotation: -6, scale: .94 }, { rotation: 0, scale: 1, duration: .45 }, 0)
      .to(back, { x: mobile ? -12 : -65, rotation: -13, duration: .55 }, 0)
      .to(middle, { x: mobile ? 12 : 65, rotation: 9, duration: .55 }, 0)
      .to(note, { autoAlpha: 0, y: -35, duration: .4 }, .5)
      .to(front, { xPercent: mobile ? -6 : -16, rotation: -2, duration: .65 }, .5)
      .to(editor, { autoAlpha: 1, y: 0, duration: .45 }, .7)
      .to(utility, { autoAlpha: 1, x: 0, rotation: 3, duration: .65 }, .65)
      .to(select(".workspace-word-learn"), { autoAlpha: 0, yPercent: -25, duration: .45 }, .5)
      .to(select(".workspace-word-build"), { autoAlpha: 1, yPercent: 0, duration: .5 }, .65)
      .to([front, back, middle, utility], { autoAlpha: 0, y: -60, scale: .82, stagger: .04, duration: .5 }, 1.6)
      .to(select(".workspace-word-build"), { autoAlpha: 0, yPercent: -25, duration: .4 }, 1.6)
      .to(select(".workspace-word-explore"), { autoAlpha: 1, yPercent: 0, duration: .5 }, 1.8)
      .to(ideas, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, stagger: .12, duration: .65 }, 1.8)
      .to(select(".workspace-idea-0"), { xPercent: mobile ? -57 : -99, rotation: mobile ? -8 : -10, duration: .75 }, 1.9)
      .to(select(".workspace-idea-1"), { y: mobile ? -15 : -30, rotation: 0, duration: .75 }, 1.9)
      .to(select(".workspace-idea-2"), { xPercent: mobile ? 57 : 99, rotation: mobile ? 8 : 10, duration: .75 }, 1.9)
      .to({}, { duration: .2 })
    const demo = root.querySelector<HTMLElement>("[data-tools-demo]")
    const toolsSelect = gsap.utils.selector(demo || root)
    const toolsTimeline = demo ? gsap.timeline({
      scrollTrigger: {
        trigger: demo,
        start: "top 85%",
        end: "bottom 35%",
        scrub: .45, invalidateOnRefresh: true,
      },
      defaults: { ease: "power2.out" },
    }) : undefined
    toolsTimeline
      ?.fromTo(demo, { y: 20 }, { y: 0, duration: .45 }, 0)
      .fromTo(toolsSelect(".story-demo-input code"), { backgroundColor: "#fffdf900" }, { backgroundColor: "#ead9bb88", duration: .35, repeat: 1, yoyo: true }, .25)
      .fromTo(toolsSelect(".tools-transfer i"), { x: -18, autoAlpha: 0 }, { x: 28, autoAlpha: 1, duration: .6, ease: "power1.inOut" }, .55)
      .to(toolsSelect(".tools-transfer i"), { autoAlpha: 0, duration: .2 }, 1.1)
      .fromTo(toolsSelect(".tools-output-line"), { opacity: 0, x: 18 }, { opacity: 1, x: 0, stagger: .09, duration: .35 }, .85)
      .fromTo(toolsSelect(".tools-scan"), { top: "0%", opacity: 0 }, { top: "100%", opacity: .45, duration: 1.05, ease: "none" }, .9)
      .to(toolsSelect(".tools-scan"), { opacity: 0, duration: .2 }, 1.95)
      .fromTo(toolsSelect(".tools-output"), { borderColor: "#8db89b00" }, { borderColor: "#8db89b", duration: .4, repeat: 1, yoyo: true }, 1.8)
  }, stage)
  return () => {
    media.revert()
    resizeObserver.disconnect()
    window.removeEventListener("resize", fitCanvas)
    delete root.dataset.storyMotion
  }
}
