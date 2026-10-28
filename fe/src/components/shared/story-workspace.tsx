import { ArrowUpRight, BookOpen, Braces, GitFork } from "lucide-react"

export function StoryWorkspace() {
  return <div className="story-workspace-scroll" data-story-workspace>
    <div className="story-workspace-sticky">
      <div className="workspace-canvas" aria-hidden="true">
        <div className="workspace-backdrop"><span className="workspace-word workspace-word-learn">HIỂU.</span><span className="workspace-word workspace-word-build">LÀM.</span><span className="workspace-word workspace-word-explore">KHÁM PHÁ.</span></div>
        <div className="workspace-paper workspace-paper-back" />
        <div className="workspace-paper workspace-paper-middle" />
        <div className="workspace-paper workspace-paper-front">
          <div className="workspace-note"><BookOpen size={36} /><h3>Hiểu nguyên lý.<br />Tự tin thực hành.</h3><div className="workspace-rule" /><p>Mạng máy tính. Linux. Lập trình.</p><div className="workspace-note-lines"><span /><span /><span /></div><div className="workspace-note-topics"><span>CCNA</span><span>Linux</span><span>PHP</span></div></div>
          <div className="workspace-editor"><div><Braces size={32} /><h3>Kiến thức trở thành<br />điều bạn làm được.</h3></div><pre><code>{'{\n  "learn": "hiểu nguyên lý",\n  "apply": "thử cách làm",\n  "discover": "tìm ý tưởng mới"\n}'}</code></pre></div>
        </div>
        <div className="workspace-utility"><Braces size={30} /><h3>Bớt thao tác.<br />Rõ vấn đề.</h3><div className="workspace-utility-data"><span>{'{ dữ liệu }'}</span><ArrowUpRight size={26} /><span>{'{ dễ đọc }'}</span></div><p>JSON · Subnet · Cron · Text Diff</p></div>
        <div className="workspace-ideas">{[
          { title: "Một công cụ hữu ích.", body: "Giải quyết việc bạn đang làm.", tone: "green" },
          { title: "Một cách làm mới.", body: "Học từ dự án mã nguồn mở.", tone: "sand" },
          { title: "Một ý tưởng tiếp theo.", body: "Khám qua những repo nổi tiếng", tone: "purple" },
        ].map((idea, index) => <div className={`workspace-idea workspace-idea-${index} workspace-${idea.tone}`} key={idea.title}><GitFork size={32} /><h3>{idea.title}</h3><p>{idea.body}</p><ArrowUpRight size={30} /></div>)}</div>
      </div>
    </div>
  </div>
}
