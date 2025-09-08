// app/routes/summary.tsx もしくは src/pages/Summary.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { apiGet } from "../api/auth";
import Header from "~/components/Header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import GithubSlugger from "github-slugger";
import { useSearchParams } from "react-router";
import { useAuthCheck } from "~/hooks/useAuthCheck";
import { useLoading } from "~/contexts/LoadingContext";


interface SummaryResponse {
  date: string;
  markdown: string;
  created_at: string;
  tags: string[];
}

function formatDate(date?: Date): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// rehype-sanitize: 見出しの id と a の id/href/name を許可
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 || []), ["id", true]],
    h2: [...(defaultSchema.attributes?.h2 || []), ["id", true]],
    h3: [...(defaultSchema.attributes?.h3 || []), ["id", true]],
    h4: [...(defaultSchema.attributes?.h4 || []), ["id", true]],
    h5: [...(defaultSchema.attributes?.h5 || []), ["id", true]],
    h6: [...(defaultSchema.attributes?.h6 || []), ["id", true]],
    a: [
      ...(defaultSchema.attributes?.a || []),
      ["id", true],
      ["href", true],
      ["name", true],
    ],
  },
};

/**
 * 見出しの重複を除去する前処理
 * - 同じ見出しテキスト（trim後）が複数回出る場合、**最初の1回だけ**残します（H1〜H3が対象）
 * - よく重複しがちな定型見出し（要約/重要なキーワード 等）を優先的にユニーク化
 * - 空アンカー <a id="..."></a> はそのままでもOKだが、気になる場合は削除ラインを有効化
 */
