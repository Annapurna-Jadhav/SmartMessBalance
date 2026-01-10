
import { useState } from "react";
import axiosClient from "@/api/axiosClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function AnalyticsAIBox() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  

  const ask = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.post(
        "/mess-manager/analytics/ask",
        { question: q }
      );
      setAnswer(res.data.data.answer);
    } catch {
      setAnswer("AI service unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
   <CardHeader className="flex items-center justify-center">
  <CardTitle>
    <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
     <span className="text-muted-foreground">
  Analytics Assistant
</span>

      <span
        className="
          text-2xl font-bold
          bg-gradient-to-r
          from-blue-500 via-purple-500 to-pink-500
          bg-clip-text text-transparent
          tracking-wide
        "
      >
        Gemini
      </span>
    </h2>
  </CardTitle>
</CardHeader>



  
      <CardContent className="space-y-4">
   <Textarea
  placeholder="Ask Gemini about attendance, waste, revenue, planning…"
  className="
    resize-none
    placeholder:text-muted-foreground
    placeholder:font-medium
  "
  disabled={loading}
  value={q}
  onKeyDown={(e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (!loading && q.trim()) {
      ask();
    }
  }
}}

onChange={(e) => {
  setQ(e.target.value);

  if (answer) {
    setAnswer("");
  }
}}

/>


        <Button onClick={ask} disabled={loading || !q.trim()}>
          {loading ? "Thinking…" : "Ask GEMINI"}
        </Button> 
        

        {answer && (
          <div
            className="
              w-full
              border-t
              pt-6
              text-[15px]
              leading-7
              text-foreground
              text-left
            "
          >
  
            <div className="text-left">
             <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ children }) => (
      <h1 className="
        text-2xl
        font-semibold
        text-foreground
        mb-5
        tracking-tight
        text-left
      ">
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2 className="
        text-sm
        font-semibold
        uppercase
        tracking-widest
        text-muted-foreground
        mt-10
        mb-3
        text-left
      ">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="
        text-base
        font-semibold
        text-foreground
        mt-6
        mb-2
        text-left
      ">
        {children}
      </h3>
    ),

    p: ({ children }) => (
      <p className="
        mb-4
        text-[15px]
        leading-7
        text-muted-foreground
        text-left
      ">
        {children}
      </p>
    ),

    ul: ({ children }) => (
      <ul className="
        mb-6
        ml-6
        list-disc
        space-y-2
        text-left
      ">
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className="
        mb-6
        ml-6
        list-decimal
        space-y-2
        text-left
      ">
        {children}
      </ol>
    ),

    li: ({ children }) => (
      <li className="
        text-[15px]
        leading-7
        text-foreground
      ">
        {children}
      </li>
    ),

    strong: ({ children }) => (
      <strong className="
        font-semibold
        text-foreground
      ">
        {children}
      </strong>
    ),

    em: ({ children }) => (
      <em className="
        italic
        text-muted-foreground
      ">
        {children}
      </em>
    ),

    blockquote: ({ children }) => (
      <div className="
        my-6
        rounded-md
        border-l-4
        border-primary/60
        bg-primary/5
        px-4
        py-3
        text-[15px]
        leading-7
        text-foreground
      ">
        {children}
      </div>
    ),

    hr: () => (
      <hr className="my-10 border-muted" />
    ),
  }}
>
  {answer}
</ReactMarkdown>

            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