function preprocessMarkdown(raw: string): string {
  const lines = raw.split(/\r?\n/);
  const seen = new Set<string>();
  const preferUnique = new Set([
    "要約",
    "重要なキーワード・ポイント",
    "重要なキーワードやポイント",
    "関連キーワード",
  ]);

  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 不可視アンカーを消したい場合は次の1行のコメントアウトを外す
    // if (/^<a\s+id="[^"]*"\s*><\/a>\s*$/.test(line)) continue;

    const m = line.match(/^(#{1,6})\s+(.*)$/);
    if (!m) {
      out.push(line);
      continue;
    }

    const level = m[1].length;
    const text = m[2].trim();

    // H1〜H3のみユニーク化（必要なら範囲を変えてOK）
    if (level <= 3) {
      const key = `${level}::${text}`;
      if (preferUnique.has(text) || seen.has(key)) {
        // すでに出ている同文見出しはスキップ
        if (preferUnique.has(text) || seen.has(key)) continue;
      }
      seen.add(key);
    }

    out.push(line);
  }

  return out.join("\n");
}

interface TocProps {
  markdown: string;
  activeId: string | null;
}

/**
 * 目次（stickyをやめて通常フロー表示）
 * - 日本語見出しOK（rehype-slug と同じ slugger）
 * - 同一slugはTOC内でも重複排除
 * - H1〜H3のみ掲載（多すぎ防止）
 */
const TableOfContents: React.FC<TocProps> = ({ markdown, activeId }) => {
  const headings = useMemo(
    () => markdown.match(/^#{1,6}\s+.*$/gm) || [],
    [markdown]
  );
  if (headings.length === 0) return null;

  const slugger = new GithubSlugger();
  slugger.reset();

  const items: { level: number; text: string; slug: string }[] = [];
  const seenSlug = new Set<string>();

  for (const h of headings) {
    const level = h.match(/^#+/)?.[0].length || 1;
    if (level > 3) continue; // H4以降は目次に出さない（可読性優先）

    const text = h.replace(/^#+\s+/, "").trim();
    const slug = slugger.slug(text);
    if (seenSlug.has(slug)) continue; // TOC内の重複回避

    seenSlug.add(slug);
    items.push({ level, text, slug });
  }

  if (items.length === 0) return null;

  return (
    <div className="bg-gray-800/70 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-bold mb-3 tracking-wide">目次</h2>
      <ul className="space-y-1">
        {items.map(({ level, text, slug }) => {
          const isActive = activeId === slug;
          return (
            <li
              key={slug}
              className="list-none"
              style={{ marginLeft: `${(level - 1) * 16}px` }}
            >
              <a
                href={`#${slug}`}
                className={[
                  "block rounded px-2 py-1 transition",
                  isActive
                    ? "bg-white/10 text-white font-semibold"
                    : "text-gray-200 hover:text-white hover:bg-white/5",
                ].join(" ")}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface SummaryProps {
  date: Date; // 親コンポーネントから渡す日付
}

export default function Summary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [date, setDate] = useState(() => {
  const dateParam = new URLSearchParams(window.location.search).get("date");
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  initialDate.setDate(initialDate.getDate());
  return initialDate;
});
	const isAuthenticated = useAuthCheck();
	const { loading, setLoading } = useLoading();
  

  // ここからは date を useState で管理して fetch に渡す
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 現在セクションハイライト用
  const [activeId, setActiveId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // スクロールに応じて h1〜h6 の id を監視
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = Array.from(
      contentRef.current.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
    ) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 画面上部近くに入った見出しをアクティブに
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visible[0]?.target) {
          const id = (visible[0].target as HTMLElement).id;
          setActiveId(id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [summary]);

  // アンカーのスムーススクロール（固定ヘッダー分補正）
  useEffect(() => {
    const handler = (e: any) => {
      const anchor = (e.target as HTMLElement).closest("a[href^='#']");
      if (!anchor) return;
      const id = decodeURIComponent(anchor.getAttribute("href")!.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [summary]);

  useEffect(() => {
    async function fetchSummary() {
      if (isAuthenticated === null) {
        setLoading(true);
      }      
      setLoading(true);
      setError(null);
      setSummary(null);
      try {
        const y = date.getFullYear();
        const m = date.getMonth() + 1; // APIが1始まりならOK
        const d = date.getDate();
        const requestPath = `/summaries/${y}/${m}/${d}`;
        const data = await apiGet<SummaryResponse>(requestPath);
        

        // 可読性のため：見出し重複の多い原文を前処理
        const cleaned = preprocessMarkdown(data.markdown);
        setSummary(cleaned);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("401")) {
            navigate("/login");
            return;
          }
          if (err.message.includes("404")) {
            // 要約なし
            console.log("No summary for this date.");
          } else {
            setError(err.message);
          }
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [date]);

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = new Date(e.target.value);
    newDate.setHours(newDate.getHours() + 9); // JST 0時に補正
    setDate(newDate);
  }

  return (
    <div className="min-h-screen bg-custom-purple text-white w-full overflow-x-hidden">
      <Header />
      <h2 className="text-white text-3xl text-center tracking-[0.4em] p-2">要約</h2>
      <hr className="border-t-2 border-white" />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* タイトルと日付選択 */}
        <div className="mb-6 md:mb-10 flex flex-col items-center gap-4">
          <input
            type="date"
            value={formatDate(date)}
            onChange={handleDateChange}
            className="bg-gray-700 text-white px-3 py-2 rounded outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {error && <p className="text-center text-red-300">エラー: {error}</p>}

        {summary && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,5fr] gap-8">
            {/* 目次（stickyを外して通常表示） */}
            <TableOfContents markdown={summary} activeId={activeId} />

            <div
              ref={contentRef}
              className="prose prose-neutral prose-lg max-w-none bg-white text-gray-900 p-5 md:p-6 rounded-xl shadow-lg leading-relaxed"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // 順序: raw→slug→sanitize
                rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeSanitize, sanitizeSchema]]}
                components={{
                  // 見出しの強調（可読性UP）
                  h1: ({ node, ...props }) => (
                    <h1
                      className="scroll-mt-24 text-3xl md:text-4xl font-extrabold text-custom-purple tracking-tight border-b-2 border-custom-purple/30 pb-2 mt-8 mb-4"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="scroll-mt-24 text-2xl md:text-3xl font-bold text-custom-purple/90 border-l-4 border-custom-purple/40 pl-3 mt-8 mb-3"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="scroll-mt-24 text-xl md:text-2xl font-semibold text-gray-800 mt-6 mb-2"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="my-3 leading-8 text-[0.95rem]" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="my-3 list-disc pl-6 space-y-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="my-3 list-decimal pl-6 space-y-2" {...props} />
                  ),
                  li: ({ node, ...props }) => <li className="leading-8" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="my-4 border-l-4 border-custom-purple/30 bg-custom-purple/5 px-4 py-3 italic rounded-r-lg"
                      {...props}
                    />
                  ),
                  code: ({ inline, className, children, ...props }: any) => {
                  if (inline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-gray-100 text-pink-700" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code
                      className="block w-full overflow-x-auto rounded-lg bg-gray-900 text-gray-100 text-sm p-4"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },

                  table: ({ node, ...props }) => (
                    <div className="my-4 overflow-x-auto">
                      <table className="min-w-full border-separate border-spacing-y-1" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="text-left bg-gray-100 px-3 py-2 font-semibold" {...props} />
                  ),
                  td: ({ node, ...props }) => <td className="px-3 py-2 align-top border-t" {...props} />,
                  a: ({ node, ...props }) => (
                    <a
                      className="text-custom-purple font-medium underline underline-offset-2 hover:opacity-80 break-words"
                      {...props}
                    />
                  ),
                  hr: ({ node, ...props }) => <hr className="my-8 border-gray-200" {...props} />,
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {!summary && !error && (
          <p className="text-center">この日の要約はありません。</p>
        )}
      </div>
    </div>
  );
}
